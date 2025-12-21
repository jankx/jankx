<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewContentGeneratorInterface;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewLayoutInterface;
use WP_Query;

abstract class AbstractViewContentGenerator implements ViewContentGeneratorInterface
{
    /** @var ViewLayoutInterface|null */
    protected $layout = null;

    public function setLayout(ViewLayoutInterface $layout): self
    {
        $this->layout = $layout;
        return $this;
    }

    public function getLayout(): ?ViewLayoutInterface
    {
        return $this->layout;
    }

    final public function generate(WP_Query $query, array $options = []): string
    {
        return $this->renderContent($query, $options);
    }

    final public function generatePreview(array $options = []): array
    {
        return $this->renderPreview($options);
    }

    abstract protected function renderContent(WP_Query $query, array $options = []): string;
    abstract protected function renderPreview(array $options = []): array;
}
