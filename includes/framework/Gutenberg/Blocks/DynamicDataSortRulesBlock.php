<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Sort Rules block.
 *
 * Renders a sort dropdown on the frontend based on options configured by the admin.
 */
class DynamicDataSortRulesBlock extends Block
{
    /**
     * Block ID.
     *
     * @var string
     */
    protected $blockId = 'jankx/dynamic-data-sort-rules';

    /**
     * Render the sort dropdown on the frontend.
     *
     * @param array $attributes Block attributes.
     * @param string $content Inner block content.
     * @param \WP_Block|null $block Block instance.
     * @return string
     */
    public function render($attributes, $content = '', $block = null)
    {
        $enabled = isset($attributes['enabled']) ? $attributes['enabled'] : false;
        
        if (!$enabled) {
            return '';
        }

        $rules = isset($attributes['rules']) ? $attributes['rules'] : [];
        if (empty($rules)) {
            return '';
        }

        ob_start();
        $displayLabel = isset($attributes['displayLabel']) ? $attributes['displayLabel'] : 'Sắp xếp theo';
        ?>
        <div class="jankx-dynamic-data-sort-dropdown" style="display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-bottom: 20px;">
            <?php if (!empty($displayLabel)): ?>
                <label class="sort-label"><?php echo esc_html($displayLabel); ?></label>
            <?php endif; ?>
            <select class="sort-select jankx-data-sorter">
                <?php foreach ($rules as $index => $rule): ?>
                    <?php 
                        $label = !empty($rule['label']) ? $rule['label'] : sprintf(__('Option %d', 'jankx'), $index + 1);
                        // Encode the rule so frontend JS can read it if needed
                        $value = esc_attr(json_encode([
                            'orderBy'  => isset($rule['orderBy']) ? $rule['orderBy'] : 'date',
                            'order'    => isset($rule['order']) ? $rule['order'] : 'DESC',
                            'metaKey'  => isset($rule['metaKey']) ? $rule['metaKey'] : '',
                            'metaType' => isset($rule['metaType']) ? $rule['metaType'] : '',
                        ]));
                    ?>
                    <option value="<?php echo $index; ?>" data-rule="<?php echo $value; ?>">
                        <?php echo esc_html($label); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        <?php
        return ob_get_clean();
    }
}