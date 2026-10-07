<?php

namespace Jankx\Services\Fonts;

/**
 * Provider để quản lý Google Fonts
 */
class GoogleFontsProvider
{
    protected $apiKey;
    protected $fonts = [];

    /**
     * Fonts chờ gộp thành một request css2 duy nhất.
     * Keyed by font name để tránh duplicate.
     *
     * @var array<string, array{name: string, variants: array, subsets: array}>
     */
    protected $pendingFonts = [];

    protected $combinedScheduled = false;

    protected $preconnectAdded = false;

    public function __construct()
    {
        $this->apiKey = get_option('jankx_google_fonts_api_key', '');
    }

    /**
     * Enqueue Google Font.
     *
     * Thay vì mỗi family một request css2 (3-4 request render-blocking),
     * các font được tích lũy và gộp thành MỘT request duy nhất.
     */
    public function enqueueFont($fontData)
    {
        $fontName = $fontData['name'];

        $this->pendingFonts[$fontName] = [
            'name' => $fontName,
            'variants' => $fontData['variants'] ?? ['400'],
            'subsets' => $fontData['subsets'] ?? ['latin'],
        ];

        $this->scheduleCombinedEnqueue();
    }

    /**
     * Đăng ký flush tích hợp vào hook enqueue hiện tại (hoặc chạy ngay nếu
     * enqueueFont được gọi ngoàiwp_enqueue_scripts/admin_enqueue_scripts).
     */
    protected function scheduleCombinedEnqueue()
    {
        if ($this->combinedScheduled) {
            return;
        }
        $this->combinedScheduled = true;

        add_action('wp_enqueue_scripts', [$this, 'enqueueCombinedFonts'], 99);
        add_action('admin_enqueue_scripts', [$this, 'enqueueCombinedFonts'], 99);

        if (!doing_action('wp_enqueue_scripts') && !doing_action('admin_enqueue_scripts')) {
            $this->enqueueCombinedFonts();
        }
    }

    /**
     * Enqueue một stylesheet Google Fonts duy nhất chứa tất cả families.
     */
    public function enqueueCombinedFonts()
    {
        if (empty($this->pendingFonts)) {
            return;
        }

        $url = $this->buildCombinedUrl();
        if (!$url) {
            return;
        }

        $handle = 'jankx-google-fonts';

        if (wp_style_is($handle, 'registered')) {
            // Có font mới được thêm sau lần flush đầu — cập nhật src.
            global $wp_styles;
            if ($wp_styles && isset($wp_styles->registered[$handle])) {
                $wp_styles->registered[$handle]->src = $url;
            }
            wp_enqueue_style($handle);

            return;
        }

        $this->addGoogleFontsPreconnect();

        wp_register_style($handle, $url, [], null);
        wp_enqueue_style($handle);
    }

    /**
     * Gộp toàn bộ pending fonts thành một URL css2.
     */
    protected function buildCombinedUrl()
    {
        $familyParams = [];
        foreach ($this->pendingFonts as $font) {
            $family = $this->buildFamilyParam($font['name'], $font['variants']);
            if ($family) {
                $familyParams[] = 'family=' . $family;
            }
        }

        if (empty($familyParams)) {
            return '';
        }

        $url = 'https://fonts.googleapis.com/css2?' . implode('&', $familyParams) . '&display=swap';

        if (!empty($this->apiKey)) {
            $url .= "&key={$this->apiKey}";
        }

        return $url;
    }

    /**
     * Thêm preconnect links cho Google Fonts qua wp_resource_hints.
     *
     * Đăng ký filter trong wp_enqueue_scripts (wp_head priority 1) nên vẫn
     * kịp chạy trước wp_resource_hints (wp_head priority 2).
     */
    protected function addGoogleFontsPreconnect()
    {
        if ($this->preconnectAdded) {
            return;
        }
        $this->preconnectAdded = true;

        add_filter('wp_resource_hints', [$this, 'resourceHints'], 10, 2);
    }

    /**
     * Preconnect tới fonts.googleapis.com (CSS) và fonts.gstatic.com (font files).
     */
    public function resourceHints($urls, $relationType)
    {
        if ($relationType !== 'preconnect' || is_admin()) {
            return $urls;
        }

        $urls[] = 'https://fonts.googleapis.com';
        $urls[] = [
            'href' => 'https://fonts.gstatic.com',
            'crossorigin' => 'anonymous',
        ];

        return $urls;
    }

    /**
     * Tạo Google Fonts URL (giữ nguyên API cho các caller cũ).
     */
    public function buildGoogleFontsUrl($fontName, $variants, $subsets)
    {
        $family = $this->buildFamilyParam($fontName, $variants);

        if (!$family) {
            return '';
        }

        $url = "https://fonts.googleapis.com/css2?family={$family}&display=swap";

        // Thêm API key nếu có
        if (!empty($this->apiKey)) {
            $url .= "&key={$this->apiKey}";
        }

        return $url;
    }

    /**
     * Tạo tham số family cho css2, ví dụ: "Inter:ital,wght@0,400;0,700"
     */
    public function buildFamilyParam($fontName, $variants)
    {
        // Chuyển đổi font name thành Google Fonts format
        $googleFontName = str_replace(' ', '+', $fontName);

        $variantsString = $this->buildVariantsString($variants);

        if (!$variantsString) {
            return '';
        }

        return "{$googleFontName}:{$variantsString}";
    }

    /**
     * Tạo variants string cho Google Fonts v2 (ital,wght@... hoặc wght@...)
     */
    protected function buildVariantsString($variants)
    {
        // Tách riêng regular và italic variants
        $regularWeights = [];
        $italicWeights = [];

        foreach ($variants as $variant) {
            $isItalic = false;
            $weight = $variant;

            if (str_ends_with($variant, 'i')) {
                $isItalic = true;
                $weight = substr($variant, 0, -1);
            } elseif (strpos($variant, 'italic') !== false) {
                $isItalic = true;
                $weight = str_replace('italic', '', $variant);
            }

            if ($isItalic) {
                $italicWeights[] = $weight;
            } else {
                $regularWeights[] = $weight;
            }
        }

        // Tạo string cho Google Fonts v2 format
        if (!empty($regularWeights) || !empty($italicWeights)) {
            $variantsString = '';

            // Thêm regular weights (ital=0) với danh sách cụ thể
            if (!empty($regularWeights)) {
                $regularList = [];
                foreach ($regularWeights as $weight) {
                    $regularList[] = "0,{$weight}";
                }
                $variantsString .= implode(';', $regularList);
            }

            // Thêm italic weights (ital=1) với danh sách cụ thể
            if (!empty($italicWeights)) {
                if ($variantsString) {
                    $variantsString .= ';';
                }
                $italicList = [];
                foreach ($italicWeights as $weight) {
                    $italicList[] = "1,{$weight}";
                }
                $variantsString .= implode(';', $italicList);
            }

            if ($variantsString) {
                $variantsString = "ital,wght@" . $variantsString;
            }

            return $variantsString;
        }

        // Nếu không có variants, sử dụng format đơn giản
        return $variants ? 'wght@' . implode(';', $variants) : '';
    }

    /**
     * Set Google Fonts API key
     */
    public function setApiKey($apiKey)
    {
        $this->apiKey = $apiKey;
        update_option('jankx_google_fonts_api_key', $apiKey);

        // Clear cache
        delete_transient('jankx_google_fonts_list');
    }

    /**
     * Get Google Fonts API key
     */
    public function getApiKey()
    {
        return $this->apiKey;
    }
}
