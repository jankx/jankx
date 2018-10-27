<?php
/**
 * Foxy archive page template
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
do_action( 'foxy_before_archive_content' );
	do_action( 'foxy_archive_content' );
do_action( 'foxy_after_archive_content' );
// End page content.
/**
 * Get WordPress footer template
 */
get_footer();
