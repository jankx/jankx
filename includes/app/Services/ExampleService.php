<?php

namespace App\Services;

use Jankx\Foundation\Application;
use Jankx\Services\AbstractService;

class ExampleService extends AbstractService
{
    /**
     * @var array
     */
    protected $data = [];

    /**
     * @var string
     */
    protected $name = 'example';

    public function __construct(Application $app)
    {
        parent::__construct($app);
        $this->name = 'example';
    }

    /**
     * Boot service
     *
     * @return void
     */
    protected function boot(): void
    {
        // Khởi tạo dữ liệu mẫu
        $this->data = [
            'message' => __('Service initialized successfully!', 'jankx'),
            'timestamp' => time(),
            'version' => '1.0.0'
        ];

        // Thêm hook WordPress nếu cần
        add_action('wp_footer', [$this, 'displayMessage']);
    }

    /**
     * Lấy dữ liệu từ service
     *
     * @return array
     */
    public function getData(): array
    {
        return $this->data;
    }

    /**
     * Thêm dữ liệu vào service
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public function setData(string $key, $value): void
    {
        $this->data[$key] = $value;
    }

    /**
     * Hiển thị message trong footer
     *
     * @return void
     */
    public function displayMessage(): void
    {
        if (current_user_can('manage_options')) {
            echo '<div style="position: fixed; bottom: 10px; right: 10px; background: #007cba; color: white; padding: 10px; border-radius: 5px; z-index: 9999;">';
            echo __('ExampleService: ', 'jankx') . $this->data['message'];
            echo '</div>';
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
