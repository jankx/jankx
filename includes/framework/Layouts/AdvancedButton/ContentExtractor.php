<?php

namespace Jankx\Layouts\AdvancedButton;

class ContentExtractor
{
    public static function extractButtonContent(string $content): string
    {
        $content = preg_replace('/<div[^>]*class="[^"]*wp-block-jankx-advanced-button[^"]*"[^>]*>/', '', $content);
        $content = preg_replace('/<\/div>\s*$/', '', $content);
        return trim($content);
    }

    public static function extractWrapperClasses(string $content): array
    {
        $classes = [];
        if (preg_match('/<div[^>]*class="([^"]*)"[^>]*>/', $content, $matches)) {
            $classes = array_filter(explode(' ', $matches[1]));
        }
        return $classes;
    }

    public static function hasInnerBlocks(string $content): bool
    {
        if (preg_match('/<span[^>]*class="[^"]*button-icon-wrapper[^"]*"[^>]*>.*?<\/span>/s', $content, $wrapper_match)) {
            $wrapper_content = preg_replace('/<[^>]+>/', '', $wrapper_match[0]);
            return !empty(trim($wrapper_content));
        }
        return false;
    }

    public static function getButtonElement(string $content): ?array
    {
        if (preg_match('/<(a|button)([^>]*class="[^"]*jankx-advanced-button__link[^"]*")([^>]*)>/', $content, $matches)) {
            return [
                'tag' => $matches[1],
                'class_attr' => $matches[2],
                'other_attrs' => $matches[3],
                'full' => $matches[0],
            ];
        }
        return null;
    }
}

