<?php

namespace Jankx\Cache\Server;

use Jankx\Cache\Contracts\PurgeClientInterface;
use Jankx\Cache\Page\PageCache;
use Jankx\Cache\Page\PageCacheEntry;
use Jankx\Cache\Page\PageRequest;

/**
 * Varnish in front of the site: PHP only publishes the response, the edge
 * keeps it (mode edge), and invalidation happens through PURGE requests.
 *
 * @package Jankx\Cache\Server
 * @since 2.0.0
 */
class VarnishIntegration extends AbstractServerIntegration
{
    /**
     * @param PurgeClientInterface $purgeClient Purge transport (PURGE/BAN).
     */
    public function __construct(PurgeClientInterface $purgeClient)
    {
        // Tag based BAN needs a custom VCL (obj.http.X-Cache-Tags), so URLs
        // are the default invalidation unit: they work with stock VCL.
        parent::__construct($purgeClient, ServerDetector::VARNISH, PageCache::MODE_EDGE, false);
    }

    /**
     * @inheritdoc
     */
    protected function serverHeaders(PageRequest $request, ?PageCacheEntry $entry, string $state, array $options): array
    {
        // Varnish reads s-maxage/max-age from the base headers; Pass requests
        // (bypass) are already marked no-store by the page cache itself.
        $headers = [];

        if (!empty($options['strip_query_args']) && $request->query() !== []) {
            // Lets the edge collapse tracking parameters into one entry when
            // the VCL uses bereq.url without query string.
            $headers['X-Cache-Key'] = (string) $request->path();
        }

        return $headers;
    }
}
