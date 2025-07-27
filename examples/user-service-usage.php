<?php
/**
 * User Service Usage Examples
 *
 * This file demonstrates how to use the User Service and Facade
 * for managing user data with caching and filtering capabilities.
 */

// Example 1: Basic User Service Usage
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

// Example 2: User Search and Role-based Queries
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

// Example 3: User Meta and Roles
// Check if user has specific role
if (User::hasRole(1, 'administrator')) {
    echo "User 1 is an administrator\n";
}

// Get user roles
$roles = User::getRoles(1);
echo "User 1 roles: " . implode(', ', $roles) . "\n";

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

// Example 4: Avatar and Profile Information
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

// Example 5: Cache Management
// Set custom cache expiry (30 minutes)
User::setCacheExpiry(1800);

// Clear cache for specific user
User::clearCache(1);

// Clear all user cache
User::clearCache();

// Example 6: Using Filters to Customize User Data
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

// Example 7: Error Handling
class SafeUserLoader
{
    public function loadUser($userId)
    {
        try {
            $user = User::get($userId);
            if (!$user) {
                Logger::warning("User not found: {$userId}");
                return null;
            }

            return $user;

        } catch (\Exception $e) {
            Logger::error("Failed to load user: {$userId}", [
                'user_id' => $userId,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }
}

// Example 8: Performance Monitoring
class UserPerformanceMonitor
{
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
}

// Example 9: Advanced Usage in Templates
class UserTemplateHelper
{
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

        $html = '<div class="user-profile">';
        $html .= '<img src="' . esc_url($avatar) . '" alt="User Avatar" />';
        $html .= '<h3>' . esc_html($user['display_name']) . '</h3>';
        $html .= '<p>Email: ' . esc_html($user['user_email']) . '</p>';
        $html .= '<p>Roles: ' . esc_html(implode(', ', $roles)) . '</p>';
        $html .= '<p>Registered: ' . esc_html($user['user_registered']) . '</p>';
        $html .= '</div>';

        return $html;
    }
}

// Example 10: Integration with WordPress Hooks
class UserHookIntegration
{
    public function __construct()
    {
        // Clear user cache when user is updated
        add_action('profile_update', [$this, 'clearUserCache']);
        add_action('user_register', [$this, 'clearUserCache']);
        add_action('delete_user', [$this, 'clearUserCache']);
    }

    public function clearUserCache($userId)
    {
        User::clearCache($userId);
        Logger::info("Cleared cache for user: {$userId}");
    }
}

// Initialize hook integration
new UserHookIntegration();