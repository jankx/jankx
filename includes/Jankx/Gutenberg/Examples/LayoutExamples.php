<?php

namespace Jankx\Gutenberg\Examples;

use Jankx\Facades\Layout;
use Jankx\Facades\Logger;

/**
 * Layout Examples
 *
 * Examples of how to use the Jankx Layout Registry system.
 * This file demonstrates various ways to register and use layouts.
 */
class LayoutExamples
{
    /**
     * Register all example layouts
     */
    public static function registerExamples()
    {
        self::registerHeroLayout();
        self::registerTestimonialLayout();
        self::registerFeatureGridLayout();
        self::registerContactFormLayout();
        self::registerPricingTableLayout();

        Logger::debug('Layout examples registered', [
            'total_examples' => 5
        ]);
    }

    /**
     * Register Hero Section Layout
     */
    private static function registerHeroLayout()
    {
        Layout::register('hero-section', [
            'name' => 'Hero Section',
            'category' => 'jankx-sections',
            'description' => 'A prominent hero section with title, description, and call-to-action',
            'icon' => 'hero',
            'supports' => [
                'align' => ['wide', 'full'],
                'spacing' => true,
                'background' => true,
                'partial_hydration' => true,
            ],
            'attributes' => [
                'title' => [
                    'type' => 'string',
                    'default' => 'Welcome to Our Site'
                ],
                'description' => [
                    'type' => 'string',
                    'default' => 'Discover amazing features and services'
                ],
                'buttonText' => [
                    'type' => 'string',
                    'default' => 'Get Started'
                ],
                'buttonUrl' => [
                    'type' => 'string',
                    'default' => '#'
                ],
                'backgroundImage' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'overlay' => [
                    'type' => 'boolean',
                    'default' => false
                ]
            ]
        ]);

        // Register blocks within hero layout
        Layout::registerBlock('hero-section', 'jankx/hero-title', [
            'required' => true,
            'order' => 1,
            'supports' => [
                'typography' => true,
                'color' => true
            ]
        ]);

        Layout::registerBlock('hero-section', 'jankx/hero-description', [
            'required' => false,
            'order' => 2,
            'supports' => [
                'typography' => true,
                'color' => true
            ]
        ]);

        Layout::registerBlock('hero-section', 'jankx/hero-button', [
            'required' => false,
            'order' => 3,
            'supports' => [
                'style' => true,
                'color' => true
            ]
        ]);
    }

    /**
     * Register Testimonial Layout
     */
    private static function registerTestimonialLayout()
    {
        Layout::register('testimonial', [
            'name' => 'Testimonial',
            'category' => 'jankx-components',
            'description' => 'A testimonial section with quote, author, and image',
            'icon' => 'testimonial',
            'supports' => [
                'align' => ['wide'],
                'spacing' => true,
                'background' => true,
                'partial_hydration' => true,
            ],
            'attributes' => [
                'quote' => [
                    'type' => 'string',
                    'default' => 'Amazing service and support!'
                ],
                'author' => [
                    'type' => 'string',
                    'default' => 'John Doe'
                ],
                'position' => [
                    'type' => 'string',
                    'default' => 'CEO'
                ],
                'company' => [
                    'type' => 'string',
                    'default' => 'Company Name'
                ],
                'avatar' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'rating' => [
                    'type' => 'number',
                    'default' => 5
                ]
            ]
        ]);

        // Register blocks within testimonial layout
        Layout::registerBlock('testimonial', 'jankx/testimonial-quote', [
            'required' => true,
            'order' => 1
        ]);

        Layout::registerBlock('testimonial', 'jankx/testimonial-author', [
            'required' => true,
            'order' => 2
        ]);

        Layout::registerBlock('testimonial', 'jankx/testimonial-rating', [
            'required' => false,
            'order' => 3
        ]);
    }

    /**
     * Register Feature Grid Layout
     */
    private static function registerFeatureGridLayout()
    {
        Layout::register('feature-grid', [
            'name' => 'Feature Grid',
            'category' => 'jankx-sections',
            'description' => 'A grid of feature items with icons and descriptions',
            'icon' => 'grid',
            'supports' => [
                'align' => ['wide', 'full'],
                'spacing' => true,
                'background' => true,
                'partial_hydration' => true,
            ],
            'attributes' => [
                'columns' => [
                    'type' => 'number',
                    'default' => 3
                ],
                'title' => [
                    'type' => 'string',
                    'default' => 'Our Features'
                ],
                'description' => [
                    'type' => 'string',
                    'default' => 'Discover what makes us special'
                ],
                'features' => [
                    'type' => 'array',
                    'default' => []
                ]
            ]
        ]);

        // Register blocks within feature grid layout
        Layout::registerBlock('feature-grid', 'jankx/feature-grid-title', [
            'required' => false,
            'order' => 1
        ]);

        Layout::registerBlock('feature-grid', 'jankx/feature-item', [
            'required' => false,
            'order' => 2
        ]);
    }

    /**
     * Register Contact Form Layout
     */
    private static function registerContactFormLayout()
    {
        Layout::register('contact-form', [
            'name' => 'Contact Form',
            'category' => 'jankx-components',
            'description' => 'A contact form with validation and email integration',
            'icon' => 'contact',
            'supports' => [
                'align' => ['wide'],
                'spacing' => true,
                'background' => true,
                'partial_hydration' => false, // Forms should always be server-rendered
            ],
            'attributes' => [
                'title' => [
                    'type' => 'string',
                    'default' => 'Contact Us'
                ],
                'description' => [
                    'type' => 'string',
                    'default' => 'Get in touch with us'
                ],
                'email' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'phone' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'address' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'successMessage' => [
                    'type' => 'string',
                    'default' => 'Thank you for your message!'
                ]
            ]
        ]);

        // Register blocks within contact form layout
        Layout::registerBlock('contact-form', 'jankx/contact-title', [
            'required' => true,
            'order' => 1
        ]);

        Layout::registerBlock('contact-form', 'jankx/contact-description', [
            'required' => false,
            'order' => 2
        ]);

        Layout::registerBlock('contact-form', 'jankx/contact-fields', [
            'required' => true,
            'order' => 3
        ]);

        Layout::registerBlock('contact-form', 'jankx/contact-submit', [
            'required' => true,
            'order' => 4
        ]);
    }

    /**
     * Register Pricing Table Layout
     */
    private static function registerPricingTableLayout()
    {
        Layout::register('pricing-table', [
            'name' => 'Pricing Table',
            'category' => 'jankx-sections',
            'description' => 'A pricing table with multiple plans and features',
            'icon' => 'pricing',
            'supports' => [
                'align' => ['wide', 'full'],
                'spacing' => true,
                'background' => true,
                'partial_hydration' => true,
            ],
            'attributes' => [
                'title' => [
                    'type' => 'string',
                    'default' => 'Choose Your Plan'
                ],
                'description' => [
                    'type' => 'string',
                    'default' => 'Select the perfect plan for your needs'
                ],
                'plans' => [
                    'type' => 'array',
                    'default' => []
                ],
                'highlightedPlan' => [
                    'type' => 'number',
                    'default' => 1
                ]
            ]
        ]);

        // Register blocks within pricing table layout
        Layout::registerBlock('pricing-table', 'jankx/pricing-title', [
            'required' => false,
            'order' => 1
        ]);

        Layout::registerBlock('pricing-table', 'jankx/pricing-plan', [
            'required' => true,
            'order' => 2
        ]);
    }

    /**
     * Example of how to get and use layout information
     */
    public static function demonstrateUsage()
    {
        // Get all registered layouts
        $allLayouts = Layout::all();
        Logger::info('All registered layouts', ['count' => count($allLayouts)]);

        // Get layouts by category
        $sections = Layout::getByCategory('jankx-sections');
        Logger::info('Section layouts', ['count' => count($sections)]);

        // Get used layouts in current post
        $usedLayouts = Layout::getUsed();
        Logger::info('Used layouts in current post', ['layouts' => $usedLayouts]);

        // Check if specific layout exists
        if (Layout::has('hero-section')) {
            $heroLayout = Layout::get('hero-section');
            Logger::info('Hero layout found', ['name' => $heroLayout['name']]);

            // Get blocks within hero layout
            $heroBlocks = Layout::getBlocks('hero-section');
            Logger::info('Hero layout blocks', ['blocks' => $heroBlocks]);
        }

        // Check partial hydration support
        $supportsHydration = Layout::supportsPartialHydration('hero-section');
        Logger::info('Hero layout partial hydration support', ['supported' => $supportsHydration]);
    }

    /**
     * Example of how to create a custom layout programmatically
     */
    public static function createCustomLayout()
    {
        // Create a custom blog post layout
        Layout::register('blog-post', [
            'name' => 'Blog Post',
            'category' => 'jankx-sections',
            'description' => 'A complete blog post layout with title, content, and meta',
            'icon' => 'blog',
            'supports' => [
                'align' => ['wide', 'full'],
                'spacing' => true,
                'background' => true,
                'partial_hydration' => true,
            ],
            'attributes' => [
                'showAuthor' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'showDate' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'showCategories' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'showTags' => [
                    'type' => 'boolean',
                    'default' => false
                ],
                'showSocialShare' => [
                    'type' => 'boolean',
                    'default' => true
                ]
            ]
        ]);

        // Register blocks for blog post layout
        Layout::registerBlock('blog-post', 'jankx/blog-title', [
            'required' => true,
            'order' => 1
        ]);

        Layout::registerBlock('blog-post', 'jankx/blog-meta', [
            'required' => false,
            'order' => 2
        ]);

        Layout::registerBlock('blog-post', 'jankx/blog-content', [
            'required' => true,
            'order' => 3
        ]);

        Layout::registerBlock('blog-post', 'jankx/blog-footer', [
            'required' => false,
            'order' => 4
        ]);

        Logger::info('Custom blog post layout created');
    }
}