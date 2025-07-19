<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

/**
 * Path Validation Helper for Jankx Framework
 */

class Jankx_Path_Validator
{
    /**
     * Validate and sanitize file path
     *
     * @param string $path
     * @param string $base_path
     * @return string|false
     */
    public static function validate_path($path, $base_path = null)
    {
        // Validate input
        if (empty($path) || !is_string($path)) {
            return false;
        }

        // Normalize path
        $normalized_path = self::normalize_path($path);
        if ($normalized_path === false) {
            return false;
        }

        // If base path is provided, ensure path is within base
        if ($base_path !== null) {
            $real_base = realpath($base_path);
            if ($real_base === false) {
                return false;
            }

            $real_path = realpath($normalized_path);
            if ($real_path === false) {
                return false;
            }

            // Check if path is within base directory
            if (strpos($real_path, $real_base) !== 0) {
                return false;
            }
        }

        return $normalized_path;
    }

    /**
     * Normalize path and prevent directory traversal
     *
     * @param string $path
     * @return string|false
     */
    public static function normalize_path($path)
    {
        // Remove null bytes
        $path = str_replace(chr(0), '', $path);

        // Normalize directory separators
        $path = str_replace(['\\', '/'], DIRECTORY_SEPARATOR, $path);

        // Remove multiple consecutive separators
        $path = preg_replace('/' . preg_quote(DIRECTORY_SEPARATOR, '/') . '+/', DIRECTORY_SEPARATOR, $path);

        // Remove leading/trailing separators
        $path = trim($path, DIRECTORY_SEPARATOR);

        // Prevent directory traversal
        if (strpos($path, '..') !== false) {
            return false;
        }

        return $path;
    }

    /**
     * Safely join paths
     *
     * @param string ...$paths
     * @return string
     */
    public static function join_paths(...$paths)
    {
        $normalized_paths = [];

        foreach ($paths as $path) {
            $normalized = self::normalize_path($path);
            if ($normalized !== false) {
                $normalized_paths[] = $normalized;
            }
        }

        return implode(DIRECTORY_SEPARATOR, $normalized_paths);
    }

    /**
     * Check if path is within allowed directory
     *
     * @param string $path
     * @param array $allowed_dirs
     * @return bool
     */
    public static function is_path_allowed($path, $allowed_dirs)
    {
        $real_path = realpath($path);
        if ($real_path === false) {
            return false;
        }

        foreach ($allowed_dirs as $allowed_dir) {
            $real_allowed = realpath($allowed_dir);
            if ($real_allowed === false) {
                continue;
            }

            if (strpos($real_path, $real_allowed) === 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get safe cache directory path
     *
     * @param string $cache_name
     * @return string|false
     */
    public static function get_cache_path($cache_name)
    {
        if (!defined('JANKX_CACHE_DIR')) {
            return false;
        }

        $cache_dir = JANKX_CACHE_DIR;
        $normalized_cache_name = self::normalize_path($cache_name);

        if ($normalized_cache_name === false) {
            return false;
        }

        return self::join_paths($cache_dir, $normalized_cache_name);
    }

    /**
     * Validate file extension
     *
     * @param string $filename
     * @param array $allowed_extensions
     * @return bool
     */
    public static function validate_file_extension($filename, $allowed_extensions = ['css', 'js', 'php', 'html', 'txt'])
    {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        return in_array($extension, $allowed_extensions, true);
    }
}

// Helper functions for backward compatibility
if (!function_exists('jankx_validate_path')) {
    function jankx_validate_path($path, $base_path = null)
    {
        return Jankx_Path_Validator::validate_path($path, $base_path);
    }
}

if (!function_exists('jankx_normalize_path')) {
    function jankx_normalize_path($path)
    {
        return Jankx_Path_Validator::normalize_path($path);
    }
}

if (!function_exists('jankx_join_paths')) {
    function jankx_join_paths(...$paths)
    {
        return Jankx_Path_Validator::join_paths(...$paths);
    }
}

if (!function_exists('jankx_get_cache_path')) {
    function jankx_get_cache_path($cache_name)
    {
        return Jankx_Path_Validator::get_cache_path($cache_name);
    }
}