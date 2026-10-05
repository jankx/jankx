<?php

namespace Jankx\Ajax\Router;

use flight\Engine;
use Jankx\Ajax\Response\JsonResponse;

/**
 * FlightRouter – Flight PHP Router cho Jankx Fast AJAX.
 *
 * Route pattern:  /jankx-ajax/@ns/@controller/@action[/@params]
 *
 * Mọi Controller phải extend AbstractController.
 * Middleware được chạy tuần tự trước khi dispatch đến controller.
 *
 * @package Jankx\Ajax\Router
 */
class FlightRouter
{
    protected Engine $flight;
    protected string $themeDir;

    /** @var array Namespace map: tên slug -> PHP namespace */
    protected array $namespaces = [
        'jankx' => 'Jankx\\Ajax\\Controller\\',
    ];

    public function __construct(string $themeDir)
    {
        $this->themeDir = $themeDir;
        $this->flight   = new Engine();
        $this->configure();
        $this->registerRoutes();
    }

    /**
     * Cấu hình Flight cơ bản.
     */
    protected function configure(): void
    {
        $self = $this;

        $this->flight->map('error', function (\Throwable $ex) {
            if (! headers_sent()) {
                header('Content-Type: application/json; charset=utf-8');
                http_response_code($ex->getCode() ?: 500);
            }
            echo JsonResponse::error(
                $ex->getMessage() ?: 'Internal Server Error',
                $ex->getCode() ?: 500
            )->toJson();
            exit;
        });

        $this->flight->map('notFound', function () {
            if (! headers_sent()) {
                header('Content-Type: application/json; charset=utf-8');
                http_response_code(404);
            }
            echo JsonResponse::error('Not Found', 404)->toJson();
            exit;
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
        $self = $this;

        $handler = function (string $ns, string $controller, string $action, string $params = '') use ($self): void {
            $self->handleRequest($ns, $controller, $action, $params);
        };

        $this->flight->route('GET|POST /jankx-ajax/@ns/@controller/@action', $handler);
        $this->flight->route('GET|POST /jankx-ajax/@ns/@controller/@action/@params', $handler);

        // Nạp namespace từ extension/plugin (qua manifest.json)
        $this->loadExternalRoutes();
    }

    /**
     * Nạp route tùy chỉnh từ các extension/plugin.
     * Mỗi extension khai báo ajax_slug + ajax_namespace bên trong manifest.json.
     */
    protected function loadExternalRoutes(): void
    {
        $themesDir = dirname($this->themeDir);
        $dirs      = [$this->themeDir];

        // Thêm child theme nếu có (chỉ khi full WP đã boot)
        if (function_exists('get_option')) {
            $template   = get_option('template');
            $stylesheet = get_option('stylesheet');
            if ($template !== $stylesheet && $stylesheet) {
                $dirs[] = $themesDir . '/' . $stylesheet;
            }
        }

        foreach (array_unique($dirs) as $dir) {
            $manifests = glob($dir . '/extensions/*/manifest.json');
            if (! is_array($manifests)) {
                continue;
            }
            foreach ($manifests as $manifest) {
                $this->registerExtensionAutoload(dirname($manifest));
                $content = file_get_contents($manifest);
                $data    = json_decode($content, true);
                if (is_array($data) && ! empty($data['ajax_slug']) && ! empty($data['ajax_namespace'])) {
                    $this->addNamespace($data['ajax_slug'], $data['ajax_namespace']);
                }
            }
        }
    }

    /**
     * SHORTINIT không chạy extension bootstrap, nên tự đăng ký PSR-4
     * dựa vào composer.json của từng extension.
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
     * Thêm namespace mới (gọi từ routes.php hoặc manifest.json của extension).
     */
    public function addNamespace(string $slug, string $phpNamespace): void
    {
        $this->namespaces[$slug] = rtrim($phpNamespace, '\\') . '\\';
    }

    /**
     * Xử lý request: resolve namespace → controller → middleware → action.
     */
    public function handleRequest(string $ns, string $controller, string $action, string $params = ''): void
    {
        $ns = strtolower($ns);

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

        $instance = new $class($this->flight->request());

        // -- Middleware pipeline
        $middlewares = $instance->getMiddlewares();
        foreach ($middlewares as $middleware) {
            if (! (new $middleware())->handle($this->flight->request())) {
                return; // Middleware đã tự gửi response lỗi
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

    /**
     * Khởi động Flight engine và dispatch request.
     */
    public function dispatch(): void
    {
        $this->flight->start();
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
