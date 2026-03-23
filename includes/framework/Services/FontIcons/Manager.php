<?php

namespace Jankx\Services\FontIcons;

use Jankx\Foundation\Application;
use Jankx\Facades\Fonts;

class Manager
{
    protected $app;
    protected $repository;
    protected $renderer;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->repository = $app->make('font-icons.repository');
        $this->renderer = $app->make('font-icons.renderer');
    }

    /**
     * Register font icon from CSS URL
     */
    public function register($cssUrl, $iconType, $displayName = null, $autoLoad = false, $transformer = null)
    {
        // Import icon data via repository
        // Repository will handle storage, config, and auto-loading flag
        $result = $this->repository->importFromCssUrl($cssUrl, $iconType, $displayName, $autoLoad, $transformer);

        if ($result['success']) {
            // Trigger action hook
            do_action('jankx_font_icons_registered', $iconType, $result['data']);
        }

        return $result;
    }

    /**
     * Built-in Icon Set Registrations
     */
    public function fontAwesome($version = '6.5.1', $autoLoad = false)
    {
        $cssUrl = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/{$version}/css/all.min.css";
        return $this->register($cssUrl, 'fontawesome', 'Font Awesome', $autoLoad);
    }

    public function materialIcons($autoLoad = false)
    {
        $cssUrl = "https://fonts.googleapis.com/icon?family=Material+Icons";
        return $this->register($cssUrl, 'material', 'Material Icons', $autoLoad);
    }

    public function bootstrapIcons($version = '1.11.3', $autoLoad = false)
    {
        $cssUrl = "https://cdn.jsdelivr.net/npm/bootstrap-icons@{$version}/font/bootstrap-icons.css";
        return $this->register($cssUrl, 'bootstrap', 'Bootstrap Icons', $autoLoad);
    }

    // Proxy methods to repository
    public function all()
    {
        return $this->repository->getIconTypes();
    }

    public function get($iconType, $filters = [])
    {
        return $this->repository->getIconsByType($iconType, $filters);
    }

    public function search($query, $type = null)
    {
        return $this->repository->searchIcons($query, $type);
    }

    public function has($iconType)
    {
        return $this->repository->hasIconType($iconType);
    }

    public function remove($iconType)
    {
        return $this->repository->removeIconType($iconType);
    }

    public function clearCache()
    {
        return $this->repository->clearCache();
    }

    public function stats()
    {
        return $this->repository->getStats();
    }

    // Proxy methods to renderer
    public function render($iconName, $type = 'fontawesome', $attributes = [])
    {
        return $this->renderer->render($iconName, $type, $attributes);
    }
}
