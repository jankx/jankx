<?php
/**
 * Foxy single page template
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
do_action( 'foxy_before_single_content' );
	do_action( 'foxy_single_content' );
do_action( 'foxy_after_single_content' );
// End index content.
/**
 * Get WordPress footer template
 */
get_footer();
