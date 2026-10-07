<?php

namespace Tests\Cache;

use Jankx\Cache\Engine\FilesystemEngine;
use Jankx\Cache\Key\QueryKeyGenerator;
use Jankx\Cache\Query\QueryCache;
use Jankx\Cache\Query\QueryCacheInterceptor;
use Tests\Helpers\TestCase;

/**
 * The transparent WP_Query layer: what is written on a miss, what is replayed
 * on a hit, and which queries must never enter the cache.
 */
class QueryCacheInterceptorTest extends TestCase
{
    /**
     * @var string
     */
    private $directory;

    /**
     * @var QueryCache
     */
    private $cache;

    /**
     * @var QueryCacheInterceptor
     */
    private $interceptor;

    /**
     * @var bool
     */
    private $mockIsAdmin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->mockIsAdmin = isset($GLOBALS['mock_is_admin']) ? (bool) $GLOBALS['mock_is_admin'] : true;
        $GLOBALS['mock_is_admin'] = false;
        unset($GLOBALS['wp_hooks']);

        $config = require dirname(__DIR__, 2) . '/config/cache.php';
        $queryConfig = $config['query'];

        $this->directory = sys_get_temp_dir() . '/jankx-interceptor-test-' . uniqid('', true);
        $this->cache = new QueryCache(
            new FilesystemEngine('jankx', 'cache', $this->directory),
            new QueryKeyGenerator(),
            $queryConfig
        );

        $this->interceptor = new QueryCacheInterceptor(
            $this->cache,
            new QueryKeyGenerator(),
            $queryConfig
        );
    }

    protected function tearDown(): void
    {
        $GLOBALS['mock_is_admin'] = $this->mockIsAdmin;
        $this->removeDirectory($this->directory);
        parent::tearDown();
    }

    public function testRegisterHooksBothFilterStages()
    {
        $this->interceptor->register();

        $this->assertArrayHasKey('posts_pre_query', $GLOBALS['wp_hooks']['filters']);
        $this->assertArrayHasKey('the_posts', $GLOBALS['wp_hooks']['filters']);
    }

    public function testMissLeavesWordPressAlone()
    {
        $query = $this->query();

        $this->assertNull($this->interceptor->serve(null, $query));
    }

    public function testResultIsStoredOnMissAndReplayedOnHit()
    {
        $query = $this->query();
        $posts = [(object) ['ID' => 1], (object) ['ID' => 2]];

        $query->found_posts = 17;
        $query->max_num_pages = 3;

        $this->interceptor->store($posts, $query);

        $hitQuery = $this->query();
        $served = $this->interceptor->serve(null, $hitQuery);

        $this->assertEquals($posts, $served);
        $this->assertSame(17, $hitQuery->found_posts);
        $this->assertSame(3, $hitQuery->max_num_pages);
    }

    public function testHitIsNotWrittenBack()
    {
        $query = $this->query();
        $original = [(object) ['ID' => 1]];
        $this->interceptor->store($original, $query);

        $hitQuery = $this->query();
        $this->interceptor->serve(null, $hitQuery);

        // `the_posts` fires on the cache hit path as well; storing again here
        // would silently drop the plugin filters applied to the served copy.
        $this->interceptor->store([(object) ['ID' => 999]], $hitQuery);

        $replay = $this->query();
        $this->assertEquals($original, $this->interceptor->serve(null, $replay));
    }

    public function testAnotherShortCircuitWins()
    {
        $query = $this->query();
        $this->interceptor->store([(object) ['ID' => 1]], $query);

        $other = [(object) ['ID' => 7]];
        $this->assertSame($other, $this->interceptor->serve($other, $this->query()));
    }

    public function testRandomSqlIsNeverCached()
    {
        $query = $this->query([], 'SELECT * FROM wp_posts ORDER BY RAND()');

        $this->assertFalse($this->interceptor->isCacheable($query));
        $this->interceptor->store([(object) ['ID' => 1]], $query);
        $this->assertNull($this->interceptor->serve(null, $this->query([], 'SELECT * FROM wp_posts ORDER BY RAND()')));
    }

    public function testAdminRequestsAreNotCachedWhenFrontendOnlyIsOn()
    {
        $GLOBALS['mock_is_admin'] = true;
        $query = $this->query();

        $this->assertFalse($this->interceptor->isCacheable($query));

        $GLOBALS['mock_is_admin'] = false;
    }

    public function testNonPublishStatusIsNeverCached()
    {
        foreach (['any', 'private', ['publish', 'draft']] as $status) {
            $query = $this->query(['post_status' => $status]);
            $this->assertFalse($this->interceptor->isCacheable($query), json_encode($status));
        }
    }

    public function testSuppressFiltersAndNoCacheResultsOptOut()
    {
        $this->assertFalse($this->interceptor->isCacheable($this->query(['suppress_filters' => true])));
        $this->assertFalse($this->interceptor->isCacheable($this->query(['cache_results' => false])));
        $this->assertFalse($this->interceptor->isCacheable($this->query(['perm' => 'readable'])));
    }

    public function testQueryWithoutSqlIsNeverCached()
    {
        $query = new \stdClass();
        $query->request = '';
        $query->query_vars = [];

        $this->assertFalse($this->interceptor->isCacheable($query));
    }

    public function testDifferentSqlProducesIndependentEntries()
    {
        $first = $this->query([], 'SELECT * FROM wp_posts WHERE ID = 1');
        $second = $this->query([], 'SELECT * FROM wp_posts WHERE ID = 2');

        $this->interceptor->store([(object) ['ID' => 1]], $first);
        $this->interceptor->store([(object) ['ID' => 2]], $second);

        $this->assertEquals([(object) ['ID' => 1]], $this->interceptor->serve(null, $this->query([], 'SELECT * FROM wp_posts WHERE ID = 1')));
        $this->assertEquals([(object) ['ID' => 2]], $this->interceptor->serve(null, $this->query([], 'SELECT * FROM wp_posts WHERE ID = 2')));
    }

    /**
     * Build a minimal WP_Query look-alike.
     *
     * @param array  $vars Query variables.
     * @param string $sql  Final SQL statement.
     * @return \stdClass
     */
    private function query(array $vars = [], $sql = 'SELECT * FROM wp_posts WHERE post_status = \'publish\'')
    {
        $query = new \stdClass();
        $query->request = $sql;
        $query->query_vars = array_merge([
            'post_status' => 'publish',
            'fields' => '',
            'perm' => '',
        ], $vars);
        $query->found_posts = 0;
        $query->max_num_pages = 0;

        return $query;
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
