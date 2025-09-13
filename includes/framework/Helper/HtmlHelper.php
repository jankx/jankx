<?php

namespace Jankx\Helper;

/**
 * HTML Helper để xử lý các thao tác liên quan đến HTML/CSS sanitization
 */
class HtmlHelper
{
    /**
     * Sanitize font name để tạo CSS class name hợp lệ
     *
     * @param string $fontName Tên font gốc
     * @return string CSS class name đã được sanitize
     */
    public static function sanitizeFontClassName($fontName)
    {
        if (empty($fontName)) {
            return 'font-unknown';
        }

        // Loại bỏ các ký tự không hợp lệ cho CSS class
        $className = preg_replace('/[^a-zA-Z0-9\-_]/', '-', $fontName);

        // Loại bỏ multiple dashes
        $className = preg_replace('/-+/', '-', $className);

        // Loại bỏ dash ở đầu và cuối
        $className = trim($className, '-');

        // Đảm bảo không bắt đầu bằng số
        if (preg_match('/^[0-9]/', $className)) {
            $className = 'font-' . $className;
        }

        // Đảm bảo không rỗng
        if (empty($className)) {
            $className = 'font-' . sanitize_title($fontName);
        }

        return strtolower($className);
    }

    /**
     * Sanitize font family name để sử dụng trong CSS
     *
     * @param string $fontFamily Tên font family gốc
     * @return string Font family đã được sanitize
     */
    public static function sanitizeFontFamily($fontFamily)
    {
        if (empty($fontFamily)) {
            return 'sans-serif';
        }

        // Loại bỏ quotes thừa
        $fontFamily = trim($fontFamily, '"\'');

        // Loại bỏ fallback fonts nếu có
        $fontFamily = preg_replace('/,\s*(sans-serif|serif|monospace).*$/', '', $fontFamily);

        // Trim lại
        $fontFamily = trim($fontFamily, '"\'');

        // Nếu rỗng, return default
        if (empty($fontFamily)) {
            return 'sans-serif';
        }

        return $fontFamily;
    }

    /**
     * Tạo CSS class name cho font với prefix
     *
     * @param string $fontName Tên font
     * @param string $prefix Prefix cho class name (default: 'font')
     * @return string CSS class name
     */
    public static function createFontClassName($fontName, $prefix = 'font')
    {
        $sanitizedName = self::sanitizeFontClassName($fontName);

        // Nếu đã có prefix, không thêm nữa
        if (strpos($sanitizedName, $prefix . '-') === 0) {
            return $sanitizedName;
        }

        return $prefix . '-' . $sanitizedName;
    }

    /**
     * Validate font file format
     *
     * @param string $filePath Đường dẫn file
     * @return bool True nếu format hợp lệ
     */
    public static function isValidFontFormat($filePath)
    {
        $allowedFormats = ['woff', 'woff2', 'ttf', 'otf', 'eot'];
        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        return in_array($extension, $allowedFormats);
    }

    /**
     * Lấy format info cho font file
     *
     * @param string $format Font format
     * @return array|null Format info hoặc null nếu không hỗ trợ
     */
    public static function getFontFormatInfo($format)
    {
        $formatInfo = [
            'woff' => [
                'name' => 'Web Open Font Format',
                'description' => 'Modern web font format with good browser support',
                'browser_support' => 'IE9+, Chrome 6+, Firefox 3.6+, Safari 5.1+',
                'mime_type' => 'font/woff',
            ],
            'woff2' => [
                'name' => 'Web Open Font Format 2.0',
                'description' => 'Next generation web font format with better compression',
                'browser_support' => 'Chrome 36+, Firefox 39+, Safari 10+, Edge 14+',
                'mime_type' => 'font/woff2',
            ],
            'ttf' => [
                'name' => 'TrueType Font',
                'description' => 'Traditional font format with wide compatibility',
                'browser_support' => 'IE9+, Chrome 4+, Firefox 3.5+, Safari 3.1+',
                'mime_type' => 'font/ttf',
            ],
            'otf' => [
                'name' => 'OpenType Font',
                'description' => 'Advanced font format with extended features',
                'browser_support' => 'IE9+, Chrome 4+, Firefox 3.5+, Safari 3.1+',
                'mime_type' => 'font/otf',
            ],
            'eot' => [
                'name' => 'Embedded OpenType',
                'description' => 'Legacy format for older IE versions',
                'browser_support' => 'IE6+',
                'mime_type' => 'application/vnd.ms-fontobject',
            ],
        ];

        return $formatInfo[strtolower($format)] ?? null;
    }

    /**
     * Tạo @font-face CSS từ font files
     *
     * @param string $fontFamily Font family name
     * @param array $fontFiles Array of font files [format => file_path]
     * @param string $fontDisplay Font display value (default: 'swap')
     * @return string CSS @font-face rule
     */
    public static function generateFontFaceCSS($fontFamily, $fontFiles, $fontDisplay = 'swap')
    {
        if (empty($fontFamily) || empty($fontFiles)) {
            return '';
        }

        $fontFamily = self::sanitizeFontFamily($fontFamily);

        $css = "@font-face {\n";
        $css .= "    font-family: '{$fontFamily}';\n";
        $css .= "    font-display: {$fontDisplay};\n";

        // Xử lý các font files theo thứ tự ưu tiên
        $priorityOrder = ['woff2', 'woff', 'ttf', 'otf', 'eot'];
        $srcParts = [];

        foreach ($priorityOrder as $format) {
            if (isset($fontFiles[$format])) {
                $file = $fontFiles[$format];
                $formatUpper = strtoupper($format);
                $srcParts[] = "url('{$file}') format('{$formatUpper}')";
            }
        }

        if (!empty($srcParts)) {
            $css .= "    src: " . implode(', ', $srcParts) . ";\n";
        }

        $css .= "}\n";

        return $css;
    }

    /**
     * Tạo CSS class cho font
     *
     * @param string $fontName Font name
     * @param string $fontFamily Font family
     * @param string $prefix Class prefix (default: 'font')
     * @return string CSS class rule
     */
    public static function generateFontClassCSS($fontName, $fontFamily, $prefix = 'font')
    {
        $className = self::createFontClassName($fontName, $prefix);
        $fontFamily = self::sanitizeFontFamily($fontFamily);

        $css = ".{$className} {\n";
        $css .= "    font-family: '{$fontFamily}', sans-serif;\n";
        $css .= "}\n";

        return $css;
    }

    /**
     * Convert file path to URL
     *
     * @param string $filePath File path
     * @return string|false URL hoặc false nếu không convert được
     */
    public static function filePathToUrl($filePath)
    {
        if (empty($filePath)) {
            return false;
        }

        // Nếu đã là URL, return as is
        if (filter_var($filePath, FILTER_VALIDATE_URL)) {
            return $filePath;
        }

        // Nếu là absolute path, convert thành URL
        if (strpos($filePath, ABSPATH) === 0) {
            return str_replace(ABSPATH, home_url('/'), $filePath);
        }

        // Nếu là relative path, convert thành URL
        if (strpos($filePath, '/') !== 0) {
            return home_url('/') . $filePath;
        }

        return false;
    }
}
