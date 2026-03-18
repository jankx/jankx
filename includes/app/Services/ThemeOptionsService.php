<?php

namespace App\Services;

use Jankx\Facades\Config;
use Jankx\Facades\Log;
use Jankx\Foundation\Application;
use Jankx\Adapter\Options\Framework as OptionFramework;

class ThemeOptionsService
{
    /**
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * @var string
     */
    protected $name = 'theme-options';

    /**
     * @var array
     */
    protected $optionsData = [];

    /**
     * @var string
     */
    protected $optionsPath;

    /**
     * @var string
     */
    protected $optionName = 'bookix_theme_options';

    /**
     * @var \Jankx\Adapter\Options\Interfaces\Adapter
     */
    protected $adapter;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->optionsPath = Config::get('app.paths.options', get_stylesheet_directory() . '/resources/options');

        // Set framework từ config
        try {
            if (class_exists('Jankx\Adapter\Options\Framework')) {
                $framework = Config::get('app.options.framework');
                if (!empty($framework)) {
                    \Jankx\Adapter\Options\Framework::setFrameworkFromExternal($framework);
                }
            }
        } catch (\Exception $e) {
            Log::error('Theme Options: Error setting framework - ' . $e->getMessage());
        }

        $this->loadOptionsData();
    }

    /**
     * Khởi tạo theme options
     *
     * @return void
     */
    public function init(): void
    {
        // Khởi tạo option adapter
        $this->initOptionAdapter();

        if (!is_null($this->adapter)) {
            // Tạo sections cho adapter
            $this->createSectionsForAdapter();
        }
    }

    /**
     * Khởi tạo option adapter
     *
     * @return void
     */
    protected function initOptionAdapter(): void
    {
        try {
            // Khởi tạo option framework
            $framework = OptionFramework::getInstance();
            $framework->loadFramework();

            // Lấy active adapter
            $this->adapter = OptionFramework::getActiveFramework();

            // Debug

            // Thiết lập options data cho adapter
            if ($this->adapter) {
                $this->setupOptionsForAdapter();
            } else {
                Log::error('Theme Options: No adapter available');
            }
        } catch (\Exception $e) {
            Log::error('Theme Options: Error initializing adapter - ' . $e->getMessage());
        }
    }

    /**
     * Load options data từ child theme
     *
     * @return void
     */
    protected function loadOptionsData(): void
    {
        try {
            $pagesFile = $this->optionsPath . '/pages.php';


            if (file_exists($pagesFile)) {
                $this->optionsData['pages'] = include $pagesFile;
            } else {
            }

            // Load sections cho từng page
            if (isset($this->optionsData['pages'])) {
                foreach ($this->optionsData['pages'] as $page) {
                    $pageId = $page['id'];
                    $pageDir = $this->optionsPath . '/' . $pageId;

                    if (is_dir($pageDir)) {
                        $this->optionsData['sections'][$pageId] = [];
                        $phpFiles = glob($pageDir . '/*.php');

                        foreach ($phpFiles as $file) {
                            $sectionName = basename($file, '.php');
                            $this->optionsData['sections'][$pageId][$sectionName] = include $file;
                        }
                    } else {
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Theme Options: Error loading options data - ' . $e->getMessage());
        }
    }

    /**
     * Thiết lập options data cho adapter
     *
     * @return void
     */
    protected function setupOptionsForAdapter(): void
    {
        if (!$this->adapter) {
            return;
        }

        // Thiết lập arguments cho adapter
        $args = [
            'opt_name' => $this->optionName,
            'display_name' => 'Bookix Theme Options',
            'display_version' => '1.0.0',
            'menu_type' => 'submenu',
            'allow_sub_menu' => true,
            'menu_title' => 'Theme Options',
            'page_title' => 'Bookix Theme Options',
            'page_parent' => 'themes.php',
            'page_permissions' => 'manage_options',
            'page_slug' => 'bookix-theme-options',
        ];

        $this->adapter->setArgs($args);
    }

    /**
     * Tạo sections cho adapter
     *
     * @return void
     */
    protected function createSectionsForAdapter(): void
    {
        if (!$this->adapter) {
                        return;
        }

        try {
                // Tạo OptionsReader instance bằng getInstance
            $optionsReader = \Jankx\Adapter\Options\OptionsReader::getInstance();

            // Set options directory path (relative path) - default is includes/theme-options
            // No need to set if using default, but can override if needed
            // $optionsReader->setOptionsDirectoryPath('includes/theme-options');
            $optionsReader->setChildThemeOverrideEnabled(true);


            // Gọi createSections trên adapter
            $this->adapter->createSections($optionsReader);
        } catch (\Exception $e) {
            Log::error('Theme Options: Error creating sections - ' . $e->getMessage());
        }
    }

    /**
     * Lấy option value từ adapter
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function getOption($key, $default = null)
    {
        if (!$this->adapter) {
            return $default;
        }

        return $this->adapter->getOption($key, $default);
    }

    /**
     * Lấy menu arguments để tích hợp với Jankx Admin Menu
     *
     * @return array
     */
    public function getMenuArgs(): array
    {
        return [
            'opt_name' => $this->optionName,
            'display_name' => 'Bookix Theme Options',
            'display_version' => '1.0.0',
            'menu_type' => 'submenu',
            'allow_sub_menu' => true,
            'menu_title' => 'Theme Options',
            'page_title' => 'Bookix Theme Options',
            'page_parent' => 'themes.php', // Sẽ được thay đổi bởi JankxAdminPagesServiceProvider
            'page_permissions' => 'manage_options',
            'page_slug' => 'jankx-theme-options', // Sử dụng slug thống nhất
        ];
    }

    /**
     * Đăng ký admin menu
     *
     * @deprecated Sử dụng JankxAdminPagesServiceProvider thay thế
     */
    public function registerAdminMenu(): void
    {
        // Vô hiệu hóa việc tạo menu riêng biệt
        // Menu sẽ được tích hợp thông qua JankxAdminPagesServiceProvider
        return;

        /*
        // Tạo menu trực tiếp nếu adapter không có
        if (!$this->adapter) {
            $this->createDirectMenu();
            return;
        }

        try {
            $this->adapter->register_admin_menu('Theme Options', 'Bookix Theme Options');
        } catch (\Exception $e) {
            $this->createDirectMenu();
        }
        */
    }

    /**
     * Tạo menu trực tiếp
     *
     * @return void
     */
    protected function createDirectMenu(): void
    {
        add_menu_page(
            'Bookix Theme Options',
            'Theme Options',
            'manage_options',
            'bookix-theme-options',
            [$this, 'renderOptionsPage'],
            'dashicons-admin-generic',
            60
        );
    }

    /**
     * Render options page
     *
     * @return void
     */
    public function renderOptionsPage(): void
    {
        // Nếu có adapter và adapter có framework instance, gọi render từ framework
        if ($this->adapter && method_exists($this->adapter, 'getFramework')) {
            $framework = $this->adapter->getFramework();
            if ($framework && method_exists($framework, 'renderOptionsPage')) {
                $framework->renderOptionsPage();
                return;
            }
        }

        // Fallback: hiển thị thông tin debug
        echo '<div class="wrap">';
        echo '<h1>Bookix Theme Options</h1>';
        echo '<p>Framework Mode: ' . $this->getCurrentFrameworkMode() . '</p>';
        echo '<p>Adapter: ' . ($this->adapter ? get_class($this->adapter) : 'Not loaded') . '</p>';
        echo '<p>Options Data: ' . (empty($this->getOptionsData()) ? 'Empty' : 'Loaded') . '</p>';
        echo '</div>';
    }

    /**
     * Lấy options data
     *
     * @return array
     */
    public function getOptionsData(): array
    {
        return $this->optionsData;
    }

    /**
     * Lấy adapter
     *
     * @return \Jankx\Adapter\Options\Interfaces\Adapter|null
     */
    public function getAdapter()
    {
        return $this->adapter;
    }

    /**
     * Lấy current framework mode
     *
     * @return string
     */
    public function getCurrentFrameworkMode(): string
    {
        return OptionFramework::getCurrentMode();
    }

    /**
     * Get service name
     *
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }
}
