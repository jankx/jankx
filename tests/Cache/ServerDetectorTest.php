<?php

namespace Tests\Cache;

use Jankx\Cache\Server\ServerDetector;
use Tests\Helpers\TestCase;

class ServerDetectorTest extends TestCase
{
    public function testDetectsVarnishFromItsHeaders()
    {
        $detector = new ServerDetector([
            'SERVER_SOFTWARE' => 'nginx/1.24.0',
            'HTTP_X_VARNISH' => '418376-418378',
        ]);

        $this->assertSame('varnish', $detector->detect());
    }

    public function testDetectsVarnishFromViaHeader()
    {
        $detector = new ServerDetector([
            'SERVER_SOFTWARE' => 'Apache/2.4.57',
            'HTTP_VIA' => '1.1 varnish (Varnish/7.3)',
        ]);

        $this->assertSame('varnish', $detector->detect());
    }

    public function testDetectsNginx()
    {
        $detector = new ServerDetector(['SERVER_SOFTWARE' => 'nginx/1.24.0 (Ubuntu)']);

        $this->assertSame('nginx', $detector->detect());
    }

    public function testDetectsApache()
    {
        $detector = new ServerDetector(['SERVER_SOFTWARE' => 'Apache/2.4.57 (Unix)']);

        $this->assertSame('apache', $detector->detect());
    }

    public function testLiteSpeedWithoutLscacheFallsBackToGeneric()
    {
        // OpenLiteSpeed without the cache module can only store pages in PHP.
        $detector = new ServerDetector(['SERVER_SOFTWARE' => 'OpenLiteSpeed']);

        $this->assertSame('generic', $detector->detect());
    }

    public function testLiteSpeedWithLscacheSignalIsDetected()
    {
        $detector = new ServerDetector([
            'SERVER_SOFTWARE' => 'LiteSpeed',
            'X_LSCACHE' => 'on',
        ]);

        $this->assertSame('litespeed', $detector->detect());
    }

    public function testUnknownServerIsGeneric()
    {
        $detector = new ServerDetector(['SERVER_SOFTWARE' => 'PHP 8.1 Built-in Server']);

        $this->assertSame('generic', $detector->detect());
    }

    public function testConfiguredServerOverridesDetection()
    {
        $detector = new ServerDetector(['SERVER_SOFTWARE' => 'Apache/2.4.57']);

        $this->assertSame('nginx', $detector->resolve('nginx'));
        $this->assertSame('varnish', $detector->resolve('Varnish'));
        $this->assertSame('apache', $detector->resolve('auto'));
        $this->assertSame('apache', $detector->resolve('something-unknown'));
    }

    public function testKnownListCoversEveryAdapter()
    {
        $known = ServerDetector::known();

        foreach (['varnish', 'litespeed', 'nginx', 'apache', 'generic'] as $server) {
            $this->assertContains($server, $known);
        }
    }
}
