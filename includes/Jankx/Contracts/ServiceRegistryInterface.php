<?php

namespace Jankx\Contracts;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Service Registry Interface
 *
 * Defines the contract for service registry classes in the Jankx framework.
 *
 * @package Jankx\Contracts
 */
interface ServiceRegistryInterface
{
    /**
     * Register services
     */
    public function registerServices(): void;
}
