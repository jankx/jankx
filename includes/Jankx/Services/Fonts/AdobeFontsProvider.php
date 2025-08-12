<?php

namespace Jankx\Services\Fonts;

/**
 * Provider để quản lý Adobe Fonts
 */
class AdobeFontsProvider
{
    protected $projectId;
    protected $fonts = [];
    
    public function __construct()
    {
        $this->projectId = get_option('jankx_adobe_fonts_project_id', '');
    }
    
    /**
     * Enqueue Adobe Font
     */
    public function enqueueFont($fontData)
    {
        $fontName = $fontData['name'];
        $projectId = $fontData['project_id'] ?? $this->projectId;
        
        if (empty($projectId)) {
            return false;
        }
        
        // Tạo Adobe Fonts URL
        $url = $this->buildAdobeFontsUrl($projectId);
        
        if ($url) {
            wp_enqueue_style(
                "adobe-font-{$fontName}",
                $url,
                [],
                null
            );
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Tạo Adobe Fonts URL
     */
    protected function buildAdobeFontsUrl($projectId)
    {
        return "https://use.typekit.net/{$projectId}.css";
    }
    
    /**
     * Lấy danh sách Adobe Fonts từ project
     */
    public function getFontsList($projectId = null)
    {
        $projectId = $projectId ?: $this->projectId;
        
        if (empty($projectId)) {
            return [];
        }
        
        if (empty($this->fonts[$projectId])) {
            $this->loadFontsFromProject($projectId);
        }
        
        return $this->fonts[$projectId] ?? [];
    }
    
    /**
     * Load fonts từ Adobe Fonts project
     */
    protected function loadFontsFromProject($projectId)
    {
        $cacheKey = "jankx_adobe_fonts_{$projectId}";
        $cachedFonts = get_transient($cacheKey);
        
        if ($cachedFonts !== false) {
            $this->fonts[$projectId] = $cachedFonts;
            return;
        }
        
        // Adobe Fonts không có public API để lấy danh sách fonts
        // Sử dụng danh sách mặc định
        $this->fonts[$projectId] = $this->getDefaultAdobeFonts();
        
        // Cache fonts trong 24 giờ
        set_transient($cacheKey, $this->fonts[$projectId], DAY_IN_SECONDS);
    }
    
    /**
     * Lấy danh sách Adobe Fonts mặc định
     */
    protected function getDefaultAdobeFonts()
    {
        return [
            [
                'family' => 'Adobe Garamond Pro',
                'variants' => ['regular', 'italic', 'semibold', 'semibold-italic', 'bold', 'bold-italic'],
                'category' => 'serif',
            ],
            [
                'family' => 'Adobe Caslon Pro',
                'variants' => ['regular', 'italic', 'semibold', 'semibold-italic', 'bold', 'bold-italic'],
                'category' => 'serif',
            ],
            [
                'family' => 'Minion Pro',
                'variants' => ['regular', 'italic', 'medium', 'medium-italic', 'semibold', 'semibold-italic', 'bold', 'bold-italic'],
                'category' => 'serif',
            ],
            [
                'family' => 'Myriad Pro',
                'variants' => ['regular', 'italic', 'semibold', 'semibold-italic', 'bold', 'bold-italic'],
                'category' => 'sans-serif',
            ],
            [
                'family' => 'Futura PT',
                'variants' => ['book', 'book-italic', 'medium', 'medium-italic', 'bold', 'bold-italic'],
                'category' => 'sans-serif',
            ],
            [
                'family' => 'Gotham',
                'variants' => ['book', 'book-italic', 'medium', 'medium-italic', 'bold', 'bold-italic'],
                'category' => 'sans-serif',
            ],
            [
                'family' => 'Source Code Pro',
                'variants' => ['regular', 'medium', 'semibold', 'bold'],
                'category' => 'monospace',
            ],
        ];
    }
    
    /**
     * Tìm kiếm fonts theo tên
     */
    public function searchFonts($query, $projectId = null)
    {
        $fonts = $this->getFontsList($projectId);
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
    public function getFontsByCategory($category, $projectId = null)
    {
        $fonts = $this->getFontsList($projectId);
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
    public function getFontByName($fontName, $projectId = null)
    {
        $fonts = $this->getFontsList($projectId);
        
        foreach ($fonts as $font) {
            if ($font['family'] === $fontName) {
                return $font;
            }
        }
        
        return null;
    }
    
    /**
     * Validate Adobe Font data
     */
    public function validateFontData($fontData)
    {
        $required = ['name', 'family'];
        
        foreach ($required as $field) {
            if (empty($fontData[$field])) {
                return false;
            }
        }
        
        // Kiểm tra project ID
        $projectId = $fontData['project_id'] ?? $this->projectId;
        if (empty($projectId)) {
            return false;
        }
        
        // Kiểm tra font có tồn tại trong project không
        $adobeFont = $this->getFontByName($fontData['family'], $projectId);
        
        if (!$adobeFont) {
            return false;
        }
        
        // Validate variants
        if (isset($fontData['variants'])) {
            $validVariants = $adobeFont['variants'] ?? ['regular'];
            foreach ($fontData['variants'] as $variant) {
                if (!in_array($variant, $validVariants)) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    /**
     * Set Adobe Fonts project ID
     */
    public function setProjectId($projectId)
    {
        $this->projectId = $projectId;
        update_option('jankx_adobe_fonts_project_id', $projectId);
        
        // Clear cache
        delete_transient("jankx_adobe_fonts_{$projectId}");
    }
    
    /**
     * Get Adobe Fonts project ID
     */
    public function getProjectId()
    {
        return $this->projectId;
    }
    
    /**
     * Kiểm tra project ID có hợp lệ không
     */
    public function validateProjectId($projectId)
    {
        if (empty($projectId)) {
            return false;
        }
        
        // Kiểm tra format của project ID (thường là 6 ký tự)
        if (!preg_match('/^[a-z0-9]{6}$/i', $projectId)) {
            return false;
        }
        
        // Kiểm tra URL có accessible không
        $url = $this->buildAdobeFontsUrl($projectId);
        $response = wp_remote_head($url);
        
        return !is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200;
    }
    
    /**
     * Lấy thông tin project
     */
    public function getProjectInfo($projectId = null)
    {
        $projectId = $projectId ?: $this->projectId;
        
        if (empty($projectId)) {
            return null;
        }
        
        $cacheKey = "jankx_adobe_project_info_{$projectId}";
        $cachedInfo = get_transient($cacheKey);
        
        if ($cachedInfo !== false) {
            return $cachedInfo;
        }
        
        // Adobe Fonts không có public API để lấy project info
        // Trả về thông tin cơ bản
        $projectInfo = [
            'id' => $projectId,
            'name' => 'Adobe Fonts Project',
            'fonts_count' => count($this->getFontsList($projectId)),
            'url' => $this->buildAdobeFontsUrl($projectId),
        ];
        
        // Cache trong 24 giờ
        set_transient($cacheKey, $projectInfo, DAY_IN_SECONDS);
        
        return $projectInfo;
    }
}
