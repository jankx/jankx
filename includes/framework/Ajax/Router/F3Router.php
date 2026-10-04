<?php

namespace Jankx\Ajax\Router;

use Base;
use Jankx\Ajax\Middleware\NonceMiddleware;
use Jankx\Ajax\Middleware\RateLimitMiddleware;
use Jankx\Ajax\Response\JsonResponse;

/**
 * F3Router – Fat-Free Framework Router cho Jankx Fast AJAX.
 *
 * Route pattern:  /jankx-ajax/@controller/@action[/@params]
 *
 * Mọi Controller phải extend AbstractController.
 * Middleware được chạy tuần tự trước khi dispatch đến controller.
 *
 * @package Jankx\Ajax\Router
 */
class F3Router
{
    protected Base  $f3;
    protected string $themeDir;

    /** @var array Namespace map: tên slug -> PHP namespace */
    protected array $namespaces = [
        'jankx' => 'Jankx\\Ajax\\Controller\\',
    ];

    public function __construct(string $themeDir)
    {
        $this->themeDir = $themeDir;
        $this->f3       = Base::instance();
        $this->configure();
        $this->registerRoutes();
    }

    /**
     * Cấu hình F3 cơ bản.
     */
    protected function configure(): void
    {
        $this->f3->set('DEBUG', 0);
        $this->f3->set('ONERROR', function (Base $f3) {
            header('Content-Type: application/json; charset=utf-8');
            http_response_code((int) $f3->get('ERROR.code') ?: 500);
            echo JsonResponse::error(
                $f3->get('ERROR.text') ?: 'Internal Server Error',
                (int) $f3->get('ERROR.code') ?: 500
            )->toJson();
        });
    }

    /**
     * Đăng ký routes.
     *
     * Pattern:
     *   GET|POST  /jankx-ajax/@ns/@controller/@action
     *   GET|POST  /jankx-ajax/@ns/@controller/@action/@params
     *
     * @ns  = namespace slug (ví dụ: 'jankx', tên extension...)
     */
    protected function registerRoutes(): void
    {
        $handler = [$this, 'dispatch'];

        // Route chính
        $this->f3->route('GET|POST /jankx-ajax/@ns/@controller/@action',          $handler);
        $this->f3->route('GET|POST /jankx-ajax/@ns/@controller/@action/@params',   $handler);

        // Hook để plugin/extension đăng ký route tùy chỉnh
        // Không gọi do_action vì SHORTINIT, nên dùng file config tĩnh
        $this->loadExternalRoutes();
    }

    /**
     * Nạp route tùy chỉnh từ các extension/plugin.
     * Mỗi extension tạo file: `<extension>/ajax-routes.php`
     * và gọi: $router->addNamespace(slug, namespace)
     */
    protected function loadExternalRoutes(): void
    {
        // Cho phép extension đăng ký namespace thêm qua file config
        $routeConfig = $this->themeDir . '/includes/framework/Ajax/routes.php';
        if (file_exists($routeConfig)) {
            $router = $this;
            require $routeConfig;
        }
    }

    /**
     * Thêm namespace mới (dùng trong routes.php của extension).
     */
    public function addNamespace(string $slug, string $phpNamespace): void
    {
        $this->namespaces[$slug] = rtrim($phpNamespace, '\\') . '\\';
    }

    /**
     * Dispatch request đến đúng Controller::action().
     */
    public function dispatch(Base $f3): void
    {
        $ns         = strtolower($f3->get('PARAMS.ns')         ?? 'jankx');
        $controller = $f3->get('PARAMS.controller') ?? '';
        $action     = $f3->get('PARAMS.action')     ?? 'index';
        $params     = $f3->get('PARAMS.params')     ?? '';

        // -- Resolve namespace
        if (! isset($this->namespaces[$ns])) {
            JsonResponse::error("Unknown namespace: $ns", 404)->send();
            return;
        }

        // -- Resolve controller class
        $class = $this->namespaces[$ns] . $this->toPascalCase($controller) . 'Controller';

        if (! class_exists($class)) {
            JsonResponse::error("Controller not found: $controller", 404)->send();
            return;
        }

        $instance = new $class($f3);

        // -- Middleware pipeline
        $middlewares = $instance->getMiddlewares();
        foreach ($middlewares as $middleware) {
            if (! (new $middleware())->handle($f3)) {
                return;  // Middleware đã tự gửi response lỗi
            }
        }

        // -- Dispatch action
        $method = lcfirst($this->toPascalCase($action));

        if (! method_exists($instance, $method)) {
            JsonResponse::error("Action not found: $action", 404)->send();
            return;
        }

        $instance->$method($params !== '' ? explode('/', $params) : []);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Chuyển slug (kebab-case) sang PascalCase.
     * Ví dụ: "tour-booking" → "TourBooking"
     */
    protected function toPascalCase(string $slug): string
    {
        return str_replace(' ', '', ucwords(str_replace(['-', '_'], ' ', $slug)));
    }
}
