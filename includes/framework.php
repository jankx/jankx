<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

/**
 * Jankx Framework
 */

use Jankx\Option;
use Jankx\SiteLayout\Menu\Mobile\Slideout;

// Include configuration
require_once __DIR__ . '/config.php';

// Define constants with proper validation
if (!defined('JANKX_FRAMEWORK_FILE_LOADER')) {
    define('JANKX_FRAMEWORK_FILE_LOADER', __FILE__);
}

if (!defined('JANKX_FRAMEWORK_DIRECTORY')) {
    define('JANKX_FRAMEWORK_DIRECTORY', dirname(__DIR__));
}

final class Jankx_Framework
{
    protected $supportHomePagination = false;

    // Use constants from config
    const MOBILE_BREAKPOINT = Jankx_Config::MOBILE_BREAKPOINT;
    const DEFAULT_POST_TYPES = Jankx_Config::DEFAULT_POST_TYPES;

    public function __construct()
    {
        // Check requirements first
        if (!Jankx_Config::check_requirements()) {
            add_action('admin_notices', [$this, 'show_requirements_error']);
            return;
        }

        $loaded = $this->load_composer();
        if (! $loaded && ! function_exists('jankx')) {
            function jankx()
            {
                _e('Please install Jankx framework via Composer.', 'jankx');
            }
        } else {
            $this->bootstrap();
            $this->includes();
            $this->init_hooks();
        }
    }

    /**
     * Show requirements error notice
     */
    public function show_requirements_error()
    {
        $error_message = Jankx_Config::get_requirements_error();
        echo '<div class="notice notice-error"><p>' . $error_message . '</p></div>';
    }

    protected function load_composer()
    {
        $autoload = sprintf('%s/vendor/autoload.php', get_template_directory());
        if (file_exists($autoload)) {
            require_once $autoload;
            return true;
        }
        return false;
    }

    private function define($name, $value)
    {
        if (defined($name)) {
            return;
        }
        // Fix the editor warning
        if ($name === 'JANKX_ABSPATH') {
            define('JANKX_ABSPATH', $value);
        } else {
            define($name, $value);
        }
    }

    protected function bootstrap()
    {
        $this->define('JANKX_ABSPATH', dirname(__DIR__));
        if (! function_exists('jankx_get_option')) {
            function jankx_get_option($optionName, $defaultValue = null)
            {
                return Option::get($optionName, $defaultValue);
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
        // Disable WordPress theme system and use Jankx theme system
        add_filter('wp_using_themes', '__return_false');
    }

    protected function includes()
    {
        // Include security helper
        require_once __DIR__ . '/security.php';

        // Include path validator
        require_once __DIR__ . '/path-validator.php';

        // Include file upload security
        require_once __DIR__ . '/file-upload-security.php';

        // Include performance config
        require_once __DIR__ . '/performance-config.php';

        // Include performance helper
        require_once __DIR__ . '/performance.php';
    }

    protected function init_hooks()
    {
        $jankxInstance = Jankx::getInstance();

        add_action(
            'after_setup_theme',
            array($jankxInstance, 'setup'),
            2
        );

        add_action('after_switch_theme', array( $this, 'active' ));
        add_action('after_setup_theme', array( $this, 'setup_theme' ));

        if (wp_is_request('frontend')) {
            add_filter('has_post_thumbnail', array($this, 'has_post_thumbnail'), 10, 3);
            add_filter('default_post_metadata', array($this, 'default_post_thumbnail'), 10, 4);
        }
        add_action('init', [$this, 'init']);
    }

    public function init()
    {
        if (get_option('show_on_front') === 'posts') {
            $this->rewriteRules();
        }
    }

    /**
     * @param \WP_Post[] $posts
     * @param \WP_Query $query
     */
    public function supportHomePagePaginate($posts, $query)
    {
        if ($this->supportHomePagination  && $query->is_home() && $query->get('paged') > 1 && $query->is_main_query() && empty($posts)) {
            $posts = [new \WP_Post(new stdClass())];
        }
        return $posts;
    }

    protected function rewriteRules()
    {
        add_rewrite_rule(
            '^/page/([0-9]{1,})/?$',
            'index.php?paged=$matches[1]&p=1',
            'top'
        );
        $this->supportHomePagination = true;
        add_filter('posts_results', [$this, 'supportHomePagePaginate'], 10, 2);
    }

    public function has_post_thumbnail($has_thumbnail, $post, $thumbnail_id)
    {
        $post = get_post($post);
        if (in_array($post->post_type, self::DEFAULT_POST_TYPES)) {
            return true;
        }
        return $has_thumbnail;
    }

    public function default_post_thumbnail($value, $object_id, $meta_key, $single)
    {
        if ($meta_key !== '_thumbnail_id') {
            return $value;
        }

        // Return the image ID from WordPress media
        return 0;
    }

    public function active()
    {
        $theme = Jankx::theme();
        $installed = get_option(sprintf('%s_is_installed', $theme->stylesheet));

        do_action('jankx_framework_activation_hook', $installed);
        do_action("{$theme->stylesheet}_activation_hook", $installed);
    }

    public function setup_theme()
    {
        // Example added icon font to Jankx framework
        // IconFonts::add( 'fontawesome5', sprintf('%s/assets/fontawesome-free-5.15.3-web/css/all.css', JANKX_ABSPATH), '5.15.3', 'Fontawesome 5' );

        if (wp_is_request('frontend')) {
            apply_filters('jankx/layout/site/mobile/menu/apply', function () {
                return Slideout::class;
            });
        }
    }
}

new Jankx_Framework();
