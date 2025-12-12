<?php

namespace Jankx\Helper;

/**
 * Jankx Framework Security Helper
 *
 * Security-related helper functions for the Jankx framework
 *
 * @package Jankx\Helper
 * @version 2.0.0
 * @author Puleeno Nguyen <puleeno@gmail.com>
 */
// This file is a backwards compatibility shim. The full SecurityHelper implementation
// has moved to the dashboard framework package under
// `Jankx\Dashboard\Helpers\SecurityHelper`.

use Jankx\Dashboard\Helpers\SecurityHelper as DashboardSecurityHelper;

if (!class_exists(__NAMESPACE__ . '\\SecurityHelper')) {
    class SecurityHelper
    {
        public static function __callStatic($name, $arguments)
        {
            $targetClass = DashboardSecurityHelper::class;

            // Try direct method name
            if (method_exists($targetClass, $name)) {
                return forward_static_call_array([$targetClass, $name], $arguments);
            }

            // Convert snake_case to camelCase and try again
            $camel = self::snakeToCamel($name);
            if (method_exists($targetClass, $camel)) {
                return forward_static_call_array([$targetClass, $camel], $arguments);
            }

            throw new \BadMethodCallException(sprintf('Method %s::%s does not exist', $targetClass, $name));
        }

        private static function snakeToCamel($string)
        {
            $str = str_replace('_', ' ', strtolower($string));
            $str = str_replace(' ', '', ucwords($str));
            return lcfirst($str);
        }
    }
}

// Global legacy class used in older code (e.g., procedural style)
if (!class_exists('Jankx_Security_Helper')) {
    class Jankx_Security_Helper
    {
        public static function __callStatic($name, $arguments)
        {
            $target = __NAMESPACE__ . '\\SecurityHelper';
            if (method_exists($target, $name)) {
                return forward_static_call_array([$target, $name], $arguments);
            }

            // Try snake->camel
            $camel = self::snakeToCamel($name);
            if (method_exists($target, $camel)) {
                return forward_static_call_array([$target, $camel], $arguments);
            }

            throw new \BadMethodCallException(sprintf('Method %s::%s does not exist', $target, $name));
        }

        private static function snakeToCamel($string)
        {
            $str = str_replace('_', ' ', strtolower($string));
            $str = str_replace(' ', '', ucwords($str));
            return lcfirst($str);
        }
    }
}

