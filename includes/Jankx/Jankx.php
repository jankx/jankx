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
use Jankx\Enum\FrameworkEnum;

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
 */

class Jankx extends Container
{
    /**
     * Tên của framework
     * @return string
     */
    public static function getFrameworkName(): string
    {
        return FrameworkEnum::frameworkName();
    }

    /**
     * Phiên bản hiện tại của framework
     * @return string
     */
    public static function getFrameworkVersion(): string
    {
        return FrameworkEnum::frameworkVersion();
    }

    /**
     * Instance của class Jankx
     * @var Jankx
     */
    protected static $instance;

    /**
     * Lấy instance của Jankx
     * @return Jankx
     */
    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}
