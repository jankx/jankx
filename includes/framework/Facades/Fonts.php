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

        $result = $fontsService->registerFont($fontData);

        return $result;
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
        } else {
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
     * Đăng ký Custom Font với CSS file
     */
    public static function custom($fontName, $fontFamily, $cssFile = null)
    {
        $fontData = [
            'name' => $fontName,
            'family' => $fontFamily,
            'category' => 'custom',
        ];

        // Nếu có CSS file, thêm vào metadata
        if ($cssFile) {
            $fontData['metadata'] = [
                'css_file' => $cssFile,
            ];
        }

        return self::register($fontData);
    }

    /**
     * Đăng ký Custom Font với CSS file từ webfont generator
     */
    public static function customFromCss($fontName, $cssFile)
    {

        $fontData = [
            'name' => $fontName,
            'family' => $fontName, // Sẽ được update từ CSS file
            'category' => 'custom',
            'metadata' => [
                'css_file' => $cssFile,
            ],
        ];

        $result = self::register($fontData);

        // Update font data từ CSS file
        if ($result instanceof \Jankx\Services\Fonts\FontEntity) {
            $result->updateFromCssFile();
        }

        return $result;
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

        return $fontsService->updateFont($fontName, $fontData);
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

}
