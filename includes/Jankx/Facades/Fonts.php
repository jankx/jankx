<?php

namespace Jankx\Facades;

use Jankx\Foundation\Application;

/**
 * Fonts Facade để dễ dàng sử dụng FontsService
 */
class Fonts
{
    /**
     * Đăng ký font mới
     */
    public static function register($fontData)
    {
        $app = Application::getInstance();
        $fontsService = $app->make(\Jankx\Services\FontsService::class);

        return $fontsService->registerFont($fontData);
    }

    /**
     * Lấy tất cả fonts
     */
    public static function all()
    {
        $app = Application::getInstance();
        $fontsService = $app->make(\Jankx\Services\FontsService::class);

        return $fontsService->getAllFonts();
    }

    /**
     * Lấy fonts theo category
     */
    public static function category($category)
    {
        $app = Application::getInstance();
        $fontsService = $app->make(\Jankx\Services\FontsService::class);

        return $fontsService->getFontsByCategory($category);
    }

    /**
     * Lấy fonts cho Gutenberg
     */
    public static function forGutenberg()
    {
        $app = Application::getInstance();
        $fontsService = $app->make(\Jankx\Services\FontsService::class);

        return $fontsService->getGutenbergFonts();
    }

    /**
     * Lấy fonts cho Customizer
     */
    public static function forCustomizer()
    {
        $app = Application::getInstance();
        $fontsService = $app->make(\Jankx\Services\FontsService::class);

        return $fontsService->getCustomizerFonts();
    }

    /**
     * Đăng ký Google Font
     */
    public static function google($fontName, $variants = ['400'], $subsets = ['latin'])
    {
        $fontData = [
            'name' => $fontName,
            'family' => $fontName,
            'category' => 'google',
            'variants' => $variants,
            'subsets' => $subsets,
            'status' => 'active',
        ];

        $result = self::register($fontData);

        // Log để debug
        if ($result) {
            error_log("Font {$fontName} registered successfully via Facade");
        } else {
            error_log("Failed to register font {$fontName} via Facade");
        }

        return $result;
    }

    /**
     * Đăng ký Adobe Font
     */
    public static function adobe($fontName, $projectId = null)
    {
        $fontData = [
            'name' => $fontName,
            'family' => $fontName,
            'category' => 'adobe',
            'project_id' => $projectId,
        ];

        return self::register($fontData);
    }

    /**
     * Đăng ký Custom Font
     */
    public static function custom($fontName, $fontFamily, $files)
    {
        $fontData = [
            'name' => $fontName,
            'family' => $fontFamily,
            'category' => 'custom',
            'files' => $files,
        ];

        return self::register($fontData);
    }

    /**
     * Xóa font
     */
    public static function delete($fontName, $category = 'custom')
    {
        $app = Application::getInstance();
        $fontsService = $app->make(\Jankx\Services\FontsService::class);

        return $fontsService->deleteFont($fontName, $category);
    }

    /**
     * Cập nhật font
     */
    public static function update($fontName, $fontData, $category = 'custom')
    {
        $app = Application::getInstance();
        $fontsService = $app->make(\Jankx\Services\FontsService::class);

        return $fontsService->updateFont($fontName, $fontData, $category);
    }

    /**
     * Kiểm tra font có được đăng ký không
     */
    public static function has($fontName)
    {
        $fonts = self::all();

        foreach ($fonts as $category => $categoryFonts) {
            if (isset($categoryFonts[$fontName])) {
                return true;
            }
        }

        return false;
    }

    /**
     * Lấy font theo tên
     */
    public static function get($fontName)
    {
        $fonts = self::all();

        foreach ($fonts as $category => $categoryFonts) {
            if (isset($categoryFonts[$fontName])) {
                return $categoryFonts[$fontName];
            }
        }

        return null;
    }

    /**
     * Lấy font family string
     */
    public static function family($fontName)
    {
        $font = self::get($fontName);

        if ($font && isset($font['family'])) {
            return $font['family'];
        }

        return $fontName;
    }

    /**
     * Tạo CSS cho font
     */
    public static function css($fontName)
    {
        $app = Application::getInstance();
        $fontManager = $app->make(\Jankx\Services\Fonts\FontManager::class);

        return $fontManager->getFontCSS($fontName);
    }

    /**
     * Tạo font preview HTML
     */
    public static function preview($fontName, $text = null)
    {
        $app = Application::getInstance();
        $fontManager = $app->make(\Jankx\Services\Fonts\FontManager::class);

        return $fontManager->generateFontPreview($fontName, $text);
    }

    /**
     * Lấy Google Fonts provider
     */
    public static function googleProvider()
    {
        $app = Application::getInstance();
        return $app->make(\Jankx\Services\Fonts\GoogleFontsProvider::class);
    }

    /**
     * Lấy Adobe Fonts provider
     */
    public static function adobeProvider()
    {
        $app = Application::getInstance();
        return $app->make(\Jankx\Services\Fonts\AdobeFontsProvider::class);
    }

    /**
     * Lấy Custom Fonts provider
     */
    public static function customProvider()
    {
        $app = Application::getInstance();
        return $app->make(\Jankx\Services\Fonts\CustomFontsProvider::class);
    }

    /**
     * Magic method để gọi các methods khác
     */
    public static function __callStatic($method, $arguments)
    {
        $app = Application::getInstance();
        $fontsService = $app->make(\Jankx\Services\FontsService::class);

        if (method_exists($fontsService, $method)) {
            return call_user_func_array([$fontsService, $method], $arguments);
        }

        throw new \BadMethodCallException("Method {$method} does not exist on Fonts facade.");
    }
}
