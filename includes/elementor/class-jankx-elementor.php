<?php
use Elementor\Widget_Base;
class Jankx_Elementor {
	public function __construct() {
		$activated_plugins = get_option( 'active_plugins', array() );
		if ( ! in_array( 'elementor/elementor.php', $activated_plugins ) || ! class_exists( Widget_Base::class ) ) {
			return;
		}
		$this->include_elementor_widgets();
		$this->init_hooks();
	}


	public function include_elementor_widgets() {
		require_once dirname( __FILE__ ) . '/widgets/class-jankx-elementor-widget-posts.php';
		require_once dirname( __FILE__ ) . '/widgets/class-jankx-elementor-widget-category-posts.php';
	}

	public function init_hooks() {
		add_action( 'elementor/init', array( $this, 'register_elementor_widgets' ) );
	}

	public function register_elementor_widgets() {
	}
}

new Jankx_Elementor();
