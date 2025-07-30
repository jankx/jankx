<?php

namespace Tests;

use PHPUnit\Framework\TestCase as PHPUnitTestCase;
use Brain\Monkey\Functions;
use Brain\Monkey\WP\Filters;
use Brain\Monkey\WP\Actions;

/**
 * Base TestCase class for Jankx Framework tests
 */
abstract class TestCase extends PHPUnitTestCase
{
    protected $factory;

    protected function setUp(): void
    {
        parent::setUp();

        // Set up a simple factory for creating test data
        $this->factory = (object) [
            'user' => (object) [
                'create' => [$this, 'createUser']
            ],
            'post' => (object) [
                'create' => [$this, 'createPost']
            ]
        ];
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }

    // Factory methods
    public function createUser($args = []) {
        return (object) array_merge([
            'ID' => rand(1, 1000),
            'user_login' => 'testuser',
            'user_email' => 'test@example.com',
            'display_name' => 'Test User',
            'user_nicename' => 'test-user',
            'user_status' => 0,
            'user_registered' => '2023-01-01 00:00:00'
        ], $args);
    }

    public function createPost($args = []) {
        return (object) array_merge([
            'ID' => rand(1, 1000),
            'post_title' => 'Test Post',
            'post_content' => 'Test content',
            'post_status' => 'publish',
            'post_type' => 'post',
            'post_date' => '2023-01-01 00:00:00'
        ], $args);
    }
}