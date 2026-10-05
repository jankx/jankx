<?php

/**
 * Jankx Fast AJAX – entry point độc lập.
 *
 * Xử lý request Ajax mà không nạp WordPress: không wp-load.php, không
 * SHORTINIT, không plugin, không theme functions.php. Toàn bộ ngữ nghĩa
 * WordPress mà controller cần (hook, đăng nhập, escape) do package
 * jankx/flight-wordpress-concept cung cấp trên Atlas ORM.
 *
 * URL: /jankx-ajax/<namespace>/<controller>/<action>[/<params>]
 *   vd: /jankx-ajax/jankx/ping/index
 *
 * @package Jankx
 */

// ── 0. Đồng hồ đo thời gian ──────────────────────────────────────────────────
$_JANKX_AJAX_START = microtime(true);

// ── 1. Autoload ───────────────────────────────────────────────────────────────
$autoload = __DIR__ . '/vendor/autoload.php';

if (! is_readable($autoload)) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo '{"success":false,"error":"Thiếu vendor/autoload.php. Chạy composer install."}';
    exit;
}

require $autoload;

// ── 2. Preflight CORS ─────────────────────────────────────────────────────────
// OPTIONS chỉ cần header, không cần boot.
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-WP-Nonce');
    http_response_code(204);
    exit;
}

// ── 3. Chuẩn bị runtime ──────────────────────────────────────────────────────
// Đọc wp-config, xác thực cookie, nạp extension, kích 'init'.
$themeDir = __DIR__;

try {
    \Jankx\Flight\WordpressConcept\Bootstrap::boot($themeDir);
} catch (\Throwable $exception) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(
        ['success' => false, 'error' => $exception->getMessage()],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}

// ── 4. Đo thời gian phản hồi ──────────────────────────────────────────────────
\Jankx\Ajax\Response\JsonResponse::startTimer();

// ── 5. Route ──────────────────────────────────────────────────────────────────
// Rewrite /jankx-ajax/* trỏ thẳng vào file này. Ở chế độ direct, REQUEST_URI
// vẫn giữ phần /ajax.php phía trước nên cắt từ /jankx-ajax trở đi.
$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$position   = strpos($requestUri, '/jankx-ajax');

if ($position !== false) {
    $_SERVER['REQUEST_URI'] = substr($requestUri, $position);
}

$router = new \Jankx\Ajax\Router\FlightRouter($themeDir);
$router->dispatch();
