<?php

namespace Jankx\Cache\Key;

use Jankx\Cache\Contracts\RequestKeyGeneratorInterface;
use Jankx\Cache\Page\PageRequest;

/**
 * Page cache key: normalized URL + the cookies the page varies on.
 *
 * Two visitors of the same tour page in different currencies must never share
 * an entry, which is why `vary_cookies` values are part of the key even though
 * no `Vary:` header is sent (LiteSpeed vary is configured through Cache-Vary,
 * nginx/Varnish vary from their own config).
 *
 * @package Jankx\Cache\Key
 * @since 2.0.0
 */
class UrlKeyGenerator implements RequestKeyGeneratorInterface
{
    /**
     * @var string[]
     */
    private $varyCookies;

    /**
     * @var string[]
     */
    private $stripArgs;

    /**
     * @param string   $prefix     Key prefix.
     * @param string[] $varyCookies Cookies folded into the key.
     * @param string[] $stripArgs  Query args dropped before hashing.
     */
    public function __construct(string $prefix = 'page', array $varyCookies = [], array $stripArgs = [])
    {
        $this->prefix = $prefix;
        $this->varyCookies = $varyCookies;
        $this->stripArgs = $stripArgs;
    }

    /**
     * @var string
     */
    private $prefix;

    /**
     * @inheritdoc
     */
    public function generate($request): CacheKey
    {
        if (!$request instanceof PageRequest) {
            throw new \InvalidArgumentException('UrlKeyGenerator expects a PageRequest.');
        }

        $query = $request->query();
        foreach ($query as $name => $value) {
            if (in_array($name, $this->stripArgs, true) || strpos($name, 'utm_') === 0) {
                unset($query[$name]);
            }
        }
        ksort($query);

        $vary = [];
        foreach ($this->varyCookies as $cookie) {
            $vary[$cookie] = (string) $request->cookie($cookie);
        }

        $parts = [
            $request->method(),
            $this->normalizeUrl($request->url(), $query),
            implode('&', array_map(
                static function ($name, $value) {
                    return $name . '=' . $value;
                },
                array_keys($vary),
                array_values($vary)
            )),
        ];

        return new CacheKey($this->prefix . '_' . md5(implode('|', $parts)), 'page');
    }

    /**
     * Lowercase scheme/host, drop tracking args, keep a stable query order.
     *
     * @param string               $url   Absolute URL.
     * @param array<string,string> $query Already filtered query string.
     * @return string
     */
    private function normalizeUrl(string $url, array $query): string
    {
        $parts = parse_url($url);
        if (!is_array($parts)) {
            return $url;
        }

        $scheme = isset($parts['scheme']) ? strtolower($parts['scheme']) : 'http';
        $host = isset($parts['host']) ? strtolower($parts['host']) : '';
        $port = '';
        if (!empty($parts['port'])) {
            $port = ':' . $parts['port'];
        }
        $path = isset($parts['path']) && $parts['path'] !== '' ? $parts['path'] : '/';
        if ($path !== '/' ) {
            $path = rtrim($path, '/');
        }

        $queryString = http_build_query($query);

        return $scheme . '://' . $host . $port . $path . ($queryString !== '' ? '?' . $queryString : '');
    }
}
