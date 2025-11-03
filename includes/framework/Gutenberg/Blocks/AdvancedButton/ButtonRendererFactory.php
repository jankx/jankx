<?php

namespace Jankx\Gutenberg\Blocks\AdvancedButton;

/**
 * Button Renderer Factory
 *
 * Creates appropriate renderer based on trigger type
 * Uses Factory Pattern
 *
 * @package Jankx\Gutenberg\Blocks\AdvancedButton
 */
class ButtonRendererFactory
{
    /**
     * Create renderer based on trigger type
     *
     * @param string $triggerType Trigger type (link, button, detail-link, modal)
     * @return ButtonRendererInterface
     */
    public static function create(string $triggerType): ButtonRendererInterface
    {
        switch ($triggerType) {
            case 'link':
                return new LinkRenderer();
            
            case 'button':
                return new ButtonRenderer();
            
            case 'detail-link':
                return new DetailLinkRenderer();
            
            case 'modal':
                return new ModalRenderer();
            
            default:
                // Default to link renderer
                return new LinkRenderer();
        }
    }

    /**
     * Detect trigger type from content or attributes
     *
     * @param array $attributes Block attributes
     * @param string $content Button content HTML
     * @return string Trigger type
     */
    public static function detectTriggerType(array $attributes, string $content): string
    {
        $triggerType = $attributes['triggerType'] ?? 'link';

        // Fallback: Check HTML content for data-trigger-type if attribute parsing fails
        // This is important for query loops where attributes come from template
        if ($triggerType === 'link') {
            if (strpos($content, 'data-trigger-type="detail-link"') !== false) {
                return 'detail-link';
            } elseif (strpos($content, 'data-trigger-type="modal"') !== false) {
                return 'modal';
            } elseif (strpos($content, 'data-trigger-type="button"') !== false) {
                return 'button';
            }
        }

        return $triggerType;
    }
}

