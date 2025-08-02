<?php

namespace Jankx\Http;

use Symfony\Component\HttpFoundation\Request as SymfonyRequest;
use Jankx\Helper\Environment;

class Request extends SymfonyRequest
{
        /**
     * Capture the current request and detect its type.
     *
     * @return \Jankx\Http\Request
     */
    public static function capture()
    {
        $request = static::createFromGlobalsInternal();

        // Detect request type and set it as a property
        $request->requestType = static::detectRequestType($request);

        return $request;
    }

    /**
     * Create a new request from the global variables.
     *
     * @return \Jankx\Http\Request
     */
    protected static function createFromGlobalsInternal()
    {
        $request = new static(
            $_GET,
            $_POST,
            [],
            $_COOKIE,
            $_FILES,
            $_SERVER
        );

        if (
            $request->headers->get('CONTENT_TYPE') === 'application/x-www-form-urlencoded'
            && in_array(strtoupper($request->server->get('REQUEST_METHOD', 'GET')), ['PUT', 'DELETE', 'PATCH'])
        ) {
            parse_str($request->getContent(), $data);
            $request->request = new \Symfony\Component\HttpFoundation\ParameterBag($data);
        }

        return $request;
    }

    /**
     * Get the detected request type.
     *
     * @return string
     */
    public function getRequestType()
    {
        return $this->requestType ?? 'frontend';
    }

    /**
     * Detect the type of WordPress request.
     *
     * @param  \Jankx\Http\Request  $request
     * @return string
     */
    protected static function detectRequestType(Request $request)
    {
        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Detecting request type using WordPress functions');
        }

        // Check for admin ajax
        if (static::isAdminAjax($request)) {
            if (Environment::isDebugLog()) {
                error_log('[JANKX DEBUG] Detected as admin_ajax');
            }
            return 'admin_ajax';
        }

        // Check for REST API
        if (static::isRestApi($request)) {
            if (Environment::isDebugLog()) {
                error_log('[JANKX DEBUG] Detected as rest_api');
            }
            return 'rest_api';
        }

        // Check for admin dashboard
        if (static::isAdminDashboard($request)) {
            if (Environment::isDebugLog()) {
                error_log('[JANKX DEBUG] Detected as dashboard');
            }
            return 'dashboard';
        }

        // Default to frontend
        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Detected as frontend (default)');
        }
        return 'frontend';
    }

    /**
     * Check if the request is a WordPress admin ajax request.
     *
     * @param  \Jankx\Http\Request  $request
     * @return bool
     */
    protected static function isAdminAjax(Request $request)
    {
        // Check if this is an admin-ajax.php request
        return defined('DOING_AJAX') && DOING_AJAX && is_admin();
    }

    /**
     * Check if the request is a WordPress REST API request.
     *
     * @param  \Jankx\Http\Request  $request
     * @return bool
     */
    protected static function isRestApi(Request $request)
    {
        // Check if this is a REST API request
        return defined('REST_REQUEST') && REST_REQUEST;
    }

    /**
     * Check if the request is a WordPress admin dashboard request.
     *
     * @param  \Jankx\Http\Request  $request
     * @return bool
     */
    protected static function isAdminDashboard(Request $request)
    {
        // Check if this is an admin request using WordPress function
        return is_admin() && !defined('DOING_AJAX');
    }
}
