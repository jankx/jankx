<?php

namespace Jankx\Managers;

use Jankx\Foundation\Application;

class DeferredServiceManager
{
    /**
     * @var Application
     */
    protected $app;

    /**
     * @var array
     */
    protected $deferredServices = [];

    /**
     * @var array
     */
    protected $resolvedServices = [];

    /**
     * @var array
     */
    protected $serviceCallbacks = [];

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Đăng ký một service với callback để tạo instance
     *
     * @param string $serviceName
     * @param callable $callback
     * @param array $dependencies
     * @return void
     */
    public function register(string $serviceName, callable $callback, array $dependencies = [])
    {
        $this->deferredServices[$serviceName] = [
            'callback' => $callback,
            'dependencies' => $dependencies,
            'resolved' => false
        ];
    }

    /**
     * Lấy service instance, tạo nếu chưa tồn tại
     *
     * @param string $serviceName
     * @return mixed
     * @throws \Exception
     */
    public function get(string $serviceName)
    {
        if (!isset($this->deferredServices[$serviceName])) {
            throw new \Exception("Service '{$serviceName}' chưa được đăng ký.");
        }

        if (!$this->deferredServices[$serviceName]['resolved']) {
            $this->resolveService($serviceName);
        }

        return $this->resolvedServices[$serviceName];
    }

    /**
     * Kiểm tra service đã được resolve chưa
     *
     * @param string $serviceName
     * @return bool
     */
    public function isResolved(string $serviceName): bool
    {
        return isset($this->deferredServices[$serviceName]) &&
               $this->deferredServices[$serviceName]['resolved'];
    }

    /**
     * Kiểm tra service đã được đăng ký chưa
     *
     * @param string $serviceName
     * @return bool
     */
    public function isRegistered(string $serviceName): bool
    {
        return isset($this->deferredServices[$serviceName]);
    }

    /**
     * Resolve một service cụ thể
     *
     * @param string $serviceName
     * @return void
     */
    protected function resolveService(string $serviceName)
    {
        $service = $this->deferredServices[$serviceName];

        // Resolve dependencies trước
        $dependencies = [];
        foreach ($service['dependencies'] as $dependency) {
            if ($this->isRegistered($dependency)) {
                $dependencies[] = $this->get($dependency);
            } else {
                $dependencies[] = $this->app->make($dependency);
            }
        }

        // Tạo instance service
        $this->resolvedServices[$serviceName] = call_user_func_array(
            $service['callback'],
            $dependencies
        );

        $this->deferredServices[$serviceName]['resolved'] = true;
    }

    /**
     * Resolve tất cả services đã đăng ký
     *
     * @return void
     */
    public function resolveAll()
    {
        foreach (array_keys($this->deferredServices) as $serviceName) {
            if (!$this->isResolved($serviceName)) {
                $this->resolveService($serviceName);
            }
        }
    }

    /**
     * Lấy danh sách tất cả services đã đăng ký
     *
     * @return array
     */
    public function getRegisteredServices(): array
    {
        return array_keys($this->deferredServices);
    }

    /**
     * Lấy danh sách services đã được resolve
     *
     * @return array
     */
    public function getResolvedServices(): array
    {
        return array_keys($this->resolvedServices);
    }

    /**
     * Xóa một service đã đăng ký
     *
     * @param string $serviceName
     * @return void
     */
    public function forget(string $serviceName)
    {
        unset($this->deferredServices[$serviceName]);
        unset($this->resolvedServices[$serviceName]);
    }

    /**
     * Xóa tất cả services
     *
     * @return void
     */
    public function flush()
    {
        $this->deferredServices = [];
        $this->resolvedServices = [];
    }
}
