<?php

namespace Jankx\Foundation\Cli\Commands;

use Jankx\Foundation\Application;
use Jankx\Support\Opcache\Warmup;
use WP_CLI;
use WP_CLI_Command;

/**
 * Jankx Cache Management Commands
 *
 * @package Jankx\Foundation\Cli\Commands
 * @since 1.0.0
 */
class CacheCommand extends WP_CLI_Command
{
    /**
     * Clear all Jankx caches
     *
     * ## EXAMPLES
     *
     *     wp jankx cache clear
     *
     * @when after_wp_load
     */
    public function clear()
    {
        $this->clearConfigCache();
        $this->clearBlockCache();
        $this->clearUserCache();
        $this->clearExtensionCache();

        WP_CLI::success('All Jankx caches cleared successfully!');
    }

    /**
     * Clear config cache
     *
     * ## EXAMPLES
     *
     *     wp jankx cache clear-config
     *
     * @when after_wp_load
     */
    public function clear_config()
    {
        $this->clearConfigCache();
        WP_CLI::success('Config cache cleared successfully!');
    }

    /**
     * Clear block cache
     *
     * ## EXAMPLES
     *
     *     wp jankx cache clear-blocks
     *
     * @when after_wp_load
     */
    public function clear_blocks()
    {
        $this->clearBlockCache();
        WP_CLI::success('Block cache cleared successfully!');
    }


    /**
     * Clear user cache
     *
     * ## EXAMPLES
     *
     *     wp jankx cache clear-users
     *
     * @when after_wp_load
     */
    public function clear_users()
    {
        $this->clearUserCache();
        WP_CLI::success('User cache cleared successfully!');
    }

    /**
     * Show cache status
     *
     * ## EXAMPLES
     *
     *     wp jankx cache status
     *
     * @when after_wp_load
     */
    public function status()
    {
        $status = [
            'config' => $this->getCacheStatus('jankx_config'),
            'blocks' => $this->getCacheStatus('jankx_blocks'),
            'widgets' => $this->getCacheStatus('jankx_widgets'),
            'users' => $this->getCacheStatus('jankx_users'),
            'extensions' => $this->getTransientStatus('jankx_extensions_dirs_' . get_stylesheet())
        ];

        WP_CLI::log('Jankx Cache Status:');
        WP_CLI::log('');

        foreach ($status as $type => $info) {
            $status = $info['count'] > 0 ? 'Active' : 'Empty';
            WP_CLI::log(sprintf('  %s: %s (%d items)', ucfirst($type), $status, $info['count']));
        }

        // Cache system (query cache + page cache) resolved status.
        $this->report($this->cacheManager());
    }

    /**
     * Purge the page cache and the query cache.
     *
     * Without arguments everything is invalidated: rendered pages (storage and
     * the edge cache), every cached query and the storage engine itself.
     *
     * ## OPTIONS
     *
     * [--tags=<tags>]
     * : Comma separated cache tags to purge, e.g. `post-12,type-post,home`.
     *   When given (or when --url is given) only a selective purge runs.
     *
     * [--url=<url>]
     * : Comma separated absolute URLs to purge.
     *
     * ## EXAMPLES
     *
     *     wp jankx cache purge
     *     wp jankx cache purge --tags=post-12,home
     *     wp jankx cache purge --url=https://nibitour.vn/tour/hanoi/
     *
     * @when after_wp_load
     *
     * @param array $args       Positional arguments.
     * @param array $assoc_args Associative arguments.
     */
    public function purge($args, $assoc_args)
    {
        $manager = $this->cacheManager();

        $selective = !empty($assoc_args['tags']) || !empty($assoc_args['url']);

        if ($selective) {
            $tags = !empty($assoc_args['tags'])
                ? array_values(array_filter(array_map('trim', explode(',', (string) $assoc_args['tags']))))
                : [];
            $urls = !empty($assoc_args['url'])
                ? array_values(array_filter(array_map('trim', explode(',', (string) $assoc_args['url']))))
                : [];

            $ok = $manager->purge($tags, $urls);

            WP_CLI::log(sprintf(
                'Selective purge — tags: %s | urls: %s',
                $tags ? implode(', ', $tags) : '(none)',
                $urls ? implode(', ', $urls) : '(none)'
            ));
        } else {
            $ok = $manager->clearAll();
            WP_CLI::log('Full purge — page cache, query cache and storage.');
        }

        $this->report($manager);

        if (!$ok) {
            WP_CLI::warning('Some cache layers did not confirm the purge (the edge purge endpoint may be unconfigured).');
        }

        if ($ok) {
            WP_CLI::success('Cache purged.');
        }
    }

    /**
     * Warm OPcache with the theme manifest (or validate it in this SAPI).
     *
     * Compiles every file of the theme (framework, child theme, autoload maps)
     * into OPcache when OPcache is running — this SAPI usually has it off, in
     * which case the manifest is validated instead and the php.ini lines for
     * the real warm boot (`opcache.preload`) are printed.
     *
     * ## OPTIONS
     *
     * [--ini]
     * : Print the ready-to-paste php.ini snippet.
     *
     * ## EXAMPLES
     *
     *     wp jankx cache warmup
     *     wp jankx cache warmup --ini
     *
     * @when after_wp_load
     *
     * @param array $args       Positional arguments.
     * @param array $assoc_args Associative arguments.
     */
    public function warmup($args, $assoc_args)
    {
        $themeDir = get_template_directory();
        $warmup = new Warmup(Warmup::themeDirs($themeDir));
        $files = $warmup->manifest();

        WP_CLI::log(sprintf('OPcache warmup — %d files from %s', count($files), $themeDir));

        if (Warmup::isStarted()) {
            $stats = $warmup->compile($files);

            WP_CLI::log(sprintf(
                'Compiled %d files (%d failed) in %.2fs.',
                $stats['compiled'],
                $stats['failed'],
                $stats['elapsed']
            ));

            foreach (array_slice($stats['messages'], 0, 5) as $message) {
                WP_CLI::warning($message);
            }
        } else {
            $stats = $warmup->validate($files);

            WP_CLI::log(sprintf(
                'OPcache is not started in SAPI "%s" — validated %d/%d readable files instead.',
                PHP_SAPI,
                $stats['readable'],
                count($files)
            ));

            foreach (array_slice($stats['missing'], 0, 5) as $missing) {
                WP_CLI::warning('Missing: ' . $missing);
            }
        }

        if (!empty($assoc_args['ini']) || !Warmup::isStarted()) {
            WP_CLI::log('');
            WP_CLI::log('Warm boot for the web SAPI (php.ini):');
            foreach (Warmup::iniSnippet($themeDir . '/opcache-preload.php', count($files)) as $line) {
                WP_CLI::log('  ' . $line);
            }
        }

        WP_CLI::log('');
        WP_CLI::log('OPcache: ' . Warmup::summaryLine());

        if (Warmup::isStarted() && $stats['failed'] === 0) {
            WP_CLI::success('OPcache warmed.');
        }
    }

    /**
     * @return \Jankx\Cache\CacheManager
     */
    protected function cacheManager()
    {
        $app = Application::getInstance();

        if (!$app->bound('cache.manager')) {
            WP_CLI::error('The Jankx cache system is not registered (is cache.enabled true in config/cache.php?).');
        }

        return $app->make('cache.manager');
    }

    /**
     * @param \Jankx\Cache\CacheManager $manager Cache manager.
     * @return void
     */
    protected function report($manager)
    {
        $status = $manager->status();

        WP_CLI::log('');
        WP_CLI::log(sprintf(
            'Engine : %s%s',
            $status['engine']['driver'],
            $status['engine']['persistent'] ? ' (persistent)' : ' (per-request unless files)'
        ));
        WP_CLI::log(sprintf(
            'Page   : %s | mode %s | server %s | storage %s | edge %s',
            $status['page']['enabled'] ? 'enabled' : 'disabled',
            $status['page']['mode'],
            $status['page']['server'],
            $status['page']['storage'] ? 'on' : 'off',
            $status['page']['edge'] ? 'on' : 'off'
        ));
        WP_CLI::log(sprintf(
            'Query  : %s | hits %d | misses %d',
            $status['query']['enabled'] ? 'enabled' : 'disabled',
            (int) $status['query']['stats']['hits'],
            (int) $status['query']['stats']['misses']
        ));
        WP_CLI::log(sprintf('OPcache: %s', Warmup::summaryLine()));
        WP_CLI::log('');
    }

    /**
     * Clear config cache
     */
    protected function clearConfigCache()
    {
        if (class_exists('Jankx\Foundation\Bootstrap\LoadConfiguration')) {
            \Jankx\Foundation\Bootstrap\LoadConfiguration::clearConfigCache();
        } else {
            wp_cache_flush_group('jankx_config');
        }
    }

    /**
     * Clear block cache
     */
    protected function clearBlockCache()
    {
        if (class_exists('Jankx\Support\Providers\GutenbergServiceProvider')) {
            \Jankx\Support\Providers\GutenbergServiceProvider::clearBlockCache();
        } else {
            wp_cache_flush_group('jankx_blocks');
        }
    }

    /**
     * Clear user cache
     */
    protected function clearUserCache()
    {
        wp_cache_flush_group('jankx_users');
    }

    /**
     * Clear extension cache
     */
    protected function clearExtensionCache()
    {
        $themeSlug = get_stylesheet();
        delete_transient('jankx_extensions_dirs_' . $themeSlug);
    }

    /**
     * Get cache status for a group
     *
     * @param string $group Cache group
     * @return array
     */
    protected function getCacheStatus($group)
    {
        global $wp_object_cache;

        $count = 0;
        $size = 0;

        if (isset($wp_object_cache->cache) && is_array($wp_object_cache->cache)) {
            foreach ($wp_object_cache->cache as $key => $value) {
                if (strpos($key, $group) === 0) {
                    $count++;
                    $size += strlen(serialize($value));
                }
            }
        }

        return [
            'count' => $count,
            'size' => $size
        ];
    }

    /**
     * Get transient status
     *
     * @param string $key Transient key
     * @return array
     */
    protected function getTransientStatus($key)
    {
        $value = get_transient($key);
        return [
            'count' => $value === false ? 0 : count((array) $value),
            'size' => $value === false ? 0 : strlen(serialize($value))
        ];
    }
}
