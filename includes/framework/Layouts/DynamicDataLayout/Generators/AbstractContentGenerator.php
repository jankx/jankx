<?php

namespace Jankx\Layouts\DynamicDataLayout\Generators;

use Jankx\Layouts\DynamicDataLayout\Contracts\ContentGeneratorInterface;
use Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface;
use WP_Query;

abstract class AbstractContentGenerator implements ContentGeneratorInterface
{
    /** @var BlockTemplateLayoutInterface|null */
    protected $layout = null;

    public function setLayout(BlockTemplateLayoutInterface $layout): self
    {
        $this->layout = $layout;
        return $this;
    }

    public function getLayout(): ?BlockTemplateLayoutInterface
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

