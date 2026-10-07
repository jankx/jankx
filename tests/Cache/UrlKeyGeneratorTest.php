<?php

namespace Tests\Cache;

use Jankx\Cache\Key\UrlKeyGenerator;
use Jankx\Cache\Page\PageRequest;
use Tests\Helpers\TestCase;

/**
 * Cache identity: two requests may only share an entry when everything that
 * changes the response is part of the key.
 */
class UrlKeyGeneratorTest extends TestCase
{
    /**
     * @var UrlKeyGenerator
     */
    private $keys;

    protected function setUp(): void
    {
        parent::setUp();

        $config = require dirname(__DIR__, 2) . '/config/cache.php';
        $page = $config['page'];

        $this->keys = new UrlKeyGenerator(
            'page',
            (array) $page['vary_cookies'],
            (array) $page['strip_query_args']
        );
    }

    public function testSameRequestProducesSameKey()
    {
        $a = $this->keys->generate($this->request('https://nibitour.vn/tour/hanoi/'));
        $b = $this->keys->generate($this->request('https://nibitour.vn/tour/hanoi/'));

        $this->assertSame($a->value(), $b->value());
        $this->assertSame('page', $a->group());
    }

    public function testDifferentPathProducesDifferentKey()
    {
        $a = $this->keys->generate($this->request('https://nibitour.vn/tour/hanoi/'));
        $b = $this->keys->generate($this->request('https://nibitour.vn/tour/sapa/'));

        $this->assertNotSame($a->value(), $b->value());
    }

    public function testTrackingArgumentsAreStripped()
    {
        $clean = $this->keys->generate($this->request('https://nibitour.vn/tour/hanoi/'));
        $tracked = $this->keys->generate($this->request(
            'https://nibitour.vn/tour/hanoi/?utm_source=facebook&utm_campaign=sale&fbclid=xyz'
        ));

        $this->assertSame($clean->value(), $tracked->value());
    }

    public function testMeaningfulQueryArgumentsAreKept()
    {
        $plain = $this->keys->generate($this->request('https://nibitour.vn/tours/'));
        $paged = $this->keys->generate($this->request('https://nibitour.vn/tours/', ['paged' => '2']));

        $this->assertNotSame($plain->value(), $paged->value());
    }

    public function testVaryCookieChangesKey()
    {
        $vnd = $this->keys->generate($this->request('https://nibitour.vn/tour/hanoi/', [], [
            'jankx_current_currency' => 'VND',
        ]));
        $usd = $this->keys->generate($this->request('https://nibitour.vn/tour/hanoi/', [], [
            'jankx_current_currency' => 'USD',
        ]));
        $none = $this->keys->generate($this->request('https://nibitour.vn/tour/hanoi/'));

        $this->assertNotSame($vnd->value(), $usd->value());
        $this->assertNotSame($vnd->value(), $none->value());
        $this->assertNotSame($usd->value(), $none->value());
    }

    public function testQueryOrderDoesNotChangeKey()
    {
        $a = $this->keys->generate($this->request('https://nibitour.vn/tours/', ['paged' => '2', 'sort' => 'price']));
        $b = $this->keys->generate($this->request('https://nibitour.vn/tours/', ['sort' => 'price', 'paged' => '2']));

        $this->assertSame($a->value(), $b->value());
    }

    /**
     * @param string $url     Absolute URL.
     * @param array  $query   Query string arguments.
     * @param array  $cookies Request cookies.
     * @return PageRequest
     */
    private function request($url, array $query = [], array $cookies = []): PageRequest
    {
        return new PageRequest('GET', $url, $query, $cookies);
    }
}
