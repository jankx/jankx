<?php

namespace Jankx\Bootstrappers\Global;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Jankx\Helpers\ThemeSupportHelper;
use Jankx\Helpers\BootstrapperHelper;

/**
 * Theme Bootstrapper
 *
 * Handles theme initialization and setup
 *
 * @package Jankx\Bootstrappers\Global
 * @since 2.0.0
 */
class ThemeBootstrapper extends AbstractBootstrapper
{
    protected $priority = 10;

    /**
     * Method getName
     *
     * @since 2.0.0
     */
    public function getName(): string
    {
        return 'theme';
    }

    /**
     * Method shouldRun
     *
     * @since 2.0.0
     */
    public function shouldRun(): bool
    {
        return true; // Theme bootstrapper always runs
    }

    /**
     * Method bootstrap
     *
     * @since 2.0.0
     */
    public function bootstrap(Container $container): void
    {
        add_action('after_setup_theme', [$this, 'setupTheme']);
        add_action('init', [$this, 'initializeThemeFeatures']);
        // Fire loaded action
        BootstrapperHelper::fireLoadedAction($this->getName(), $container);
    }

    /**
     * Method setupTheme
     *
     * @since 2.0.0
     */
    public function setupTheme(): void
    {
        // Add all theme supports using helper
        ThemeSupportHelper::addBasicSupports();
        ThemeSupportHelper::addGutenbergSupports();
        ThemeSupportHelper::registerNavigationMenus();
        ThemeSupportHelper::loadTextDomain();
    }

    /**
     * Method initializeThemeFeatures
     *
     * @since 2.0.0
     */
    public function initializeThemeFeatures(): void
    {
        // Add theme-specific initialization logic here

        // Add custom image sizes
        ThemeSupportHelper::addCustomImageSizes();

        // Add custom logo support
        ThemeSupportHelper::addCustomLogoSupport();

        // Add custom background
        ThemeSupportHelper::addCustomBackgroundSupport();

        // Add custom header
        ThemeSupportHelper::addCustomHeaderSupport();

        // Add editor color palette
        ThemeSupportHelper::addEditorColorPalette();

        // Add editor font sizes
        ThemeSupportHelper::addEditorFontSizes();
    }
}
