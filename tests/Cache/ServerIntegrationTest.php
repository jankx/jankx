<?php

namespace Tests\Cache;

use Jankx\Cache\Page\PageRequest;
use Jankx\Cache\Purge\HttpPurgeClient;
use Jankx\Cache\Purge\LiteSpeedPurgeClient;
use Jankx\Cache\Purge\NullPurgeClient;
use Jankx\Cache\Server\ApacheIntegration;
use Jankx\Cache\Server\GenericIntegration;
use Jankx\Cache\Server\LiteSpeedIntegration;
use Jankx\Cache\Server\NginxIntegration;
use Jankx\Cache\Server\VarnishIntegration;
use Tests\Helpers\TestCase;

/**
 * Each adapter must translate the same freshness decision into the headers
 * its server understands, and into its own purge protocol.
 */
class ServerIntegrationTest extends TestCase
{
    /**
     * @var PageRequest
     */
    private $request;

    protected function setUp(): void
    {
        parent::setUp();
        $this->request = new PageRequest('GET', 'https://nibitour.vn/tour/hanoi/');
    }

    // ── Freshness headers ────────────────────────────────────────────────────

    public function testStorageModeOnlyPromisesRevalidation()
    {
        $headers = (new GenericIntegration(new NullPurgeClient()))
            ->headers($this->request, null, 'miss', ['edge_ttl' => 0, 'browser_ttl' => 0]);

        $this->assertSame('no-cache', $headers['Cache-Control']);
    }

    public function testEdgeModePublishesBothBrowserAndSharedTtl()
    {
        $headers = (new GenericIntegration(new NullPurgeClient()))
            ->headers($this->request, null, 'miss', ['edge_ttl' => 3600, 'browser_ttl' => 60]);

        $this->assertSame('public, max-age=60, s-maxage=3600', $headers['Cache-Control']);
    }

    public function testApacheExpiresMarksUncacheableWhenOnlyStoring()
    {
        $integration = new ApacheIntegration(new NullPurgeClient());
        $headers = $integration->headers($this->request, null, 'miss', ['edge_ttl' => 0, 'browser_ttl' => 300]);

        $this->assertSame('storage', $integration->defaultMode());
        $this->assertSame('0', $headers['Expires']);
    }

    public function testNginxPublishesAccelExpires()
    {
        $integration = new NginxIntegration(new NullPurgeClient());

        $edge = $integration->headers($this->request, null, 'miss', ['edge_ttl' => 3600, 'browser_ttl' => 0]);
        $storage = $integration->headers($this->request, null, 'miss', ['edge_ttl' => 0, 'browser_ttl' => 0]);

        $this->assertSame('both', $integration->defaultMode());
        $this->assertSame('3600', $edge['X-Accel-Expires']);
        $this->assertSame('0', $storage['X-Accel-Expires']);
    }

    public function testLiteSpeedPublishesItsOwnProtocol()
    {
        $integration = new LiteSpeedIntegration(new LiteSpeedPurgeClient());

        $headers = $integration->headers($this->request, null, 'miss', [
            'edge_ttl' => 3600,
            'browser_ttl' => 0,
            'tags' => ['home', 'post-12'],
        ]);

        $this->assertSame('edge', $integration->defaultMode());
        $this->assertTrue($integration->supportsTags());
        $this->assertSame('public', $headers['X-LiteSpeed-Cache']);
        $this->assertSame('3600', $headers['X-LiteSpeed-Ttl']);
        $this->assertSame('home,post-12', $headers['X-LiteSpeed-Tag']);
        $this->assertSame('public, max-age=0, s-maxage=3600', $headers['Cache-Control']);
    }

    public function testLiteSpeedOmitsTagsAndTtlWhenNothingIsKnown()
    {
        $integration = new LiteSpeedIntegration(new LiteSpeedPurgeClient());
        $headers = $integration->headers($this->request, null, 'miss', ['edge_ttl' => 0]);

        $this->assertArrayNotHasKey('X-LiteSpeed-Ttl', $headers);
        $this->assertArrayNotHasKey('X-LiteSpeed-Tag', $headers);
    }

    public function testVarnishPublishesEdgeHeadersOnly()
    {
        $integration = new VarnishIntegration(new HttpPurgeClient(['endpoint' => 'http://cache.local/purge']));
        $headers = $integration->headers($this->request, null, 'miss', ['edge_ttl' => 120, 'browser_ttl' => 0]);

        $this->assertSame('edge', $integration->defaultMode());
        $this->assertSame('public, max-age=0, s-maxage=120', $headers['Cache-Control']);
        $this->assertArrayNotHasKey('X-Accel-Expires', $headers);
    }

    public function testEmptyValueSuppressesTheBaseHeader()
    {
        // Used when someone else owns Cache-Control (the LiteSpeed Cache plugin):
        // the page cache drops empty values, leaving the other header intact.
        $integration = new class(new NullPurgeClient()) extends \Jankx\Cache\Server\AbstractServerIntegration {
            public function __construct($client)
            {
                parent::__construct($client, 'custom', 'storage', false);
            }

            protected function serverHeaders(PageRequest $request, ?\Jankx\Cache\Page\PageCacheEntry $entry, string $state, array $options): array
            {
                return ['Cache-Control' => ''];
            }
        };

        $headers = $integration->headers($this->request, null, 'miss', ['edge_ttl' => 3600]);

        $this->assertSame('', $headers['Cache-Control']);
    }

    // ── Purge protocol ───────────────────────────────────────────────────────

    public function testNullClientReportsSuccessForServersWithoutPurge()
    {
        $integration = new GenericIntegration(new NullPurgeClient());

        $this->assertTrue($integration->purge(['all'], ['https://nibitour.vn/'], []));
        $this->assertFalse($integration->supportsTags());
    }

    public function testLiteSpeedPurgesByTags()
    {
        $client = new class implements \Jankx\Cache\Contracts\PurgeClientInterface {
            public $tags = [];
            public $urls = [];
            public $all = 0;

            public function purgeAll(): bool
            {
                $this->all++;

                return true;
            }

            public function purgeUrls(array $urls): bool
            {
                $this->urls = $urls;

                return true;
            }

            public function purgeTags(array $tags): bool
            {
                $this->tags = $tags;

                return true;
            }
        };

        $integration = new LiteSpeedIntegration($client);

        $this->assertTrue($integration->purge(['post-5'], ['https://nibitour.vn/?p=5'], []));
        $this->assertSame(['post-5'], $client->tags);
        $this->assertSame(0, $client->all);
    }

    public function testVarnishFallsBackToUrlsBecauseTagBanNeedsCustomVcl()
    {
        $client = new class implements \Jankx\Cache\Contracts\PurgeClientInterface {
            public $tags = [];
            public $urls = [];

            public function purgeAll(): bool
            {
                return true;
            }

            public function purgeUrls(array $urls): bool
            {
                $this->urls = $urls;

                return true;
            }

            public function purgeTags(array $tags): bool
            {
                $this->tags = $tags;

                return true;
            }
        };

        $integration = new VarnishIntegration($client);

        $this->assertTrue($integration->purge(['post-5'], ['https://nibitour.vn/tour/hanoi/'], []));
        $this->assertSame(['https://nibitour.vn/tour/hanoi/'], $client->urls);
        $this->assertSame([], $client->tags);
    }

    public function testPurgeClientIsReachableForDebugging()
    {
        $integration = new GenericIntegration(new NullPurgeClient());

        $this->assertInstanceOf(NullPurgeClient::class, $integration->purgeClient());
    }
}
