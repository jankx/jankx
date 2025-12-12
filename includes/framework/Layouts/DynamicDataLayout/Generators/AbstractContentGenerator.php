<?php

namespace Jankx\Layouts\DynamicDataLayout\Generators;

use Jankx\Layouts\DynamicDataLayout\Contracts\ContentGeneratorInterface;
use Jankx\Layouts\DynamicDataLayout\Contracts\PostLayoutInterface;
use WP_Query;

abstract class AbstractContentGenerator implements ContentGeneratorInterface
{
    /** @var PostLayoutInterface|null */
    protected $layout = null;

    public function setLayout(PostLayoutInterface $layout): ContentGeneratorInterface
    {
        $this->layout = $layout;
        return $this;
    }

    public function getLayout(): ?PostLayoutInterface
    {
        return $this->layout;
    }

    final public function generate(WP_Query $query, array $options = []): string
    {
        return $this->renderContent($query, $options);
    }

    final public function generatePreview(array $options = []): array
    {
        return $this->renderPreviewContent($options);
    }

    abstract protected function renderContent(WP_Query $query, array $options = []): string;
    abstract protected function renderPreviewContent(array $options = []): array;
}

