<?php

namespace Jankx\Cache\Server;

use Jankx\Cache\Contracts\PurgeClientInterface;
use Jankx\Cache\Page\PageCache;
use Jankx\Cache\Page\PageCacheEntry;
use Jankx\Cache\Page\PageRequest;

/**
 * Fallback adapter: we do not recognise the server, so pages are stored by
 * PHP (mode storage) and the generic Cache-Control headers are all we emit.
 *
 * @package Jankx\Cache\Server
 * @since 2.0.0
 */
class GenericIntegration extends AbstractServerIntegration
{
    /**
     * @param PurgeClientInterface $purgeClient Purge transport.
     */
    public function __construct(PurgeClientInterface $purgeClient)
    {
        parent::__construct($purgeClient, ServerDetector::GENERIC, PageCache::MODE_STORAGE, false);
    }

    /**
     * @inheritdoc
     */
    protected function serverHeaders(PageRequest $request, ?PageCacheEntry $entry, string $state, array $options): array
    {
        return [];
    }
}
