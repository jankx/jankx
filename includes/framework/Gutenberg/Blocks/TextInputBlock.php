<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class TextInputBlock extends Block
{
    protected $blockId = 'jankx/text-input';

    public function render($attributes, $content = '', $block = null)
    {
        $label = $attributes['label'] ?? '';
        $placeholder = $attributes['placeholder'] ?? '';
        $inputType = $attributes['inputType'] ?? 'text';
        $required = $attributes['required'] ?? false;
        $disabled = $attributes['disabled'] ?? false;
        $inputName = $attributes['inputName'] ?? '';
        $inputValue = $attributes['inputValue'] ?? '';
        $width = $attributes['width'] ?? '100%';
        $borderRadius = $attributes['borderRadius'] ?? 4;

        $wrapperAttrs = get_block_wrapper_attributes([
            'class' => 'jankx-text-input-wrapper',
            'style' => sprintf('width: %s;', esc_attr($width)),
        ]);

        $inputAttrs = [
            'type' => esc_attr($inputType),
            'placeholder' => esc_attr($placeholder),
            'class' => 'jankx-text-input',
            'style' => sprintf('border-radius: %dpx;', (int) $borderRadius),
        ];

        if ($inputName) {
            $inputAttrs['name'] = esc_attr($inputName);
        }

        if ($inputValue) {
            $inputAttrs['value'] = esc_attr($inputValue);
        }

        if ($required) {
            $inputAttrs['required'] = 'required';
        }

        if ($disabled) {
            $inputAttrs['disabled'] = 'disabled';
        }

        $inputAttrString = '';
        foreach ($inputAttrs as $key => $value) {
            $inputAttrString .= sprintf('%s="%s" ', $key, $value);
        }

        ob_start();
        ?>
        <div <?php echo $wrapperAttrs; ?>>
            <?php if ($label) : ?>
                <label class="jankx-text-input-label"><?php echo esc_html($label); ?></label>
            <?php endif; ?>
            <input <?php echo $inputAttrString; ?>/>
        </div>
        <?php
        return ob_get_clean();
    }
}
