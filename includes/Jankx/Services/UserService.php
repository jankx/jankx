<?php

namespace Jankx\Services;

use Jankx\Foundation\Application;
use Jankx\Models\User;

/**
 * User Service
 *
 * Handles user queries with caching and filtering capabilities.
 *
 * @package Jankx\Services
 * @since 2.0.0
 */
class UserService
{
    /**
     * Application instance
     *
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * Cache service instance
     *
     * @var \Jankx\Services\CacheService
     */
    protected $cache;

    /**
     * Constructor
     *
     * @param \Jankx\Foundation\Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->cache = $app->make('cache');
    }

    /**
     * Get user by ID
     *
     * @param int $userId
     * @return \Jankx\Models\User|null
     */
    public function getById($userId)
    {
        $cacheKey = 'user_id_' . $userId;

        // Check cache first
        if ($this->cache->isEnabled() && $cached = $this->cache->get($cacheKey)) {
            return $this->applyFilters($cached);
        }

        // Query database
        $userData = get_user_by('ID', $userId);

        if (!$userData) {
            return null;
        }

        $user = new User($userData);

        // Apply filters
        $user = $this->applyFilters($user);

        // Cache the result
        if ($this->cache->isEnabled()) {
            $this->cache->set($cacheKey, $user);
        }

        return $user;
    }

    /**
     * Get user by username
     *
     * @param string $username
     * @return \Jankx\Models\User|null
     */
    public function getByUsername($username)
    {
        $cacheKey = 'user_username_' . $username;

        // Check cache first
        if ($this->cache->isEnabled() && $cached = $this->cache->get($cacheKey)) {
            return $this->applyFilters($cached);
        }

        // Query database
        $userData = get_user_by('login', $username);

        if (!$userData) {
            return null;
        }

        $user = new User($userData);

        // Apply filters
        $user = $this->applyFilters($user);

        // Cache the result
        if ($this->cache->isEnabled()) {
            $this->cache->set($cacheKey, $user);
        }

        return $user;
    }

    /**
     * Get current user
     *
     * @return \Jankx\Models\User|null
     */
    public function getCurrent()
    {
        $currentUser = wp_get_current_user();

        if (!$currentUser->exists()) {
            return null;
        }

        return $this->getById($currentUser->ID);
    }

    /**
     * Apply filters to user data
     *
     * @param \Jankx\Models\User $user
     * @return \Jankx\Models\User
     */
    protected function applyFilters($user)
    {
        return apply_filters('jankx/user/data', $user);
    }
}
