<?php

namespace Jankx\Gutenberg\StarRating;

/**
 * Class StarRatingRegistry
 *
 * Singleton registry that manages all star rating providers.
 * Extensions register their providers here, and StarRatingBlock
 * resolves the correct one at render time.
 *
 * Usage from an extension:
 *
 *   add_action('init', function() {
 *       \Jankx\Gutenberg\StarRating\StarRatingRegistry::register(new MyRatingProvider());
 *   });
 *
 * @package Jankx\Gutenberg\StarRating
 * @since 1.0.0
 */
class StarRatingRegistry
{
    /**
     * Singleton instance.
     * @var self|null
     */
    private static ?self $instance = null;

    /**
     * Registered providers, keyed by their ID.
     * @var StarRatingProviderInterface[]
     */
    private array $providers = [];

    /**
     * Private constructor — use ::getInstance() or the static helper methods.
     */
    private function __construct()
    {
    }

    /**
     * Get (or create) the singleton instance.
     *
     * @return self
     */
    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    // -----------------------------------------------------------------------
    // Static API (shorthand wrappers around the singleton)
    // -----------------------------------------------------------------------

    /**
     * Register a rating provider.
     * If a provider with the same ID is already registered it will be replaced.
     *
     * @param StarRatingProviderInterface $provider
     */
    public static function register(StarRatingProviderInterface $provider): void
    {
        self::getInstance()->providers[$provider->getId()] = $provider;
    }

    /**
     * Retrieve a provider by its ID.
     *
     * @param string $id  The provider ID (matches the ratingSource attribute).
     * @return StarRatingProviderInterface|null
     */
    public static function getProvider(string $id): ?StarRatingProviderInterface
    {
        return self::getInstance()->providers[$id] ?? null;
    }

    /**
     * Retrieve all registered providers.
     *
     * @return StarRatingProviderInterface[]  Indexed by provider ID.
     */
    public static function getAll(): array
    {
        return self::getInstance()->providers;
    }

    /**
     * Retrieve providers that support a specific post type.
     * Providers that return an empty array from getSupportedPostTypes()
     * are considered universal and will always be included.
     *
     * @param string $postType  The WordPress post type slug.
     * @return StarRatingProviderInterface[]
     */
    public static function getProvidersForPostType(string $postType): array
    {
        return array_filter(
            self::getAll(),
            static function (StarRatingProviderInterface $provider) use ($postType): bool {
                $supported = $provider->getSupportedPostTypes();
                return empty($supported) || in_array($postType, $supported, true);
            }
        );
    }

    /**
     * Build an options array suitable for a Gutenberg SelectControl.
     * Optionally filter by post type.
     *
     * @param string|null $postType  If provided, only include providers for this post type.
     * @return array<array{value: string, label: string}>
     */
    public static function getEditorOptions(?string $postType = null): array
    {
        $providers = $postType !== null
            ? self::getProvidersForPostType($postType)
            : self::getAll();

        return array_values(array_map(
            static fn(StarRatingProviderInterface $p) => [
                'value' => $p->getId(),
                'label' => $p->getLabel(),
            ],
            $providers
        ));
    }

    /**
     * Remove a registered provider.
     *
     * @param string $id  The provider ID to remove.
     */
    public static function deregister(string $id): void
    {
        unset(self::getInstance()->providers[$id]);
    }

    /**
     * Check whether a provider ID has been registered.
     *
     * @param string $id
     * @return bool
     */
    public static function has(string $id): bool
    {
        return isset(self::getInstance()->providers[$id]);
    }
}
