<?php

namespace Jankx\Cache\Server;

use Jankx\Cache\Contracts\PurgeClientInterface;
use Jankx\Cache\Contracts\ServerIntegrationInterface;
use Jankx\Cache\Page\PageCacheEntry;
use Jankx\Cache\Page\PageRequest;

/**
 * Template method shared by every server adapter: the base response headers
 * (Cache-Control freshness) are identical everywhere, only the transport of
 * those headers and the purge protocol differ.
 *
 * Header semantics depend on the resolved mode:
 *
 * - edge TTL set (mode edge/both): `max-age` for browsers + `s-maxage` for
 *   shared caches (Varnish, Apache, nginx read s-maxage first);
 * - storage only: freshness is decided when we serve the file, so the origin
 *   only ever tells browsers `no-cache` (revalidate) or `max-age`.
 *
 * @package Jankx\Cache\Server
 * @since 2.0.0
 */
abstract class AbstractServerIntegration implements ServerIntegrationInterface
{
    /**
     * @var PurgeClientInterface
     */
    protected $purgeClient;

    /**
     * @var string
     */
    private $name;

    /**
     * @var string
     */
    private $defaultMode;

    /**
     * @var bool
     */
    private $supportsTags;

    /**
     * @param PurgeClientInterface $purgeClient  Purge transport.
     * @param string               $name        Server identifier.
     * @param string               $defaultMode PageCache::MODE_* used with mode = auto.
     * @param bool                 $supportsTags Whether tags reach the purge protocol.
     */
    public function __construct(PurgeClientInterface $purgeClient, string $name, string $defaultMode, bool $supportsTags = false)
    {
        $this->purgeClient = $purgeClient;
        $this->name = $name;
        $this->defaultMode = $defaultMode;
        $this->supportsTags = $supportsTags;
    }

    /**
     * @inheritdoc
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @inheritdoc
     */
    public function defaultMode(): string
    {
        return $this->defaultMode;
    }

    /**
     * @inheritdoc
     */
    public function supportsTags(): bool
    {
        return $this->supportsTags;
    }

    /**
     * @return PurgeClientInterface
     */
    public function purgeClient(): PurgeClientInterface
    {
        return $this->purgeClient;
    }

    /**
     * @inheritdoc
     */
    public function headers(PageRequest $request, ?PageCacheEntry $entry, string $state, array $options): array
    {
        $headers = $this->baseHeaders($options);
        foreach ($this->serverHeaders($request, $entry, $state, $options) as $name => $value) {
            $headers[$name] = $value;
        }

        return $headers;
    }

    /**
     * @inheritdoc
     */
    public function purge(array $tags, array $urls, array $options): bool
    {
        if ($this->supportsTags() && !empty($tags)) {
            if ($this->purgeClient->purgeTags(array_values($tags))) {
                return true;
            }
        }

        if (!empty($urls)) {
            return $this->purgeClient->purgeUrls(array_values($urls));
        }

        return $this->purgeClient->purgeAll();
    }

    /**
     * Cache-Control shared by every server.
     *
     * @param array<string,mixed> $options Resolved cache.page configuration.
     * @return array<string,string>
     */
    protected function baseHeaders(array $options): array
    {
        $edgeTtl = isset($options['edge_ttl']) ? (int) $options['edge_ttl'] : 0;
        $browserTtl = isset($options['browser_ttl']) ? (int) $options['browser_ttl'] : 0;

        if ($edgeTtl > 0) {
            $cacheControl = sprintf('public, max-age=%d, s-maxage=%d', max(0, $browserTtl), $edgeTtl);
        } elseif ($browserTtl > 0) {
            $cacheControl = sprintf('public, max-age=%d', $browserTtl);
        } else {
            $cacheControl = 'no-cache';
        }

        return ['Cache-Control' => $cacheControl];
    }

    /**
     * Headers only this server understands.
     *
     * Returning an empty string for `Cache-Control` suppresses the base header
     * (used when another component already owns it, e.g. the LiteSpeed Cache
     * plugin).
     *
     * @param PageRequest        $request Current request.
     * @param PageCacheEntry|null $entry  Served entry, when any.
     * @param string             $state   PageCache::STATE_* constant.
     * @param array<string,mixed> $options Resolved cache.page configuration.
     * @return array<string,string>
     */
    abstract protected function serverHeaders(PageRequest $request, ?PageCacheEntry $entry, string $state, array $options): array;
}
