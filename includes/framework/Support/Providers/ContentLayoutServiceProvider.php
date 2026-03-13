<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Layouts\ContentLayout\ContentLayoutManager;
use Jankx\Support\Providers\ServiceProvider;

class ContentLayoutServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        $app->singleton(ContentLayoutManager::class, function () {
            return ContentLayoutManager::getInstance();
        });
    }

    public function boot(Application $app)
    {
        $context = $this->getLoadingContext();
        if (in_array($context, ['cron', 'cli'])) {
            return;
        }

        $manager = $app->make(ContentLayoutManager::class);

        // Register default layouts via PHP array
        static $defaultLayouts = null;
        if ($defaultLayouts === null) {
            $defaultLayouts = $this->getDefaultLayouts();
        }

        foreach ($defaultLayouts as $layoutData) {
            $manager->register($layoutData);
        }
        
        // Hook to allow other plugins/themes to register layouts
        do_action('jankx/layout/content-layout/register', $manager);
    }

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
