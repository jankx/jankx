<?php
/**
 * Jankx Framework
 */
final class Jankx_Framework {
	public function __construct() {
		$loaded = $this->load_composer();
		if ( ! $loaded ) {
			return;
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
		add_action( 'init', array( $this, 'load_integrated_plugins' ) );
	}

	public function load_integrated_plugins() {
		require_once JANKX_ABSPATH . '/includes/elementor/class-jankx-elementor.php';
	}
}

new Jankx_Framework();
