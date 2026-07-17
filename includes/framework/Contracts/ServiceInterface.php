<?php

namespace Jankx\Contracts;

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

    /**
     * Check if service should be loaded
     *
     * @return bool
     */
    public function shouldLoad(): bool;

    /**
     * Check if service should be loaded in frontend
     *
     * @return bool
     */
    public function shouldLoadFrontend(): bool;

    /**
     * Check if service should be loaded in admin
     *
     * @return bool
     */
    public function shouldLoadAdmin(): bool;

    /**
     * Check if service should be loaded in CLI
     *
     * @return bool
     */
    public function shouldLoadCli(): bool;

    /**
     * Check if service should be loaded in Cron
     *
     * @return bool
     */
    public function shouldLoadCron(): bool;

    /**
     * Check if service should be loaded in REST API
     *
     * @return bool
     */
    public function shouldLoadRest(): bool;

    /**
     * Check if service should be loaded in AJAX
     *
     * @return bool
     */
    public function shouldLoadAjax(): bool;

    /**
     * Check if service has been scheduled to boot
     *
     * @return bool
     */
    public function isBootScheduled(): bool;
}
