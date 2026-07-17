<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts;

use WP_Query;

interface ViewContentGeneratorInterface
{
    public function setLayout($layout): self;
    public function getLayout();
    public function generate(WP_Query $query, array $options = []): string;
    public function generatePreview(array $options = []): array;
    public function getName(): string;
    public function getTitle(): string;
}
