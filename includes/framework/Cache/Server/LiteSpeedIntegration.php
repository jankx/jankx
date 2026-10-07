<?php

namespace Jankx\Cache\Server;

use Jankx\Cache\Contracts\PurgeClientInterface;
use Jankx\Cache\Page\PageCache;
use Jankx\Cache\Page\PageCacheEntry;
use Jankx\Cache\Page\PageRequest;
use Jankx\Cache\Purge\LiteSpeedPurgeClient;

/**
 * LiteSpeed / OpenLiteSpeed with the LSCache module.
 *
 * Three cases, in order of preference:
 *
 * 1. LiteSpeed Cache plugin active — it owns every LSCache header and exposes
 *    a purge API, so this adapter deliberately emits nothing (an empty
 *    `Cache-Control` suppresses ours and leaves the plugin's value alone).
 *    Contribution is limited to the purge queued by our own invalidation.
 * 2. LSCache module without the plugin — the classic header protocol:
 *    `X-LiteSpeed-Cache: public`, `X-LiteSpeed-Ttl`, `X-LiteSpeed-Tag`.
 * 3. No LSCache at all (detected as generic) — never reaches this class.
 *
 * @package Jankx\Cache\Server
 * @since 2.0.0
 */
class LiteSpeedIntegration extends AbstractServerIntegration
{
    /**
     * @param PurgeClientInterface $purgeClient LiteSpeedPurgeClient instance.
     */
    public function __construct(PurgeClientInterface $purgeClient)
    {
        // Tag purge is the native LSCache invalidation unit.
        parent::__construct($purgeClient, ServerDetector::LITESPEED, PageCache::MODE_EDGE, true);
    }

    /**
     * @inheritdoc
     */
    protected function serverHeaders(PageRequest $request, ?PageCacheEntry $entry, string $state, array $options): array
    {
        if (LiteSpeedPurgeClient::isPluginActive()) {
            // The plugin publishes Cache-Control and X-LiteSpeed-* itself.
            return ['Cache-Control' => ''];
        }

        $headers = ['X-LiteSpeed-Cache' => 'public'];

        $edgeTtl = isset($options['edge_ttl']) ? (int) $options['edge_ttl'] : 0;
        if ($edgeTtl > 0) {
            $headers['X-LiteSpeed-Ttl'] = (string) $edgeTtl;
        }

        $tags = isset($options['tags']) ? (array) $options['tags'] : [];
        if (!empty($tags)) {
            $headers['X-LiteSpeed-Tag'] = implode(',', $tags);
        }

        return $headers;
    }
}
