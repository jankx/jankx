<?php

namespace App\Services;

interface ServiceInterface
{
    /**
     * Khởi tạo service
     *
     * @return void
     */
    public function initialize(): void;

    /**
     * Kiểm tra service đã được khởi tạo chưa
     *
     * @return bool
     */
    public function isInitialized(): bool;

    /**
     * Lấy tên service
     *
     * @return string
     */
    public function getName(): string;
}