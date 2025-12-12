<?php

namespace Jankx\Layouts\DynamicDataLayout\Contracts;

use WP_Query;

interface PostLayoutInterface
{
    public function getName(): string;
    public function getTitle(): string;
    public function setOptions($options): self;
    public function getOptions(): array;
    public function setQuery(WP_Query $query): self;
    public function setContentGenerator($generator): self;
    public function render(): string;
    public function renderDefault(): string;
    public function renderPreview(): array;
    public function getHtmlStructure(array $options = []): array;
    public function getSupportedOptions(): array;
    public function getReadOnlyOptions(): array;
}

