<?php

namespace Jankx\Services;

use Jankx\Facades\Logger;
use WP_User;

/**
 * User Service
 *
 * Handles user data retrieval with caching and filtering capabilities
 *
 * @package Jankx\Services
 * @since 2.0.1
 */
class UserService
{
    private $cache = [];
    private $cacheExpiry = 3600; // 1 hour default
    private $cachePrefix = 'jankx_user_';

    /**
     * Get user information with caching
     *
     * @param int|string $user_id User ID or username/email
     * @param array $fields Specific fields to retrieve
     * @return array|WP_User|null User data or null if not found
     */
    public function getUser($user_id, array $fields = []): mixed
    {
        $cacheKey = $this->getCacheKey($user_id, $fields);
        
        // Check cache first
        $cachedData = $this->getFromCache($cacheKey);
        if ($cachedData !== false) {
            return $cachedData;
        }

        // Get user data from database
        $userData = $this->fetchUserFromDatabase($user_id, $fields);
        
        if ($userData) {
            // Apply filters to allow customization
            $userData = $this->applyUserFilters($userData, $user_id, $fields);
            
            // Cache the filtered data
            $this->setCache($cacheKey, $userData);
        }

        return $userData;
    }

    /**
     * Get current user information
     *
     * @param array $fields Specific fields to retrieve
     * @return array|WP_User|null Current user data
     */
    public function getCurrentUser(array $fields = []): mixed
    {
        $currentUser = wp_get_current_user();
        
        if (!$currentUser->exists()) {
            return null;
        }

        return $this->getUser($currentUser->ID, $fields);
    }

    /**
     * Get multiple users by IDs
     *
     * @param array $user_ids Array of user IDs
     * @param array $fields Specific fields to retrieve
     * @return array Array of user data
     */
    public function getUsers(array $user_ids, array $fields = []): array
    {
        $users = [];
        
        foreach ($user_ids as $user_id) {
            $user = $this->getUser($user_id, $fields);
            if ($user) {
                $users[$user_id] = $user;
            }
        }

        return $users;
    }

    /**
     * Get users by role
     *
     * @param string $role User role
     * @param array $fields Specific fields to retrieve
     * @param int $limit Maximum number of users to retrieve
     * @return array Array of user data
     */
    public function getUsersByRole(string $role, array $fields = [], int $limit = -1): array
    {
        $cacheKey = $this->getCacheKey("role_{$role}", $fields);
        
        // Check cache first
        $cachedData = $this->getFromCache($cacheKey);
        if ($cachedData !== false) {
            return array_slice($cachedData, 0, $limit > 0 ? $limit : count($cachedData));
        }

        $users = get_users([
            'role' => $role,
            'fields' => empty($fields) ? 'all' : $fields,
            'number' => $limit,
        ]);

        if (!empty($users)) {
            // Apply filters to each user
            foreach ($users as $key => $user) {
                $users[$key] = $this->applyUserFilters($user, $user->ID ?? $user['ID'] ?? null, $fields);
            }
            
            // Cache the filtered data
            $this->setCache($cacheKey, $users);
        }

        return $users;
    }

    /**
     * Search users
     *
     * @param string $search_term Search term
     * @param array $fields Specific fields to retrieve
     * @param int $limit Maximum number of users to retrieve
     * @return array Array of user data
     */
    public function searchUsers(string $search_term, array $fields = [], int $limit = 10): array
    {
        $cacheKey = $this->getCacheKey("search_{$search_term}", $fields);
        
        // Check cache first
        $cachedData = $this->getFromCache($cacheKey);
        if ($cachedData !== false) {
            return array_slice($cachedData, 0, $limit);
        }

        $users = get_users([
            'search' => "*{$search_term}*",
            'search_columns' => ['user_login', 'user_email', 'display_name'],
            'fields' => empty($fields) ? 'all' : $fields,
            'number' => $limit,
        ]);

        if (!empty($users)) {
            // Apply filters to each user
            foreach ($users as $key => $user) {
                $users[$key] = $this->applyUserFilters($user, $user->ID ?? $user['ID'] ?? null, $fields);
            }
            
            // Cache the filtered data
            $this->setCache($cacheKey, $users);
        }

        return $users;
    }

    /**
     * Clear user cache
     *
     * @param int|string|null $user_id Specific user ID or null for all
     * @return void
     */
    public function clearCache($user_id = null): void
    {
        if ($user_id === null) {
            // Clear all user cache
            $this->cache = [];
            wp_cache_flush_group('jankx_user_cache');
        } else {
            // Clear specific user cache
            $cacheKey = $this->getCacheKey($user_id);
            unset($this->cache[$cacheKey]);
            wp_cache_delete($cacheKey, 'jankx_user_cache');
        }
    }

    /**
     * Set cache expiry time
     *
     * @param int $seconds Cache expiry time in seconds
     * @return void
     */
    public function setCacheExpiry(int $seconds): void
    {
        $this->cacheExpiry = $seconds;
    }

    /**
     * Get cache expiry time
     *
     * @return int Cache expiry time in seconds
     */
    public function getCacheExpiry(): int
    {
        return $this->cacheExpiry;
    }

    /**
     * Get cache key for user data
     *
     * @param int|string $user_id User ID or identifier
     * @param array $fields Specific fields
     * @return string Cache key
     */
    private function getCacheKey($user_id, array $fields = []): string
    {
        $key = $this->cachePrefix . md5(serialize([$user_id, $fields]));
        return $key;
    }

    /**
     * Get data from cache
     *
     * @param string $cacheKey Cache key
     * @return mixed Cached data or false if not found/expired
     */
    private function getFromCache(string $cacheKey): mixed
    {
        // Check memory cache first
        if (isset($this->cache[$cacheKey])) {
            $cached = $this->cache[$cacheKey];
            if ($cached['expiry'] > time()) {
                return $cached['data'];
            }
            unset($this->cache[$cacheKey]);
        }

        // Check WordPress object cache
        $cached = wp_cache_get($cacheKey, 'jankx_user_cache');
        if ($cached !== false) {
            if ($cached['expiry'] > time()) {
                $this->cache[$cacheKey] = $cached;
                return $cached['data'];
            }
            wp_cache_delete($cacheKey, 'jankx_user_cache');
        }

        return false;
    }

    /**
     * Set data in cache
     *
     * @param string $cacheKey Cache key
     * @param mixed $data Data to cache
     * @return void
     */
    private function setCache(string $cacheKey, mixed $data): void
    {
        $cacheData = [
            'data' => $data,
            'expiry' => time() + $this->cacheExpiry,
        ];

        // Store in memory cache
        $this->cache[$cacheKey] = $cacheData;

        // Store in WordPress object cache
        wp_cache_set($cacheKey, $cacheData, 'jankx_user_cache', $this->cacheExpiry);
    }

    /**
     * Fetch user data from database
     *
     * @param int|string $user_id User ID or username/email
     * @param array $fields Specific fields to retrieve
     * @return array|WP_User|null User data
     */
    private function fetchUserFromDatabase($user_id, array $fields = []): mixed
    {
        try {
            // Try to get user by ID first
            if (is_numeric($user_id)) {
                $user = get_user_by('ID', $user_id);
            } else {
                // Try by username or email
                $user = get_user_by('login', $user_id);
                if (!$user) {
                    $user = get_user_by('email', $user_id);
                }
            }

            if (!$user) {
                return null;
            }

            // If specific fields requested, return only those fields
            if (!empty($fields)) {
                $userData = [];
                foreach ($fields as $field) {
                    if (isset($user->$field)) {
                        $userData[$field] = $user->$field;
                    }
                }
                return $userData;
            }

            return $user;

        } catch (\Exception $e) {
            Logger::error('Failed to fetch user from database', [
                'user_id' => $user_id,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Apply filters to user data
     *
     * @param mixed $userData User data
     * @param int|null $user_id User ID
     * @param array $fields Requested fields
     * @return mixed Filtered user data
     */
    private function applyUserFilters(mixed $userData, ?int $user_id, array $fields): mixed
    {
        // Allow plugins and themes to modify user data
        $filteredData = apply_filters('jankx_user_data', $userData, $user_id, $fields);
        
        // Allow specific field filtering
        if (!empty($fields)) {
            $filteredData = apply_filters('jankx_user_data_fields', $filteredData, $user_id, $fields);
        }

        // Allow context-specific filtering
        $context = $this->getCurrentContext();
        $filteredData = apply_filters("jankx_user_data_{$context}", $filteredData, $user_id, $fields);

        return $filteredData;
    }

    /**
     * Get current context
     *
     * @return string Current context
     */
    private function getCurrentContext(): string
    {
        if (is_admin()) {
            return 'admin';
        } elseif (wp_doing_ajax()) {
            return 'ajax';
        } elseif (wp_doing_cron()) {
            return 'cron';
        } elseif (defined('REST_REQUEST') && REST_REQUEST) {
            return 'rest';
        } else {
            return 'frontend';
        }
    }
} 