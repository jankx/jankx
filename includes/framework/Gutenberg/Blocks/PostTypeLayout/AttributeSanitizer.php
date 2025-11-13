<?php

namespace Jankx\Gutenberg\Blocks\PostTypeLayout;

use Jankx\Layouts\PostLayout\PostLayoutManager;

class AttributeSanitizer
{
    protected PostLayoutManager $layoutManager;

    public function __construct(PostLayoutManager $layoutManager)
    {
        $this->layoutManager = $layoutManager;
    }

    public function sanitize(string $layoutName, array $attributes, bool $forRender = true): array
    {
        $layout = $this->layoutManager->getLayout($layoutName);

        if (!$layout || !$forRender) {
            return $attributes;
        }

        $supportedOptions = $layout->getSupportedOptions();
        $optionKeys = ['columns', 'showFeaturedImage', 'showTitle', 'showExcerpt', 'showDate', 'showAuthor', 'itemStyle'];

        foreach ($optionKeys as $key) {
            if (!in_array($key, $supportedOptions, true)) {
                $attributes[$key] = false;
            }
        }

        if (!in_array('thumbnailPosition', $supportedOptions, true)) {
            $attributes['thumbnailPosition'] = 'top';
        }

        if (($attributes['postType'] ?? 'post') !== 'post') {
            $attributes['includeStickyPosts'] = false;
        } else {
            $attributes['includeStickyPosts'] = !empty($attributes['includeStickyPosts']);
        }

        return $attributes;
    }
}

