<?php

namespace Jankx\Ajax\Controller;

use flight\net\Request;
use Jankx\Ajax\Response\JsonResponse;

/**
 * AbstractController – Base class cho tất cả Fast AJAX controllers.
 *
 * Subclass chỉ cần:
 *   1. Override $middlewares nếu cần thêm/bỏ middleware
 *   2. Định nghĩa các public method (action) nhận array $params
 *
 * @package Jankx\Ajax\Controller
 */
abstract class AbstractController
{
    protected Request     $request;
    protected JsonResponse $response;

    /**
     * Danh sách middleware class chạy trước khi action được gọi.
     * Override trong subclass để tùy chỉnh.
     *
     * @var string[]
     */
    protected array $middlewares = [];

    public function __construct(?Request $request)
    {
        $this->request  = $request ?? new Request();
        $this->response = new JsonResponse();
    }

    /**
     * Trả về danh sách middleware của controller này.
     *
     * @return string[]
     */
    public function getMiddlewares(): array
    {
        return $this->middlewares;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Lấy body parameter từ request.
     * Hỗ trợ cả JSON body và form-data.
     */
    protected function input(string $key, mixed $default = null): mixed
    {
        // JSON body
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (str_contains($contentType, 'application/json')) {
            $json = json_decode($this->request->getBody(), true);
            if (isset($json[$key])) {
                return $json[$key];
            }
        }

        // Form / query param
        return $_POST[$key] ?? $_GET[$key] ?? $default;
    }

    /**
     * Trả về tất cả input (JSON body hoặc POST).
     */
    protected function all(): array
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (str_contains($contentType, 'application/json')) {
            $json = json_decode($this->request->getBody(), true);
            if (is_array($json)) {
                return $json;
            }
        }
        return $_POST;
    }

    /**
     * Lấy query string param.
     */
    protected function query(string $key, mixed $default = null): mixed
    {
        return $_GET[$key] ?? $default;
    }

    /**
     * Shortcut gửi JSON thành công.
     */
    protected function success(array $data = [], int $code = 200): void
    {
        JsonResponse::success($data, $code)->send();
    }

    /**
     * Shortcut gửi JSON lỗi.
     */
    protected function error(string $message, int $code = 400, array $extra = []): void
    {
        JsonResponse::error($message, $code, $extra)->send();
    }

    /**
     * Lấy request method hiện tại.
     */
    protected function method(): string
    {
        return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    }

    /**
     * Kiểm tra đây có phải POST request không.
     */
    protected function isPost(): bool
    {
        return $this->method() === 'POST';
    }

    /**
     * Lấy IP của người dùng.
     */
    protected function ip(): string
    {
        return $this->request->ip;
    }

    /**
     * Thực hiện truy vấn database an toàn qua $wpdb (SHORTINIT đã nạp $wpdb).
     */
    protected function db(): \wpdb
    {
        global $wpdb;
        return $wpdb;
    }
}
