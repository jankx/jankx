<?php

namespace Jankx\Services;

use Jankx\Contracts\ServiceInterface;
use Jankx\Foundation\Application;

abstract class AbstractService implements ServiceInterface
{
    /**
     * @var Application
     */
    protected $app;

    /**
     * @var bool
     */
    protected $initialized = false;

    /**
     * @var string
     */
    protected $name;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->name = static::class;
    }

    /**
     * Khởi tạo service
     *
     * @return void
     */
    public function initialize(): void
    {
        if ($this->initialized) {
            return;
        }

        $this->boot();
        $this->initialized = true;
    }

    /**
     * Kiểm tra service đã được khởi tạo chưa
     *
     * @return bool
     */
    public function isInitialized(): bool
    {
        return $this->initialized;
    }

    /**
     * Lấy tên service
     *
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Phương thức boot để override trong các service con
     *
     * @return void
     */
    abstract protected function boot(): void;

    /**
     * Lấy application instance
     *
     * @return Application
     */
    protected function getApp(): Application
    {
        return $this->app;
    }
}
