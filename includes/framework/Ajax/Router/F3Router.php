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
        $template = get_option('template');
        $stylesheet = get_option('stylesheet');
        $themesDir = dirname($this->themeDir);
        
        $dirs = [$this->themeDir];
        if ($template !== $stylesheet && $stylesheet) {
            $dirs[] = $themesDir . '/' . $stylesheet;
        }

        foreach (array_unique($dirs) as $dir) {
            $manifests = glob($dir . '/extensions/*/manifest.json');
            if (is_array($manifests)) {
                foreach ($manifests as $manifest) {
                    $this->registerExtensionAutoload(dirname($manifest));
                    $content = file_get_contents($manifest);
                    $data = json_decode($content, true);
                    if (is_array($data) && !empty($data['ajax_slug']) && !empty($data['ajax_namespace'])) {
                        $this->addNamespace($data['ajax_slug'], $data['ajax_namespace']);
                    }
                }
            }
        }
    }

    /**
     * SHORTINIT không chạy extension bootstrap, nên tự đăng ký PSR-4
     */
    protected function registerExtensionAutoload(string $extensionDir): void
    {
        $composerFile = $extensionDir . '/composer.json';
        if (! is_file($composerFile)) {
            return;
        }

        $composer = json_decode((string) file_get_contents($composerFile), true);
        $psr4     = is_array($composer) && isset($composer['autoload']['psr-4'])
            ? (array) $composer['autoload']['psr-4']
            : [];

        foreach ($psr4 as $prefix => $relPaths) {
            foreach ((array) $relPaths as $relPath) {
                $baseDir   = $extensionDir . '/' . trim((string) $relPath, '/') . '/';
                $prefixLen = strlen((string) $prefix);

                spl_autoload_register(function (string $class) use ($prefix, $baseDir, $prefixLen): void {
                    if (strncmp($class, $prefix, $prefixLen) !== 0) {
                        return;
                    }

                    $file = $baseDir . str_replace('\\', '/', substr($class, $prefixLen)) . '.php';
                    if (is_file($file)) {
                        require_once $file;
                    }
                });
            }
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
    public function dispatch(\Base $f3 = null): void
    {
        if ($f3 === null) {
            $this->f3->run();
            return;
        }
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
