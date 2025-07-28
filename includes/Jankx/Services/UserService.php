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
    private $maxCacheSize = 1000; // Limit memory cache size
    private $cacheStats = [
        'hits' => 0,
        'misses' => 0,
        'sets' => 0,
    ];

    /**
     * Get user information with caching
     *
     * @param int|string $user_id User ID or username/email
     * @param array $fields Specific fields to retrieve. If empty, returns all fields
     * @return array|WP_User|null User data or null if not found
     * @throws \InvalidArgumentException When user_id is empty
     * @throws UserServiceException When database query fails
     *
     * @example
     * $user = User::get(1, ['ID', 'display_name']);
     * $user = User::get('admin', ['user_email']);
     */
    public function getUser($user_id, array $fields = []): mixed
    {
        // Validate input
        if (empty($user_id)) {
            throw new \InvalidArgumentException('User ID cannot be empty');
        }

        // Sanitize fields
        $fields = $this->sanitizeFields($fields);

        $cacheKey = $this->getCacheKey($user_id, $fields);

        // Check cache first
        $cachedData = $this->getFromCache($cacheKey);
        if ($cachedData !== false) {
            $this->cacheStats['hits']++;
            $this->triggerCacheHitEvent($cacheKey);
            return $cachedData;
        }

        $this->cacheStats['misses']++;

        // Get user data from database
        $userData = $this->fetchUserFromDatabase($user_id, $fields);

        if ($userData) {
            // Apply filters to allow customization
            $userData = $this->applyUserFilters($userData, $user_id, $fields);

            // Cache the filtered data
            $this->setCache($cacheKey, $userData);

            // Trigger user loaded event
            $this->triggerUserLoadedEvent($userData, $user_id);
        }

        return $userData;
    }

    /**
     * Get multiple users by IDs with batch optimization
     *
     * @param array $user_ids Array of user IDs
     * @param array $fields Specific fields to retrieve
     * @return array Array of user data
     * @throws \InvalidArgumentException When user_ids is empty
     */
    public function getUsers(array $user_ids, array $fields = []): array
    {
        if (empty($user_ids)) {
            throw new \InvalidArgumentException('User IDs array cannot be empty');
        }

        // Sanitize fields
        $fields = $this->sanitizeFields($fields);

        // Use batch operation for better performance
        return $this->getUsersBatch($user_ids, $fields);
    }

    /**
     * Get multiple users with batch database query
     *
     * @param array $user_ids Array of user IDs
     * @param array $fields Specific fields to retrieve
     * @return array Array of user data
     */
    public function getUsersBatch(array $user_ids, array $fields = []): array
    {
        $cacheKey = $this->getCacheKey('batch_' . md5(serialize($user_ids)), $fields);

        // Check cache first
        $cachedData = $this->getFromCache($cacheKey);
        if ($cachedData !== false) {
            $this->cacheStats['hits']++;
            return $cachedData;
        }

        $this->cacheStats['misses']++;

        try {
            $users = get_users([
                'include' => $user_ids,
                'fields' => empty($fields) ? 'all' : $fields,
            ]);

            if (!empty($users)) {
                // Apply filters to each user
                foreach ($users as $key => $user) {
                    $userId = is_array($user) ? ($user['ID'] ?? null) : ($user->ID ?? null);
                    $users[$key] = $this->applyUserFilters($user, $userId, $fields);
                }

                // Cache the filtered data
                $this->setCache($cacheKey, $users);

                // Trigger batch loaded event
                $this->triggerBatchUsersLoadedEvent($users, $user_ids);
            }

            return $users;

        } catch (\Exception $e) {
            Logger::error('Failed to fetch users batch from database', [
                'user_ids' => $user_ids,
                'error' => $e->getMessage(),
            ]);
            throw new UserServiceException("Failed to fetch users batch", 0, $e);
        }
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
     * Get users by role
     *
     * @param string $role User role
     * @param array $fields Specific fields to retrieve
     * @param int $limit Maximum number of users to retrieve
     * @return array Array of user data
     * @throws \InvalidArgumentException When role is empty
     */
    public function getUsersByRole(string $role, array $fields = [], int $limit = -1): array
    {
        if (empty($role)) {
            throw new \InvalidArgumentException('Role cannot be empty');
        }

        // Sanitize fields
        $fields = $this->sanitizeFields($fields);

        $cacheKey = $this->getCacheKey("role_{$role}", $fields);

        // Check cache first
        $cachedData = $this->getFromCache($cacheKey);
        if ($cachedData !== false) {
            $this->cacheStats['hits']++;
            return array_slice($cachedData, 0, $limit > 0 ? $limit : count($cachedData));
        }

        $this->cacheStats['misses']++;

        try {
            $users = get_users([
                'role' => $role,
                'fields' => empty($fields) ? 'all' : $fields,
                'number' => $limit,
            ]);

            if (!empty($users)) {
                // Apply filters to each user
                foreach ($users as $key => $user) {
                    $userId = is_array($user) ? ($user['ID'] ?? null) : ($user->ID ?? null);
                    $users[$key] = $this->applyUserFilters($user, $userId, $fields);
                }

                // Cache the filtered data
                $this->setCache($cacheKey, $users);
            }

            return $users;

        } catch (\Exception $e) {
            Logger::error('Failed to fetch users by role from database', [
                'role' => $role,
                'error' => $e->getMessage(),
            ]);
            throw new UserServiceException("Failed to fetch users by role: {$role}", 0, $e);
        }
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
    public function searchUsers(string $search_term, array $fields = [], int $limit = 10): array
    {
        if (empty($search_term)) {
            throw new \InvalidArgumentException('Search term cannot be empty');
        }

        // Sanitize fields
        $fields = $this->sanitizeFields($fields);

        $cacheKey = $this->getCacheKey("search_{$search_term}", $fields);

        // Check cache first
        $cachedData = $this->getFromCache($cacheKey);
        if ($cachedData !== false) {
            $this->cacheStats['hits']++;
            return array_slice($cachedData, 0, $limit);
        }

        $this->cacheStats['misses']++;

        try {
            $users = get_users([
                'search' => "*{$search_term}*",
                'search_columns' => ['user_login', 'user_email', 'display_name'],
                'fields' => empty($fields) ? 'all' : $fields,
                'number' => $limit,
            ]);

            if (!empty($users)) {
                // Apply filters to each user
                foreach ($users as $key => $user) {
                    $userId = is_array($user) ? ($user['ID'] ?? null) : ($user->ID ?? null);
                    $users[$key] = $this->applyUserFilters($user, $userId, $fields);
                }

                // Cache the filtered data
                $this->setCache($cacheKey, $users);
            }

            return $users;

        } catch (\Exception $e) {
            Logger::error('Failed to search users from database', [
                'search_term' => $search_term,
                'error' => $e->getMessage(),
            ]);
            throw new UserServiceException("Failed to search users: {$search_term}", 0, $e);
        }
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
            $this->triggerCacheClearedEvent('all');
        } else {
            // Clear specific user cache
            $cacheKey = $this->getCacheKey($user_id);
            unset($this->cache[$cacheKey]);
            wp_cache_delete($cacheKey, 'jankx_user_cache');
            $this->triggerCacheClearedEvent($user_id);
        }
    }

    /**
     * Set cache expiry time
     *
     * @param int $seconds Cache expiry time in seconds
     * @return void
     * @throws \InvalidArgumentException When seconds is negative
     */
    public function setCacheExpiry(int $seconds): void
    {
        if ($seconds < 0) {
            throw new \InvalidArgumentException('Cache expiry time cannot be negative');
        }
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
     * Get cache statistics
     *
     * @return array Cache statistics
     */
    public function getCacheStats(): array
    {
        return $this->cacheStats;
    }

    /**
     * Get cache hit ratio
     *
     * @return float Cache hit ratio (0-1)
     */
    public function getCacheHitRatio(): float
    {
        $total = $this->cacheStats['hits'] + $this->cacheStats['misses'];
        return $total > 0 ? $this->cacheStats['hits'] / $total : 0.0;
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
     * Set data in cache with memory management
     *
     * @param string $cacheKey Cache key
     * @param mixed $data Data to cache
     * @return void
     */
    private function setCache(string $cacheKey, mixed $data): void
    {
        // Check cache size limit
        if (count($this->cache) >= $this->maxCacheSize) {
            $this->cleanupCache();
        }

        $cacheData = [
            'data' => $data,
            'expiry' => time() + $this->cacheExpiry,
        ];

        // Store in memory cache
        $this->cache[$cacheKey] = $cacheData;

        // Store in WordPress object cache
        wp_cache_set($cacheKey, $cacheData, 'jankx_user_cache', $this->cacheExpiry);

        $this->cacheStats['sets']++;
    }

    /**
     * Cleanup old cache entries
     *
     * @return void
     */
    private function cleanupCache(): void
    {
        $currentTime = time();
        $removed = 0;

        foreach ($this->cache as $key => $data) {
            if ($data['expiry'] <= $currentTime) {
                unset($this->cache[$key]);
                $removed++;
            }
        }

        // If still too many entries, remove oldest
        if (count($this->cache) >= $this->maxCacheSize) {
            $entries = array_slice($this->cache, 0, count($this->cache) - $this->maxCacheSize + 100, true);
            foreach ($entries as $key => $data) {
                unset($this->cache[$key]);
            }
        }
    }

    /**
     * Fetch user data from database
     *
     * @param int|string $user_id User ID or username/email
     * @param array $fields Specific fields to retrieve
     * @return array|WP_User|null User data
     * @throws UserServiceException When database query fails
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
            throw new UserServiceException("Failed to fetch user: {$user_id}", 0, $e);
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
        $filteredData = apply_filters('jankx/user/data', $userData, $user_id, $fields);

        // Allow specific field filtering
        if (!empty($fields)) {
            $filteredData = apply_filters('jankx/user/data_fields', $filteredData, $user_id, $fields);
        }

        // Allow context-specific filtering
        $context = $this->getCurrentContext();
        $filteredData = apply_filters("jankx/user/data_{$context}", $filteredData, $user_id, $fields);

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

    /**
     * Sanitize fields array
     *
     * @param array $fields Fields to sanitize
     * @return array Sanitized fields
     */
    private function sanitizeFields(array $fields): array
    {
        return array_filter($fields, function($field) {
            return is_string($field) && !empty($field);
        });
    }

    /**
     * Trigger user loaded event
     *
     * @param mixed $user User data
     * @param int $user_id User ID
     */
    private function triggerUserLoadedEvent($user, $user_id): void
    {
        do_action('jankx/user/loaded', $user, $user_id);
    }

    /**
     * Trigger batch users loaded event
     *
     * @param array $users Users data
     * @param array $user_ids User IDs
     */
    private function triggerBatchUsersLoadedEvent(array $users, array $user_ids): void
    {
        do_action('jankx/user/batch_loaded', $users, $user_ids);
    }

    /**
     * Trigger cache hit event
     *
     * @param string $cacheKey Cache key
     */
    private function triggerCacheHitEvent(string $cacheKey): void
    {
        do_action('jankx/user/cache_hit', $cacheKey);
    }

    /**
     * Trigger cache cleared event
     *
     * @param int $user_id User ID
     */
    private function triggerCacheClearedEvent($user_id): void
    {
        do_action('jankx/user/cache_cleared', $user_id);
    }
}

/**
 * User Service Exception
 */
class UserServiceException extends \Exception {}