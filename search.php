<?php
/**
 * Foxy search page template
 *
 * @package Foxy/Template
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @link https://wpclouds.com
 */

/**
 * Get WordPress header template
 */
get_header();

// Start page content.
do_action( 'foxy_before_search_content' );
	do_action( 'foxy_search_content' );
do_action( 'foxy_after_search_content' );
// End page content.
/**
 * Get WordPress footer template
 */
get_footer();
