<?php

namespace Jankx\Ajax\Middleware;

use Base;
use Jankx\Ajax\Response\JsonResponse;

/**
 * NonceMiddleware – Xác thực WordPress Nonce cho Fast AJAX.
 *
 * SHORTINIT đã nạp: $wpdb, wp_verify_nonce(), get_option() ...
 * Nên nonce verification hoạt động bình thường.
 *
 * Client phải gửi header:  X-WP-Nonce: <nonce>
 * hoặc field:              _wpnonce=<nonce>  (body/query)
 *
 * Nonce được tạo bởi: wp_create_nonce('jankx_ajax')
 *
 * @package Jankx\Ajax\Middleware
 */
class NonceMiddleware implements MiddlewareInterface
{
    protected string $action = 'jankx_ajax';

    public function handle(Base $f3): bool
    {
        // Lấy nonce từ header hoặc body
        $nonce = $_SERVER['HTTP_X_WP_NONCE']
            ?? $_POST['_wpnonce']
            ?? $_GET['_wpnonce']
            ?? '';

        if (empty($nonce)) {
            JsonResponse::error('Nonce required.', 401)->send();
            return false;
        }

        if (! function_exists('wp_verify_nonce')) {
            // SHORTINIT không load nonce functions trong một số cấu hình
            // → fallback: load thêm
            require_once ABSPATH . 'wp-includes/pluggable.php';
        }

        if (! wp_verify_nonce($nonce, $this->action)) {
            JsonResponse::error('Invalid or expired nonce.', 403)->send();
            return false;
        }

        return true;
    }
}
