<?php

namespace Jankx\Cache\Server;

use Jankx\Cache\Contracts\PurgeClientInterface;
use Jankx\Cache\Page\PageCache;
use Jankx\Cache\Page\PageCacheEntry;
use Jankx\Cache\Page\PageRequest;

/**
 * Apache with mod_cache: the shared cache is the server itself, purged with
 * `Cache-Control: no-cache` on a subsequent request (or `a2md`/mod_cache
 * purge), so pages stay in PHP storage by default and edge mode is opt-in.
 *
 * @package Jankx\Cache\Server
 * @since 2.0.0
 */
class ApacheIntegration extends AbstractServerIntegration
{
    /**
     * @param PurgeClientInterface $purgeClient Purge transport.
     */
    public function __construct(PurgeClientInterface $purgeClient)
    {
        parent::__construct($purgeClient, ServerDetector::APACHE, PageCache::MODE_STORAGE, false);
    }

    /**
     * @inheritdoc
     */
    protected function serverHeaders(PageRequest $request, ?PageCacheEntry $entry, string $state, array $options): array
    {
        // mod_cache also honours Expires; a zero value tells it not to keep
        // the response when we are only storing it in PHP.
        if (empty($options['edge_ttl'])) {
            return ['Expires' => '0'];
        }

        return [];
    }
}
