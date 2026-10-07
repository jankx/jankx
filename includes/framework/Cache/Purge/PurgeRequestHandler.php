<?php

namespace Jankx\Cache\Purge;

use Jankx\Cache\Contracts\CacheSubscriberInterface;
use Jankx\Cache\Contracts\PageCacheInterface;
use Jankx\Cache\Contracts\QueryCacheInterface;

/**
 * Applies queued LiteSpeed purges and serves the loopback purge endpoint.
 *
 * LiteSpeed cannot be told to purge from an admin request (that response does
 * not travel through the cache), so the `X-LiteSpeed-Purge` header is emitted
 * on the next front-end response that runs PHP — and, when `active_trigger`
 * is on, the loopback request below guarantees such a response exists even
 * while every URL is already served straight from LSCache.
 *
 * The same endpoint also accepts `jankx_scope` (`all`|`selective`) from the
 * token-authenticated loopback, which is how the Fast-AJAX entry point purges
 * after a write without booting the container itself
 * (`Jankx\Ajax\Cache\Purge`).
 *
 * @package Jankx\Cache\Purge
 * @since 2.0.0
 */
class PurgeRequestHandler implements CacheSubscriberInterface
{
    /**
     * @var LiteSpeedPurgeClient
     */
    private $client;

    /**
     * @var bool
     */
    private $enabled;

    /**
     * @var array<string,mixed>
     */
    private $options;

    /**
     * @param LiteSpeedPurgeClient $client  Purge client holding the queue.
     * @param bool                 $enabled Whether the handler is active.
     * @param array<string,mixed>  $options page, query and bucket used by the
     *                                      `jankx_scope` protocol.
     */
    public function __construct(LiteSpeedPurgeClient $client, bool $enabled = true, array $options = [])
    {
        $this->client = $client;
        $this->enabled = $enabled;
        $this->options = $options;
    }

    /**
     * @inheritdoc
     */
    public function subscribe(): void
    {
        if (!$this->enabled || !function_exists('add_action')) {
            return;
        }

        // Priority -1: before the page cache serves a stored page, so the
        // header is sent even on a request that would be answered from cache.
        add_action('template_redirect', [$this, 'handle'], -1);
    }

    /**
     * Flush the queued purge and answer the loopback trigger.
     *
     * @return void
     */
    public function handle(): void
    {
        $this->flushPendingHeader();

        $token = isset($_GET['jankx_purge']) ? (string) $_GET['jankx_purge'] : '';
        if ($token === '') {
            return;
        }

        $expected = $this->client->token();
        $valid = $expected !== '';
        if ($valid && function_exists('hash_equals')) {
            $valid = hash_equals($expected, $token);
        } elseif ($valid) {
            $valid = $expected === $token;
        }

        if (!headers_sent()) {
            header('Cache-Control: no-store, private, max-age=0', true);
            header('Content-Type: text/plain; charset=UTF-8', true);
            header('X-Jankx-Cache: PURGE', true);
        }

        if ($valid) {
            // The requested scope is applied before the second flush, so the
            // tags it queues leave on this very response.
            $this->applyRequestedPurge();
            $this->flushPendingHeader();
        }

        if (!$valid && function_exists('status_header')) {
            status_header(403);
        }

        echo $valid ? 'purged' : 'forbidden';
        exit;
    }

    /**
     * Purge requested by the loopback caller (`jankx_scope` and friends).
     *
     * @return void
     */
    protected function applyRequestedPurge(): void
    {
        $scope = isset($_GET['jankx_scope']) ? (string) $_GET['jankx_scope'] : '';
        if ($scope === '' || !isset($this->options['page']) || !$this->options['page'] instanceof PageCacheInterface) {
            return;
        }

        $pageCache = $this->options['page'];

        if ($scope === 'all') {
            $pageCache->purge(['all'], []);

            if (isset($this->options['query']) && $this->options['query'] instanceof QueryCacheInterface) {
                $bucket = isset($this->options['bucket']) && is_string($this->options['bucket'])
                    && $this->options['bucket'] !== ''
                    ? $this->options['bucket']
                    : 'posts';
                $this->options['query']->flushBucket($bucket);
            }

            return;
        }

        $pageCache->purge($this->csv('jankx_tags'), $this->csv('jankx_urls'));
    }

    /**
     * Emit the queued `X-LiteSpeed-Purge` header, if anything is pending.
     *
     * @return void
     */
    public function flushPendingHeader(): void
    {
        if (headers_sent()) {
            return;
        }

        foreach ($this->client->pendingHeaders() as $name => $value) {
            header($name . ': ' . $value, true);
        }
    }

    /**
     * @param string $key GET parameter holding a comma separated list.
     * @return string[]
     */
    private function csv(string $key): array
    {
        $raw = isset($_GET[$key]) ? (string) $_GET[$key] : '';
        if ($raw === '') {
            return [];
        }

        $values = [];
        foreach (explode(',', $raw) as $value) {
            $value = trim($value);
            if ($value !== '') {
                $values[] = $value;
            }
        }

        return $values;
    }
}
