<?php

namespace Jankx\Services;

use Jankx\Foundation\Application;
use Jankx\Gutenberg\Blocks\DynamicCollectionBlock;
use Jankx\Gutenberg\Blocks\IconPickerBlock;
use Jankx\Gutenberg\Blocks\LanguageSwitcherBlock;
use Jankx\Gutenberg\Blocks\MegaMenuBlock;
use Jankx\Gutenberg\Blocks\ProductCarouselBlock;
use Jankx\Gutenberg\Blocks\SwiperSlideBlock;
use Jankx\Gutenberg\Blocks\SwiperSliderBlock;
use Jankx\Gutenberg\GutenbergPattern;
use Jankx\Facades\Log;
use Jankx\Helper\Environment;

/**
 * Gutenberg Service
 *
 * Handles Gutenberg block logic, discovery, registration, and asset management
 *
 * @package Jankx\Services
 * @since 2.0.0
 */
class GutenbergService
{
    protected $app;
    protected $repository;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->repository = $app->make('gutenberg.repository');
        $this->registerPatternCategories();
    }

    /**
     * Initialize Gutenberg blocks and patterns
     *
     * @return void
     */
    public function init()
    {


        try {
            // Discover blocks from directory
            $this->discoverBlocks();

            // Register all blocks
            $this->registerAllBlocks();

            // Discover and register patterns
            $this->discoverPatterns();
        } catch (\Exception $e) {
            Log::error('GutenbergService: Failed to initialize - ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Discover blocks from resources/blocks directory
     *
     * @return void
     */
    public function discoverBlocks()
    {


        $blocksPath = get_template_directory() . '/resources/blocks';

        if (!is_dir($blocksPath)) {
            return;
        }

        $blockDirs = glob($blocksPath . '/*', GLOB_ONLYDIR);
        $discoveredCount = 0;

        foreach ($blockDirs as $blockDir) {
            $blockName = basename($blockDir);
            $blockClass = $this->getBlockClassFromName($blockName);

            if ($blockClass && class_exists($blockClass)) {
                try {
                    $this->repository->registerBlock($blockClass);
                    $discoveredCount++;
                    if (Environment::isDebugLog()) {
                    }
                } catch (\Exception $e) {
                    Log::error('GutenbergService: Failed to register block ' . $blockName . ' - ' . $e->getMessage());
                }
            } else {
            }
        }
    }

    /**
     * Get block class name from block directory name
     *
     * @param string $blockName Block directory name
     * @return string|null
     */
    protected function getBlockClassFromName($blockName)
    {
        // Convert kebab-case to PascalCase
        $className = str_replace('-', '', ucwords($blockName, '-')) . 'Block';

        return 'Jankx\\Support\\Blocks\\' . $className;
    }

    /**
     * Register default blocks
     *
     * @return void
     */
    protected function registerDefaultBlocks()
    {
        $this->repository->registerBlock(LanguageSwitcherBlock::class);
        $this->repository->registerBlock(DynamicCollectionBlock::class);
        $this->repository->registerBlock(IconPickerBlock::class);
        $this->repository->registerBlock(ProductCarouselBlock::class);
        $this->repository->registerBlock(MegaMenuBlock::class);
        $this->repository->registerBlock(SwiperSliderBlock::class);
        $this->repository->registerBlock(SwiperSlideBlock::class);
    }

    /**
     * Register all blocks with WordPress
     *
     * @return void
     */
    public function registerAllBlocks()
    {


        try {
            // Register default blocks first
            $this->registerDefaultBlocks();

            // Register discovered blocks
            $instances = $this->repository->getInstances();
            $registeredCount = 0;

            foreach ($instances as $blockName => $block) {
                try {
                    $block->register();
                    $registeredCount++;
                    if (Environment::isDebugLog()) {
                    }
                } catch (\Exception $e) {
                    Log::error('GutenbergService: Failed to register block ' . $blockName . ' - ' . $e->getMessage());
                }
            }
        } catch (\Exception $e) {
            Log::error('GutenbergService: Failed to register blocks - ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get block metadata from resources/blocks directory
     *
     * @return array
     */
    public function getBlocksMetadata()
    {
        $metadata = [];
        $blocksPath = get_template_directory() . '/resources/blocks';

        if (!is_dir($blocksPath)) {
            return $metadata;
        }

        $blockDirs = glob($blocksPath . '/*', GLOB_ONLYDIR);

        foreach ($blockDirs as $blockDir) {
            $blockName = basename($blockDir);
            $blockJsonPath = $blockDir . '/block.json';

            if (file_exists($blockJsonPath)) {
                $blockJson = file_get_contents($blockJsonPath);
                $blockData = json_decode($blockJson, true);

                if ($blockData) {
                    $metadata[$blockName] = $blockData;
                }
            }
        }

        return $metadata;
    }

    /**
     * Enqueue all block assets
     *
     * @return void
     */
    public function enqueueAllBlockAssets()
    {


        try {
            $metadata = $this->getBlocksMetadata();
            $enqueuedCount = 0;

            foreach ($metadata as $blockName => $blockData) {
                try {
                    $this->enqueueBlockAssets($blockName, $blockData);
                    $enqueuedCount++;
                    if (Environment::isDebugLog()) {
                    }
                } catch (\Exception $e) {
                    Log::error('GutenbergService: Failed to enqueue assets for block ' . $blockName . ' - ' . $e->getMessage());
                }
            }
        } catch (\Exception $e) {
            Log::error('GutenbergService: Failed to enqueue block assets - ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Enqueue block assets
     *
     * @param string $blockName
     * @param array $blockData
     */
    protected function enqueueBlockAssets($blockName, $blockData)
    {
        // Enqueue editor script
        if (!empty($blockData['editorScript'])) {
            $scriptPath = get_template_directory() . '/resources/blocks/' . $blockName . '/' . $blockData['editorScript'];
            $scriptDir = dirname($scriptPath);
            $scriptName = basename($scriptPath, '.js');

            // Look for corresponding asset.php file
            $assetFile = $scriptDir . '/' . $scriptName . '.asset.php';

            if (file_exists($scriptPath)) {
                // Load dependencies and version from asset.php
                $asset = file_exists($assetFile) ? include($assetFile) : [];
                $scriptDependencies = $asset['dependencies'] ?? ['wp-blocks', 'wp-element', 'wp-editor'];
                $scriptVersion = $asset['version'] ?? filemtime($scriptPath);

                wp_enqueue_script(
                    $blockData['name'] . '-editor',
                    \Jankx\Facades\Url::blockAsset($blockName . '/' . $blockData['editorScript']),
                    $scriptDependencies,
                    $scriptVersion,
                    true
                );
            }
        }

        // Enqueue block style
        if (!empty($blockData['style'])) {
            $stylePath = get_template_directory() . '/resources/blocks/' . $blockName . '/' . $blockData['style'];
            $styleDir = dirname($stylePath);
            $styleName = basename($stylePath, '.css');

            // Look for corresponding style.css.asset.php file
            $cssAssetFile = $styleDir . '/style.css.asset.php';

            if (file_exists($stylePath)) {
                // Load dependencies and version from style.css.asset.php
                $cssAsset = file_exists($cssAssetFile) ? include($cssAssetFile) : [];
                $cssDependencies = $cssAsset['dependencies'] ?? [];
                $cssVersion = $cssAsset['version'] ?? filemtime($stylePath);

                wp_enqueue_style(
                    $blockData['name'] . '-style',
                    \Jankx\Facades\Url::blockAsset($blockName . '/' . $blockData['style']),
                    $cssDependencies,
                    $cssVersion
                );
            }
        }
    }

    /**
     * Get block instance
     *
     * @param string $blockName Block name
     * @return \Jankx\Gutenberg\Blocks\Block|null
     */
    public function getBlock($blockName)
    {
        return $this->repository->getBlock($blockName);
    }

    /**
     * Get all registered blocks
     *
     * @return array
     */
    public function getBlocks()
    {
        return $this->repository->getBlocks();
    }

    /**
     * Get all block instances
     *
     * @return array
     */
    public function getInstances()
    {
        return $this->repository->getInstances();
    }

    /**
     * Register a block
     *
     * @param string $blockClass Block class name
     * @return void
     */
    public function registerBlock($blockClass)
    {
        $this->repository->registerBlock($blockClass);
    }

    /**
     * Check if block exists
     *
     * @param string $blockName Block name
     * @return bool
     */
    public function hasBlock($blockName)
    {
        return $this->repository->getBlock($blockName) !== null;
    }

    /**
     * Get block count
     *
     * @return int
     */
    public function getBlockCount()
    {
        return count($this->repository->getBlocks());
    }

    /**
     * Clear block cache
     *
     * @return void
     */
    public function clearCache()
    {


        try {
            // Clear any cached block data
            wp_cache_delete('jankx_blocks', 'jankx_blocks');
            wp_cache_delete('jankx_patterns', 'jankx_patterns');
        } catch (\Exception $e) {
            Log::error('GutenbergService: Failed to clear block cache - ' . $e->getMessage());
            throw $e;
        }
    }

    // ========================================
    // PATTERN METHODS
    // ========================================

    /**
     * Register pattern categories
     */
    protected function registerPatternCategories(): void
    {
        $patternCategories = [
            'jankx' => [
                'label' => 'Jankx Patterns',
                'description' => 'Custom patterns for Jankx theme'
            ],
            'hero' => [
                'label' => 'Hero Sections',
                'description' => 'Modern hero sections with animations'
            ],
            'cards' => [
                'label' => 'Card Layouts',
                'description' => 'Beautiful card-based layouts'
            ],
            'grid' => [
                'label' => 'Grid Systems',
                'description' => 'Responsive grid layouts'
            ],
            'testimonials' => [
                'label' => 'Testimonials',
                'description' => 'Customer testimonial layouts'
            ],
            'cta' => [
                'label' => 'Call to Action',
                'description' => 'Engaging call-to-action sections'
            ]
        ];

        foreach ($patternCategories as $slug => $category) {
            register_block_pattern_category($slug, $category);
        }
    }

    /**
     * Discover patterns from repository
     */
    public function discoverPatterns(): void
    {
        try {
            // Register default patterns
            $this->registerDefaultPatterns();

            // Fire action hook for plugins and child themes to register their patterns
            do_action('jankx/gutenberg/register-patterns', $this->repository, $this->app);
        } catch (\Exception $e) {
            Log::error('GutenbergService: Failed to discover patterns - ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Register default patterns
     */
    protected function registerDefaultPatterns(): void
    {


        // Register built-in patterns
        $defaultPatterns = [
            \Jankx\Gutenberg\Patterns\HeroSectionPattern::class,
        ];

        foreach ($defaultPatterns as $patternClass) {
            try {
                $this->repository->registerPattern($patternClass, $this->app);
            } catch (\Exception $e) {
                Log::error('GutenbergService: Failed to register default pattern ' . $patternClass . ' - ' . $e->getMessage());
            }
        }
    }

    /**
     * Get all registered patterns
     */
    public function getPatterns(): array
    {
        return $this->repository->getPatternInstances();
    }

    /**
     * Get pattern by slug
     */
    public function getPatternBySlug(string $slug): ?GutenbergPattern
    {
        return $this->repository->getPattern($slug);
    }

    /**
     * Get pattern slug using reflection
     */
    protected function getPatternSlug(GutenbergPattern $pattern): string
    {
        $reflection = new \ReflectionClass($pattern);
        $method = $reflection->getMethod('getPatternSlug');
        $method->setAccessible(true);
        return $method->invoke($pattern);
    }

    /**
     * Get patterns by category
     */
    public function getPatternsByCategory(string $category): array
    {
        $patternInstances = $this->repository->getPatternInstances();

        return array_filter($patternInstances, function ($pattern) use ($category) {
            return in_array($category, $this->getPatternData($pattern)['categories'] ?? []);
        });
    }

    /**
     * Get pattern data using reflection
     */
    protected function getPatternData(GutenbergPattern $pattern): array
    {
        $reflection = new \ReflectionClass($pattern);
        $method = $reflection->getMethod('getPatternData');
        $method->setAccessible(true);
        return $method->invoke($pattern);
    }

    /**
     * Create pattern instance
     */
    public function createPattern(string $className): GutenbergPattern
    {


        if (!class_exists($className)) {
            $error = 'Pattern class ' . $className . ' not found';
            Log::error('GutenbergService: ' . $error);
            throw new \InvalidArgumentException($error);
        }

        if (!$this->app->bound($className)) {
            $this->app->singleton($className, function ($app) use ($className) {
                return new $className($app);
            });
        }

        try {
            $pattern = $this->app->make($className);

            if (!$pattern instanceof GutenbergPattern) {
                $error = 'Class ' . $className . ' must extend GutenbergPattern';
                Log::error('GutenbergService: ' . $error);
                throw new \InvalidArgumentException($error);
            }


            return $pattern;
        } catch (\Exception $e) {
            Log::error('GutenbergService: Failed to create pattern ' . $className . ' - ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get pattern statistics
     */
    public function getPatternStats(): array
    {
        $patternInstances = $this->repository->getPatternInstances();

        $stats = [
            'total' => count($patternInstances),
            'categories' => [],
            'keywords' => []
        ];

        foreach ($patternInstances as $pattern) {
            $data = $this->getPatternData($pattern);

            // Count categories
            foreach ($data['categories'] ?? [] as $category) {
                $stats['categories'][$category] = ($stats['categories'][$category] ?? 0) + 1;
            }

            // Count keywords
            foreach ($data['keywords'] ?? [] as $keyword) {
                $stats['keywords'][$keyword] = ($stats['keywords'][$keyword] ?? 0) + 1;
            }
        }

        return $stats;
    }

    /**
     * Clear pattern cache
     */
    public function clearPatternCache(): void
    {


        try {
            // Clear pattern cache
            wp_cache_delete('jankx_patterns', 'jankx_patterns');
            wp_cache_delete('jankx_pattern_categories', 'jankx_patterns');
        } catch (\Exception $e) {
            Log::error('GutenbergService: Failed to clear pattern cache - ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get pattern template data
     */
    public function getPatternTemplateData(string $patternSlug): array
    {
        $pattern = $this->getPatternBySlug($patternSlug);

        if (!$pattern) {
            return [];
        }

        return $this->getTemplateData($pattern);
    }

    /**
     * Get template data using reflection
     */
    protected function getTemplateData(GutenbergPattern $pattern): array
    {
        $reflection = new \ReflectionClass($pattern);
        $method = $reflection->getMethod('getTemplateData');
        $method->setAccessible(true);
        return $method->invoke($pattern);
    }
}
