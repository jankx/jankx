<?php

namespace Jankx\Bootstrappers\Global;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Jankx\Helpers\ThemeSupportHelper;
use Jankx\Helpers\BootstrapperHelper;

class ThemeBootstrapper extends AbstractBootstrapper
{
    protected $priority = 10;

    public function getName(): string
    {
        return 'theme';
    }

    public function shouldRun(): bool
    {
        return true; // Theme bootstrapper always runs
    }

    public function bootstrap(Container $container): void
    {
        add_action('after_setup_theme', [$this, 'setupTheme']);
        add_action('init', [$this, 'initializeThemeFeatures']);
        // Fire loaded action
        BootstrapperHelper::fireLoadedAction($this->getName(), $container);
    }

    public function setupTheme(): void
    {
        // Add all theme supports using helper
        ThemeSupportHelper::addBasicSupports();
        ThemeSupportHelper::addGutenbergSupports();
        ThemeSupportHelper::registerNavigationMenus();
        ThemeSupportHelper::loadTextDomain();
    }

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
