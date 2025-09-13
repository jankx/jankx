<?php

namespace Jankx\Services\Fonts;

/**
 * Provider để quản lý Google Fonts
 */
class GoogleFontsProvider
{
    protected $apiKey;
    protected $fonts = [];

    public function __construct()
    {
        $this->apiKey = get_option('jankx_google_fonts_api_key', '');
    }

    /**
     * Enqueue Google Font
     */
    public function enqueueFont($fontData)
    {
        $fontName = $fontData['name'];
        $variants = $fontData['variants'] ?? ['400'];
        $subsets = $fontData['subsets'] ?? ['latin'];


        // Tạo Google Fonts URL
        $url = $this->buildGoogleFontsUrl($fontName, $variants, $subsets);

        if ($url) {
            // Thêm preconnect links cho Google Fonts
            $this->addGoogleFontsPreconnect();

            // Enqueue Google Fonts CSS
            $sanitizedId = \Jankx\Helper\HtmlHelper::sanitizeFontClassName($fontName);
            add_action('wp_head', function () use ($url, $sanitizedId) {
                echo "<link rel=\"stylesheet\" id=\"google-font-{$sanitizedId}-css\" href=\"{$url}\" media=\"all\" />\n";
            });
            add_action('admin_head', function () use ($url, $sanitizedId) {
                echo "<link rel=\"stylesheet\" id=\"google-font-{$sanitizedId}-css\" href=\"{$url}\" media=\"all\" />\n";
            });
        } else {
        }
    }

    /**
     * Thêm preconnect links cho Google Fonts
     */
    protected function addGoogleFontsPreconnect()
    {
        // Chỉ thêm preconnect một lần
        static $preconnectAdded = false;

        if ($preconnectAdded) {
            return;
        }

        // Thêm preconnect links vào head
        add_action('wp_head', function () {
            echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
            echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
        }, 1);

        // Thêm preconnect links vào admin head
        add_action('admin_head', function () {
            echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
            echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
        }, 1);

        $preconnectAdded = true;
    }

    /**
     * Tạo Google Fonts URL
     */
    public function buildGoogleFontsUrl($fontName, $variants, $subsets)
    {
        // Chuyển đổi font name thành Google Fonts format
        $googleFontName = str_replace(' ', '+', $fontName);

        // Tạo variants string cho Google Fonts v2
        $variantsString = '';

        // Tách riêng regular và italic variants
        $regularWeights = [];
        $italicWeights = [];

        foreach ($variants as $variant) {
            if (strpos($variant, 'italic') !== false) {
                $weight = str_replace('italic', '', $variant);
                $italicWeights[] = $weight;
            } else {
                $regularWeights[] = $variant;
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
        } else {
            // Nếu không có variants, sử dụng format đơn giản
            $variantsString = "wght@" . implode(';', $variants);
        }

        // Tạo URL cho Google Fonts v2
        $url = "https://fonts.googleapis.com/css2?family={$googleFontName}:{$variantsString}&display=swap";

        // Thêm API key nếu có
        if (!empty($this->apiKey)) {
            $url .= "&key={$this->apiKey}";
        }

        return $url;
    }

    /**
     * Lấy danh sách Google Fonts từ API
     */
    public function getFontsList()
    {
        if (empty($this->fonts)) {
            $this->loadFontsFromAPI();
        }

        return $this->fonts;
    }

    /**
     * Load fonts từ Google Fonts API
     */
    protected function loadFontsFromAPI()
    {
        $cacheKey = 'jankx_google_fonts_list';
        $cachedFonts = get_transient($cacheKey);

        if ($cachedFonts !== false) {
            $this->fonts = $cachedFonts;
            return;
        }

        $apiUrl = 'https://www.googleapis.com/webfonts/v1/webfonts';

        if (!empty($this->apiKey)) {
            $apiUrl .= "?key={$this->apiKey}";
        }

        $response = wp_remote_get($apiUrl);

        if (is_wp_error($response)) {
            $this->fonts = $this->getDefaultGoogleFonts();
            return;
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (isset($data['items']) && is_array($data['items'])) {
            $this->fonts = $data['items'];

            // Cache fonts trong 24 giờ
            set_transient($cacheKey, $this->fonts, DAY_IN_SECONDS);
        } else {
            $this->fonts = $this->getDefaultGoogleFonts();
        }
    }

    /**
     * Lấy danh sách Google Fonts mặc định
     */
    protected function getDefaultGoogleFonts()
    {
        return [
            [
                'family' => 'Roboto',
                'variants' => ['100', '300', '400', '500', '700', '900'],
                'subsets' => ['latin', 'latin-ext'],
                'category' => 'sans-serif',
            ],
            [
                'family' => 'Open Sans',
                'variants' => ['300', '400', '600', '700', '800'],
                'subsets' => ['latin', 'latin-ext'],
                'category' => 'sans-serif',
            ],
            [
                'family' => 'Lato',
                'variants' => ['100', '300', '400', '700', '900'],
                'subsets' => ['latin', 'latin-ext'],
                'category' => 'sans-serif',
            ],
            [
                'family' => 'Poppins',
                'variants' => ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
                'subsets' => ['latin', 'latin-ext'],
                'category' => 'sans-serif',
            ],
            [
                'family' => 'Montserrat',
                'variants' => ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
                'subsets' => ['latin', 'latin-ext'],
                'category' => 'sans-serif',
            ],
            [
                'family' => 'Playfair Display',
                'variants' => ['400', '500', '600', '700', '800', '900'],
                'subsets' => ['latin', 'latin-ext'],
                'category' => 'serif',
            ],
            [
                'family' => 'Merriweather',
                'variants' => ['300', '400', '700', '900'],
                'subsets' => ['latin', 'latin-ext'],
                'category' => 'serif',
            ],
            [
                'family' => 'Source Code Pro',
                'variants' => ['200', '300', '400', '500', '600', '700', '900'],
                'subsets' => ['latin', 'latin-ext'],
                'category' => 'monospace',
            ],
        ];
    }

    /**
     * Tìm kiếm fonts theo tên
     */
    public function searchFonts($query)
    {
        $fonts = $this->getFontsList();
        $results = [];

        foreach ($fonts as $font) {
            if (stripos($font['family'], $query) !== false) {
                $results[] = $font;
            }
        }

        return $results;
    }

    /**
     * Lấy fonts theo category
     */
    public function getFontsByCategory($category)
    {
        $fonts = $this->getFontsList();
        $results = [];

        foreach ($fonts as $font) {
            if (isset($font['category']) && $font['category'] === $category) {
                $results[] = $font;
            }
        }

        return $results;
    }

    /**
     * Lấy font theo tên
     */
    public function getFontByName($fontName)
    {
        $fonts = $this->getFontsList();

        foreach ($fonts as $font) {
            if ($font['family'] === $fontName) {
                return $font;
            }
        }

        return null;
    }

    /**
     * Validate Google Font data
     */
    public function validateFontData($fontData)
    {
        $required = ['name', 'family'];

        foreach ($required as $field) {
            if (empty($fontData[$field])) {
                return false;
            }
        }

        // Kiểm tra font có tồn tại trong Google Fonts không
        $googleFont = $this->getFontByName($fontData['family']);

        if (!$googleFont) {
            return false;
        }

        // Validate variants
        if (isset($fontData['variants'])) {
            $validVariants = $googleFont['variants'] ?? ['400'];
            foreach ($fontData['variants'] as $variant) {
                if (!in_array($variant, $validVariants)) {
                    return false;
                }
            }
        }

        // Validate subsets
        if (isset($fontData['subsets'])) {
            $validSubsets = $googleFont['subsets'] ?? ['latin'];
            foreach ($fontData['subsets'] as $subset) {
                if (!in_array($subset, $validSubsets)) {
                    return false;
                }
            }
        }

        return true;
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
