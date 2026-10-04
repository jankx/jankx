<?php

namespace Jankx\Telemetry;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

/**
 * Weekly theme heartbeat.
 *
 * Wired up in includes/framework.php:
 *  - after_switch_theme / switch_theme hooks manage the weekly cron schedule
 *  - the CRON_HOOK action fires sendPing() once a week while the theme is active
 */
class ThemePing
{
    /**
     * Cron hook name.
     *
     * @var string
     */
    const CRON_HOOK = 'jankx_theme_ping';

    /**
     * Telemetry endpoint. Override with the jankx_telemetry_ping_endpoint filter.
     *
     * @var string
     */
    const PING_ENDPOINT = 'https://jankx.pages.dev/api/ping';

    /**
     * Make sure the weekly ping is scheduled after the theme is activated.
     *
     * @return void
     */
    public static function onThemeActivated()
    {
        self::schedule();
    }

    /**
     * Stop the weekly ping after the theme is deactivated.
     *
     * @return void
     */
    public static function onThemeDeactivated()
    {
        wp_clear_scheduled_hook(self::CRON_HOOK);
    }

    /**
     * Schedule the weekly event if it is not already queued.
     *
     * @return void
     */
    public static function schedule()
    {
        if (!wp_next_scheduled(self::CRON_HOOK)) {
            wp_schedule_event(time(), 'weekly', self::CRON_HOOK);
        }
    }

    /**
     * Send one heartbeat. Fire-and-forget: failures are ignored so cron never
     * stalls, and the event is cancelled when jankx is no longer the theme.
     *
     * @return void
     */
    public static function sendPing()
    {
        // Only report while the Jankx theme is actually in use; stop the
        // recurring event if it was left behind after switching themes.
        if (get_stylesheet() !== 'jankx' && get_template() !== 'jankx') {
            wp_clear_scheduled_hook(self::CRON_HOOK);
            return;
        }

        $endpoint = apply_filters('jankx_telemetry_ping_endpoint', self::PING_ENDPOINT);

        wp_remote_post(
            $endpoint,
            [
                'timeout'    => 5,
                'blocking'   => false,
                'redirection' => 0,
                'headers'    => ['Accept' => 'application/json'],
                'body'       => [
                    'event'        => 'ping',
                    'site'         => home_url('/'),
                    'theme'        => 'jankx',
                    'version'      => wp_get_theme()->get('Version'),
                    'wp_version'   => get_bloginfo('version'),
                    'php_version'  => PHP_VERSION,
                    'stylesheet'   => get_stylesheet(),
                    'template'     => get_template(),
                ],
            ]
        );
    }
}
