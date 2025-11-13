<?php

namespace Jankx\Gutenberg\Blocks\PostTypeLayout;

class LayoutRenderCache
{
    protected static array $runtime = [];
    protected static array $tagRuntimeIndex = [];

    public static function remember(string $scope, array $keyParts, callable $callback, array $tags = [])
    {
        $key = self::buildKey($scope, $keyParts);

        if (array_key_exists($key, self::$runtime)) {
            return self::$runtime[$key];
        }

        $cached = wp_cache_get($key, self::group(), false, $found);
        if ($found) {
            self::$runtime[$key] = $cached;
            return $cached;
        }

        $value = $callback();
        self::$runtime[$key] = $value;

        $ttl = (int) apply_filters('jankx/post-layout/cache/ttl', 120, $scope, $keyParts, $value);
        wp_cache_set($key, $value, self::group(), $ttl > 0 ? $ttl : 0);

        $normalizedTags = self::normalizeTags($tags, $scope, $keyParts, $value);
        foreach ($normalizedTags as $tag) {
            self::registerKeyForTag($tag, $key);
        }

        self::registerKeyForTag('scope:' . $scope, $key);

        return $value;
    }

    public static function flushByTag(string $tag): void
    {
        $tagKey = self::tagCacheKey($tag);
        $keys = wp_cache_get($tagKey, self::group());
        if (!is_array($keys) || empty($keys)) {
            return;
        }

        foreach ($keys as $cacheKey) {
            unset(self::$runtime[$cacheKey]);
            wp_cache_delete($cacheKey, self::group());
        }

        unset(self::$tagRuntimeIndex[$tag]);
        wp_cache_delete($tagKey, self::group());
    }

    public static function flushByTags(array $tags): void
    {
        foreach (array_unique($tags) as $tag) {
            self::flushByTag($tag);
        }
    }

    public static function flushAll(): void
    {
        foreach (self::$tagRuntimeIndex as $tag => $keys) {
            foreach (array_keys($keys) as $key) {
                unset(self::$runtime[$key]);
                wp_cache_delete($key, self::group());
            }
            wp_cache_delete(self::tagCacheKey($tag), self::group());
        }

        self::$runtime = [];
        self::$tagRuntimeIndex = [];
    }

    public static function flushByPostType(string $postType): void
    {
        self::flushByTag('post_type:' . $postType);
    }

    public static function flushByQueryId(string $queryId): void
    {
        self::flushByTag('query_id:' . $queryId);
    }

    protected static function registerKeyForTag(string $tag, string $cacheKey): void
    {
        if ($tag === '') {
            return;
        }

        if (!isset(self::$tagRuntimeIndex[$tag])) {
            self::$tagRuntimeIndex[$tag] = [];
        }
        self::$tagRuntimeIndex[$tag][$cacheKey] = true;

        $tagKey = self::tagCacheKey($tag);
        $keys = wp_cache_get($tagKey, self::group());
        if (!is_array($keys)) {
            $keys = [];
        }

        if (!in_array($cacheKey, $keys, true)) {
            $keys[] = $cacheKey;
            wp_cache_set($tagKey, $keys, self::group());
        }
    }

    protected static function normalizeTags(array $tags, string $scope, array $keyParts, $value): array
    {
        $tags = apply_filters('jankx/post-layout/cache/tags', $tags, $scope, $keyParts, $value);
        $tags = array_filter(array_map('strval', $tags));
        return array_values(array_unique($tags));
    }

    protected static function buildKey(string $scope, array $keyParts): string
    {
        $serialized = wp_json_encode([
            'scope' => $scope,
            'parts' => $keyParts,
        ]);

        return md5($serialized ?: $scope);
    }

    protected static function tagCacheKey(string $tag): string
    {
        return 'tag:' . $tag;
    }

    protected static function group(): string
    {
        return 'jankx_post_type_layout';
    }
}
