<?php

namespace Tests;

use PHPUnit\Framework\TestSuite;
use PHPUnit\Framework\TestCase;

/**
 * Main Test Suite for Jankx Framework
 */
class JankxTestSuite extends TestSuite
{
    public static function suite()
    {
        $suite = new self('Jankx Framework Test Suite');

        // Add all test classes
        $suite->addTestSuite(\Tests\JankxTest::class);
        $suite->addTestSuite(\Tests\Kernel\KernelTest::class);
        $suite->addTestSuite(\Tests\Bootstrappers\AbstractBootstrapperTest::class);
        $suite->addTestSuite(\Tests\Services\DeferredServiceResolverTest::class);
        $suite->addTestSuite(\Tests\Facades\FacadesTest::class);

        $suite->addTestSuite(\Tests\Logger\LoggerTest::class);
        $suite->addTestSuite(\Tests\Gutenberg\BlockRegistryTest::class);
        $suite->addTestSuite(\Tests\Contracts\ContractsTest::class);

        return $suite;
    }
}