<?php

namespace Jankx\Services\Fonts;

/**
 * Provider để quản lý Custom Fonts (uploaded fonts)
 */
class CustomFontsProvider
{
    protected $uploadDir;
    protected $allowedFormats = ['woff', 'woff2', 'ttf', 'otf', 'eot'];

    public function __construct()
    {
        $this->uploadDir = wp_upload_dir();
    }

    /**
     * Enqueue Custom Font
     */
    public function enqueueFont($fontData)
    {
        $fontName = $fontData['name'];
        $fontFiles = $fontData['files'] ?? [];
        $metadata = $fontData['metadata'] ?? [];


        // Kiểm tra nếu font sử dụng CSS file
        if (isset($metadata['css_file']) && !empty($metadata['css_file'])) {
            $cssFile = $metadata['css_file'];

            // Enqueue CSS file thay vì tạo CSS
            $cssUrl = $this->getCssFileUrl($cssFile);
            if ($cssUrl) {
                $sanitizedId = \Jankx\Helper\HtmlHelper::sanitizeFontClassName($fontName);
                add_action('wp_head', function () use ($cssUrl, $sanitizedId) {
                    echo "<link rel=\"stylesheet\" id=\"custom-font-{$sanitizedId}-css\" href=\"{$cssUrl}\" media=\"all\" />\n";
                });
                add_action('admin_head', function () use ($cssUrl, $sanitizedId) {
                    echo "<link rel=\"stylesheet\" id=\"custom-font-{$sanitizedId}-css\" href=\"{$cssUrl}\" media=\"all\" />\n";
                });
                return true;
            } else {
                return false;
            }
        }

        // Fallback: xử lý font files như cũ
        if (empty($fontFiles)) {
            return false;
        }

        // Tạo CSS cho font
        $css = $this->generateFontCSS($fontData);

        if ($css) {
            // Inject CSS vào head
            $cssId = sanitize_title($fontName);
            add_action('wp_head', function () use ($css, $cssId) {
                echo "<style id=\"custom-font-{$cssId}\">\n{$css}\n</style>\n";
            });

            add_action('admin_head', function () use ($css, $cssId) {
                echo "<style id=\"custom-font-{$cssId}\">\n{$css}\n</style>\n";
            });

            return true;
        }

        return false;
    }

    /**
     * Lấy URL của CSS file
     */
    public function getCssFileUrl($cssFile)
    {
        if (empty($cssFile) || !file_exists($cssFile)) {
            return false;
        }

        // Nếu là absolute path, convert thành URL
        if (strpos($cssFile, ABSPATH) === 0) {
            return str_replace(ABSPATH, home_url('/'), $cssFile);
        }

        // Nếu là relative path, convert thành URL
        if (strpos($cssFile, '/') !== 0) {
            return home_url('/') . $cssFile;
        }

        // Nếu đã là URL, return as is
        if (filter_var($cssFile, FILTER_VALIDATE_URL)) {
            return $cssFile;
        }

        return false;
    }

    /**
     * Tạo CSS cho custom font
     */
    protected function generateFontCSS($fontData)
    {
        $fontName = $fontData['name'];
        $fontFamily = $fontData['family'];
        $fontFiles = $fontData['files'] ?? [];

        if (empty($fontFiles)) {
            return '';
        }

        // Clean font family name - remove extra quotes and commas
        $fontFamily = trim($fontFamily, '"\'');
        // Remove any trailing ", sans-serif" or similar fallbacks
        $fontFamily = preg_replace('/,\s*sans-serif.*$/', '', $fontFamily);
        $fontFamily = trim($fontFamily, '"\'');

        $css = "@font-face {\n";
        $css .= "    font-family: '{$fontFamily}';\n";
        $css .= "    font-display: swap;\n";

        // Xử lý các font files
        foreach ($fontFiles as $format => $file) {
            $format = strtoupper($format);
            $css .= "    src: url('{$file}') format('{$format}');\n";
        }

        $css .= "}\n\n";

        // Thêm CSS class cho font - sanitize font name for CSS class
        $cssClassName = sanitize_title($fontName);
        $css .= ".font-{$cssClassName} {\n";
        $css .= "    font-family: '{$fontFamily}', sans-serif;\n";
        $css .= "}\n";

        return $css;
    }

    /**
     * Upload font file
     */
    public function uploadFontFile($file, $fontName)
    {
        // Kiểm tra file upload
        if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
            return false;
        }

        // Kiểm tra file type
        $fileInfo = pathinfo($file['name']);
        $extension = strtolower($fileInfo['extension']);

        if (!in_array($extension, $this->allowedFormats)) {
            return false;
        }

        // Tạo thư mục fonts nếu chưa có
        $fontsDir = $this->uploadDir['basedir'] . '/fonts';
        if (!is_dir($fontsDir)) {
            wp_mkdir_p($fontsDir);
        }

        // Tạo thư mục cho font cụ thể
        $fontDir = $fontsDir . '/' . sanitize_file_name($fontName);
        if (!is_dir($fontDir)) {
            wp_mkdir_p($fontDir);
        }

        // Tạo tên file mới
        $newFileName = $extension . '.' . $extension;
        $newFilePath = $fontDir . '/' . $newFileName;

        // Upload file
        if (move_uploaded_file($file['tmp_name'], $newFilePath)) {
            // Trả về URL của file
            return $this->uploadDir['baseurl'] . '/fonts/' . sanitize_file_name($fontName) . '/' . $newFileName;
        }

        return false;
    }

    /**
     * Xóa font file
     */
    public function deleteFontFile($fontName, $format)
    {
        $fontsDir = $this->uploadDir['basedir'] . '/fonts';
        $fontDir = $fontsDir . '/' . sanitize_file_name($fontName);
        $filePath = $fontDir . '/' . $format . '.' . $format;

        if (file_exists($filePath)) {
            return unlink($filePath);
        }

        return false;
    }

    /**
     * Xóa toàn bộ font
     */
    public function deleteFont($fontName)
    {
        $fontsDir = $this->uploadDir['basedir'] . '/fonts';
        $fontDir = $fontsDir . '/' . sanitize_file_name($fontName);

        if (is_dir($fontDir)) {
            // Xóa tất cả files trong thư mục
            $files = glob($fontDir . '/*');
            foreach ($files as $file) {
                if (is_file($file)) {
                    unlink($file);
                }
            }

            // Xóa thư mục
            return rmdir($fontDir);
        }

        return false;
    }

    /**
     * Lấy danh sách fonts đã upload
     */
    public function getUploadedFonts()
    {
        $fontsDir = $this->uploadDir['basedir'] . '/fonts';

        if (!is_dir($fontsDir)) {
            return [];
        }

        $fonts = [];
        $fontDirs = glob($fontsDir . '/*', GLOB_ONLYDIR);

        foreach ($fontDirs as $fontDir) {
            $fontName = basename($fontDir);
            $fontFiles = glob($fontDir . '/*');

            $fonts[$fontName] = [
                'name' => $fontName,
                'files' => [],
                'upload_date' => filemtime($fontDir),
            ];

            foreach ($fontFiles as $file) {
                if (is_file($file)) {
                    $fileInfo = pathinfo($file);
                    $format = strtolower($fileInfo['extension']);

                    if (in_array($format, $this->allowedFormats)) {
                        $fonts[$fontName]['files'][$format] = $this->uploadDir['baseurl'] . '/fonts/' . $fontName . '/' . basename($file);
                    }
                }
            }
        }

        return $fonts;
    }

    /**
     * Validate custom font data
     */
    public function validateFontData($fontData)
    {
        $required = ['name', 'family', 'files'];

        foreach ($required as $field) {
            if (empty($fontData[$field])) {
                return false;
            }
        }

        // Kiểm tra files
        if (!is_array($fontData['files']) || empty($fontData['files'])) {
            return false;
        }

        // Kiểm tra từng file
        foreach ($fontData['files'] as $format => $file) {
            if (!in_array(strtolower($format), $this->allowedFormats)) {
                return false;
            }

            if (!file_exists($file)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Lấy thông tin font file
     */
    public function getFontFileInfo($filePath)
    {
        if (!file_exists($filePath)) {
            return null;
        }

        $fileInfo = pathinfo($filePath);
        $extension = strtolower($fileInfo['extension']);

        if (!in_array($extension, $this->allowedFormats)) {
            return null;
        }

        $fileSize = filesize($filePath);
        $uploadDate = filemtime($filePath);

        return [
            'name' => $fileInfo['basename'],
            'format' => $extension,
            'size' => $fileSize,
            'size_formatted' => size_format($fileSize),
            'upload_date' => $uploadDate,
            'upload_date_formatted' => date('Y-m-d H:i:s', $uploadDate),
            'url' => str_replace($this->uploadDir['basedir'], $this->uploadDir['baseurl'], $filePath),
        ];
    }

    /**
     * Kiểm tra font file có hợp lệ không
     */
    public function validateFontFile($filePath)
    {
        if (!file_exists($filePath)) {
            return false;
        }

        $fileInfo = pathinfo($filePath);
        $extension = strtolower($fileInfo['extension']);

        if (!in_array($extension, $this->allowedFormats)) {
            return false;
        }


        // Kiểm tra file size (giới hạn 10MB)
        $fileSize = filesize($filePath);
        if ($fileSize > 10 * 1024 * 1024) {
            return false;
        }

        // Kiểm tra file có đọc được không
        if (!is_readable($filePath)) {
            return false;
        }

        return true;
    }

    /**
     * Lấy danh sách formats được hỗ trợ
     */
    public function getAllowedFormats()
    {
        return $this->allowedFormats;
    }

    /**
     * Lấy thông tin về format
     */
    public function getFormatInfo($format)
    {
        $formatInfo = [
            'woff' => [
                'name' => 'Web Open Font Format',
                'description' => 'Modern web font format with good browser support',
                'browser_support' => 'IE9+, Chrome 6+, Firefox 3.6+, Safari 5.1+',
            ],
            'woff2' => [
                'name' => 'Web Open Font Format 2.0',
                'description' => 'Next generation web font format with better compression',
                'browser_support' => 'Chrome 36+, Firefox 39+, Safari 10+, Edge 14+',
            ],
            'ttf' => [
                'name' => 'TrueType Font',
                'description' => 'Traditional font format with wide compatibility',
                'browser_support' => 'IE9+, Chrome 4+, Firefox 3.5+, Safari 3.1+',
            ],
            'otf' => [
                'name' => 'OpenType Font',
                'description' => 'Advanced font format with extended features',
                'browser_support' => 'IE9+, Chrome 4+, Firefox 3.5+, Safari 3.1+',
            ],
            'eot' => [
                'name' => 'Embedded OpenType',
                'description' => 'Legacy format for older IE versions',
                'browser_support' => 'IE6+',
            ],
        ];

        return $formatInfo[$format] ?? null;
    }

    /**
     * Tạo font preview
     */
    public function generateFontPreview($fontData, $text = 'The quick brown fox jumps over the lazy dog')
    {
        $fontName = $fontData['name'];
        $fontFamily = $fontData['family'];

        $html = "<div class='custom-font-preview' style='font-family: \"{$fontFamily}\", sans-serif;'>";
        $html .= "<h3>{$fontName}</h3>";
        $html .= "<p class='preview-text'>{$text}</p>";
        $html .= "<p class='preview-sample'>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>";
        $html .= "abcdefghijklmnopqrstuvwxyz<br>";
        $html .= "0123456789</p>";
        $html .= "<div class='font-files'>";

        if (isset($fontData['files'])) {
            foreach ($fontData['files'] as $format => $file) {
                $formatInfo = $this->getFormatInfo($format);
                $html .= "<span class='format-{$format}' title='{$formatInfo['description']}'>{$format}</span>";
            }
        }

        $html .= "</div>";
        $html .= "</div>";

        return $html;
    }
}
