<?php

namespace Jankx\Layouts\DynamicDataLayout\ContentLoopLayouts;

use Jankx\Layouts\DynamicDataLayout\Contracts\ContentLoopLayoutInterface;

abstract class AbstractContentLoopLayout implements ContentLoopLayoutInterface
{
    public function getSupportedOptions(): array
    {
        return [];
    }

    public function getDefaultTemplate(string $postType): array
    {
        return [
            ['core/post-featured-image', []],
            ['core/post-title', ['isLink' => true]],
            ['jankx/human-readable-post-date', []],
            ['core/post-excerpt', []],
        ];
    }

    public function renderItem(string $content, array $attributes, array $options = []): string
    {
        return $content;
    }

    public function getItemClasses(array $attributes): array
    {
        return [];
    }

    public function enqueueAssets(): void
    {
        // Default implementation does nothing
    }

    public function getName(): string
    {
        $class = get_class($this);
        $parts = explode('\\', $class);
        $name = end($parts);
        return strtolower(str_replace('ItemLayout', '', $name));
    }
}
