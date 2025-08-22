<?php

namespace Jankx\Managers;

use Jankx\Contracts\ServiceProvider;

/**
 * URL Manager for handling all asset URLs
 */
class UrlManager
{
    /**
     * Get theme directory URL
     *
     * @return string
     */
    public function getThemeUrl()
    {
        return get_template_directory_uri();
    }

    /**
     * Get child theme directory URL
     *
     * @return string
     */
    public function getChildThemeUrl()
    {
        return get_stylesheet_directory_uri();
    }

    /**
     * Get asset URL from theme directory
     *
     * @param string $path Asset path relative to theme directory
     * @return string
     */
    public function asset($path)
    {
        return $this->getThemeUrl() . '/assets/' . ltrim($path, '/');
    }

    /**
     * Get block asset URL
     *
     * @param string $path Asset path relative to resources/blocks
     * @return string
     */
    public function blockAsset($path)
    {
        return $this->getThemeUrl() . '/resources/blocks/' . ltrim($path, '/');
    }

    /**
     * Get image URL
     *
     * @param string $path Image path relative to assets/images
     * @return string
     */
    public function image($path)
    {
        return $this->asset('images/' . ltrim($path, '/'));
    }

    /**
     * Get CSS URL
     *
     * @param string $path CSS path relative to assets/css
     * @return string
     */
    public function css($path)
    {
        return $this->asset('css/' . ltrim($path, '/'));
    }

    /**
     * Get JavaScript URL
     *
     * @param string $path JS path relative to assets/js
     * @return string
     */
    public function js($path)
    {
        return $this->asset('js/' . ltrim($path, '/'));
    }

    /**
     * Get vendor asset URL
     *
     * @param string $path Vendor asset path
     * @return string
     */
    public function vendor($path)
    {
        return $this->getThemeUrl() . '/vendor/' . ltrim($path, '/');
    }

    /**
     * Get uploads directory URL
     *
     * @param string $path Path relative to uploads directory
     * @return string
     */
    public function uploads($path = '')
    {
        $uploads = wp_upload_dir();
        return $uploads['baseurl'] . '/' . ltrim($path, '/');
    }

    /**
     * Get site URL
     *
     * @param string $path Path relative to site URL
     * @return string
     */
    public function site($path = '')
    {
        return get_site_url() . '/' . ltrim($path, '/');
    }

    /**
     * Get home URL
     *
     * @param string $path Path relative to home URL
     * @return string
     */
    public function home($path = '')
    {
        $homeUrl = get_home_url();
        if (empty($path)) {
            return $homeUrl;
        }
        return $homeUrl . '/' . ltrim($path, '/');
    }

    /**
     * Get admin URL
     *
     * @param string $path Path relative to admin URL
     * @return string
     */
    public function admin($path = '')
    {
        $adminUrl = get_admin_url();
        if (empty($path)) {
            return $adminUrl;
        }
        return $adminUrl . '/' . ltrim($path, '/');
    }

    /**
     * Get content URL
     *
     * @param string $path Path relative to content URL
     * @return string
     */
    public function content($path = '')
    {
        return content_url('/' . ltrim($path, '/'));
    }

    /**
     * Get includes URL
     *
     * @param string $path Path relative to includes directory
     * @return string
     */
    public function includes($path = '')
    {
        return $this->getThemeUrl() . '/includes/' . ltrim($path, '/');
    }

    /**
     * Get resources URL
     *
     * @param string $path Path relative to resources directory
     * @return string
     */
    public function resources($path = '')
    {
        return $this->getThemeUrl() . '/resources/' . ltrim($path, '/');
    }
}
