<?php

namespace Jankx\Support\Providers;

use Jankx\Cache\CacheManager;
use Jankx\Cache\Engine\EngineFactory;
use Jankx\Cache\Invalidation\ContentInvalidationSubscriber;
use Jankx\Cache\Key\QueryKeyGenerator;
use Jankx\Cache\Page\CacheabilityChainFactory;
use Jankx\Cache\Page\PageCache;
use Jankx\Cache\Page\PageCacheRepository;
use Jankx\Cache\Page\PageCacheRuntime;
use Jankx\Cache\Purge\LiteSpeedPurgeClient;
use Jankx\Cache\Purge\PurgeRequestHandler;
use Jankx\Cache\Query\QueryCache;
use Jankx\Cache\Query\QueryCacheInterceptor;
use Jankx\Cache\Server\ServerDetector;
use Jankx\Cache\Server\ServerIntegrationFactory;
use Jankx\Foundation\Application;

/**
 * Wires the query cache and the page cache into WordPress.
 *
 * Everything is bound in the container (so it can be swapped or faked in
 * tests) and only observed through hooks here: the runtime hooks serve/buffer,
 * the interceptor hooks WP_Query, the subscribers hook content invalidation.
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
 */
class CacheServiceProvider extends ServiceProvider
{
    /**
     * Hook priorities: the purge header goes out first, the page cache is
     * served after WordPress had its chance to redirect (canonical, old
     * slug), and buffering starts once no callback can exit anymore.
     *
     * @var int
     */
    const PRIORITY_PURGE = -1;
    const PRIORITY_SERVE = 11;
    const PRIORITY_BUFFER = 20;

    /**
     * @var array<string,mixed>
     */
    private $config = [];

    /**
     * @inheritdoc
     */
    public function register(Application $app)
    {
        $config = (array) $app['config']->get('cache', []);
        $enabled = !empty($config['enabled']);

        $engineConfig = isset($config['engine']) && is_array($config['engine']) ? $config['engine'] : [];
        $queryConfig = isset($config['query']) && is_array($config['query']) ? $config['query'] : [];
        $pageConfig = isset($config['page']) && is_array($config['page']) ? $config['page'] : [];

        $queryConfig['enabled'] = $enabled && !empty($queryConfig['enabled']);
        $pageConfig['enabled'] = $enabled && !empty($pageConfig['enabled']);

        $this->config = array_merge($config, [
            'engine' => $engineConfig,
            'query' => $queryConfig,
            'page' => $pageConfig,
        ]);

        $app->singleton('cache.engine', static function () use ($engineConfig) {
            return EngineFactory::make($engineConfig);
        });

        $app->singleton('cache.server', static function () use ($pageConfig) {
            $factory = new ServerIntegrationFactory(new ServerDetector(), $pageConfig);

            return $factory->make();
        });

        $app->singleton('cache.page', static function ($app) use ($pageConfig) {
            $keys = CacheabilityChainFactory::makeKeyGenerator($pageConfig);

            return new PageCache(
                new PageCacheRepository($app->make('cache.engine'), $keys, (int) (isset($pageConfig['ttl']) ? $pageConfig['ttl'] : 86400)),
                $app->make('cache.server'),
                CacheabilityChainFactory::makeChain($pageConfig),
                $keys,
                $pageConfig
            );
        });

        $app->singleton('cache.query', static function ($app) use ($queryConfig) {
            return new QueryCache($app->make('cache.engine'), new QueryKeyGenerator(), $queryConfig);
        });

        $app->singleton('cache.page.runtime', static function ($app) use ($pageConfig) {
            return new PageCacheRuntime($app->make('cache.page'), $pageConfig);
        });

        $app->singleton('cache.query.interceptor', static function ($app) use ($queryConfig) {
            return new QueryCacheInterceptor(
                $app->make('cache.query'),
                new QueryKeyGenerator(),
                $queryConfig
            );
        });

        $app->singleton('cache.purge.handler', static function () {
            return new PurgeRequestHandler(new LiteSpeedPurgeClient(), true);
        });

        $app->singleton('cache.invalidator', static function ($app) use ($queryConfig) {
            return new ContentInvalidationSubscriber($app->make('cache.page'), $app->make('cache.query'), $queryConfig);
        });

        $app->singleton('cache.manager', static function ($app) {
            return new CacheManager(
                $app->make('cache.engine'),
                $app->make('cache.page'),
                $app->make('cache.query'),
                $app->make('cache.server'),
                $app['config']->get('cache', [])
            );
        });
    }

    /**
     * @inheritdoc
     */
    public function boot(Application $app)
    {
        if (empty($this->config['enabled'])) {
            return;
        }

        // ── Page cache ────────────────────────────────────────────────────────
        if (!empty($this->config['page']['enabled'])) {
            $runtime = $app->make('cache.page.runtime');
            add_action('template_redirect', [$runtime, 'maybeServe'], self::PRIORITY_SERVE);
            add_action('template_redirect', [$runtime, 'startBuffer'], self::PRIORITY_BUFFER);
        }

        // ── Purge endpoint / queued LSCache purge headers ─────────────────────
        $app->make('cache.purge.handler')->subscribe();

        // ── Query cache ───────────────────────────────────────────────────────
        if (!empty($this->config['query']['enabled'])) {
            $app->make('cache.query.interceptor')->register();
        }

        // ── Content invalidation ──────────────────────────────────────────────
        $app->make('cache.invalidator')->subscribe();
    }

    /**
     * Resolved configuration (useful for debugging/CLI).
     *
     * @return array<string,mixed>
     */
    public function getResolvedConfig(): array
    {
        return $this->config;
    }
}
