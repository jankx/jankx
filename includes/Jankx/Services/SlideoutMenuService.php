<?php

namespace Jankx\Services;

use Jankx\Foundation\Application;

/**
 * Slideout Menu Service
 *
 * Handles slideout menu business logic and interactions
 *
 * @package Jankx\Services
 * @since 2.0.0
 */
class SlideoutMenuService
{
    /**
     * Application instance
     *
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * Constructor
     *
     * @param \Jankx\Foundation\Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Open slideout menu
     *
     * @return void
     */
    public function open()
    {
        $config = $this->getConfig();

        // Add body class
        add_filter('body_class', function ($classes) use ($config) {
            $classes[] = $config['body_class'];
            return $classes;
        });

        // Trigger custom event
        do_action('jankx_slideout_menu_opened');
    }

    /**
     * Close slideout menu
     *
     * @return void
     */
    public function close()
    {
        $config = $this->getConfig();

        // Remove body class
        add_filter('body_class', function ($classes) use ($config) {
            return array_diff($classes, [$config['body_class']]);
        });

        // Trigger custom event
        do_action('jankx_slideout_menu_closed');
    }

    /**
     * Toggle slideout menu
     *
     * @return void
     */
    public function toggle()
    {
        $config = $this->getConfig();
        $bodyClass = $config['body_class'];

        // Check if menu is open
        $isOpen = in_array($bodyClass, get_body_class());

        if ($isOpen) {
            $this->close();
        } else {
            $this->open();
        }
    }

    /**
     * Get menu state
     *
     * @return bool
     */
    public function isOpen()
    {
        $config = $this->getConfig();
        $bodyClass = $config['body_class'];

        return in_array($bodyClass, get_body_class());
    }

    /**
     * Get menu configuration
     *
     * @return array
     */
    public function getConfig()
    {
        return $this->app->make('config')->get('layout.slideout_menu', []);
    }

    /**
     * Get menu items
     *
     * @return array
     */
    public function getMenuItems()
    {
        $items = [];

        if (has_nav_menu('slideout')) {
            $menu = wp_get_nav_menu_items(get_nav_menu_locations()['slideout']);
            if ($menu) {
                foreach ($menu as $item) {
                    $items[] = [
                        'id' => $item->ID,
                        'title' => $item->title,
                        'url' => $item->url,
                        'target' => $item->target,
                        'classes' => $item->classes,
                        'parent' => $item->menu_item_parent
                    ];
                }
            }
        } else {
            // Default items
            $items[] = [
                'id' => 'home',
                'title' => __('Home', 'jankx'),
                'url' => home_url(),
                'target' => '',
                'classes' => ['menu-item'],
                'parent' => '0'
            ];

            // Add pages
            $pages = get_pages(['sort_column' => 'menu_order']);
            foreach ($pages as $page) {
                $items[] = [
                    'id' => $page->ID,
                    'title' => $page->post_title,
                    'url' => get_permalink($page->ID),
                    'target' => '',
                    'classes' => ['menu-item'],
                    'parent' => '0'
                ];
            }
        }

        return $items;
    }

    /**
     * Build menu tree
     *
     * @param array $items
     * @param string $parent
     * @return array
     */
    public function buildMenuTree($items, $parent = '0')
    {
        $tree = [];

        foreach ($items as $item) {
            if ($item['parent'] === $parent) {
                $children = $this->buildMenuTree($items, $item['id']);
                if ($children) {
                    $item['children'] = $children;
                }
                $tree[] = $item;
            }
        }

        return $tree;
    }

    /**
     * Render menu tree as HTML
     *
     * @param array $tree
     * @param int $level
     * @return string
     */
    public function renderMenuTree($tree, $level = 0)
    {
        if (empty($tree)) {
            return '';
        }

        $html = '<ul class="slideout-menu-level-' . $level . '">';

        foreach ($tree as $item) {
            $classes = implode(' ', $item['classes']);
            $target = $item['target'] ? ' target="' . esc_attr($item['target']) . '"' : '';

            $html .= '<li class="' . esc_attr($classes) . '">';
            $html .= '<a href="' . esc_url($item['url']) . '"' . $target . '>';
            $html .= esc_html($item['title']);
            $html .= '</a>';

            if (isset($item['children'])) {
                $html .= $this->renderMenuTree($item['children'], $level + 1);
            }

            $html .= '</li>';
        }

        $html .= '</ul>';

        return $html;
    }

    /**
     * Get menu statistics
     *
     * @return array
     */
    public function getMenuStats()
    {
        $items = $this->getMenuItems();
        $tree = $this->buildMenuTree($items);

        $stats = [
            'total_items' => count($items),
            'top_level_items' => count($tree),
            'has_children' => false,
            'max_depth' => 0
        ];

        // Check for children and max depth
        foreach ($tree as $item) {
            if (isset($item['children'])) {
                $stats['has_children'] = true;
                $depth = $this->getItemDepth($item);
                $stats['max_depth'] = max($stats['max_depth'], $depth);
            }
        }

        return $stats;
    }

    /**
     * Get item depth
     *
     * @param array $item
     * @param int $current
     * @return int
     */
    protected function getItemDepth($item, $current = 1)
    {
        if (!isset($item['children'])) {
            return $current;
        }

        $maxDepth = $current;
        foreach ($item['children'] as $child) {
            $depth = $this->getItemDepth($child, $current + 1);
            $maxDepth = max($maxDepth, $depth);
        }

        return $maxDepth;
    }

    /**
     * Clear menu cache
     *
     * @return void
     */
    public function clearCache()
    {
        wp_cache_delete('slideout_menu_items', 'jankx');
        wp_cache_delete('slideout_menu_tree', 'jankx');
        wp_cache_delete('slideout_menu_stats', 'jankx');
    }
}
