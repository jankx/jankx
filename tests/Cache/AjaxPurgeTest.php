<?php

namespace Tests\Cache;

use Jankx\Ajax\Cache\Purge;
use Jankx\Cache\Purge\LiteSpeedPurgeClient;
use Tests\Helpers\TestCase;

/**
 * Fast-AJAX purge helper: standalone requests must reach the loopback
 * endpoint with the right scope, never boot the container themselves.
 */
class AjaxPurgeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $GLOBALS['wp_remote_gets'] = [];
        $GLOBALS['options'] = $GLOBALS['options'] ?? [];
        unset($GLOBALS['options'][LiteSpeedPurgeClient::TOKEN_OPTION]);
    }

    protected function tearDown(): void
    {
        $GLOBALS['wp_remote_gets'] = [];

        if (isset($GLOBALS['options'])) {
            unset($GLOBALS['options'][LiteSpeedPurgeClient::TOKEN_OPTION]);
        }

        parent::tearDown();
    }

    public function testAllScopeHitsTheLoopbackEndpoint()
    {
        $GLOBALS['options'][LiteSpeedPurgeClient::TOKEN_OPTION] = 'tok-123';

        $this->assertTrue(Purge::all());

        $this->assertCount(1, $GLOBALS['wp_remote_gets']);
        $url = $GLOBALS['wp_remote_gets'][0]['url'];

        $this->assertStringContainsString('jankx_purge=tok-123', $url);
        $this->assertStringContainsString('jankx_scope=all', $url);
        $this->assertStringNotContainsString('jankx_tags', $url);
        $this->assertStringNotContainsString('jankx_urls', $url);

        $args = $GLOBALS['wp_remote_gets'][0]['args'];
        $this->assertSame(3, $args['timeout']);
        $this->assertFalse($args['blocking']);
        $this->assertSame(0, $args['redirection']);
    }

    public function testSelectivePurgeCarriesTagsAndUrls()
    {
        $GLOBALS['options'][LiteSpeedPurgeClient::TOKEN_OPTION] = 'tok-123';

        $this->assertTrue(Purge::tags(
            ['post-7', '  ', 'post-7'],
            ['https://nibitour.vn/tour/hanoi/?a=1']
        ));

        $this->assertCount(1, $GLOBALS['wp_remote_gets']);
        $url = $GLOBALS['wp_remote_gets'][0]['url'];

        $this->assertStringContainsString('jankx_scope=selective', $url);
        $this->assertStringContainsString('jankx_tags=post-7', $url);
        $this->assertStringContainsString(
            'jankx_urls=' . rawurlencode('https://nibitour.vn/tour/hanoi/?a=1'),
            $url
        );
    }

    public function testEmptyTagListFallsBackToAllScope()
    {
        $GLOBALS['options'][LiteSpeedPurgeClient::TOKEN_OPTION] = 'tok-123';

        $this->assertTrue(Purge::tags(['', '  ']));

        $this->assertCount(1, $GLOBALS['wp_remote_gets']);
        $this->assertStringContainsString('jankx_scope=all', $GLOBALS['wp_remote_gets'][0]['url']);
    }

    public function testMissingTokenDispatchesNothing()
    {
        $this->assertFalse(Purge::all());
        $this->assertFalse(Purge::tags(['post-1']));

        $this->assertCount(0, $GLOBALS['wp_remote_gets']);
    }
}
