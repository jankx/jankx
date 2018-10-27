<?php
/**
 * WordPress sidebar template
 *
 * @package Foxy/Template
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @link https://wpclouds.com
 */

do_action( 'foxy_before_second_sidebar_content' );
if ( is_active_sidebar( 'second' ) ) {
	dynamic_sidebar( 'second' );
}
do_action( 'foxy_after_second_sidebar_content' );
