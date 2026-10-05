<?php

/**
 * Jankx Fast AJAX Entry Point
 *
 * Sử dụng WordPress SHORTINIT để boot tối giản (mục tiêu <10ms),
 * sau đó dùng Flight PHP để route request theo MVC.
 *
 * URL format:  /jankx-ajax/<ns>/<controller>/<action>[/<params>]
 * Ví dụ:       /jankx-ajax/jankx/ping/index
 *
 * @package Jankx
 */

// ── 0. Bắt đầu đo thời gian ngay từ đầu ──────────────────────────────────────
$_JANKX_AJAX_START = microtime(true);

// Preflight CORS (OPTIONS request không cần boot WP)
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-WP-Nonce');
    http_response_code(204);
    exit;
}

// ── 1. Xác định đường dẫn đến wp-load.php ─────────────────────────────────────
$wpRoot = __DIR__;
for ($i = 0; $i < 8; $i++) {
    if (file_exists($wpRoot . '/wp-load.php')) {
        break;
    }
    $wpRoot = dirname($wpRoot);
}

if (! file_exists($wpRoot . '/wp-load.php')) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'WordPress not found.']);
    exit;
}

// ── 2. Boot WordPress ở chế độ SHORTINIT ──────────────────────────────────────
// SHORTINIT bỏ qua: tất cả plugins, theme, rewrite rules, WP_Query, REST API.
// CHỈ nạp: $wpdb, get_option(), wp_verify_nonce(), các hàm DB cơ bản.

define('SHORTINIT', true);
require $wpRoot . '/wp-load.php';

// ── 3. Nạp Composer autoloader của Jankx theme ────────────────────────────────
$themeDir = __DIR__;
if (file_exists($themeDir . '/vendor/autoload.php')) {
    require $themeDir . '/vendor/autoload.php';
}

// ── 4. Khởi tạo JsonResponse timer ────────────────────────────────────────────
\Jankx\Ajax\Response\JsonResponse::startTimer();

// ── 5. Khởi tạo Flight PHP và dispatch routes ────────────────────────────────
$router = new \Jankx\Ajax\Router\FlightRouter($themeDir);
$router->dispatch();

