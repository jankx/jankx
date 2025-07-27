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

    public function testUserFilters()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'filteruser',
            'display_name' => 'Filter User'
        ]);

        // Add a filter to modify user data
        add_filter('jankx_user_data', function($userData, $filterUserId, $fields) {
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
        add_filter('jankx_user_data_admin', function($userData, $filterUserId, $fields) {
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
        $user = $this->userService->getUser('');
        $this->assertNull($user);
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