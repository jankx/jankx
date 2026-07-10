<?php

namespace App\Services\TemplateBundle;

class TemplateBundleApplier
{
    protected TemplateBundleManager $manager;

    protected array $results = [];

    public function __construct(TemplateBundleManager $manager)
    {
        $this->manager = $manager;
    }

    public function apply(string $bundleId): array
    {
        $bundle = $this->manager->getBundle($bundleId);

        if (!$bundle) {
            return $this->error(sprintf(
                __('Template bundle "%s" not found.', 'jankx'),
                $bundleId
            ));
        }

        $this->results = [
            'bundle_id' => $bundleId,
            'steps' => [],
            'success' => true,
        ];

        do_action('jankx/template_bundle/before_apply', $bundleId, $bundle);

        $this->applyTemplates($bundle);
        $this->applyTemplateParts($bundle);
        $this->applyThemeOptions($bundle);
        $this->applyPageSetup($bundle);
        $this->extractPresetAssets($bundle);

        do_action('jankx/template_bundle/after_apply', $bundleId, $bundle, $this->results);

        $this->manager->setActiveBundle($bundleId);

        return $this->results;
    }

    protected function applyTemplates(TemplateBundle $bundle): void
    {
        $templates = $bundle->getTemplates();

        if (empty($templates)) {
            $this->addStepResult('templates', 'skipped', __('No templates to copy.', 'jankx'));
            return;
        }

        $sourceBase = $this->getBundleSourcePath($bundle->getId());
        $targetDir = get_stylesheet_directory() . '/templates';

        if (!is_dir($targetDir)) {
            wp_mkdir_p($targetDir);
        }

        $copied = 0;
        foreach ($templates as $filename => $sourceFile) {
            $sourcePath = $sourceBase . '/templates/' . $sourceFile;

            if (!file_exists($sourcePath)) {
                continue;
            }

            $targetPath = $targetDir . '/' . $filename;

            if (copy($sourcePath, $targetPath)) {
                $copied++;
            }
        }

        $this->addStepResult('templates', 'success', sprintf(
            __('Copied %d template file(s).', 'jankx'),
            $copied
        ));
    }

    protected function applyTemplateParts(TemplateBundle $bundle): void
    {
        $parts = $bundle->getTemplateParts();

        if (empty($parts)) {
            $this->addStepResult('template_parts', 'skipped', __('No template parts to copy.', 'jankx'));
            return;
        }

        $sourceBase = $this->getBundleSourcePath($bundle->getId());
        $targetDir = get_stylesheet_directory() . '/parts';

        if (!is_dir($targetDir)) {
            wp_mkdir_p($targetDir);
        }

        $copied = 0;
        foreach ($parts as $filename => $sourceFile) {
            $sourcePath = $sourceBase . '/parts/' . $sourceFile;

            if (!file_exists($sourcePath)) {
                continue;
            }

            $targetPath = $targetDir . '/' . $filename;

            if (copy($sourcePath, $targetPath)) {
                $copied++;
            }
        }

        $this->addStepResult('template_parts', 'success', sprintf(
            __('Copied %d template part file(s).', 'jankx'),
            $copied
        ));
    }

    protected function applyThemeOptions(TemplateBundle $bundle): void
    {
        $themeOptions = $bundle->getThemeOptions();

        if (empty($themeOptions)) {
            $this->addStepResult('theme_options', 'skipped', __('No theme options to apply.', 'jankx'));
            return;
        }

        $presetColors = $bundle->getPreset();

        if (!empty($presetColors)) {
            $themeOptions = array_replace_recursive(
                $this->presetToThemeOptions($presetColors),
                $themeOptions
            );
        }

        $existing = get_option('jankx_options', []);

        if (is_array($existing)) {
            $merged = array_replace_recursive($existing, $themeOptions);
        } else {
            $merged = $themeOptions;
        }

        update_option('jankx_options', $merged);

        do_action('jankx/options/updated');

        $this->addStepResult('theme_options', 'success', __('Theme options applied.', 'jankx'));

        $this->applyThemeJsonSettings($bundle);
    }

    protected function applyThemeJsonSettings(TemplateBundle $bundle): void
    {
        $themeJsonPath = $this->getBundleSourcePath($bundle->getId()) . '/theme.json';

        if (!file_exists($themeJsonPath)) {
            return;
        }

        $childThemeJson = get_stylesheet_directory() . '/theme.json';
        $bundleJson = json_decode(file_get_contents($themeJsonPath), true);

        if (!is_array($bundleJson)) {
            return;
        }

        if (file_exists($childThemeJson)) {
            $existing = json_decode(file_get_contents($childThemeJson), true);
            if (is_array($existing)) {
                $bundleJson = array_replace_recursive($existing, $bundleJson);
            }
        }

        file_put_contents(
            $childThemeJson,
            json_encode($bundleJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );

        $this->addStepResult('theme_json', 'success', __('theme.json settings applied.', 'jankx'));
    }

    protected function applyPageSetup(TemplateBundle $bundle): void
    {
        $pageSetup = $bundle->getPageSetup();

        if (empty($pageSetup)) {
            $this->addStepResult('page_setup', 'skipped', __('No page setup to apply.', 'jankx'));
            return;
        }

        if (!empty($pageSetup['homepage'])) {
            $page = get_page_by_path($pageSetup['homepage']);
            if ($page) {
                update_option('page_on_front', $page->ID);
                update_option('show_on_front', 'page');
            }
        }

        if (!empty($pageSetup['blog'])) {
            $page = get_page_by_path($pageSetup['blog']);
            if ($page) {
                update_option('page_for_posts', $page->ID);
            }
        }

        if (!empty($pageSetup['menu_location'])) {
            $locations = get_theme_mod('nav_menu_locations', []);
            foreach ($pageSetup['menu_location'] as $location => $menuName) {
                $menu = wp_get_nav_menu_object($menuName);
                if ($menu) {
                    $locations[$location] = $menu->term_id;
                }
            }
            set_theme_mod('nav_menu_locations', $locations);
        }

        $this->addStepResult('page_setup', 'success', __('Page setup applied.', 'jankx'));
    }

    protected function extractPresetAssets(TemplateBundle $bundle): void
    {
        $preset = $bundle->getPreset();
        if (empty($preset)) {
            return;
        }

        $sourceBase = $this->getBundleSourcePath($bundle->getId());
        $assetsDir = $sourceBase . '/assets';

        if (!is_dir($assetsDir)) {
            return;
        }

        $targetDir = get_stylesheet_directory() . '/resources/template-bundle-assets';
        if (!is_dir($targetDir)) {
            wp_mkdir_p($targetDir);
        }

        $copied = 0;
        $files = glob($assetsDir . '/**/*', GLOB_NOSORT);
        foreach ($files as $file) {
            if (is_file($file)) {
                $relative = substr($file, strlen($assetsDir) + 1);
                $target = $targetDir . '/' . $relative;
                $targetParent = dirname($target);

                if (!is_dir($targetParent)) {
                    wp_mkdir_p($targetParent);
                }

                if (copy($file, $target)) {
                    $copied++;
                }
            }
        }

        if ($copied > 0) {
            $this->addStepResult('preset_assets', 'success', sprintf(
                __('Extracted %d preset asset(s).', 'jankx'),
                $copied
            ));
        }
    }

    protected function presetToThemeOptions(array $preset): array
    {
        $options = [];

        if (!empty($preset['colors'])) {
            $colors = $preset['colors'];
            if (!empty($colors['primary'])) {
                $options['primary_color'] = $colors['primary'];
            }
            if (!empty($colors['secondary'])) {
                $options['secondary_color'] = $colors['secondary'];
            }
            if (!empty($colors['link'])) {
                $options['link_color'] = $colors['link'];
            }
            if (!empty($colors['link_hover'])) {
                $options['link_hover_color'] = $colors['link_hover'];
            }
            if (!empty($colors['header_bg'])) {
                $options['header_background'] = $colors['header_bg'];
            }
            if (!empty($colors['header_text'])) {
                $options['header_text_color'] = $colors['header_text'];
            }
            if (!empty($colors['footer_bg'])) {
                $options['footer_background'] = $colors['footer_bg'];
            }
            if (!empty($colors['footer_text'])) {
                $options['footer_text_color'] = $colors['footer_text'];
            }
            if (!empty($colors['button_bg'])) {
                $options['button_bg_color'] = $colors['button_bg'];
            }
            if (!empty($colors['button_text'])) {
                $options['button_text_color'] = $colors['button_text'];
            }
        }

        if (!empty($preset['header'])) {
            $options['header_layout'] = $preset['header'];
        }

        if (!empty($preset['typography'])) {
            $typo = $preset['typography'];
            if (!empty($typo['body'])) {
                $options['body_typography'] = $typo['body'];
            }
            if (!empty($typo['heading'])) {
                $options['heading_typography'] = $typo['heading'];
            }
        }

        return $options;
    }

    protected function getBundleSourcePath(string $bundleId): string
    {
        $base = apply_filters(
            'jankx/template_bundle/source_path',
            get_template_directory() . '/resources/template-bundles',
            $bundleId
        );

        return $base . '/' . $bundleId;
    }

    protected function addStepResult(string $step, string $status, string $message): void
    {
        $this->results['steps'][$step] = [
            'status' => $status,
            'message' => $message,
        ];

        if ($status !== 'success' && $status !== 'skipped') {
            $this->results['success'] = false;
        }
    }

    protected function error(string $message): array
    {
        $this->results = [
            'success' => false,
            'message' => $message,
        ];

        return $this->results;
    }

    public function getResults(): array
    {
        return $this->results;
    }
}
