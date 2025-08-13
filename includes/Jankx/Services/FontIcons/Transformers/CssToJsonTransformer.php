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
        error_log("JANKX DEBUG: CssToJsonTransformer::transformFromUrl() called");
        error_log("JANKX DEBUG: CSS URL: {$cssUrl}");
        error_log("JANKX DEBUG: Output path: {$outputPath}");

        // Fetch CSS content
        error_log("JANKX DEBUG: Fetching CSS content...");
        $cssContent = $this->fetchCssContent($cssUrl);

        if (empty($cssContent)) {
            error_log("JANKX DEBUG: CSS content is empty!");
            throw new \Exception('Could not fetch CSS content from URL: ' . $cssUrl);
        }

        error_log("JANKX DEBUG: CSS content fetched successfully. Length: " . strlen($cssContent));

        // Transform CSS to JSON
        error_log("JANKX DEBUG: Calling transform() method...");
        $jsonData = $this->transform($cssContent);
        error_log("JANKX DEBUG: Transform completed. JSON data keys: " . implode(', ', array_keys($jsonData)));

        // Save to file
        error_log("JANKX DEBUG: Saving JSON file...");
        $this->saveJsonFile($outputPath, $jsonData);
        error_log("JANKX DEBUG: JSON file saved successfully");

        return $jsonData;
    }

        /**
     * Fetch CSS content from URL
     */
    protected function fetchCssContent($url)
    {
        error_log("JANKX DEBUG: fetchCssContent() called with URL: {$url}");

        $response = wp_remote_get($url);

        if (is_wp_error($response)) {
            error_log("JANKX DEBUG: wp_remote_get failed: " . $response->get_error_message());
            throw new \Exception('Failed to fetch CSS: ' . $response->get_error_message());
        }

        $statusCode = wp_remote_retrieve_response_code($response);
        error_log("JANKX DEBUG: HTTP response status: {$statusCode}");

        if ($statusCode !== 200) {
            error_log("JANKX DEBUG: HTTP error status: {$statusCode}");
            throw new \Exception('HTTP error: ' . $statusCode);
        }

        $body = wp_remote_retrieve_body($response);
        error_log("JANKX DEBUG: Response body length: " . strlen($body));
        error_log("JANKX DEBUG: Response body preview (first 200 chars): " . substr($body, 0, 200));

        return $body;
    }

        /**
     * Save JSON data to file
     */
    protected function saveJsonFile($filePath, $data)
    {
        error_log("JANKX DEBUG: saveJsonFile() called");
        error_log("JANKX DEBUG: File path: {$filePath}");
        error_log("JANKX DEBUG: Data to save: " . print_r($data, true));

        $dir = dirname($filePath);
        error_log("JANKX DEBUG: Directory: {$dir}");

        if (!is_dir($dir)) {
            error_log("JANKX DEBUG: Directory does not exist, creating...");
            if (mkdir($dir, 0755, true)) {
                error_log("JANKX DEBUG: Directory created successfully");
            } else {
                error_log("JANKX DEBUG: Failed to create directory");
            }
        } else {
            error_log("JANKX DEBUG: Directory already exists");
        }

        $jsonContent = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        error_log("JANKX DEBUG: JSON content length: " . strlen($jsonContent));
        error_log("JANKX DEBUG: JSON content preview: " . substr($jsonContent, 0, 200));

        $bytesWritten = file_put_contents($filePath, $jsonContent);
        if ($bytesWritten === false) {
            error_log("JANKX DEBUG: Failed to write file");
            throw new \Exception('Failed to save JSON file: ' . $filePath);
        }

        error_log("JANKX DEBUG: File saved successfully. Bytes written: {$bytesWritten}");
    }

        /**
     * Extract icon classes from CSS content
     */
    protected function extractIconClasses($cssContent)
    {
        error_log("JANKX DEBUG: extractIconClasses() called");
        error_log("JANKX DEBUG: CSS content length: " . strlen($cssContent));
        error_log("JANKX DEBUG: CSS content preview (first 500 chars): " . substr($cssContent, 0, 500));

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

        error_log("JANKX DEBUG: Using " . count($patterns) . " patterns to extract icons");

        foreach ($patterns as $index => $pattern) {
            error_log("JANKX DEBUG: Testing pattern " . ($index + 1) . ": " . $pattern);

            if (preg_match_all($pattern, $cssContent, $matches, PREG_SET_ORDER)) {
                error_log("JANKX DEBUG: Pattern " . ($index + 1) . " found " . count($matches) . " matches");

                foreach ($matches as $matchIndex => $match) {
                    $className = $match[1];
                    $content = isset($match[2]) ? $match[2] : '';

                    error_log("JANKX DEBUG: Match " . ($matchIndex + 1) . ": class='{$className}', content='{$content}'");

                    // Skip utility classes
                    if ($this->isUtilityClass($className)) {
                        error_log("JANKX DEBUG: Skipping utility class: {$className}");
                        continue;
                    }

                    $iconClasses[] = [
                        'name' => $className,
                        'content' => $content,
                        'category' => $this->categorizeIcon($className)
                    ];
                    error_log("JANKX DEBUG: Added icon: {$className} (category: " . $this->categorizeIcon($className) . ")");
                }
            } else {
                error_log("JANKX DEBUG: Pattern " . ($index + 1) . " found no matches");
            }
        }

        error_log("JANKX DEBUG: Total icon classes extracted: " . count($iconClasses));
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
