<?php

namespace Jankx\Cache\Page;

/**
 * Immutable description of the request being cached.
 *
 * Built from $_SERVER only (plus, in fromWordPress(), WordPress state), which
 * keeps every cacheability rule and key generator free of global WordPress
 * calls and therefore unit testable.
 *
 * @package Jankx\Cache\Page
 * @since 2.0.0
 */
class PageRequest
{
    public const CONTEXT_LOGGED_IN = 'logged_in';
    public const CONTEXT_ADMIN = 'admin';
    public const CONTEXT_AJAX = 'ajax';
    public const CONTEXT_REST = 'rest';
    public const CONTEXT_PREVIEW = 'preview';
    public const CONTEXT_404 = '404';
    public const CONTEXT_FEED = 'feed';
    public const CONTEXT_DO_NOT_CACHE = 'do_not_cache';
    public const CONTEXT_STATUS = 'status';

    /**
     * @var string
     */
    private $method;

    /**
     * @var string
     */
    private $url;

    /**
     * @var string
     */
    private $path;

    /**
     * @var array<string,string>
     */
    private $query;

    /**
     * @var array<string,string>
     */
    private $cookies;

    /**
     * @var array<string,string>
     */
    private $headers;

    /**
     * @var array<string,mixed>
     */
    private $context;

    /**
     * @param string                $method  HTTP method.
     * @param string                $url     Absolute URL (scheme://host/path?query).
     * @param array<string,string>  $query   Parsed query string.
     * @param array<string,string>  $cookies Request cookies.
     * @param array<string,string>  $headers Request headers.
     * @param array<string,mixed>   $context Request context flags.
     */
    public function __construct(
        string $method,
        string $url,
        array $query = [],
        array $cookies = [],
        array $headers = [],
        array $context = []
    ) {
        $this->method = strtoupper($method);
        $this->url = $url;

        $parts = parse_url($url);
        $this->path = isset($parts['path']) && $parts['path'] !== '' ? $parts['path'] : '/';
        $this->query = $query;
        $this->cookies = $cookies;
        $this->headers = $headers;
        $this->context = $context;
    }

    /**
     * Build a request from globals (no WordPress required).
     *
     * @param array|null $server  Typically $_SERVER.
     * @param array|null $cookies Typically $_COOKIE.
     * @return self
     */
    public static function fromGlobals(?array $server = null, ?array $cookies = null): self
    {
        $server = $server !== null ? $server : $_SERVER;
        $cookies = $cookies !== null ? $cookies : $_COOKIE;

        $method = isset($server['REQUEST_METHOD']) ? (string) $server['REQUEST_METHOD'] : 'GET';

        $https = !empty($server['HTTPS']) && $server['HTTPS'] !== 'off';
        $securePort = isset($server['SERVER_PORT']) && (string) $server['SERVER_PORT'] === '443';
        $scheme = ($https || $securePort) ? 'https' : 'http';

        $host = '';
        if (!empty($server['HTTP_HOST'])) {
            $host = (string) $server['HTTP_HOST'];
        } elseif (!empty($server['SERVER_NAME'])) {
            $host = (string) $server['SERVER_NAME'];
        } else {
            $host = 'localhost';
        }

        $uri = isset($server['REQUEST_URI']) ? (string) $server['REQUEST_URI'] : '/';
        $path = parse_url($uri, PHP_URL_PATH);
        $path = is_string($path) && $path !== '' ? $path : '/';

        $queryString = '';
        $query = [];
        if (strpos($uri, '?') !== false) {
            $queryString = (string) substr($uri, strpos($uri, '?') + 1);
            parse_str($queryString, $query);
        }

        $headers = [];
        foreach ($server as $key => $value) {
            if (strpos($key, 'HTTP_') === 0) {
                $name = str_replace('_', '-', strtolower(substr($key, 5)));
                $headers[$name] = (string) $value;
            }
        }

        return new self(
            $method,
            $scheme . '://' . $host . $path . ($queryString !== '' ? '?' . $queryString : ''),
            self::flatten($query),
            self::flatten($cookies),
            $headers,
            []
        );
    }

    /**
     * Build a request including the WordPress context flags used by the rules.
     *
     * @return self
     */
    public static function fromWordPress(): self
    {
        $request = self::fromGlobals();

        $status = http_response_code();
        $context = [
            self::CONTEXT_LOGGED_IN => function_exists('is_user_logged_in') ? (bool) is_user_logged_in() : false,
            self::CONTEXT_STATUS => is_int($status) && $status > 0 ? $status : 200,
        ];

        if (function_exists('is_admin')) {
            $context[self::CONTEXT_ADMIN] = (bool) is_admin();
        }
        if (function_exists('wp_doing_ajax')) {
            $context[self::CONTEXT_AJAX] = (bool) wp_doing_ajax();
        }
        $context[self::CONTEXT_REST] = defined('REST_REQUEST');
        $context[self::CONTEXT_DO_NOT_CACHE] = defined('DONOTCACHEPAGE');

        if (function_exists('is_preview')) {
            $context[self::CONTEXT_PREVIEW] = (bool) is_preview();
        }
        if (function_exists('is_customize_preview') && is_customize_preview()) {
            $context[self::CONTEXT_PREVIEW] = true;
        }
        if (function_exists('is_404')) {
            $context[self::CONTEXT_404] = (bool) is_404();
        }
        if (function_exists('is_feed')) {
            $context[self::CONTEXT_FEED] = (bool) is_feed();
        }

        return $request->withContext($context);
    }

    /**
     * Copy with additional context flags.
     *
     * @param array<string,mixed> $context Extra flags.
     * @return self
     */
    public function withContext(array $context): self
    {
        $clone = clone $this;
        $clone->context = array_merge($this->context, $context);

        return $clone;
    }

    /**
     * @return string
     */
    public function method(): string
    {
        return $this->method;
    }

    /**
     * @return bool
     */
    public function isGet(): bool
    {
        return $this->method === 'GET' || $this->method === 'HEAD';
    }

    /**
     * @return string
     */
    public function url(): string
    {
        return $this->url;
    }

    /**
     * @return string
     */
    public function path(): string
    {
        return $this->path;
    }

    /**
     * @return array<string,string>
     */
    public function query(): array
    {
        return $this->query;
    }

    /**
     * @param string $name Query argument name.
     * @return string|null
     */
    public function queryArg(string $name): ?string
    {
        return isset($this->query[$name]) ? $this->query[$name] : null;
    }

    /**
     * @param string $name Cookie name.
     * @return string|null
     */
    public function cookie(string $name): ?string
    {
        return isset($this->cookies[$name]) ? $this->cookies[$name] : null;
    }

    /**
     * @return array<string,string>
     */
    public function cookies(): array
    {
        return $this->cookies;
    }

    /**
     * @param string $name Header name (lowercase, dashes).
     * @return string|null
     */
    public function header(string $name): ?string
    {
        return isset($this->headers[$name]) ? $this->headers[$name] : null;
    }

    /**
     * @param string $key     Context flag.
     * @param mixed  $default Value when the flag was never set.
     * @return mixed
     */
    public function context(string $key, $default = null)
    {
        return array_key_exists($key, $this->context) ? $this->context[$key] : $default;
    }

    /**
     * @return array<string,mixed>
     */
    public function contextAll(): array
    {
        return $this->context;
    }

    /**
     * Flatten parse_str()/$_COOKIE style arrays into scalar pairs.
     *
     * @param array $data Raw input.
     * @return array<string,string>
     */
    private static function flatten(array $data): array
    {
        $flat = [];
        foreach ($data as $key => $value) {
            if (is_scalar($value)) {
                $flat[(string) $key] = (string) $value;
            }
        }

        return $flat;
    }
}
