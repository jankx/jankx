<?php

namespace Tests\Cache;

use Jankx\Cache\Purge\HttpPurgeClient;
use Jankx\Cache\Purge\LiteSpeedPurgeClient;
use Jankx\Cache\Purge\NullPurgeClient;
use Tests\Helpers\TestCase;

class PurgeClientTest extends TestCase
{
    /**
     * @var mixed
     */
    private $originalEdition;

    protected function setUp(): void
    {
        parent::setUp();
        unset($GLOBALS['options']);
        $GLOBALS['options'] = [];

        $this->originalEdition = isset($_SERVER['LSWS_EDITION']) ? $_SERVER['LSWS_EDITION'] : null;
        unset($_SERVER['LSWS_EDITION']);
    }

    protected function tearDown(): void
    {
        if ($this->originalEdition === null) {
            unset($_SERVER['LSWS_EDITION']);
        } else {
            $_SERVER['LSWS_EDITION'] = $this->originalEdition;
        }

        parent::tearDown();
    }

    // ── HTTP transport (Varnish / nginx) ─────────────────────────────────────

    public function testRequestIsEmptyWhenNoEndpointIsConfigured()
    {
        $client = new HttpPurgeClient(['endpoint' => '']);

        $this->assertSame([], $client->buildRequest('https://nibitour.vn/'));
        $this->assertFalse($client->purgeAll());
    }

    public function testBuildRequestReplacesTheUrlPlaceholder()
    {
        $client = new HttpPurgeClient([
            'endpoint' => 'http://cache.local/purge/{url}',
            'method' => 'ban',
        ]);

        $request = $client->buildRequest('https://nibitour.vn/tour/hanoi/');

        $this->assertSame('http://cache.local/purge/https://nibitour.vn/tour/hanoi/', $request['url']);
        $this->assertSame('BAN', $request['method']);
        $this->assertArrayNotHasKey('X-Purge-Tags', $request['headers']);
    }

    public function testBuildRequestCarriesTokenAndTags()
    {
        $client = new HttpPurgeClient([
            'endpoint' => 'http://cache.local/purge',
            'token' => 'secret',
            'header' => 'X-Purge-Token',
        ]);

        $request = $client->buildRequest('', ['home', 'post-1']);

        $this->assertSame('http://cache.local/purge', $request['url']);
        $this->assertSame('secret', $request['headers']['X-Purge-Token']);
        $this->assertSame('home,post-1', $request['headers']['X-Purge-Tags']);
    }

    public function testSendWithoutWordPressReturnsFalse()
    {
        $client = new HttpPurgeClient(['endpoint' => 'http://cache.local/purge']);

        $this->assertTrue($client->buildRequest() !== []);
        // No wp_remote_request in the test process: an unpurgeable transport
        // must report failure rather than pretend it worked.
        if (!function_exists('wp_remote_request')) {
            $this->assertFalse($client->send($client->buildRequest()));
        }
    }

    public function testNullClientIsAlwaysHappy()
    {
        $client = new NullPurgeClient();

        $this->assertTrue($client->purgeAll());
        $this->assertTrue($client->purgeUrls(['https://nibitour.vn/']));
        $this->assertTrue($client->purgeTags(['home']));
    }

    // ── LiteSpeed transport (queued headers) ─────────────────────────────────

    public function testPluginIsNotActiveInTestEnvironment()
    {
        $this->assertFalse(LiteSpeedPurgeClient::isPluginActive());
    }

    public function testTagsAreQueuedUntilTheNextResponse()
    {
        $client = new LiteSpeedPurgeClient(['active_trigger' => false]);

        $this->assertTrue($client->purgeTags(['post-12', 'home']));
        $this->assertSame(['post-12', 'home'], $GLOBALS['options'][LiteSpeedPurgeClient::PENDING_OPTION]);

        $headers = $client->pendingHeaders();

        $this->assertSame('public, post-12, home', $headers['X-LiteSpeed-Purge']);
        $this->assertArrayNotHasKey(LiteSpeedPurgeClient::PENDING_OPTION, $GLOBALS['options']);
        $this->assertSame([], $client->pendingHeaders());
    }

    public function testQueueMergesAndSanitizesTags()
    {
        $client = new LiteSpeedPurgeClient(['active_trigger' => false]);

        $client->purgeTags(['post-12', 'home']);
        $client->purgeTags(['post-12', 'type-tour', 'bad tag!']);

        $pending = $GLOBALS['options'][LiteSpeedPurgeClient::PENDING_OPTION];

        $this->assertSame(['post-12', 'home', 'type-tour', 'badtag'], $pending);
    }

    public function testPurgeAllQueuesTheAllTagWhenNoPluginIsAvailable()
    {
        $client = new LiteSpeedPurgeClient(['active_trigger' => false]);

        $this->assertTrue($client->purgeAll());
        $this->assertSame(['all'], $GLOBALS['options'][LiteSpeedPurgeClient::PENDING_OPTION]);
    }

    public function testTokenIsGeneratedOnceAndStored()
    {
        $client = new LiteSpeedPurgeClient(['active_trigger' => false]);

        $token = $client->token();

        $this->assertNotSame('', $token);
        $this->assertSame($token, $client->token());
        $this->assertSame($token, $GLOBALS['options'][LiteSpeedPurgeClient::TOKEN_OPTION]);
    }

    public function testLoopbackTriggerFiresAWordPressRequestWhenEnabled()
    {
        $GLOBALS['wp_remote_gets'] = [];
        $client = new LiteSpeedPurgeClient(['active_trigger' => true]);

        $this->assertTrue($client->maybeTrigger());
        $this->assertCount(1, $GLOBALS['wp_remote_gets']);
        $this->assertStringContainsString('jankx_purge=', $GLOBALS['wp_remote_gets'][0]['url']);
        $this->assertFalse($GLOBALS['wp_remote_gets'][0]['args']['blocking']);
    }

    public function testLoopbackTriggerIsSkippedWhenDisabled()
    {
        $GLOBALS['wp_remote_gets'] = [];
        $client = new LiteSpeedPurgeClient(['active_trigger' => false]);

        $this->assertFalse($client->maybeTrigger());
        $this->assertCount(0, $GLOBALS['wp_remote_gets']);
    }

    // ── OpenLiteSpeed guard (its cache module segfaults on the header) ──────

    public function testOpenLiteSpeedNeverQueuesOrEmitsThePurgeHeader()
    {
        $_SERVER['LSWS_EDITION'] = 'Openlitespeed 1.5.12';
        $client = new LiteSpeedPurgeClient(['active_trigger' => true]);

        $this->assertFalse($client->enqueue(['all']));
        $this->assertFalse($client->purgeAll());
        $this->assertArrayNotHasKey(LiteSpeedPurgeClient::PENDING_OPTION, $GLOBALS['options']);
        $this->assertSame([], $client->pendingHeaders());
    }

    public function testOpenLiteSpeedDropsAStaleQueuedHeader()
    {
        $_SERVER['LSWS_EDITION'] = 'Openlitespeed 1.5.12';
        $GLOBALS['options'][LiteSpeedPurgeClient::PENDING_OPTION] = ['post-9'];
        $client = new LiteSpeedPurgeClient(['active_trigger' => false]);

        $this->assertSame([], $client->pendingHeaders());
        $this->assertArrayNotHasKey(LiteSpeedPurgeClient::PENDING_OPTION, $GLOBALS['options']);
    }

    public function testEnterpriseEditionKeepsThePurgeHeader()
    {
        $_SERVER['LSWS_EDITION'] = 'LiteSpeed v1.8.4 Enterprise';
        $client = new LiteSpeedPurgeClient(['active_trigger' => false]);

        $this->assertTrue($client->enqueue(['all']));
        $this->assertSame(
            ['X-LiteSpeed-Purge' => 'public, all'],
            $client->pendingHeaders()
        );
    }

    public function testConfigCanForceTheHeaderOnOpenLiteSpeed()
    {
        $_SERVER['LSWS_EDITION'] = 'Openlitespeed 1.5.12';
        $client = new LiteSpeedPurgeClient([
            'active_trigger'   => false,
            'litespeed_header' => true,
        ]);

        $this->assertTrue($client->enqueue(['all']));
        $this->assertArrayHasKey(LiteSpeedPurgeClient::PENDING_OPTION, $GLOBALS['options']);
    }

    public function testConfigCanDisableTheHeaderOnEnterprise()
    {
        $_SERVER['LSWS_EDITION'] = 'LiteSpeed v1.8.4 Enterprise';
        $client = new LiteSpeedPurgeClient([
            'active_trigger'   => false,
            'litespeed_header' => false,
        ]);

        $this->assertFalse($client->purgeAll());
        $this->assertArrayNotHasKey(LiteSpeedPurgeClient::PENDING_OPTION, $GLOBALS['options']);
    }
}
