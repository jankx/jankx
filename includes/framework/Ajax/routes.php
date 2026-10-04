<?php

/**
 * Jankx Fast AJAX – Custom Routes
 *
 * File này được nạp bởi F3Router sau khi routes mặc định đã đăng ký.
 * Dùng để:
 *   - Thêm namespace mới cho extension/plugin
 *   - Đăng ký route F3 đặc biệt (custom patterns)
 *
 * Biến có sẵn:
 *   $router  – instance của \Jankx\Ajax\Router\F3Router
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
 * Ví dụ đăng ký route F3 tùy chỉnh:
 *
 *   $router->f3->route('POST /jankx-ajax/v2/custom', function(\Base $f3) {
 *       header('Content-Type: application/json');
 *       echo json_encode(['ok' => true]);
 *   });
 *
 */

// Đăng ký namespace cho AI Chatbox extension
$router->addNamespace('ai', 'Jankx\\Extensions\\AiChatbox\\Ajax\\Controller\\');
