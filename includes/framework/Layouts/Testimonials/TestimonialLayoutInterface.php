<?php

namespace Jankx\Layouts\Testimonials;

use WP_Query;

interface TestimonialLayoutInterface
{
    public function getName(): string;
    public function getTitle(): string;
    public function setOptions($options): self;
    public function getOptions(): array;
    public function setQuery(WP_Query $query): self;
    public function render(): string;
    public function renderPreview(): array;
}

