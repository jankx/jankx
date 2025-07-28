<?php

namespace Tests\Facades;

use Jankx\Facades\User;
use Tests\TestCase;

class UserFacadeTest extends TestCase
{
    public function testGetUser()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'facadeuser',
            'display_name' => 'Facade User',
            'user_email' => 'facade@example.com'
        ]);

        $user = User::get($userId, ['ID', 'display_name', 'user_email']);

        $this->assertIsArray($user);
        $this->assertEquals('Facade User', $user['display_name']);
        $this->assertEquals('facade@example.com', $user['user_email']);
    }

    public function testGetCurrentUser()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'currentfacadeuser',
            'display_name' => 'Current Facade User'
        ]);

        wp_set_current_user($userId);

        $currentUser = User::current(['ID', 'display_name']);

        $this->assertIsArray($currentUser);
        $this->assertEquals('Current Facade User', $currentUser['display_name']);
    }

    public function testGetMultipleUsers()
    {
        $user1 = $this->factory->user->create(['display_name' => 'Facade User 1']);
        $user2 = $this->factory->user->create(['display_name' => 'Facade User 2']);

        $users = User::getMultiple([$user1, $user2], ['ID', 'display_name']);

        $this->assertCount(2, $users);
        $this->assertEquals('Facade User 1', $users[$user1]['display_name']);
        $this->assertEquals('Facade User 2', $users[$user2]['display_name']);
    }

    public function testGetBatchUsers()
    {
        $user1 = $this->factory->user->create(['display_name' => 'Batch User 1']);
        $user2 = $this->factory->user->create(['display_name' => 'Batch User 2']);

        $users = User::getBatch([$user1, $user2], ['ID', 'display_name']);

        $this->assertCount(2, $users);
        $this->assertEquals('Batch User 1', $users[0]['display_name']);
        $this->assertEquals('Batch User 2', $users[1]['display_name']);
    }

    public function testGetUsersByRole()
    {
        $this->factory->user->create(['role' => 'administrator']);
        $this->factory->user->create(['role' => 'administrator']);

        $admins = User::getByRole('administrator', ['ID', 'display_name']);

        $this->assertCount(2, $admins);
    }

    public function testSearchUsers()
    {
        $this->factory->user->create([
            'user_login' => 'searchuser',
            'display_name' => 'Search User',
            'user_email' => 'search@example.com'
        ]);

        $results = User::search('search', ['ID', 'display_name']);

        $this->assertNotEmpty($results);
        $this->assertEquals('Search User', $results[0]['display_name']);
    }

    public function testUserExists()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'existuser',
            'display_name' => 'Exist User'
        ]);

        $this->assertTrue(User::exists($userId));
        $this->assertFalse(User::exists(99999));
    }

    public function testGetUserId()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'iduser',
            'user_email' => 'id@example.com'
        ]);

        $this->assertEquals($userId, User::getId('iduser'));
        $this->assertEquals($userId, User::getId('id@example.com'));
        $this->assertNull(User::getId('nonexistent'));
    }

    public function testGetDisplayName()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'nameuser',
            'display_name' => 'Name User'
        ]);

        $this->assertEquals('Name User', User::getDisplayName($userId));
        $this->assertNull(User::getDisplayName(99999));
    }

    public function testGetEmail()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'emailuser',
            'user_email' => 'email@example.com'
        ]);

        $this->assertEquals('email@example.com', User::getEmail($userId));
        $this->assertNull(User::getEmail(99999));
    }

    public function testGetAvatar()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'avataruser',
            'display_name' => 'Avatar User'
        ]);

        $avatar = User::getAvatar($userId, 150);

        $this->assertNotNull($avatar);
        $this->assertIsString($avatar);
        $this->assertStringContainsString('150', $avatar);
    }

    public function testGetRoles()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'roleuser',
            'role' => 'administrator'
        ]);

        $roles = User::getRoles($userId);

        $this->assertIsArray($roles);
        $this->assertContains('administrator', $roles);
    }

    public function testHasRole()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'hasroleuser',
            'role' => 'administrator'
        ]);

        $this->assertTrue(User::hasRole($userId, 'administrator'));
        $this->assertFalse(User::hasRole($userId, 'subscriber'));
    }

    public function testHasAnyRole()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'anyroleuser',
            'role' => 'administrator'
        ]);

        $this->assertTrue(User::hasAnyRole($userId, ['administrator', 'editor']));
        $this->assertFalse(User::hasAnyRole($userId, ['subscriber', 'contributor']));
    }

    public function testHasAllRoles()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'allroleuser',
            'role' => 'administrator'
        ]);

        $this->assertTrue(User::hasAllRoles($userId, ['administrator']));
        $this->assertFalse(User::hasAllRoles($userId, ['administrator', 'editor']));
    }

    public function testGetMeta()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'metauser',
            'display_name' => 'Meta User'
        ]);

        // Set user meta
        update_user_meta($userId, 'custom_field', 'meta_value');

        $meta = User::getMeta($userId, 'custom_field');

        $this->assertEquals('meta_value', $meta);
    }

    public function testUpdateMeta()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'updatemetauser',
            'display_name' => 'Update Meta User'
        ]);

        $result = User::updateMeta($userId, 'updated_field', 'updated_value');

        $this->assertTrue($result);

        $meta = User::getMeta($userId, 'updated_field');
        $this->assertEquals('updated_value', $meta);
    }

    public function testDeleteMeta()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'deletemetauser',
            'display_name' => 'Delete Meta User'
        ]);

        // Set user meta first
        update_user_meta($userId, 'delete_field', 'delete_value');

        $result = User::deleteMeta($userId, 'delete_field');

        $this->assertTrue($result);

        $meta = User::getMeta($userId, 'delete_field');
        $this->assertEmpty($meta);
    }

    public function testGetRegistrationDate()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'regdateuser',
            'display_name' => 'Reg Date User'
        ]);

        $regDate = User::getRegistrationDate($userId, 'Y-m-d');

        $this->assertNotNull($regDate);
        $this->assertIsString($regDate);
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}$/', $regDate);
    }

    public function testGetLastLogin()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'lastloginuser',
            'display_name' => 'Last Login User'
        ]);

        // Set last login time
        update_user_meta($userId, 'last_login', time());

        $lastLogin = User::getLastLogin($userId, 'Y-m-d');

        $this->assertNotNull($lastLogin);
        $this->assertIsString($lastLogin);
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}$/', $lastLogin);
    }

    public function testUpdateLastLogin()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'updatelastloginuser',
            'display_name' => 'Update Last Login User'
        ]);

        $result = User::updateLastLogin($userId);

        $this->assertTrue($result);

        $lastLogin = User::getLastLogin($userId);
        $this->assertNotNull($lastLogin);
    }

    public function testGetLoginCount()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'logincountuser',
            'display_name' => 'Login Count User'
        ]);

        $count = User::getLoginCount($userId);
        $this->assertEquals(0, $count);
    }

    public function testIncrementLoginCount()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'incrementlogincountuser',
            'display_name' => 'Increment Login Count User'
        ]);

        $result = User::incrementLoginCount($userId);

        $this->assertTrue($result);

        $count = User::getLoginCount($userId);
        $this->assertEquals(1, $count);
    }

    public function testGetStatus()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'statususer',
            'display_name' => 'Status User'
        ]);

        $status = User::getStatus($userId);
        $this->assertEquals('active', $status);
    }

    public function testSetStatus()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'setstatususer',
            'display_name' => 'Set Status User'
        ]);

        $result = User::setStatus($userId, 'inactive');

        $this->assertTrue($result);

        $status = User::getStatus($userId);
        $this->assertEquals('inactive', $status);
    }

    public function testIsActive()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'activeuser',
            'display_name' => 'Active User'
        ]);

        $this->assertTrue(User::isActive($userId));

        User::setStatus($userId, 'inactive');
        $this->assertFalse(User::isActive($userId));
    }

    public function testGetProfileCompletion()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'completionuser',
            'display_name' => 'Completion User',
            'user_email' => 'completion@example.com'
        ]);

        $completion = User::getProfileCompletion($userId);

        $this->assertIsFloat($completion);
        $this->assertGreaterThan(0, $completion);
        $this->assertLessThanOrEqual(100, $completion);
    }

    public function testGetIncompleteProfiles()
    {
        $this->factory->user->create([
            'user_login' => 'incompleteuser1',
            'display_name' => 'Incomplete User 1',
            'role' => 'subscriber'
        ]);

        $this->factory->user->create([
            'user_login' => 'incompleteuser2',
            'display_name' => 'Incomplete User 2',
            'role' => 'subscriber'
        ]);

        $incompleteUsers = User::getIncompleteProfiles(80.0, ['ID', 'display_name']);

        $this->assertIsArray($incompleteUsers);
        // Should find users with incomplete profiles
        $this->assertNotEmpty($incompleteUsers);
    }

    public function testCacheManagement()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'cachefacadeuser',
            'display_name' => 'Cache Facade User'
        ]);

        // Set custom cache expiry
        User::setCacheExpiry(1800);
        $this->assertEquals(1800, User::getCacheExpiry());

        // Get user to populate cache
        User::get($userId);

        // Clear cache
        User::clearCache($userId);

        // Should still work
        $user = User::get($userId);
        $this->assertNotNull($user);
    }

    public function testCacheStatistics()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'statsfacadeuser',
            'display_name' => 'Stats Facade User'
        ]);

        // Get user (should be a miss)
        User::get($userId);

        // Get user again (should be a hit)
        User::get($userId);

        $stats = User::getCacheStats();
        $this->assertIsArray($stats);
        $this->assertArrayHasKey('hits', $stats);
        $this->assertArrayHasKey('misses', $stats);
        $this->assertArrayHasKey('sets', $stats);

        $hitRatio = User::getCacheHitRatio();
        $this->assertIsFloat($hitRatio);
        $this->assertGreaterThanOrEqual(0, $hitRatio);
        $this->assertLessThanOrEqual(1, $hitRatio);
    }

    public function testClearAllCache()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'clearalluser',
            'display_name' => 'Clear All User'
        ]);

        // Get user to populate cache
        User::get($userId);

        // Clear all cache
        User::clearCache();

        // Should still work
        $user = User::get($userId);
        $this->assertNotNull($user);
    }

    public function testErrorHandling()
    {
        // Test with non-existent user
        $user = User::get(99999);
        $this->assertNull($user);

        // Test with invalid input
        $this->expectException(\InvalidArgumentException::class);
        User::get('');

        // Test meta with non-existent user
        $meta = User::getMeta(99999, 'test_field');
        $this->assertNull($meta);

        // Test update meta with non-existent user
        $result = User::updateMeta(99999, 'test_field', 'test_value');
        $this->assertFalse($result);
    }

    public function testFacadeWithFilters()
    {
        $userId = $this->factory->user->create([
            'user_login' => 'filterfacadeuser',
            'display_name' => 'Filter Facade User'
        ]);

        // Add filter to modify user data
        add_filter('jankx/user/data', function($userData, $filterUserId, $fields) {
            if (is_array($userData)) {
                $userData['facade_filter'] = 'filtered';
            } elseif (is_object($userData)) {
                $userData->facade_filter = 'filtered';
            }
            return $userData;
        }, 10, 3);

        $user = User::get($userId);

        if (is_array($user)) {
            $this->assertEquals('filtered', $user['facade_filter']);
        } else {
            $this->assertEquals('filtered', $user->facade_filter);
        }
    }
}