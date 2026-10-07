<?php

namespace Tests\Cache;

use Jankx\Cache\Page\CacheabilityChain;
use Jankx\Cache\Page\CacheabilityChainFactory;
use Jankx\Cache\Page\PageRequest;
use Tests\Helpers\TestCase;

/**
 * The chain is the gate of the whole page cache: whatever it rejects must
 * never be stored or served.
 */
class CacheabilityChainTest extends TestCase
{
    /**
     * @var CacheabilityChain
     */
    private $chain;

    protected function setUp(): void
    {
        parent::setUp();

        $config = require dirname(__DIR__, 2) . '/config/cache.php';
        $this->chain = CacheabilityChainFactory::makeChain($config['page']);
    }

    public function testAllowsPlainPublicGet()
    {
        $request = $this->request('GET', 'https://nibitour.vn/tour/hanoi/');

        $this->assertTrue($this->chain->allows($request));
        $this->assertNull($this->chain->firstFailure($request));
    }

    public function testRejectsNonGetRequest()
    {
        $request = $this->request('POST', 'https://nibitour.vn/checkout/');

        $this->assertFalse($this->chain->allows($request));
        $this->assertSame('non_get_request', $this->chain->firstFailure($request));
    }

    public function testRejectsLoggedInVisitor()
    {
        $request = $this->request('GET', 'https://nibitour.vn/', [], [], [
            PageRequest::CONTEXT_LOGGED_IN => true,
        ]);

        $this->assertSame('logged_in', $this->chain->firstFailure($request));
    }

    public function testRejectsUnsafeRequestContext()
    {
        $contexts = [
            PageRequest::CONTEXT_ADMIN => 'request_context',
            PageRequest::CONTEXT_AJAX => 'request_context',
            PageRequest::CONTEXT_REST => 'request_context',
            PageRequest::CONTEXT_PREVIEW => 'request_context',
            PageRequest::CONTEXT_404 => 'request_context',
            PageRequest::CONTEXT_FEED => 'request_context',
            PageRequest::CONTEXT_DO_NOT_CACHE => 'request_context',
        ];

        foreach ($contexts as $flag => $expectedRule) {
            $request = $this->request('GET', 'https://nibitour.vn/', [], [], [$flag => true]);
            $this->assertSame($expectedRule, $this->chain->firstFailure($request), $flag);
        }
    }

    public function testRejectsNonOkStatus()
    {
        $request = $this->request('GET', 'https://nibitour.vn/nope/', [], [], [
            PageRequest::CONTEXT_STATUS => 500,
        ]);

        $this->assertFalse($this->chain->allows($request));
    }

    public function testRejectsExcludedPath()
    {
        foreach (['/wp-admin/edit.php', '/wp-login.php', '/cart/', '/checkout/pay/', '/my-account/orders/'] as $path) {
            $request = $this->request('GET', 'https://nibitour.vn' . $path);
            $this->assertSame('excluded_path', $this->chain->firstFailure($request), $path);
        }
    }

    public function testDoesNotRejectSimilarButAllowedPath()
    {
        $request = $this->request('GET', 'https://nibitour.vn/tour/cart-reading/');

        $this->assertTrue($this->chain->allows($request));
    }

    public function testRejectsExcludedCookie()
    {
        $request = $this->request('GET', 'https://nibitour.vn/tour/hanoi/', [], [
            'woocommerce_items_in_cart' => '1',
        ]);

        $this->assertSame('excluded_cookie', $this->chain->firstFailure($request));
    }

    public function testRejectsPrefixedExcludedCookie()
    {
        $request = $this->request('GET', 'https://nibitour.vn/', [], [
            'wordpress_logged_in_abc123' => 'token',
        ]);

        $this->assertSame('excluded_cookie', $this->chain->firstFailure($request));
    }

    public function testRejectsExcludedQueryArgument()
    {
        $request = $this->request('GET', 'https://nibitour.vn/tour/hanoi/', ['preview' => '1']);

        $this->assertSame('excluded_query_arg', $this->chain->firstFailure($request));
    }

    public function testRejectsPurgeTriggerArgument()
    {
        $request = $this->request('GET', 'https://nibitour.vn/', ['jankx_purge' => 'abc']);

        $this->assertSame('excluded_query_arg', $this->chain->firstFailure($request));
    }

    public function testRejectsFastAjaxRewrite()
    {
        $request = $this->request('GET', 'https://nibitour.vn/jankx-ajax/cart/items');

        $this->assertSame('excluded_path', $this->chain->firstFailure($request));

        $request = $this->request('GET', 'https://nibitour.vn/index.php', ['jankx_fast_ajax' => 'cart']);

        $this->assertSame('excluded_query_arg', $this->chain->firstFailure($request));
    }

    public function testExplainReportsWhyRequestWasRejected()
    {
        $request = $this->request('POST', 'https://nibitour.vn/');
        $report = CacheabilityChainFactory::explain($this->chain, $request);

        $this->assertFalse($report['cacheable']);
        $this->assertSame('non_get_request', $report['rejected_by']);
        $this->assertContains('excluded_cookie', $report['rules']);
    }

    /**
     * @param string $method  HTTP method.
     * @param string $url     Absolute URL.
     * @param array  $query   Query string arguments.
     * @param array  $cookies Request cookies.
     * @param array  $context Request context flags.
     * @return PageRequest
     */
    private function request($method, $url, array $query = [], array $cookies = [], array $context = []): PageRequest
    {
        return new PageRequest($method, $url, $query, $cookies, [], $context);
    }
}
