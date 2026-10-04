<?php

namespace Jankx\Ajax\Controller;

/**
 * PingController – Controller test / health check.
 *
 * Endpoints:
 *   GET  /jankx-ajax/jankx/ping/index   → Kiểm tra server đang chạy
 *   GET  /jankx-ajax/jankx/ping/info    → Thông tin server
 *
 * Không cần middleware (public endpoint).
 *
 * @package Jankx\Ajax\Controller
 */
class PingController extends AbstractController
{
    protected array $middlewares = [
        // Không cần nonce hay rate limit cho ping
    ];

    /**
     * GET /jankx-ajax/jankx/ping/index
     */
    public function index(array $params = []): void
    {
        $this->success([
            'pong'    => true,
            'message' => 'Jankx Fast AJAX is running!',
        ]);
    }

    /**
     * GET /jankx-ajax/jankx/ping/info
     */
    public function info(array $params = []): void
    {
        global $wpdb;

        $this->success([
            'php_version' => PHP_VERSION,
            'db_name'     => DB_NAME,
            'prefix'      => $wpdb->prefix,
            'shortinit'   => defined('SHORTINIT') && SHORTINIT,
        ]);
    }
}
