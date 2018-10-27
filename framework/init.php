<?php
/**
 * Foxy Framework
 *
 * @package Foxy/Theme
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @license GPL-3
 */

/**
 * Foxy theme framework define theme constants
 *
 * @since 1.0.0
 * @return void
 */
function foxy_define_constants() {
	define( 'FOXY_THEME_ROOT', dirname( __DIR__ ) . '/' );
	define( 'FOXY_THEME_FRAMEWORK', FOXY_THEME_ROOT . 'framework/' );
	define( 'FOXY_COMPOSER_DIR', FOXY_THEME_ROOT . 'includes/' );
}

// Define constants.
foxy_define_constants();

/**
 * Load frameworks for foxy theme
 *
 * @since 1.0.0
 * @return void
 */
function foxy_load_framework() {
	// Composer integration.
	$composer_autoload = FOXY_COMPOSER_DIR . 'autoload.php';
	if ( file_exists( $composer_autoload ) ) {
		require_once $composer_autoload;
	}

	require_once FOXY_THEME_FRAMEWORK . 'jackal/framework.php';
	require_once FOXY_THEME_FRAMEWORK . 'foxy/framework.php';
	// Include foxy widget if is exists.
	$foxy_widgets = FOXY_THEME_FRAMEWORK . '/widgets/widgets.php';
	if ( file_exists( $foxy_widgets ) ) {
		require_once $foxy_widgets;
	}

	/**
	 * Register foxy cli commands
	 */
	if ( Foxy::is_cli() ) {
		require_once FOXY_THEME_FRAMEWORK . 'cli/class-foxy-cli.php';
		Foxy_Cli::register_commands();
	}
}

// Load frameworks.
foxy_load_framework();
