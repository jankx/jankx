<?php

namespace Jankx\Layouts\DynamicDataLayout\Contracts;

use WP_Query;

interface BlockTemplateLayoutInterface
{
    public function getName(): string;
    public function getTitle(): string;
    public function setOptions($options): self;
    public function getOptions(): array;
    public function setQuery(WP_Query $query): self;
    public function setContentGenerator($generator): self;
    public function getContentGenerator();
    public function render(): string;
    public function renderDefault(): string;
    public function renderPreview(): array;
    public function getHtmlStructure(array $options = []): array;
    public function getSupportedOptions(): array;
    public function getReadOnlyOptions(): array;
    public function getSettingsDefinition(): array;
    public function appendClassesToWrapper(array $classes, array $options = []): array;
    
    // Additional methods for compatibility
    public function withQuery(WP_Query $query): self;
    public function withAttributes(array $attributes): self;
    public function getIcon(): string;
    public function getLayout(): self;
}
