<?php

namespace Jankx\Models;

/**
 * User Model
 *
 * User model for handling user data with validation and custom methods.
 *
 * @package Jankx\Models
 * @since 2.0.0
 */
class User extends Model
{
    /**
     * User ID
     *
     * @var int
     */
    public $ID;

    /**
     * User login
     *
     * @var string
     */
    public $user_login;

    /**
     * User email
     *
     * @var string
     */
    public $user_email;

    /**
     * User display name
     *
     * @var string
     */
    public $display_name;

    /**
     * User roles
     *
     * @var array
     */
    public $roles;

    /**
     * User capabilities
     *
     * @var array
     */
    public $capabilities;

    /**
     * Constructor
     *
     * @param \WP_User|array $userData
     */
    public function __construct($userData = [])
    {
        parent::__construct($userData);

        // Set common properties
        $this->ID = $this->get('ID');
        $this->user_login = $this->get('user_login');
        $this->user_email = $this->get('user_email');
        $this->display_name = $this->get('display_name');
        $this->roles = $this->get('roles', []);
        $this->capabilities = $this->get('allcaps', []);
    }

    /**
     * Check if user has specific capability
     *
     * @param string $capability
     * @return bool
     */
    public function can($capability)
    {
        return in_array($capability, $this->capabilities);
    }

    /**
     * Check if user has specific role
     *
     * @param string $role
     * @return bool
     */
    public function hasRole($role)
    {
        return in_array($role, $this->roles);
    }

    /**
     * Get user avatar URL
     *
     * @param int $size
     * @return string
     */
    public function getAvatarUrl($size = 96)
    {
        return get_avatar_url($this->ID, ['size' => $size]);
    }

    /**
     * Get user profile URL
     *
     * @return string
     */
    public function getProfileUrl()
    {
        return get_author_posts_url($this->ID);
    }

    /**
     * Validate user data
     *
     * @return bool
     */
    public function isValid()
    {
        return !empty($this->ID) && !empty($this->user_login);
    }
}