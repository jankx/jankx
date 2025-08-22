<?php

namespace App\Services;

use Jankx\Foundation\Application;
use Jankx\Services\AbstractService;

class LanguageSwitcherService extends AbstractService
{
    /**
     * @var string
     */
    protected $name = 'language-switcher';

    /**
     * @var array
     */
    protected $languages = [];

    /**
     * @var string
     */
    protected $currentLanguage = '';

    public function __construct(Application $app)
    {
        parent::__construct($app);
        $this->name = 'language-switcher';
    }

    /**
     * Boot service
     *
     * @return void
     */
    protected function boot(): void
    {
        // Khởi tạo dữ liệu language
        $this->initLanguages();
    }

    /**
     * Khởi tạo language switcher
     *
     * @return void
     */
    public function init(): void
    {
        // Khởi tạo dữ liệu language
        $this->initLanguages();
    }

    /**
     * Khởi tạo danh sách languages từ Polylang
     *
     * @return void
     */
    protected function initLanguages(): void
    {
        if (!function_exists('pll_the_languages')) {
            if (WP_DEBUG) {
                error_log('LanguageSwitcherService: pll_the_languages function not found');
            }
            return;
        }

        // Lấy current language
        $this->currentLanguage = pll_current_language() ?: '';

        if (WP_DEBUG) {
            error_log('LanguageSwitcherService: Current language: ' . $this->currentLanguage);
        }

        // Lấy danh sách languages
        $this->languages = pll_the_languages([
            'raw' => 1,
            'hide_if_empty' => 0,
            'show_flags' => 1,
            'show_names' => 1,
            'hide_current' => 0
        ]);

        if (WP_DEBUG) {
            error_log('LanguageSwitcherService: Languages count: ' . count($this->languages));
            error_log('LanguageSwitcherService: Languages data: ' . print_r($this->languages, true));
        }
    }

    /**
     * Đăng ký Gutenberg block
     *
     * @deprecated Block registration is now handled by LanguageSwitcherBlock class
     * @return void
     */
    public function registerBlock(): void
    {
        // Block registration is now handled by LanguageSwitcherBlock class
        // This method is kept for backward compatibility but should not be used
        return;
    }





    /**
     * Lấy trạng thái debug của service
     *
     * @return array
     */
    public function getDebugInfo(): array
    {
        return [
            'polylang_active' => function_exists('pll_the_languages'),
            'current_language' => $this->currentLanguage,
            'languages_count' => count($this->languages),
            'languages_data' => $this->languages,
            'service_name' => $this->name
        ];
    }

    /**
     * Đăng ký REST API routes
     *
     * @return void
     */
    public function registerRestRoutes(): void
    {
        // Đăng ký route ngay lập tức nếu rest_api_init đã được gọi
        if (did_action('rest_api_init')) {
            $this->registerLanguagesRoute();
        } else {
            // Nếu chưa, đợi hook rest_api_init
            add_action('rest_api_init', [$this, 'registerLanguagesRoute']);
        }
    }

    /**
     * Đăng ký languages route
     *
     * @return void
     */
    public function registerLanguagesRoute(): void
    {
        register_rest_route('jankx/v1', '/languages', [
            'methods' => 'GET',
            'callback' => [$this, 'getLanguagesApi'],
            'permission_callback' => '__return_true',
            'args' => [
                '_locale' => [
                    'description' => 'Locale parameter for internationalization',
                    'type' => 'string',
                    'required' => false,
                    'default' => 'user'
                ]
            ]
        ]);

        // Thêm endpoint debug
        register_rest_route('jankx/v1', '/debug/language-switcher', [
            'methods' => 'GET',
            'callback' => [$this, 'getDebugInfo'],
            'permission_callback' => '__return_true'
        ]);

        // Thêm endpoint refresh
        register_rest_route('jankx/v1', '/refresh/languages', [
            'methods' => 'POST',
            'callback' => [$this, 'refreshLanguages'],
            'permission_callback' => '__return_true'
        ]);
    }

    /**
     * REST API endpoint để lấy danh sách languages
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function getLanguagesApi(\WP_REST_Request $request): \WP_REST_Response
    {
        $languages = [];

        if (!empty($this->languages)) {
            foreach ($this->languages as $lang) {
                $languages[] = [
                    'code' => $lang['slug'],
                    'name' => $lang['name'],
                    'url' => $lang['url'],
                    'flag' => $lang['flag'] ?? '',
                    'current' => $lang['current_lang'] ?? false
                ];
            }
        }

        return new \WP_REST_Response($languages, 200);
    }

    /**
     * Lấy danh sách languages
     *
     * @return array
     */
    public function getLanguages(): array
    {
        return $this->languages;
    }

    /**
     * Lấy current language
     *
     * @return string
     */
    public function getCurrentLanguage(): string
    {
        return $this->currentLanguage;
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
     * Force refresh dữ liệu languages
     *
     * @return void
     */
    public function refreshLanguages(): void
    {
        $this->initLanguages();
    }
}
