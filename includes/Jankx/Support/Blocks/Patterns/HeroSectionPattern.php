<?php

namespace Jankx\Support\Blocks\Patterns;

/**
 * Hero Section Pattern
 *
 * A modern, animated hero section with gradient backgrounds,
 * floating elements, and interactive hover effects.
 */
class HeroSectionPattern extends GutenbergPattern
{
    /**
     * Get pattern slug
     */
    protected function getPatternSlug(): string
    {
        return 'bookix/hero-section';
    }

    /**
     * Get pattern data
     */
    protected function getPatternData(): array
    {
        return [
            'title' => 'Hero Section - Modern',
            'description' => 'A stunning hero section with animated elements and modern design',
            'categories' => ['hero', 'jankx'],
            'keywords' => ['hero', 'banner', 'modern', 'animated', 'gradient'],
            'viewportWidth' => 1200,
        ];
    }

    /**
     * Get template path
     */
    protected function getTemplatePath(): string
    {
        return 'hero-section';
    }

    /**
     * Get template data
     */
    protected function getTemplateData(): array
    {
        return [
            'title' => 'Transform Your Ideas Into Reality',
            'subtitle' => 'Discover innovative solutions that push boundaries and create extraordinary experiences. Let\'s build something amazing together.',
            'primary_button' => [
                'text' => 'Get Started',
                'url' => '#',
                'class' => 'btn-primary btn-glow'
            ],
            'secondary_button' => [
                'text' => 'Learn More',
                'url' => '#',
                'class' => 'btn-secondary btn-outline'
            ],
            'hero_image' => 'hero-main.jpg',
            'stats' => [
                [
                    'number' => '500+',
                    'label' => 'Happy Clients'
                ],
                [
                    'number' => '1000+',
                    'label' => 'Projects Completed'
                ],
                [
                    'number' => '24/7',
                    'label' => 'Support'
                ]
            ],
            'background_shapes' => true,
            'floating_animation' => true
        ];
    }
}
