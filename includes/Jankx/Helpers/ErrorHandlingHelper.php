<?php

namespace Jankx\Helpers;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Jankx\Facades\Logger;

/**
 * Error Handling Helper
 *
 * Manages error handling in a DRY way
 *
 * @package Jankx\Helpers
 * @since 2.0.0
 */
class ErrorHandlingHelper
{
    /**
     * Handle bootstrapper errors
     * @since 2.0.0
     */
    public static function handleBootstrapperError(\Exception $e, string $bootstrapperName): void
    {
        Logger::error("Jankx {$bootstrapperName} error: " . $e->getMessage());
    }

    /**
     * Handle service resolution errors
     * @since 2.0.0
     */
    public static function handleServiceResolutionError(\Exception $e, string $serviceName, string $context = ''): void
    {
        $message = "Failed to resolve service: {$serviceName}";
        if ($context) {
            $message .= " in context: {$context}";
        }

        Logger::error($message, [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);
    }

    /**
     * Handle AJAX errors
     * @since 2.0.0
     */
    public static function handleAjaxError(\Exception $e, string $action): void
    {
        Logger::error("AJAX {$action} failed", [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);
    }

    /**
     * Handle CLI errors
     * @since 2.0.0
     */
    public static function handleCLIError(\Exception $e, string $command = ''): void
    {
        $message = "Jankx CLI Error";
        if ($command) {
            $message .= " in {$command}";
        }
        $message .= ": " . $e->getMessage();

        Logger::error($message);
    }

    /**
     * Handle debug errors
     * @since 2.0.0
     */
    public static function handleDebugError(\Exception $e, string $operation): void
    {
        Logger::error("Debug {$operation} failed: " . $e->getMessage());
    }

    /**
     * Safe container resolution with error handling
     * @since 2.0.0
     */
    public static function safeResolve($container, string $serviceName, callable $fallback = null)
    {
        try {
            if ($container->bound($serviceName)) {
                return $container->make($serviceName);
            }

            if ($fallback) {
                return $fallback();
            }

            return null;
        } catch (\Exception $e) {
            self::handleServiceResolutionError($e, $serviceName);
            return null;
        }
    }

    /**
     * Safe action execution with error handling
     * @since 2.0.0
     */
    public static function safeExecute(callable $callback, string $operation, callable $fallback = null)
    {
        try {
            return $callback();
        } catch (\Exception $e) {
            Logger::error("{$operation} failed: " . $e->getMessage());

            if ($fallback) {
                return $fallback($e);
            }

            return null;
        }
    }
}
