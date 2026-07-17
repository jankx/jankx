<?php

namespace Jankx\Helper;

class PathResolver
{
    public static function isAbsolutePath($path)
    {
        return $path[0] === '/' || (strlen($path) > 2 && $path[1] === ':' && $path[2] === '\\');
    }

    /**
     * Summary of getTemplateDirectory
     * @param mixed $path
     * @return string
     */
    public static function getTemplateDirectory($path = ''): string {
        $templateDirectory = get_template_directory();
        if (empty($path)) {
            return $templateDirectory;
        }
        if (is_array($path)) {
            array_unshift($path, $templateDirectory);
            return implode(DIRECTORY_SEPARATOR, $path);
        }
        return $templateDirectory . DIRECTORY_SEPARATOR . $path;
    }

    /**
     * Summary of getThemeDirectory
     * @param array|string $path
     * @return string
     */
    public static function getThemeDirectory($path = ''): string {
        $themeDirectory = get_stylesheet_directory();
        if (empty($path)) {
            return $themeDirectory;
        }
        if (is_array($path)) {
            array_unshift($path, $themeDirectory);
            return implode(DIRECTORY_SEPARATOR, $path);
        }
        return $themeDirectory . DIRECTORY_SEPARATOR . $path;
    }
}
