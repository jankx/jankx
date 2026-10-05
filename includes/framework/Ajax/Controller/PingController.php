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
     *
     * Chỉ đọc, không ghi – an toàn để bật công khai.
     */
    public function info(array $params = []): void
    {
        $config = \Jankx\Flight\WordpressConcept\Config::load(dirname(__DIR__, 4));

        $this->success([
            'php_version' => PHP_VERSION,
            'db_name'     => $config->get('DB_NAME'),
            'prefix'      => $config->tablePrefix(),
            'logged_in'   => is_user_logged_in(),
            'user_id'     => get_current_user_id(),
        ]);
    }
}
