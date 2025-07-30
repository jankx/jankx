<?php

namespace Tests\Debug\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Debug\Services\QueryCountService;

/**
 * Query Count Service Test
 *
 * @package Tests\Debug\Services
 * @since 2.0.0
 */
class QueryCountServiceTest extends TestCase
{
    private QueryCountService $queryCountService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->queryCountService = new QueryCountService();
    }

    public function testStartTracking()
    {
        $this->queryCountService->startTracking();

        // Test that tracking is started
        $queryCount = $this->queryCountService->getQueryCount();
        $this->assertIsInt($queryCount);
        $this->assertGreaterThanOrEqual(0, $queryCount);
    }

    public function testGetQueryCountBeforeTracking()
    {
        // Test query count before tracking starts
        $queryCount = $this->queryCountService->getQueryCount();
        $this->assertEquals(0, $queryCount);
    }

    public function testCountQuery()
    {
        $this->queryCountService->startTracking();

        $query = "SELECT * FROM wp_posts";
        $result = $this->queryCountService->countQuery($query);

        // Should return the original query
        $this->assertEquals($query, $result);

        // Should increment query count
        $queryCount = $this->queryCountService->getQueryCount();
        $this->assertGreaterThan(0, $queryCount);
    }

    public function testCountWpdbQuery()
    {
        $this->queryCountService->startTracking();

        $query = "SELECT * FROM wp_users";
        $queryType = "SELECT";

        $this->queryCountService->countWpdbQuery($query, $queryType);

        // Should increment query count
        $queryCount = $this->queryCountService->getQueryCount();
        $this->assertGreaterThan(0, $queryCount);
    }

    public function testMultipleQueries()
    {
        $this->queryCountService->startTracking();

        // Count multiple queries
        $this->queryCountService->countQuery("SELECT * FROM wp_posts");
        $this->queryCountService->countQuery("SELECT * FROM wp_users");
        $this->queryCountService->countWpdbQuery("INSERT INTO wp_options", "INSERT");

        $queryCount = $this->queryCountService->getQueryCount();
        $this->assertEquals(3, $queryCount);
    }

    public function testQueryCountWithoutTracking()
    {
        // Count queries without starting tracking
        $this->queryCountService->countQuery("SELECT * FROM wp_posts");
        $this->queryCountService->countWpdbQuery("SELECT * FROM wp_users", "SELECT");

        $queryCount = $this->queryCountService->getQueryCount();
        $this->assertEquals(0, $queryCount);
    }

    public function testQueryCountReset()
    {
        $this->queryCountService->startTracking();
        $this->queryCountService->countQuery("SELECT * FROM wp_posts");

        $initialCount = $this->queryCountService->getQueryCount();
        $this->assertGreaterThan(0, $initialCount);

        // Stop tracking by creating new instance
        $newService = new QueryCountService();
        $newCount = $newService->getQueryCount();
        $this->assertEquals(0, $newCount);
    }

    public function testQueryCountAccuracy()
    {
        $this->queryCountService->startTracking();

        $queries = [
            "SELECT * FROM wp_posts",
            "SELECT * FROM wp_users",
            "UPDATE wp_options SET option_value = 'test'",
            "DELETE FROM wp_transients WHERE expiration < NOW()"
        ];

        foreach ($queries as $query) {
            $this->queryCountService->countQuery($query);
        }

        $queryCount = $this->queryCountService->getQueryCount();
        $this->assertEquals(count($queries), $queryCount);
    }

    public function testMixedQueryTypes()
    {
        $this->queryCountService->startTracking();

        // Mix countQuery and countWpdbQuery
        $this->queryCountService->countQuery("SELECT * FROM wp_posts");
        $this->queryCountService->countWpdbQuery("INSERT INTO wp_options", "INSERT");
        $this->queryCountService->countQuery("UPDATE wp_users SET user_login = 'test'");
        $this->queryCountService->countWpdbQuery("DELETE FROM wp_transients", "DELETE");

        $queryCount = $this->queryCountService->getQueryCount();
        $this->assertEquals(4, $queryCount);
    }

    public function testQueryCountPerformance()
    {
        $this->queryCountService->startTracking();

        $startTime = microtime(true);

        // Count many queries quickly
        for ($i = 0; $i < 1000; $i++) {
            $this->queryCountService->countQuery("SELECT * FROM wp_posts WHERE ID = $i");
        }

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Should complete quickly (less than 1 second)
        $this->assertLessThan(1.0, $executionTime);

        $queryCount = $this->queryCountService->getQueryCount();
        $this->assertEquals(1000, $queryCount);
    }

    public function testQueryCountWithDifferentQueryTypes()
    {
        $this->queryCountService->startTracking();

        $queryTypes = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'REPLACE'];

        foreach ($queryTypes as $type) {
            $this->queryCountService->countWpdbQuery("$type query", $type);
        }

        $queryCount = $this->queryCountService->getQueryCount();
        $this->assertEquals(count($queryTypes), $queryCount);
    }

    public function testQueryCountWithEmptyQueries()
    {
        $this->queryCountService->startTracking();

        // Test with empty queries
        $this->queryCountService->countQuery("");
        $this->queryCountService->countWpdbQuery("", "");

        $queryCount = $this->queryCountService->getQueryCount();
        $this->assertEquals(2, $queryCount);
    }

    public function testQueryCountWithSpecialCharacters()
    {
        $this->queryCountService->startTracking();

        $queries = [
            "SELECT * FROM `wp_posts` WHERE `post_title` LIKE '%test%'",
            "INSERT INTO `wp_options` (`option_name`, `option_value`) VALUES ('test', 'value')",
            "UPDATE `wp_users` SET `user_email` = 'test@example.com' WHERE `ID` = 1"
        ];

        foreach ($queries as $query) {
            $this->queryCountService->countQuery($query);
        }

        $queryCount = $this->queryCountService->getQueryCount();
        $this->assertEquals(count($queries), $queryCount);
    }
}