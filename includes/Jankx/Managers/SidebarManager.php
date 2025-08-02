<?php

namespace Jankx\Managers;

use Jankx\Foundation\Application;

/**
 * Sidebar Manager
 *
 * Handles sidebar and widget area management for Jankx Framework
 *
 * @package Jankx\Managers
 * @since 2.0.0
 */
class SidebarManager
{
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Get sidebar by ID
     *
     * @param string $sidebar_id
     * @return string
     */
    public function getSidebar($sidebar_id)
    {
        ob_start();
        dynamic_sidebar($sidebar_id);
        return ob_get_clean();
    }

    /**
     * Get primary sidebar
     *
     * @return string
     */
    public function getPrimarySidebar()
    {
        return $this->renderSidebar('primary-sidebar', [
            'wrapper_class' => 'sidebar primary-sidebar',
            'wrapper_id' => 'primary-sidebar',
        ]);
    }

    /**
     * Get secondary sidebar
     *
     * @return string
     */
    public function getSecondarySidebar()
    {
        return $this->renderSidebar('secondary-sidebar', [
            'wrapper_class' => 'sidebar secondary-sidebar',
            'wrapper_id' => 'secondary-sidebar',
        ]);
    }

    /**
     * Check if sidebar is active
     *
     * @param string $sidebar_id
     * @return bool
     */
    public function isSidebarActive($sidebar_id)
    {
        return is_active_sidebar($sidebar_id);
    }

    /**
     * Check if primary sidebar is active
     *
     * @return bool
     */
    public function isPrimarySidebarActive()
    {
        return $this->isSidebarActive('primary-sidebar');
    }

    /**
     * Check if secondary sidebar is active
     *
     * @return bool
     */
    public function isSecondarySidebarActive()
    {
        return $this->isSidebarActive('secondary-sidebar');
    }

    /**
     * Get all registered sidebars
     *
     * @return array
     */
    public function getRegisteredSidebars()
    {
        global $wp_registered_sidebars;
        return $wp_registered_sidebars;
    }

    /**
     * Get sidebar data by ID
     *
     * @param string $sidebar_id
     * @return array|null
     */
    public function getSidebarData($sidebar_id)
    {
        $sidebars = $this->getRegisteredSidebars();
        return isset($sidebars[$sidebar_id]) ? $sidebars[$sidebar_id] : null;
    }

    /**
     * Render sidebar with wrapper
     *
     * @param string $sidebar_id
     * @param array $args
     * @return string
     */
    public function renderSidebar($sidebar_id, $args = [])
    {
        $defaults = [
            'wrapper_class' => 'sidebar',
            'wrapper_id' => 'sidebar-' . $sidebar_id,
            'title' => '',
            'show_title' => true,
        ];

        $args = wp_parse_args($args, $defaults);

        if (!$this->isSidebarActive($sidebar_id)) {
            return '';
        }

        $sidebar_data = $this->getSidebarData($sidebar_id);
        $title = $args['title'] ?: ($sidebar_data['name'] ?? '');

        $output = sprintf(
            '<aside class="%s" id="%s">',
            esc_attr($args['wrapper_class']),
            esc_attr($args['wrapper_id'])
        );

        if ($args['show_title'] && $title) {
            $output .= sprintf('<h3 class="sidebar-title">%s</h3>', esc_html($title));
        }

        $output .= $this->getSidebar($sidebar_id);
        $output .= '</aside>';

        return $output;
    }

    /**
     * Check if current page should show sidebar
     *
     * @return bool
     */
    public function shouldShowSidebar()
    {
        // Don't show sidebar on full-width pages
        if (is_page_template('page-full-width.php')) {
            return false;
        }

        // Don't show sidebar on 404 pages
        if (is_404()) {
            return false;
        }

        // Show sidebar if primary sidebar is active
        return $this->isPrimarySidebarActive();
    }

    /**
     * Get sidebar layout class
     *
     * @return string
     */
    public function getSidebarLayoutClass()
    {
        if (!$this->shouldShowSidebar()) {
            return 'no-sidebar';
        }

        // Check for custom layout
        $layout = get_theme_mod('sidebar_layout', 'right');

        return 'sidebar-' . $layout;
    }

    /**
     * Get widget count in sidebar
     *
     * @param string $sidebar_id
     * @return int
     */
    public function getWidgetCount($sidebar_id)
    {
        $sidebars_widgets = wp_get_sidebars_widgets();

        if (!isset($sidebars_widgets[$sidebar_id])) {
            return 0;
        }

        return count($sidebars_widgets[$sidebar_id]);
    }

    /**
     * Get sidebar configuration
     *
     * @return array
     */
    public function getSidebarConfig()
    {
        return \Jankx\Facades\Config::get('layout.sidebar', []);
    }

    /**
     * Check if sidebar is enabled in config
     *
     * @param string $sidebar_type
     * @return bool
     */
    public function isSidebarEnabled($sidebar_type)
    {
        $config = $this->getSidebarConfig();
        return !empty($config[$sidebar_type]);
    }

    /**
     * Check if primary sidebar is enabled
     *
     * @return bool
     */
    public function isPrimarySidebarEnabled()
    {
        return $this->isSidebarEnabled('primary');
    }

    /**
     * Check if secondary sidebar is enabled
     *
     * @return bool
     */
    public function isSecondarySidebarEnabled()
    {
        return $this->isSidebarEnabled('secondary');
    }
}
