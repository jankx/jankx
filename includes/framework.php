<?php
/**
 * Jankx Framework
 */
use Jankx\GlobalVariables;
use Jankx\Yaml\Yaml;
use Jankx\Option\Option;
use Jankx\IconFonts;

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
		$this->define( 'JANKX_ABSPATH', dirname( __DIR__ ) );
		if ( ! function_exists( 'jankx_get_option' ) ) {
			function jankx_get_option( $optionName, $defaultValue = null ) {
				return Option::get( $optionName, $defaultValue );
			}
		}
		
		if (! function_exists('jankx_get_asset_url')) {
		    function jankx_get_asset_url($path = '')
		    {
			if (!isset($GLOBALS['jankx_asset_dir_url'])) {
			    $GLOBALS['jankx_asset_dir_url'] = sprintf('%s/assets', jankx_get_path_url(JANKX_ABSPATH));
			}

			return sprintf('%s/%s', $GLOBALS['jankx_asset_dir_url'], $path);
		    }
		}

		$theme_config_file = sprintf( '%s/.theme.yml', constant( 'JANKX_ABSPATH' ) );
		if ( file_exists( $theme_config_file ) ) {
			$yaml          = new Yaml();
			$theme_configs = $yaml->loadFile( $theme_config_file );

			if ( is_array( $theme_configs ) ) {
				foreach( $theme_configs as $config => $value ) {
					GlobalVariables::set( $config, $value, true );
				}
			}
		}
		// Disable WordPress theme system and use Jankx theme system
		add_filter( 'wp_using_themes', '__return_false' );
	}

	protected function includes() {
	}

	protected function init_hooks() {
		add_action( 'after_switch_theme', array( $this, 'active' ));
		add_action( 'after_setup_theme', array( $this, 'setup_theme' ) );
	
		if ( wp_is_request( 'frontend' ) ) {
			add_filter('has_post_thumbnail', array($this, 'has_post_thumbnail'), 10, 3);
			add_filter('default_post_metadata', array($this, 'default_post_thumbnail'), 10, 4);
		}
	}

	public function has_post_thumbnail($has_thumbnail, $post, $thumbnail_id) {
		$post = get_post($post);
		if (in_array($post->post_type, array('post'))) {
			return true;
		}
		return $has_thumbnail;
	}


	public function default_post_thumbnail($value, $object_id, $meta_key, $single) {
		if ($meta_key !== '_thumbnail_id') {
			return $value;
		}

		// Return the image ID from WordPress media
		return 0;
	}
	
	public function active() {
            $theme = Jankx::theme();
            $installed = get_option(sprintf('%s_is_installed', $theme->stylesheet));

            do_action('jankx_framework_activation_hook', $installed);
            do_action("{$theme->stylesheet}_activation_hook", $installed);
	}

	public function setup_theme() {
		// Example added icon font to Jankx framework
		// IconFonts::add( 'fontawesome5', sprintf('%s/assets/fontawesome-free-5.15.3-web/css/all.css', JANKX_ABSPATH), '5.15.3', 'Fontawesome 5' );
	}
}

new Jankx_Framework();
