<?php
/**
 * Jankx Framework
 */
final class Jankx_Framework {
	public function __construct() {
		$loaded = $this->load_composer();
		if ( ! $loaded && ! function_exists( 'jankx' ) ) {
			function jankx() {
				_e( 'Please install Jankx framework via Composer.', 'jankx' );
			}
		}
		$this->define_constants();
		$this->setup_theme();
	}

	protected function load_composer() {
		$autoload = sprintf( '%s/vendor/autoload.php', get_template_directory() );
		if ( file_exists( $autoload ) ) {
			require_once $autoload;
			return true;
		}
		return false;
	}

	private function define( $name, $value ) {
		if ( defined( $name ) ) {
			return;
		}
		define( $name, $value );
	}

	protected function define_constants() {
		$this->define( 'JANKX_ABSPATH', get_template_directory() );
	}

	protected function setup_theme() {
		// Create theme feature at here
	}
}

new Jankx_Framework();
