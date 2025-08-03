<?php

namespace Jankx\Http;

/**
 * Simple HTTP Request Class for Jankx Framework
 *
 * This class provides basic request detection using WordPress native functions
 * without depending on external HTTP libraries.
 *
 * @package Jankx\Http
 * @since 1.0.0
 */
class Request
{
    /**
     * Request type constants
     */
    const TYPE_FRONTEND = 'frontend';
    const TYPE_ADMIN = 'admin';
    const TYPE_ADMIN_AJAX = 'admin_ajax';
    const TYPE_REST_API = 'rest_api';
    const TYPE_WP_CLI = 'wp_cli';
    const TYPE_WP_CRON = 'wp_cron';

    /**
     * Create a new request instance
     *
     * @return static
     */
    public static function capture()
    {
        return new static();
    }

    /**
     * Get the request type
     *
     * @return string
     */
    public function getRequestType()
    {
        // Check WP CLI
        if (defined('WP_CLI') && WP_CLI) {
            return self::TYPE_WP_CLI;
        }

        // Check WP Cron
        if (defined('DOING_CRON') && DOING_CRON) {
            return self::TYPE_WP_CRON;
        }

        // Check REST API
        if (defined('REST_REQUEST') && REST_REQUEST) {
            return self::TYPE_REST_API;
        }

        // Check Admin AJAX
        if (wp_doing_ajax()) {
            return self::TYPE_ADMIN_AJAX;
        }

        // Check Admin Dashboard
        if (is_admin()) {
            return self::TYPE_ADMIN;
        }

        // Default to frontend
        return self::TYPE_FRONTEND;
    }

    /**
     * Get the HTTP method
     *
     * @return string
     */
    public function getMethod()
    {
        return $_SERVER['REQUEST_METHOD'] ?? 'GET';
    }

    /**
     * Get the request path
     *
     * @return string
     */
    public function getPathInfo()
    {
        $path = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($path, PHP_URL_PATH);

        return $path ?: '/';
    }

    /**
     * Get a request parameter
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get($key, $default = null)
    {
        return $_REQUEST[$key] ?? $default;
    }

    /**
     * Get a GET parameter
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function getQuery($key, $default = null)
    {
        return $_GET[$key] ?? $default;
    }

    /**
     * Get a POST parameter
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function getPost($key, $default = null)
    {
        return $_POST[$key] ?? $default;
    }

    /**
     * Check if request is AJAX
     *
     * @return bool
     */
    public function isAjax()
    {
        return wp_doing_ajax();
    }

    /**
     * Check if request is admin
     *
     * @return bool
     */
    public function isAdmin()
    {
        return is_admin();
    }

    /**
     * Check if request is REST API
     *
     * @return bool
     */
    public function isRestApi()
    {
        return defined('REST_REQUEST') && REST_REQUEST;
    }

    /**
     * Check if request is WP CLI
     *
     * @return bool
     */
    public function isWpCli()
    {
        return defined('WP_CLI') && WP_CLI;
    }

    /**
     * Check if request is WP Cron
     *
     * @return bool
     */
    public function isWpCron()
    {
        return defined('DOING_CRON') && DOING_CRON;
    }

    /**
     * Get all request data
     *
     * @return array
     */
    public function all()
    {
        return $_REQUEST;
    }

    /**
     * Get all GET data
     *
     * @return array
     */
    public function query()
    {
        return $_GET;
    }

    /**
     * Get all POST data
     *
     * @return array
     */
    public function post()
    {
        return $_POST;
    }

    /**
     * Get request headers
     *
     * @return array
     */
    public function headers()
    {
        $headers = [];

        foreach ($_SERVER as $key => $value) {
            if (strpos($key, 'HTTP_') === 0) {
                $header = str_replace('_', '-', strtolower(substr($key, 5)));
                $headers[$header] = $value;
            }
        }

        return $headers;
    }

    /**
     * Get a specific header
     *
     * @param string $name
     * @param mixed $default
     * @return mixed
     */
    public function header($name, $default = null)
    {
        $headers = $this->headers();
        $name = strtolower($name);

        return $headers[$name] ?? $default;
    }
}