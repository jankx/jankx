<?php

namespace Jankx\Gutenberg\StarRating;

use Jankx\Gutenberg\StarRating\Providers\ConfigurableRatingProvider;

/**
 * Class RatingSourceResolver
 *
 * Resolves the rating source (provider ID) and canonical meta key for each
 * post type, with a two-level cache so hot loops (carousel cards, lists)
 * never hit the object cache or the database:
 *
 *   L1 — static class properties: valid for the current request only.
 *   L2 — transients, keyed per post type: valid across requests.
 *
 * The transient key includes a fingerprint of the registered providers,
 * so registering/deregistering a provider automatically invalidates
 * the persistent cache (old keys simply expire via TTL).
 *
 * Usage:
 *
 *   RatingSourceResolver::resolve($postId);              // provider ID for a post
 *   RatingSourceResolver::getSource('tour');             // provider ID for a post type
 *   RatingSourceResolver::getMetaKey('tour');            // canonical meta key
 *   RatingSourceResolver::setSource('tour', 'my_source');// manual override (both levels)
 *   RatingSourceResolver::setMetaKey('tour', '_tour_rating');
 *
 * @package Jankx\Gutenberg\StarRating
 */
final class RatingSourceResolver
{
    /**
     * Provider ID used when no post-type-specific provider is registered.
     */
    public const DEFAULT_SOURCE = 'meta';

    /**
     * Meta key used by the default universal "meta" provider.
     */
    public const DEFAULT_META_KEY = 'jankx_rating_average';

    /**
     * Transient lifetime (seconds).
     */
    public const TTL = WEEK_IN_SECONDS;

    /**
     * L1 cache: post type => provider ID.
     * @var array<string, string>
     */
    protected static array $sources = [];

    /**
     * L1 cache: post type => meta key.
     * @var array<string, string>
     */
    protected static array $metaKeys = [];

    /**
     * Fingerprint of the registered providers, computed once per request
     * and embedded into every transient key.
     * @var string|null
     */
    protected static ?string $fingerprint = null;

    /**
     * Resolve the provider ID for a given post.
     *
     * @param int|null $postId
     * @return string Provider ID (ratingSource value).
     */
    public static function resolve($postId): string
    {
        $postId = (int) $postId;
        $postType = $postId ? (get_post_type($postId) ?: '') : '';

        if ($postType === '') {
            return self::DEFAULT_SOURCE;
        }

        return self::getSource($postType);
    }

    /**
     * Resolve the provider ID for a post type (L1 static -> L2 transient -> compute).
     *
     * @param string $postType
     * @return string
     */
    public static function getSource(string $postType): string
    {
        if (isset(self::$sources[$postType])) {
            return self::$sources[$postType];
        }

        // L2: persistent transient cache.
        $cached = get_transient(self::sourceKey($postType));
        if (is_string($cached) && $cached !== '' && StarRatingRegistry::has($cached)) {
            return self::$sources[$postType] = $cached;
        }

        $source = self::compute($postType);
        set_transient(self::sourceKey($postType), $source, self::TTL);

        return self::$sources[$postType] = $source;
    }

    /**
     * Manually override the provider ID for a post type.
     * Writes to both cache levels so subsequent requests keep the override
     * until the fingerprint changes or the transient expires.
     *
     * @param string $postType
     * @param string $source
     */
    public static function setSource(string $postType, string $source): void
    {
        self::$sources[$postType] = $source;
        set_transient(self::sourceKey($postType), $source, self::TTL);
    }

    /**
     * Get the canonical rating meta key for a post type (L1 -> L2 -> compute).
     *
     * @param string $postType
     * @return string
     */
    public static function getMetaKey(string $postType): string
    {
        if (isset(self::$metaKeys[$postType])) {
            return self::$metaKeys[$postType];
        }

        $cached = get_transient(self::metaKeyKey($postType));
        if (is_string($cached) && $cached !== '') {
            return self::$metaKeys[$postType] = $cached;
        }

        $metaKey = self::computeMetaKey($postType);
        set_transient(self::metaKeyKey($postType), $metaKey, self::TTL);

        return self::$metaKeys[$postType] = $metaKey;
    }

    /**
     * Manually override the rating meta key for a post type.
     * Writes to both cache levels.
     *
     * @param string $postType
     * @param string $metaKey
     */
    public static function setMetaKey(string $postType, string $metaKey): void
    {
        self::$metaKeys[$postType] = $metaKey;
        set_transient(self::metaKeyKey($postType), $metaKey, self::TTL);
    }

    /**
     * Flush cached values.
     *
     * @param string|null $postType  Post type to flush, or null for all
     *                               post types touched in this request.
     */
    public static function flush(?string $postType = null): void
    {
        if ($postType !== null) {
            unset(self::$sources[$postType], self::$metaKeys[$postType]);
            delete_transient(self::sourceKey($postType));
            delete_transient(self::metaKeyKey($postType));
            return;
        }

        foreach (array_keys(self::$sources) as $type) {
            delete_transient(self::sourceKey($type));
        }
        foreach (array_keys(self::$metaKeys) as $type) {
            delete_transient(self::metaKeyKey($type));
        }

        self::$sources = [];
        self::$metaKeys = [];
    }

    // -----------------------------------------------------------------------
    // Internals
    // -----------------------------------------------------------------------

    /**
     * Compute the provider ID for a post type:
     * prefer a provider registered specifically for the post type,
     * fall back to the universal default provider.
     *
     * @param string $postType
     * @return string
     */
    protected static function compute(string $postType): string
    {
        foreach (StarRatingRegistry::getProvidersForPostType($postType) as $provider) {
            if (!empty($provider->getSupportedPostTypes())) {
                return $provider->getId();
            }
        }

        return self::DEFAULT_SOURCE;
    }

    /**
     * Compute the canonical meta key for a post type from the resolved provider.
     *
     * @param string $postType
     * @return string
     */
    protected static function computeMetaKey(string $postType): string
    {
        $provider = StarRatingRegistry::getProvider(self::getSource($postType));

        if ($provider instanceof ConfigurableRatingProvider) {
            return $provider->getRatingMetaKey();
        }

        return self::DEFAULT_META_KEY;
    }

    /**
     * Transient key for the source cache (fingerprint-versioned).
     *
     * @param string $postType
     * @return string
     */
    protected static function sourceKey(string $postType): string
    {
        return 'jankx_rating_src_' . self::fingerprint() . '_' . $postType;
    }

    /**
     * Transient key for the meta key cache (fingerprint-versioned).
     *
     * @param string $postType
     * @return string
     */
    protected static function metaKeyKey(string $postType): string
    {
        return 'jankx_rating_mkey_' . self::fingerprint() . '_' . $postType;
    }

    /**
     * Fingerprint of the currently registered provider IDs.
     * Changes whenever providers are registered or deregistered,
     * which auto-invalidates the persistent cache level.
     *
     * @return string
     */
    protected static function fingerprint(): string
    {
        if (self::$fingerprint === null) {
            $ids = array_keys(StarRatingRegistry::getAll());
            sort($ids);
            self::$fingerprint = substr(md5(implode('|', $ids)), 0, 8);
        }

        return self::$fingerprint;
    }
}
