<?php

namespace Jankx\Services;

use Jankx\Facades\Log;
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

            $savedFont = $this->fontsRepository->add($font);

            // Tạo CSS cho font
            $this->generateFontCSS($savedFont);

            return $savedFont;
        } catch (\Exception $e) {
            Log::error('Font registration error: ' . $e->getMessage());
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
            Log::error("Failed to delete font: " . $e->getMessage());
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
            $updatedFont = $this->fontsRepository->update($font);

            // Cập nhật CSS cho font
            $this->generateFontCSS($updatedFont);

            return $updatedFont;
        } catch (\Exception $e) {
            Log::error("Failed to update font: " . $e->getMessage());
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
        return $this->fontsRepository->search($query);
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
        $activeFonts = $this->fontsRepository->getActive();
        $themeJsonFonts = [];

        foreach ($activeFonts as $font) {
                    $themeJsonFonts[] = [
                'fontFamily' => $font->getFamily(),
                'name' => $font->getName(),
                'slug' => $font->getId(),
                    ];
        }

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
        $activeFonts = $this->fontsRepository->getActive();
        $editorFonts = [];

        foreach ($activeFonts as $font) {
                    $editorFonts[] = [
                'fontFamily' => $font->getFamily(),
                'name' => $font->getName(),
                'slug' => $font->getId(),
                    ];
        }

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
     * Enqueue fonts cho Gutenberg
     * Fonts sẽ được inject thông qua filter theme.json
     */


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
    public function enqueueFont($fontData)
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
}
