<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Social Sharing Block
 *
 * Hiển thị các nút chia sẻ mạng xã hội sử dụng vanilla-sharing
 * Block này sử dụng InnerBlocks để chứa các block con social-sharing-icon
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 2.0.0
 */
class SocialSharingBlock extends Block
{
    protected $blockId = 'jankx/social-sharing';

    /**
     * Block sử dụng save function (static rendering) với InnerBlocks
     * Không cần render callback
     */
}

