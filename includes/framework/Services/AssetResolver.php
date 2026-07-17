<?php

namespace Jankx\Services;

use Jankx\Foundation\Application;

/**
 * Asset Resolver Service
 * 
 * Handles mapping of internal asset names to URLs and manages inline/dynamic CSS 
 * collection for blocks and layouts with hashed caching.
 */
class AssetResolver
{
    /**
     * Categorization Levels
     */
    public const CORE_LAYOUT    = 'CORE_LAYOUT';
    public const LAYOUT_TYPE    = 'LAYOUT_TYPE';
    public const INSTANCE       = 'INSTANCE';

    /**
     * @var Application
     */
    protected $app;

    /**
     * @var array Collected inline CSS blocks grouped by level and hashed for deduplication
     */
    protected $inlineCss = [
        self::CORE_LAYOUT    => [],
        self::LAYOUT_TYPE    => [],
        self::INSTANCE       => [],
    ];

    /**
     * @var string Theme version used for cache busting
     */
    protected $version;

    /**
     * Constructor
     * 
     * @param Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->version = (string) $app->version();
        $this->init();
    }

    /**
     * Initialize WordPress hooks for asset output
     */
    protected function init(): void
    {
        add_action('wp_footer', [$this, 'printInlineCss'], 100);
        add_action('admin_footer', [$this, 'printInlineCss'], 100);
    }

    /**
     * Add inline CSS for a specific layout/block
     * 
     * Implements Deduplication and Categorization.
     * 
     * @param string $css The CSS code
     * @param string $level The categorization level (CORE_LAYOUT, LAYOUT_TYPE, INSTANCE)
     */
    public function addInlineCss(string $css, string $level = self::INSTANCE): void
    {
        $css = trim($css);
        if (empty($css)) {
            return;
        }

        // 1. Deduplication Mechanism
        // Use hash of content to ensure identical CSS is only stored once per level.
        $hash = md5($css);

        // 2. Categorization Mapping
        // If the level passed is not a valid constant, fallback to INSTANCE level.
        $targetLevel = in_array($level, [self::CORE_LAYOUT, self::LAYOUT_TYPE, self::INSTANCE], true)
            ? $level
            : self::INSTANCE;

        $this->inlineCss[$targetLevel][$hash] = $css;
    }

    /**
     * Output all collected inline CSS in the footer with dependency ordering
     */
    public function printInlineCss(): void
    {
        if (empty($this->inlineCss[self::CORE_LAYOUT]) && 
            empty($this->inlineCss[self::LAYOUT_TYPE]) && 
            empty($this->inlineCss[self::INSTANCE])) {
            return;
        }

        $allStyles = [];
        $levels = [self::CORE_LAYOUT, self::LAYOUT_TYPE, self::INSTANCE];

        foreach ($levels as $level) {
            if (!empty($this->inlineCss[$level])) {
                $allStyles[] = "/* Level: {$level} */";
                foreach ($this->inlineCss[$level] as $css) {
                    $allStyles[] = $css;
                }
            }
        }

        echo "\n<!-- Jankx Dynamic Styles -->\n";
        echo "<style type=\"text/css\" id=\"jankx-dynamic-css\">\n";
        echo implode("\n", $allStyles);
        echo "\n</style>\n\n";
    }

    /**
     * Generate a unique ID for a block instance to scope its CSS
     * 
     * @param string $prefix
     * @return string
     */
    public function generateUniqueId(string $prefix = 'jkx'): string
    {
        return uniqid($prefix . '-', false);
    }
}
