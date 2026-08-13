<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI;
use WP_CLI_Command;

/**
 * Manage extension release builds
 *
 * ## EXAMPLES
 *
 *     wp jankx extension release setup base-ecommerce
 *     wp jankx extension release setup              # uses current directory
 *     wp jankx extension release setup --dry-run
 *
 * @package Jankx\Foundation\Cli\Commands
 * @since 2.0.0
 */
class ExtensionReleaseCommand extends WP_CLI_Command
{
    /**
     * Setup GitHub Actions release workflow for a single extension
     *
     * Creates .github/workflows/release.yml inside the extension directory.
     * The workflow builds per-PHP-version ZIP assets using
     * `composer install --prefer-dist --no-dev`.
     *
     * ## OPTIONS
     *
     * [<slug>]
     * : Extension slug. Looks up in theme's extensions/ directory.
     * If omitted, uses the current directory as the extension.
     *
     * [--theme-path=<path>]
     * : Relative path from repo root to the theme directory.
     * Only used with <slug> argument. Auto-detected if not provided.
     *
     * [--dry-run]
     * : Show the generated workflow content without writing to disk.
     *
     * [--force]
     * : Overwrite existing workflow file.
     *
     * ## EXAMPLES
     *
     *     wp jankx extension release setup base-ecommerce
     *     wp jankx extension release setup payment-system --dry-run
     *     cd extensions/my-extension && wp jankx extension release setup
     *
     * @when after_wp_load
     */
    public function setup($args, $assoc_args)
    {
        $cwd = getcwd();
        $slug = $args[0] ?? null;

        if ($slug) {
            // Find extension by slug in theme's extensions/ directory
            $extDir = $this->findExtensionDir($slug, $assoc_args['theme-path'] ?? null);
            if (!$extDir) {
                WP_CLI::error(sprintf('Extension "%s" not found.', $slug));
                return;
            }
        } else {
            // Use current directory
            $extDir = $cwd;
            $slug = basename($extDir);
        }

        // Validate: must have composer.json
        if (!file_exists($extDir . '/composer.json')) {
            WP_CLI::error(sprintf('No composer.json found in: %s', $extDir));
            return;
        }

        // Read extension info
        $composerJson = json_decode(file_get_contents($extDir . '/composer.json'), true);
        $phpConstraint = trim($composerJson['require']['php'] ?? '');
        $vendorDir = $composerJson['config']['vendor-dir'] ?? 'vendor';

        // Build workflow
        $workflow = $this->generateWorkflow($slug, $phpConstraint, $vendorDir);

        // Target: .github/workflows/release.yml inside the extension
        $workflowDir = $extDir . '/.github/workflows';
        $workflowFile = $workflowDir . '/release.yml';

        // Dry run
        if (isset($assoc_args['dry-run'])) {
            WP_CLI::log('--- Generated Workflow ---');
            WP_CLI::log($workflow);
            WP_CLI::log('--- End Workflow ---');
            WP_CLI::log('');
            WP_CLI::log(sprintf('Extension:      %s', $slug));
            WP_CLI::log(sprintf('Directory:      %s', $extDir));
            WP_CLI::log(sprintf('PHP constraint: %s', $phpConstraint ?: '<any>'));
            WP_CLI::log(sprintf('Vendor dir:     %s', $vendorDir));
            WP_CLI::log(sprintf('Would write to: %s', $workflowFile));
            return;
        }

        // Check overwrite
        if (file_exists($workflowFile) && !isset($assoc_args['force'])) {
            WP_CLI::error(sprintf(
                "Workflow already exists: %s\nRe-run with --force to overwrite.",
                $workflowFile
            ));
            return;
        }

        // Write
        if (!is_dir($workflowDir)) {
            wp_mkdir_p($workflowDir);
        }

        file_put_contents($workflowFile, $workflow);

        WP_CLI::success(sprintf('Workflow created: %s', $workflowFile));
        WP_CLI::log('');
        WP_CLI::log(sprintf('Extension:      %s', $slug));
        WP_CLI::log(sprintf('Directory:      %s', $extDir));
        WP_CLI::log(sprintf('PHP constraint: %s', $phpConstraint ?: '<any>'));
        WP_CLI::log(sprintf('Vendor dir:     %s', $vendorDir));
        WP_CLI::log('');
        WP_CLI::log('Next steps:');
        WP_CLI::log('  1. Commit:  cd ' . $extDir . ' && git add .github/workflows/release.yml && git commit -m "ci: add release workflow"');
        WP_CLI::log('  2. Tag:     git tag v1.0.0 && git push origin v1.0.0');
    }

    /**
     * List extensions that would be included in release builds
     *
     * ## OPTIONS
     *
     * [--theme-path=<path>]
     * : Relative path from repo root to the theme directory.
     *
     * @when after_wp_load
     */
    public function list($args, $assoc_args)
    {
        $repoRoot = $this->findGitRoot();
        if (!$repoRoot) {
            WP_CLI::error('Not inside a Git repository.');
            return;
        }

        $themePath = $this->resolveThemePath($repoRoot, $assoc_args['theme-path'] ?? null);
        $fullExtDir = $repoRoot . '/' . $themePath . '/extensions';

        if (!is_dir($fullExtDir)) {
            WP_CLI::error(sprintf('Extensions directory not found: %s', $themePath . '/extensions'));
            return;
        }

        $extensions = $this->scanExtensions($fullExtDir);

        if (empty($extensions)) {
            WP_CLI::warning('No extensions with composer.json found.');
            return;
        }

        $items = [];
        foreach ($extensions as $ext) {
            $items[] = [
                'slug' => $ext['slug'],
                'php_constraint' => $ext['php_constraint'] ?: '<any>',
                'vendor_dir' => $ext['vendor_dir'],
            ];
        }

        WP_CLI\Utils\format_items('table', $items, ['slug', 'php_constraint', 'vendor_dir']);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Find extension directory by slug
     */
    private function findExtensionDir(string $slug, ?string $themePath = null): ?string
    {
        $repoRoot = $this->findGitRoot();
        if (!$repoRoot) {
            return null;
        }

        $themePath = $this->resolveThemePath($repoRoot, $themePath);
        $extDir = $repoRoot . '/' . $themePath . '/extensions/' . $slug;

        if (is_dir($extDir) && file_exists($extDir . '/composer.json')) {
            return $extDir;
        }

        return null;
    }

    /**
     * Find the git repository root directory
     */
    private function findGitRoot(): ?string
    {
        $dir = getcwd();
        while ($dir !== '/') {
            if (is_dir($dir . '/.git')) {
                return $dir;
            }
            $dir = dirname($dir);
        }
        return null;
    }

    /**
     * Resolve the theme path relative to the repo root
     */
    private function resolveThemePath(string $repoRoot, ?string $customPath): string
    {
        if ($customPath) {
            $customPath = rtrim($customPath, '/');
            if (is_dir($repoRoot . '/' . $customPath)) {
                return $customPath;
            }
            WP_CLI::warning(sprintf('Custom theme path not found: %s, auto-detecting...', $customPath));
        }

        $cwd = getcwd();

        // If CWD is inside a theme's extensions/ directory, use that theme
        $wpContent = $repoRoot . '/wp-content/themes';
        if (is_dir($wpContent)) {
            $themes = glob($wpContent . '/*/extensions', GLOB_ONLYDIR);
            foreach ($themes as $themeExtensionsDir) {
                $themeDir = dirname($themeExtensionsDir);
                if (strpos($cwd, $themeDir) === 0) {
                    return str_replace($repoRoot . '/', '', $themeDir);
                }
            }

            // Fallback: pick the theme with the most extensions
            $bestTheme = null;
            $bestCount = 0;
            foreach ($themes as $themeExtensionsDir) {
                $count = count(glob($themeExtensionsDir . '/*', GLOB_ONLYDIR));
                if ($count > $bestCount) {
                    $bestCount = $count;
                    $bestTheme = dirname($themeExtensionsDir);
                }
            }
            if ($bestTheme) {
                return str_replace($repoRoot . '/', '', $bestTheme);
            }
        }

        return 'wp-content/themes/' . basename($repoRoot);
    }

    /**
     * Scan extensions directory for composer.json files
     */
    private function scanExtensions(string $extDir): array
    {
        $extensions = [];
        $dirs = glob($extDir . '/*', GLOB_ONLYDIR);

        foreach ($dirs as $dir) {
            $composerJson = $dir . '/composer.json';
            if (!file_exists($composerJson)) {
                continue;
            }

            $data = json_decode(file_get_contents($composerJson), true);
            if (!is_array($data)) {
                continue;
            }

            $extensions[] = [
                'slug' => basename($dir),
                'php_constraint' => trim($data['require']['php'] ?? ''),
                'vendor_dir' => $data['config']['vendor-dir'] ?? 'vendor',
            ];
        }

        usort($extensions, fn($a, $b) => strcmp($a['slug'], $b['slug']));
        return $extensions;
    }

    /**
     * Generate GitHub Actions workflow YAML for a single extension
     */
    private function generateWorkflow(string $slug, string $phpConstraint, string $vendorDir): string
    {
        return <<<YAML
name: Release

on:
  release:
    types: [created]

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'

      - name: Determine PHP versions
        id: php
        run: |
          CONSTRAINT="${phpConstraint}"
          ALL="7.4 8.0 8.1 8.2 8.3 8.4 8.5"

          if [ -z "\$CONSTRAINT" ]; then
            echo "versions=\$ALL" >> \$GITHUB_OUTPUT
          else
            VERSIONS=\$(python3 -c "
          import re
          constraint = '\$CONSTRAINT'.strip()
          supported = ['7.4', '8.0', '8.1', '8.2', '8.3', '8.4', '8.5']
          m = re.match(r'[>=~^]+\\s*(\\d+\\.\\d+)', constraint)
          if m:
              min_ver = m.group(1)
              print(' '.join(v for v in supported if v >= min_ver))
          else:
              print(' '.join(supported))
          ")
            echo "versions=\$VERSIONS" >> \$GITHUB_OUTPUT
          fi

      - name: Build per-PHP assets
        env:
          GITHUB_TOKEN: \$\{{ secrets.GITHUB_TOKEN }}
        run: |
          SLUG="${slug}"
          RELEASE_TAG="\$\{{ github.event.release.tag_name }}"

          for php_ver in \$\{{ steps.php.outputs.versions }}; do
            echo "Building for PHP \$php_ver..."

            rm -rf ${vendorDir} composer.lock

            if composer install --prefer-dist --no-dev --no-interaction --no-progress 2>/dev/null; then
              zip_name="\${SLUG}.php\${php_ver}.zip"
              zip -r "/tmp/\${zip_name}" . \
                -x ".git/*" ".DS_Store" ".phpunit.result.cache" "tests/*" "node_modules/*"

              gh release upload "\$RELEASE_TAG" "/tmp/\${zip_name}" --clobber
              echo "  Uploaded: \${zip_name}"
            else
              echo "  WARN: composer install failed for PHP \$php_ver, skipping"
            fi
          done

          # Generic zip (no vendor)
          rm -rf ${vendorDir} composer.lock
          zip -r "/tmp/\${SLUG}.zip" . \
            -x ".git/*" ".DS_Store" ".phpunit.result.cache" "tests/*" "node_modules/*" "${vendorDir}/*" "libs/*"
          gh release upload "\$RELEASE_TAG" "/tmp/\${SLUG}.zip" --clobber
          echo "  Uploaded: \${SLUG}.zip (generic)"
YAML;
    }
}
