<?php

namespace App\Services;

use Jankx\Foundation\Application;
use Jankx\Gutenberg\Blocks\LanguageSwitcherBlock;
use Jankx\Gutenberg\GutenbergRepository;
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

    protected $currentLanguageCode = null;

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
            return;
        }

        // Lấy current language
        $this->currentLanguageCode = pll_current_language();

        // Lấy danh sách languages
        $languages = pll_the_languages([
            'raw' => 1,
            'hide_if_empty' => 0,
            'show_flags' => 1,
            'show_names' => 1,
            'hide_current' => 0
        ]);
        $languages = $this->processingLanguagesData($languages);

        $this->languages = apply_filters('jankx/languages', $languages);
    }

    protected function processingLanguageData($language) {
        if (!is_array($language)) {
            return [];
        }

        return [
            'code' => $language['slug'],
            'name' => $language['name'],
            'url' => $language['url'],
            'flag' => $this->extractFlagSrc($language['flag'] ?? ''),
            'current' => $language['current_lang'] ?? false
        ];
    }


    protected function processingLanguagesData($languages) {
        $ret = [];
        foreach ($languages as $lang) {
            $langData = $this->processingLanguageData($lang);
            if (empty($langData)) {
                continue;
            }

            if ($langData['code'] === $this->currentLanguageCode) {
                $this->currentLanguage = $langData;
            }

            $ret[] = $langData;
        }
        // free up memory
        unset($languages, $lang);
        return $ret;
    }

    /**
     * Đăng ký Gutenberg block
     *
     * @deprecated Block registration is now handled by LanguageSwitcherBlock class
     * @return void
     */
    public function registerBlock(GutenbergRepository $repository)
    {
        $repository->registerBlock(LanguageSwitcherBlock::class);
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
        // Check if should get current page URLs
        $currentPage = $request->get_param('current_page') === 'true' || $request->get_param('current_page') === '1';
        
        // Get languages based on context
        $languagesData = $this->getLanguages($currentPage);
        
        $languages = [];
        if (!empty($languagesData)) {
            foreach ($languagesData as $lang) {
                $languages[] = [
                    'code' => $lang['code'] ?? '',
                    'name' => $lang['name'] ?? '',
                    'url' => $lang['url'] ?? '',
                    'flag' => $lang['flag'] ?? '',
                    'current' => $lang['current'] ?? false
                ];
            }
        }
        
        return new \WP_REST_Response($languages, 200);
    }

    /**
     * Extract src attribute from Polylang flag HTML
     *
     * @param string $flagHtml
     * @return string
     */
    public function extractFlagSrc($flagHtml)
    {
        if (preg_match('/src=["\']([^"\']+)["\']/', $flagHtml, $matches)) {
            return $matches[1];
        }
        return '';
    }

    /**
     * Lấy danh sách languages
     *
     * @param bool $withCurrentPageUrls Get URLs for current page translations instead of homepage
     * @return array
     */
    public function getLanguages($withCurrentPageUrls = false): array
    {
        if (!$withCurrentPageUrls) {
            return $this->languages;
        }

        // Get languages with URLs for current page
        return $this->getLanguagesForCurrentPage();
    }

    /**
     * Get languages with URLs for current page translations
     *
     * @return array
     */
    protected function getLanguagesForCurrentPage(): array
    {
        if (!function_exists('pll_the_languages')) {
            return $this->languages;
        }

        // Get languages with current page context
        $currentPageLanguages = pll_the_languages([
            'raw' => 1,
            'hide_if_empty' => 0,
            'show_flags' => 1,
            'show_names' => 1,
            'hide_current' => 0
        ]);

        if (empty($currentPageLanguages) || !is_array($currentPageLanguages)) {
            return $this->languages;
        }

        // Process and return languages with current page URLs
        $languages = [];
        foreach ($currentPageLanguages as $lang) {
            $langData = $this->processingLanguageData($lang);
            if (!empty($langData)) {
                $languages[] = $langData;
            }
        }

        return apply_filters('jankx/languages/current-page', $languages, $this->languages);
    }

    /**
     * Lấy current language
     *
     * @return string
     */
    public function getCurrentLanguage()
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
