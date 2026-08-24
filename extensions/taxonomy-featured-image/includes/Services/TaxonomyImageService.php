<?php

namespace Jankx\Extensions\TaxonomyFeaturedImage\Services;

/**
 * Taxonomy Image Service
 *
 * Resolves which taxonomies support featured images and handles
 * term meta CRUD for the `_thumbnail_id` meta key.
 */
class TaxonomyImageService
{
    const META_KEY = '_thumbnail_id';
    const OPTION_ENABLED = 'taxonomy_featured_image_enabled';
    const OPTION_TAXONOMIES = 'taxonomy_featured_image_taxonomies';

    /**
     * Cached allowed taxonomies
     *
     * @var array|null
     */
    protected $allowedTaxonomies = null;

    /**
     * Get raw option value from jankx_options
     *
     * @param string $key Option key
     * @param mixed $default Default value
     * @return mixed
     */
    public function getOption(string $key, $default = null)
    {
        $options = get_option('jankx_options', []);
        if (is_array($options) && array_key_exists($key, $options)) {
            return $options[$key];
        }
        return $default;
    }

    /**
     * Check if the extension is globally enabled
     *
     * @return bool
     */
    public function isEnabled(): bool
    {
        $enabled = $this->getOption(self::OPTION_ENABLED, 1);
        return (bool) $enabled;
    }

    /**
     * Get all public registered taxonomies keyed by name
     *
     * @return array
     */
    public function getPublicTaxonomies(): array
    {
        $taxonomies = get_taxonomies(['public' => true], 'objects');
        $list = [];
        foreach ($taxonomies as $taxonomy) {
            $label = $taxonomy->labels->singular_name ?? $taxonomy->label ?? $taxonomy->name;
            $list[$taxonomy->name] = sprintf('%s (%s)', $label, $taxonomy->name);
        }
        return $list;
    }

    /**
     * Get taxonomies that support featured images
     *
     * Priority: `jankx/taxonomy-featured-image/taxonomies` filter
     * > Theme Options checkbox > empty (none)
     *
     * @return array List of taxonomy names
     */
    public function getAllowedTaxonomies(): array
    {
        if ($this->allowedTaxonomies !== null) {
            return $this->allowedTaxonomies;
        }

        if (!$this->isEnabled()) {
            $this->allowedTaxonomies = [];
            return $this->allowedTaxonomies;
        }

        $saved = $this->getOption(self::OPTION_TAXONOMIES, []);
        if (is_string($saved)) {
            $saved = $saved !== '' ? [$saved] : [];
        }
        if (!is_array($saved)) {
            $saved = [];
        }

        $public = array_keys($this->getPublicTaxonomies());
        $allowed = array_values(array_intersect($saved, $public));

        $this->allowedTaxonomies = apply_filters(
            'jankx/taxonomy-featured-image/taxonomies',
            $allowed
        );

        return $this->allowedTaxonomies;
    }

    /**
     * Check if a taxonomy supports featured images
     *
     * @param string $taxonomy Taxonomy name
     * @return bool
     */
    public function isTaxonomySupported(string $taxonomy): bool
    {
        return in_array($taxonomy, $this->getAllowedTaxonomies(), true);
    }

    /**
     * Get attachment ID for a term
     *
     * @param int|\WP_Term|string $term Term object, ID, or slug
     * @return int Attachment ID (0 if none)
     */
    public function getTermImageId($term): int
    {
        $term = $this->resolveTerm($term);
        if (!$term instanceof \WP_Term) {
            return 0;
        }

        $imageId = get_term_meta($term->term_id, self::META_KEY, true);
        return absint($imageId);
    }

    /**
     * Get attachment image URL for a term
     *
     * @param int|\WP_Term|string $term Term object, ID, or slug
     * @param string|array $size Image size
     * @return string Empty string if none
     */
    public function getTermImageUrl($term, $size = 'thumbnail'): string
    {
        $imageId = $this->getTermImageId($term);
        if (!$imageId) {
            return '';
        }

        $url = wp_get_attachment_image_url($imageId, $size);
        return $url ?: '';
    }

    /**
     * Get attachment image HTML for a term
     *
     * @param int|\WP_Term|string $term Term object, ID, or slug
     * @param string|array $size Image size
     * @param array $attr Additional attributes
     * @return string Empty string if none
     */
    public function getTermImage($term, $size = 'thumbnail', array $attr = []): string
    {
        $imageId = $this->getTermImageId($term);
        if (!$imageId) {
            return '';
        }

        $defaultAttr = ['class' => 'term-featured-image'];
        return wp_get_attachment_image($imageId, $size, false, array_merge($defaultAttr, $attr));
    }

    /**
     * Set featured image for a term
     *
     * @param int $termId Term ID
     * @param int $attachmentId Attachment ID (0 to remove)
     * @return bool
     */
    public function setTermImage(int $termId, int $attachmentId): bool
    {
        if ($attachmentId <= 0) {
            return $this->deleteTermImage($termId);
        }
        return (bool) update_term_meta($termId, self::META_KEY, $attachmentId);
    }

    /**
     * Remove featured image from a term
     *
     * @param int $termId Term ID
     * @return bool
     */
    public function deleteTermImage(int $termId): bool
    {
        return (bool) delete_term_meta($termId, self::META_KEY);
    }

    /**
     * Resolve a term from mixed input
     *
     * @param int|\WP_Term|string $term Term object, ID, or slug
     * @return \WP_Term|null
     */
    protected function resolveTerm($term): ?\WP_Term
    {
        if ($term instanceof \WP_Term) {
            return $term;
        }
        if (is_numeric($term)) {
            $term = get_term((int) $term);
            return $term instanceof \WP_Term ? $term : null;
        }
        if (is_string($term) && $term !== '') {
            $term = get_term_by('slug', $term);
            return $term instanceof \WP_Term ? $term : null;
        }
        return null;
    }

    /**
     * Register term meta for allowed taxonomies
     *
     * @return void
     */
    public function registerMeta(): void
    {
        foreach ($this->getAllowedTaxonomies() as $taxonomy) {
            register_term_meta($taxonomy, self::META_KEY, [
                'type' => 'integer',
                'single' => true,
                'sanitize_callback' => 'absint',
                'show_in_rest' => true,
            ]);
        }
    }
}
