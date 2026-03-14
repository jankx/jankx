<?php

namespace Tests\Gutenberg\Support;

/**
 * Design Token Generator
 * 
 * Extracts design tokens from theme.json and maps them to CSS variables
 * that AI models can use for styling.
 */
class DesignTokenGenerator
{
    protected $themeJsonPath;
    protected $outputFile;

    public function __construct(string $themeJsonPath, string $outputFile)
    {
        $this->themeJsonPath = $themeJsonPath;
        $this->outputFile = $outputFile;
    }

    public function generate()
    {
        if (!file_exists($this->themeJsonPath)) {
            echo "theme.json not found at: {$this->themeJsonPath}\n";
            return;
        }

        $themeJson = json_decode(file_get_contents($this->themeJsonPath), true);
        $tokens = [
            'colors' => [],
            'typography' => [
                'fontFamilies' => [],
                'fontSizes' => [],
            ],
            'spacing' => [
                'sizes' => [],
            ],
            'layout' => $themeJson['settings']['layout'] ?? [],
        ];

        // Process Colors
        if (isset($themeJson['settings']['color']['palette'])) {
            foreach ($themeJson['settings']['color']['palette'] as $color) {
                $tokens['colors'][$color['slug']] = [
                    'name' => $color['name'],
                    'value' => $color['color'],
                    'variable' => "var(--wp--preset--color--{$color['slug']})",
                ];
            }
        }

        // Process Typography
        if (isset($themeJson['settings']['typography']['fontFamilies'])) {
            foreach ($themeJson['settings']['typography']['fontFamilies'] as $font) {
                $tokens['typography']['fontFamilies'][$font['slug']] = [
                    'name' => $font['name'],
                    'variable' => "var(--wp--preset--font-family--{$font['slug']})",
                ];
            }
        }

        if (isset($themeJson['settings']['typography']['fontSizes'])) {
            foreach ($themeJson['settings']['typography']['fontSizes'] as $size) {
                $tokens['typography']['fontSizes'][$size['slug']] = [
                    'name' => $size['name'],
                    'value' => $size['size'],
                    'variable' => "var(--wp--preset--font-size--{$size['slug']})",
                ];
            }
        }

        // Process Spacing
        if (isset($themeJson['settings']['spacing']['spacingSizes'])) {
            foreach ($themeJson['settings']['spacing']['spacingSizes'] as $size) {
                $tokens['spacing']['sizes'][$size['slug']] = [
                    'name' => $size['name'],
                    'value' => $size['size'],
                    'variable' => "var(--wp--preset--spacing--{$size['slug']})",
                ];
            }
        }

        file_put_contents(
            $this->outputFile,
            json_encode($tokens, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );

        echo "Design tokens schema generated: {$this->outputFile}\n";
    }
}
