<?php

namespace Jankx\Helper;

class PathResolver
{
    public static function isAbsolutePath($path)
    {
        return $path[0] === '/' || (strlen($path) > 2 && $path[1] === ':' && $path[2] === '\\');
    }
}
