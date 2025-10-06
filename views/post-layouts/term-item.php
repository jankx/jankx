<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}
 ?>
<div class="loop-item term-item">
    <?php do_action('jankx_post_layout_before_loop_term_item', $term); ?>
    <a href="<?= esc_url($term->link()); ?>"><?= esc_html($term->name); ?></a>
    <?php do_action('jankx_post_layout_after_loop_term_item', $term); ?>
</div>
