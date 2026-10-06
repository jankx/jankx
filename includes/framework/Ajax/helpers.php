<?php

/**
 * Fast AJAX – helper global.
 *
 * File này CỐ TÌNH không khai namespace. Hàm ở đây phải là hàm global để
 * extension gọi được (`jankx_ajax_url()`); khai trong file có namespace thì
 * PHP tạo ra hàm namespaced và chỗ gọi báo "undefined function" mà không có
 * dấu hiệu nào chỉ ra nguyên nhân.
 *
 * @package Jankx\Ajax
 */

if (! function_exists('jankx_ajax_url')) {
    /**
     * Base URL của Fast AJAX, không có dấu / ở cuối.
     *
     * Extension ghép action path vào sau:
     *   jankx_ajax_url() . '/ecommerce/cart/add-batch'
     *   jankx_ajax_url() . '/ai/chat/suggestions'
     *
     * Rewrite rule chỉ hoạt động khi permalink đẹp; nếu chưa flush hoặc site
     * dùng plain permalink thì /jankx-ajax/... không resolve, nên trả về URL
     * gọi thẳng file entry.
     */
    function jankx_ajax_url(): string
    {
        global $wp_rewrite;

        if (! $wp_rewrite || ! $wp_rewrite->using_permalinks()) {
            return trailingslashit(get_template_directory_uri()) . 'ajax.php/jankx-ajax';
        }

        return home_url('/jankx-ajax');
    }
}

if (! function_exists('jankx_ajax_is_available')) {
    /**
     * Fast AJAX có dùng được không.
     *
     * Extension dùng để quyết định gọi Ajax hay rơi về REST. Luôn trả về
     * bool để điều kiện trong template/PHP không bị lỗi undefined function
     * khi theme chưa bật framework Ajax.
     */
    function jankx_ajax_is_available(): bool
    {
        return function_exists('jankx_ajax_url') && jankx_ajax_url() !== '';
    }
}
