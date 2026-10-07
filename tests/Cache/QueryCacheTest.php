<?php

namespace Tests\Cache;

use Jankx\Cache\Engine\FilesystemEngine;
use Jankx\Cache\Key\QueryKeyGenerator;
use Jankx\Cache\Query\QueryCache;
use Tests\Helpers\TestCase;

class QueryCacheTest extends TestCase
{
    /**
     * @var string
     */
    private $directory;

    /**
     * @var FilesystemEngine
     */
    private $engine;

    /**
     * @var QueryCache
     */
    private $cache;

    protected function setUp(): void
    {
        parent::setUp();

        $this->directory = sys_get_temp_dir() . '/jankx-query-test-' . uniqid('', true);
        $this->engine = new FilesystemEngine('jankx', 'cache', $this->directory);
        $this->cache = new QueryCache($this->engine, new QueryKeyGenerator(), [
            'enabled' => true,
            'bucket' => 'posts',
            'ttl' => 60,
        ]);
    }

    protected function tearDown(): void
    {
        $this->removeDirectory($this->directory);
        parent::tearDown();
    }

    public function testDisabledCacheNeverStores()
    {
        $disabled = new QueryCache($this->engine, new QueryKeyGenerator(), ['enabled' => false]);

        $this->assertFalse($disabled->isEnabled());
        $this->assertFalse($disabled->put('k', 'v'));
        $this->assertNull($disabled->get('k'));

        $calls = 0;
        $value = $disabled->remember('k', function () use (&$calls) {
            $calls++;

            return 'computed';
        });

        $this->assertSame('computed', $value);
        $this->assertSame(1, $calls);
        $this->assertNull($disabled->get('k'));
    }

    public function testPutAndGetWithBucketVersioning()
    {
        $key = $this->key('SELECT 1');

        $this->assertTrue($this->cache->put($key, ['rows' => 42]));
        $this->assertSame(['rows' => 42], $this->cache->get($key));
    }

    public function testFlushBucketInvalidatesEveryEntryOfThatBucket()
    {
        $key = $this->key('SELECT 1');
        $this->cache->put($key, 'value');

        $this->cache->flushBucket('posts');

        $this->assertNull($this->cache->get($key));
    }

    public function testOtherBucketsSurviveABucketFlush()
    {
        $postsKey = $this->key('SELECT 1');
        $termsKey = $this->key('SELECT 2', 'terms');

        $this->cache->put($postsKey, 'posts-value');
        $this->cache->put($termsKey, 'terms-value', 60, 'terms');

        $this->cache->flushBucket('posts');

        $this->assertNull($this->cache->get($postsKey));
        $this->assertSame('terms-value', $this->cache->get($termsKey, 'terms'));
    }

    public function testRememberComputesOncePerBucketVersion()
    {
        $key = $this->key('SELECT expensive');
        $calls = 0;

        $producer = function () use (&$calls) {
            $calls++;

            return 'computed-' . $calls;
        };

        $first = $this->cache->remember($key, $producer);
        $second = $this->cache->remember($key, $producer);

        $this->assertSame('computed-1', $first);
        $this->assertSame('computed-1', $second);
        $this->assertSame(1, $calls);

        $this->cache->flushBucket('posts');
        $third = $this->cache->remember($key, $producer);

        $this->assertSame('computed-2', $third);
        $this->assertSame(2, $calls);
    }

    public function testForgetRemovesASingleEntry()
    {
        $key = $this->key('SELECT 3');

        $this->cache->put($key, 'value');
        $this->assertTrue($this->cache->forget($key));
        $this->assertNull($this->cache->get($key));
    }

    public function testFlushClearsTheWholeQueryCache()
    {
        $a = $this->key('SELECT a');
        $b = $this->key('SELECT b', 'terms');

        $this->cache->put($a, 'a');
        $this->cache->put($b, 'b', 60, 'terms');

        $this->cache->flush();

        $this->assertNull($this->cache->get($a));
        $this->assertNull($this->cache->get($b, 'terms'));
    }

    public function testStatsCountHitsAndMisses()
    {
        $key = $this->key('SELECT stats');

        $this->cache->get($key); // miss
        $this->cache->put($key, 'value');
        $this->cache->get($key); // hit
        $this->cache->get($key); // hit

        $stats = $this->cache->stats();

        $this->assertSame(2, $stats['hits']);
        $this->assertSame(1, $stats['misses']);
    }

    public function testSqlContextProducesDifferentKeys()
    {
        $generator = new QueryKeyGenerator();

        $this->assertNotSame(
            $generator->generate('SELECT * FROM wp_posts WHERE id = 1')->value(),
            $generator->generate('SELECT * FROM wp_posts WHERE id = 2')->value()
        );
        $this->assertNotSame(
            $generator->generate('SELECT * FROM wp_posts')->value(),
            $generator->generate('SELECT * FROM wp_posts', ['fields' => 'ids'])->value()
        );
    }

    public function testSqlLayoutDifferencesProduceTheSameKey()
    {
        $generator = new QueryKeyGenerator();

        $compact = 'SELECT ID FROM wp_posts WHERE 1=1  AND post_status = \'publish\' ORDER BY ID DESC';
        $formatted = "SELECT ID\n\t\t\t\t\t FROM wp_posts\n\t\t\t\t\t WHERE 1=1  AND post_status = 'publish'\n\t\t\t\t\t ORDER BY ID DESC";

        $this->assertSame(
            $generator->generate($compact)->value(),
            $generator->generate($formatted)->value()
        );
        $this->assertSame(
            $generator->generate("SELECT 1\n")->value(),
            $generator->generate('SELECT 1   ')->value()
        );
    }

    public function testLiteralSpacingSurvivesNormalization()
    {
        $generator = new QueryKeyGenerator();

        $this->assertNotSame(
            $generator->generate("SELECT ID FROM wp_posts WHERE post_title LIKE '%a  b%'")->value(),
            $generator->generate("SELECT ID FROM wp_posts WHERE post_title LIKE '%a b%'")->value()
        );
    }

    /**
     * @param string $sql    SQL statement.
     * @param string $bucket Bucket name.
     * @return string
     */
    private function key($sql, $bucket = 'posts')
    {
        return (new QueryKeyGenerator())->generate($sql, [])->value() . '|' . $bucket;
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
