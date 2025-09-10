<?php

namespace Jankx\Swiper\Traits;

trait SingletonTrait {
    /**
     * Instance
     */
    private static $instance;

    /**
     * Constructor
     */
    private function __construct() {
        // Optional initialization code
    }

    /**
     * Get the instance
     */
    public static function getInstance() {
        if (!isset(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Prevent cloning
     */
    private function __clone() {
        // Do nothing 
    }

    /**
    * Prevent unserialization
     */
    public function __wakeup() {
        // Do nothing
    }
}
