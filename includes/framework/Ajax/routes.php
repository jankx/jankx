<?php

/**
 * Jankx Fast AJAX – Custom Routes
 *
 * File này được nạp bởi FlightRouter sau khi routes mặc định đã đăng ký.
 * Dùng để:
 *   - Thêm namespace mới cho extension/plugin
 *   - Đăng ký route Flight đặc biệt (custom patterns)
 *
 * Biến có sẵn:
 *   $router  – instance của \Jankx\Ajax\Router\FlightRouter
 *
 * ────────────────────────────────────────────────────────────────────
 * Ví dụ thêm namespace cho extension "ai-chatbox":
 *
 *   $router->addNamespace('ai', 'Jankx\\Extensions\\AiChatbox\\Ajax\\Controller\\');
 *
 * Sau đó tạo:
 *   extensions/ai-chatbox/src/Ajax/Controller/ChatController.php
 *
 * Truy cập qua:
 *   POST /jankx-ajax/ai/chat/send
 *
 * ────────────────────────────────────────────────────────────────────
 * Ví dụ đăng ký route Flight tùy chỉnh:
 *
 *   $router->flight->route('POST /jankx-ajax/v2/custom', function() {
 *       header('Content-Type: application/json');
 *       echo json_encode(['ok' => true]);
 *   });
 *
 */

// Bạn có thể đăng ký route Flight tùy chỉnh ở đây nếu cần.
// Tuy nhiên, việc đăng ký namespace cho các extension nay đã được tự động hóa
// thông qua khai báo `ajax_slug` và `ajax_namespace` bên trong file `manifest.json`.
