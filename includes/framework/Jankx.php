<?php

namespace Jankx;

use Jankx\Foundation\Application;

/**
 * Main Jankx Framework Class
 * Extends facade pattern và resolve version từ container
 */
class Jankx
{
    /**
     * Get framework version
     */
    public static function version()
    {
        $app = Application::getInstance();

        try {
            // Thử lấy version từ container trước
            if ($app->bound('jankx.version')) {
                return $app->make('jankx.version');
            }

            // Fallback: đọc từ composer.json
            $composerFile = dirname(dirname(__DIR__)) . '/composer.json';
            if (file_exists($composerFile)) {
                $composerData = json_decode(file_get_contents($composerFile), true);
                if (isset($composerData['version'])) {
                    return $composerData['version'];
                }
            }

            // Fallback cuối cùng
            return '2.0.0';
        } catch (\Exception $e) {
            // Fallback nếu có lỗi
            return '2.0.0';
        }
    }

    /**
     * Get framework name
     */
    public static function name()
    {
        return 'Jankx';
    }

    /**
     * Get framework description
     */
    public static function description()
    {
        return 'Jankx is a powerful WordPress theme framework. High performance, compatible, easy to use and develop';
    }

    /**
     * Check if running in development mode
     */
    public static function isDevelopment()
    {
        $app = Application::getInstance();

        try {
            if ($app->bound('jankx.environment')) {
                return $app->make('jankx.environment') === 'development';
            }

            // Fallback: kiểm tra WordPress debug mode
            return defined('WP_DEBUG') && WP_DEBUG;
        } catch (\Exception $e) {
            return defined('WP_DEBUG') && WP_DEBUG;
        }
    }

    /**
     * Get framework path
     */
    public static function path()
    {
        return dirname(dirname(__DIR__));
    }

    /**
     * Get framework includes path
     */
    public static function includesPath()
    {
        return self::path() . '/includes';
    }

    /**
     * Get framework app path
     */
    public static function appPath()
    {
        return self::path() . '/app';
    }

    /**
     * Get framework resources path
     */
    public static function resourcesPath()
    {
        return self::path() . '/resources';
    }

    /**
     * Get framework assets path
     */
    public static function assetsPath()
    {
        return self::path() . '/assets';
    }

    /**
     * Get framework URL
     */
    public static function url()
    {
        $templateUrl = get_template_directory_uri();
        return $templateUrl;
    }

    /**
     * Get framework includes URL
     */
    public static function includesUrl()
    {
        return self::url() . '/includes';
    }

    /**
     * Get framework app URL
     */
    public static function appUrl()
    {
        return self::url() . '/app';
    }

    /**
     * Get framework resources URL
     */
    public static function resourcesUrl()
    {
        return self::url() . '/resources';
    }

    /**
     * Get framework assets URL
     */
    public static function assetsUrl()
    {
        return self::url() . '/assets';
    }

    /**
     * Magic method để gọi các methods khác
     */
    public static function __callStatic($method, $arguments)
    {
        $app = Application::getInstance();

        try {
            // Thử gọi method từ container
            if ($app->bound("jankx.{$method}")) {
                return $app->make("jankx.{$method}");
            }

            // Thử gọi method từ service
            if ($app->bound("Jankx\\Services\\{$method}Service")) {
                $service = $app->make("Jankx\\Services\\{$method}Service");
                if (method_exists($service, $method)) {
                    return call_user_func_array([$service, $method], $arguments);
                }
            }

            throw new \BadMethodCallException("Method {$method} does not exist on Jankx facade.");
        } catch (\Exception $e) {
            throw new \BadMethodCallException("Method {$method} does not exist on Jankx facade: " . $e->getMessage());
        }
    }

    public static function getEngineId() {
        return 'jankx';
    }
}
