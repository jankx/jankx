<?php

namespace Jankx\Layouts\AdvancedButton;

interface ButtonRendererInterface
{
    public function render(array $attributes, string $content, string $classes, array $styles): string;
}

