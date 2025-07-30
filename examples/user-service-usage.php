<?php
/**
 * User Service Usage Examples
 *
 * This file demonstrates how to use the User Service and Facade
 * for managing user data with caching and filtering capabilities.
 */

// Example 1: Basic User Service Usage

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

use Jankx\Facades\User;
use Jankx\Facades\Logger;

// Get current user
$currentUser = User::current();
if ($currentUser) {
    echo "Current user: " . User::getDisplayName($currentUser->ID) . "\n";
}

// Get specific user by ID
$user = User::get(1, ['ID', 'display_name', 'user_email']);
if ($user) {
    echo "User 1: " . $user['display_name'] . " (" . $user['user_email'] . ")\n";
}

// Get user by username
$userByUsername = User::get('admin', ['ID', 'display_name']);
if ($userByUsername) {
    echo "Admin user: " . $userByUsername['display_name'] . "\n";
}

// Example 2: Batch Operations for Better Performance
// Get multiple users with batch optimization
$userIds = [1, 2, 3, 4, 5];
$multipleUsers = User::getBatch($userIds, ['ID', 'display_name', 'user_email']);
foreach ($multipleUsers as $user) {
    echo "Batch user: " . $user['display_name'] . "\n";
}

// Example 3: User Search and Role-based Queries
// Search for users
$searchResults = User::search('john', ['ID', 'display_name', 'user_email'], 5);
foreach ($searchResults as $user) {
    echo "Found user: " . $user['display_name'] . "\n";
}

// Get all administrators
$admins = User::getByRole('administrator', ['ID', 'display_name', 'user_email']);
echo "Found " . count($admins) . " administrators\n";

// Get multiple users by IDs
$userIds = [1, 2, 3];
$multipleUsers = User::getMultiple($userIds, ['ID', 'display_name']);
foreach ($multipleUsers as $userId => $user) {
    echo "User {$userId}: " . $user['display_name'] . "\n";
}

// Example 4: Advanced Role Management
// Check if user has specific role
if (User::hasRole(1, 'administrator')) {
    echo "User 1 is an administrator\n";
}

// Check if user has any of the specified roles
if (User::hasAnyRole(1, ['administrator', 'editor'])) {
    echo "User 1 has admin or editor role\n";
}

// Check if user has all of the specified roles
if (User::hasAllRoles(1, ['administrator'])) {
    echo "User 1 has all required roles\n";
}

// Get user roles
$roles = User::getRoles(1);
echo "User 1 roles: " . implode(', ', $roles) . "\n";

// Example 5: User Meta Management
// Get user meta
$userMeta = User::getMeta(1, 'custom_field', true);
if ($userMeta) {
    echo "User 1 custom field: " . $userMeta . "\n";
}

// Update user meta
$updated = User::updateMeta(1, 'last_activity', time());
if ($updated) {
    echo "Updated user 1 meta\n";
}

// Delete user meta
$deleted = User::deleteMeta(1, 'old_field');
if ($deleted) {
    echo "Deleted user 1 old field\n";
}

// Example 6: User Profile and Status Management
// Get user registration date
$regDate = User::getRegistrationDate(1, 'Y-m-d H:i:s');
if ($regDate) {
    echo "User 1 registered: " . $regDate . "\n";
}

// Get user last login
$lastLogin = User::getLastLogin(1, 'Y-m-d H:i:s');
if ($lastLogin) {
    echo "User 1 last login: " . $lastLogin . "\n";
}

// Update last login
User::updateLastLogin(1);

// Get and increment login count
$loginCount = User::getLoginCount(1);
echo "User 1 login count: " . $loginCount . "\n";
User::incrementLoginCount(1);

// Get user status
$status = User::getStatus(1);
echo "User 1 status: " . $status . "\n";

// Set user status
User::setStatus(1, 'active');

// Check if user is active
if (User::isActive(1)) {
    echo "User 1 is active\n";
}

// Example 7: Profile Completion Analysis
// Get user profile completion percentage
$completion = User::getProfileCompletion(1);
echo "User 1 profile completion: " . number_format($completion, 1) . "%\n";

// Get users with incomplete profiles
$incompleteUsers = User::getIncompleteProfiles(50.0, ['ID', 'display_name']);
echo "Found " . count($incompleteUsers) . " users with incomplete profiles\n";

// Example 8: Avatar and Profile Information
// Get user avatar
$avatarUrl = User::getAvatar(1, 150);
if ($avatarUrl) {
    echo "User 1 avatar: " . $avatarUrl . "\n";
}

// Get user email
$email = User::getEmail(1);
if ($email) {
    echo "User 1 email: " . $email . "\n";
}

// Example 9: Cache Management and Statistics
// Set custom cache expiry (30 minutes)
User::setCacheExpiry(1800);

// Get cache statistics
$cacheStats = User::getCacheStats();
echo "Cache hits: " . $cacheStats['hits'] . "\n";
echo "Cache misses: " . $cacheStats['misses'] . "\n";
echo "Cache sets: " . $cacheStats['sets'] . "\n";

// Get cache hit ratio
$hitRatio = User::getCacheHitRatio();
echo "Cache hit ratio: " . number_format($hitRatio * 100, 1) . "%\n";

// Clear cache for specific user
User::clearCache(1);

// Clear all user cache
User::clearCache();

// Example 10: Using Filters to Customize User Data
// Add custom filter to modify user data
add_filter('jankx_user_data', function($userData, $userId, $fields) {
    // Add custom field to user data
    if (is_array($userData)) {
        $userData['custom_info'] = "Custom info for user {$userId}";
    } elseif (is_object($userData)) {
        $userData->custom_info = "Custom info for user {$userId}";
    }

    return $userData;
}, 10, 3);

// Add context-specific filter
add_filter('jankx_user_data_admin', function($userData, $userId, $fields) {
    // Add admin-specific data
    if (is_array($userData)) {
        $userData['admin_access'] = true;
    } elseif (is_object($userData)) {
        $userData->admin_access = true;
    }

    return $userData;
}, 10, 3);

// Add field-specific filter
add_filter('jankx_user_data_fields', function($userData, $userId, $fields) {
    // Modify specific fields
    if (in_array('display_name', $fields) && is_array($userData)) {
        $userData['display_name'] = "Modified: " . $userData['display_name'];
    }

    return $userData;
}, 10, 3);

// Example 11: Event Hooks Integration
// Listen for user loaded events
add_action('jankx_user_loaded', function($user, $userId) {
    echo "User {$userId} loaded\n";
}, 10, 2);

// Listen for batch users loaded events
add_action('jankx_users_batch_loaded', function($users, $userIds) {
    echo "Batch loaded " . count($users) . " users\n";
}, 10, 2);

// Listen for cache hit events
add_action('jankx_user_cache_hit', function($cacheKey) {
    echo "Cache hit for key: {$cacheKey}\n";
});

// Listen for cache cleared events
add_action('jankx_user_cache_cleared', function($userId) {
    echo "Cache cleared for user: {$userId}\n";
});

// Example 12: Error Handling
/**
 * Class SafeUserLoader
 *
 * @since 2.0.0
 */
class SafeUserLoader
{
    /**
     * Method loadUser
     *
     * @since 2.0.0
     */
    public function loadUser($userId)
    {
        try {
            $user = User::get($userId);
            if (!$user) {
                Logger::warning("User not found: {$userId}");
                return null;
            }

            return $user;

        } catch (\InvalidArgumentException $e) {
            Logger::error("Invalid user ID: {$userId}", [
                'user_id' => $userId,
                'error' => $e->getMessage(),
            ]);
            return null;
        } catch (\Exception $e) {
            Logger::error("Failed to load user: {$userId}", [
                'user_id' => $userId,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }
}

// Example 13: Performance Monitoring
/**
 * Class UserPerformanceMonitor
 *
 * @since 2.0.0
 */
class UserPerformanceMonitor
{
    /**
     * Method monitorUserLoading
     *
     * @since 2.0.0
     */
    public function monitorUserLoading($userId)
    {
        $startTime = microtime(true);
        $startMemory = memory_get_usage(true);

        $user = User::get($userId);

        $endTime = microtime(true);
        $endMemory = memory_get_usage(true);

        $loadTime = $endTime - $startTime;
        $memoryUsage = $endMemory - $startMemory;

        Logger::info("User loading performance", [
            'user_id' => $userId,
            'load_time' => $loadTime,
            'memory_usage' => $memoryUsage,
            'cached' => $user !== null,
        ]);

        return $user;
    }

    /**
     * Method monitorBatchLoading
     *
     * @since 2.0.0
     */
    public function monitorBatchLoading($userIds)
    {
        $startTime = microtime(true);
        $startMemory = memory_get_usage(true);

        $users = User::getBatch($userIds);

        $endTime = microtime(true);
        $endMemory = memory_get_usage(true);

        $loadTime = $endTime - $startTime;
        $memoryUsage = $endMemory - $startMemory;

        Logger::info("Batch user loading performance", [
            'user_count' => count($userIds),
            'load_time' => $loadTime,
            'memory_usage' => $memoryUsage,
            'users_loaded' => count($users),
        ]);

        return $users;
    }
}

// Example 14: Advanced Usage in Templates
/**
 * Class UserTemplateHelper
 *
 * @since 2.0.0
 */
class UserTemplateHelper
{
    /**
     * Method renderUserProfile
     *
     * @since 2.0.0
     */
    public function renderUserProfile($userId)
    {
        $user = User::get($userId, [
            'ID', 'display_name', 'user_email', 'user_registered'
        ]);

        if (!$user) {
            return '<p>User not found</p>';
        }

        $avatar = User::getAvatar($userId, 100);
        $roles = User::getRoles($userId);
        $completion = User::getProfileCompletion($userId);
        $status = User::getStatus($userId);

        $html = '<div class="user-profile">';
        $html .= '<img src="' . esc_url($avatar) . '" alt="User Avatar" />';
        $html .= '<h3>' . esc_html($user['display_name']) . '</h3>';
        $html .= '<p>Email: ' . esc_html($user['user_email']) . '</p>';
        $html .= '<p>Roles: ' . esc_html(implode(', ', $roles)) . '</p>';
        $html .= '<p>Registered: ' . esc_html($user['user_registered']) . '</p>';
        $html .= '<p>Profile Completion: ' . number_format($completion, 1) . '%</p>';
        $html .= '<p>Status: ' . esc_html($status) . '</p>';
        $html .= '</div>';

        return $html;
    }

    /**
     * Method renderUserList
     *
     * @since 2.0.0
     */
    public function renderUserList($userIds)
    {
        $users = User::getBatch($userIds, ['ID', 'display_name', 'user_email']);
        
        if (empty($users)) {
            return '<p>No users found</p>';
        }

        $html = '<div class="user-list">';
        foreach ($users as $user) {
            $html .= '<div class="user-item">';
            $html .= '<h4>' . esc_html($user['display_name']) . '</h4>';
            $html .= '<p>' . esc_html($user['user_email']) . '</p>';
            $html .= '</div>';
        }
        $html .= '</div>';

        return $html;
    }
}

// Example 15: Integration with WordPress Hooks
/**
 * Class UserHookIntegration
 *
 * @since 2.0.0
 */
class UserHookIntegration
{
    /**
     * Method __construct
     *
     * @since 2.0.0
     */
    public function __construct()
    {
        // Clear user cache when user is updated
        add_action('profile_update', [$this, 'clearUserCache']);
        add_action('user_register', [$this, 'clearUserCache']);
        add_action('delete_user', [$this, 'clearUserCache']);
        
        // Update last login on user login
        add_action('wp_login', [$this, 'updateUserLoginInfo'], 10, 2);
        
        // Monitor user activity
        add_action('wp_loaded', [$this, 'monitorUserActivity']);
    }

    /**
     * Method clearUserCache
     *
     * @since 2.0.0
     */
    public function clearUserCache($userId)
    {
        User::clearCache($userId);
        Logger::info("Cleared cache for user: {$userId}");
    }

    /**
     * Method updateUserLoginInfo
     *
     * @since 2.0.0
     */
    public function updateUserLoginInfo($userLogin, $user)
    {
        User::updateLastLogin($user->ID);
        User::incrementLoginCount($user->ID);
        Logger::info("Updated login info for user: {$user->ID}");
    }

    /**
     * Method monitorUserActivity
     *
     * @since 2.0.0
     */
    public function monitorUserActivity()
    {
        if (is_user_logged_in()) {
            $currentUser = wp_get_current_user();
            User::updateMeta($currentUser->ID, 'last_activity', time());
        }
    }
}

// Initialize hook integration
new UserHookIntegration();