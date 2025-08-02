<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Foundation\Application;

class HandleExceptions
{
    /**
     * Bootstrap the given application.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function bootstrap(Application $app)
    {
        // Set error reporting
        error_reporting(E_ALL);
        ini_set('display_errors', 0);

        // Set exception handler
        set_exception_handler(function ($exception) {
            $this->handleException($exception);
        });

        // Set error handler
        set_error_handler(function ($level, $message, $file, $line) {
            if (error_reporting() & $level) {
                throw new \ErrorException($message, 0, $level, $file, $line);
            }
        });
    }

    /**
     * Handle an uncaught exception.
     *
     * @param  \Throwable  $exception
     * @return void
     */
    protected function handleException($exception)
    {
        // Log the exception
        if (defined('JANKX_LOG_ALL') || defined('WP_DEBUG') && WP_DEBUG) {
            error_log('Jankx Exception: ' . $exception->getMessage());
        }

        // In production, show a generic error
        if (!defined('WP_DEBUG') || !WP_DEBUG) {
            http_response_code(500);
            echo 'An error occurred.';
            exit;
        }

        // In debug mode, show the exception
        throw $exception;
    }
}
