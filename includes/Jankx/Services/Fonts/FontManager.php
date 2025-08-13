<?php

namespace Jankx\Services\Fonts;

/**
 * Font Manager để quản lý việc đăng ký và quản lý fonts
 */
class FontManager
{
    protected $registeredFonts = [];
    protected $fontStyles = [];

    /**
     * Đăng ký font mới
     */
    public function registerFont($fontData)
    {
        $fontName = $fontData['name'];
        $this->registeredFonts[$fontName] = $fontData;

        // Tạo CSS cho font
        $this->generateFontCSS($fontData);

        return true;
    }

    /**
     * Hủy đăng ký font
     */
    public function unregisterFont($fontName)
    {
        if (isset($this->registeredFonts[$fontName])) {
            unset($this->registeredFonts[$fontName]);

            // Xóa CSS của font
            $this->removeFontCSS($fontName);

            return true;
        }

        return false;
    }

    /**
     * Cập nhật font
     */
    public function updateFont($fontData)
    {
        $fontName = $fontData['name'];

        if (isset($this->registeredFonts[$fontName])) {
            $this->registeredFonts[$fontName] = $fontData;

            // Cập nhật CSS cho font
            $this->generateFontCSS($fontData);

            return true;
        }

        return false;
    }

    /**
     * Lấy tất cả fonts đã đăng ký
     */
    public function getRegisteredFonts()
    {
        return $this->registeredFonts;
    }

    /**
     * Kiểm tra font có được đăng ký không
     */
    public function isFontRegistered($fontName)
    {
        return isset($this->registeredFonts[$fontName]);
    }

    /**
     * Tạo CSS cho font
     */
    protected function generateFontCSS($fontData)
    {
        $fontName = $fontData['name'];
        $fontFamily = $fontData['family'];
        $category = $fontData['category'];

        $css = '';

        switch ($category) {
            case 'google':
                $css = $this->generateGoogleFontCSS($fontData);
                break;
            case 'adobe':
                $css = $this->generateAdobeFontCSS($fontData);
                break;
            case 'custom':
                $css = $this->generateCustomFontCSS($fontData);
                break;
        }

        if ($css) {
            $this->fontStyles[$fontName] = $css;
            $this->injectFontCSS($fontName, $css);
        }
    }

    /**
     * Tạo CSS cho Google Fonts
     */
    protected function generateGoogleFontCSS($fontData)
    {
        $fontName = $fontData['name'];
        $variants = $fontData['variants'] ?? ['400'];
        $subsets = $fontData['subsets'] ?? ['latin'];

        // Google Fonts sử dụng link tag, không cần CSS
        return '';
    }

    /**
     * Tạo CSS cho Adobe Fonts
     */
    protected function generateAdobeFontCSS($fontData)
    {
        $fontName = $fontData['name'];
        $fontFamily = $fontData['family'];

        // Adobe Fonts sử dụng link tag, không cần CSS
        return '';
    }

    /**
     * Tạo CSS cho Custom Fonts
     */
    protected function generateCustomFontCSS($fontData)
    {
        $fontName = $fontData['name'];
        $fontFamily = $fontData['family'];
        $fontFiles = $fontData['files'] ?? [];

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
        $css .= ".font-{$fontName} {\n";
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

            // Xóa CSS khỏi WordPress
            $this->removeFontCSSFromWordPress($fontName);
        }
    }

    /**
     * Inject CSS vào WordPress
     */
    protected function injectFontCSS($fontName, $css)
    {
        // Lưu CSS vào option để sử dụng sau
        $existingCSS = get_option('jankx_fonts_css', '');
        $existingCSS .= "\n" . $css;
        update_option('jankx_fonts_css', $existingCSS);

        // Hook để inject CSS
        add_action('wp_head', function () use ($css) {
            echo "<style id='jankx-fonts-css'>\n{$css}\n</style>\n";
        });

        add_action('admin_head', function () use ($css) {
            echo "<style id='jankx-fonts-css'>\n{$css}\n</style>\n";
        });
    }

    /**
     * Xóa CSS khỏi WordPress
     */
    protected function removeFontCSSFromWordPress($fontName)
    {
        // Cập nhật CSS option
        $existingCSS = get_option('jankx_fonts_css', '');
        $existingCSS = preg_replace("/@font-face\s*{[^}]*font-family:\s*['\"]?{$fontName}['\"]?[^}]*}/s", '', $existingCSS);
        $existingCSS = preg_replace("/\.font-{$fontName}\s*{[^}]*}/s", '', $existingCSS);
        update_option('jankx_fonts_css', $existingCSS);
    }

    /**
     * Lấy CSS của tất cả fonts
     */
    public function getAllFontsCSS()
    {
        return get_option('jankx_fonts_css', '');
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
        if (!$this->isFontRegistered($fontName)) {
            return '';
        }

        $fontData = $this->registeredFonts[$fontName];
        $fontFamily = $fontData['family'];

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
     * Validate font data
     */
    public function validateFontData($fontData)
    {
        $required = ['name', 'family'];

        foreach ($required as $field) {
            if (empty($fontData[$field])) {
                return false;
            }
        }

        // Validate font files nếu là custom font
        if (isset($fontData['category']) && $fontData['category'] === 'custom') {
            if (empty($fontData['files']) || !is_array($fontData['files'])) {
                return false;
            }

            $validFormats = ['woff', 'woff2', 'ttf', 'otf', 'eot'];
            foreach ($fontData['files'] as $format => $file) {
                if (!in_array(strtolower($format), $validFormats)) {
                    return false;
                }

                if (!file_exists($file)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Lấy font variants
     */
    public function getFontVariants($fontName)
    {
        if ($this->isFontRegistered($fontName)) {
            return $this->registeredFonts[$fontName]['variants'] ?? ['400'];
        }

        return [];
    }

    /**
     * Lấy font subsets
     */
    public function getFontSubsets($fontName)
    {
        if ($this->isFontRegistered($fontName)) {
            return $this->registeredFonts[$fontName]['subsets'] ?? ['latin'];
        }

        return [];
    }
}
