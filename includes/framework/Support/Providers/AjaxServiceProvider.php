<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

/**
 * AJAX Service Provider
 *
 * Quản lý toàn bộ hệ thống Fast AJAX của Jankx Framework:
 *
 * - Đăng ký WordPress rewrite rules để route /jankx-ajax/* → ajax.php
 * - Autoload PSR-4 namespace Jankx\Ajax\* vào Composer
 * - Inject jankx_ajax_nonce vào frontend để client sử dụng
 * - Cung cấp hàm helper jankx_ajax_url() cho theme/extension
 *
 * Kiến trúc Fast AJAX (SHORTINIT + Fat-Free Framework):
 *   - Boot time mục tiêu: <10ms (bỏ qua toàn bộ plugins/theme)
 *   - URL pattern: /jankx-ajax/<ns>/<controller>/<action>[/<params>]
 *   - MVC structure: includes/framework/Ajax/{Router,Controller,Middleware,Response}
 *   - Extension tự đăng ký namespace qua: includes/framework/Ajax/routes.php
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
 */
class AjaxServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app): void
    {
        // Đăng ký PSR-4 namespace Jankx\Ajax\ vào Composer autoloader
        // (chạy cả trong SHORTINIT context)
        $this->registerAutoload();
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app): void
    {
        // Đăng ký rewrite rule WordPress để chuyển
        // /jankx-ajax/* → theme/ajax.php?jankx_fast_ajax=1
        add_action('init',             [$this, 'registerRewriteRules']);
        add_filter('query_vars',       [$this, 'registerQueryVars']);
        add_action('template_redirect', [$this, 'maybeDispatchFastAjax'], 1);

        // Flush rewrite rules 1 lần khi theme được kích hoạt
        add_action('after_switch_theme', [$this, 'flushRewriteRules']);

        // Inject nonce + JS config vào frontend
        add_action('wp_enqueue_scripts', [$this, 'enqueueAjaxConfig']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueAjaxConfig']);
    }

    // ── Rewrite Rules ─────────────────────────────────────────────────────────

    /**
     * Đăng ký WordPress rewrite rule:
     *   /jankx-ajax/(.*) → index.php?jankx_fast_ajax=$matches[1]
     */
    public function registerRewriteRules(): void
    {
        add_rewrite_rule(
            '^jankx-ajax/(.+)$',
            'index.php?jankx_fast_ajax=$matches[1]',
            'top'
        );
    }

    /**
     * Đăng ký query var để WP không lọc bỏ.
     */
    public function registerQueryVars(array $vars): array
    {
        $vars[] = 'jankx_fast_ajax';
        return $vars;
    }

    /**
     * Chặn WordPress template loading và dispatch sang ajax.php nếu có query var.
     */
    public function maybeDispatchFastAjax(): void
    {
        if (! get_query_var('jankx_fast_ajax')) {
            return;
        }

        // Reconstruct PATH_INFO cho F3 router
        $path = '/' . ltrim(get_query_var('jankx_fast_ajax'), '/');
        $_SERVER['REQUEST_URI'] = '/jankx-ajax' . $path;

        // Chạy file ajax.php (vẫn trong full WP context, không dùng SHORTINIT)
        // SHORTINIT chỉ được dùng khi gọi ajax.php trực tiếp qua web server
        $ajaxFile = get_template_directory() . '/ajax.php';
        if (file_exists($ajaxFile)) {
            // Khi chạy qua template_redirect, WP đã boot đầy đủ
            // Nên ta dùng F3 Router trực tiếp mà không cần SHORTINIT
            $this->dispatchViaF3($ajaxFile);
        }
    }

    /**
     * Dispatch F3 router khi chạy trong full WP context.
     */
    protected function dispatchViaF3(string $ajaxFile): void
    {
        $themeDir = get_template_directory();

        if (file_exists($themeDir . '/vendor/autoload.php')) {
            require_once $themeDir . '/vendor/autoload.php';
        }

        \Jankx\Ajax\Response\JsonResponse::startTimer();

        $router = new \Jankx\Ajax\Router\F3Router($themeDir);
        $router->dispatch();
        exit;
    }

    /**
     * Flush rewrite rules khi switch theme.
     */
    public function flushRewriteRules(): void
    {
        $this->registerRewriteRules();
        flush_rewrite_rules();
    }

    // ── Frontend JS Config ────────────────────────────────────────────────────

    /**
     * Inject cấu hình JS vào trang để client gọi Fast AJAX đúng endpoint.
     *
     * Dữ liệu được inject vào window.JankxAjax:
     * {
     *   url:   "https://example.com/jankx-ajax",
     *   nonce: "<wp_nonce>",
     *   mode:  "rewrite" | "direct"
     * }
     */
    public function enqueueAjaxConfig(): void
    {
        $config = [
            'url'   => home_url('/jankx-ajax'),
            'nonce' => wp_create_nonce('jankx_ajax'),
            'mode'  => 'rewrite',
        ];

        // Fallback: nếu rewrite chưa được flush, dùng direct URL đến ajax.php
        if (! $this->isRewriteActive()) {
            $config['url']  = get_template_directory_uri() . '/ajax.php/jankx-ajax';
            $config['mode'] = 'direct';
        }

        wp_add_inline_script(
            'jquery-core',
            'window.JankxAjax = ' . wp_json_encode($config) . ';',
            'before'
        );
    }

    /**
     * Kiểm tra xem rewrite rule đã active chưa.
     */
    protected function isRewriteActive(): bool
    {
        global $wp_rewrite;
        return $wp_rewrite && $wp_rewrite->using_permalinks();
    }

    // ── Autoload ──────────────────────────────────────────────────────────────

    /**
     * Đăng ký PSR-4 autoload cho namespace Jankx\Ajax\
     * Compatible với cả SHORTINIT và full WP context.
     */
    protected function registerAutoload(): void
    {
        $ajaxDir = get_template_directory() . '/includes/framework/Ajax';

        if (! is_dir($ajaxDir)) {
            return;
        }

        spl_autoload_register(function (string $class) use ($ajaxDir): void {
            $prefix = 'Jankx\\Ajax\\';
            if (strpos($class, $prefix) !== 0) {
                return;
            }

            $relative = substr($class, strlen($prefix));
            $file     = $ajaxDir . '/' . str_replace('\\', '/', $relative) . '.php';

            if (file_exists($file)) {
                require_once $file;
            }
        });
    }
}

