<?php

namespace App\Services;

use Jankx\Foundation\Application;
use Jankx\Services\AbstractService;

class CacheService extends AbstractService
{
    /**
     * @var array
     */
    protected $cache = [];

    /**
     * @var int
     */
    protected $defaultTtl = 3600; // 1 giờ

    /**
     * @var string
     */
    protected $name = 'cache';

    public function __construct(Application $app)
    {
        parent::__construct($app);
        $this->name = 'cache';
    }

    /**
     * Boot service
     *
     * @return void
     */
    protected function boot(): void
    {
        // Khởi tạo cache từ WordPress transient nếu có
        $this->loadFromTransient();

        // Hook để lưu cache khi shutdown
        add_action('shutdown', [$this, 'saveToTransient']);
    }

    /**
     * Lấy giá trị từ cache
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get(string $key, $default = null)
    {
        if (!$this->has($key)) {
            return $default;
        }

        $item = $this->cache[$key];

        // Kiểm tra TTL
        if (isset($item['expires_at']) && $item['expires_at'] < time()) {
            $this->forget($key);
            return $default;
        }

        return $item['value'];
    }

    /**
     * Lưu giá trị vào cache
     *
     * @param string $key
     * @param mixed $value
     * @param int $ttl
     * @return void
     */
    public function set(string $key, $value, int $ttl = null): void
    {
        $ttl = $ttl ?? $this->defaultTtl;

        $this->cache[$key] = [
            'value' => $value,
            'expires_at' => time() + $ttl,
            'created_at' => time()
        ];
    }

    /**
     * Kiểm tra key có tồn tại trong cache không
     *
     * @param string $key
     * @return bool
     */
    public function has(string $key): bool
    {
        return isset($this->cache[$key]);
    }

    /**
     * Xóa một key khỏi cache
     *
     * @param string $key
     * @return void
     */
    public function forget(string $key): void
    {
        unset($this->cache[$key]);
    }

    /**
     * Xóa tất cả cache
     *
     * @return void
     */
    public function flush(): void
    {
        $this->cache = [];
    }

    /**
     * Lấy hoặc tạo cache
     *
     * @param string $key
     * @param callable $callback
     * @param int $ttl
     * @return mixed
     */
    public function remember(string $key, callable $callback, int $ttl = null)
    {
        if ($this->has($key)) {
            return $this->get($key);
        }

        $value = $callback();
        $this->set($key, $value, $ttl);

        return $value;
    }

    /**
     * Lấy thống kê cache
     *
     * @return array
     */
    public function getStats(): array
    {
        $total = count($this->cache);
        $expired = 0;
        $valid = 0;

        foreach ($this->cache as $item) {
            if (isset($item['expires_at']) && $item['expires_at'] < time()) {
                $expired++;
            } else {
                $valid++;
            }
        }

        return [
            'total' => $total,
            'valid' => $valid,
            'expired' => $expired,
            'memory_usage' => memory_get_usage(true)
        ];
    }

    /**
     * Load cache từ WordPress transient
     *
     * @return void
     */
    protected function loadFromTransient(): void
    {
        $cached = get_transient('app_cache_service');
        if ($cached && is_array($cached)) {
            $this->cache = $cached;
        }
    }

    /**
     * Lưu cache vào WordPress transient
     *
     * @return void
     */
    public function saveToTransient(): void
    {
        // Dọn dẹp cache hết hạn trước khi lưu
        $this->cleanup();

        set_transient('app_cache_service', $this->cache, HOUR_IN_SECONDS);
    }

    /**
     * Dọn dẹp cache hết hạn
     *
     * @return void
     */
    protected function cleanup(): void
    {
        foreach ($this->cache as $key => $item) {
            if (isset($item['expires_at']) && $item['expires_at'] < time()) {
                unset($this->cache[$key]);
            }
        }
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
}