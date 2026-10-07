<?php

/**
 * Cache system configuration.
 *
 * Two independent layers:
 *
 * - `query` : persists database results (WP_Query) across requests.
 * - `page`  : persists rendered HTML and drives the web-server cache headers
 *             (LiteSpeed LSCache, nginx, Apache mod_cache, Varnish).
 *
 * Every value can be overridden from the child theme by dropping a
 * `config/cache.php` file there (child config wins, see LoadConfiguration).
 *
 * @package Jankx\Cache
 * @since 2.0.0
 */

return [
    // ── Master switch ───────────────────────────────────────────────────────
    'enabled' => true,

    // ── Storage engine ──────────────────────────────────────────────────────
    // driver: auto   → persistent object cache (Redis/Memcached) if available,
    //                  otherwise filesystem.
    //         object → wp_cache_* (needs a persistent drop-in to survive
    //                  between requests).
    //         file   → files under wp-content/cache/jankx.
    //         null   → disabled (Null Object, every call is a miss).
    //         \Fully\Qualified\Class → custom engine implementing
    //                  Jankx\Cache\Contracts\CacheEngineInterface.
    'engine' => [
        'driver' => 'auto',
        'prefix' => 'jankx',
        'group' => 'cache',
        'ttl' => 3600,
        'file' => [
            // null → WP_CONTENT_DIR . '/cache/jankx'
            'directory' => null,
            'mode' => 0755,
        ],
    ],

    // ── Query cache ─────────────────────────────────────────────────────────
    'query' => [
        'enabled' => true,
        // Bucket used by WP_Query results; bumped on every post change.
        'bucket' => 'posts',
        'ttl' => 3600,
        // Never cache for logged-in visitors or outside the main request.
        'public_only' => true,
        'frontend_only' => true,
        // SQL statements matching this pattern are never cached.
        'exclude_patterns' => [
            'RAND(',
        ],
    ],

    // ── Page cache ──────────────────────────────────────────────────────────
    'page' => [
        'enabled' => true,

        // auto   → decided by the detected server (see ServerIntegration).
        // storage→ the theme stores/serves the HTML itself.
        // edge   → only headers + purge, LiteSpeed/nginx/Varnish store it.
        // both   → store locally *and* publish cacheable headers.
        'mode' => 'auto',

        // auto → detected at runtime; force with litespeed|nginx|apache|varnish|generic
        'server' => 'auto',

        // Lifetime of a stored page (seconds, 0 = until purged).
        'ttl' => 86400,

        // Shared-cache TTL published to LiteSpeed / nginx / Varnish / Apache.
        'edge_ttl' => 3600,

        // Browser TTL (seconds). 0 → `Cache-Control: no-cache` in storage mode,
        // `max-age=0` when an edge cache is in front (edge revalidates instead).
        'browser_ttl' => 0,

        // Extra `Vary:` values, e.g. ['Cookie']. Kept empty by default because
        // LiteSpeed vary is handled by Cache-Vary / litespeed_vary_cookies and
        // nginx/Varnish vary from their own config. Page keys always vary on
        // `vary_cookies` below.
        'vary_headers' => [],

        // Cookies baked into the page cache key (price/currency variants).
        'vary_cookies' => [
            'jankx_current_currency',
        ],

        // Query arguments stripped from the cache key (ad tracking etc.).
        'strip_query_args' => [
            'utm_source',
            'utm_medium',
            'utm_campaign',
            'utm_term',
            'utm_content',
            'fbclid',
            'gclid',
            'msclkid',
            'ref',
        ],

        // Path prefixes never cached/served.
        'exclude_paths' => [
            '/wp-admin',
            '/wp-login.php',
            '/wp-cron.php',
            '/xmlrpc.php',
            '/wp-json',
            '/jankx-ajax',
            '/cart',
            '/checkout',
            '/my-account',
        ],

        // Cookies present → response is not cacheable (a cart is in play).
        'exclude_cookies' => [
            'wordpress_logged_in_*',
            'woocommerce_items_in_cart',
            'woocommerce_cart_hash',
            'wp_woocommerce_session_*',
            'jankx_session',
            'comment_author_*',
        ],

        // Query arguments present → response is not cacheable.
        'exclude_query_args' => [
            'mode',
            'preview',
            'customize_changeset_uuid',
            'add-to-cart',
            'remove-from-cart',
            'remove_item',
            'undo_item',
            'wc-ajax',
            'wc-api',
            'rest_route',
            'jankx_purge',
            'jankx_fast_ajax',
            'preview_id',
            'replytocom',
        ],

        'purge' => [
            // HTTP endpoint used by Varnish (BAN) / nginx (ngx_cache_purge).
            // `{url}` inside the endpoint is replaced with the purged URL.
            // Empty → HTTP purge disabled (storage purge still runs).
            'endpoint' => '',
            'method' => 'PURGE',
            'header' => 'X-Purge-Token',
            'token' => '',
            // Send a loopback request so a front-end cache that did not run
            // PHP still receives the purge headers (LiteSpeed without plugin).
            'active_trigger' => true,
        ],
    ],
];
