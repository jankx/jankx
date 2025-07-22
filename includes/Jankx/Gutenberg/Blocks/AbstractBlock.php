<?php

namespace Jankx\Gutenberg\Blocks;

abstract class AbstractBlock
{
    protected static $attributes = [];
    protected static $supports = [];

    public static function getAttributes()
    {
        return static::$attributes;
    }

    public static function getSupports()
    {
        return static::$supports;
    }

    public static function getTitle()
    {
        return static::getBlockName();
    }

    public static function getDescription()
    {
        return '';
    }

    public static function getCategory()
    {
        return 'jankx-blocks';
    }

    public static function getIcon()
    {
        return 'admin-comments';
    }

    public static function getKeywords()
    {
        return [];
    }

    abstract public static function getBlockName();
    abstract public static function render($attributes, $content);

    protected static function getTemplatePath($template)
    {
        return JANKX_ABSPATH . '/templates/blocks/' . $template . '.html';
    }

    protected static function renderTemplate($template, $data = [])
    {
        $template_path = self::getTemplatePath($template);

        if (!file_exists($template_path)) {
            return '';
        }

        extract($data);
        ob_start();
        include $template_path;
        return ob_get_clean();
    }

    protected static function getAttribute($attributes, $key, $default = '')
    {
        return $attributes[$key] ?? $default;
    }

    protected static function getClassName($attributes)
    {
        $classes = ['jankx-block', 'jankx-block-' . static::getBlockName()];

        if (isset($attributes['className'])) {
            $classes[] = $attributes['className'];
        }

        if (isset($attributes['align'])) {
            $classes[] = 'align' . $attributes['align'];
        }

        return implode(' ', array_filter($classes));
    }

    protected static function getBlockId($attributes)
    {
        return isset($attributes['blockId']) ? $attributes['blockId'] : uniqid('jankx-block-');
    }
}