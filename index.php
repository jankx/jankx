<?php
/**
 * Foxy index template
 *
 * @package Foxy/Template
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @link https://wpclouds.com
 */

/**
 * Get WordPress header template
 */
get_header();

// Start index content.
do_action( 'foxy_before_index_content' );
	do_action( 'foxy_index_content' );
do_action( 'foxy_after_index_content' );
// End index content.
/**
 * Get WordPress footer template
 */
get_footer();
