<?php
/**
 * WordPress sidebar template
 *
 * @package Foxy/Template
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @link https://wpclouds.com
 */

do_action( 'foxy_before_sidebar_content' );
if ( is_active_sidebar( 'primary' ) ) {
	dynamic_sidebar( 'primary' );
}
do_action( 'foxy_after_sidebar_content' );
