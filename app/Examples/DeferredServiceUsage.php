<?php

namespace App\Examples;

use App\Helpers\ServiceHelper;
use App\Services\DeferredServiceManager;

/**
 * Ví dụ cách sử dụng Deferred Services
 */
class DeferredServiceUsage
{
    /**
     * Ví dụ cơ bản về cách sử dụng
     */
    public static function basicUsage()
    {
        // Khởi tạo ServiceHelper (thường được gọi trong provider)
        // ServiceHelper::init($app);

        // Lấy service khi cần
        if (ServiceHelper::hasService('example')) {
            $exampleService = ServiceHelper::service('example');
            $exampleService->initialize();

            $data = $exampleService->getData();
            echo "Example Service Data: " . json_encode($data);
        }

        // Sử dụng cache service
        if (ServiceHelper::hasService('cache')) {
            $cacheService = ServiceHelper::cache();
            $cacheService->initialize();

            // Lưu dữ liệu vào cache
            $cacheService->set('user_data', ['name' => 'John', 'age' => 30]);

            // Lấy dữ liệu từ cache
            $userData = $cacheService->get('user_data');
            echo "Cached User Data: " . json_encode($userData);

            // Sử dụng remember pattern
            $expensiveData = $cacheService->remember('expensive_calculation', function () {
                // Giả lập tính toán tốn kém
                sleep(1);
                return ['result' => 'expensive_data', 'timestamp' => time()];
            }, 3600); // Cache 1 giờ

            echo "Expensive Data: " . json_encode($expensiveData);
        }
    }

    /**
     * Ví dụ sử dụng với dependencies
     */
    public static function dependencyUsage()
    {
        if (ServiceHelper::hasService('cache_with_example')) {
            $cacheWithExample = ServiceHelper::service('cache_with_example');
            $cacheWithExample->initialize();

            // Service này đã có sẵn dữ liệu từ example service
            $exampleData = $cacheWithExample->get('example_data');
            echo "Example Data from Cache: " . json_encode($exampleData);
        }
    }

    /**
     * Ví dụ sử dụng advanced service
     */
    public static function advancedUsage()
    {
        if (ServiceHelper::hasService('advanced_example')) {
            $advancedService = ServiceHelper::advancedExample();
            $advancedService->initialize();

            $data = $advancedService->getData();
            echo "Advanced Service Data: " . json_encode($data);
        }
    }

    /**
     * Ví dụ debug và thống kê
     */
    public static function debugUsage()
    {
        // Hiển thị debug panel
        ServiceHelper::debug();

        // Lấy thống kê
        $stats = ServiceHelper::getStats();
        echo "Service Statistics: " . json_encode($stats, JSON_PRETTY_PRINT);

        // Resolve tất cả services
        ServiceHelper::resolveAll();

        // Kiểm tra lại thống kê sau khi resolve all
        $statsAfter = ServiceHelper::getStats();
        echo "Statistics after resolve all: " . json_encode($statsAfter, JSON_PRETTY_PRINT);
    }

    /**
     * Ví dụ sử dụng trực tiếp DeferredServiceManager
     */
    public static function directManagerUsage()
    {
        // Giả sử chúng ta có access đến app
        // $app = jankx_app();
        // $deferredManager = $app->make(DeferredServiceManager::class);

        // Đăng ký service mới
        // $deferredManager->register('custom_service', function () use ($app) {
        //     return new CustomService($app);
        // });

        // Lấy service
        // $customService = $deferredManager->get('custom_service');
        // $customService->initialize();
    }

    /**
     * Ví dụ hook WordPress để sử dụng services
     */
    public static function wordpressHooks()
    {
        // Hook để khởi tạo services khi cần
        add_action('wp_head', function () {
            if (ServiceHelper::hasService('example')) {
                $exampleService = ServiceHelper::example();
                $exampleService->initialize();

                // Thêm meta tags hoặc scripts
                echo '<meta name="service-status" content="initialized">';
            }
        });

        // Hook cho admin
        add_action('admin_init', function () {
            if (ServiceHelper::hasService('cache')) {
                $cacheService = ServiceHelper::cache();
                $cacheService->initialize();

                // Hiển thị thống kê cache trong admin
                $stats = $cacheService->getStats();
                add_action('admin_notices', function () use ($stats) {
                    echo '<div class="notice notice-info">';
                    echo '<p>Cache Stats: ' . $stats['valid'] . ' valid, ' . $stats['expired'] . ' expired items</p>';
                    echo '</div>';
                });
            }
        });

        // Hook cho AJAX
        add_action('wp_ajax_get_service_stats', function () {
            $stats = ServiceHelper::getStats();
            wp_send_json_success($stats);
        });
    }

    /**
     * Ví dụ tạo custom service
     */
    public static function createCustomService()
    {
        // Tạo custom service class
        $customService = new class () extends \App\Services\AbstractService {
            protected $name = 'custom';

            protected function boot(): void
            {
                // Logic khởi tạo custom service
                $this->setData('custom_feature', true);
                $this->setData('created_at', time());
            }

            public function customMethod()
            {
                return "Custom service method called at " . date('Y-m-d H:i:s');
            }
        };

        // Sử dụng custom service
        $customService->initialize();
        echo $customService->customMethod();
    }
}
