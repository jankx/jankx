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
		} else {
			$this->bootstrap();
			$this->includes();
			$this->init_hooks();
		}
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

	protected function bootstrap() {
		$this->define( 'JANKX_ABSPATH', dirname(__DIR__) );
	}

	protected function includes() {
	}
	
	protected function init_hooks() {
                add_action('switch_theme', array($this, 'active_theme'));
		add_action('after_setup_theme', array($this, 'setup_theme'));
	}

        public function active_theme() {
        }
	
	public function setup_theme() {
	}
}

new Jankx_Framework();
