<?php
/**
 * Title: Hero Section with Advanced Button
 * Slug: jankx/hero-section
 * Categories: featured
 */
?>
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
    <!-- wp:heading {"level":1,"textAlign":"center","style":{"typography":{"lineHeight":"1.2"}}} -->
    <h1 class="wp-block-heading has-text-align-center" style="line-height:1.2"><?php _e('Transform Your Business with Jankx', 'jankx'); ?></h1>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"align":"center"} -->
    <p class="has-text-align-center"><?php _e('Fast, modern, and AI-ready WordPress theme framework.', 'jankx'); ?></p>
    <!-- /wp:paragraph -->

    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
    <div class="wp-block-buttons">
        <!-- wp:jankx/advanced-button {"triggerType":"button","text":"<?php echo esc_attr(__('Get Started', 'jankx')); ?>","buttonType":"button"} /-->
        
        <!-- wp:jankx/advanced-button {"triggerType":"link","text":"<?php echo esc_attr(__('Learn More', 'jankx')); ?>","buttonType":"link","className":"is-style-outline"} /-->
    </div>
    <!-- /wp:buttons -->
</div>
<!-- /wp:group -->
