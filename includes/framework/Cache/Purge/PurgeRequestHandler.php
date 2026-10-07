<?php

namespace Jankx\Cache\Purge;

use Jankx\Cache\Contracts\CacheSubscriberInterface;

/**
 * Applies queued LiteSpeed purges and serves the loopback purge endpoint.
 *
 * LiteSpeed cannot be told to purge from an admin request (that response does
 * not travel through the cache), so the `X-LiteSpeed-Purge` header is emitted
 * on the next front-end response that runs PHP — and, when `active_trigger`
 * is on, the loopback request below guarantees such a response exists even
 * while every URL is already served straight from LSCache.
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
     * @param LiteSpeedPurgeClient $client  Purge client holding the queue.
     * @param bool                 $enabled Whether the handler is active.
     */
    public function __construct(LiteSpeedPurgeClient $client, bool $enabled = true)
    {
        $this->client = $client;
        $this->enabled = $enabled;
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

        if (!$valid && function_exists('status_header')) {
            status_header(403);
        }

        echo $valid ? 'purged' : 'forbidden';
        exit;
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
}
