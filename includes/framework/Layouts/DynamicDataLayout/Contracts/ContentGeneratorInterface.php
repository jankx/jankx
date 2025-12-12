<?php

namespace Jankx\Layouts\DynamicDataLayout\Contracts;

use WP_Query;

interface ContentGeneratorInterface
{
    public function setLayout(PostLayoutInterface $layout): self;
    public function getLayout(): ?PostLayoutInterface;
    public function generate(WP_Query $query, array $options = []): string;
    public function generatePreview(array $options = []): array;
    public function getName(): string;
    public function getTitle(): string;
}

