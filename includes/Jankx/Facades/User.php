<?php

namespace Jankx\Facades;

use Jankx\Services\UserService;

/**
 * User Facade
 *
 * Provides easy access to user service functionality
 *
 * @package Jankx\Facades
 */
class User extends Facade
{
    /**
     * Get the registered name of the component.
     */
    protected static function getFacadeAccessor()
    {
        return 'user.service';
    }

    /**
     * Get user information with caching
     *
     * @param int|string $user_id User ID or username/email
     * @param array $fields Specific fields to retrieve
     * @return array|WP_User|null User data or null if not found
     * @throws \InvalidArgumentException When user_id is empty
     * @throws UserServiceException When database query fails
     */
    public static function get($user_id, array $fields = []): mixed
    {
        $service = static::getFacadeRoot();
        return $service->getUser($user_id, $fields);
    }

    /**
     * Get current user information
     *
     * @param array $fields Specific fields to retrieve
     * @return array|WP_User|null Current user data
     */
    public static function current(array $fields = []): mixed
    {
        $service = static::getFacadeRoot();
        return $service->getCurrentUser($fields);
    }

    /**
     * Get multiple users by IDs with batch optimization
     *
     * @param array $user_ids Array of user IDs
     * @param array $fields Specific fields to retrieve
     * @return array Array of user data
     * @throws \InvalidArgumentException When user_ids is empty
     */
    public static function getMultiple(array $user_ids, array $fields = []): array
    {
        $service = static::getFacadeRoot();
        return $service->getUsers($user_ids, $fields);
    }

    /**
     * Get multiple users with batch database query (alias for getMultiple)
     *
     * @param array $user_ids Array of user IDs
     * @param array $fields Specific fields to retrieve
     * @return array Array of user data
     * @throws \InvalidArgumentException When user_ids is empty
     */
    public static function getBatch(array $user_ids, array $fields = []): array
    {
        return static::getMultiple($user_ids, $fields);
    }

    /**
     * Get users by role
     *
     * @param string $role User role
     * @param array $fields Specific fields to retrieve
     * @param int $limit Maximum number of users to retrieve
     * @return array Array of user data
     * @throws \InvalidArgumentException When role is empty
     */
    public static function getByRole(string $role, array $fields = [], int $limit = -1): array
    {
        $service = static::getFacadeRoot();
        return $service->getUsersByRole($role, $fields, $limit);
    }

    /**
     * Search users
     *
     * @param string $search_term Search term
     * @param array $fields Specific fields to retrieve
     * @param int $limit Maximum number of users to retrieve
     * @return array Array of user data
     * @throws \InvalidArgumentException When search_term is empty
     */
    public static function search(string $search_term, array $fields = [], int $limit = 10): array
    {
        $service = static::getFacadeRoot();
        return $service->searchUsers($search_term, $fields, $limit);
    }

    /**
     * Clear user cache
     *
     * @param int|string|null $user_id Specific user ID or null for all
     * @return void
     */
    public static function clearCache($user_id = null): void
    {
        $service = static::getFacadeRoot();
        $service->clearCache($user_id);
    }

    /**
     * Set cache expiry time
     *
     * @param int $seconds Cache expiry time in seconds
     * @return void
     * @throws \InvalidArgumentException When seconds is negative
     */
    public static function setCacheExpiry(int $seconds): void
    {
        $service = static::getFacadeRoot();
        $service->setCacheExpiry($seconds);
    }

    /**
     * Get cache expiry time
     *
     * @return int Cache expiry time in seconds
     */
    public static function getCacheExpiry(): int
    {
        $service = static::getFacadeRoot();
        return $service->getCacheExpiry();
    }

    /**
     * Get cache statistics
     *
     * @return array Cache statistics
     */
    public static function getCacheStats(): array
    {
        $service = static::getFacadeRoot();
        return $service->getCacheStats();
    }

    /**
     * Get cache hit ratio
     *
     * @return float Cache hit ratio (0-1)
     */
    public static function getCacheHitRatio(): float
    {
        $service = static::getFacadeRoot();
        return $service->getCacheHitRatio();
    }

    /**
     * Check if user exists
     *
     * @param int|string $user_id User ID or username/email
     * @return bool True if user exists
     */
    public static function exists($user_id): bool
    {
        $service = static::getFacadeRoot();
        $user = $service->getUser($user_id);
        return $user !== null;
    }

    /**
     * Get user ID by username or email
     *
     * @param string $identifier Username or email
     * @return int|null User ID or null if not found
     */
    public static function getId($identifier): ?int
    {
        $service = static::getFacadeRoot();
        $user = $service->getUser($identifier, ['ID']);

        if (is_array($user) && isset($user['ID'])) {
            return (int) $user['ID'];
        } elseif (is_object($user) && isset($user->ID)) {
            return (int) $user->ID;
        }

        return null;
    }

    /**
     * Get user display name
     *
     * @param int|string $user_id User ID or username/email
     * @return string|null Display name or null if not found
     */
    public static function getDisplayName($user_id): ?string
    {
        $service = static::getFacadeRoot();
        $user = $service->getUser($user_id, ['display_name']);

        if (is_array($user) && isset($user['display_name'])) {
            return $user['display_name'];
        } elseif (is_object($user) && isset($user->display_name)) {
            return $user->display_name;
        }

        return null;
    }

    /**
     * Get user email
     *
     * @param int|string $user_id User ID or username/email
     * @return string|null Email or null if not found
     */
    public static function getEmail($user_id): ?string
    {
        $service = static::getFacadeRoot();
        $user = $service->getUser($user_id, ['user_email']);

        if (is_array($user) && isset($user['user_email'])) {
            return $user['user_email'];
        } elseif (is_object($user) && isset($user->user_email)) {
            return $user->user_email;
        }

        return null;
    }

    /**
     * Get user avatar URL
     *
     * @param int|string $user_id User ID or username/email
     * @param int $size Avatar size
     * @return string|null Avatar URL or null if not found
     */
    public static function getAvatar($user_id, int $size = 96): ?string
    {
        $service = static::getFacadeRoot();
        $user = $service->getUser($user_id, ['ID']);

        if (!$user) {
            return null;
        }

        $userId = is_array($user) ? $user['ID'] : $user->ID;
        return get_avatar_url($userId, ['size' => $size]);
    }

    /**
     * Get user roles
     *
     * @param int|string $user_id User ID or username/email
     * @return array Array of user roles
     */
    public static function getRoles($user_id): array
    {
        $service = static::getFacadeRoot();
        $user = $service->getUser($user_id, ['ID']);

        if (!$user) {
            return [];
        }

        $userId = is_array($user) ? $user['ID'] : $user->ID;
        $userObj = get_user_by('ID', $userId);

        return $userObj ? $userObj->roles : [];
    }

    /**
     * Check if user has specific role
     *
     * @param int|string $user_id User ID or username/email
     * @param string $role Role to check
     * @return bool True if user has the role
     */
    public static function hasRole($user_id, string $role): bool
    {
        $roles = static::getRoles($user_id);
        return in_array($role, $roles, true);
    }

    /**
     * Check if user has any of the specified roles
     *
     * @param int|string $user_id User ID or username/email
     * @param array $roles Array of roles to check
     * @return bool True if user has any of the roles
     */
    public static function hasAnyRole($user_id, array $roles): bool
    {
        $userRoles = static::getRoles($user_id);
        return !empty(array_intersect($roles, $userRoles));
    }

    /**
     * Check if user has all of the specified roles
     *
     * @param int|string $user_id User ID or username/email
     * @param array $roles Array of roles to check
     * @return bool True if user has all of the roles
     */
    public static function hasAllRoles($user_id, array $roles): bool
    {
        $userRoles = static::getRoles($user_id);
        return count(array_intersect($roles, $userRoles)) === count($roles);
    }

    /**
     * Get user meta data
     *
     * @param int|string $user_id User ID or username/email
     * @param string $key Meta key
     * @param bool $single Whether to return a single value
     * @return mixed Meta value
     */
    public static function getMeta($user_id, string $key, bool $single = true): mixed
    {
        $service = static::getFacadeRoot();
        $user = $service->getUser($user_id, ['ID']);

        if (!$user) {
            return null;
        }

        $userId = is_array($user) ? $user['ID'] : $user->ID;
        return get_user_meta($userId, $key, $single);
    }

    /**
     * Update user meta data
     *
     * @param int|string $user_id User ID or username/email
     * @param string $key Meta key
     * @param mixed $value Meta value
     * @return int|bool Meta ID if the key didn't exist, true on successful update, false on failure
     */
    public static function updateMeta($user_id, string $key, mixed $value): mixed
    {
        $service = static::getFacadeRoot();
        $user = $service->getUser($user_id, ['ID']);

        if (!$user) {
            return false;
        }

        $userId = is_array($user) ? $user['ID'] : $user->ID;
        $result = update_user_meta($userId, $key, $value);

        // Clear cache for this user after meta update
        if ($result) {
            $service->clearCache($userId);
        }

        return $result;
    }

    /**
     * Delete user meta data
     *
     * @param int|string $user_id User ID or username/email
     * @param string $key Meta key
     * @return bool True on successful delete, false on failure
     */
    public static function deleteMeta($user_id, string $key): bool
    {
        $service = static::getFacadeRoot();
        $user = $service->getUser($user_id, ['ID']);

        if (!$user) {
            return false;
        }

        $userId = is_array($user) ? $user['ID'] : $user->ID;
        $result = delete_user_meta($userId, $key);

        // Clear cache for this user after meta delete
        if ($result) {
            $service->clearCache($userId);
        }

        return $result;
    }

    /**
     * Get user registration date
     *
     * @param int|string $user_id User ID or username/email
     * @param string $format Date format (default: 'Y-m-d H:i:s')
     * @return string|null Registration date or null if not found
     */
    public static function getRegistrationDate($user_id, string $format = 'Y-m-d H:i:s'): ?string
    {
        $service = static::getFacadeRoot();
        $user = $service->getUser($user_id, ['user_registered']);

        if (is_array($user) && isset($user['user_registered'])) {
            return date($format, strtotime($user['user_registered']));
        } elseif (is_object($user) && isset($user->user_registered)) {
            return date($format, strtotime($user->user_registered));
        }

        return null;
    }

    /**
     * Get user last login time (requires custom meta field)
     *
     * @param int|string $user_id User ID or username/email
     * @param string $format Date format (default: 'Y-m-d H:i:s')
     * @return string|null Last login time or null if not found
     */
    public static function getLastLogin($user_id, string $format = 'Y-m-d H:i:s'): ?string
    {
        $lastLogin = static::getMeta($user_id, 'last_login');
        
        if ($lastLogin) {
            return date($format, (int) $lastLogin);
        }

        return null;
    }

    /**
     * Update user last login time
     *
     * @param int|string $user_id User ID or username/email
     * @return bool True on successful update, false on failure
     */
    public static function updateLastLogin($user_id): bool
    {
        return static::updateMeta($user_id, 'last_login', time());
    }

    /**
     * Get user login count
     *
     * @param int|string $user_id User ID or username/email
     * @return int Login count
     */
    public static function getLoginCount($user_id): int
    {
        $count = static::getMeta($user_id, 'login_count');
        return $count ? (int) $count : 0;
    }

    /**
     * Increment user login count
     *
     * @param int|string $user_id User ID or username/email
     * @return bool True on successful update, false on failure
     */
    public static function incrementLoginCount($user_id): bool
    {
        $currentCount = static::getLoginCount($user_id);
        return static::updateMeta($user_id, 'login_count', $currentCount + 1);
    }

    /**
     * Get user status (active, inactive, banned, etc.)
     *
     * @param int|string $user_id User ID or username/email
     * @return string User status
     */
    public static function getStatus($user_id): string
    {
        $status = static::getMeta($user_id, 'user_status');
        return $status ?: 'active';
    }

    /**
     * Set user status
     *
     * @param int|string $user_id User ID or username/email
     * @param string $status User status
     * @return bool True on successful update, false on failure
     */
    public static function setStatus($user_id, string $status): bool
    {
        return static::updateMeta($user_id, 'user_status', $status);
    }

    /**
     * Check if user is active
     *
     * @param int|string $user_id User ID or username/email
     * @return bool True if user is active
     */
    public static function isActive($user_id): bool
    {
        return static::getStatus($user_id) === 'active';
    }

    /**
     * Get user profile completion percentage
     *
     * @param int|string $user_id User ID or username/email
     * @return float Completion percentage (0-100)
     */
    public static function getProfileCompletion($user_id): float
    {
        $service = static::getFacadeRoot();
        $user = $service->getUser($user_id, [
            'display_name', 'user_email', 'user_url', 'description'
        ]);

        if (!$user) {
            return 0.0;
        }

        $requiredFields = ['display_name', 'user_email'];
        $optionalFields = ['user_url', 'description'];
        
        $completed = 0;
        $total = count($requiredFields) + count($optionalFields);

        // Check required fields
        foreach ($requiredFields as $field) {
            $value = is_array($user) ? ($user[$field] ?? '') : ($user->$field ?? '');
            if (!empty($value)) {
                $completed++;
            }
        }

        // Check optional fields
        foreach ($optionalFields as $field) {
            $value = is_array($user) ? ($user[$field] ?? '') : ($user->$field ?? '');
            if (!empty($value)) {
                $completed++;
            }
        }

        return ($completed / $total) * 100;
    }

    /**
     * Get users with incomplete profiles
     *
     * @param float $minCompletion Minimum completion percentage (default: 50)
     * @param array $fields Specific fields to retrieve
     * @return array Array of users with incomplete profiles
     */
    public static function getIncompleteProfiles(float $minCompletion = 50.0, array $fields = []): array
    {
        $allUsers = static::getByRole('subscriber', $fields);
        $incompleteUsers = [];

        foreach ($allUsers as $user) {
            $userId = is_array($user) ? $user['ID'] : $user->ID;
            $completion = static::getProfileCompletion($userId);
            
            if ($completion < $minCompletion) {
                $incompleteUsers[] = $user;
            }
        }

        return $incompleteUsers;
    }
}