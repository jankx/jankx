<?php

namespace Jankx\Gutenberg\Examples;

use Jankx\Facades\Options;
use Jankx\Facades\Logger;

/**
 * Layout Options Examples
 *
 * Examples of how to use the Jankx Layout Options system.
 * This file demonstrates various ways to register and use options.
 */
class OptionsExamples
{
    /**
     * Register custom options
     */
    public static function registerCustomOptions()
    {
        // Register custom option group
        Options::registerGroup('custom', [
            'name' => 'Custom Options',
            'icon' => 'custom',
            'description' => 'Custom layout options'
        ]);

        // Register custom options
        Options::register('customBorder', [
            'group' => 'custom',
            'type' => 'select',
            'label' => 'Border Style',
            'description' => 'Choose the border style for this layout',
            'default' => 'none',
            'options' => [
                'none' => 'None',
                'solid' => 'Solid',
                'dashed' => 'Dashed',
                'dotted' => 'Dotted'
            ]
        ]);

        Options::register('customShadow', [
            'group' => 'custom',
            'type' => 'select',
            'label' => 'Shadow',
            'description' => 'Choose the shadow style',
            'default' => 'none',
            'options' => [
                'none' => 'None',
                'small' => 'Small',
                'medium' => 'Medium',
                'large' => 'Large'
            ]
        ]);

        Options::register('customRadius', [
            'group' => 'custom',
            'type' => 'range',
            'label' => 'Border Radius',
            'description' => 'Adjust the border radius',
            'default' => 0,
            'min' => 0,
            'max' => 50,
            'step' => 2,
            'unit' => 'px'
        ]);

        Logger::debug('Custom options registered', [
            'total_custom_options' => 3
        ]);
    }

    /**
     * Register hero-specific options
     */
    public static function registerHeroOptions()
    {
        // Hero-specific background options
        Options::register('heroOverlay', [
            'group' => 'background',
            'type' => 'toggle',
            'label' => 'Hero Overlay',
            'description' => 'Add a dark overlay to the background image',
            'default' => false,
            'supports' => ['hero-section']
        ]);

        Options::register('heroOverlayOpacity', [
            'group' => 'background',
            'type' => 'range',
            'label' => 'Overlay Opacity',
            'description' => 'Adjust the overlay opacity',
            'default' => 50,
            'min' => 0,
            'max' => 100,
            'step' => 5,
            'unit' => '%',
            'supports' => ['hero-section']
        ]);

        // Hero-specific typography options
        Options::register('heroTitleSize', [
            'group' => 'typography',
            'type' => 'select',
            'label' => 'Title Size',
            'description' => 'Choose the title size',
            'default' => 'large',
            'options' => [
                'small' => 'Small',
                'medium' => 'Medium',
                'large' => 'Large',
                'xlarge' => 'Extra Large',
                'xxlarge' => '2X Large'
            ],
            'supports' => ['hero-section']
        ]);

        Logger::debug('Hero-specific options registered', [
            'total_hero_options' => 3
        ]);
    }

    /**
     * Register testimonial-specific options
     */
    public static function registerTestimonialOptions()
    {
        // Testimonial-specific options
        Options::register('testimonialStyle', [
            'group' => 'layout',
            'type' => 'select',
            'label' => 'Testimonial Style',
            'description' => 'Choose the testimonial style',
            'default' => 'card',
            'options' => [
                'card' => 'Card',
                'quote' => 'Quote',
                'minimal' => 'Minimal'
            ],
            'supports' => ['testimonial']
        ]);

        Options::register('testimonialAvatarSize', [
            'group' => 'layout',
            'type' => 'select',
            'label' => 'Avatar Size',
            'description' => 'Choose the avatar size',
            'default' => 'medium',
            'options' => [
                'small' => 'Small',
                'medium' => 'Medium',
                'large' => 'Large'
            ],
            'supports' => ['testimonial']
        ]);

        Logger::debug('Testimonial-specific options registered', [
            'total_testimonial_options' => 2
        ]);
    }

    /**
     * Demonstrate option usage
     */
    public static function demonstrateUsage()
    {
        // Get all options
        $allOptions = Options::all();
        Logger::info('All registered options', ['count' => count($allOptions)]);

        // Get options by group
        $layoutOptions = Options::getByGroup('layout');
        Logger::info('Layout options', ['count' => count($layoutOptions)]);

        // Get options for specific layout
        $heroOptions = Options::getForLayout('hero-section');
        Logger::info('Hero layout options', ['count' => count($heroOptions)]);

        // Get option value
        $attributes = [
            'alignment' => 'center',
            'spacing' => 'loose',
            'background' => 'primary'
        ];

        $alignment = Options::getValue('alignment', $attributes);
        Logger::info('Alignment value', ['value' => $alignment]);

        // Get all values for a layout
        $heroValues = Options::getValues('hero-section', $attributes);
        Logger::info('Hero layout values', ['values' => $heroValues]);

        // Generate CSS classes
        $classes = Options::generateClasses($heroValues);
        Logger::info('Generated CSS classes', ['classes' => $classes]);

        // Generate CSS styles
        $styles = Options::generateStyles($heroValues);
        Logger::info('Generated CSS styles', ['styles' => $styles]);

        // Validate option values
        $isValidAlignment = Options::validate('alignment', 'center');
        Logger::info('Alignment validation', ['valid' => $isValidAlignment]);

        $isValidColor = Options::validate('textColor', '#ff0000');
        Logger::info('Color validation', ['valid' => $isValidColor]);
    }

    /**
     * Create dynamic options based on layout
     */
    public static function createDynamicOptions()
    {
        // Create options that adapt to layout type
        Options::register('responsiveVisibility', [
            'group' => 'layout',
            'type' => 'select',
            'label' => 'Responsive Visibility',
            'description' => 'Choose when this layout is visible',
            'default' => 'all',
            'options' => [
                'all' => 'All Devices',
                'desktop' => 'Desktop Only',
                'mobile' => 'Mobile Only',
                'tablet' => 'Tablet Only'
            ]
        ]);

        // Create conditional options
        Options::register('conditionalAnimation', [
            'group' => 'animation',
            'type' => 'toggle',
            'label' => 'Conditional Animation',
            'description' => 'Enable animation only on specific conditions',
            'default' => false
        ]);

        Options::register('animationCondition', [
            'group' => 'animation',
            'type' => 'select',
            'label' => 'Animation Condition',
            'description' => 'Choose when to trigger animation',
            'default' => 'scroll',
            'options' => [
                'scroll' => 'On Scroll',
                'hover' => 'On Hover',
                'click' => 'On Click',
                'load' => 'On Load'
            ],
            'note' => 'Only works when Conditional Animation is enabled'
        ]);

        Logger::debug('Dynamic options created', [
            'total_dynamic_options' => 2
        ]);
    }

    /**
     * Create performance-focused options
     */
    public static function createPerformanceOptions()
    {
        // Performance options
        Options::register('preload', [
            'group' => 'performance',
            'type' => 'toggle',
            'label' => 'Preload',
            'description' => 'Preload this layout for faster rendering',
            'default' => false
        ]);

        Options::register('cache', [
            'group' => 'performance',
            'type' => 'toggle',
            'label' => 'Cache',
            'description' => 'Cache this layout for better performance',
            'default' => true
        ]);

        Options::register('cacheDuration', [
            'group' => 'performance',
            'type' => 'select',
            'label' => 'Cache Duration',
            'description' => 'Choose how long to cache this layout',
            'default' => '1hour',
            'options' => [
                '15min' => '15 Minutes',
                '1hour' => '1 Hour',
                '1day' => '1 Day',
                '1week' => '1 Week'
            ],
            'note' => 'Only applies when Cache is enabled'
        ]);

        Logger::debug('Performance options created', [
            'total_performance_options' => 3
        ]);
    }

    /**
     * Create advanced styling options
     */
    public static function createAdvancedStylingOptions()
    {
        // Advanced styling options
        Options::register('gradient', [
            'group' => 'background',
            'type' => 'select',
            'label' => 'Gradient',
            'description' => 'Choose a gradient background',
            'default' => 'none',
            'options' => [
                'none' => 'None',
                'linear' => 'Linear',
                'radial' => 'Radial',
                'conic' => 'Conic'
            ]
        ]);

        Options::register('gradientColors', [
            'group' => 'background',
            'type' => 'text',
            'label' => 'Gradient Colors',
            'description' => 'Enter gradient colors (e.g., #ff0000, #0000ff)',
            'default' => '#ff0000, #0000ff',
            'note' => 'Only applies when Gradient is selected'
        ]);

        Options::register('blur', [
            'group' => 'background',
            'type' => 'range',
            'label' => 'Background Blur',
            'description' => 'Apply blur effect to background',
            'default' => 0,
            'min' => 0,
            'max' => 20,
            'step' => 1,
            'unit' => 'px'
        ]);

        Logger::debug('Advanced styling options created', [
            'total_advanced_options' => 3
        ]);
    }
}