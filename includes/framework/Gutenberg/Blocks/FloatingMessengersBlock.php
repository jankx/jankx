<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Floating Messengers Block
 *
 * Nút nổi chứa nhiều messenger, hỗ trợ cấu hình bật/tắt từng item,
 * vị trí, kiểu bung, khoảng cách và hiệu ứng.
 * Block sử dụng save.tsx để render HTML tĩnh và viewScript cho tương tác frontend.
 */
class FloatingMessengersBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/floating-messengers';
}

