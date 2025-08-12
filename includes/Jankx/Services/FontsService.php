<?php

namespace Jankx\Services;

use Jankx\Services\Fonts\FontManager;
use Jankx\Services\Fonts\GoogleFontsProvider;
use Jankx\Services\Fonts\AdobeFontsProvider;
use Jankx\Services\Fonts\CustomFontsProvider;

/**
 * Service để quản lý fonts cho Jankx theme
 * Hỗ trợ Google Fonts, Adobe Fonts và Custom Fonts
 */
class FontsService
{
    protected $fontManager;
    protected $googleFontsProvider;
    protected $adobeFontsProvider;
    protected $customFontsProvider;

    protected $fonts = [];
    protected $fontCategories = [];

    public function __construct()
    {
        $this->fontManager = new FontManager();
        $this->googleFontsProvider = new GoogleFontsProvider();
        $this->adobeFontsProvider = new AdobeFontsProvider();
        $this->customFontsProvider = new CustomFontsProvider();

        $this->loadFonts();
    }

    /**
     * Khởi tạo service
     */
    public function init()
    {
        // Load fonts từ database
        $this->loadFontsFromDatabase();

        // Đăng ký fonts với WordPress
        $this->registerFontsWithWordPress();
    }

    /**
     * Load fonts từ memory
     */
    protected function loadFonts()
    {
        $this->fonts = [
            'system' => [
                'Arial' => 'Arial, sans-serif',
                'Helvetica' => 'Helvetica, Arial, sans-serif',
                'Times New Roman' => 'Times New Roman, serif',
                'Georgia' => 'Georgia, serif',
                'Verdana' => 'Verdana, Geneva, sans-serif',
                'Tahoma' => 'Tahoma, Geneva, sans-serif',
                'Trebuchet MS' => 'Trebuchet MS, sans-serif',
                'Impact' => 'Impact, Charcoal, sans-serif',
                'Comic Sans MS' => 'Comic Sans MS, cursive',
                'Courier New' => 'Courier New, monospace',
            ]
        ];

        $this->fontCategories = [
            'system' => 'System Fonts',
            'google' => 'Google Fonts',
            'adobe' => 'Adobe Fonts',
            'custom' => 'Custom Fonts',
        ];
    }

    /**
     * Load fonts từ database
     */
    protected function loadFontsFromDatabase()
    {
        $storedFonts = get_option('jankx_fonts', []);

        if (!empty($storedFonts)) {
            foreach ($storedFonts as $category => $fonts) {
                if (!isset($this->fonts[$category])) {
                    $this->fonts[$category] = [];
                }
                $this->fonts[$category] = array_merge($this->fonts[$category], $fonts);
            }
        }
    }

        /**
     * Đăng ký fonts với WordPress
     */
    protected function registerFontsWithWordPress()
    {
        // Đăng ký fonts với Gutenberg
        add_filter('jankx/gutenberg/fonts', [$this, 'getGutenbergFonts']);

        // Đăng ký fonts với theme customizer
        add_filter('jankx/customizer/fonts', [$this, 'getCustomizerFonts']);

        // Đăng ký fonts với Gutenberg editor thông qua filter
        add_filter('editor.BlockEditorSettings', [$this, 'injectFontsIntoEditorSettings']);
    }

    /**
     * Đăng ký font mới
     */
    public function registerFont($fontData)
    {
        $fontData = $this->validateFontData($fontData);

        if (!$fontData) {
            return false;
        }

        $category = $fontData['category'] ?? 'custom';
        $fontName = $fontData['name'];

        if (!isset($this->fonts[$category])) {
            $this->fonts[$category] = [];
        }

        $this->fonts[$category][$fontName] = $fontData;

        // Lưu vào database
        $this->saveFontsToDatabase();

        // Đăng ký với font manager
        $this->fontManager->registerFont($fontData);

        return true;
    }

    /**
     * Xóa font
     */
    public function deleteFont($fontName, $category = 'custom')
    {
        if (isset($this->fonts[$category][$fontName])) {
            unset($this->fonts[$category][$fontName]);

            // Lưu vào database
            $this->saveFontsToDatabase();

            // Xóa khỏi font manager
            $this->fontManager->unregisterFont($fontName);

            return true;
        }

        return false;
    }

    /**
     * Cập nhật font
     */
    public function updateFont($fontName, $fontData, $category = 'custom')
    {
        if (isset($this->fonts[$category][$fontName])) {
            $fontData = $this->validateFontData($fontData);

            if (!$fontData) {
                return false;
            }

            $this->fonts[$category][$fontName] = $fontData;

            // Lưu vào database
            $this->saveFontsToDatabase();

            // Cập nhật trong font manager
            $this->fontManager->updateFont($fontData);

            return true;
        }

        return false;
    }

    /**
     * Lấy tất cả fonts
     */
    public function getAllFonts()
    {
        return $this->fonts;
    }

    /**
     * Lấy fonts theo category
     */
    public function getFontsByCategory($category)
    {
        return $this->fonts[$category] ?? [];
    }

    /**
     * Lấy font categories
     */
    public function getFontCategories()
    {
        return $this->fontCategories;
    }

        /**
     * Inject fonts vào theme.json để Gutenberg có thể sử dụng
     */
    public function injectFontsIntoThemeJson($themeJson)
    {
        // Lấy tất cả fonts đã đăng ký
        $fonts = $this->getAllFonts();

        if (empty($fonts)) {
            return $themeJson;
        }

        // Chuyển đổi fonts thành format theme.json
        $themeJsonFonts = [];

        // Duyệt qua từng category
        foreach ($fonts as $category => $categoryFonts) {
            foreach ($categoryFonts as $fontName => $fontData) {
                $fontFamily = $fontData['family'] ?? $fontName;

                if (!empty($fontFamily)) {
                    $themeJsonFonts[] = [
                        'fontFamily' => $fontFamily,
                        'name' => $fontName,
                        'slug' => sanitize_title($fontName),
                    ];
                }
            }
        }

        // Inject vào theme.json
        if (!empty($themeJsonFonts)) {
            if (!isset($themeJson['settings']['typography']['fontFamilies'])) {
                $themeJson['settings']['typography']['fontFamilies'] = [];
            }

            // Merge với fonts hiện có
            $themeJson['settings']['typography']['fontFamilies'] = array_merge(
                $themeJson['settings']['typography']['fontFamilies'],
                $themeJsonFonts
            );
        }

        return $themeJson;
    }

    /**
     * Inject fonts vào Gutenberg editor settings
     */
    public function injectFontsIntoEditorSettings($settings)
    {
        // Lấy tất cả fonts đã đăng ký
        $fonts = $this->getAllFonts();

        if (empty($fonts)) {
            return $settings;
        }

        // Chuyển đổi fonts thành format Gutenberg editor
        $editorFonts = [];

        // Duyệt qua từng category
        foreach ($fonts as $category => $categoryFonts) {
            foreach ($categoryFonts as $fontName => $fontData) {
                $fontFamily = $fontData['family'] ?? $fontName;

                if (!empty($fontFamily)) {
                    $editorFonts[] = [
                        'fontFamily' => $fontFamily,
                        'name' => $fontName,
                        'slug' => sanitize_title($fontName),
                    ];
                }
            }
        }

        // Inject vào editor settings
        if (!empty($editorFonts)) {
            if (!isset($settings['fontFamilies'])) {
                $settings['fontFamilies'] = [];
            }

            // Merge với fonts hiện có
            $settings['fontFamilies'] = array_merge(
                $settings['fontFamilies'],
                $editorFonts
            );
        }

        return $settings;
    }

    /**
     * Lấy fonts cho Gutenberg
     */
    public function getGutenbergFonts($fonts = [])
    {
        $gutenbergFonts = [];

        foreach ($this->fonts as $category => $categoryFonts) {
            foreach ($categoryFonts as $fontName => $fontData) {
                $gutenbergFonts[] = [
                    'name' => $fontName,
                    'family' => $fontData['family'] ?? $fontName,
                    'category' => $category,
                    'variants' => $fontData['variants'] ?? ['400'],
                    'subsets' => $fontData['subsets'] ?? ['latin'],
                ];
            }
        }

        return array_merge($fonts, $gutenbergFonts);
    }

    /**
     * Lấy fonts cho Customizer
     */
    public function getCustomizerFonts($fonts = [])
    {
        $customizerFonts = [];

        foreach ($this->fonts as $category => $categoryFonts) {
            foreach ($categoryFonts as $fontName => $fontData) {
                $customizerFonts[$fontName] = $fontData['family'] ?? $fontName;
            }
        }

        return array_merge($fonts, $customizerFonts);
    }

    /**
     * Validate font data
     */
    protected function validateFontData($fontData)
    {
        $required = ['name', 'family'];

        foreach ($required as $field) {
            if (empty($fontData[$field])) {
                return false;
            }
        }

        // Set defaults
        $fontData['category'] = $fontData['category'] ?? 'custom';
        $fontData['variants'] = $fontData['variants'] ?? ['400'];
        $fontData['subsets'] = $fontData['subsets'] ?? ['latin'];
        $fontData['status'] = $fontData['status'] ?? 'active';
        $fontData['created_at'] = $fontData['created_at'] ?? current_time('mysql');

        return $fontData;
    }

    /**
     * Lưu fonts vào database
     */
    protected function saveFontsToDatabase()
    {
        update_option('jankx_fonts', $this->fonts);
    }

    /**
     * Enqueue fonts cho Gutenberg
     * Fonts sẽ được inject thông qua filter theme.json
     */
    public function enqueueGutenbergFonts()
    {
        // Không cần enqueue JavaScript nữa
        // Fonts sẽ được inject thông qua filter theme.json
        // Filter này đã được đăng ký trong registerFontsWithWordPress()
    }

    /**
     * Enqueue fonts cho frontend
     */
    public function enqueueFrontendFonts()
    {
        $fonts = $this->getAllFonts();

        foreach ($fonts as $category => $categoryFonts) {
            foreach ($categoryFonts as $fontName => $fontData) {
                if (isset($fontData['status']) && $fontData['status'] === 'active') {
                    $this->enqueueFont($fontData);
                }
            }
        }
    }

    /**
     * Enqueue fonts cho admin
     */
    public function enqueueAdminFonts()
    {
        $fonts = $this->getAllFonts();

        foreach ($fonts as $category => $categoryFonts) {
            foreach ($categoryFonts as $fontName => $fontData) {
                if (isset($fontData['status']) && $fontData['status'] === 'active') {
                    $this->enqueueFont($fontData);
                }
            }
        }
    }

    /**
     * Enqueue font cụ thể
     */
    protected function enqueueFont($fontData)
    {
        $category = $fontData['category'];

        switch ($category) {
            case 'google':
                $this->googleFontsProvider->enqueueFont($fontData);
                break;
            case 'adobe':
                $this->adobeFontsProvider->enqueueFont($fontData);
                break;
            case 'custom':
                $this->customFontsProvider->enqueueFont($fontData);
                break;
        }
    }

    /**
     * Đăng ký REST API endpoints
     */
    public function registerRestEndpoints()
    {
        register_rest_route('jankx/v1', '/fonts', [
            [
                'methods' => 'GET',
                'callback' => [$this, 'getFontsRest'],
                'permission_callback' => '__return_true',
            ],
            [
                'methods' => 'POST',
                'callback' => [$this, 'createFontRest'],
                'permission_callback' => [$this, 'checkFontsPermission'],
            ],
        ]);

        register_rest_route('jankx/v1', '/fonts/(?P<id>[a-zA-Z0-9-]+)', [
            [
                'methods' => 'GET',
                'callback' => [$this, 'getFontRest'],
                'permission_callback' => '__return_true',
            ],
            [
                'methods' => 'PUT',
                'callback' => [$this, 'updateFontRest'],
                'permission_callback' => [$this, 'checkFontsPermission'],
            ],
            [
                'methods' => 'DELETE',
                'callback' => [$this, 'deleteFontRest'],
                'permission_callback' => [$this, 'checkFontsPermission'],
            ],
        ]);
    }

    /**
     * Kiểm tra quyền truy cập fonts
     */
    public function checkFontsPermission()
    {
        return current_user_can('manage_options');
    }

    /**
     * REST API: Lấy tất cả fonts
     */
    public function getFontsRest($request)
    {
        return rest_ensure_response([
            'success' => true,
            'data' => $this->getAllFonts(),
        ]);
    }

    /**
     * REST API: Lấy font cụ thể
     */
    public function getFontRest($request)
    {
        $fontId = $request->get_param('id');

        // Tìm font trong tất cả categories
        foreach ($this->fonts as $category => $categoryFonts) {
            if (isset($categoryFonts[$fontId])) {
                return rest_ensure_response([
                    'success' => true,
                    'data' => $categoryFonts[$fontId],
                ]);
            }
        }

        return new \WP_Error('font_not_found', 'Font not found', ['status' => 404]);
    }

    /**
     * REST API: Tạo font mới
     */
    public function createFontRest($request)
    {
        $fontData = $request->get_json_params();

        if ($this->registerFont($fontData)) {
            return rest_ensure_response([
                'success' => true,
                'message' => 'Font registered successfully',
            ]);
        }

        return new \WP_Error('font_creation_failed', 'Failed to create font', ['status' => 400]);
    }

    /**
     * REST API: Cập nhật font
     */
    public function updateFontRest($request)
    {
        $fontId = $request->get_param('id');
        $fontData = $request->get_json_params();

        // Tìm category của font
        foreach ($this->fonts as $category => $categoryFonts) {
            if (isset($categoryFonts[$fontId])) {
                if ($this->updateFont($fontId, $fontData, $category)) {
                    return rest_ensure_response([
                        'success' => true,
                        'message' => 'Font updated successfully',
                    ]);
                }
                break;
            }
        }

        return new \WP_Error('font_update_failed', 'Failed to update font', ['status' => 400]);
    }

    /**
     * REST API: Xóa font
     */
    public function deleteFontRest($request)
    {
        $fontId = $request->get_param('id');

        // Tìm category của font
        foreach ($this->fonts as $category => $categoryFonts) {
            if (isset($categoryFonts[$fontId])) {
                if ($this->deleteFont($fontId, $category)) {
                    return rest_ensure_response([
                        'success' => true,
                        'message' => 'Font deleted successfully',
                    ]);
                }
                break;
            }
        }

        return new \WP_Error('font_deletion_failed', 'Failed to delete font', ['status' => 400]);
    }

    /**
     * Thêm admin menu
     */
    public function addAdminMenu()
    {
        add_submenu_page(
            'jankx-settings',
            'Fonts Management',
            'Fonts',
            'manage_options',
            'jankx-fonts',
            [$this, 'renderAdminPage']
        );
    }

    /**
     * Render admin page
     */
    public function renderAdminPage()
    {
        include get_template_directory() . '/templates/admin/fonts.php';
    }

    /**
     * AJAX: Đăng ký font
     */
    public function handleAjaxRegisterFont()
    {
        check_ajax_referer('jankx_fonts_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $fontData = $_POST['font_data'] ?? [];

        if ($this->registerFont($fontData)) {
            wp_send_json_success('Font registered successfully');
        } else {
            wp_send_json_error('Failed to register font');
        }
    }

    /**
     * AJAX: Xóa font
     */
    public function handleAjaxDeleteFont()
    {
        check_ajax_referer('jankx_fonts_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $fontName = $_POST['font_name'] ?? '';
        $category = $_POST['category'] ?? 'custom';

        if ($this->deleteFont($fontName, $category)) {
            wp_send_json_success('Font deleted successfully');
        } else {
            wp_send_json_error('Failed to delete font');
        }
    }

    /**
     * AJAX: Cập nhật font
     */
    public function handleAjaxUpdateFont()
    {
        check_ajax_referer('jankx_fonts_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $fontName = $_POST['font_name'] ?? '';
        $fontData = $_POST['font_data'] ?? [];
        $category = $_POST['category'] ?? 'custom';

        if ($this->updateFont($fontName, $fontData, $category)) {
            wp_send_json_success('Font updated successfully');
        } else {
            wp_send_json_error('Failed to update font');
        }
    }

    /**
     * Facade method: Đăng ký font
     */
    public static function register($fontData)
    {
        $instance = \Jankx\Foundation\Application::getInstance()->make(FontsService::class);
        return $instance->registerFont($fontData);
    }

    /**
     * Facade method: Lấy tất cả fonts
     */
    public static function all()
    {
        $instance = \Jankx\Foundation\Application::getInstance()->make(FontsService::class);
        return $instance->getAllFonts();
    }

    /**
     * Facade method: Lấy fonts theo category
     */
    public static function category($category)
    {
        $instance = \Jankx\Foundation\Application::getInstance()->make(FontsService::class);
        return $instance->getFontsByCategory($category);
    }
}
