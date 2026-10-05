<?php

namespace Jankx\Ajax\Middleware;

use flight\net\Request;
use Jankx\Ajax\Response\JsonResponse;
use Jankx\Flight\WordpressConcept\Config;
use Jankx\Flight\WordpressConcept\Db\Connection;

/**
 * RateLimitMiddleware – Giới hạn request per IP để chống DDoS/spam.
 *
 * Đếm cửa sổ trượt bằng cách ghi vào bảng options, giống transient của
 * WordPress nhưng tự quản lý nên không cần $wpdb. Mặc định 60 request / 60
 * giây mỗi IP.
 *
 * @package Jankx\Ajax\Middleware
 */
class RateLimitMiddleware implements MiddlewareInterface
{
    /** Số request tối đa trong cửa sổ thời gian */
    protected int $maxRequests = 60;

    /** Cửa sổ thời gian tính bằng giây */
    protected int $windowSeconds = 60;

    public function handle(Request $request): bool
    {
        $config     = Config::load(dirname(__DIR__, 3));
        $connection = Connection::instance();
        $options    = $config->table('options');

        $ip  = $request->ip;
        $key = '_transient_jankx_rl_' . md5($ip);

        $value = $connection->fetchValue(
            "SELECT option_value FROM {$options} WHERE option_name = :key LIMIT 1",
            [':key' => $key]
        );

        $now  = time();
        $data = is_string($value) ? json_decode($value, true) : null;

        if (! is_array($data) || ($now - (int) ($data['window_start'] ?? 0)) >= $this->windowSeconds) {
            $data = ['window_start' => $now, 'count' => 1];
        } else {
            $data['count'] = (int) $data['count'] + 1;
        }

        $encoded = json_encode($data);

        // INSERT ... ON DUPLICATE KEY để không cần đọc rồi quyết định insert
        // hay update – một câu, an toàn khi nhiều request chạy song song.
        $connection->perform(
            "INSERT INTO {$options} (option_name, option_value, autoload)
             VALUES (:key, :value, 'no')
             ON DUPLICATE KEY UPDATE option_value = VALUES(option_value)",
            [
                ':key'   => $key,
                ':value' => $encoded,
            ]
        );

        if ($data['count'] > $this->maxRequests) {
            JsonResponse::error('Rate limit exceeded. Try again later.', 429)
                ->with('retry_after', $this->windowSeconds - ($now - (int) $data['window_start']))
                ->send();
            return false;
        }

        return true;
    }
}
