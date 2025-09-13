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
