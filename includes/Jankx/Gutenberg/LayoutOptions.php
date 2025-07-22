<?php

namespace Jankx\Gutenberg;

use Illuminate\Container\Container;
use Jankx\Facades\Logger;

/**
 * Jankx Gutenberg Layout Options
 *
 * Manages layout options and their configurations.
 * Provides a flexible system for customizing layouts.
 */
class LayoutOptions
{
    /**
     * @var array Registered options
     */
    protected static $options = [];

    /**
     * @var array Option groups
     */
    protected static $groups = [];

    /**
     * @var Container
     */
    protected static $container;

    /**
     * Initialize with container
     */
    public static function init(Container $container)
    {
        self::$container = $container;
        self::registerDefaultGroups();
        self::registerDefaultOptions();
    }

    /**
     * Register default option groups
     */
    protected static function registerDefaultGroups()
    {
        self::registerGroup('layout', [
            'name' => 'Layout',
            'icon' => 'layout',
            'description' => 'Layout-specific options'
        ]);

        self::registerGroup('spacing', [
            'name' => 'Spacing',
            'icon' => 'spacing',
            'description' => 'Spacing and padding options'
        ]);

        self::registerGroup('background', [
            'name' => 'Background',
            'icon' => 'background',
            'description' => 'Background and color options'
        ]);

        self::registerGroup('typography', [
            'name' => 'Typography',
            'icon' => 'typography',
            'description' => 'Text and font options'
        ]);

        self::registerGroup('animation', [
            'name' => 'Animation',
            'icon' => 'animation',
            'description' => 'Animation and transition options'
        ]);

        self::registerGroup('performance', [
            'name' => 'Performance',
            'icon' => 'performance',
            'description' => 'Performance and loading options'
        ]);
    }

    /**
     * Register default options
     */
    protected static function registerDefaultOptions()
    {
        // Layout Options
        self::registerOption('alignment', [
            'group' => 'layout',
            'type' => 'select',
            'label' => 'Alignment',
            'description' => 'Choose the alignment of this layout',
            'default' => 'left',
            'options' => [
                'left' => 'Left',
                'center' => 'Center',
                'right' => 'Right'
            ],
            'supports' => ['wide', 'full']
        ]);

        self::registerOption('width', [
            'group' => 'layout',
            'type' => 'select',
            'label' => 'Width',
            'description' => 'Choose the width of this layout',
            'default' => 'default',
            'options' => [
                'narrow' => 'Narrow',
                'default' => 'Default',
                'wide' => 'Wide',
                'full' => 'Full Width'
            ]
        ]);

        // Spacing Options
        self::registerOption('spacing', [
            'group' => 'spacing',
            'type' => 'select',
            'label' => 'Spacing',
            'description' => 'Choose the spacing for this layout',
            'default' => 'default',
            'options' => [
                'compact' => 'Compact',
                'default' => 'Default',
                'loose' => 'Loose'
            ]
        ]);

        self::registerOption('padding', [
            'group' => 'spacing',
            'type' => 'range',
            'label' => 'Padding',
            'description' => 'Adjust the padding of this layout',
            'default' => 20,
            'min' => 0,
            'max' => 100,
            'step' => 5,
            'unit' => 'px'
        ]);

        self::registerOption('margin', [
            'group' => 'spacing',
            'type' => 'range',
            'label' => 'Margin',
            'description' => 'Adjust the margin of this layout',
            'default' => 0,
            'min' => 0,
            'max' => 100,
            'step' => 5,
            'unit' => 'px'
        ]);

        // Background Options
        self::registerOption('background', [
            'group' => 'background',
            'type' => 'select',
            'label' => 'Background',
            'description' => 'Choose the background for this layout',
            'default' => 'none',
            'options' => [
                'none' => 'None',
                'light' => 'Light',
                'dark' => 'Dark',
                'primary' => 'Primary',
                'secondary' => 'Secondary'
            ]
        ]);

        self::registerOption('backgroundImage', [
            'group' => 'background',
            'type' => 'image',
            'label' => 'Background Image',
            'description' => 'Choose a background image',
            'default' => '',
            'supports' => ['hero-section', 'testimonial']
        ]);

        self::registerOption('overlay', [
            'group' => 'background',
            'type' => 'toggle',
            'label' => 'Overlay',
            'description' => 'Add an overlay to the background',
            'default' => false,
            'supports' => ['hero-section']
        ]);

        // Typography Options
        self::registerOption('textColor', [
            'group' => 'typography',
            'type' => 'color',
            'label' => 'Text Color',
            'description' => 'Choose the text color',
            'default' => '#000000'
        ]);

        self::registerOption('fontSize', [
            'group' => 'typography',
            'type' => 'select',
            'label' => 'Font Size',
            'description' => 'Choose the font size',
            'default' => 'medium',
            'options' => [
                'small' => 'Small',
                'medium' => 'Medium',
                'large' => 'Large',
                'xlarge' => 'Extra Large'
            ]
        ]);

        // Animation Options
        self::registerOption('animation', [
            'group' => 'animation',
            'type' => 'select',
            'label' => 'Animation',
            'description' => 'Choose an animation for this layout',
            'default' => 'none',
            'options' => [
                'none' => 'None',
                'fadeIn' => 'Fade In',
                'slideUp' => 'Slide Up',
                'slideDown' => 'Slide Down',
                'zoomIn' => 'Zoom In'
            ]
        ]);

        self::registerOption('animationDelay', [
            'group' => 'animation',
            'type' => 'range',
            'label' => 'Animation Delay',
            'description' => 'Set the animation delay',
            'default' => 0,
            'min' => 0,
            'max' => 2000,
            'step' => 100,
            'unit' => 'ms'
        ]);

        // Performance Options
        self::registerOption('partialHydration', [
            'group' => 'performance',
            'type' => 'toggle',
            'label' => 'Partial Hydration',
            'description' => 'Load this layout via AJAX when visible',
            'default' => false,
            'note' => 'First layout is always server-rendered'
        ]);

        self::registerOption('lazyLoad', [
            'group' => 'performance',
            'type' => 'toggle',
            'label' => 'Lazy Load',
            'description' => 'Load this layout when it comes into view',
            'default' => false
        ]);
    }

    /**
     * Register an option group
     *
     * @param string $name Group name
     * @param array $config Group configuration
     */
    public static function registerGroup($name, array $config)
    {
        $defaultConfig = [
            'name' => $name,
            'icon' => 'settings',
            'description' => '',
            'order' => 10
        ];

        self::$groups[$name] = array_merge($defaultConfig, $config);
    }

    /**
     * Register an option
     *
     * @param string $name Option name
     * @param array $config Option configuration
     */
    public static function registerOption($name, array $config)
    {
        $defaultConfig = [
            'group' => 'layout',
            'type' => 'text',
            'label' => $name,
            'description' => '',
            'default' => '',
            'required' => false,
            'supports' => [],
            'order' => 10
        ];

        self::$options[$name] = array_merge($defaultConfig, $config);
    }

    /**
     * Get all option groups
     *
     * @return array Option groups
     */
    public static function getGroups()
    {
        return self::$groups;
    }

    /**
     * Get all options
     *
     * @return array All options
     */
    public static function getOptions()
    {
        return self::$options;
    }

    /**
     * Get options by group
     *
     * @param string $group Group name
     * @return array Options in group
     */
    public static function getOptionsByGroup($group)
    {
        $options = [];
        foreach (self::$options as $name => $config) {
            if ($config['group'] === $group) {
                $options[$name] = $config;
            }
        }
        return $options;
    }

    /**
     * Get options for a specific layout
     *
     * @param string $layoutName Layout name
     * @return array Options for layout
     */
    public static function getOptionsForLayout($layoutName)
    {
        $options = [];
        foreach (self::$options as $name => $config) {
            // Check if option supports this layout
            if (empty($config['supports']) || in_array($layoutName, $config['supports'])) {
                $options[$name] = $config;
            }
        }
        return $options;
    }

    /**
     * Get option value with fallback to default
     *
     * @param string $optionName Option name
     * @param array $attributes Block attributes
     * @return mixed Option value
     */
    public static function getOptionValue($optionName, $attributes = [])
    {
        if (!isset(self::$options[$optionName])) {
            return null;
        }

        $option = self::$options[$optionName];

        // Check if value exists in attributes
        if (isset($attributes[$optionName])) {
            return $attributes[$optionName];
        }

        // Return default value
        return $option['default'];
    }

    /**
     * Get all option values for a layout
     *
     * @param string $layoutName Layout name
     * @param array $attributes Block attributes
     * @return array Option values
     */
    public static function getOptionValues($layoutName, $attributes = [])
    {
        $options = self::getOptionsForLayout($layoutName);
        $values = [];

        foreach ($options as $name => $config) {
            $values[$name] = self::getOptionValue($name, $attributes);
        }

        return $values;
    }

    /**
     * Generate CSS classes from option values
     *
     * @param array $values Option values
     * @return string CSS classes
     */
    public static function generateClasses($values)
    {
        $classes = [];

        // Alignment classes
        if (isset($values['alignment'])) {
            $classes[] = "jankx-align-{$values['alignment']}";
        }

        // Width classes
        if (isset($values['width'])) {
            $classes[] = "jankx-width-{$values['width']}";
        }

        // Spacing classes
        if (isset($values['spacing'])) {
            $classes[] = "jankx-spacing-{$values['spacing']}";
        }

        // Background classes
        if (isset($values['background']) && $values['background'] !== 'none') {
            $classes[] = "jankx-bg-{$values['background']}";
        }

        // Animation classes
        if (isset($values['animation']) && $values['animation'] !== 'none') {
            $classes[] = "jankx-animation-{$values['animation']}";
        }

        // Performance classes
        if (isset($values['partialHydration']) && $values['partialHydration']) {
            $classes[] = "jankx-partial-hydration";
        }

        if (isset($values['lazyLoad']) && $values['lazyLoad']) {
            $classes[] = "jankx-lazy-load";
        }

        return implode(' ', $classes);
    }

    /**
     * Generate CSS styles from option values
     *
     * @param array $values Option values
     * @return string CSS styles
     */
    public static function generateStyles($values)
    {
        $styles = [];

        // Padding
        if (isset($values['padding'])) {
            $styles[] = "padding: {$values['padding']}px;";
        }

        // Margin
        if (isset($values['margin'])) {
            $styles[] = "margin: {$values['margin']}px;";
        }

        // Text color
        if (isset($values['textColor'])) {
            $styles[] = "color: {$values['textColor']};";
        }

        // Background image
        if (isset($values['backgroundImage']) && !empty($values['backgroundImage'])) {
            $styles[] = "background-image: url('{$values['backgroundImage']}');";
            $styles[] = "background-size: cover;";
            $styles[] = "background-position: center;";
        }

        // Animation delay
        if (isset($values['animationDelay']) && $values['animationDelay'] > 0) {
            $styles[] = "animation-delay: {$values['animationDelay']}ms;";
        }

        return implode(' ', $styles);
    }

    /**
     * Validate option value
     *
     * @param string $optionName Option name
     * @param mixed $value Option value
     * @return bool Is valid
     */
    public static function validateOption($optionName, $value)
    {
        if (!isset(self::$options[$optionName])) {
            return false;
        }

        $option = self::$options[$optionName];

        switch ($option['type']) {
            case 'select':
                return in_array($value, array_keys($option['options']));

            case 'range':
                $min = $option['min'] ?? 0;
                $max = $option['max'] ?? 100;
                return is_numeric($value) && $value >= $min && $value <= $max;

            case 'toggle':
                return is_bool($value);

            case 'color':
                return preg_match('/^#[0-9A-F]{6}$/i', $value);

            case 'image':
                return filter_var($value, FILTER_VALIDATE_URL) || empty($value);

            default:
                return true;
        }
    }

    /**
     * Get option configuration
     *
     * @param string $optionName Option name
     * @return array|null Option configuration
     */
    public static function getOption($optionName)
    {
        return self::$options[$optionName] ?? null;
    }

    /**
     * Check if option exists
     *
     * @param string $optionName Option name
     * @return bool
     */
    public static function hasOption($optionName)
    {
        return isset(self::$options[$optionName]);
    }

    /**
     * Get container instance
     *
     * @return Container
     */
    public static function getContainer()
    {
        return self::$container;
    }
}