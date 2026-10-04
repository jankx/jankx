<?php

namespace Jankx\Ajax\Response;

/**
 * JsonResponse – Chuẩn hóa định dạng phản hồi JSON cho Jankx Fast AJAX.
 *
 * Format thành công:
 * {
 *   "success": true,
 *   "data": { ... },
 *   "time_ms": 4.2
 * }
 *
 * Format lỗi:
 * {
 *   "success": false,
 *   "error": "message",
 *   "code": 404
 * }
 *
 * @package Jankx\Ajax\Response
 */
class JsonResponse
{
    protected array $payload;
    protected int   $statusCode;

    /** @var float Thời điểm bắt đầu xử lý request (microtime) */
    protected static float $startTime = 0.0;

    public function __construct(array $payload = [], int $statusCode = 200)
    {
        $this->payload    = $payload;
        $this->statusCode = $statusCode;
    }

    // ── Static factories ──────────────────────────────────────────────────────

    public static function success(array $data = [], int $code = 200): static
    {
        return new static([
            'success' => true,
            'data'    => $data,
        ], $code);
    }

    public static function error(string $message, int $code = 400, array $extra = []): static
    {
        return new static(array_merge([
            'success' => false,
            'error'   => $message,
            'code'    => $code,
        ], $extra), $code);
    }

    // ── Builders ──────────────────────────────────────────────────────────────

    public function with(string $key, mixed $value): static
    {
        $this->payload[$key] = $value;
        return $this;
    }

    public function withMeta(string $key, mixed $value): static
    {
        $this->payload['meta'][$key] = $value;
        return $this;
    }

    // ── Output ────────────────────────────────────────────────────────────────

    public function toJson(): string
    {
        $payload = $this->payload;

        // Thêm thời gian xử lý (ms) vào response thành công
        if (($payload['success'] ?? false) && self::$startTime > 0.0) {
            $payload['time_ms'] = round((microtime(true) - self::$startTime) * 1000, 2);
        }

        return (string) json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Gửi HTTP headers + JSON body rồi thoát.
     */
    public function send(): void
    {
        if (! headers_sent()) {
            http_response_code($this->statusCode);
            header('Content-Type: application/json; charset=utf-8');
            header('X-Content-Type-Options: nosniff');
            header('Cache-Control: no-store, no-cache, must-revalidate');

            // CORS header (có thể override qua filter nếu WP full đang chạy)
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, X-WP-Nonce');
        }

        echo $this->toJson();
        exit;
    }

    // ── Timing helpers ────────────────────────────────────────────────────────

    /**
     * Đánh dấu thời điểm bắt đầu xử lý (gọi ngay khi vào ajax.php).
     */
    public static function startTimer(): void
    {
        self::$startTime = microtime(true);
    }

    public static function getElapsedMs(): float
    {
        return self::$startTime > 0.0
            ? round((microtime(true) - self::$startTime) * 1000, 2)
            : 0.0;
    }
}
