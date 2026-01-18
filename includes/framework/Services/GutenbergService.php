<?php

namespace Jankx\Services;

use Jankx\Foundation\Application;
use Jankx\Facades\Log;
use Jankx\Gutenberg\Blocks\AdvancedButtonBlock;
use Jankx\Gutenberg\Blocks\AdvancedFiltersBlock;
use Jankx\Gutenberg\Blocks\AdvancedFilterBlock;
use Jankx\Gutenberg\Blocks\AdvancedImageBoxBlock;
use Jankx\Gutenberg\Blocks\AuthorBoxBlock;
use Jankx\Gutenberg\Blocks\DatePickerCalendarBlock;
use Jankx\Gutenberg\Blocks\IconPickerBlock;
use Jankx\Gutenberg\Blocks\CommentCountBlock;
use Jankx\Gutenberg\Blocks\PostTypeBadgeBlock;
use Jankx\Gutenberg\Blocks\DynamicDataLayoutBlock;
use Jankx\Gutenberg\Blocks\DynamicDataTemplateBlock;
use Jankx\Gutenberg\Blocks\DynamicSsrLayoutBlock;
use Jankx\Gutenberg\Blocks\DynamicSsrTemplateBlock;
use Jankx\Gutenberg\Blocks\MagicTextBlock;
use Jankx\Gutenberg\Blocks\MasterTableBlock;
use Jankx\Gutenberg\Blocks\ModalBlock;
use Jankx\Gutenberg\Blocks\OffcanvasSidebarBlock;
use Jankx\Gutenberg\Blocks\OffcanvasTriggerBlock;
use Jankx\Gutenberg\Blocks\SlideshowBlock;
use Jankx\Gutenberg\Blocks\SlideshowContainerBlock;
use Jankx\Gutenberg\Blocks\SlideshowItemBlock;
use Jankx\Gutenberg\Blocks\SmartBreadcrumbBlock;
use Jankx\Gutenberg\Blocks\SmartSearchBlock;
use Jankx\Gutenberg\Blocks\SmartTabBlock;
use Jankx\Gutenberg\Blocks\SmartTabsBlock;
use Jankx\Gutenberg\Blocks\SocialSharingBlock;
use Jankx\Gutenberg\Blocks\SocialSharingIconBlock;
use Jankx\Gutenberg\Blocks\SvgIconBlock;
use Jankx\Gutenberg\Blocks\SwiperBannerBlock;
use Jankx\Gutenberg\Blocks\SwiperBlock;
use Jankx\Gutenberg\Blocks\SwiperSlideBlock;
use Jankx\Gutenberg\Blocks\SwiperInnerBlocksOverlayBlock;
use Jankx\Gutenberg\Blocks\TableCellBlock;
use Jankx\Gutenberg\Blocks\TableOfContentBlock;
use Jankx\Gutenberg\Blocks\TableRowBlock;
use Jankx\Gutenberg\Blocks\TestimonialsBlock;
use Jankx\Gutenberg\Blocks\FacebookPageBlock;
use Jankx\Gutenberg\Blocks\TestimonialBlock;
use Jankx\Gutenberg\Blocks\StarRatingBlock;
use Jankx\Gutenberg\Blocks\FloatingMessengersBlock;
use Jankx\Gutenberg\Blocks\StickyBoxBlock;
use Jankx\Gutenberg\Blocks\DividerBlock;
use Jankx\Gutenberg\Blocks\LanguageSwitcherBlock;
use Jankx\Gutenberg\Blocks\PlyrPlayerBlock;
use Jankx\Gutenberg\Extra\Categories as ExtraCategories;
use Jankx\Gutenberg\Extra\PostTitle as ExtraPostTitle;
use Jankx\Gutenberg\Extra\PostContent as ExtraPostContent;
use Jankx\Gutenberg\Blocks\TermLayoutBlock;
use Jankx\Gutenberg\Blocks\TermLayoutTemplateBlock;
use Jankx\Gutenberg\Blocks\SafeIframeBlock;

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

    /**
     * Summary of repository
     * @var \Jankx\Gutenberg\GutenbergRepository
     */
    protected $repository;


    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->repository = $app->make('gutenberg.repository');

        $this->registerBlockCategories();
    }

    public function initBlocks()
    {
        foreach ($this->getBlocks() as $blockClass => $initialized) {
            $block = $initialized
                ? $this->repository->getBlock($blockClass)
                : new $blockClass();

            $this->repository->registerBlock($block);
        }
    }



    /**
     * Initialize Gutenberg blocks and patterns
     *
     * @return void
     */
    public function init()
    {
        try {
            // Register all blocks
            $this->initBlocks();

            // Register discovered blocks
            $instances = $this->repository->getInstances();
            $registeredCount = 0;

            foreach ($instances as $blockName => $block) {
                try {
                    // Init block
                    if (method_exists($block, 'init')) {
                        call_user_func([$block, 'init']);
                    }
                    $block->register();
                    $registeredCount++;
                } catch (\Exception $e) {
                    Log::error('GutenbergService: Failed to register block ' . $blockName . ' - ' . $e->getMessage());
                }
            }

            // Register and initialize extra Gutenberg filters/enhancements
            $this->registerBlockExtras();
            if ($this->app->bound('gutenberg.extra_manager')) {
                $this->app->make('gutenberg.extra_manager')->init();
            }
        } catch (\Exception $e) {
            Log::error('GutenbergService: Failed to initialize - ' . $e->getMessage());
            throw $e;
        }
    }


    /**
     * Register default blocks
     *
     * @return void
     */
    protected function registerDefaultBlocks()
    {
        $this->repository->registerBlock(AdvancedButtonBlock::class);
        $this->repository->registerBlock(AdvancedFilterBlock::class);
        $this->repository->registerBlock(AdvancedFiltersBlock::class);
        $this->repository->registerBlock(AdvancedImageBoxBlock::class);
        $this->repository->registerBlock(AuthorBoxBlock::class);
        $this->repository->registerBlock(DatePickerCalendarBlock::class);
        $this->repository->registerBlock(IconPickerBlock::class);
        $this->repository->registerBlock(CommentCountBlock::class);
        $this->repository->registerBlock(PostTypeBadgeBlock::class);
        $this->repository->registerBlock(DynamicDataLayoutBlock::class);
        $this->repository->registerBlock(DynamicDataTemplateBlock::class);
        $this->repository->registerBlock(DynamicSsrLayoutBlock::class);
        $this->repository->registerBlock(DynamicSsrTemplateBlock::class);
        $this->repository->registerBlock(MagicTextBlock::class);
        $this->repository->registerBlock(MasterTableBlock::class);
        $this->repository->registerBlock(ModalBlock::class);
        $this->repository->registerBlock(OffcanvasSidebarBlock::class);
        $this->repository->registerBlock(OffcanvasTriggerBlock::class);
        $this->repository->registerBlock(SlideshowBlock::class);
        $this->repository->registerBlock(SlideshowContainerBlock::class);
        $this->repository->registerBlock(SlideshowItemBlock::class);
        $this->repository->registerBlock(SmartBreadcrumbBlock::class);
        $this->repository->registerBlock(SmartSearchBlock::class);
        $this->repository->registerBlock(SmartTabBlock::class);
        $this->repository->registerBlock(SmartTabsBlock::class);
        $this->repository->registerBlock(SocialSharingBlock::class);
        $this->repository->registerBlock(SocialSharingIconBlock::class);
        $this->repository->registerBlock(SvgIconBlock::class);
        $this->repository->registerBlock(SwiperBannerBlock::class);
        $this->repository->registerBlock(SwiperBlock::class);
        $this->repository->registerBlock(SwiperSlideBlock::class);
        $this->repository->registerBlock(SwiperInnerBlocksOverlayBlock::class);
        $this->repository->registerBlock(TableCellBlock::class);
        $this->repository->registerBlock(TableOfContentBlock::class);
        $this->repository->registerBlock(TableRowBlock::class);
        $this->repository->registerBlock(FacebookPageBlock::class);
        $this->repository->registerBlock(TestimonialsBlock::class);
        $this->repository->registerBlock(TestimonialBlock::class);
        $this->repository->registerBlock(StarRatingBlock::class);
        $this->repository->registerBlock(FloatingMessengersBlock::class);
        $this->repository->registerBlock(StickyBoxBlock::class);
        $this->repository->registerBlock(DividerBlock::class);
        $this->repository->registerBlock(LanguageSwitcherBlock::class);
        $this->repository->registerBlock(PlyrPlayerBlock::class);
        $this->repository->registerBlock(TermLayoutBlock::class);
        $this->repository->registerBlock(TermLayoutTemplateBlock::class);
        $this->repository->registerBlock(SafeIframeBlock::class);
    }

    /**
     * Register all blocks with WordPress
     *
     * @return void
     */
    public function registerBlocks()
    {
        try {
            // Register default blocks first
            $this->registerDefaultBlocks();

            // Fire action hook for plugins and child themes to register their blocks
            do_action(
                'jankx/gutenberg/register-blocks',
                $this->repository,
                $this->app
            );
        } catch (\Exception $e) {
            Log::error('GutenbergService: Failed to register blocks - ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get block instance
     *
     * @param string $blockName Block name
     * @return \Jankx\Gutenberg\Block|null
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
    // BLOCK CATEGORY METHODS
    // ========================================

    /**
     * Register block categories
     *
     * @return void
     */
    protected function registerBlockCategories(): void
    {
        add_filter('block_categories_all', [$this, 'addBlockCategories'], 10, 2);
    }

    /**
     * Add Jankx block category to WordPress
     *
     * @param array $categories Existing block categories
     * @param \WP_Block_Editor_Context $editor_context The current block editor context
     * @return array Modified categories
     */
    public function addBlockCategories(array $categories, $editor_context): array
    {
        // Add Jankx category at the beginning
        array_unshift($categories, [
            'slug' => 'jankx',
            'title' => __('Jankx', 'jankx'),
            'icon' => null,
        ]);

        return $categories;
    }


    /**
     * Get list of core blocks to monitor
     *
     * @return array
     */
    protected function getCoreBlocksList(): array
    {
        return [
            'core/paragraph',
            'core/heading',
            'core/image',
            'core/gallery',
            'core/list',
            'core/quote',
            'core/audio',
            'core/cover',
            'core/file',
            'core/video',
            'core/columns',
            'core/column',
            'core/group',
            'core/buttons',
            'core/button',
            'core/media-text',
            'core/spacer',
            'core/separator',
            'core/shortcode',
            'core/html',
            'core/preformatted',
            'core/code',
            'core/verse',
            'core/table',
            'core/pullquote',
            'core/embed',
            'core/social-links',
            'core/social-link',
            'core/navigation',
            'core/navigation-link',
            'core/navigation-submenu',
            'core/site-logo',
            'core/site-title',
            'core/site-tagline',
            'core/query',
            'core/post-template',
            'core/post-title',
            'core/post-excerpt',
            'core/post-featured-image',
            'core/post-date',
            'core/post-terms',
            'core/post-navigation-link',
            'core/read-more',
            'core/query-pagination',
            'core/query-pagination-numbers',
            'core/query-pagination-previous',
            'core/query-pagination-next',
            'core/query-no-results',
            'core/query-loop',
            'core/term-description',
            'core/archive-title',
            'core/search',
            'core/loginout',
            'core/home-link',
            'core/page-list',
            'core/calendar',
            'core/rss',
            'core/tag-cloud',
            'core/latest-posts',
            'core/latest-comments',
            'core/legacy-widget',
            'core/widget-group',
            'core/theme',
            'core/comment-template',
            'core/comment-title',
            'core/comment-date',
            'core/comment-content',
            'core/comment-author-name',
            'core/comment-author-avatar',
            'core/comment-reply-link',
            'core/comment-edit-link',
            'core/comment',
            'core/comments-pagination',
            'core/comments-pagination-numbers',
            'core/comments-pagination-previous',
            'core/comments-pagination-next',
            'core/comments-title',
            'core/post-comments-form',
            'core/avatar',
            'core/block',
            'core/template-part',
            'core/pattern',
        ];
    }

    /**
     * Register extra block enhancements
     *
     * @return void
     */
    protected function registerBlockExtras(): void
    {
        if ($this->app->bound('gutenberg.extra_manager')) {
            $extraManager = $this->app->make('gutenberg.extra_manager');

            // Register Categories extra
            $extraManager->register(ExtraCategories::class);

            // Register Post Title extra
            $extraManager->register(ExtraPostTitle::class);

            // Register Post Content extra
            $extraManager->register(ExtraPostContent::class);

            // Allow child themes or plugins to register additional block extras
            do_action('jankx/gutenberg/register-block-extras', $extraManager, $this->app);
        }
    }
}
