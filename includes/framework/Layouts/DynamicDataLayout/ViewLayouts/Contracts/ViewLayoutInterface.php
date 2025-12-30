<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts;

use WP_Post;
use WP_Query;

interface ViewLayoutInterface
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

    public function renderViewItem(): string;

    public function renderPostItem(): string;
}
