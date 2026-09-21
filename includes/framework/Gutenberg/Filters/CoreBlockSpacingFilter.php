<?php

namespace Jankx\Gutenberg\Filters;

/**
 * Core Block Spacing Filter
 *
 * Adds margin & padding spacing support to core blocks that don't enable
 * them by default (e.g. core/term-name, core/post-title, core/heading …).
 *
 * This filter MUST be registered before WordPress core registers its blocks
 * at `init` priority 10. The recommended approach is to call
 * {@see CoreBlockSpacingFilter::register()} no later than `init` priority 9.
 *
 * @package Jankx\Gutenberg\Filters
 * @since   2.0.0
 */
class CoreBlockSpacingFilter
{
    /**
     * Core block names that should receive margin + padding spacing support.
     *
     * @var string[]
     */
    protected static $targetBlocks = [
        'core/post-title',
        'core/post-excerpt',
        'core/paragraph',
        'core/heading',
        'core/term-name',
        'core/term-description',
    ];

    /**
     * Register the block_type_metadata filter.
     *
     * Call this method early — before `init` priority 10 — so the filter
     * is in place when WordPress core calls register_block_type_from_metadata()
     * for its built-in blocks.
     *
     * @return void
     */
    public static function register(): void
    {
        add_filter('block_type_metadata', [static::class, 'addSpacingSupport']);
    }

    /**
     * Inject margin & padding into the spacing support of targeted core blocks.
     *
     * Hooked to `block_type_metadata` which receives the raw metadata array
     * read from a block's block.json *before* the block type object is created.
     *
     * @param  array $metadata  Block metadata array (from block.json).
     * @return array            Modified metadata.
     */
    public static function addSpacingSupport(array $metadata): array
    {
        $name = $metadata['name'] ?? '';

        if (!in_array($name, static::$targetBlocks, true)) {
            return $metadata;
        }

        if (!isset($metadata['supports']['spacing'])) {
            $metadata['supports']['spacing'] = [];
        }

        $metadata['supports']['spacing']['margin']  = true;
        $metadata['supports']['spacing']['padding'] = true;

        return $metadata;
    }

    /**
     * Allow external code to extend the list of targeted blocks at runtime.
     *
     * @param  string|string[] $blockNames  One or more fully-qualified block names.
     * @return void
     */
    public static function addTargetBlocks($blockNames): void
    {
        foreach ((array) $blockNames as $name) {
            if (!in_array($name, static::$targetBlocks, true)) {
                static::$targetBlocks[] = $name;
            }
        }
    }
}
