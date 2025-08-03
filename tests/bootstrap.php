<?php

// Load Composer autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// Mock WordPress functions for testing
if (!function_exists('add_action')) {
    function add_action($hook, $callback, $priority = 10, $accepted_args = 1)
    {
        // Mock implementation
    }
}

if (!function_exists('add_filter')) {
    function add_filter($hook, $callback, $priority = 10, $accepted_args = 1)
    {
        // Mock implementation
    }
}

if (!function_exists('do_action')) {
    function do_action($hook, ...$args)
    {
        // Mock implementation
    }
}

if (!function_exists('apply_filters')) {
    function apply_filters($hook, $value, ...$args)
    {
        return $value;
    }
}

if (!function_exists('wp_parse_url')) {
    function wp_parse_url($url, $component = -1)
    {
        return parse_url($url, $component);
    }
}

if (!function_exists('wp_doing_ajax')) {
    function wp_doing_ajax()
    {
        return false;
    }
}

if (!function_exists('wp_doing_cron')) {
    function wp_doing_cron()
    {
        return false;
    }
}

if (!function_exists('is_admin')) {
    function is_admin()
    {
        return $GLOBALS['mock_is_admin'] ?? true;
    }
}

if (!function_exists('wp_get_environment_type')) {
    function wp_get_environment_type()
    {
        return 'production';
    }
}

if (!function_exists('get_option')) {
    function get_option($option, $default = false)
    {
        return $default;
    }
}

if (!function_exists('update_option')) {
    function update_option($option, $value, $autoload = null)
    {
        return true;
    }
}

if (!function_exists('delete_option')) {
    function delete_option($option)
    {
        return true;
    }
}



if (!function_exists('get_locale')) {
    function get_locale()
    {
        return 'en_US';
    }
}

if (!function_exists('wp_get_theme')) {
    function wp_get_theme($stylesheet = null)
    {
        return new class {
            public function get($key)
            {
                $data = [
                    'Name' => 'Test Theme',
                    'Version' => '1.0.0',
                    'TextDomain' => 'test-theme',
                    'Template' => 'test-theme',
                    'Stylesheet' => 'test-theme'
                ];
                return $data[$key] ?? '';
            }

            public function get_stylesheet()
            {
                return 'test-theme';
            }

            public function get_template()
            {
                return 'test-theme';
            }
        };
    }
}

if (!function_exists('get_template')) {
    function get_template()
    {
        return 'test-theme';
    }
}

if (!function_exists('get_stylesheet')) {
    function get_stylesheet()
    {
        return 'test-theme';
    }
}

// Mock get_template_directory_uri function
if (!function_exists('get_template_directory_uri')) {
    function get_template_directory_uri()
    {
        return 'http://example.com/wp-content/themes/bookix';
    }
}

// Mock get_stylesheet_directory_uri function
if (!function_exists('get_stylesheet_directory_uri')) {
    function get_stylesheet_directory_uri()
    {
        return 'http://example.com/wp-content/themes/bookix-child';
    }
}

// Mock get_site_url function
if (!function_exists('get_site_url')) {
    function get_site_url($path = '')
    {
        return 'http://example.com';
    }
}

// Mock get_home_url function
if (!function_exists('get_home_url')) {
    function get_home_url($path = '')
    {
        return 'http://example.com';
    }
}

// Mock get_admin_url function
if (!function_exists('get_admin_url')) {
    function get_admin_url($path = '')
    {
        return 'http://example.com/wp-admin';
    }
}

// Mock content_url function
if (!function_exists('content_url')) {
    function content_url($path = '')
    {
        return 'http://example.com/wp-content/' . ltrim($path, '/');
    }
}

if (!function_exists('wp_enqueue_style')) {
    function wp_enqueue_style($handle, $src = false, $deps = array(), $ver = false, $media = 'all')
    {
        // Mock implementation
    }
}

if (!function_exists('wp_register_style')) {
    function wp_register_style($handle, $src, $deps = array(), $ver = false, $media = 'all')
    {
        // Mock implementation
    }
}

if (!function_exists('AUTH_KEY')) {
    if (!defined('AUTH_KEY')) {
        define('AUTH_KEY', 'test-key');
    }
}

// Mock WordPress functions
if (!function_exists('wp_cache_get')) {
    function wp_cache_get($key, $group = 'default')
    {
        return false;
    }
}

if (!function_exists('wp_cache_set')) {
    function wp_cache_set($key, $value, $group = 'default', $ttl = 0)
    {
        return true;
    }
}

if (!function_exists('wp_cache_flush_group')) {
    function wp_cache_flush_group($group)
    {
        return true;
    }
}

if (!function_exists('crc32')) {
    function crc32($string)
    {
        return hash('crc32', $string);
    }
}

if (!function_exists('__')) {
    function __($text, $domain = 'default')
    {
        return $text;
    }
}

if (!function_exists('_e')) {
    function _e($text, $domain = 'default')
    {
        echo $text;
    }
}

if (!function_exists('esc_html')) {
    function esc_html($text)
    {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('esc_attr')) {
    function esc_attr($text)
    {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('esc_url')) {
    function esc_url($url)
    {
        return filter_var($url, FILTER_SANITIZE_URL);
    }
}

if (!function_exists('get_template_directory')) {
    function get_template_directory()
    {
        return '/path/to/template';
    }
}

if (!function_exists('register_block_type')) {
    function register_block_type($block_name, $args = array())
    {
        return true;
    }
}

if (!function_exists('register_rest_route')) {
    function register_rest_route($namespace, $route, $args = array())
    {
        return true;
    }
}

if (!function_exists('rest_ensure_response')) {
    function rest_ensure_response($data)
    {
        return new WP_REST_Response($data);
    }
}

if (!class_exists('WP_REST_Response')) {
    class WP_REST_Response
    {
        private $data;

        public function __construct($data)
        {
            $this->data = $data;
        }

        public function get_data()
        {
            return $this->data;
        }
    }
}

if (!class_exists('WP_REST_Request')) {
    class WP_REST_Request
    {
        private $params = [];

        public function get_param($key)
        {
            return $this->params[$key] ?? null;
        }

        public function set_param($key, $value)
        {
            $this->params[$key] = $value;
        }
    }
}

if (!class_exists('WP_Widget')) {
    class WP_Widget
    {
        public $id_base;
        public $name;
        public $widget_options;

        public function __construct()
        {
            $this->id_base = 'widget';
            $this->name = 'Widget';
            $this->widget_options = ['description' => 'A widget'];
        }

        public function widget($args, $instance)
        {
            // Mock widget rendering
        }
    }
}

// Mock widget classes
if (!class_exists('WP_Widget_Text')) {
    class WP_Widget_Text extends WP_Widget
    {
        public function __construct()
        {
            parent::__construct();
            $this->id_base = 'text';
            $this->name = 'Text';
            $this->widget_options = ['description' => 'Arbitrary text or HTML.'];
        }
    }
}

if (!class_exists('WP_Widget_Search')) {
    class WP_Widget_Search extends WP_Widget
    {
        public function __construct()
        {
            parent::__construct();
            $this->id_base = 'search';
            $this->name = 'Search';
            $this->widget_options = ['description' => 'A search form for your site.'];
        }
    }
}

if (!class_exists('WP_Widget_Recent_Posts')) {
    class WP_Widget_Recent_Posts extends WP_Widget
    {
        public function __construct()
        {
            parent::__construct();
            $this->id_base = 'recent-posts';
            $this->name = 'Recent Posts';
            $this->widget_options = ['description' => 'Your site&#8217;s most recent Posts.'];
        }
    }
}

// Mock global variables
global $wp_widget_factory;
$wp_widget_factory = new stdClass();
$wp_widget_factory->widgets = [
    'text' => 'WP_Widget_Text',
    'search' => 'WP_Widget_Search',
    'recent-posts' => 'WP_Widget_Recent_Posts'
];

// Mock wp_upload_dir function
if (!function_exists('wp_upload_dir')) {
    function wp_upload_dir()
    {
        return [
            'baseurl' => 'http://example.com/wp-content/uploads',
            'basedir' => '/path/to/wp-content/uploads',
            'url' => 'http://example.com/wp-content/uploads',
            'path' => '/path/to/wp-content/uploads',
            'subdir' => '',
            'error' => false
        ];
    }
}

// Mock get_stylesheet_directory function
if (!function_exists('get_stylesheet_directory')) {
    function get_stylesheet_directory()
    {
        return '/path/to/wp-content/themes/bookix-child';
    }
}

// Mock remove_all_actions function
if (!function_exists('remove_all_actions')) {
    function remove_all_actions($hook, $priority = false)
    {
        return true;
    }
}

// Mock remove_action function
if (!function_exists('remove_action')) {
    function remove_action($hook, $callback, $priority = 10)
    {
        return true;
    }
}

// Mock WordPress menu functions
if (!function_exists('wp_nav_menu')) {
    function wp_nav_menu($args = [])
    {
        $defaults = [
            'theme_location' => 'primary',
            'container' => 'nav',
            'container_class' => 'menu-primary',
            'container_id' => 'menu-primary',
            'menu_class' => 'menu',
            'echo' => false,
            'fallback_cb' => false,
        ];
        $args = wp_parse_args($args, $defaults);

        if ($args['echo']) {
            return '';
        }

        return sprintf(
            '<%1$s class="%2$s" id="%3$s"><ul class="%4$s"><li><a href="#">Menu Item</a></li></ul></%1$s>',
            $args['container'],
            $args['container_class'],
            $args['container_id'],
            $args['menu_class']
        );
    }
}

if (!function_exists('has_nav_menu')) {
    function has_nav_menu($location)
    {
        $locations = [
            'primary' => true,
            'secondary' => true,
            'footer' => true,
        ];
        return $locations[$location] ?? false;
    }
}

if (!function_exists('get_nav_menu_locations')) {
    function get_nav_menu_locations()
    {
        return [
            'primary' => 1,
            'secondary' => 2,
            'footer' => 3,
        ];
    }
}

if (!function_exists('wp_get_nav_menu_object')) {
    function wp_get_nav_menu_object($menu_id)
    {
        return (object) [
            'term_id' => $menu_id,
            'name' => 'Test Menu',
            'slug' => 'test-menu',
        ];
    }
}

if (!function_exists('wp_get_nav_menu_items')) {
    function wp_get_nav_menu_items($menu_id)
    {
        return [
            (object) [
                'ID' => 1,
                'title' => 'Home',
                'url' => 'http://example.com/',
                'menu_item_parent' => 0,
            ],
            (object) [
                'ID' => 2,
                'title' => 'About',
                'url' => 'http://example.com/about/',
                'menu_item_parent' => 0,
            ],
        ];
    }
}

// Mock WordPress sidebar functions
if (!function_exists('is_active_sidebar')) {
    function is_active_sidebar($sidebar_id)
    {
        $active_sidebars = [
            'primary-sidebar' => true,
            'secondary-sidebar' => true,
            'footer-widget-1' => true,
            'footer-widget-2' => true,
            'footer-widget-3' => true,
        ];
        return $active_sidebars[$sidebar_id] ?? false;
    }
}

if (!function_exists('dynamic_sidebar')) {
    function dynamic_sidebar($sidebar_id)
    {
        echo '<div class="widget">Widget content for ' . $sidebar_id . '</div>';
    }
}

if (!function_exists('wp_get_sidebars_widgets')) {
    function wp_get_sidebars_widgets()
    {
        return [
            'primary-sidebar' => ['widget-1', 'widget-2'],
            'secondary-sidebar' => ['widget-3'],
            'footer-widget-1' => ['widget-4'],
            'footer-widget-2' => ['widget-5'],
            'footer-widget-3' => ['widget-6'],
        ];
    }
}

// Mock WordPress page functions
if (!function_exists('is_page_template')) {
    function is_page_template($template)
    {
        return false;
    }
}

if (!function_exists('is_404')) {
    function is_404()
    {
        return false;
    }
}

if (!function_exists('get_theme_mod')) {
    function get_theme_mod($name, $default = false)
    {
        $mods = [
            'sidebar_layout' => 'right',
        ];
        return $mods[$name] ?? $default;
    }
}

if (!function_exists('get_permalink')) {
    function get_permalink($post = 0)
    {
        return 'http://example.com/current-page/';
    }
}

if (!function_exists('wp_parse_args')) {
    function wp_parse_args($args, $defaults = '')
    {
        if (is_object($args)) {
            $parsed_args = get_object_vars($args);
        } elseif (is_array($args)) {
            $parsed_args =& $args;
        } else {
            wp_parse_str($args, $parsed_args);
        }

        if (is_array($defaults)) {
            return array_merge($defaults, $parsed_args);
        }

        return $parsed_args;
    }
}

if (!function_exists('wp_parse_str')) {
    function wp_parse_str($string, &$array)
    {
        parse_str($string, $array);
    }
}

// Mock global variables for sidebars
global $wp_registered_sidebars;
$wp_registered_sidebars = [
    'primary-sidebar' => [
        'name' => 'Primary Sidebar',
        'id' => 'primary-sidebar',
        'description' => 'Primary sidebar area',
    ],
    'secondary-sidebar' => [
        'name' => 'Secondary Sidebar',
        'id' => 'secondary-sidebar',
        'description' => 'Secondary sidebar area',
    ],
];

// Mock register_block_pattern_category function
if (!function_exists('register_block_pattern_category')) {
    function register_block_pattern_category($slug, $properties)
    {
        return true;
    }
}

// Mock wp_cache_delete function
if (!function_exists('wp_cache_delete')) {
    function wp_cache_delete($key, $group = 'default')
    {
        return true;
    }
}

// Mock glob function for testing
if (!function_exists('glob')) {
    function glob($pattern, $flags = 0)
    {
        return [];
    }
}

// Set up test environment
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('JANKX_ABSPATH', __DIR__ . '/../');
