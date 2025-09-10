<?php

namespace Jankx\Swiper;

use Jankx\Gutenberg\GutenbergRepository;
use Jankx\Swiper\Traits\SingletonTrait;
use Jankx\Swiper\Classes\StyleGenerator;
use Jankx\Swiper\Assets\FrontendAssets;
use Jankx\Swiper\Assets\AdminAssets;
use Jankx\Swiper\Classes\RegistrationBlocks;
use Jankx\Swiper\Classes\RegistrationCategory;
use Jankx\Swiper\Classes\FontLoader;
use Jankx\Swiper\Classes\SupportSVG;
use Jankx\Swiper\Utils\Utils;

if (! defined('ABSPATH')) {
    exit;
}

if ( ! class_exists( 'SwiperService' ) ) {

	class SwiperService {

		use SingletonTrait;

		/**
		 * Constructor
		 */
		public function __construct() {
			add_action('init', [$this, 'init']);
		}

		/**
		 * Initialize the swiper service
		 */
		public function init() {
			StyleGenerator::getInstance()->register();
			FrontendAssets::getInstance()->register();
			AdminAssets::getInstance()->register();
			// RegistrationBlocks::getInstance()->register(); // Removed - blocks are auto-registered by GutenbergService
			RegistrationCategory::getInstance()->register();
			FontLoader::getInstance()->register();
			Utils::getInstance()->register();

			// Register Swiper blocks with Gutenberg service
			add_action('jankx/gutenberg/register-blocks', [$this, 'registerSwiperBlocks'], 10, 2);

			// SVG Support
			if (is_admin()) {
				SupportSVG::getInstance()->register();
			}
		}

		/**
		 * Register Swiper blocks with Gutenberg service
		 *
		 * @param \Jankx\Gutenberg\GutenbergRepository $repository
		 * @param \Jankx\Foundation\Application $app
		 * @return void
		 */
		public function registerSwiperBlocks(GutenbergRepository $repository, $app) {
			// Register Swiper block classes
			$repository->registerBlock(\Jankx\Swiper\Blocks\SwiperBaseBlock::class);
			$repository->registerBlock(\Jankx\Swiper\Blocks\SwiperFlexibleBlock::class);
			$repository->registerBlock(\Jankx\Swiper\Blocks\SwiperFlexibleItemBlock::class);
		}
	}

}
