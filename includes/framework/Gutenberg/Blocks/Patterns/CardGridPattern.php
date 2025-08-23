<?php

namespace Jankx\Gutenberg\Blocks\Patterns;

/**
 * Card Grid Pattern
 *
 * A responsive card grid layout with hover effects,
 * perfect for displaying products, services, or blog posts.
 */
class CardGridPattern extends GutenbergPattern
{
    /**
     * Get pattern slug
     */
    protected function getPatternSlug(): string
    {
        return 'jankx/card-grid';
    }

    /**
     * Get pattern data
     */
    protected function getPatternData(): array
    {
        return [
            'title' => 'Card Grid - Responsive',
            'description' => 'A beautiful responsive card grid with hover effects and modern design',
            'categories' => ['cards', 'grid', 'jankx'],
            'keywords' => ['cards', 'grid', 'responsive', 'hover', 'modern'],
            'viewportWidth' => 1200,
        ];
    }

    /**
     * Get template path
     */
    protected function getTemplatePath(): string
    {
        return 'card-grid';
    }

    /**
     * Get template data
     */
    protected function getTemplateData(): array
    {
        return [
            'title' => 'Our Amazing Services',
            'subtitle' => 'Discover what makes us different and why clients choose us',
            'cards' => [
                [
                    'title' => 'Web Design',
                    'description' => 'Beautiful, responsive websites that convert visitors into customers.',
                    'icon' => 'design',
                    'image' => 'web-design.jpg',
                    'link' => '#',
                    'color' => 'primary'
                ],
                [
                    'title' => 'Development',
                    'description' => 'Custom web applications built with modern technologies.',
                    'icon' => 'code',
                    'image' => 'development.jpg',
                    'link' => '#',
                    'color' => 'secondary'
                ],
                [
                    'title' => 'Marketing',
                    'description' => 'Strategic digital marketing that drives real results.',
                    'icon' => 'marketing',
                    'image' => 'marketing.jpg',
                    'link' => '#',
                    'color' => 'accent'
                ],
                [
                    'title' => 'Support',
                    'description' => '24/7 technical support to keep your business running smoothly.',
                    'icon' => 'support',
                    'image' => 'support.jpg',
                    'link' => '#',
                    'color' => 'success'
                ]
            ],
            'columns' => 4,
            'show_images' => true,
            'hover_effects' => true,
            'animation' => true
        ];
    }
}
