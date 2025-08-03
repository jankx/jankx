<?php

namespace Tests;

use PHPUnit\Framework\TestSuite;
use Tests\Support\LazyLoaderTest;
use Tests\Foundation\ApplicationLazyTest;
use Tests\Support\Providers\HeavyServicesProviderTest;

/**
 * Lazy Loading Test Suite
 *
 * Runs all lazy loading related tests
 */
class LazyLoadingTestSuite extends TestSuite
{
    public static function suite()
    {
        $suite = new self('Lazy Loading Test Suite');

        // Add all lazy loading tests
        $suite->addTestSuite(LazyLoaderTest::class);
        $suite->addTestSuite(ApplicationLazyTest::class);
        $suite->addTestSuite(HeavyServicesProviderTest::class);

        return $suite;
    }
}
