<?php

namespace Tests\Cache;

use Jankx\Cache\Engine\FilesystemEngine;
use Jankx\Cache\Page\CacheabilityChainFactory;
use Jankx\Cache\Page\PageCache;
use Jankx\Cache\Page\PageCacheRepository;
use Jankx\Cache\Page\PageRequest;
use Jankx\Cache\Purge\NullPurgeClient;
use Jankx\Cache\Server\GenericIntegration;
use Jankx\Cache\Server\ServerIntegrationFactory;
use Jankx\Cache\Server\ServerDetector;
use Tests\Helpers\TestCase;

class PageCacheTest extends TestCase
{
    /**
     * @var string
     */
    private $directory;

    /**
     * @var array<string,mixed>
     */
    private $pageConfig;

    protected function setUp(): void
    {
        parent::setUp();

        $config = require dirname(__DIR__, 2) . '/config/cache.php';
        $this->pageConfig = $config['page'];
        $this->directory = sys_get_temp_dir() . '/jankx-page-test-' . uniqid('', true);
    }

    protected function tearDown(): void
    {
        $this->removeDirectory($this->directory);
        parent::tearDown();
    }

    // ── Mode resolution ──────────────────────────────────────────────────────

    public function testAutoModeFollowsTheServer()
    {
        $expectations = [
            'generic' => 'storage',
            'apache' => 'storage',
            'nginx' => 'both',
            'litespeed' => 'edge',
            'varnish' => 'edge',
        ];

        foreach ($expectations as $server => $mode) {
            $this->assertSame($mode, $this->pageCache(['server' => $server])->mode(), $server);
        }
    }

    public function testExplicitModeWinsOverTheServer()
    {
        $this->assertSame('edge', $this->pageCache(['server' => 'apache', 'mode' => 'edge'])->mode());
        $this->assertSame('storage', $this->pageCache(['server' => 'litespeed', 'mode' => 'storage'])->mode());
    }

    public function testUsesStorageAndEdgeFlags()
    {
        $storage = $this->pageCache(['mode' => 'storage']);
        $edge = $this->pageCache(['mode' => 'edge']);
        $both = $this->pageCache(['mode' => 'both']);

        $this->assertTrue($storage->usesStorage());
        $this->assertFalse($storage->usesEdge());
        $this->assertFalse($edge->usesStorage());
        $this->assertTrue($edge->usesEdge());
        $this->assertTrue($both->usesStorage());
        $this->assertTrue($both->usesEdge());
    }

    // ── Serve / store ────────────────────────────────────────────────────────

    public function testStoreAndServeRoundTrip()
    {
        $cache = $this->pageCache();
        $request = $this->request();

        $this->assertTrue($cache->store($request, '<html>tour</html>', 200, 'text/html; charset=UTF-8'));

        $entry = $cache->maybeServe($request);

        $this->assertNotNull($entry);
        $this->assertSame('<html>tour</html>', $entry->html());
        $this->assertSame(200, $entry->status());

        $headers = $cache->headers($request, $entry, PageCache::STATE_HIT);
        $this->assertSame('HIT', $headers['X-Jankx-Cache']);
    }

    public function testUnknownUrlIsAMiss()
    {
        $cache = $this->pageCache();
        $cache->store($this->request(), '<html>a</html>', 200, 'text/html');

        $this->assertNull($cache->maybeServe($this->request([], ['https://nibitour.vn/tour/sapa/'])));
    }

    public function testNonOkResponsesAreNeverStored()
    {
        $cache = $this->pageCache();

        $this->assertFalse($cache->store($this->request(), '<html>404</html>', 404, 'text/html'));
        $this->assertNull($cache->maybeServe($this->request()));
    }

    public function testEdgeOnlyModeStoresNothing()
    {
        $cache = $this->pageCache(['mode' => 'edge']);

        $this->assertFalse($cache->store($this->request(), '<html>x</html>', 200, 'text/html'));
        $this->assertNull($cache->maybeServe($this->request()));
    }

    public function testDisabledCacheNeverStores()
    {
        $cache = $this->pageCache(['enabled' => false]);

        $this->assertFalse($cache->store($this->request(), '<html>x</html>', 200, 'text/html'));
        $this->assertNull($cache->maybeServe($this->request()));
    }

    public function testPurgeDropsStoredPages()
    {
        $cache = $this->pageCache();
        $cache->store($this->request(), '<html>x</html>', 200, 'text/html');

        $this->assertTrue($cache->purge(['all'], ['https://nibitour.vn/']));
        $this->assertNull($cache->maybeServe($this->request()));
    }

    // ── Headers ──────────────────────────────────────────────────────────────

    public function testDisabledCacheSendsNoStoreHeaders()
    {
        $headers = $this->pageCache(['enabled' => false])
            ->headers($this->request(), null, PageCache::STATE_MISS);

        $this->assertSame('no-store, no-cache, must-revalidate', $headers['Cache-Control']);
        $this->assertSame('MISS', $headers['X-Jankx-Cache']);
    }

    public function testPersonalisedResponseIsNeverPublishable()
    {
        $cache = $this->pageCache(['mode' => 'both', 'edge_ttl' => 3600, 'browser_ttl' => 60]);
        $request = $this->request([PageRequest::CONTEXT_LOGGED_IN => true]);

        foreach ([PageCache::STATE_BYPASS, PageCache::STATE_MISS, PageCache::STATE_HIT] as $state) {
            $headers = $cache->headers($request, null, $state);
            $this->assertSame('no-store, private', $headers['Cache-Control'], $state);
            $this->assertStringNotContainsString('s-maxage', $headers['Cache-Control'], $state);
        }
    }

    public function testStorageModePromisesOnlyRevalidation()
    {
        $cache = $this->pageCache(['mode' => 'storage', 'edge_ttl' => 3600, 'browser_ttl' => 0]);
        $headers = $cache->headers($this->request(), null, PageCache::STATE_MISS);

        // edge_ttl is zeroed by the page cache when the mode has no edge.
        $this->assertSame('no-cache', $headers['Cache-Control']);
    }

    public function testBothModePublishesEdgeFreshness()
    {
        $cache = $this->pageCache(['mode' => 'both', 'edge_ttl' => 3600, 'browser_ttl' => 60]);
        $headers = $cache->headers($this->request(), null, PageCache::STATE_MISS);

        $this->assertSame('public, max-age=60, s-maxage=3600', $headers['Cache-Control']);
    }

    public function testConfiguredVaryHeadersArePublished()
    {
        $cache = $this->pageCache(['vary_headers' => ['Cookie']]);
        $headers = $cache->headers($this->request(), null, PageCache::STATE_MISS);

        $this->assertSame('Cookie', $headers['Vary']);
    }

    public function testTagsOfTheResponseAreHandedToTheServer()
    {
        $cache = $this->pageCache(['server' => 'litespeed', 'mode' => 'edge', 'edge_ttl' => 3600]);
        $request = $this->request();

        $headers = $cache->headers($request, null, PageCache::STATE_MISS);

        $this->assertSame('public', $headers['X-LiteSpeed-Cache']);
        $this->assertSame('3600', $headers['X-LiteSpeed-Ttl']);
        $this->assertStringContainsString('all', $headers['X-LiteSpeed-Tag']);
        $this->assertStringContainsString('home', $headers['X-LiteSpeed-Tag']);
    }

    public function testCacheKeyIsExposedForDebugging()
    {
        $cache = $this->pageCache();

        $this->assertNotSame('', $cache->keyFor($this->request()));
        $this->assertNotSame(
            $cache->keyFor($this->request()),
            $cache->keyFor($this->request([], ['https://nibitour.vn/tour/sapa/']))
        );
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    /**
     * @param array<string,mixed> $overrides Overrides of cache.page.
     * @return PageCache
     */
    private function pageCache(array $overrides = []): PageCache
    {
        $config = array_merge($this->pageConfig, $overrides);
        $keys = CacheabilityChainFactory::makeKeyGenerator($config);
        $engine = new FilesystemEngine('jankx', 'cache', $this->directory);

        $server = isset($config['server']) && $config['server'] !== 'auto'
            ? (new ServerIntegrationFactory(new ServerDetector(), $config))->make()
            : new GenericIntegration(new NullPurgeClient());

        return new PageCache(
            new PageCacheRepository($engine, $keys, (int) $config['ttl']),
            $server,
            CacheabilityChainFactory::makeChain($config),
            $keys,
            $config
        );
    }

    /**
     * @param array  $context Request context flags.
     * @param array  $query   Query string (or a full URL as first element).
     * @param array  $cookies Request cookies.
     * @return PageRequest
     */
    private function request(array $context = [], array $query = [], array $cookies = []): PageRequest
    {
        $url = 'https://nibitour.vn/tour/hanoi/';

        if (isset($query[0]) && is_string($query[0])) {
            $url = (string) array_shift($query);
        }

        return new PageRequest('GET', $url, $query, $cookies, [], $context);
    }

    /**
     * @param string $directory Directory to remove.
     * @return void
     */
    private function removeDirectory(string $directory): void
    {
        if (!is_dir($directory)) {
            return;
        }

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($iterator as $item) {
            $item->isDir() ? @rmdir($item->getPathname()) : @unlink($item->getPathname());
        }

        @rmdir($directory);
    }
}
