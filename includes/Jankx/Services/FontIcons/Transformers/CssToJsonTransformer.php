<?php

namespace Jankx\Services\FontIcons\Transformers;

abstract class CssToJsonTransformer
{
    protected $cssContent;
    protected $iconType;

    public function __construct($iconType = 'custom')
    {
        $this->iconType = $iconType;
    }

    /**
     * Transform CSS content to JSON metadata
     */
    abstract public function transform($cssContent);

        /**
     * Transform CSS from URL and save to file
     */
    public function transformFromUrl($cssUrl, $outputPath)
    {

        // Fetch CSS content
                $cssContent = $this->fetchCssContent($cssUrl);

        if (empty($cssContent)) {
                        throw new \Exception('Could not fetch CSS content from URL: ' . $cssUrl);
        }


        // Transform CSS to JSON
                $jsonData = $this->transform($cssContent);

        // Save to file
                $this->saveJsonFile($outputPath, $jsonData);

        return $jsonData;
    }

        /**
     * Fetch CSS content from URL
     */
    protected function fetchCssContent($url)
    {

        $response = wp_remote_get($url);

        if (is_wp_error($response)) {
                        throw new \Exception('Failed to fetch CSS: ' . $response->get_error_message());
        }

        $statusCode = wp_remote_retrieve_response_code($response);

        if ($statusCode !== 200) {
                        throw new \Exception('HTTP error: ' . $statusCode);
        }

        $body = wp_remote_retrieve_body($response);

        return $body;
    }

        /**
     * Save JSON data to file
     */
    protected function saveJsonFile($filePath, $data)
    {

        $dir = dirname($filePath);

        if (!is_dir($dir)) {
            if (mkdir($dir, 0755, true)) {
            } else {
            }
        } else {
        }

        $jsonContent = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        $bytesWritten = file_put_contents($filePath, $jsonContent);
        if ($bytesWritten === false) {
                        throw new \Exception('Failed to save JSON file: ' . $filePath);
        }
    }

        /**
     * Extract icon classes from CSS content
     */
    protected function extractIconClasses($cssContent)
    {

        $iconClasses = [];

        // Pattern to match CSS rules for icons
        $patterns = [
            // Pattern for :before pseudo-elements with content
            '/\.([a-zA-Z0-9_-]+):before\s*\{\s*content:\s*["\']([^"\']+)["\']/',
            // Pattern for icon classes
            '/\.([a-zA-Z0-9_-]+)\s*\{\s*font-family:\s*[^;]+/',
            // Pattern for icon-specific classes
            '/\.([a-zA-Z0-9_-]+)\s*\{\s*background-image:\s*url\([^)]+\)/'
        ];


        foreach ($patterns as $index => $pattern) {
            if (preg_match_all($pattern, $cssContent, $matches, PREG_SET_ORDER)) {
                foreach ($matches as $matchIndex => $match) {
                    $className = $match[1];
                    $content = isset($match[2]) ? $match[2] : '';


                    // Skip utility classes
                    if ($this->isUtilityClass($className)) {
                                                continue;
                    }

                    $iconClasses[] = [
                        'name' => $className,
                        'content' => $content,
                        'category' => $this->categorizeIcon($className)
                    ];
                }
            } else {
            }
        }

                return $iconClasses;
    }

    /**
     * Check if a class is a utility class
     */
    protected function isUtilityClass($className)
    {
        $utilityPatterns = [
            '/^(el|fa|icon)-/',  // Common icon prefixes
            '/^(lg|2x|3x|4x|5x)$/',  // Size modifiers
            '/^(fw|ul|li|border|pull|spin|pulse|rotate|flip|stack|inverse)$/',  // Utility classes
        ];

        foreach ($utilityPatterns as $pattern) {
            if (preg_match($pattern, $className)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Categorize icon based on class name
     */
    protected function categorizeIcon($className)
    {
        $categories = [
            'navigation' => ['home', 'menu', 'arrow', 'chevron', 'caret', 'back', 'forward'],
            'action' => ['add', 'edit', 'delete', 'save', 'close', 'search', 'refresh'],
            'communication' => ['email', 'phone', 'message', 'chat', 'comment'],
            'social' => ['user', 'person', 'profile', 'share', 'like', 'heart'],
            'status' => ['check', 'error', 'warning', 'info', 'success', 'loading'],
            'media' => ['image', 'video', 'audio', 'camera', 'play', 'pause'],
            'business' => ['briefcase', 'building', 'chart', 'money', 'shopping'],
            'general' => ['star', 'settings', 'gear', 'cog', 'wrench', 'tools']
        ];

        foreach ($categories as $category => $keywords) {
            foreach ($keywords as $keyword) {
                if (stripos($className, $keyword) !== false) {
                    return $category;
                }
            }
        }

        return 'general';
    }
}
