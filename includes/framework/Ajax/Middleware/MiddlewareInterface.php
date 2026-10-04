<?php

namespace Jankx\Ajax\Middleware;

use Base;
use Jankx\Ajax\Response\JsonResponse;

/**
 * MiddlewareInterface – Contract cho tất cả Fast AJAX Middleware.
 *
 * @package Jankx\Ajax\Middleware
 */
interface MiddlewareInterface
{
    /**
     * Xử lý middleware.
     *
     * @return bool  true = tiếp tục pipeline, false = đã gửi response và dừng lại
     */
    public function handle(Base $f3): bool;
}
