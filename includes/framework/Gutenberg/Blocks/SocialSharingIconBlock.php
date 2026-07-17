<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Social Sharing Icon Block
 *
 * Block con của Social Sharing dùng để hiển thị từng icon chia sẻ riêng lẻ
 * Block này sử dụng save function nên không cần render callback
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 2.0.0
 */
class SocialSharingIconBlock extends Block
{
    protected $blockId = 'jankx/social-sharing-icon';

    /**
     * Block không sử dụng dynamic rendering
     * HTML được tạo bởi save function trong index.tsx
     */
}

