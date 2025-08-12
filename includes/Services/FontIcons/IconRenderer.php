<?php

namespace Jankx\Services\FontIcons;

class IconRenderer
{
    public function render($iconName, $type, $options = [])
    {
        $defaultOptions = [
            'class' => '',
            'size' => '1em',
            'color' => 'currentColor',
            'style' => ''
        ];

        $options = array_merge($defaultOptions, $options);

        // Get icon info
        $app = app();
        $repository = $app->make('font-icons.repository');
        $iconInfo = $repository->getIconInfo($iconName, $type);

        if (!$iconInfo) {
            return '';
        }

        // Build CSS classes
        $classes = ['jankx-icon', "jankx-icon-{$type}"];
        if (!empty($options['class'])) {
            $classes[] = $options['class'];
        }

        // Build inline styles
        $styles = [];
        if ($options['size'] !== '1em') {
            $styles[] = "font-size: {$options['size']}";
        }
        if ($options['color'] !== 'currentColor') {
            $styles[] = "color: {$options['color']}";
        }
        if (!empty($options['style'])) {
            $styles[] = $options['style'];
        }

        $styleAttr = !empty($styles) ? ' style="' . implode('; ', $styles) . '"' : '';

        // Render based on icon type
        switch ($type) {
            case 'fontawesome':
                return $this->renderFontAwesome($iconInfo, $classes, $styleAttr);
            case 'material':
                return $this->renderMaterialIcon($iconInfo, $classes, $styleAttr);
            case 'custom':
                return $this->renderCustomIcon($iconInfo, $classes, $styleAttr);
            case 'svg':
                return $this->renderSvgIcon($iconInfo, $classes, $styleAttr);
            default:
                return $this->renderGenericIcon($iconInfo, $classes, $styleAttr);
        }
    }

    protected function renderFontAwesome($iconInfo, $classes, $styleAttr)
    {
        $iconClass = $iconInfo['class'] ?? '';
        $classes[] = $iconClass;

        return sprintf(
            '<i class="%s"%s></i>',
            implode(' ', $classes),
            $styleAttr
        );
    }

    protected function renderMaterialIcon($iconInfo, $classes, $styleAttr)
    {
        $iconName = $iconInfo['name'] ?? '';
        $classes[] = 'material-icons';

        return sprintf(
            '<span class="%s"%s>%s</span>',
            implode(' ', $classes),
            $styleAttr,
            esc_html($iconName)
        );
    }

    protected function renderCustomIcon($iconInfo, $classes, $styleAttr)
    {
        $iconClass = $iconInfo['class'] ?? '';
        $classes[] = $iconClass;

        return sprintf(
            '<i class="%s"%s></i>',
            implode(' ', $classes),
            $styleAttr
        );
    }

    protected function renderSvgIcon($iconInfo, $classes, $styleAttr)
    {
        $iconClass = $iconInfo['class'] ?? '';
        $iconName = $iconInfo['name'] ?? '';
        $classes[] = $iconClass;

        return sprintf(
            '<svg class="%s"%s><use xlink:href="#%s"></use></svg>',
            implode(' ', $classes),
            $styleAttr,
            esc_attr($iconName)
        );
    }

    protected function renderGenericIcon($iconInfo, $classes, $styleAttr)
    {
        $iconClass = $iconInfo['class'] ?? '';
        if ($iconClass) {
            $classes[] = $iconClass;
        }

        return sprintf(
            '<i class="%s"%s></i>',
            implode(' ', $classes),
            $styleAttr
        );
    }

    public function renderIconList($icons, $type, $options = [])
    {
        $output = '<div class="jankx-icon-list">';

        foreach ($icons as $icon) {
            $output .= $this->render($icon['name'], $type, $options);
        }

        $output .= '</div>';
        return $output;
    }

    public function renderIconPicker($type, $options = [])
    {
        $app = app();
        $repository = $app->make('font-icons.repository');
        $icons = $repository->getIconsByType($type);

        if (empty($icons)) {
            return '<p>No icons available for this type.</p>';
        }

        $output = '<div class="jankx-icon-picker" data-type="' . esc_attr($type) . '">';
        $output .= '<div class="jankx-icon-grid">';

        foreach ($icons as $icon) {
            $output .= sprintf(
                '<div class="jankx-icon-item" data-icon="%s" data-name="%s">%s</div>',
                esc_attr($icon['name']),
                esc_attr($icon['name']),
                $this->render($icon['name'], $type, $options)
            );
        }

        $output .= '</div>';
        $output .= '</div>';

        return $output;
    }
}
