<?php

namespace Jankx\Ajax\Middleware;

use flight\net\Request;
use Jankx\Ajax\Response\JsonResponse;

/**
 * NonceMiddleware – Kiểm tra CSRF token cho Fast AJAX.
 *
 * Client gửi header  X-WP-Nonce: <token>  hoặc field _wpnonce=<token>.
 *
 * Fast AJAX không có WordPress nên không gọi được wp_verify_nonce(): nonce của
 * WordPress gắn với user + tick, đòi hỏi bộ đếm thời gian và hàm băm của core.
 * Trong lúc token HMAC của package chưa được nối, middleware từ chối request
 * (fail closed) thay vì bỏ qua – route dùng middleware này sẽ không chạy cho
 * tới khi token được cấu hình.
 *
 * @package Jankx\Ajax\Middleware
 */
class NonceMiddleware implements MiddlewareInterface
{
    protected string $action = 'jankx_ajax';

    public function handle(Request $request): bool
    {
        $token = $_SERVER['HTTP_X_WP_NONCE']
            ?? $_POST['_wpnonce']
            ?? $_GET['_wpnonce']
            ?? '';

        if ($token === '' || ! is_string($token)) {
            JsonResponse::error('Token required.', 401)->send();
            return false;
        }

        if (! function_exists('wp_verify_nonce')) {
            JsonResponse::error(
                'CSRF token chưa được cấu hình cho Fast AJAX.',
                403
            )->send();
            return false;
        }

        if (! wp_verify_nonce($token, $this->action)) {
            JsonResponse::error('Invalid or expired token.', 403)->send();
            return false;
        }

        return true;
    }
}
