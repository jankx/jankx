<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Advanced Filter Block
 *
 * Block con đại diện cho một filter đơn lẻ, được sử dụng bên trong
 * block jankx/advanced-filters. Toàn bộ việc render UI thực tế do
 * parent block và renderer phía PHP đảm nhận.
 */
class AdvancedFilterBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/advanced-filter';

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Render callback
     *
     * Lưu block con dưới dạng dynamic block nhưng không tự render
     * nội dung vì parent jankx/advanced-filters sẽ dùng attributes
     * đã gom để render toàn bộ giao diện filters.
     *
     * @param array       $attributes
     * @param string      $content
     * @param \WP_Block|null $block
     * @return string
     */
    public function render($attributes, $content = '', $block = null)
    {
        // Không render gì; dữ liệu được parent xử lý.
        return '';
    }
}


