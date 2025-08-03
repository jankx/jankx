<?php

namespace Jankx\Support\Blocks\Patterns;

use Jankx\Foundation\Application;
use League\Plates\Engine;

/**
 * Abstract Gutenberg Pattern Class
 *
 * Provides a modern, OOP approach to creating Gutenberg patterns
 * with PlatesPHP templating and PSR-4 autoloading.
 */
abstract class GutenbergPattern
{
    /**
     * @var Application
     */
    protected $app;

    /**
     * @var Engine
     */
    protected $templateEngine;

    /**
     * @var string
     */
    protected $patternSlug;

    /**
     * @var array
     */
    protected $patternData;

    /**
     * Constructor
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->templateEngine = $this->createTemplateEngine();
        $this->patternData = $this->getPatternData();
        $this->patternSlug = $this->getPatternSlug();
    }

    /**
     * Get pattern slug
     */
    abstract protected function getPatternSlug(): string;

    /**
     * Get pattern data
     */
    abstract protected function getPatternData(): array;

    /**
     * Get template path
     */
    abstract protected function getTemplatePath(): string;

    /**
     * Get template data
     */
    abstract protected function getTemplateData(): array;

    /**
     * Create PlatesPHP template engine
     */
    protected function createTemplateEngine(): Engine
    {
        // Get engine from container (singleton)
        return $this->app->make('plates.engine');
    }

    /**
     * Register the pattern
     */
    public function register(): void
    {
        if (\Jankx\Helper\Environment::isDebugLog()) {
            \Jankx\Facades\Log::debug('GutenbergPattern: Registering pattern with WordPress - ' . $this->patternSlug);
        }

        try {
            $content = $this->renderTemplate();

            register_block_pattern(
                $this->patternSlug,
                array_merge($this->patternData, [
                    'content' => $content
                ])
            );

            if (\Jankx\Helper\Environment::isDebugLog()) {
                \Jankx\Facades\Log::debug('GutenbergPattern: Pattern registered successfully with WordPress - ' . $this->patternSlug);
            }
        } catch (\Exception $e) {
            \Jankx\Facades\Log::error('GutenbergPattern: Failed to register pattern with WordPress - ' . $this->patternSlug . ' - ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Render template with PlatesPHP
     */
    protected function renderTemplate(): string
    {
        $templateData = $this->getTemplateData();
        $templatePath = $this->getTemplatePath();

        if (\Jankx\Helper\Environment::isDebugLog()) {
            \Jankx\Facades\Log::debug('GutenbergPattern: Rendering template - ' . $templatePath);
        }

        try {
            // Try to render from child theme first, then fallback to parent theme
            try {
                // Try child theme first
                if (get_template_directory() !== get_stylesheet_directory()) {
                    $content = $this->templateEngine->render('patterns-child::' . $templatePath, $templateData);
                    if (\Jankx\Helper\Environment::isDebugLog()) {
                        \Jankx\Facades\Log::debug('GutenbergPattern: Template rendered from child theme - ' . $templatePath);
                    }
                    return $content;
                }
            } catch (\Exception $e) {
                if (\Jankx\Helper\Environment::isDebugLog()) {
                    \Jankx\Facades\Log::debug('GutenbergPattern: Child theme template not found, trying parent theme - ' . $templatePath);
                }
            }

            // Try parent theme
            try {
                $content = $this->templateEngine->render('patterns::' . $templatePath, $templateData);
                if (\Jankx\Helper\Environment::isDebugLog()) {
                    \Jankx\Facades\Log::debug('GutenbergPattern: Template rendered from parent theme - ' . $templatePath);
                }
                return $content;
            } catch (\Exception $e) {
                if (\Jankx\Helper\Environment::isDebugLog()) {
                    \Jankx\Facades\Log::debug('GutenbergPattern: Parent theme template not found, trying without prefix - ' . $templatePath);
                }
            }

            // If both fail, try without folder prefix
            $content = $this->templateEngine->render($templatePath, $templateData);
            if (\Jankx\Helper\Environment::isDebugLog()) {
                \Jankx\Facades\Log::debug('GutenbergPattern: Template rendered without prefix - ' . $templatePath);
            }
            return $content;
        } catch (\Exception $e) {
            \Jankx\Facades\Log::error('GutenbergPattern: Failed to render template - ' . $templatePath . ' - ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get pattern category
     */
    protected function getCategory(): string
    {
        return $this->patternData['categories'][0] ?? 'jankx';
    }

    /**
     * Get pattern keywords
     */
    protected function getKeywords(): array
    {
        return $this->patternData['keywords'] ?? [];
    }

    /**
     * Get pattern viewport width
     */
    protected function getViewportWidth(): int
    {
        return $this->patternData['viewportWidth'] ?? 1200;
    }

    /**
     * Add template function
     */
    protected function addTemplateFunction(string $name, callable $callback): void
    {
        $this->templateEngine->registerFunction($name, $callback);
    }

    /**
     * Add template folder
     */
    protected function addTemplateFolder(string $name, string $path): void
    {
        $this->templateEngine->addFolder($name, $path);
    }
}
