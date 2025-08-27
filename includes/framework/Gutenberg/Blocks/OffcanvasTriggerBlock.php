<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class OffcanvasTriggerBlock extends Block
{
    public function __construct()
    {
        parent::__construct('jankx/offcanvas-trigger', [
            'title' => __('Offcanvas Trigger', 'jankx'),
            'category' => 'widgets',
            'icon' => 'button',
            'description' => __('A trigger button to open offcanvas sidebar', 'jankx'),
            'keywords' => ['button', 'trigger', 'sidebar', 'offcanvas', 'menu'],
            'supports' => [
                'html' => false,
                'align' => ['left', 'center', 'right'],
                'spacing' => [
                    'margin' => true,
                    'padding' => true
                ]
            ],
            'attributes' => [
                'triggerText' => ['type' => 'string', 'default' => 'Menu'],
                'triggerIcon' => ['type' => 'string', 'default' => 'menu'],
                'targetSidebarId' => ['type' => 'string', 'default' => ''],
                'buttonStyle' => ['type' => 'string', 'default' => 'default'],
                'buttonSize' => ['type' => 'string', 'default' => 'medium'],
                'backgroundColor' => ['type' => 'string', 'default' => '#48a770'],
                'textColor' => ['type' => 'string', 'default' => '#ffffff'],
                'borderRadius' => ['type' => 'string', 'default' => '4px'],
                'showIcon' => ['type' => 'boolean', 'default' => true],
                'showText' => ['type' => 'boolean', 'default' => true],
                'className' => ['type' => 'string']
            ]
        ]);
    }

    public function register()
    {
        $blockPath = $this->getBlockPath();
        $metadata = $this->getBlockMetadata($blockPath);

        $this->registerBlock($blockPath, $metadata);
    }

    public function render($attributes, $content = '')
    {
        $triggerText = $attributes['triggerText'] ?? 'Menu';
        $triggerIcon = $attributes['triggerIcon'] ?? 'menu';
        $targetSidebarId = $attributes['targetSidebarId'] ?? '';
        $buttonStyle = $attributes['buttonStyle'] ?? 'default';
        $buttonSize = $attributes['buttonSize'] ?? 'medium';
        $backgroundColor = $attributes['backgroundColor'] ?? '#48a770';
        $textColor = $attributes['textColor'] ?? '#ffffff';
        $borderRadius = $attributes['borderRadius'] ?? '4px';
        $showIcon = $attributes['showIcon'] ?? true;
        $showText = $attributes['showText'] ?? true;
        $className = $attributes['className'] ?? '';

        // Build button styles
        $buttonStyles = $this->buildButtonStyles($buttonStyle, $backgroundColor, $textColor, $borderRadius, $buttonSize);

        // Build CSS classes
        $cssClasses = $this->buildCssClasses($buttonStyle, $buttonSize, $showIcon, $showText);

        // Build data attributes
        $dataAttributes = $this->buildDataAttributes([
            'targetSidebarId' => $targetSidebarId
        ]);

        // Get icon HTML
        $iconHtml = $this->getIconHtml($triggerIcon);

        ob_start();
        ?>
        <div class="offcanvas-trigger-block <?php echo esc_attr($className); ?>">
            <button
                class="offcanvas-trigger <?php echo esc_attr($cssClasses); ?>"
                style="<?php echo esc_attr($buttonStyles); ?>"
                <?php echo $dataAttributes; ?>
                data-target-sidebar="<?php echo esc_attr($targetSidebarId); ?>"
            >
                <?php if ($showIcon && $iconHtml): ?>
                    <span class="trigger-icon">
                        <?php echo $iconHtml; ?>
                    </span>
                <?php endif; ?>

                <?php if ($showText): ?>
                    <span class="trigger-text"><?php echo esc_html($triggerText); ?></span>
                <?php endif; ?>
            </button>
        </div>
        <?php
        return ob_get_clean();
    }

    protected function buildButtonStyles($buttonStyle, $backgroundColor, $textColor, $borderRadius, $buttonSize)
    {
        $styles = [];

        // Background color
        if ($buttonStyle === 'outline' || $buttonStyle === 'ghost') {
            $styles[] = 'background-color: transparent';
        } else {
            $styles[] = "background-color: {$backgroundColor}";
        }

        // Text color
        $styles[] = "color: {$textColor}";

        // Border
        if ($buttonStyle === 'outline') {
            $styles[] = "border: 2px solid {$backgroundColor}";
        } else {
            $styles[] = 'border: none';
        }

        // Border radius
        $styles[] = "border-radius: {$borderRadius}";

        // Padding based on size
        switch ($buttonSize) {
            case 'small':
                $styles[] = 'padding: 8px 12px';
                $styles[] = 'font-size: 14px';
                break;
            case 'large':
                $styles[] = 'padding: 16px 24px';
                $styles[] = 'font-size: 18px';
                break;
            default:
                $styles[] = 'padding: 12px 16px';
                $styles[] = 'font-size: 16px';
        }

        return implode('; ', $styles);
    }

    protected function buildCssClasses($buttonStyle, $buttonSize, $showIcon, $showText)
    {
        $classes = [
            "style-{$buttonStyle}",
            "size-{$buttonSize}"
        ];

        if (!$showIcon) {
            $classes[] = 'no-icon';
        }

        if (!$showText) {
            $classes[] = 'no-text';
        }

        return implode(' ', $classes);
    }

    protected function getIconHtml($iconName)
    {
        $iconMap = [
            'menu' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>',
            'home' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
            'info' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
            'cog' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>',
            'email' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>'
        ];

        return $iconMap[$iconName] ?? $iconMap['menu'];
    }

    /**
     * Build data attributes for JavaScript
     *
     * @param array $attributes Attributes
     * @return string HTML attributes
     */
    protected function buildDataAttributes($attributes)
    {
        $dataAttrs = [];
        foreach ($attributes as $key => $value) {
            $dataAttrs[] = sprintf('data-%s="%s"', esc_attr($key), esc_attr($value));
        }
        return implode(' ', $dataAttrs);
    }
}
