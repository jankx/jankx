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
     * Get multiple users by IDs
     *
     * @param array $user_ids Array of user IDs
     * @param array $fields Specific fields to retrieve
     * @return array Array of user data
     */
    public static function getMultiple(array $user_ids, array $fields = []): array
    {
        $service = static::getFacadeRoot();
        return $service->getUsers($user_ids, $fields);
    }

    /**
     * Get users by role
     *
     * @param string $role User role
     * @param array $fields Specific fields to retrieve
     * @param int $limit Maximum number of users to retrieve
     * @return array Array of user data
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
}