<?php

namespace Jankx\Context;

use Illuminate\Container\Container;

/**
 * Contextual Service Registry
 *
 * Manages service registration and loading based on application context
 *
 * @package Jankx\Context
 */
class ContextualServiceRegistry
{
    const SHARED = 'shared';
    const ADMIN = 'admin';
    const FRONTEND = 'frontend';
    const API = 'api';
    const CLI = 'cli';
    const GUTENBERG = 'gutenberg';
    const WOOCOMMERCE = 'woocommerce';

    private static $registry = [];
    private static $deferred = [];
    private static $loaded = [];

    /**
     * Register a service for specific context
     */
    public static function register(string $context, string $serviceClass, array $options = []): void
    {
        if (!isset(self::$registry[$context])) {
            self::$registry[$context] = [];
        }

        self::$registry[$context][] = [
            'class' => $serviceClass,
            'options' => $options,
            'deferred' => $options['deferred'] ?? true,
            'priority' => $options['priority'] ?? 10,
        ];
    }

    /**
     * Register multiple services for a context
     */
    public static function registerMultiple(string $context, array $services, array $options = []): void
    {
        foreach ($services as $service) {
            self::register($context, $service, $options);
        }
    }

    /**
     * Register a deferred service
     */
    public static function defer(string $context, callable $factory, array $options = []): void
    {
        if (!isset(self::$deferred[$context])) {
            self::$deferred[$context] = [];
        }

        self::$deferred[$context][] = [
            'factory' => $factory,
            'options' => $options,
            'priority' => $options['priority'] ?? 10,
        ];
    }

    /**
     * Load services for current context
     */
    public static function loadForContext(Container $container, string $context): void
    {
        if (isset(self::$loaded[$context])) {
            return; // Already loaded
        }

        // Load immediate services
        if (isset(self::$registry[$context])) {
            foreach (self::$registry[$context] as $service) {
                if (!$service['deferred']) {
                    $container->singleton($service['class']);
                }
            }
        }

        // Mark as loaded
        self::$loaded[$context] = true;
    }

    /**
     * Resolve deferred service
     */
    public static function resolve(Container $container, string $context, string $serviceName): mixed
    {
        // Check if service is already resolved
        if ($container->bound($serviceName)) {
            return $container->make($serviceName);
        }

        // Load deferred services for context
        if (isset(self::$deferred[$context])) {
            foreach (self::$deferred[$context] as $deferred) {
                $deferred['factory']($container);
            }
        }

        // Try to resolve again
        if ($container->bound($serviceName)) {
            return $container->make($serviceName);
        }

        throw new \Exception("Service {$serviceName} not found in context {$context}");
    }

    /**
     * Get current application context
     */
    public static function getCurrentContext(): string
    {
        if (defined('WP_CLI') && WP_CLI) {
            return self::CLI;
        }

        if (defined('REST_REQUEST') && REST_REQUEST) {
            return self::API;
        }

        if (wp_doing_ajax() && self::isGutenbergAjax()) {
            return self::GUTENBERG;
        }

        if (is_admin()) {
            return self::ADMIN;
        }

        if (class_exists('WooCommerce') && self::isWooCommercePage()) {
            return self::WOOCOMMERCE;
        }

        return self::FRONTEND;
    }

    /**
     * Check if current request is Gutenberg AJAX
     */
    private static function isGutenbergAjax(): bool
    {
        $action = $_POST['action'] ?? $_GET['action'] ?? '';
        return strpos($action, 'jankx/gutenberg') === 0;
    }

    /**
     * Check if current page is WooCommerce page
     */
    private static function isWooCommercePage(): bool
    {
        return function_exists('is_woocommerce') && is_woocommerce();
    }

    /**
     * Get all registered services for a context
     */
    public static function getServicesForContext(string $context): array
    {
        $services = [];

        if (isset(self::$registry[$context])) {
            foreach (self::$registry[$context] as $service) {
                $services[] = $service['class'];
            }
        }

        return $services;
    }

    /**
     * Get all deferred services for a context
     */
    public static function getDeferredServicesForContext(string $context): array
    {
        return self::$deferred[$context] ?? [];
    }

    /**
     * Check if context is loaded
     */
    public static function isContextLoaded(string $context): bool
    {
        return isset(self::$loaded[$context]);
    }

    /**
     * Get all loaded contexts
     */
    public static function getLoadedContexts(): array
    {
        return array_keys(self::$loaded);
    }

    /**
     * Clear loaded contexts (for testing)
     */
    public static function clearLoadedContexts(): void
    {
        self::$loaded = [];
    }

    /**
     * Get registry statistics
     */
    public static function getStats(): array
    {
        $stats = [];

        foreach (self::$registry as $context => $services) {
            $stats[$context] = [
                'total_services' => count($services),
                'deferred_services' => count(array_filter($services, function($s) { return $s['deferred']; })),
                'immediate_services' => count(array_filter($services, function($s) { return !$s['deferred']; })),
                'loaded' => isset(self::$loaded[$context]),
            ];
        }

        return $stats;
    }
}
