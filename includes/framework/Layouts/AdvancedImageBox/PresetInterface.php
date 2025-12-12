<?php

namespace Jankx\Layouts\AdvancedImageBox;

interface PresetInterface
{
    public function getId(): string;
    public function getName(): string;
    public function getLabel(): string;
    public function getDescription(): string;
    public function getMaskType(): string;
    public function getOptions(): array;
    public function requiresInnerBlocks(): bool;
    public function getInnerBlocksTemplate(): ?array;
    public function getClasses(): array;
    public function renderCSS(array $attributes, array $options = []): string;
    public function renderSVGMask(array $attributes, array $options = []): string;
    public function renderMarkup(array $attributes, array $options = [], string $content = ''): string;
    public function getJavaScript(): string;
}

