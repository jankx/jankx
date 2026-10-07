<?php

namespace Jankx\Cache\Server;

use Jankx\Cache\Contracts\PurgeClientInterface;
use Jankx\Cache\Page\PageCache;
use Jankx\Cache\Page\PageCacheEntry;
use Jankx\Cache\Page\PageRequest;

/**
 * nginx behind `fastcgi_cache` / `proxy_cache`.
 *
 * nginx does not act on upstream Cache-Control by default: the recognised
 * signals are `X-Accel-Expires` (seconds) and `X-Accel-Buffering`, so both
 * the freshness and the bypass cases are published that way. Purging is left
 * to an HTTP endpoint (ngx_cache_purge, or a small location block) because
 * nginx has no tag protocol.
 *
 * @package Jankx\Cache\Server
 * @since 2.0.0
 */
class NginxIntegration extends AbstractServerIntegration
{
    /**
     * @param PurgeClientInterface $purgeClient Purge transport.
     */
    public function __construct(PurgeClientInterface $purgeClient)
    {
        parent::__construct($purgeClient, ServerDetector::NGINX, PageCache::MODE_BOTH, false);
    }

    /**
     * @inheritdoc
     */
    protected function serverHeaders(PageRequest $request, ?PageCacheEntry $entry, string $state, array $options): array
    {
        $edgeTtl = isset($options['edge_ttl']) ? (int) $options['edge_ttl'] : 0;

        if ($edgeTtl <= 0) {
            return ['X-Accel-Expires' => '0'];
        }

        return ['X-Accel-Expires' => (string) $edgeTtl];
    }
}
