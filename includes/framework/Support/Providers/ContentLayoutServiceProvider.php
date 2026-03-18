<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Layouts\ContentLayout\ContentLayoutManager;
use Jankx\Layouts\DynamicDataLayout\LayoutRegistry;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager;
use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutFactory;
use Jankx\Services\ViewService;
use Jankx\Support\Providers\ServiceProvider;

/**
 * Content Layout Service Provider
 * 
 * Manages the registration and wiring of layout-related services:
 * - ContentLayoutManager (Legacy support)
 * - LayoutRegistry (Modern Registry)
 * - BlockTemplateLayoutManager (Layout service)
 * - ViewService (Template rendering)
 */
class ContentLayoutServiceProvider extends ServiceProvider
{
    /**
     * Register services
     * 
     * @param Application $app
     */
    public function register(Application $app)
    {
        // 1. Register View Service for template rendering
        $app->singleton(ViewService::class, function ($app) {
            return new ViewService($app);
        });
        $app->alias(ViewService::class, 'view');

        // 2. Register Layout Registry (Strategy manager)
        $app->singleton(LayoutRegistry::class, function () {
            return new LayoutRegistry();
        });
        $app->alias(LayoutRegistry::class, 'jankx.layout.registry');

        // 3. Register Block Template Layout Manager
        $app->singleton(BlockTemplateLayoutManager::class, function ($app) {
            return new BlockTemplateLayoutManager($app->make(LayoutRegistry::class));
        });
        $app->alias(BlockTemplateLayoutManager::class, 'jankx.block_layout_manager');

        // 4. Legacy: Content Layout Manager
        $app->singleton(ContentLayoutManager::class, function () {
            return ContentLayoutManager::getInstance();
        });

        $app->singleton(\Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager::class, function ($app) {
           return $app->make(BlockTemplateLayoutManager::class);
        });
    }

    /**
     * Bootstrap services
     * 
     * @param Application $app
     */
    public function boot(Application $app)
    {
        $context = $this->getLoadingContext();
        if (in_array($context, ['cron', 'cli'])) {
            return;
        }

        // Initialize core layouts in the Registry
        $this->registerCoreLayouts($app->make(LayoutRegistry::class));

        // Legacy: Register default layouts in ContentLayoutManager
        $manager = $app->make(ContentLayoutManager::class);
        $defaultLayouts = $this->getDefaultLayouts();
        foreach ($defaultLayouts as $layoutData) {
            $manager->register($layoutData);
        }
        
        do_action('jankx/layout/content-layout/register', $manager);
    }

    /**
     * Dynamically register core layouts into the modern Registry
     * 
     * @param LayoutRegistry $registry
     */
    protected function registerCoreLayouts(LayoutRegistry $registry): void
    {
        // We can reuse the init logic from the Factory during transition, 
        // or register them manually here. Let's do a mix to ensure compatibility.
        BlockTemplateLayoutFactory::init();
        $layouts = BlockTemplateLayoutFactory::getRegisteredLayouts();

        foreach ($layouts as $name => $class) {
            $registry->register($name, $class);
        }
    }

    /**
     * Default layouts for legacy ContentLayoutManager
     */
    protected function getDefaultLayouts()
    {
        return [
            [
                'name' => 'jankx/card-overlay',
                'title' => 'Card Overlay',
                'category' => 'card',
                'description' => 'Card layout with content overlay on image',
                'version' => '1.0.0',
                'icon' => '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 5H5v14h14V5zM5 3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5z"/><path d="M5 14h14v5H5z" opacity=".3"/></svg>',
                'svgSkeleton' => '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="150" fill="#f0f0f0"/><rect x="10" y="110" width="80" height="10" fill="#ccc"/><rect x="10" y="130" width="50" height="8" fill="#ddd"/></svg>',
                'template' => [
                    [
                        'core/cover',
                        [
                            'overlayColor' => 'black',
                            'dimRatio' => 50,
                            'align' => 'full'
                        ],
                        [
                            [
                                'core/group',
                                [
                                    'layout' => [
                                        'type' => 'flex',
                                        'orientation' => 'vertical',
                                        'justifyContent' => 'left'
                                    ]
                                ],
                                [
                                    [
                                        'core/post-title',
                                        [
                                            'level' => 3,
                                            'isLink' => true,
                                            'style' => [
                                                'typography' => [
                                                    'fontSize' => '24px'
                                                ],
                                                'color' => [
                                                    'text' => '#ffffff'
                                                ]
                                            ]
                                        ]
                                    ],
                                    [
                                        'core/post-date',
                                        [
                                            'style' => [
                                                'color' => [
                                                    'text' => '#eeeeee'
                                                ],
                                                'typography' => [
                                                    'fontSize' => '14px'
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            [
                'name' => 'jankx/simple-card',
                'title' => 'Simple Card',
                'category' => 'card',
                'description' => 'Standard card with image on top',
                'version' => '1.0.0',
                'icon' => '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" fill="none" stroke-width="2"/><rect x="4" y="4" width="16" height="10" fill="currentColor" opacity="0.2"/><line x1="6" y1="17" x2="18" y2="17" stroke="currentColor" stroke-width="2"/></svg>',
                'svgSkeleton' => '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="80" fill="#ddd"/><rect x="10" y="90" width="80" height="10" fill="#ccc"/><rect x="10" y="110" width="80" height="30" fill="#eee"/></svg>',
                'template' => [
                    [
                        'core/post-featured-image',
                        [
                            'isLink' => true,
                            'aspectRatio' => '16/9'
                        ]
                    ],
                    [
                        'core/group',
                        [
                            'style' => [
                                'spacing' => [
                                    'padding' => [
                                        'top' => '1rem',
                                        'bottom' => '1rem'
                                    ]
                                ]
                            ]
                        ],
                        [
                            [
                                'core/post-title',
                                [
                                    'isLink' => true,
                                    'level' => 3
                                ]
                            ],
                            [
                                'core/post-excerpt',
                                [
                                    'showMoreOnNewLine' => false
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];
    }
}

