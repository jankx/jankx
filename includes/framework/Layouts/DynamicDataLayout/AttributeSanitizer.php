<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Layouts\DynamicDataLayout\DynamicDataLayoutManager;

class AttributeSanitizer
{
    protected DynamicDataLayoutManager $layoutManager;

    public function __construct(DynamicDataLayoutManager $layoutManager)
    {
        $this->layoutManager = $layoutManager;
    }

    public function sanitize(string $layoutName, array $attributes, bool $forRender = true): array
    {
        $postType = $attributes['postType'] ?? 'post';
        $layout = $this->layoutManager->createLayout($layoutName, $postType, []);
        if (!$layout) {
            return $attributes;
        }
        $layoutInstance = $layout->getLayout();
        $supportedOptions = [];
        if (method_exists($layoutInstance, 'getSupportedOptions')) {
            $supportedOptions = $layoutInstance->getSupportedOptions();
        }
        $sanitized = $attributes;
        if (in_array($layoutName, ['grid', 'list', 'card'])) {
            if (isset($sanitized['columns'])) {
                $sanitized['columns'] = max(1, min(6, (int) $sanitized['columns']));
            }
            if (isset($sanitized['columnsTablet'])) {
                $sanitized['columnsTablet'] = max(1, min(4, (int) $sanitized['columnsTablet']));
            }
            if (isset($sanitized['columnsMobile'])) {
                $sanitized['columnsMobile'] = max(1, min(2, (int) $sanitized['columnsMobile']));
            }
        }
        if ($layoutName === 'carousel') {
            if (isset($sanitized['slidesToScroll'])) {
                $sanitized['slidesToScroll'] = max(1, (int) $sanitized['slidesToScroll']);
            }
            if (isset($sanitized['autoplayDelay'])) {
                $sanitized['autoplayDelay'] = max(1000, (int) $sanitized['autoplayDelay']);
            }
        }
        if (isset($sanitized['postsPerPage'])) {
            $sanitized['postsPerPage'] = max(1, min(100, (int) $sanitized['postsPerPage']));
        }
        if (isset($sanitized['offset'])) {
            $sanitized['offset'] = max(0, (int) $sanitized['offset']);
        }
        return $sanitized;
    }
}

