<?php

namespace Jankx\Telemetry;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

class ThemeStats
{
    /**
     * API endpoint for public stats
     *
     * @var string
     */
    const STATS_ENDPOINT = 'https://jankx.pages.dev/api/stats';

    /**
     * Fetch public theme statistics
     *
     * @param array $args Query arguments
     * @return array|false Stats array on success, false on failure
     */
    public static function fetchStats($args = [])
    {
        $defaults = [
            'days' => 30,
        ];

        $args = wp_parse_args($args, $defaults);
        $days = intval($args['days']);

        // Enforce limits: min 1, max 365
        if ($days < 1) {
            $days = 30;
        } elseif ($days > 365) {
            $days = 365;
        }

        $url = add_query_arg(
            [
                'days' => $days,
            ],
            self::STATS_ENDPOINT
        );

        $response = wp_remote_get(
            $url,
            [
                'timeout' => 10,
                'headers' => [
                    'Accept' => 'application/json',
                ],
            ]
        );

        if (is_wp_error($response)) {
            return false;
        }

        $statusCode = wp_remote_retrieve_response_code($response);
        if ($statusCode !== 200) {
            return false;
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
            return false;
        }

        return $data;
    }

    /**
     * Get cached stats
     *
     * @param array $args Query arguments
     * @param int   $cacheTtl Cache TTL in seconds (default 1 hour)
     * @return array|false
     */
    public static function getCachedStats($args = [], $cacheTtl = HOUR_IN_SECONDS)
    {
        $days = isset($args['days']) ? intval($args['days']) : 30;
        $cacheKey = 'jankx_theme_stats_' . $days;

        $cached = get_transient($cacheKey);
        if ($cached !== false && is_array($cached)) {
            return $cached;
        }

        $stats = self::fetchStats($args);
        if ($stats !== false) {
            set_transient($cacheKey, $stats, $cacheTtl);
        }

        return $stats;
    }

    /**
     * Clear stats cache
     *
     * @return void
     */
    public static function clearCache()
    {
        global $wpdb;

        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
                '_transient_jankx_theme_stats_%'
            )
        );

        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
                '_transient_timeout_jankx_theme_stats_%'
            )
        );
    }
}
