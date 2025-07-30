<?php

namespace Jankx;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

/**
 * This is the main class or the main gate to a developer
 * can use it to run all features of the framework.
 *
 * PHP version 7.4 or later
 *
 * @category Jankx
 * @package  Core
 * @author   Puleeno Nguyen <puleeno@gmail.com>
 * @license  MIT (https:///opensource.org/licenses/MIT)
 * @link     https://github.com/jankx/core
 */

use Illuminate\Container\Container;

/**
 * Class Jankx
 *
 * Lớp chính của framework Jankx, cung cấp các chức năng cốt lõi và quản lý các thành phần của framework.
 *
 * @package Jankx
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @version 2.0.0
 * @license MIT
 *
 * @since 2.0.0
 */

class Jankx extends Container
{
    /**
     * Framework constants
     */
    const FRAMEWORK_NAME = 'Jankx';
    const FRAMEWORK_VERSION = '2.0.0';

    /**
     * Tên của framework
     * @return string
     * @since 2.0.0
     */
    public static function getFrameworkName(): string
    {
        return self::FRAMEWORK_NAME;
    }

    /**
     * Phiên bản hiện tại của framework
     * @return string
     * @since 2.0.0
     */
    public static function getFrameworkVersion(): string
    {
        return self::FRAMEWORK_VERSION;
    }

    /**
     * Instance của class Jankx
     * @var Jankx
     */
    protected static $instance;

    /**
     * Lấy instance của Jankx
     * @return Jankx
     * @since 2.0.0
     */
    public static function getInstance()
    {
        $instance = self::$instance;
        if (is_null($instance)) {
            $instance = new self();
        }
        self::$instance = &$instance;
        return self::$instance;
    }
}
