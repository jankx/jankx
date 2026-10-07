<?php

namespace Jankx\Cache\Page;

use Jankx\Cache\Contracts\PageCacheInterface;
use Jankx\Cache\Contracts\PageCacheRepositoryInterface;
use Jankx\Cache\Contracts\RequestKeyGeneratorInterface;
use Jankx\Cache\Contracts\ServerIntegrationInterface;

/**
 * Full page cache orchestrator.
 *
 * Knows *when* a page may be served/stored (rules chain) and *which headers*
 * publish it to the web server, but delegates both "where it is stored" and
 * "how the server is told" to injected collaborators — Strategy everywhere.
 *
 * @package Jankx\Cache\Page
 * @since 2.0.0
 */
class PageCache implements PageCacheInterface
{
    const STATE_HIT = 'hit';
    const STATE_MISS = 'miss';
    const STATE_STORE = 'store';
    const STATE_BYPASS = 'bypass';

    const MODE_STORAGE = 'storage';
    const MODE_EDGE = 'edge';
    const MODE_BOTH = 'both';

    /**
     * @var PageCacheRepositoryInterface
     */
    private $repository;

    /**
     * @var ServerIntegrationInterface
     */
    private $server;

    /**
     * @var CacheabilityChain
     */
    private $chain;

    /**
     * @var RequestKeyGeneratorInterface
     */
    private $keys;

    /**
     * @var array<string,mixed>
     */
    private $options;

    /**
     * @param PageCacheRepositoryInterface  $repository Page storage.
     * @param ServerIntegrationInterface    $server     Web server adapter.
     * @param CacheabilityChain             $chain      Rules chain.
     * @param RequestKeyGeneratorInterface  $keys       Page key generator.
     * @param array<string,mixed>           $options    cache.page configuration.
     */
    public function __construct(
        PageCacheRepositoryInterface $repository,
        ServerIntegrationInterface $server,
        CacheabilityChain $chain,
        RequestKeyGeneratorInterface $keys,
        array $options = []
    ) {
        $this->repository = $repository;
        $this->server = $server;
        $this->chain = $chain;
        $this->keys = $keys;
        $this->options = $options;
    }

    /**
     * @inheritdoc
     */
    public function isEnabled(): bool
    {
        return !empty($this->options['enabled']);
    }

    /**
     * @inheritdoc
     */
    public function mode(): string
    {
        $mode = isset($this->options['mode']) ? (string) $this->options['mode'] : 'auto';
        if ($mode === 'auto') {
            $mode = $this->server->defaultMode();
        }

        if (!in_array($mode, [self::MODE_STORAGE, self::MODE_EDGE, self::MODE_BOTH], true)) {
            $mode = self::MODE_STORAGE;
        }

        return $mode;
    }

    /**
     * Whether locally stored pages take part in this mode.
     *
     * @return bool
     */
    public function usesStorage(): bool
    {
        $mode = $this->mode();

        return $mode === self::MODE_STORAGE || $mode === self::MODE_BOTH;
    }

    /**
     * Whether cacheable headers are published for this mode.
     *
     * @return bool
     */
    public function usesEdge(): bool
    {
        $mode = $this->mode();

        return $mode === self::MODE_EDGE || $mode === self::MODE_BOTH;
    }

    /**
     * @return CacheabilityChain
     */
    public function chain(): CacheabilityChain
    {
        return $this->chain;
    }

    /**
     * @return ServerIntegrationInterface
     */
    public function server(): ServerIntegrationInterface
    {
        return $this->server;
    }

    /**
     * @inheritdoc
     */
    public function maybeServe(PageRequest $request): ?PageCacheEntry
    {
        if (!$this->isEnabled() || !$this->usesStorage()) {
            return null;
        }

        if (!$this->chain->allows($request)) {
            return null;
        }

        return $this->repository->find($request);
    }

    /**
     * @inheritdoc
     */
    public function store(PageRequest $request, string $html, int $status, string $contentType): bool
    {
        if (!$this->isEnabled() || !$this->usesStorage()) {
            return false;
        }

        if ($html === '' || $status !== 200) {
            return false;
        }

        if (!$this->chain->allows($request)) {
            return false;
        }

        $entry = new PageCacheEntry(
            $html,
            $status,
            $contentType,
            $this->tagsFor($request),
            time(),
            isset($this->options['ttl']) ? (int) $this->options['ttl'] : 86400
        );

        return $this->repository->put($request, $entry);
    }

    /**
     * @inheritdoc
     */
    public function headers(PageRequest $request, ?PageCacheEntry $entry, string $state): array
    {
        $headers = [];
        $headers['X-Jankx-Cache'] = $state === self::STATE_HIT ? 'HIT' : ($state === self::STATE_BYPASS ? 'BYPASS' : 'MISS');

        if (!$this->isEnabled()) {
            $headers['Cache-Control'] = 'no-store, no-cache, must-revalidate';
            return $headers;
        }

        if (!$this->chain->allows($request)) {
            // Personalised / excluded response: nobody may reuse it — not the
            // browser, not a shared cache, not this cache.
            $headers['Cache-Control'] = 'no-store, private';

            return $headers;
        }

        $options = $this->options;
        if (!$this->usesEdge()) {
            $options['edge_ttl'] = 0;
        }
        // Tags of the response about to be (or just) cached — servers such as
        // LiteSpeed need them in this very response to index the entry.
        $options['tags'] = $entry !== null && !empty($entry->tags()) ? $entry->tags() : $this->tagsFor($request);

        $serverHeaders = $this->server->headers($request, $entry, $state, $options);
        foreach ($serverHeaders as $name => $value) {
            if ($value !== '') {
                $headers[$name] = $value;
            }
        }

        $vary = isset($options['vary_headers']) ? (array) $options['vary_headers'] : [];
        if (!empty($vary) && empty($headers['Vary'])) {
            $headers['Vary'] = implode(', ', $vary);
        }

        return $headers;
    }

    /**
     * @inheritdoc
     */
    public function purge(array $tags = [], array $urls = []): bool
    {
        $ok = true;

        if ($this->usesStorage()) {
            $ok = $this->repository->purgeAll() && $ok;
        }

        if ($this->usesEdge()) {
            $ok = $this->server->purge($tags, $urls, $this->options) && $ok;
        }

        return $ok;
    }

    /**
     * Tags published with the page (used by LiteSpeed/Varnish tag purge).
     *
     * @param PageRequest $request Requested page.
     * @return string[]
     */
    public function tagsFor(PageRequest $request): array
    {
        $tags = ['all', 'home'];

        if ($request->path() === '/') {
            $tags[] = 'front-page';
        } else {
            $tags[] = 'url' . md5($request->path());
        }

        $queried = function_exists('get_queried_object') ? get_queried_object() : null;
        if (is_object($queried)) {
            if ($queried instanceof \WP_Post) {
                $tags[] = 'post-' . (int) $queried->ID;
                $tags[] = 'type-' . $queried->post_type;
            } elseif ($queried instanceof \WP_Term) {
                $tags[] = 'term-' . (int) $queried->term_id;
                $tags[] = 'taxonomy-' . $queried->taxonomy;
            } elseif ($queried instanceof \WP_User) {
                $tags[] = 'author-' . (int) $queried->ID;
            } elseif ($queried instanceof \WP_Post_Type) {
                $tags[] = 'type-' . $queried->name;
            }
        }

        return array_values(array_unique($tags));
    }

    /**
     * Resolved cache key of a request (exposed for debugging/CLI).
     *
     * @param PageRequest $request Requested page.
     * @return string
     */
    public function keyFor(PageRequest $request): string
    {
        return $this->keys->generate($request)->value();
    }
}
