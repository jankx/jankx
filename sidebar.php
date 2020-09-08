<?php
/**
 * This is a part of Jankx Framework
 *
 * PLEASE DON'T MODIFY THIS FILE
 *
 * @package Jankx/Template
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @since 1.0.0
 */

use Jankx\SiteLayout\SiteLayout;

/**
 * Load sidebar template via Jankx Template Engine
 *
 * Site sidebar can be modified via feature override templates of WordPress
 * so please don't modify this file to ensure Jankx Framework working is exactly.
 */

$sidebar_name = SiteLayout::getSidebarName();
if ( empty( $sidebar_name ) ) {
	$sidebar_name = 'primary';
}

/**
 * Custom sidebar content features
 *
 * The plugins or theme can be custom the sidebar content
 * via this hook without modify the Jankx sidebar code.
 *
 * If this hook doesn't have any actions, Jankx will be load sidebar template file.
 */
$sidebar_hook = sprintf( 'jankx_sidebar_%s_content', $sidebar_name );
if ( has_action( $sidebar_hook ) ) {
	return do_action( $sidebar_hook );
}

// Load the sidebar template if hook "jankx_sidebar_{$sidebar_name}_content" doesn't have actions
jankx_template(
	array(
		"sidebar/{$sidebar_name}",
		'sidebar/primary',
	)
);
