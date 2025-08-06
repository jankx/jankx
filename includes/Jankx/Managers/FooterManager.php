<?php

namespace Jankx\Managers;

use Jankx\Foundation\Application;

/**
 * Footer Manager
 *
 * Handles footer content and structure for Jankx Framework
 *
 * @package Jankx\Managers
 * @since 2.0.0
 */
class FooterManager
{
    protected $app;
    protected $footerConfig = [];

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->setupHooks();
    }

    /**
     * Setup WordPress hooks
     *
     * @return void
     */
    protected function setupHooks()
    {
        add_action('widgets_init', [$this, 'registerFooterWidgets']);
    }

    /**
     * Register footer widgets based on config
     *
     * @return void
     */
    public function registerFooterWidgets()
    {
        $footer_config = $this->getFooterConfig();

        // Footer widgets columns
        $footer_columns = $footer_config['widgets']['columns'] ?? 3;

        for ($i = 1; $i <= $footer_columns; $i++) {
            $footer_widget = apply_filters("jankx/layout/footer/widgets/column_{$i}", [
                'name' => "Footer Widget {$i}",
                'id' => "footer-widget-{$i}",
                'description' => "Footer widget area {$i}",
                'before_widget' => '<div id="%1$s" class="widget %2$s">',
                'after_widget' => '</div>',
                'before_title' => '<h4 class="widget-title">',
                'after_title' => '</h4>',
            ]);

            register_sidebar($footer_widget);
        }
    }

    /**
     * Get footer menu
     *
     * @param array $args
     * @return string
     */
    public function getFooterMenu($args = [])
    {
        $menuManager = $this->app->make('layout.menu');
        return $menuManager->getFooterMenu($args);
    }

    /**
     * Get footer widgets
     *
     * @return string
     */
    public function getFooterWidgets()
    {
        $footerConfig = $this->getFooterConfig();
        $columns = $footerConfig['widgets']['columns'] ?? 3;

        $output = '<div class="footer-widgets">';

        for ($i = 1; $i <= $columns; $i++) {
            $widget_area = "footer-widget-{$i}";

            if (is_active_sidebar($widget_area)) {
                $output .= sprintf(
                    '<div class="footer-widget-column footer-widget-column-%d">',
                    $i
                );
                ob_start();
                dynamic_sidebar($widget_area);
                $output .= ob_get_clean();
                $output .= '</div>';
            }
        }

        $output .= '</div>';

        return $output;
    }

    /**
     * Get footer content
     *
     * @return string
     */
    public function getFooterContent()
    {
        $footerConfig = $this->getFooterConfig();
        $content = $footerConfig['content'] ?? '';

        return apply_filters('jankx/layout/footer/content', $content);
    }

    /**
     * Render complete footer
     *
     * @return string
     */
    public function renderFooter()
    {
        $footerConfig = $this->getFooterConfig();

        $output = '<footer class="site-footer">';

        // Footer widgets
        if (!empty($footerConfig['widgets']['enabled'])) {
            $output .= $this->getFooterWidgets();
        }

        // Footer menu
        if (!empty($footerConfig['menu']['enabled'])) {
            $output .= '<div class="footer-menu-wrapper">';
            $output .= $this->getFooterMenu();
            $output .= '</div>';
        }

        // Footer content
        $footer_content = $this->getFooterContent();
        if ($footer_content) {
            $output .= '<div class="footer-content">';
            $output .= $footer_content;
            $output .= '</div>';
        }

        $output .= '</footer>';

        return apply_filters('jankx/layout/footer/render', $output);
    }

    /**
     * Check if footer menu is enabled
     *
     * @return bool
     */
    public function isFooterMenuEnabled()
    {
        $footerConfig = $this->getFooterConfig();
        return !empty($footerConfig['menu']['enabled']);
    }

    /**
     * Check if footer widgets are enabled
     *
     * @return bool
     */
    public function isFooterWidgetsEnabled()
    {
        $footerConfig = $this->getFooterConfig();
        return !empty($footerConfig['widgets']['enabled']);
    }

    /**
     * Get footer widget columns count
     *
     * @return int
     */
    public function getFooterWidgetColumns()
    {
        $footerConfig = $this->getFooterConfig();
        return $footerConfig['widgets']['columns'] ?? 3;
    }

    /**
     * Set footer configuration
     *
     * @param array $config
     * @return void
     */
    public function setFooterConfig(array $config)
    {
        $this->footerConfig = $config;
    }

    /**
     * Get footer configuration
     *
     * @return array
     */
    public function getFooterConfig()
    {
        if (!empty($this->footerConfig)) {
            return $this->footerConfig;
        }

        return \Jankx\Facades\Config::get('layout.footer', []);
    }

    /**
     * Check if footer has content
     *
     * @return bool
     */
    public function hasFooterContent()
    {
        return $this->isFooterMenuEnabled() ||
               $this->isFooterWidgetsEnabled() ||
               !empty($this->getFooterContent());
    }

    /**
     * Get footer widget areas
     *
     * @return array
     */
    public function getFooterWidgetAreas()
    {
        $columns = $this->getFooterWidgetColumns();
        $areas = [];

        for ($i = 1; $i <= $columns; $i++) {
            $areas[] = "footer-widget-{$i}";
        }

        return $areas;
    }

    /**
     * Check if footer widget area is active
     *
     * @param int $column
     * @return bool
     */
    public function isFooterWidgetActive($column)
    {
        $widget_area = "footer-widget-{$column}";
        return is_active_sidebar($widget_area);
    }

    /**
     * Get footer widget content
     *
     * @param int $column
     * @return string
     */
    public function getFooterWidgetContent($column)
    {
        $widget_area = "footer-widget-{$column}";

        if (!is_active_sidebar($widget_area)) {
            return '';
        }

        ob_start();
        dynamic_sidebar($widget_area);
        return ob_get_clean();
    }

    /**
     * Get footer layout class
     *
     * @return string
     */
    public function getFooterLayoutClass()
    {
        $footerConfig = $this->getFooterConfig();
        $layout = $footerConfig['layout'] ?? 'default';

        return 'footer-layout-' . $layout;
    }
}
