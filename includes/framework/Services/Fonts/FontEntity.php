<?php

namespace Jankx\Services\Fonts;

/**
 * Font Entity để định nghĩa cấu trúc font data
 */
class FontEntity
{
    protected $data;

    public function __construct($data = [])
    {

        $this->data = array_merge([
            'id' => '',
            'name' => '',
            'family' => '',
            'category' => 'custom',
            'variants' => ['400'],
            'subsets' => ['latin'],
            'status' => 'active',
            'created_at' => null,
            'updated_at' => null,
            'metadata' => [],
        ], $data);

        // Set timestamps
        if (empty($this->data['created_at'])) {
            $this->data['created_at'] = current_time('mysql');
        }
        if (empty($this->data['updated_at'])) {
            $this->data['updated_at'] = current_time('mysql');
        }
    }

    /**
     * Get font ID
     */
    public function getId()
    {
        return $this->data['id'] ?: $this->generateId();
    }

    /**
     * Generate unique font ID
     */
    protected function generateId()
    {
        $name = $this->data['name'] ?: $this->data['family'];
        return sanitize_title($name) . '-' . substr(md5($name), 0, 8);
    }

    /**
     * Get font name
     */
    public function getName()
    {
        return $this->data['name'];
    }

    /**
     * Set font name
     */
    public function setName($name)
    {
        $this->data['name'] = $name;
        $this->data['updated_at'] = current_time('mysql');
        return $this;
    }

    /**
     * Get font family
     */
    public function getFamily()
    {
        return $this->data['family'];
    }

    /**
     * Set font family
     */
    public function setFamily($family)
    {
        $this->data['family'] = $family;
        $this->data['updated_at'] = current_time('mysql');
        return $this;
    }

    /**
     * Get font category
     */
    public function getCategory()
    {
        return $this->data['category'];
    }

    /**
     * Set font category
     */
    public function setCategory($category)
    {
        $this->data['category'] = $category;
        $this->data['updated_at'] = current_time('mysql');
        return $this;
    }

    /**
     * Get font variants
     */
    public function getVariants()
    {
        return $this->data['variants'];
    }

    /**
     * Set font variants
     */
    public function setVariants($variants)
    {
        $this->data['variants'] = is_array($variants) ? $variants : [$variants];
        $this->data['updated_at'] = current_time('mysql');
        return $this;
    }

    /**
     * Get font subsets
     */
    public function getSubsets()
    {
        return $this->data['subsets'];
    }

    /**
     * Set font subsets
     */
    public function setSubsets($subsets)
    {
        $this->data['subsets'] = is_array($subsets) ? $subsets : [$subsets];
        $this->data['updated_at'] = current_time('mysql');
        return $this;
    }

    /**
     * Get font status
     */
    public function getStatus()
    {
        return $this->data['status'];
    }

    /**
     * Set font status
     */
    public function setStatus($status)
    {
        $this->data['status'] = $status;
        $this->data['updated_at'] = current_time('mysql');
        return $this;
    }

    /**
     * Get metadata
     */
    public function getMetadata($key = null)
    {
        if ($key === null) {
            return $this->data['metadata'];
        }
        return $this->data['metadata'][$key] ?? null;
    }

    /**
     * Set metadata
     */
    public function setMetadata($key, $value = null)
    {
        if (is_array($key)) {
            $this->data['metadata'] = array_merge($this->data['metadata'], $key);
        } else {
            $this->data['metadata'][$key] = $value;
        }
        $this->data['updated_at'] = current_time('mysql');
        return $this;
    }

    /**
     * Get created at timestamp
     */
    public function getCreatedAt()
    {
        return $this->data['created_at'];
    }

    /**
     * Get updated at timestamp
     */
    public function getUpdatedAt()
    {
        return $this->data['updated_at'];
    }

    /**
     * Get all data as array
     */
    public function toArray()
    {
        return $this->data;
    }

    /**
     * Get data for specific provider
     */
    public function getProviderData($provider)
    {
        $baseData = [
            'name' => $this->getName(),
            'family' => $this->getFamily(),
            'category' => $this->getCategory(),
            'variants' => $this->getVariants(),
            'subsets' => $this->getSubsets(),
            'status' => $this->getStatus(),
        ];

        // Add provider-specific metadata
        $metadata = $this->getMetadata();
        if (isset($metadata[$provider])) {
            $baseData = array_merge($baseData, $metadata[$provider]);
        }

        return $baseData;
    }

    /**
     * Validate font data
     */
    public function validate()
    {
        $errors = [];

        if (empty($this->data['name'])) {
            $errors[] = 'Font name is required';
        }

        if (empty($this->data['family'])) {
            $errors[] = 'Font family is required';
        }

        if (empty($this->data['category'])) {
            $errors[] = 'Font category is required';
        }

        $validCategories = ['system', 'google', 'adobe', 'custom'];
        if (!in_array($this->data['category'], $validCategories)) {
            $errors[] = 'Invalid font category';
        }

        if (empty($this->data['variants']) || !is_array($this->data['variants'])) {
            $errors[] = 'Font variants must be an array';
        }

        if (empty($this->data['subsets']) || !is_array($this->data['subsets'])) {
            $errors[] = 'Font subsets must be an array';
        }

        // Validate CSS file for custom fonts
        if ($this->data['category'] === 'custom' && $this->usesCssFile()) {
            if (!$this->validateCssFile()) {
                $errors[] = 'Invalid CSS file or CSS file does not contain @font-face';
            }
        }

        return empty($errors) ? true : $errors;
    }

    /**
     * Check if font is active
     */
    public function isActive()
    {
        return $this->data['status'] === 'active';
    }

    /**
     * Check if font is Google Font
     */
    public function isGoogleFont()
    {
        return $this->data['category'] === 'google';
    }

    /**
     * Check if font is Adobe Font
     */
    public function isAdobeFont()
    {
        return $this->data['category'] === 'adobe';
    }

    /**
     * Check if font is Custom Font
     */
    public function isCustomFont()
    {
        return $this->data['category'] === 'custom';
    }

    /**
     * Check if font is System Font
     */
    public function isSystemFont()
    {
        return $this->data['category'] === 'system';
    }

    /**
     * Get font display name
     */
    public function getDisplayName()
    {
        return $this->data['name'] ?: $this->data['family'];
    }

    /**
     * Get font CSS class name
     */
    public function getCssClassName()
    {
        return 'font-' . sanitize_title($this->getId());
    }

    /**
     * Get font family CSS string
     */
    public function getCssFamilyString()
    {
        $family = $this->data['family'];

        // Add fallbacks based on category
        switch ($this->data['category']) {
            case 'serif':
                $fallback = 'serif';
                break;
            case 'monospace':
                $fallback = 'monospace';
                break;
            default:
                $fallback = 'sans-serif';
                break;
        }

        return "'{$family}', {$fallback}";
    }

    /**
     * Get CSS file path for custom fonts
     */
    public function getCssFile()
    {
        return $this->getMetadata('css_file');
    }

    /**
     * Set CSS file path for custom fonts
     */
    public function setCssFile($cssFile)
    {
        $this->setMetadata('css_file', $cssFile);
        return $this;
    }

    /**
     * Check if font uses CSS file
     */
    public function usesCssFile()
    {
        return !empty($this->getCssFile());
    }

    /**
     * Get CSS content from file
     */
    public function getCssContent()
    {
        $cssFile = $this->getCssFile();


        if (empty($cssFile)) {
            return '';
        }

        if (!file_exists($cssFile)) {
            return '';
        }

        $content = file_get_contents($cssFile);

        return $content;
    }

    /**
     * Validate CSS file
     */
    public function validateCssFile()
    {
        $cssFile = $this->getCssFile();

        if (empty($cssFile)) {
            return true; // Không có CSS file cũng OK
        }

        // Nếu là URL, chỉ kiểm tra format
        if (filter_var($cssFile, FILTER_VALIDATE_URL)) {
            return true; // URL hợp lệ
        }

        // Nếu là local file
        if (!file_exists($cssFile)) {
            return false;
        }

        if (!is_readable($cssFile)) {
            return false;
        }

        // Kiểm tra file có phải CSS không
        $content = file_get_contents($cssFile);
        if (empty($content)) {
            return false;
        }

        // Kiểm tra có chứa @font-face hoặc icon classes
        if (
            strpos($content, '@font-face') === false &&
            strpos($content, ':before') === false &&
            strpos($content, ':after') === false
        ) {
            return false;
        }

        return true;
    }

    /**
     * Get font files from CSS content
     */
    public function getFontFilesFromCss()
    {
        $cssContent = $this->getCssContent();

        if (empty($cssContent)) {
            return [];
        }

        $fontFiles = [];

        // Extract font files from CSS
        preg_match_all('/url\([\'"]?([^\'")]+\.(woff2?|ttf|otf|eot))[\'"]?\)/i', $cssContent, $matches);

        if (!empty($matches[1])) {
            $cssDir = dirname($this->getCssFile());

            foreach ($matches[1] as $index => $fontFile) {
                $format = strtolower($matches[2][$index]);

                // Convert relative path to absolute
                if (!filter_var($fontFile, FILTER_VALIDATE_URL)) {
                    $fontFile = $cssDir . '/' . $fontFile;
                }

                $fontFiles[$format] = $fontFile;
            }
        }

        return $fontFiles;
    }

    /**
     * Get font family from CSS content
     */
    public function getFontFamilyFromCss()
    {
        $cssContent = $this->getCssContent();

        if (empty($cssContent)) {
            return $this->getFamily();
        }

        // Extract font-family from CSS
        preg_match('/font-family:\s*[\'"]?([^\'";,]+)[\'"]?/i', $cssContent, $matches);

        if (!empty($matches[1])) {
            return trim($matches[1]);
        }

        return $this->getFamily();
    }

    /**
     * Update font data from CSS file
     */
    public function updateFromCssFile()
    {
        if (!$this->usesCssFile()) {
            return $this;
        }

        // Update font family from CSS
        $cssFontFamily = $this->getFontFamilyFromCss();
        if (!empty($cssFontFamily)) {
            $this->setFamily($cssFontFamily);
        }

        // Update font files from CSS
        $fontFiles = $this->getFontFilesFromCss();
        if (!empty($fontFiles)) {
            $this->setMetadata('files', $fontFiles);
        }

        return $this;
    }
}
