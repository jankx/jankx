<?php

namespace Jankx\Gutenberg\Examples;

use Jankx\Facades\Template;
use Jankx\Facades\Logger;

/**
 * Layout Template Examples
 *
 * Examples of how to use the Jankx Layout Template system.
 * This file demonstrates various ways to register and use templates.
 */
class TemplateExamples
{
    /**
     * Register custom templates
     */
    public static function registerCustomTemplates()
    {
        // Register a custom blog post template
        Template::register('blog-post', [
            'name' => 'Blog Post',
            'description' => 'A complete blog post layout with title, content, and meta',
            'template' => 'blog-post.html',
            'variables' => [
                'title' => '',
                'content' => '',
                'author' => '',
                'date' => '',
                'categories' => [],
                'tags' => [],
                'featuredImage' => '',
                'showAuthor' => true,
                'showDate' => true,
                'showCategories' => true,
                'showTags' => false,
                'showSocialShare' => true
            ],
            'blocks' => [
                'blog-title' => [
                    'required' => true,
                    'order' => 1,
                    'template' => 'blocks/blog-title.html'
                ],
                'blog-meta' => [
                    'required' => false,
                    'order' => 2,
                    'template' => 'blocks/blog-meta.html'
                ],
                'blog-content' => [
                    'required' => true,
                    'order' => 3,
                    'template' => 'blocks/blog-content.html'
                ],
                'blog-footer' => [
                    'required' => false,
                    'order' => 4,
                    'template' => 'blocks/blog-footer.html'
                ]
            ]
        ]);

        // Register a custom pricing table template
        Template::register('pricing-table', [
            'name' => 'Pricing Table',
            'description' => 'A pricing table with multiple plans and features',
            'template' => 'pricing-table.html',
            'variables' => [
                'title' => 'Choose Your Plan',
                'description' => 'Select the perfect plan for your needs',
                'plans' => [],
                'highlightedPlan' => 1
            ],
            'blocks' => [
                'pricing-title' => [
                    'required' => false,
                    'order' => 1,
                    'template' => 'blocks/pricing-title.html'
                ],
                'pricing-plan' => [
                    'required' => true,
                    'order' => 2,
                    'template' => 'blocks/pricing-plan.html'
                ]
            ]
        ]);

        Logger::debug('Custom templates registered', [
            'total_custom_templates' => 2
        ]);
    }

    /**
     * Demonstrate template usage
     */
    public static function demonstrateUsage()
    {
        // Get all templates
        $allTemplates = Template::all();
        Logger::info('All registered templates', ['count' => count($allTemplates)]);

        // Get specific template
        $heroTemplate = Template::get('hero-section');
        Logger::info('Hero template found', ['name' => $heroTemplate['name']]);

        // Check if template exists
        if (Template::has('hero-section')) {
            Logger::info('Hero template exists');
        }

        // Get template variables
        $attributes = [
            'title' => 'Welcome to Our Site',
            'description' => 'Discover amazing features',
            'buttonText' => 'Get Started',
            'buttonUrl' => '#',
            'alignment' => 'center',
            'spacing' => 'loose'
        ];

        $variables = Template::getVariables('hero-section', $attributes);
        Logger::info('Hero template variables', ['variables' => $variables]);

        // Get template blocks
        $blocks = Template::getBlocks('hero-section');
        Logger::info('Hero template blocks', ['blocks' => $blocks]);

        // Check if template has specific block
        if (Template::hasBlock('hero-section', 'hero-title')) {
            Logger::info('Hero template has title block');
        }

        // Get block configuration
        $titleBlock = Template::getBlock('hero-section', 'hero-title');
        Logger::info('Hero title block config', ['config' => $titleBlock]);
    }

    /**
     * Demonstrate template rendering
     */
    public static function demonstrateRendering()
    {
        // Render a layout template
        $attributes = [
            'title' => 'Welcome to Our Site',
            'description' => 'Discover amazing features and services',
            'buttonText' => 'Get Started',
            'buttonUrl' => '#',
            'backgroundImage' => 'https://example.com/hero-bg.jpg',
            'overlay' => true,
            'alignment' => 'center',
            'spacing' => 'loose'
        ];

        $content = '<div class="custom-content">Custom content here</div>';

        $renderedHtml = Template::render('hero-section', $attributes, $content);
        Logger::info('Hero template rendered', ['html_length' => strlen($renderedHtml)]);

        // Render specific blocks
        $blockConfig = [
            'required' => true,
            'order' => 1,
            'template' => 'blocks/hero-title.html'
        ];

        $variables = [
            'title' => 'Welcome to Our Site',
            'fontSize' => 'large',
            'textColor' => '#ffffff',
            'alignment' => 'center'
        ];

        $blockHtml = Template::renderBlock('hero-title', $blockConfig, $variables);
        Logger::info('Hero title block rendered', ['html_length' => strlen($blockHtml)]);

        // Render all blocks for a layout
        $allBlocksHtml = Template::renderBlocks('hero-section', $variables);
        Logger::info('All hero blocks rendered', ['html_length' => strlen($allBlocksHtml)]);
    }

    /**
     * Create dynamic templates
     */
    public static function createDynamicTemplates()
    {
        // Create a dynamic product grid template
        Template::register('product-grid', [
            'name' => 'Product Grid',
            'description' => 'A dynamic product grid with filtering',
            'template' => 'product-grid.html',
            'variables' => [
                'title' => 'Our Products',
                'description' => 'Browse our latest products',
                'columns' => 4,
                'products' => [],
                'showFilters' => true,
                'showPagination' => true
            ],
            'blocks' => [
                'product-grid-header' => [
                    'required' => false,
                    'order' => 1,
                    'template' => 'blocks/product-grid-header.html'
                ],
                'product-filters' => [
                    'required' => false,
                    'order' => 2,
                    'template' => 'blocks/product-filters.html'
                ],
                'product-item' => [
                    'required' => true,
                    'order' => 3,
                    'template' => 'blocks/product-item.html'
                ],
                'product-pagination' => [
                    'required' => false,
                    'order' => 4,
                    'template' => 'blocks/product-pagination.html'
                ]
            ]
        ]);

        // Create a dynamic team member template
        Template::register('team-member', [
            'name' => 'Team Member',
            'description' => 'A team member profile with social links',
            'template' => 'team-member.html',
            'variables' => [
                'name' => '',
                'position' => '',
                'bio' => '',
                'avatar' => '',
                'email' => '',
                'phone' => '',
                'socialLinks' => []
            ],
            'blocks' => [
                'team-member-avatar' => [
                    'required' => false,
                    'order' => 1,
                    'template' => 'blocks/team-member-avatar.html'
                ],
                'team-member-info' => [
                    'required' => true,
                    'order' => 2,
                    'template' => 'blocks/team-member-info.html'
                ],
                'team-member-social' => [
                    'required' => false,
                    'order' => 3,
                    'template' => 'blocks/team-member-social.html'
                ]
            ]
        ]);

        Logger::debug('Dynamic templates created', [
            'total_dynamic_templates' => 2
        ]);
    }

    /**
     * Create conditional templates
     */
    public static function createConditionalTemplates()
    {
        // Create a conditional FAQ template
        Template::register('faq-section', [
            'name' => 'FAQ Section',
            'description' => 'A FAQ section with expandable answers',
            'template' => 'faq-section.html',
            'variables' => [
                'title' => 'Frequently Asked Questions',
                'description' => 'Find answers to common questions',
                'faqs' => [],
                'showSearch' => true,
                'showCategories' => false,
                'expandAll' => false
            ],
            'blocks' => [
                'faq-header' => [
                    'required' => false,
                    'order' => 1,
                    'template' => 'blocks/faq-header.html'
                ],
                'faq-search' => [
                    'required' => false,
                    'order' => 2,
                    'template' => 'blocks/faq-search.html',
                    'condition' => [
                        'variable' => 'showSearch',
                        'value' => true
                    ]
                ],
                'faq-categories' => [
                    'required' => false,
                    'order' => 3,
                    'template' => 'blocks/faq-categories.html',
                    'condition' => [
                        'variable' => 'showCategories',
                        'value' => true
                    ]
                ],
                'faq-item' => [
                    'required' => true,
                    'order' => 4,
                    'template' => 'blocks/faq-item.html'
                ]
            ]
        ]);

        Logger::debug('Conditional templates created', [
            'total_conditional_templates' => 1
        ]);
    }

    /**
     * Create responsive templates
     */
    public static function createResponsiveTemplates()
    {
        // Create a responsive gallery template
        Template::register('gallery-grid', [
            'name' => 'Gallery Grid',
            'description' => 'A responsive image gallery with lightbox',
            'template' => 'gallery-grid.html',
            'variables' => [
                'title' => 'Our Gallery',
                'description' => 'Browse our photo collection',
                'images' => [],
                'columns' => 3,
                'showLightbox' => true,
                'showCaptions' => true,
                'lazyLoad' => true
            ],
            'blocks' => [
                'gallery-header' => [
                    'required' => false,
                    'order' => 1,
                    'template' => 'blocks/gallery-header.html'
                ],
                'gallery-grid' => [
                    'required' => true,
                    'order' => 2,
                    'template' => 'blocks/gallery-grid.html'
                ],
                'gallery-lightbox' => [
                    'required' => false,
                    'order' => 3,
                    'template' => 'blocks/gallery-lightbox.html',
                    'condition' => [
                        'variable' => 'showLightbox',
                        'value' => true
                    ]
                ]
            ]
        ]);

        Logger::debug('Responsive templates created', [
            'total_responsive_templates' => 1
        ]);
    }
}