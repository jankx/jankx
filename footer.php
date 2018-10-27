<?php
/**
 * Foxy footer template
 *
 * @package Foxy/Theme
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @license GPL
 * @license https://wpclouds.com
 */

do_action( 'foxy_after_main_content' );

do_action( 'foxy_before_footer' );
	do_action( 'foxy_footer' );
do_action( 'foxy_after_footer' );

/**
 * Output WordPress footer
 * This is function use to output WordPress footer content or Other integrate other plugins, theme functions
 *
 * @see https://codex.wordpress.org/Function_Reference/wp_footer
 * @since 1.0.0
 */
wp_footer();
?>
</body>
</html>
