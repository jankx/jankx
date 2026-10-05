<?php

namespace Jankx\Ajax\Middleware;

use flight\net\Request;
use Jankx\Ajax\Response\JsonResponse;

/**
 * RateLimitMiddleware – Giới hạn request per IP để chống DDoS/spam.
 *
 * Sử dụng WordPress Transient (yêu cầu $wpdb đã sẵn sàng qua SHORTINIT).
 * Giá trị mặc định: 60 request / 60 giây per IP.
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
        global $wpdb;

        $ip  = $request->ip;
        $key = '_transient_jankx_rl_' . md5($ip);

        // Đọc trực tiếp từ DB (SHORTINIT không có wp_cache)
        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT option_value, option_name FROM {$wpdb->options}
                 WHERE option_name = %s LIMIT 1",
                $key
            )
        );

        $now  = time();
        $data = $row ? json_decode($row->option_value, true) : null;

        if (! $data || ($now - $data['window_start']) >= $this->windowSeconds) {
            // Bắt đầu cửa sổ mới
            $data = ['window_start' => $now, 'count' => 1];
        } else {
            $data['count']++;
        }

        // Lưu lại (upsert)
        $expiry = '_transient_timeout_' . substr($key, strlen('_transient_'));
        if ($row) {
            $wpdb->update(
                $wpdb->options,
                ['option_value' => json_encode($data)],
                ['option_name'  => $key]
            );
        } else {
            $wpdb->insert($wpdb->options, [
                'option_name'  => $key,
                'option_value' => json_encode($data),
                'autoload'     => 'no',
            ]);
        }

        if ($data['count'] > $this->maxRequests) {
            JsonResponse::error('Rate limit exceeded. Try again later.', 429)
                ->with('retry_after', $this->windowSeconds - ($now - $data['window_start']))
                ->send();
            return false;
        }

        return true;
    }
}
