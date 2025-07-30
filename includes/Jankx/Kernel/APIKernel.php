<?php

namespace Jankx\Kernel;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Jankx\Contracts\KernelInterface;
use Jankx\Bootstrappers\API\APIBootstrapper;
use Jankx\Bootstrappers\Global\ThemeBootstrapper;
use Jankx\API\APIManager;
use Jankx\API\Endpoints\PostsEndpoint;
use Jankx\API\Endpoints\PagesEndpoint;
use Jankx\API\Endpoints\CategoriesEndpoint;
use Jankx\API\Endpoints\TagsEndpoint;
use Jankx\API\Endpoints\UsersEndpoint;
use Jankx\API\Endpoints\SettingsEndpoint;

/**
 * API Kernel
 *
 * Handles API-specific features and endpoints
 *
 * @package Jankx\Kernel
 * @since 2.0.0
 */
class APIKernel extends Kernel implements KernelInterface
{
    /**
     * Get kernel type
     * @since 2.0.0
     */
    public function getKernelType(): string
    {
        return 'api';
    }

    /**
     * Register bootstrappers
     * @since 2.0.0
     */
    protected function registerBootstrappers(): void
    {
        parent::registerBootstrappers();

        // Theme bootstrapper (highest priority)
        $this->addBootstrapper(ThemeBootstrapper::class);

        // API bootstrapper
        $this->addBootstrapper(APIBootstrapper::class);

        // Allow child themes to add custom bootstrappers
        $customBootstrappers = apply_filters('jankx/api/bootstrappers', []);
        foreach ($customBootstrappers as $bootstrapper) {
            $this->addBootstrapper($bootstrapper);
        }
    }

    /**
     * Register services
     * @since 2.0.0
     */
    protected function registerServices(): void
    {
        parent::registerServices();

        // Register APIServiceProvider
        $this->addServiceProvider(\Jankx\Providers\APIServiceProvider::class);
    }

    /**
     * Register hooks
     * @since 2.0.0
     */
    protected function registerHooks(): void
    {
        $this->hooks = [
            'rest_api_init' => ['Jankx\Kernel\APIKernel', 'initializeAPI'],
            'wp_ajax_jankx_api' => ['Jankx\Kernel\APIKernel', 'handleAjaxRequest'],
            'wp_ajax_nopriv_jankx_api' => ['Jankx\Kernel\APIKernel', 'handleAjaxRequest'],
        ];
    }

    /**
     * Register filters
     * @since 2.0.0
     */
    protected function registerFilters(): void
    {
        $this->filters = [
            'jankx_api_response' => ['Jankx\Kernel\APIKernel', 'filterAPIResponse'],
        ];
    }

    /**
     * Register API endpoints
     * @since 2.0.0
     */
    public function registerAPIEndpoints(): void
    {
        $api_manager = $this->container->make(APIManager::class);

        // Register core endpoints
        $api_manager->registerEndpoint('posts', PostsEndpoint::class);
        $api_manager->registerEndpoint('pages', PagesEndpoint::class);
        $api_manager->registerEndpoint('categories', CategoriesEndpoint::class);
        $api_manager->registerEndpoint('tags', TagsEndpoint::class);
        $api_manager->registerEndpoint('users', UsersEndpoint::class);
        $api_manager->registerEndpoint('settings', SettingsEndpoint::class);

        // Allow child themes to register custom endpoints
        do_action('jankx/api/register_endpoints', $api_manager);
    }

    /**
     * Add CORS headers
     * @since 2.0.0
     */
    public function addCORSHeaders(): void
    {
        // Allow cross-origin requests
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }

    /**
     * Authenticate API
     * @since 2.0.0
     */
    public function authenticateAPI($result): mixed
    {
        // Skip authentication for public endpoints
        $public_endpoints = apply_filters('jankx/api/public_endpoints', [
            'posts',
            'pages',
            'categories',
            'tags'
        ]);

        $current_endpoint = $this->getCurrentEndpoint();
        if (in_array($current_endpoint, $public_endpoints)) {
            return true;
        }

        // Check for API key
        $api_key = $this->getAPIKey();
        if (!$api_key) {
            return new \WP_Error(
                'jankx/api/no_key',
                __('API key is required', 'jankx'),
                ['status' => 401]
            );
        }

        // Validate API key
        if (!$this->validateAPIKey($api_key)) {
            return new \WP_Error(
                'jankx/api/invalid_key',
                __('Invalid API key', 'jankx'),
                ['status' => 401]
            );
        }

        return true;
    }

    /**
     * Check rate limit
     * @since 2.0.0
     */
    public function checkRateLimit($result): mixed
    {
        if (is_wp_error($result)) {
            return $result;
        }

        $ip = $this->getClientIP();
        $endpoint = $this->getCurrentEndpoint();

        // Check rate limit
        if ($this->isRateLimited($ip, $endpoint)) {
            return new \WP_Error(
                'jankx/api/rate_limited',
                __('Rate limit exceeded', 'jankx'),
                ['status' => 429]
            );
        }

        // Update rate limit counter
        $this->updateRateLimit($ip, $endpoint);

        return $result;
    }

    /**
     * Log API request
     * @since 2.0.0
     */
    public function logAPIRequest($response, $handler, $request): void
    {
        $log_data = [
            'timestamp' => current_time('mysql'),
            'method' => $_SERVER['REQUEST_METHOD'],
            'endpoint' => $this->getCurrentEndpoint(),
            'ip' => $this->getClientIP(),
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'response_code' => wp_remote_retrieve_response_code($response),
        ];

        // Log to database or file
        $this->logToDatabase($log_data);
    }

    /**
     * Register custom endpoints
     * @since 2.0.0
     */
    public function registerCustomEndpoints($api_manager): void
    {
        // Register theme-specific endpoints here
        // Example: $api_manager->registerEndpoint('custom', CustomEndpoint::class);
    }

    /**
     * Format API response
     * @since 2.0.0
     */
    public function formatAPIResponse($response): array
    {
        $formatted = [
            'success' => true,
            'data' => $response,
            'timestamp' => current_time('timestamp'),
            'version' => \Jankx\Jankx::getFrameworkVersion(),
        ];

        return apply_filters('jankx/api/response_formatted', $formatted);
    }

    /**
     * Format API error
     * @since 2.0.0
     */
    public function formatAPIError($error): array
    {
        $formatted = [
            'success' => false,
            'error' => [
                'code' => $error->get_error_code(),
                'message' => $error->get_error_message(),
                'data' => $error->get_error_data(),
            ],
            'timestamp' => current_time('timestamp'),
            'version' => \Jankx\Jankx::getFrameworkVersion(),
        ];

        return apply_filters('jankx/api/error_formatted', $formatted);
    }

    /**
     * Check API permissions
     * @since 2.0.0
     */
    public function checkAPIPermissions($permissions, $endpoint): bool
    {
        // Default permissions
        $default_permissions = [
            'posts' => 'read',
            'pages' => 'read',
            'categories' => 'read',
            'tags' => 'read',
            'users' => 'read',
            'settings' => 'manage_options',
        ];

        $required_permission = $default_permissions[$endpoint] ?? 'read';
        return current_user_can($required_permission);
    }

    /**
     * Get current endpoint
     * @since 2.0.0
     */
    protected function getCurrentEndpoint(): string
    {
        $request_uri = $_SERVER['REQUEST_URI'] ?? '';
        $path = parse_url($request_uri, PHP_URL_PATH);
        $path_parts = explode('/', trim($path, '/'));

        // Find 'wp-json' in path
        $wp_json_index = array_search('wp-json', $path_parts);
        if ($wp_json_index !== false && isset($path_parts[$wp_json_index + 2])) {
            return $path_parts[$wp_json_index + 2];
        }

        return '';
    }

    /**
     * Get API key from request
     * @since 2.0.0
     */
    protected function getAPIKey(): ?string
    {
        // Check Authorization header
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
            return $matches[1];
        }

        // Check X-API-Key header
        $api_key_header = $_SERVER['HTTP_X_API_KEY'] ?? '';
        if (!empty($api_key_header)) {
            return $api_key_header;
        }

        // Check query parameter
        return sanitize_text_field($_GET['api_key']) ?? null;
    }

    /**
     * Validate API key
     * @since 2.0.0
     */
    protected function validateAPIKey(string $api_key): bool
    {
        $valid_keys = apply_filters('jankx/api/valid_keys', []);
        return in_array($api_key, $valid_keys);
    }

    /**
     * Get client IP
     * @since 2.0.0
     */
    protected function getClientIP(): string
    {
        $ip_keys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];

        foreach ($ip_keys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                        return $ip;
                    }
                }
            }
        }

        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }

    /**
     * Check if request is rate limited
     * @since 2.0.0
     */
    protected function isRateLimited(string $ip, string $endpoint): bool
    {
        $rate_limit_key = "jankx/api/rate_limit_{$ip}_{$endpoint}";
        $rate_limit = get_transient($rate_limit_key);

        if (!$rate_limit) {
            return false;
        }

        $max_requests = apply_filters('jankx/api/rate_limit_max', 100);
        $time_window = apply_filters('jankx/api/rate_limit_window', 3600); // 1 hour

        return $rate_limit['count'] >= $max_requests;
    }

    /**
     * Update rate limit counter
     * @since 2.0.0
     */
    protected function updateRateLimit(string $ip, string $endpoint): void
    {
        $rate_limit_key = "jankx/api/rate_limit_{$ip}_{$endpoint}";
        $rate_limit = get_transient($rate_limit_key);

        if (!$rate_limit) {
            $rate_limit = [
                'count' => 1,
                'window_start' => time(),
            ];
        } else {
            $rate_limit['count']++;
        }

        set_transient($rate_limit_key, $rate_limit, 3600); // 1 hour
    }

    /**
     * Log to database
     * @since 2.0.0
     */
    protected function logToDatabase(array $log_data): void
    {
        // Log to WordPress options or custom table
        $logs = get_option('jankx/api/logs', []);
        $logs[] = $log_data;

        // Keep only last 1000 logs
        if (count($logs) > 1000) {
            $logs = array_slice($logs, -1000);
        }

        update_option('jankx/api/logs', $logs);
    }
}
