<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI;
use WP_CLI_Command;

/**
 * Manage extension release builds
 *
 * Generates GitHub Actions workflows and lists extensions for release builds.
 *
 * ## EXAMPLES
 *
 *     wp jankx extension release setup
 *     wp jankx extension release setup --dry-run
 *     wp jankx extension release list
 *
 * @package Jankx\Foundation\Cli\Commands
 * @since 2.0.0
 */
class ExtensionReleaseCommand extends WP_CLI_Command
{
    /**
     * Setup GitHub Actions release workflow for extensions
     *
     * Creates .github/workflows/release-extensions.yml at the repo root.
     * The workflow builds per-PHP-version ZIP assets for each extension
     * with composer.json, using `composer install --prefer-dist --no-dev`.
     *
     * ## OPTIONS
     *
     * [--theme-path]
     * : Relative path from repo root to the theme directory.
     * Defaults to auto-detection (child theme → parent theme).
     *
     * [--dry-run]
     * : Show the generated workflow content without writing to disk.
     *
     * [--force]
     * : Overwrite existing workflow file.
     *
     * ## EXAMPLES
     *
     *     wp jankx extension release setup
     *     wp jankx extension release setup --theme-path=wp-content/themes/nibitour
     *     wp jankx extension release setup --dry-run
     *
     * @when after_wp_load
     */
    public function setup($args, $assoc_args)
    {
        // Find git repo root
        $repoRoot = $this->findGitRoot();
        if (!$repoRoot) {
            WP_CLI::error('Not inside a Git repository. Run this command from within a Git repo.');
            return;
        }

        // Determine theme path
        $themePath = $this->resolveThemePath($repoRoot, $assoc_args['theme-path'] ?? null);

        // Detect theme slug from style.css
        $themeSlug = $this->detectThemeSlug($repoRoot . '/' . $themePath);
        if (!$themeSlug) {
            WP_CLI::error('Could not detect theme slug. Ensure style.css exists in the theme directory.');
            return;
        }

        // Find extensions directory
        $extensionsDir = $themePath . '/extensions';
        $fullExtDir = $repoRoot . '/' . $extensionsDir;

        if (!is_dir($fullExtDir)) {
            WP_CLI::error(sprintf('Extensions directory not found: %s', $extensionsDir));
            return;
        }

        // Scan for extensions with composer.json
        $extensions = $this->scanExtensions($fullExtDir);
        if (empty($extensions)) {
            WP_CLI::warning('No extensions with composer.json found. Creating workflow anyway.');
        }

        // Build workflow content
        $workflow = $this->generateWorkflow($themePath, $themeSlug, $extensions);

        // Output target path
        $workflowDir = $repoRoot . '/.github/workflows';
        $workflowFile = $workflowDir . '/release-extensions.yml';

        // Dry run mode
        if (isset($assoc_args['dry-run'])) {
            WP_CLI::log('--- Generated Workflow ---');
            WP_CLI::log($workflow);
            WP_CLI::log('--- End Workflow ---');
            WP_CLI::log('');
            WP_CLI::log(sprintf('Would write to: %s', $workflowFile));
            WP_CLI::log(sprintf('Theme path: %s', $themePath));
            WP_CLI::log(sprintf('Theme slug: %s', $themeSlug));
            WP_CLI::log(sprintf('Extensions found: %d', count($extensions)));
            foreach ($extensions as $ext) {
                WP_CLI::log(sprintf('  - %s (php: %s)', $ext['slug'], $ext['php_constraint'] ?: '<any>'));
            }
            return;
        }

        // Check if file exists and --force not set
        if (file_exists($workflowFile) && !isset($assoc_args['force'])) {
            WP_CLI::error(sprintf(
                "Workflow already exists: %s\nRe-run with --force to overwrite.",
                $workflowFile
            ));
            return;
        }

        // Create directory and write file
        if (!is_dir($workflowDir)) {
            wp_mkdir_p($workflowDir);
        }

        file_put_contents($workflowFile, $workflow);

        WP_CLI::success(sprintf('Workflow created: %s', $workflowFile));
        WP_CLI::log('');
        WP_CLI::log(sprintf('Theme path:     %s', $themePath));
        WP_CLI::log(sprintf('Theme slug:     %s', $themeSlug));
        WP_CLI::log(sprintf('Extensions:     %d found', count($extensions)));
        WP_CLI::log('');

        if (!empty($extensions)) {
            WP_CLI::log('Extensions to build:');
            foreach ($extensions as $ext) {
                $phpInfo = $ext['php_constraint'] ?: 'no constraint (all versions)';
                WP_CLI::log(sprintf('  %-30s  php: %s', $ext['slug'], $phpInfo));
            }
            WP_CLI::log('');
        }

        WP_CLI::log('Next steps:');
        WP_CLI::log('  1. Commit the workflow:  git add .github/workflows/release-extensions.yml && git commit -m "ci: add extension release workflow"');
        WP_CLI::log('  2. Create a release tag:  git tag v1.0.0 && git push origin v1.0.0');
        WP_CLI::log('  3. Or create a release on GitHub → the workflow will trigger automatically');
    }

    /**
     * List extensions that would be included in the release workflow
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
                'has_lock' => $ext['has_lock'] ? 'yes' : 'no',
            ];
        }

        WP_CLI\Utils\format_items('table', $items, ['slug', 'php_constraint', 'vendor_dir', 'has_lock']);
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

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

        // Auto-detect: look for themes with extensions/ directory
        $wpContent = $repoRoot . '/wp-content/themes';
        if (is_dir($wpContent)) {
            $themes = glob($wpContent . '/*/extensions', GLOB_ONLYDIR);
            if (!empty($themes)) {
                // Pick the first one found (child theme usually comes first)
                $themeDir = dirname($themes[0]);
                return str_replace($repoRoot . '/', '', $themeDir);
            }
        }

        // Fallback: assume current directory structure
        return 'wp-content/themes/' . basename($repoRoot);
    }

    /**
     * Detect theme slug from style.css
     */
    private function detectThemeSlug(string $themeDir): ?string
    {
        $styleCss = $themeDir . '/style.css';
        if (!file_exists($styleCss)) {
            return null;
        }

        $content = file_get_contents($styleCss, false, null, 0, 4096);
        if (preg_match('/Theme Name:\s*(.+)$/m', $content, $m)) {
            return sanitize_title(trim($m[1]));
        }

        return basename($themeDir);
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

            $slug = basename($dir);
            $phpConstraint = $data['require']['php'] ?? '';
            $vendorDir = $data['config']['vendor-dir'] ?? 'vendor';
            $hasLock = file_exists($dir . '/composer.lock');

            $extensions[] = [
                'slug' => $slug,
                'php_constraint' => trim($phpConstraint),
                'vendor_dir' => $vendorDir,
                'has_lock' => $hasLock,
            ];
        }

        // Sort by slug for consistent output
        usort($extensions, fn($a, $b) => strcmp($a['slug'], $b['slug']));

        return $extensions;
    }

    /**
     * Generate the GitHub Actions workflow YAML content
     */
    private function generateWorkflow(string $themePath, string $themeSlug, array $extensions): string
    {
        return <<<YAML
name: Build & Upload Extension Assets

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

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: {$themePath}/package-lock.json

      - name: Install npm dependencies
        working-directory: {$themePath}
        run: npm ci

      - name: Build blocks
        working-directory: {$themePath}
        run: npm run build:blocks

      - name: Detect extensions & build per-PHP assets
        working-directory: {$themePath}
        env:
          GITHUB_TOKEN: \$\{{ secrets.GITHUB_TOKEN }}
        run: |
          THEME_DIR="."
          EXTENSIONS_DIR="\$THEME_DIR/extensions"
          RELEASE_TAG="\$\{{ github.event.release.tag_name }}"
          ALL_SUPPORTED="7.4 8.0 8.1 8.2 8.3 8.4"

          UPLOAD_CMDS=""

          for ext_dir in "\$EXTENSIONS_DIR"/*/; do
            [ -f "\$ext_dir/composer.json" ] || continue
            slug=\$(basename "\$ext_dir")

            echo ""
            echo "========================================"
            echo "  Extension: \$slug"
            echo "========================================"

            # Determine PHP constraint from composer.json
            php_constraint=\$(python3 -c "
          import json, sys
          try:
              data = json.load(open('\$ext_dir/composer.json'))
              print(data.get('require', {}).get('php', ''))
          except:
              print('')
          ")

            echo "  PHP constraint: \${php_constraint:-<none>}"

            # Determine which PHP versions to build for
            if [ -z "\$php_constraint" ]; then
              php_versions=\$ALL_SUPPORTED
            else
              php_versions=\$(python3 -c "
          constraint = '\$php_constraint'.strip()
          supported = ['7.4', '8.0', '8.1', '8.2', '8.3', '8.4']

          if not constraint:
              print(' '.join(supported))
              exit(0)

          import re
          m = re.match(r'[>=~^]+\\s*(\\d+\\.\\d+)', constraint)
          if m:
              min_ver = m.group(1)
              result = [v for v in supported if v >= min_ver]
              print(' '.join(result))
          else:
              print(' '.join(supported))
          ")

              if [ -z "\$php_versions" ]; then
                echo "  No compatible PHP versions found, skipping"
                continue
              fi
            fi

            echo "  Building for PHP: \$php_versions"

            pushd "\$ext_dir" > /dev/null

            for php_ver in \$php_versions; do
              echo "  -> PHP \$php_ver"

              sudo update-alternatives --set php /usr/bin/php\${php_ver} 2>/dev/null || true

              rm -rf vendor composer.lock

              if composer install --prefer-dist --no-dev --no-interaction --no-progress 2>/dev/null; then
                zip_name="\${slug}.php\${php_ver}.zip"
                cd "$themePath"
                zip -r "/tmp/\${zip_name}" "extensions/\$slug/" \\
                  -x "extensions/\$slug/.git/*" \\
                     "extensions/\$slug/.DS_Store" \\
                     "extensions/\$slug/.phpunit.result.cache" \\
                     "extensions/\$slug/tests/*" \\
                     "extensions/\$slug/node_modules/*"
                cd "\$THEME_DIR"

                UPLOAD_CMDS="\${UPLOAD_CMDS}
          gh release upload \"\$RELEASE_TAG\" \"/tmp/\${zip_name}\" --clobber"

                echo "    Created: \${zip_name}"
              else
                echo "    WARN: composer install failed for PHP \${php_ver}, skipping"
              fi

              rm -rf vendor composer.lock
            done

            # Generic zip (no vendor) for extensions without PHP constraint
            if [ -z "\$php_constraint" ]; then
              zip_name="\${slug}.zip"
              cd "$themePath"
              zip -r "/tmp/\${zip_name}" "extensions/\$slug/" \\
                -x "extensions/\$slug/.git/*" \\
                   "extensions/\$slug/.DS_Store" \\
                   "extensions/\$slug/.phpunit.result.cache" \\
                   "extensions/\$slug/tests/*" \\
                   "extensions/\$slug/node_modules/*" \\
                   "extensions/\$slug/vendor/*" \\
                   "extensions/\$slug/libs/*"
              cd "\$THEME_DIR"

              UPLOAD_CMDS="\${UPLOAD_CMDS}
          gh release upload \"\$RELEASE_TAG\" \"/tmp/\${zip_name}\" --clobber"

              echo "  Created: \${zip_name} (generic, no vendor)"
            fi

            popd > /dev/null
          done

          if [ -n "\$UPLOAD_CMDS" ]; then
            echo ""
            echo "Uploading assets to release..."
            eval "\$UPLOAD_CMDS"
            echo "Done!"
          else
            echo "No assets to upload."
          fi
YAML;
    }
}
