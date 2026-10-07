<?php

namespace Jankx\Cache\Server;

/**
 * Guesses which web server is in front of WordPress.
 *
 * Detection is heuristic by nature (CGI hides the real software), which is
 * exactly why the answer can be overridden through `cache.page.server`.
 *
 * @package Jankx\Cache\Server
 * @since 2.0.0
 */
class ServerDetector
{
    const AUTO = 'auto';
    const GENERIC = 'generic';
    const NGINX = 'nginx';
    const APACHE = 'apache';
    const LITESPEED = 'litespeed';
    const VARNISH = 'varnish';

    /**
     * @var array<string,mixed>
     */
    private $server;

    /**
     * @param array<string,mixed> $server Server superglobal; defaults to $_SERVER.
     */
    public function __construct(array $server = [])
    {
        $this->server = $server ?: (isset($_SERVER) && is_array($_SERVER) ? $_SERVER : []);
    }

    /**
     * All known server identifiers.
     *
     * @return string[]
     */
    public static function known(): array
    {
        return [self::VARNISH, self::LITESPEED, self::NGINX, self::APACHE, self::GENERIC];
    }

    /**
     * Resolve the configured value: `auto` (or anything unknown) detects.
     *
     * @param string $configured cache.page.server value.
     * @return string
     */
    public function resolve(string $configured): string
    {
        $configured = $configured !== '' ? strtolower($configured) : self::AUTO;
        if ($configured === self::AUTO || !in_array($configured, self::known(), true)) {
            return $this->detect();
        }

        return $configured;
    }

    /**
     * Detect the server in front of PHP.
     *
     * @return string
     */
    public function detect(): string
    {
        $server = $this->server;
        $software = isset($server['SERVER_SOFTWARE']) ? (string) $server['SERVER_SOFTWARE'] : '';

        if ($this->hasVarnish($server)) {
            return self::VARNISH;
        }

        if ($this->isLiteSpeed($server, $software)) {
            return self::LITESPEED;
        }

        if (stripos($software, 'nginx') !== false) {
            return self::NGINX;
        }

        if (stripos($software, 'apache') !== false) {
            return self::APACHE;
        }

        return self::GENERIC;
    }

    /**
     * @param array<string,mixed> $server Server superglobal.
     * @return bool
     */
    private function hasVarnish(array $server): bool
    {
        if (!empty($server['HTTP_X_VARNISH'])) {
            return true;
        }

        $via = isset($server['HTTP_VIA']) ? (string) $server['HTTP_VIA'] : '';

        return stripos($via, 'varnish') !== false;
    }

    /**
     * LiteSpeed is only usable for edge caching when LSCache itself is on —
     * OpenLiteSpeed without the cache module must fall back to storage.
     *
     * @param array<string,mixed> $server   Server superglobal.
     * @param string              $software SERVER_SOFTWARE value.
     * @return bool
     */
    private function isLiteSpeed(array $server, string $software): bool
    {
        if (stripos($software, 'litespeed') === false) {
            return false;
        }

        if (!empty($server['X_LSCACHE']) || !empty($server['X-LSCACHE'])) {
            return true;
        }

        if (defined('LS_PLUGIN_VERSION') || class_exists('LiteSpeed_Cache', false) || class_exists('LiteSpeed_Cache_API', false)) {
            return true;
        }

        return false;
    }
}
