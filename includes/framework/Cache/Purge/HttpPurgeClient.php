<?php

namespace Jankx\Cache\Purge;

use Jankx\Cache\Contracts\PurgeClientInterface;

/**
 * HTTP purge transport for Varnish (PURGE/BAN) and nginx (ngx_cache_purge).
 *
 * The endpoint is a config value so the wire protocol stays a decision of the
 * server administrator: `{url}` inside the endpoint is replaced with the URL
 * being purged, tags travel in `X-Purge-Tags`.
 *
 * @package Jankx\Cache\Purge
 * @since 2.0.0
 */
class HttpPurgeClient implements PurgeClientInterface
{
    const TAGS_HEADER = 'X-Purge-Tags';

    /**
     * @var array<string,mixed>
     */
    private $options;

    /**
     * @param array<string,mixed> $options cache.page.purge configuration.
     */
    public function __construct(array $options = [])
    {
        $this->options = $options;
    }

    /**
     * @inheritdoc
     */
    public function purgeAll(): bool
    {
        return $this->send($this->buildRequest());
    }

    /**
     * @inheritdoc
     */
    public function purgeUrls(array $urls): bool
    {
        if (empty($urls)) {
            return $this->purgeAll();
        }

        $ok = false;
        foreach ($urls as $url) {
            if (!is_string($url) || $url === '') {
                continue;
            }
            $ok = $this->send($this->buildRequest($url)) || $ok;
        }

        return $ok;
    }

    /**
     * @inheritdoc
     */
    public function purgeTags(array $tags): bool
    {
        return $this->send($this->buildRequest('', $tags));
    }

    /**
     * Build the outgoing request (pure, unit testable).
     *
     * @param string   $targetUrl URL being purged, empty for "everything".
     * @param string[] $tags      Cache tags to ban.
     * @return array{url:string,method:string,headers:array<string,string>} Empty array when disabled.
     */
    public function buildRequest(string $targetUrl = '', array $tags = []): array
    {
        $endpoint = isset($this->options['endpoint']) ? trim((string) $this->options['endpoint']) : '';
        if ($endpoint === '') {
            return [];
        }

        $url = $targetUrl !== '' ? str_replace('{url}', $targetUrl, $endpoint) : $endpoint;

        $headers = [];
        $token = isset($this->options['token']) ? (string) $this->options['token'] : '';
        if ($token !== '') {
            $headerName = !empty($this->options['header']) ? (string) $this->options['header'] : 'X-Purge-Token';
            $headers[$headerName] = $token;
        }
        if (!empty($tags)) {
            $headers[self::TAGS_HEADER] = implode(',', $tags);
        }

        return [
            'url' => $url,
            'method' => !empty($this->options['method']) ? strtoupper((string) $this->options['method']) : 'PURGE',
            'headers' => $headers,
        ];
    }

    /**
     * Fire the request.
     *
     * @param array $request Request as built by buildRequest().
     * @return bool
     */
    public function send(array $request): bool
    {
        if (empty($request) || empty($request['url'])) {
            return false;
        }

        if (!function_exists('wp_remote_request')) {
            return false;
        }

        $response = wp_remote_request($request['url'], [
            'method' => $request['method'],
            'headers' => $request['headers'],
            'timeout' => 5,
            'redirection' => 0,
            'sslverify' => false,
        ]);

        if (function_exists('is_wp_error') && is_wp_error($response)) {
            return false;
        }

        $code = function_exists('wp_remote_retrieve_response_code')
            ? (int) wp_remote_retrieve_response_code($response)
            : 0;

        // 404 is a legitimate answer: the URL simply was not cached yet.
        return in_array($code, [200, 201, 202, 204, 404], true);
    }
}
