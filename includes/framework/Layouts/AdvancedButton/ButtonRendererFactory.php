<?php

namespace Jankx\Layouts\AdvancedButton;

class ButtonRendererFactory
{
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
                return new LinkRenderer();
        }
    }

    public static function detectTriggerType(array $attributes, string $content): string
    {
        $triggerType = $attributes['triggerType'] ?? 'link';
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

