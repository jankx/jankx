<?php

namespace Jankx\Layouts\DynamicDataLayout;

/**
 * Attribute sanitizer for the term layout blocks.
 *
 * Reuses the layout/columns/carousel sanitization from the post-based
 * BlockTemplateAttributeSanitizer and adds taxonomy/term-specific rules.
 */
class TermBlockTemplateAttributeSanitizer extends BlockTemplateAttributeSanitizer
{
    public function sanitize(array $attributes, string $layoutName = '', bool $isAjax = false): array
    {
        $sanitized = parent::sanitize($attributes, $layoutName, $isAjax);

        // Taxonomy
        $taxonomy = $attributes['taxonomy'] ?? '';
        $sanitized['taxonomy'] = (is_string($taxonomy) && taxonomy_exists($taxonomy))
            ? $taxonomy
            : 'category';

        // Term selection
        $sanitized['termIn'] = $this->sanitizeTermIdArray($attributes['termIn'] ?? null);
        $sanitized['termNotIn'] = $this->sanitizeTermIdArray($attributes['termNotIn'] ?? null);
        $sanitized['termParent'] = $this->sanitizeNumericValue($attributes, 'termParent', 0, PHP_INT_MAX, 0);

        // Term display options
        $sanitized['hideEmpty'] = $this->sanitizeBooleanValue($attributes, 'hideEmpty', true);
        $sanitized['showTermCount'] = $this->sanitizeBooleanValue($attributes, 'showTermCount', true);

        // Terms per page (reuse postsPerPage so the editor range control maps cleanly)
        $sanitized['number'] = $this->sanitizeNumericValue($attributes, 'postsPerPage', 1, 100, 10);

        // Term ordering
        $allowedOrderBy = ['name', 'slug', 'count', 'term_order', 'none', 'description'];
        $orderBy = $attributes['orderBy'] ?? 'name';
        $sanitized['orderBy'] = (is_string($orderBy) && in_array($orderBy, $allowedOrderBy, true))
            ? $orderBy
            : 'name';

        $order = isset($attributes['order']) ? strtoupper((string) $attributes['order']) : 'ASC';
        $sanitized['order'] = in_array($order, ['ASC', 'DESC'], true) ? $order : 'ASC';

        return $sanitized;
    }

    /**
     * Sanitize an array of term IDs.
     *
     * @param mixed $value Raw term ID list
     * @return array
     */
    protected function sanitizeTermIdArray($value): array
    {
        if (!is_array($value)) {
            return [];
        }

        $ids = [];
        foreach ($value as $id) {
            if (is_numeric($id)) {
                $ids[] = (int) $id;
            }
        }

        return array_values(array_unique(array_filter($ids)));
    }
}
