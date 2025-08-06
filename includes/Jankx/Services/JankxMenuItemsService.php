<?php

namespace Jankx\Services;

use Jankx\Foundation\Application;

/**
 * Jankx Menu Items Service
 *
 * Adds custom menu items to WordPress Menu Admin:
 *
 * - Control section in nav-menus.php
 * - Hamburger menu item
 * - Other Jankx-specific menu items
 * - Custom menu item types
 * - Admin interface integration
 *
 * @package App\Services\Layouts
 * @since 2.0.0
 */
class JankxMenuItemsService
{
    /**
     * @var Application
     */
    protected $app;

    /**
     * @var array
     */
    protected $config;

    /**
     * @var array
     */
    protected $menuItemTypes = [];

    /**
     * Initialize Jankx menu items service
     *
     * @param  \Jankx\Foundation\Application  $app
     * @param  array  $config
     * @return void
     */
    public function __construct(Application $app, array $config = [])
    {
        $this->app = $app;
        $this->config = array_merge($this->getDefaultConfig(), $config);

        $this->registerMenuItemTypes();
        $this->setupHooks();
    }

    /**
     * Get default configuration
     *
     * @return array
     */
    protected function getDefaultConfig()
    {
        return [
            'section_title' => 'Jankx Framework',
            'section_id' => 'jankx-framework-menu-items',
            'menu_items' => [
                'hamburger' => [
                    'title' => 'Hamburger Menu',
                    'description' => 'Add hamburger menu button',
                    'icon' => '☰',
                    'class' => 'jankx-menu-item-hamburger',
                ],
                'search' => [
                    'title' => 'Search Box',
                    'description' => 'Add search functionality',
                    'icon' => '🔍',
                    'class' => 'jankx-menu-item-search',
                ],
                'cart' => [
                    'title' => 'Shopping Cart',
                    'description' => 'Add shopping cart icon',
                    'icon' => '🛒',
                    'class' => 'jankx-menu-item-cart',
                ],
                'user' => [
                    'title' => 'User Account',
                    'description' => 'Add user account menu',
                    'icon' => '👤',
                    'class' => 'jankx-menu-item-user',
                ],
            ],
        ];
    }

    /**
     * Register menu item types
     *
     * @return void
     */
    protected function registerMenuItemTypes()
    {
        $this->menuItemTypes = [
            'hamburger' => [
                'title' => $this->config['menu_items']['hamburger']['title'],
                'description' => $this->config['menu_items']['hamburger']['description'],
                'icon' => $this->config['menu_items']['hamburger']['icon'],
                'class' => $this->config['menu_items']['hamburger']['class'],
                'callback' => [$this, 'renderHamburgerMenuItem'],
            ],
            'search' => [
                'title' => $this->config['menu_items']['search']['title'],
                'description' => $this->config['menu_items']['search']['description'],
                'icon' => $this->config['menu_items']['search']['icon'],
                'class' => $this->config['menu_items']['search']['class'],
                'callback' => [$this, 'renderSearchMenuItem'],
            ],
            'cart' => [
                'title' => $this->config['menu_items']['cart']['title'],
                'description' => $this->config['menu_items']['cart']['description'],
                'icon' => $this->config['menu_items']['cart']['icon'],
                'class' => $this->config['menu_items']['cart']['class'],
                'callback' => [$this, 'renderCartMenuItem'],
            ],
            'user' => [
                'title' => $this->config['menu_items']['user']['title'],
                'description' => $this->config['menu_items']['user']['description'],
                'icon' => $this->config['menu_items']['user']['icon'],
                'class' => $this->config['menu_items']['user']['class'],
                'callback' => [$this, 'renderUserMenuItem'],
            ],
        ];
    }

    /**
     * Setup WordPress hooks
     *
     * @return void
     */
    protected function setupHooks()
    {
        // Add control section to nav-menus.php
        add_action('admin_footer-nav-menus.php', [$this, 'addControlSection']);

        // Add custom menu item types
        add_action('wp_nav_menu_item_custom_fields', [$this, 'addCustomFields'], 10, 4);

        // Save custom menu item data
        add_action('wp_update_nav_menu_item', [$this, 'saveCustomFields'], 10, 3);

        // Render custom menu items
        add_filter('wp_nav_menu_item_title', [$this, 'renderCustomMenuItem'], 10, 4);

        // Add custom CSS and JS
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminAssets']);
    }

    /**
     * Add control section to nav-menus.php
     *
     * @return void
     */
    public function addControlSection()
    {
        ?>
        <div id="jankx-framework-menu-items" class="control-section accordion-section">
            <h3 class="accordion-section-title" tabindex="0">
                <?php echo esc_html($this->config['section_title']); ?>
                <span class="screen-reader-text"><?php _e('Press return or enter to expand.'); ?></span>
            </h3>
            <div class="accordion-section-content">
                <div class="customlinkdiv" id="customlinkdiv">
                    <input type="hidden" value="custom" name="menu-item[-1][menu-item-type]" />
                    <p id="menu-item-url-wrap" class="wp-clearfix">
                        <label class="howto" for="custom-menu-item-url">
                            <?php _e('URL'); ?>
                        </label>
                        <input id="custom-menu-item-url" name="menu-item[-1][menu-item-url]" type="text" class="code menu-item-textbox" value="http://" />
                    </p>
                    <p id="menu-item-name-wrap" class="wp-clearfix">
                        <label class="howto" for="custom-menu-item-name">
                            <?php _e('Link Text'); ?>
                        </label>
                        <input id="custom-menu-item-name" name="menu-item[-1][menu-item-title]" type="text" class="regular-text menu-item-textbox" />
                    </p>
                    <p class="button-controls">
                        <span class="add-to-menu">
                            <input type="submit" class="button-secondary submit-add-to-menu right" value="<?php esc_attr_e('Add to Menu'); ?>" name="add-custom-menu-item" id="submit-customlinkdiv" />
                            <span class="spinner"></span>
                        </span>
                    </p>
                </div>

                <!-- Jankx Framework Menu Items -->
                <div class="jankx-menu-items">
                    <h4><?php _e('Jankx Framework Items'); ?></h4>
                    <div class="jankx-menu-items-list">
                        <?php foreach ($this->menuItemTypes as $type => $item) : ?>
                            <div class="jankx-menu-item" data-type="<?php echo esc_attr($type); ?>">
                                <span class="jankx-menu-item-icon"><?php echo $item['icon']; ?></span>
                                <div class="jankx-menu-item-content">
                                    <h5><?php echo esc_html($item['title']); ?></h5>
                                    <p><?php echo esc_html($item['description']); ?></p>
                                </div>
                                <button type="button" class="button jankx-add-menu-item" data-type="<?php echo esc_attr($type); ?>">
                                    <?php _e('Add to Menu'); ?>
                                </button>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }

    /**
     * Add custom fields to menu item
     *
     * @param  int  $item_id
     * @param  object  $item
     * @param  int  $depth
     * @param  array  $args
     * @return void
     */
    public function addCustomFields($item_id, $item, $depth, $args)
    {
        $item_type = get_post_meta($item_id, '_menu_item_jankx_type', true);

        if (empty($item_type) || !isset($this->menuItemTypes[$item_type])) {
            return;
        }

        $menu_item = $this->menuItemTypes[$item_type];
        ?>
        <div class="jankx-menu-item-fields" data-type="<?php echo esc_attr($item_type); ?>">
            <p class="field-jankx-type description description-wide">
                <label for="edit-menu-item-jankx-type-<?php echo $item_id; ?>">
                    <?php _e('Jankx Item Type'); ?>
                </label>
                <select id="edit-menu-item-jankx-type-<?php echo $item_id; ?>"
                        name="menu-item-jankx-type[<?php echo $item_id; ?>]">
                    <option value=""><?php _e('Select Type'); ?></option>
                    <?php foreach ($this->menuItemTypes as $type => $item) : ?>
                        <option value="<?php echo esc_attr($type); ?>"
                                <?php selected($item_type, $type); ?>>
                            <?php echo esc_html($item['title']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </p>

            <?php if (method_exists($this, 'renderCustomFields_' . $item_type)) : ?>
                <?php call_user_func([$this, 'renderCustomFields_' . $item_type], $item_id, $item, $depth, $args); ?>
            <?php endif; ?>
        </div>
        <?php
    }

    /**
     * Save custom fields
     *
     * @param  int  $menu_id
     * @param  int  $menu_item_db_id
     * @param  array  $args
     * @return void
     */
    public function saveCustomFields($menu_id, $menu_item_db_id, $args)
    {
        if (isset($_POST['menu-item-jankx-type'][$menu_item_db_id])) {
            $jankx_type = sanitize_text_field($_POST['menu-item-jankx-type'][$menu_item_db_id]);
            update_post_meta($menu_item_db_id, '_menu_item_jankx_type', $jankx_type);
        }
    }

    /**
     * Render custom menu item
     *
     * @param  string  $title
     * @param  object  $item
     * @param  array  $args
     * @param  int  $depth
     * @return string
     */
    public function renderCustomMenuItem($title, $item, $args, $depth)
    {
        $item_type = get_post_meta($item->ID, '_menu_item_jankx_type', true);

        if (empty($item_type) || !isset($this->menuItemTypes[$item_type])) {
            return $title;
        }

        $menu_item = $this->menuItemTypes[$item_type];

        if (method_exists($this, $menu_item['callback'])) {
            return call_user_func($menu_item['callback'], $item, $args, $depth);
        }

        return $title;
    }

    /**
     * Render hamburger menu item
     *
     * @param  object  $item
     * @param  array  $args
     * @param  int  $depth
     * @return string
     */
    public function renderHamburgerMenuItem($item, $args, $depth)
    {
        $icon = $this->config['menu_items']['hamburger']['icon'];
        $class = $this->config['menu_items']['hamburger']['class'];

        return sprintf(
            '<span class="%s" data-toggle="slideout-menu" aria-label="Toggle mobile menu">%s</span>',
            esc_attr($class),
            $icon
        );
    }

    /**
     * Render search menu item
     *
     * @param  object  $item
     * @param  array  $args
     * @param  int  $depth
     * @return string
     */
    public function renderSearchMenuItem($item, $args, $depth)
    {
        $icon = $this->config['menu_items']['search']['icon'];
        $class = $this->config['menu_items']['search']['class'];

        return sprintf(
            '<span class="%s" data-toggle="search" aria-label="Open search">%s</span>',
            esc_attr($class),
            $icon
        );
    }

    /**
     * Render cart menu item
     *
     * @param  object  $item
     * @param  array  $args
     * @param  int  $depth
     * @return string
     */
    public function renderCartMenuItem($item, $args, $depth)
    {
        $icon = $this->config['menu_items']['cart']['icon'];
        $class = $this->config['menu_items']['cart']['class'];

        return sprintf(
            '<span class="%s" data-toggle="cart" aria-label="View cart">%s</span>',
            esc_attr($class),
            $icon
        );
    }

    /**
     * Render user menu item
     *
     * @param  object  $item
     * @param  array  $args
     * @param  int  $depth
     * @return string
     */
    public function renderUserMenuItem($item, $args, $depth)
    {
        $icon = $this->config['menu_items']['user']['icon'];
        $class = $this->config['menu_items']['user']['class'];

        return sprintf(
            '<span class="%s" data-toggle="user-menu" aria-label="User menu">%s</span>',
            esc_attr($class),
            $icon
        );
    }

    /**
     * Enqueue admin assets
     *
     * @return void
     */
    public function enqueueAdminAssets()
    {
        $screen = get_current_screen();

        if ($screen && $screen->id === 'nav-menus') {
            wp_enqueue_style(
                'jankx-menu-items-admin',
                get_template_directory_uri() . '/assets/css/jankx-menu-items-admin.css',
                [],
                '2.0.0'
            );

            wp_enqueue_script(
                'jankx-menu-items-admin',
                get_template_directory_uri() . '/assets/js/jankx-menu-items-admin.js',
                ['jquery'],
                '2.0.0',
                true
            );

            wp_localize_script('jankx-menu-items-admin', 'jankxMenuItems', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('jankx-menu-items-nonce'),
            ]);
        }
    }

    /**
     * Get configuration
     *
     * @return array
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * Update configuration
     *
     * @param  array  $config
     * @return void
     */
    public function updateConfig(array $config)
    {
        $this->config = array_merge($this->config, $config);
        $this->registerMenuItemTypes();
    }
}
