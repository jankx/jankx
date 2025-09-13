<?php

namespace Jankx\Services;

use Jankx\Services\Fonts\GoogleFontsProvider;
use Jankx\Services\Fonts\AdobeFontsProvider;
use Jankx\Services\Fonts\CustomFontsProvider;
use Jankx\Services\Fonts\FontsRepository;
use Jankx\Services\Fonts\FontEntity;
use Jankx\Helper\HtmlHelper;

/**
 * Service để quản lý fonts cho Jankx theme
 * Hỗ trợ Google Fonts, Adobe Fonts và Custom Fonts
 */
class FontsService
{
    protected $googleFontsProvider;
    protected $adobeFontsProvider;
    protected $customFontsProvider;
    protected $fontsRepository;
    protected $fontStyles = [];

    protected $fontCategories = [];

    public function __construct()
    {
        $this->googleFontsProvider = new GoogleFontsProvider();
        $this->adobeFontsProvider = new AdobeFontsProvider();
        $this->customFontsProvider = new CustomFontsProvider();
        $this->fontsRepository = new FontsRepository();

        $this->loadFontCategories();
    }

    /**
     * Khởi tạo service
     */
    public function init()
    {

        // Repository sẽ tự động load system fonts khi cần
        $this->fontsRepository->all(); // Trigger initialization

        // Đăng ký fonts với WordPress
        $this->registerFontsWithWordPress();
    }

    /**
     * Load font categories
     */
    protected function loadFontCategories()
    {
        $this->fontCategories = [
            'system' => 'System Fonts',
            'google' => 'Google Fonts',
            'adobe' => 'Adobe Fonts',
            'custom' => 'Custom Fonts',
        ];
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

        try {
            $font = new FontEntity($fontData);

            $savedFont = $this->fontsRepository->save($font);

            // Tạo CSS cho font
            $this->generateFontCSS($savedFont);

            return $savedFont;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Xóa font
     */
    public function deleteFont($fontId)
    {
        try {
            $font = $this->fontsRepository->find($fontId);
            if (!$font) {
                return false;
            }

            $result = $this->fontsRepository->delete($fontId);

            if ($result) {
                // Xóa CSS của font
                $this->removeFontCSS($font->getName());
            }

            return $result;
        } catch (\Exception $e) {
            error_log("Failed to delete font: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Cập nhật font
     */
    public function updateFont($fontId, $fontData)
    {
        try {
            $font = new FontEntity($fontData);
            $updatedFont = $this->fontsRepository->update($fontId, $font);

            // Cập nhật CSS cho font
            $this->generateFontCSS($updatedFont);

            return $updatedFont;
        } catch (\Exception $e) {
            error_log("Failed to update font: " . $e->getMessage());
                return false;
        }
    }

    /**
     * Lấy tất cả fonts
     */
    public function getAllFonts()
    {
        return $this->fontsRepository->all();
    }

    /**
     * Lấy fonts theo category
     */
    public function getFontsByCategory($category)
    {
        return $this->fontsRepository->getByCategory($category);
    }

    /**
     * Lấy font theo ID
     */
    public function getFont($fontId)
    {
        return $this->fontsRepository->find($fontId);
    }

    /**
     * Tìm kiếm fonts
     */
    public function searchFonts($query, $category = null)
    {
        return $this->fontsRepository->search($query, $category);
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
        // Lấy fonts cho theme.json từ repository
        $themeJsonFonts = $this->fontsRepository->getForThemeJson();

        if (empty($themeJsonFonts)) {
            return $themeJson;
        }

        // Inject vào theme.json
            if (!isset($themeJson['settings']['typography']['fontFamilies'])) {
                $themeJson['settings']['typography']['fontFamilies'] = [];
            }

            // Merge với fonts hiện có
            $themeJson['settings']['typography']['fontFamilies'] = array_merge(
                $themeJson['settings']['typography']['fontFamilies'],
                $themeJsonFonts
            );

        return $themeJson;
    }

    /**
     * Inject fonts vào Gutenberg editor settings
     */
    public function injectFontsIntoEditorSettings($settings)
    {
        // Lấy fonts cho Gutenberg editor từ repository
        $editorFonts = $this->fontsRepository->getForGutenberg();

        if (empty($editorFonts)) {
            return $settings;
        }

        // Inject vào editor settings
            if (!isset($settings['fontFamilies'])) {
                $settings['fontFamilies'] = [];
            }

            // Merge với fonts hiện có
            $settings['fontFamilies'] = array_merge(
                $settings['fontFamilies'],
                $editorFonts
            );

        return $settings;
    }

    /**
     * Lấy fonts cho Gutenberg
     */
    public function getGutenbergFonts($fonts = [])
    {
        $gutenbergFonts = $this->fontsRepository->getForGutenberg();
        return array_merge($fonts, $gutenbergFonts);
    }

    /**
     * Lấy fonts cho Customizer
     */
    public function getCustomizerFonts($fonts = [])
    {
        $customizerFonts = $this->fontsRepository->getForCustomizer();
        return array_merge($fonts, $customizerFonts);
    }

    /**
     * Lấy repository statistics
     */
    public function getStats()
    {
        return $this->fontsRepository->getStats();
    }

    /**
     * Import fonts
     */
    public function importFonts($fontsData)
    {
        return $this->fontsRepository->import($fontsData);
    }

    /**
     * Export fonts
     */
    public function exportFonts($category = null)
    {
        return $this->fontsRepository->export($category);
    }

    /**
     * Tạo CSS cho font
     */
    protected function generateFontCSS(FontEntity $font)
    {
        $fontName = $font->getName();
        $fontFamily = $font->getFamily();
        $category = $font->getCategory();


        $css = '';

        switch ($category) {
            case 'google':
                $css = $this->generateGoogleFontCSS($font);
                break;
            case 'adobe':
                $css = $this->generateAdobeFontCSS($font);
                break;
            case 'custom':
                $css = $this->generateCustomFontCSS($font);
                break;
            case 'system':
                // System fonts không cần CSS
                $css = '';
                break;
        }

        if ($css) {
            $this->fontStyles[$fontName] = $css;
            $this->injectFontCSS($fontName, $css);
        }

        return $css;
    }

    /**
     * Tạo CSS cho Google Fonts
     */
    protected function generateGoogleFontCSS(FontEntity $font)
    {
        // Google Fonts sử dụng link tag, không cần CSS
        return '';
    }

    /**
     * Tạo CSS cho Adobe Fonts
     */
    protected function generateAdobeFontCSS(FontEntity $font)
    {
        // Adobe Fonts sử dụng link tag, không cần CSS
        return '';
    }

    /**
     * Tạo CSS cho Custom Fonts
     */
    protected function generateCustomFontCSS(FontEntity $font)
    {
        $fontName = $font->getName();
        $fontFamily = $font->getFamily();


        // Nếu font sử dụng CSS file, không tạo CSS mà sẽ enqueue CSS file
        if ($font->usesCssFile()) {
            $cssFile = $font->getCssFile();

            // Chỉ tạo CSS class, không tạo @font-face
            $cssClassName = HtmlHelper::sanitizeFontClassName($fontName);
            $css = ".{$cssClassName} {\n";
            $css .= "    font-family: '{$fontFamily}', sans-serif;\n";
            $css .= "}\n";

            return $css;
        }

        // Fallback: tạo CSS từ font files
        $metadata = $font->getMetadata();
        $fontFiles = $metadata['files'] ?? [];


        if (empty($fontFiles)) {
            return '';
        }

        $css = "@font-face {\n";
        $css .= "    font-family: '{$fontFamily}';\n";
        $css .= "    font-display: swap;\n";

        // Xử lý các font files
        foreach ($fontFiles as $format => $file) {
            $format = strtoupper($format);
            $css .= "    src: url('{$file}') format('{$format}');\n";
        }

        $css .= "}\n\n";

        // Thêm CSS class cho font
        $cssClassName = HtmlHelper::sanitizeFontClassName($fontName);
        $css .= ".{$cssClassName} {\n";
        $css .= "    font-family: '{$fontFamily}', sans-serif;\n";
        $css .= "}\n";

        return $css;
    }

    /**
     * Xóa CSS của font
     */
    protected function removeFontCSS($fontName)
    {
        if (isset($this->fontStyles[$fontName])) {
            unset($this->fontStyles[$fontName]);
        }
    }

    /**
     * Inject CSS vào WordPress
     */
    protected function injectFontCSS($fontName, $css)
    {

        // Hook để inject CSS
        add_action('wp_head', function () use ($css, $fontName) {
            $sanitizedId = HtmlHelper::sanitizeFontClassName($fontName);
            echo "<style id=\"jankx-font-{$sanitizedId}\">\n{$css}\n</style>\n";
        });

        add_action('admin_head', function () use ($css, $fontName) {
            $sanitizedId = HtmlHelper::sanitizeFontClassName($fontName);
            echo "<style id=\"jankx-font-{$sanitizedId}\">\n{$css}\n</style>\n";
        });
    }

    /**
     * Lấy CSS của tất cả fonts
     */
    public function getAllFontsCSS()
    {
        return implode("\n", $this->fontStyles);
    }

    /**
     * Lấy CSS của font cụ thể
     */
    public function getFontCSS($fontName)
    {
        return $this->fontStyles[$fontName] ?? '';
    }

    /**
     * Tạo font preview HTML
     */
    public function generateFontPreview($fontName, $text = 'The quick brown fox jumps over the lazy dog')
    {
        $font = $this->fontsRepository->findByName($fontName);
        if (!$font) {
            return '';
        }

        $fontFamily = $font->getFamily();

        $html = "<div class='font-preview' style='font-family: \"{$fontFamily}\", sans-serif;'>";
        $html .= "<h3>{$fontName}</h3>";
        $html .= "<p class='preview-text'>{$text}</p>";
        $html .= "<p class='preview-sample'>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>";
        $html .= "abcdefghijklmnopqrstuvwxyz<br>";
        $html .= "0123456789</p>";
        $html .= "</div>";

        return $html;
    }

    /**
     * Enqueue fonts cho Gutenberg
     * Fonts sẽ được inject thông qua filter theme.json
     */

    /**
     * Enqueue fonts cho frontend
     */
    public function enqueueFrontendFonts()
    {

        $activeFonts = $this->fontsRepository->getActive();

        foreach ($activeFonts as $font) {
            $this->enqueueFont($font->toArray());
        }

    }

    /**
     * Enqueue fonts cho admin
     */
    public function enqueueAdminFonts()
    {
        $activeFonts = $this->fontsRepository->getActive();

        foreach ($activeFonts as $font) {
            $this->enqueueFont($font->toArray());
        }
    }

    /**
     * Enqueue fonts cho Gutenberg editor
     */
    public function enqueueGutenbergFonts()
    {
        $activeFonts = $this->fontsRepository->getActive();

        foreach ($activeFonts as $font) {
            $this->enqueueFontForGutenberg($font->toArray());
        }
    }

    /**
     * Thêm fonts vào editor style để load trong iframe
     */
    protected function addFontsToEditorStyle()
    {
        $activeFonts = $this->fontsRepository->getActive();
        $css = '';

        foreach ($activeFonts as $font) {
            $fontCss = $this->generateFontCSS($font);
            if ($fontCss) {
                $css .= $fontCss . "\n";
            }
        }

        if (!empty($css)) {
            // Inject CSS trực tiếp vào editor thông qua filter
            add_filter('editor.BlockEditorSettings', function($settings) use ($css) {
                if (!isset($settings['styles'])) {
                    $settings['styles'] = [];
                }

                // Thêm CSS vào editor styles
                $settings['styles'][] = [
                    'css' => $css
                ];

                return $settings;
            });
        }
    }

    /**
     * Enqueue font cho Gutenberg editor
     */
    protected function enqueueFontForGutenberg($fontData)
    {
        $fontName = $fontData['name'];
        $category = $fontData['category'];

        switch ($category) {
            case 'google':
                $this->enqueueGoogleFontForGutenberg($fontData);
                break;
            case 'adobe':
                $this->enqueueAdobeFontForGutenberg($fontData);
                break;
            case 'custom':
                $this->enqueueCustomFontForGutenberg($fontData);
                break;
            case 'system':
                // System fonts không cần enqueue
                break;
        }
    }

    /**
     * Enqueue Google Font cho Gutenberg editor
     */
    protected function enqueueGoogleFontForGutenberg($fontData)
    {
        $fontName = $fontData['name'];
        $variants = $fontData['variants'] ?? ['400'];
        $subsets = $fontData['subsets'] ?? ['latin'];

        $url = $this->googleFontsProvider->buildGoogleFontsUrl($fontName, $variants, $subsets);
        if ($url) {
            $sanitizedId = HtmlHelper::sanitizeFontClassName($fontName);
            wp_enqueue_style(
                "google-font-{$sanitizedId}",
                $url,
                [],
                null
            );
        }
    }

    /**
     * Enqueue Adobe Font cho Gutenberg editor
     */
    protected function enqueueAdobeFontForGutenberg($fontData)
    {
        $fontName = $fontData['name'];
        $metadata = $fontData['metadata'] ?? [];
        $projectId = $metadata['project_id'] ?? '';

        if ($projectId) {
            $url = $this->adobeFontsProvider->buildAdobeFontsUrl($projectId);
            if ($url) {
                $sanitizedId = HtmlHelper::sanitizeFontClassName($fontName);
                wp_enqueue_style(
                    "adobe-font-{$sanitizedId}",
                    $url,
                    [],
                    null
                );
            }
        }
    }

    /**
     * Enqueue Custom Font cho Gutenberg editor
     */
    protected function enqueueCustomFontForGutenberg($fontData)
    {
        $fontName = $fontData['name'];
        $metadata = $fontData['metadata'] ?? [];

        if (isset($metadata['css_file']) && !empty($metadata['css_file'])) {
            $cssFile = $metadata['css_file'];
            $cssUrl = $this->customFontsProvider->getCssFileUrl($cssFile);
            if ($cssUrl) {
                $sanitizedId = HtmlHelper::sanitizeFontClassName($fontName);
                wp_enqueue_style(
                    "custom-font-{$sanitizedId}",
                    $cssUrl,
                    [],
                    null
                );
            }
        }
    }

    /**
     * Enqueue font cụ thể
     */
    protected function enqueueFont($fontData)
    {
        $category = $fontData['category'];
        $fontName = $fontData['name'];


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
            case 'system':
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
     * Admin menu được quản lý bởi JankxAdminPagesServiceProvider
     * Method này đã được comment out để tránh duplicate menu
     */
    /*
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

    public function renderAdminPage()
    {
        include get_template_directory() . '/templates/admin/fonts.php';
    }
    */

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
