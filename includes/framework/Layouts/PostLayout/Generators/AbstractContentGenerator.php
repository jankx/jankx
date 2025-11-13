<?php

namespace Jankx\Layouts\PostLayout\Generators;

use Jankx\Layouts\PostLayout\Contracts\ContentGeneratorInterface;
use Jankx\Layouts\PostLayout\Contracts\PostLayoutInterface;
use WP_Query;

abstract class AbstractContentGenerator implements ContentGeneratorInterface
{
    protected ?PostLayoutInterface $layout = null;

    public function setLayout(PostLayoutInterface $layout): void
    {
        $this->layout = $layout;
    }

    protected function getLayout(): ?PostLayoutInterface
    {
        return $this->layout;
    }

    public function generate(WP_Query $query, array $options = []): string
    {
        if ($this->layout) {
            $this->layout->setOptions($options);
            $this->layout->setQuery($query);
        }

        return $this->renderContent($query, $options);
    }

    abstract protected function renderContent(WP_Query $query, array $options = []): string;

    public function generatePreview(array $options = []): array
    {
        return $this->renderPreviewContent($options);
    }

    protected function renderPreviewContent(array $options = []): array
    {
        return [];
    }

    public function supportsOptions(array $options): bool
    {
        return true;
    }

    public function wrapCarouselHtml(WP_Query $query, array $options, string $carouselHtml): string
    {
        return $carouselHtml;
    }

    public function appendClassesToWrapper(array $classes, array $options = []): array
    {
        return $classes;
    }
}
