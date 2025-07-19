<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

/**
 * Enhanced File Upload Security for Jankx Framework
 */

class Jankx_File_Upload_Security
{
    // Allowed file types and their MIME types
    private static $allowed_types = [
        'jpg' => [
            'mime' => 'image/jpeg',
            'extensions' => ['jpg', 'jpeg'],
            'max_size' => 5 * 1024 * 1024 // 5MB
        ],
        'png' => [
            'mime' => 'image/png',
            'extensions' => ['png'],
            'max_size' => 5 * 1024 * 1024 // 5MB
        ],
        'gif' => [
            'mime' => 'image/gif',
            'extensions' => ['gif'],
            'max_size' => 5 * 1024 * 1024 // 5MB
        ],
        'svg' => [
            'mime' => 'image/svg+xml',
            'extensions' => ['svg'],
            'max_size' => 2 * 1024 * 1024 // 2MB (smaller for SVG)
        ],
        'pdf' => [
            'mime' => 'application/pdf',
            'extensions' => ['pdf'],
            'max_size' => 10 * 1024 * 1024 // 10MB
        ],
        'doc' => [
            'mime' => 'application/msword',
            'extensions' => ['doc'],
            'max_size' => 10 * 1024 * 1024 // 10MB
        ],
        'docx' => [
            'mime' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'extensions' => ['docx'],
            'max_size' => 10 * 1024 * 1024 // 10MB
        ]
    ];

    // Dangerous file types that should be blocked
    private static $blocked_types = [
        'php', 'php3', 'php4', 'php5', 'phtml', 'phar',
        'asp', 'aspx', 'ashx', 'asmx',
        'jsp', 'jspx',
        'exe', 'com', 'bat', 'cmd', 'scr', 'pif',
        'js', 'vbs', 'wsf', 'hta',
        'jar', 'war', 'ear',
        'sh', 'bash', 'csh', 'ksh', 'tcsh',
        'pl', 'py', 'rb', 'tcl',
        'dll', 'so', 'dylib',
        'bin', 'sys', 'drv'
    ];

    /**
     * Validate uploaded file
     *
     * @param array $file $_FILES array element
     * @param array $allowed_types Custom allowed types (optional)
     * @return array|false Validation result or false on failure
     */
    public static function validate_upload($file, $allowed_types = [])
    {
        // Basic file validation
        if (!self::validate_basic_file($file)) {
            return false;
        }

        // Get file extension
        $extension = self::get_file_extension($file['name']);
        if ($extension === false) {
            return false;
        }

        // Check if file type is blocked
        if (self::is_file_type_blocked($extension)) {
            return false;
        }

        // Check if file type is allowed
        $file_type_config = self::get_file_type_config($extension, $allowed_types);
        if ($file_type_config === false) {
            return false;
        }

        // Validate file size
        if (!self::validate_file_size($file, $file_type_config)) {
            return false;
        }

        // Validate MIME type
        if (!self::validate_mime_type($file, $file_type_config)) {
            return false;
        }

        // Validate file content
        if (!self::validate_file_content($file, $extension)) {
            return false;
        }

        // Sanitize file if needed
        if ($extension === 'svg') {
            if (!self::sanitize_svg_file($file['tmp_name'])) {
                return false;
            }
        }

        return [
            'valid' => true,
            'extension' => $extension,
            'type' => $file_type_config['mime'],
            'size' => $file['size']
        ];
    }

    /**
     * Basic file validation
     *
     * @param array $file
     * @return bool
     */
    private static function validate_basic_file($file)
    {
        // Check if file exists
        if (!isset($file) || !is_array($file)) {
            return false;
        }

        // Check for upload errors
        if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
            return false;
        }

        // Check if file was uploaded via HTTP POST
        if (!is_uploaded_file($file['tmp_name'])) {
            return false;
        }

        // Check if file exists and is readable
        if (!file_exists($file['tmp_name']) || !is_readable($file['tmp_name'])) {
            return false;
        }

        return true;
    }

    /**
     * Get file extension safely
     *
     * @param string $filename
     * @return string|false
     */
    private static function get_file_extension($filename)
    {
        if (empty($filename) || !is_string($filename)) {
            return false;
        }

        // Remove null bytes and normalize
        $filename = str_replace(chr(0), '', $filename);
        $filename = trim($filename);

        // Get extension
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        // Validate extension
        if (empty($extension) || strlen($extension) > 10) {
            return false;
        }

        // Check for double extensions (e.g., file.php.jpg)
        $name_without_ext = pathinfo($filename, PATHINFO_FILENAME);
        if (strpos($name_without_ext, '.') !== false) {
            return false;
        }

        return $extension;
    }

    /**
     * Check if file type is blocked
     *
     * @param string $extension
     * @return bool
     */
    private static function is_file_type_blocked($extension)
    {
        return in_array($extension, self::$blocked_types, true);
    }

    /**
     * Get file type configuration
     *
     * @param string $extension
     * @param array $custom_allowed_types
     * @return array|false
     */
    private static function get_file_type_config($extension, $custom_allowed_types = [])
    {
        $allowed_types = !empty($custom_allowed_types) ? $custom_allowed_types : self::$allowed_types;

        foreach ($allowed_types as $type => $config) {
            if (in_array($extension, $config['extensions'], true)) {
                return $config;
            }
        }

        return false;
    }

    /**
     * Validate file size
     *
     * @param array $file
     * @param array $config
     * @return bool
     */
    private static function validate_file_size($file, $config)
    {
        $file_size = $file['size'];

        // Check against configured max size
        if (isset($config['max_size']) && $file_size > $config['max_size']) {
            return false;
        }

        // Check against WordPress upload limit
        $wp_max_size = wp_max_upload_size();
        if ($file_size > $wp_max_size) {
            return false;
        }

        // Check against PHP upload limit
        $php_max_size = self::get_php_upload_limit();
        if ($file_size > $php_max_size) {
            return false;
        }

        return true;
    }

    /**
     * Validate MIME type
     *
     * @param array $file
     * @param array $config
     * @return bool
     */
    private static function validate_mime_type($file, $config)
    {
        // Get actual MIME type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo === false) {
            return false;
        }

        $actual_mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if ($actual_mime === false) {
            return false;
        }

        // Check against expected MIME type
        $expected_mime = $config['mime'];
        if ($actual_mime !== $expected_mime) {
            return false;
        }

        // Additional MIME type validation
        return self::validate_mime_type_content($file['tmp_name'], $actual_mime);
    }

    /**
     * Validate MIME type content
     *
     * @param string $file_path
     * @param string $mime_type
     * @return bool
     */
    private static function validate_mime_type_content($file_path, $mime_type)
    {
        $handle = fopen($file_path, 'rb');
        if ($handle === false) {
            return false;
        }

        $header = fread($handle, 8);
        fclose($handle);

        // Check file signatures
        switch ($mime_type) {
            case 'image/jpeg':
                return strpos($header, "\xFF\xD8\xFF") === 0;

            case 'image/png':
                return strpos($header, "\x89PNG\r\n\x1A\n") === 0;

            case 'image/gif':
                return strpos($header, "GIF87a") === 0 || strpos($header, "GIF89a") === 0;

            case 'image/svg+xml':
                return strpos($header, '<?xml') === 0 || strpos($header, '<svg') === 0;

            case 'application/pdf':
                return strpos($header, "%PDF") === 0;

            case 'application/msword':
                return strpos($header, "\xD0\xCF\x11\xE0") === 0;

            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                // ZIP file containing XML
                return strpos($header, "PK\x03\x04") === 0;

            default:
                return true; // Allow other types if MIME validation passed
        }
    }

    /**
     * Validate file content
     *
     * @param array $file
     * @param string $extension
     * @return bool
     */
    private static function validate_file_content($file, $extension)
    {
        // Read first few bytes to check for executable content
        $handle = fopen($file['tmp_name'], 'rb');
        if ($handle === false) {
            return false;
        }

        $content = fread($handle, 1024);
        fclose($handle);

        // Check for PHP tags
        if (strpos($content, '<?php') !== false || strpos($content, '<?=') !== false) {
            return false;
        }

        // Check for executable markers
        $executable_markers = [
            "\x4D\x5A", // MZ header (Windows executables)
            "\x7F\x45\x4C\x46", // ELF header (Linux executables)
            "\xFE\xED\xFA", // Mach-O header (macOS executables)
        ];

        foreach ($executable_markers as $marker) {
            if (strpos($content, $marker) === 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * Sanitize SVG file
     *
     * @param string $file_path
     * @return bool
     */
    private static function sanitize_svg_file($file_path)
    {
        $svg_content = file_get_contents($file_path);
        if ($svg_content === false) {
            return false;
        }

        $sanitized = Jankx_Security_Helper::sanitize_svg($svg_content);
        if ($sanitized === false) {
            return false;
        }

        // Write sanitized content back
        return file_put_contents($file_path, $sanitized) !== false;
    }

    /**
     * Get PHP upload limit in bytes
     *
     * @return int
     */
    private static function get_php_upload_limit()
    {
        $max_upload = (int) ini_get('upload_max_filesize');
        $max_post = (int) ini_get('post_max_size');
        $memory_limit = (int) ini_get('memory_limit');

        $upload_mb = min($max_upload, $max_post, $memory_limit);
        return $upload_mb * 1024 * 1024;
    }

    /**
     * Get allowed file types
     *
     * @return array
     */
    public static function get_allowed_types()
    {
        return self::$allowed_types;
    }

    /**
     * Get blocked file types
     *
     * @return array
     */
    public static function get_blocked_types()
    {
        return self::$blocked_types;
    }

    /**
     * Add custom allowed file type
     *
     * @param string $type
     * @param array $config
     * @return bool
     */
    public static function add_allowed_type($type, $config)
    {
        if (empty($type) || !is_array($config)) {
            return false;
        }

        self::$allowed_types[$type] = $config;
        return true;
    }

    /**
     * Remove allowed file type
     *
     * @param string $type
     * @return bool
     */
    public static function remove_allowed_type($type)
    {
        if (isset(self::$allowed_types[$type])) {
            unset(self::$allowed_types[$type]);
            return true;
        }

        return false;
    }

    /**
     * Add blocked file type
     *
     * @param string $extension
     * @return bool
     */
    public static function add_blocked_type($extension)
    {
        if (!in_array($extension, self::$blocked_types, true)) {
            self::$blocked_types[] = $extension;
            return true;
        }

        return false;
    }

    /**
     * Remove blocked file type
     *
     * @param string $extension
     * @return bool
     */
    public static function remove_blocked_type($extension)
    {
        $key = array_search($extension, self::$blocked_types, true);
        if ($key !== false) {
            unset(self::$blocked_types[$key]);
            return true;
        }

        return false;
    }
}

// Helper functions for backward compatibility
if (!function_exists('jankx_validate_file_upload')) {
    function jankx_validate_file_upload($file, $allowed_types = [])
    {
        return Jankx_File_Upload_Security::validate_upload($file, $allowed_types);
    }
}

if (!function_exists('jankx_get_allowed_file_types')) {
    function jankx_get_allowed_file_types()
    {
        return Jankx_File_Upload_Security::get_allowed_types();
    }
}

if (!function_exists('jankx_get_blocked_file_types')) {
    function jankx_get_blocked_file_types()
    {
        return Jankx_File_Upload_Security::get_blocked_types();
    }
}

if (!function_exists('jankx_add_allowed_file_type')) {
    function jankx_add_allowed_file_type($type, $config)
    {
        return Jankx_File_Upload_Security::add_allowed_type($type, $config);
    }
}

if (!function_exists('jankx_remove_allowed_file_type')) {
    function jankx_remove_allowed_file_type($type)
    {
        return Jankx_File_Upload_Security::remove_allowed_type($type);
    }
}

if (!function_exists('jankx_add_blocked_file_type')) {
    function jankx_add_blocked_file_type($extension)
    {
        return Jankx_File_Upload_Security::add_blocked_type($extension);
    }
}

if (!function_exists('jankx_remove_blocked_file_type')) {
    function jankx_remove_blocked_file_type($extension)
    {
        return Jankx_File_Upload_Security::remove_blocked_type($extension);
    }
}