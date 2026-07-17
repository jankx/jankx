<?php

namespace Jankx\Layouts\DynamicDataLayout\Contracts;

use WP_Query;

interface ContentGeneratorInterface
{
    public function setLayout(BlockTemplateLayoutInterface $layout): self;
    public function getLayout(): ?BlockTemplateLayoutInterface;
    public function generate($query, array $options = []): string;
    public function generatePreview(array $options = []): array;
    public function getName(): string;
    public function getTitle(): string;
}

