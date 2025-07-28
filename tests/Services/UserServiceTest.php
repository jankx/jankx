<?php

namespace Tests\Services;

use Jankx\Services\UserService;
use Jankx\Facades\User;
use Tests\TestCase;

class UserServiceTest extends TestCase
{
    private $userService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userService = new UserService();
    }

    public function testGetUserWithCache()
    {
        // Create a test user
        $userId = $this->factory->user->create([
            'user_login' => 'testuser',
            'user_email' => 'test@example.com',
            'display_name' => 'Test User'
        ]);

        // First call should fetch from database
        $user = $this->userService->getUser($userId);
        $this->assertNotNull($user);
        $this->assertEquals('Test User', $user->display_name);

        // Second call should use cache
        $cachedUser = $this->userService->getUser($userId);
        $this->assertEquals($user, $cachedUser);
    }

    public function testGetUserWithSpecificFields()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'testuser2',
            'user_email' => 'test2@example.com',
            'display_name' => 'Test User 2'
        ]);

        $user = $this->userService->getUser($userId, ['ID', 'display_name', 'user_email']);

        $this->assertIsArray($user);
        $this->assertArrayHasKey('ID', $user);
        $this->assertArrayHasKey('display_name', $user);
        $this->assertArrayHasKey('user_email', $user);
        $this->assertArrayNotHasKey('user_login', $user);
    }

    public function testGetUserByUsername()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'testuser3',
            'user_email' => 'test3@example.com',
            'display_name' => 'Test User 3'
        ]);

        $user = $this->userService->getUser('testuser3');
        $this->assertNotNull($user);
        $this->assertEquals($userId, $user->ID);
    }

    public function testGetUserByEmail()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'testuser4',
            'user_email' => 'test4@example.com',
            'display_name' => 'Test User 4'
        ]);

        $user = $this->userService->getUser('test4@example.com');
        $this->assertNotNull($user);
        $this->assertEquals($userId, $user->ID);
    }

    public function testGetCurrentUser()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'currentuser',
            'user_email' => 'current@example.com',
            'display_name' => 'Current User'
        ]);

        wp_set_current_user($userId);

        $currentUser = $this->userService->getCurrentUser();
        $this->assertNotNull($currentUser);
        $this->assertEquals($userId, $currentUser->ID);
    }

    public function testGetUsersBatch()
    {
        $user1 = $this->factory->user->create(['display_name' => 'User 1']);
        $user2 = $this->factory->user->create(['display_name' => 'User 2']);
        $user3 = $this->factory->user->create(['display_name' => 'User 3']);

        $users = $this->userService->getUsersBatch([$user1, $user2, $user3], ['ID', 'display_name']);

        $this->assertCount(3, $users);
        $this->assertIsArray($users[0]);
        $this->assertEquals('User 1', $users[0]['display_name']);
        $this->assertEquals('User 2', $users[1]['display_name']);
        $this->assertEquals('User 3', $users[2]['display_name']);
    }

    public function testGetUsersByRole()
    {
        // Create admin users
        $admin1 = $this->factory->user->create(['role' => 'administrator']);
        $admin2 = $this->factory->user->create(['role' => 'administrator']);
        $this->factory->user->create(['role' => 'subscriber']); // Different role

        $admins = $this->userService->getUsersByRole('administrator');
        $this->assertCount(2, $admins);
    }

    public function testSearchUsers()
    {
        $this->factory->user->create([
            'user_login' => 'john_doe',
            'display_name' => 'John Doe',
            'user_email' => 'john@example.com'
        ]);

        $this->factory->user->create([
            'user_login' => 'jane_smith',
            'display_name' => 'Jane Smith',
            'user_email' => 'jane@example.com'
        ]);

        $results = $this->userService->searchUsers('john');
        $this->assertNotEmpty($results);

        $found = false;
        foreach ($results as $user) {
            if (strpos($user->display_name, 'John') !== false) {
                $found = true;
                break;
            }
        }
        $this->assertTrue($found);
    }

    public function testCacheManagement()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'cacheuser',
            'display_name' => 'Cache User'
        ]);

        // Get user to populate cache
        $this->userService->getUser($userId);

        // Clear cache for specific user
        $this->userService->clearCache($userId);

        // Should still work after cache clear
        $user = $this->userService->getUser($userId);
        $this->assertNotNull($user);
    }

    public function testCacheExpiry()
    {
        $this->userService->setCacheExpiry(1); // 1 second

        $userId = $this->factory->user->create([
            'user_login' => 'expiryuser',
            'display_name' => 'Expiry User'
        ]);

        // Get user
        $this->userService->getUser($userId);

        // Wait for cache to expire
        sleep(2);

        // Should still work (will refetch from database)
        $user = $this->userService->getUser($userId);
        $this->assertNotNull($user);
    }

    public function testCacheStatistics()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'statsuser',
            'display_name' => 'Stats User'
        ]);

        // Get user (should be a miss)
        $this->userService->getUser($userId);

        // Get user again (should be a hit)
        $this->userService->getUser($userId);

        $stats = $this->userService->getCacheStats();
        $this->assertEquals(1, $stats['hits']);
        $this->assertEquals(1, $stats['misses']);
        $this->assertEquals(1, $stats['sets']);

        $hitRatio = $this->userService->getCacheHitRatio();
        $this->assertEquals(0.5, $hitRatio);
    }

    public function testUserFilters()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'filteruser',
            'display_name' => 'Filter User'
        ]);

        // Add a filter to modify user data
        add_filter('jankx/user/data', function($userData, $filterUserId, $fields) {
            if (is_array($userData)) {
                $userData['custom_field'] = 'filtered_value';
            } elseif (is_object($userData)) {
                $userData->custom_field = 'filtered_value';
            }
            return $userData;
        }, 10, 3);

        $user = $this->userService->getUser($userId);

        if (is_array($user)) {
            $this->assertEquals('filtered_value', $user['custom_field']);
        } else {
            $this->assertEquals('filtered_value', $user->custom_field);
        }
    }

    public function testContextSpecificFilters()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'contextuser',
            'display_name' => 'Context User'
        ]);

        // Add context-specific filter
        add_filter('jankx/user/data_admin', function($userData, $filterUserId, $fields) {
            if (is_array($userData)) {
                $userData['admin_context'] = true;
            } elseif (is_object($userData)) {
                $userData->admin_context = true;
            }
            return $userData;
        }, 10, 3);

        // Mock admin context
        $this->mockAdminContext();

        $user = $this->userService->getUser($userId);

        if (is_array($user)) {
            $this->assertTrue($user['admin_context']);
        } else {
            $this->assertTrue($user->admin_context);
        }
    }

    public function testErrorHandling()
    {
        // Test with non-existent user
        $user = $this->userService->getUser(99999);
        $this->assertNull($user);

        // Test with invalid input
        $this->expectException(\InvalidArgumentException::class);
        $this->userService->getUser('');
    }

    public function testInputValidation()
    {
        // Test empty user ID
        $this->expectException(\InvalidArgumentException::class);
        $this->userService->getUser('');

        // Test empty user IDs array
        $this->expectException(\InvalidArgumentException::class);
        $this->userService->getUsers([]);

        // Test empty role
        $this->expectException(\InvalidArgumentException::class);
        $this->userService->getUsersByRole('');

        // Test empty search term
        $this->expectException(\InvalidArgumentException::class);
        $this->userService->searchUsers('');

        // Test negative cache expiry
        $this->expectException(\InvalidArgumentException::class);
        $this->userService->setCacheExpiry(-1);
    }

    public function testEventHooks()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'eventuser',
            'display_name' => 'Event User'
        ]);

        $userLoaded = false;
        $cacheHit = false;
        $cacheCleared = false;

        // Listen for user loaded event
        add_action('jankx/user/loaded', function($user, $user_id) use (&$userLoaded) {
            $userLoaded = true;
        }, 10, 2);

        // Listen for cache hit event
        add_action('jankx/user/cache_hit', function($cacheKey) use (&$cacheHit) {
            $cacheHit = true;
        });

        // Listen for cache cleared event
        add_action('jankx/user/cache_cleared', function($user_id) use (&$cacheCleared) {
            $cacheCleared = true;
        });

        // Get user (should trigger user_loaded event)
        $this->userService->getUser($userId);
        $this->assertTrue($userLoaded);

        // Get user again (should trigger cache_hit event)
        $this->userService->getUser($userId);
        $this->assertTrue($cacheHit);

        // Clear cache (should trigger cache_cleared event)
        $this->userService->clearCache($userId);
        $this->assertTrue($cacheCleared);
    }

    public function testBatchEventHooks()
    {
        $user1 = $this->factory->user->create(['display_name' => 'Batch User 1']);
        $user2 = $this->factory->user->create(['display_name' => 'Batch User 2']);

        $batchLoaded = false;

        // Listen for batch users loaded event
        add_action('jankx/user/batch_loaded', function($users, $user_ids) use (&$batchLoaded) {
            $batchLoaded = true;
        }, 10, 2);

        // Get users batch (should trigger batch_loaded event)
        $this->userService->getUsersBatch([$user1, $user2]);
        $this->assertTrue($batchLoaded);
    }

    public function testMemoryManagement()
    {
        // Set a small cache size for testing
        $this->userService->setCacheExpiry(3600);

        // Create multiple users to test cache cleanup
        $userIds = [];
        for ($i = 0; $i < 5; $i++) {
            $userIds[] = $this->factory->user->create([
                'user_login' => "memoryuser{$i}",
                'display_name' => "Memory User {$i}"
            ]);
        }

        // Get all users to populate cache
        foreach ($userIds as $userId) {
            $this->userService->getUser($userId);
        }

        // Cache should still work after multiple operations
        $user = $this->userService->getUser($userIds[0]);
        $this->assertNotNull($user);
    }

    public function testGetMultipleUsers()
    {
        $user1 = $this->factory->user->create(['display_name' => 'User 1']);
        $user2 = $this->factory->user->create(['display_name' => 'User 2']);
        $user3 = $this->factory->user->create(['display_name' => 'User 3']);

        $users = $this->userService->getUsers([$user1, $user2, $user3]);

        $this->assertCount(3, $users);
        $this->assertArrayHasKey($user1, $users);
        $this->assertArrayHasKey($user2, $users);
        $this->assertArrayHasKey($user3, $users);
    }

    private function mockAdminContext()
    {
        // Mock is_admin() function for testing
        if (!function_exists('is_admin')) {
            function is_admin() {
                return true;
            }
        }
    }

    protected function tearDown(): void
    {
        // Clean up
        $this->userService->clearCache();
        parent::tearDown();
    }
}