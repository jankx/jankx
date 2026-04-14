<?php
/**
 * PHPUnit Bootstrap File for Jankx Theme
 */

// Load Composer autoloader
$autoloader = dirname(__FILE__) . '/../vendor/autoload.php';
if (file_exists($autoloader)) {
    require_once $autoloader;
}

// Global state for mock WordPress environment
$GLOBALS['options'] = [];
$GLOBALS['mock_posts'] = [];
$GLOBALS['transients'] = [];
$GLOBALS['wp_hooks'] = [
    'actions' => [],
    'filters' => []
];

// Define common WP constants
if (!defined('ABSPATH')) define('ABSPATH', dirname(__FILE__) . '/../');
if (!defined('WP_CONTENT_DIR')) define('WP_CONTENT_DIR', ABSPATH . 'wp-content');
if (!defined('WP_PLUGIN_DIR')) define('WP_PLUGIN_DIR', WP_CONTENT_DIR . '/plugins');
if (!defined('WP_THEME_DIR')) define('WP_THEME_DIR', WP_CONTENT_DIR . '/themes');
if (!defined('HOUR_IN_SECONDS')) define('HOUR_IN_SECONDS', 3600);
if (!defined('DAY_IN_SECONDS')) define('DAY_IN_SECONDS', 86400);

// Classes Mocking
if (!class_exists('WP_CLI')) {
    class WP_CLI {
        public static function log($m) {}
        public static function error($m, $d = true) { if ($d) throw new \Exception($m); }
        public static function success($m) {}
        public static function add_command($n, $c) {}
        public static function line($m) {}
        public static function warning($m) {}
        public static function debug($m, $g = false) {}
    }
}
if (!class_exists('WP_CLI_Command')) { class WP_CLI_Command {} }

if (!class_exists('WP_Block')) {
    class WP_Block {
        public $attributes;
        public $name;
        public function __construct($block) {
            $this->attributes = $block['attrs'] ?? [];
            $this->name = $block['blockName'] ?? '';
        }
    }
}

if (!class_exists('WP_Block_Type_Registry')) {
    class WP_Block_Type_Registry {
        private static $instance = null;
        private $registered_block_types = [];
        public static function get_instance() {
            if (null === self::$instance) self::$instance = new self();
            return self::$instance;
        }
        public function register($name, $args = []) {
            $this->registered_block_types[$name] = (object) array_merge(['name' => $name], $args);
            return $this->registered_block_types[$name];
        }
        public function is_registered($name) { return isset($this->registered_block_types[$name]); }
        public function get_registered($name) { return $this->registered_block_types[$name] ?? null; }
        public function unregister($name) { unset($this->registered_block_types[$name]); }
    }
}

// Hook System
if (!function_exists('add_action')) {
    function add_action($tag, $callback, $priority = 10, $accepted_args = 1) {
        $GLOBALS['wp_hooks']['actions'][$tag][$priority][] = $callback;
        return true;
    }
}
if (!function_exists('add_filter')) {
    function add_filter($tag, $callback, $priority = 10, $accepted_args = 1) {
        $GLOBALS['wp_hooks']['filters'][$tag][$priority][] = $callback;
        return true;
    }
}
if (!function_exists('do_action')) {
    function do_action($tag, ...$args) {
        if (isset($GLOBALS['wp_hooks']['actions'][$tag])) {
            $priorities = $GLOBALS['wp_hooks']['actions'][$tag];
            ksort($priorities);
            foreach ($priorities as $priority => $callbacks) {
                foreach ($callbacks as $callback) call_user_func_array($callback, $args);
            }
        }
        return true;
    }
}
if (!function_exists('apply_filters')) {
    function apply_filters($tag, $value, ...$args) {
        if (isset($GLOBALS['wp_hooks']['filters'][$tag])) {
            $priorities = $GLOBALS['wp_hooks']['filters'][$tag];
            ksort($priorities);
            foreach ($priorities as $priority => $callbacks) {
                foreach ($callbacks as $callback) $value = call_user_func_array($callback, array_merge([$value], $args));
            }
        }
        return $value;
    }
}
if (!function_exists('did_action')) { function did_action($t) { return 0; } }

// Options & Transients
if (!function_exists('get_option')) { function get_option($o, $d = false) { return $GLOBALS['options'][$o] ?? $d; } }
if (!function_exists('update_option')) { function update_option($o, $v, $a = null) { $GLOBALS['options'][$o] = $v; return true; } }
if (!function_exists('delete_option')) { function delete_option($o) { unset($GLOBALS['options'][$o]); return true; } }
if (!function_exists('get_transient')) { function get_transient($t) { return $GLOBALS['transients'][$t] ?? false; } }
if (!function_exists('set_transient')) { function set_transient($t, $v, $e = 0) { $GLOBALS['transients'][$t] = $v; return true; } }
if (!function_exists('delete_transient')) { function delete_transient($t) { unset($GLOBALS['transients'][$t]); return true; } }

// Cache
if (!function_exists('wp_cache_get')) { function wp_cache_get($k, $g = '', $f = false, &$found = null) { $found = false; return false; } }
if (!function_exists('wp_cache_set')) { function wp_cache_set($k, $v, $g = '', $e = 0) { return true; } }
if (!function_exists('wp_cache_delete')) { function wp_cache_delete($k, $g = '') { return true; } }

// Blocks
if (!function_exists('register_block_type')) { function register_block_type($n, $a = []) { return WP_Block_Type_Registry::get_instance()->register($n, $a); } }
if (!function_exists('register_block_type_from_metadata')) { function register_block_type_from_metadata($f, $a = []) { return true; } }
if (!function_exists('render_block')) {
    function render_block($block) {
        $block_type = WP_Block_Type_Registry::get_instance()->get_registered($block['blockName']);
        if ($block_type && isset($block_type->render_callback)) {
            return (string) call_user_func($block_type->render_callback, $block['attrs'] ?? [], $block['innerHTML'] ?? '');
        }
        return sprintf('<!-- %s -->', $block['blockName'] ?? 'block');
    }
}
if (!function_exists('serialize_block')) {
    function serialize_block($block) {
        $blockName = $block['blockName'] ?? 'block';
        $attrs = !empty($block['attrs']) ? ' ' . json_encode($block['attrs']) : '';
        return sprintf('<!-- wp:%s%s -->%s<!-- /wp:%s -->', $blockName, $attrs, $block['innerHTML'] ?? '', $blockName);
    }
}
if (!function_exists('parse_blocks')) {
    function parse_blocks($content) {
        $blocks = [];
        preg_match_all('/<!--\s+wp:([^\s]+?)\s*(?:(\{.*?\})\s*)?-->([\s\S]*?)<!--\s+\/wp:\1\s+-->/s', $content, $matches, PREG_SET_ORDER);
        foreach ($matches as $match) {
            $blocks[] = [
                'blockName' => $match[1],
                'attrs' => !empty($match[2]) ? json_decode($match[2], true) : [],
                'innerHTML' => $match[3],
                'innerContent' => [$match[3]],
                'innerBlocks' => [],
            ];
        }
        return $blocks;
    }
}

// Posts
if (!function_exists('get_post')) {
    function get_post($post = null) {
        if (is_numeric($post) && isset($GLOBALS['mock_posts'][$post])) return $GLOBALS['mock_posts'][$post];
        if (is_object($post)) return $post;
        return null;
    }
}
if (!function_exists('wp_insert_post')) {
    function wp_insert_post($postarr) {
        static $id_counter = 100;
        $id = $id_counter++;
        $GLOBALS['mock_posts'][$id] = (object) array_merge([
            'ID' => $id, 'post_content' => '', 'post_title' => '', 'post_status' => 'publish', 'post_type' => 'post',
        ], $postarr);
        return $id;
    }
}
if (!function_exists('wp_delete_post')) { function wp_delete_post($id, $f = false) { unset($GLOBALS['mock_posts'][$id]); return true; } }
if (!function_exists('get_posts')) { function get_posts($a = null) { return []; } }
if (!function_exists('get_permalink')) { function get_permalink($p = 0) { return 'http://example.com/p/' . (is_object($p) ? $p->ID : $p); } }
if (!function_exists('get_the_ID')) { function get_the_ID() { return 1; } }
if (!function_exists('is_singular')) { function is_singular($p = '') { return false; } }

// Users
if (!function_exists('get_current_user_id')) { function get_current_user_id() { return 1; } }
if (!function_exists('get_userdata')) {
    function get_userdata($id) {
        $u = new stdClass(); $u->ID = $id; $u->display_name = 'Test User';
        return $u;
    }
}
if (!function_exists('get_the_author_meta')) { function get_the_author_meta($f = '', $u = false) { return $u ?: 1; } }

// URL & Paths
if (!function_exists('admin_url')) { function admin_url($p = '') { return 'http://example.com/wp-admin/' . ltrim($p, '/'); } }
if (!function_exists('home_url')) { function home_url($p = '') { return 'http://example.com/' . ltrim($p, '/'); } }
if (!function_exists('get_template_directory')) { function get_template_directory() { return ABSPATH; } }
if (!function_exists('get_stylesheet_directory')) { function get_stylesheet_directory() { return ABSPATH; } }

// Utilities & Formatting
if (!function_exists('esc_attr')) { function esc_attr($t) { return htmlspecialchars($t, ENT_QUOTES, 'UTF-8'); } }
if (!function_exists('esc_html')) { function esc_html($t) { return htmlspecialchars($t, ENT_QUOTES, 'UTF-8'); } }
if (!function_exists('esc_url')) { function esc_url($u) { return $u; } }
if (!function_exists('__')) { function __($t, $d = 'default') { return $t; } }
if (!function_exists('_e')) { function _e($t, $d = 'default') { echo $t; } }
if (!function_exists('wp_json_encode')) { function wp_json_encode($d) { return json_encode($d); } }
if (!function_exists('is_admin')) { function is_admin() { return isset($GLOBALS['mock_is_admin']) ? (bool)$GLOBALS['mock_is_admin'] : true; } }
if (!function_exists('wp_doing_ajax')) { function wp_doing_ajax() { return false; } }
if (!function_exists('wp_doing_cron')) { function wp_doing_cron() { return false; } }
if (!function_exists('get_block_wrapper_attributes')) {
    function get_block_wrapper_attributes($extra = []) {
        $out = ''; foreach ($extra as $k => $v) $out .= sprintf(' %s="%s"', esc_attr($k), esc_attr($v));
        return $out;
    }
}
if (!function_exists('wp_style_is')) { function wp_style_is($h, $s = 'registered') { return false; } }
if (!function_exists('wp_create_nonce')) { function wp_create_nonce($action = -1) { return 'mock-nonce'; } }
if (!function_exists('sanitize_html_class')) { function sanitize_html_class($class, $fallback = '') { return preg_replace('/[^a-zA-Z0-9_-]/', '', $class) ?: $fallback; } }
if (!function_exists('get_theme_file_path')) { function get_theme_file_path($path = '') { return ABSPATH . ltrim($path, '/'); } }

if (!function_exists('wp_get_theme')) {
    function wp_get_theme() {
        return new class {
            public function get($key) { return 'Mock Theme'; }
            public function exists() { return true; }
            public function parent() { return false; }
            public function get_screenshot() { return false; }
            public function get_stylesheet() { return 'jankx'; }
            public function get_template() { return 'jankx'; }
        };
    }
}

if (!function_exists('get_avatar')) { function get_avatar($id, $size = 96) { return sprintf('<img src="avatar-%s.png" class="avatar avatar-%d" />', $id, $size); } }
if (!function_exists('get_author_posts_url')) { function get_author_posts_url($id) { return "http://example.com/author/{$id}"; } }
if (!function_exists('get_users')) { function get_users($args = []) { return []; } }
if (!function_exists('wp_check_filetype')) { function wp_check_filetype($f, $m = null) { return ['ext' => 'png', 'type' => 'image/png']; } }
if (!function_exists('wp_upload_dir')) {
    function wp_upload_dir($time = null, $create_dir = true, $refresh_cache = false) {
        return [
            'path' => '/tmp/uploads',
            'url' => 'http://example.com/wp-content/uploads',
            'subdir' => '',
            'basedir' => '/tmp/uploads',
            'baseurl' => 'http://example.com/wp-content/uploads',
            'error' => false,
        ];
    }
}
if (!function_exists('wp_mkdir_p')) { function wp_mkdir_p($path) { return true; } }

// Polylang Mocks
if (!function_exists('get_template')) { function get_template() { return 'jankx'; } }
if (!function_exists('get_stylesheet')) { function get_stylesheet() { return 'jankx'; } }
if (!function_exists('is_child_theme')) { function is_child_theme() { return false; } }

if (!function_exists('pll_the_languages')) {
    function pll_the_languages($args = []) {
        $languages = [
            'en' => (object)[
                'id' => 1, 'slug' => 'en', 'name' => 'English', 'url' => '#en', 'flag' => 'en.png', 'current_lang' => true,
            ],
            'vi' => (object)[
                'id' => 2, 'slug' => 'vi', 'name' => 'Vietnamese', 'url' => '#vi', 'flag' => 'vi.png', 'current_lang' => false,
            ],
        ];

        if ($args['raw'] ?? false) {
            return $languages;
        }

        $output = '<ul class="pll-language-switcher-list"><li>English</li><li>Tiếng Việt</li></ul>';
        if (($args['echo'] ?? 1)) echo $output;
        return $output;
    }
}
if (!function_exists('pll_current_language')) { function pll_current_language() { return 'en'; } }

// Post Types
if (!function_exists('get_post_types')) {
    function get_post_types($args = [], $output = 'names') {
        $pts = ['post' => (object)['name' => 'post'], 'page' => (object)['name' => 'page']];
        return $output === 'names' ? array_keys($pts) : $pts;
    }
}

// Others
if (!function_exists('wp_die')) { function wp_die($m = '') { throw new \Exception($m); } }
if (!function_exists('register_rest_route')) { function register_rest_route($n, $r, $a = []) { return true; } }

// Autoloader for Jankx components
spl_autoload_register(function ($class) {
    if (strpos($class, 'Jankx\\Extensions\\') === 0) {
        $relativeClass = substr($class, 17); // Remove Jankx\Extensions\
        $parts = explode('\\', $relativeClass);
        if (count($parts) >= 1) {
            $extensionSlug = strtolower(preg_replace('/(?<!^)[A-Z]/', '-$0', $parts[0]));
            if ($extensionSlug === 'language-switcher' || $extensionSlug === 'menu-builder') {
                // Handle complex cases where the folder name was already hyphenated
            }
            
            // Try different possible paths for the extension
            $baseDir = dirname(__FILE__) . '/../extensions/' . $extensionSlug;
            
            // Standard location: extensions/slug/includes/...
            $standardFile = $baseDir . '/includes/' . implode('/', array_slice($parts, 1)) . '.php';
            if (file_exists($standardFile)) {
                require_once $standardFile;
                return;
            }

            // Fallback for main extension class: extensions/slug/ClassName.php
            $fallbackFile = $baseDir . '/' . end($parts) . '.php';
            if (file_exists($fallbackFile)) {
                require_once $fallbackFile;
                return;
            }
        }
    }
});

require_once dirname(__FILE__) . '/Helpers/TestCase.php';
