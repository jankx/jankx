<?php

namespace Jankx\Cache\Server;

use Jankx\Cache\Contracts\ServerIntegrationInterface;
use Jankx\Cache\Purge\HttpPurgeClient;
use Jankx\Cache\Purge\LiteSpeedPurgeClient;
use Jankx\Cache\Purge\NullPurgeClient;

/**
 * Picks the adapter (and its purge transport) for the detected server.
 *
 * Adding support for another server: one integration class, one client if it
 * needs a new purge protocol, two lines here.
 *
 * @package Jankx\Cache\Server
 * @since 2.0.0
 */
class ServerIntegrationFactory
{
    /**
     * @var ServerDetector
     */
    private $detector;

    /**
     * @var array<string,mixed> cache.page configuration.
     */
    private $options;

    /**
     * @param ServerDetector        $detector Server detector.
     * @param array<string,mixed>   $options  cache.page configuration.
     */
    public function __construct(ServerDetector $detector, array $options = [])
    {
        $this->detector = $detector;
        $this->options = $options;
    }

    /**
     * Build the integration for the configured/detected server.
     *
     * @return ServerIntegrationInterface
     */
    public function make(): ServerIntegrationInterface
    {
        $server = isset($this->options['server'])
            ? $this->detector->resolve((string) $this->options['server'])
            : $this->detector->detect();

        switch ($server) {
            case ServerDetector::VARNISH:
                return new VarnishIntegration(new HttpPurgeClient($this->purgeOptions()));

            case ServerDetector::LITESPEED:
                return new LiteSpeedIntegration(new LiteSpeedPurgeClient($this->purgeOptions()));

            case ServerDetector::NGINX:
                return new NginxIntegration(new HttpPurgeClient($this->purgeOptions()));

            case ServerDetector::APACHE:
                return new ApacheIntegration(new NullPurgeClient());

            case ServerDetector::GENERIC:
            default:
                return new GenericIntegration(new NullPurgeClient());
        }
    }

    /**
     * Detected server name (for logging/CLI, independent of the adapter).
     *
     * @return string
     */
    public function detected(): string
    {
        return $this->detector->detect();
    }

    /**
     * @return array<string,mixed>
     */
    private function purgeOptions(): array
    {
        return isset($this->options['purge']) && is_array($this->options['purge'])
            ? $this->options['purge']
            : [];
    }
}
