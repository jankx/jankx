<?php

namespace Jankx\Cache\Purge;

use Jankx\Cache\Contracts\PurgeClientInterface;

/**
 * LiteSpeed (LSCache) purge client.
 *
 * LiteSpeed purges from an origin response header (`X-LiteSpeed-Purge`), so an
 * invalidation cannot be applied at the moment a post is saved — the admin
 * request is not going through the cache. The tags are therefore queued and
 * flushed on the next response that runs PHP; `active_trigger` additionally
 * fires a loopback request so the header is emitted even when every front-end
 * URL is already served from cache.
 *
 * When the LiteSpeed Cache plugin is active it owns the whole LSCache
 * conversation (and exposes a purge API), so we defer to it instead of
 * duplicating headers.
 *
 * @package Jankx\Cache\Purge
 * @since 2.0.0
 */
class LiteSpeedPurgeClient implements PurgeClientInterface
{
    const PENDING_OPTION = 'jankx_cache_pending_purge';
    const TOKEN_OPTION = 'jankx_cache_purge_token';

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
     * Whether the LiteSpeed Cache plugin is handling the cache itself.
     *
     * @return bool
     */
    public static function isPluginActive(): bool
    {
        if (defined('LS_PLUGIN_VERSION')) {
            return true;
        }

        return class_exists('LiteSpeed_Cache', false);
    }

    /**
     * @inheritdoc
     */
    public function purgeAll(): bool
    {
        if (self::isPluginActive() && self::callPluginPurgeAll()) {
            return true;
        }

        return $this->enqueue(['all']);
    }

    /**
     * @inheritdoc
     */
    public function purgeUrls(array $urls): bool
    {
        // LSCache addresses entries by tag, not by URL.
        return $this->purgeAll();
    }

    /**
     * @inheritdoc
     */
    public function purgeTags(array $tags): bool
    {
        $tags = $this->sanitize($tags);
        if (empty($tags)) {
            return $this->purgeAll();
        }

        if (self::isPluginActive() && self::callPluginPurgeAll()) {
            return true;
        }

        return $this->enqueue($tags);
    }

    /**
     * Queue tags to purge on the next response.
     *
     * @param string[] $tags Cache tags.
     * @return bool
     */
    public function enqueue(array $tags): bool
    {
        if (!$this->supportsHeaderPurge()) {
            return false;
        }

        if (!function_exists('get_option') || !function_exists('update_option')) {
            return false;
        }

        $pending = get_option(self::PENDING_OPTION, []);
        $pending = is_array($pending) ? $pending : [];
        $pending = $this->sanitize(array_merge($pending, $tags));

        $saved = update_option(self::PENDING_OPTION, $pending, false);
        $this->maybeTrigger();

        return (bool) $saved || !empty($pending);
    }

    /**
     * Read and clear the queued tags.
     *
     * @return string[]
     */
    public function pullPending(): array
    {
        if (!function_exists('get_option')) {
            return [];
        }

        $pending = get_option(self::PENDING_OPTION, []);
        if (!is_array($pending) || empty($pending)) {
            return [];
        }

        if (function_exists('delete_option')) {
            delete_option(self::PENDING_OPTION);
        } else {
            update_option(self::PENDING_OPTION, [], false);
        }

        return $this->sanitize($pending);
    }

    /**
     * Headers flushing the queued tags; empty when nothing is pending.
     *
     * @return array<string,string>
     */
    public function pendingHeaders(): array
    {
        $pending = $this->pullPending();
        if (empty($pending)) {
            return [];
        }

        if (!$this->supportsHeaderPurge()) {
            // Nothing can act on the header — drop the queue instead of
            // handing OpenLiteSpeed a header it segfaults on.
            return [];
        }

        return ['X-LiteSpeed-Purge' => 'public, ' . implode(', ', $pending)];
    }

    /**
     * Fire a loopback request so a front-end URL served straight from the
     * cache still runs PHP and picks the purge header up.
     *
     * @return bool
     */
    public function maybeTrigger(): bool
    {
        if (empty($this->options['active_trigger'])) {
            return false;
        }

        if (!function_exists('wp_remote_get') || !function_exists('home_url')) {
            return false;
        }

        $url = home_url('/?jankx_purge=' . urlencode($this->token()) . '&_=' . (string) time());
        $response = wp_remote_get($url, [
            'timeout' => 3,
            'blocking' => false,
            'sslverify' => false,
            'redirection' => 0,
        ]);

        return !(function_exists('is_wp_error') && is_wp_error($response));
    }

    /**
     * Shared secret of the loopback purge request.
     *
     * @return string
     */
    public function token(): string
    {
        if (!function_exists('get_option')) {
            return '';
        }

        $token = get_option(self::TOKEN_OPTION, '');
        if (is_string($token) && $token !== '') {
            return $token;
        }

        $token = function_exists('wp_generate_password')
            ? wp_generate_password(32, false, false)
            : bin2hex(random_bytes(16));

        if (function_exists('update_option')) {
            update_option(self::TOKEN_OPTION, $token, false);
        }

        return $token;
    }

    /**
     * Whether the `X-LiteSpeed-Purge` response header can do any good here.
     *
     * OpenLiteSpeed's cache module segfaults (signal=11) on any response
     * carrying the header — reproducible with a two-line script — and with
     * the module unregistered there is no LSCache to purge either. Skip the
     * header there; LSWS Enterprise (production) is unaffected. The
     * `cache.page.purge.litespeed_header` option overrides the guess.
     *
     * @return bool
     */
    private function supportsHeaderPurge(): bool
    {
        $configured = isset($this->options['litespeed_header']) ? $this->options['litespeed_header'] : 'auto';

        if (is_bool($configured)) {
            return $configured;
        }

        $edition = isset($_SERVER['LSWS_EDITION']) ? (string) $_SERVER['LSWS_EDITION'] : '';

        if ($edition !== '' && stripos($edition, 'openlitespeed') !== false) {
            return false;
        }

        return true;
    }

    /**
     * Ask the LiteSpeed Cache plugin to purge everything.
     *
     * @return bool True when the plugin answered.
     */
    private static function callPluginPurgeAll(): bool
    {
        if (is_callable(['LiteSpeed_Cache_API', 'purge_all'])) {
            \LiteSpeed_Cache_API::purge_all();

            return true;
        }

        if (function_exists('has_action') && function_exists('do_action') && has_action('litespeed_purge_all')) {
            // Older plugin versions listen to their own action.
            do_action('litespeed_purge_all');

            return true;
        }

        return false;
    }

    /**
     * @param string[] $tags Raw tags.
     * @return string[]
     */
    private function sanitize(array $tags): array
    {
        $clean = [];
        foreach ($tags as $tag) {
            $tag = preg_replace('/[^A-Za-z0-9_\-.]/', '', (string) $tag);
            if (is_string($tag) && $tag !== '') {
                $clean[$tag] = $tag;
            }
        }

        return array_values($clean);
    }
}
