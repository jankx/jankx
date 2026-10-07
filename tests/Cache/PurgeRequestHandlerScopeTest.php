<?php

namespace Tests\Cache;

use Jankx\Cache\Contracts\PageCacheInterface;
use Jankx\Cache\Contracts\QueryCacheInterface;
use Jankx\Cache\Purge\PurgeRequestHandler;
use Tests\Helpers\TestCase;

class ExposedPurgeRequestHandler extends PurgeRequestHandler
{
    public function applyScope(): void
    {
        $this->applyRequestedPurge();
    }
}

/**
 * The loopback purge endpoint's scope protocol (`jankx_scope` + tags/urls),
 * which is how Fast-AJAX purges after a write.
 */
class PurgeRequestHandlerScopeTest extends TestCase
{
    /**
     * @var array<string,mixed>
     */
    private $originalGet = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->originalGet = $_GET;
        $_GET = [];
    }

    protected function tearDown(): void
    {
        $_GET = $this->originalGet;

        parent::tearDown();
    }

    public function testAllScopePurgesEveryPageAndTheQueryBucket()
    {
        $page = $this->createMock(PageCacheInterface::class);
        $query = $this->createMock(QueryCacheInterface::class);

        $page->expects($this->once())
            ->method('purge')
            ->with(['all'], [])
            ->willReturn(true);
        $query->expects($this->once())
            ->method('flushBucket')
            ->with('posts')
            ->willReturn(true);

        $_GET['jankx_scope'] = 'all';

        $this->handler($page, $query)->applyScope();
    }

    public function testAllScopeUsesTheConfiguredBucket()
    {
        $page = $this->createMock(PageCacheInterface::class);
        $query = $this->createMock(QueryCacheInterface::class);

        $query->expects($this->once())
            ->method('flushBucket')
            ->with('archive')
            ->willReturn(true);

        $_GET['jankx_scope'] = 'all';

        $this->handler($page, $query, 'archive')->applyScope();
    }

    public function testSelectiveScopePurgesOnlyTheRequestedTagsAndUrls()
    {
        $page = $this->createMock(PageCacheInterface::class);
        $query = $this->createMock(QueryCacheInterface::class);

        $page->expects($this->once())
            ->method('purge')
            ->with(['post-3', 'home'], ['https://nibitour.vn/'])
            ->willReturn(true);
        $query->expects($this->never())->method('flushBucket');

        $_GET['jankx_scope'] = 'selective';
        $_GET['jankx_tags'] = 'post-3, home ,';
        $_GET['jankx_urls'] = 'https://nibitour.vn/';

        $this->handler($page, $query)->applyScope();
    }

    public function testMissingScopeDoesNothing()
    {
        $page = $this->createMock(PageCacheInterface::class);
        $query = $this->createMock(QueryCacheInterface::class);

        $page->expects($this->never())->method('purge');
        $query->expects($this->never())->method('flushBucket');

        $this->handler($page, $query)->applyScope();
    }

    public function testMissingPageCacheOptionDoesNothing()
    {
        $query = $this->createMock(QueryCacheInterface::class);
        $query->expects($this->never())->method('flushBucket');

        $_GET['jankx_scope'] = 'all';

        $handler = new ExposedPurgeRequestHandler(
            new \Jankx\Cache\Purge\LiteSpeedPurgeClient(),
            true,
            ['query' => $query, 'bucket' => 'posts']
        );

        $handler->applyScope();
    }

    private function handler($page, $query, string $bucket = 'posts'): ExposedPurgeRequestHandler
    {
        return new ExposedPurgeRequestHandler(
            new \Jankx\Cache\Purge\LiteSpeedPurgeClient(),
            true,
            ['page' => $page, 'query' => $query, 'bucket' => $bucket]
        );
    }
}
