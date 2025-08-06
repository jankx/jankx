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
        // Add meta box to nav-menus
        add_action('admin_head-nav-menus.php', [$this, 'addMetaBox']);

        // Setup Jankx menu items
        add_filter('wp_setup_nav_menu_item', [$this, 'setupJankxItems']);

        // Add custom fields
        add_action('wp_nav_menu_item_custom_fields', [$this, 'addCustomFields'], 10, 4);

        // Save custom fields
        add_action('wp_update_nav_menu_item', [$this, 'saveCustomFields'], 10, 3);

        // Render custom menu items
        add_filter('wp_nav_menu_item_title', [$this, 'renderCustomMenuItem'], 10, 4);
    }

    /**
     * Add meta box to nav-menus
     *
     * @return void
     */
    public function addMetaBox()
    {
        add_meta_box(
            'jankx-framework-menu-items',
            $this->config['section_title'],
            [$this, 'renderMetaBox'],
            'nav-menus',
            'side'
        );
    }

    /**
     * Render meta box content
     *
     * @return void
     */
    public function renderMetaBox()
    {
        $menuItemTypes = apply_filters('jankx/menu/item-types', $this->menuItemTypes);
        ?>
        <div id="posttype-jankx-menu-items" class="posttypediv">
            <div id="tabs-panel-jankx-menu-items" class="tabs-panel tabs-panel-active">
                <ul id="jankx-menu-items-checklist" class="categorychecklist form-no-clear">
                    <?php
                    $i = -1;
                    foreach ($menuItemTypes as $type => $item) :
                        $menuItem = $this->createMenuItem($type, $item);
                        ?>
                        <li>
                            <label class="menu-item-title">
                                <input
                                    type="checkbox"
                                    class="menu-item-checkbox"
                                    name="menu-item[<?php echo esc_attr($i); ?>][menu-item-object-id]"
                                    value="<?php echo esc_attr($i); ?>"
                                />
                                <?php echo esc_html($item['title']); ?>
                            </label>
                            <?php $this->renderMenuItemHiddenInputs($i, $menuItem); ?>
                        </li>
                        <?php
                        $i--;
                    endforeach;
                    ?>
                </ul>
            </div>
            <p class="button-controls">
                <span class="add-to-menu">
                    <button
                        type="submit"
                        class="button-secondary submit-add-to-menu right"
                        value="<?php esc_attr_e('Add to menu', 'jankx'); ?>"
                        name="add-post-type-menu-item"
                        id="submit-posttype-jankx-menu-items"
                    >
                        <?php esc_html_e('Add to menu', 'jankx'); ?>
                    </button>
                    <span class="spinner"></span>
                </span>
            </p>
        </div>
        <?php
    }

    /**
     * Create menu item data
     *
     * @param string $type
     * @param array $item
     * @return array
     */
    protected function createMenuItem($type, $item)
    {
        $menuItem = [
            'type' => $type,
            'title' => $item['title'],
            'url' => "#jankx-{$type}",
            'classes' => null
        ];

        return apply_filters("jankx_menu_item_{$type}", $menuItem, $type);
    }

    /**
     * Render hidden inputs for menu item
     *
     * @param int $index
     * @param array $item
     * @return void
     */
    protected function renderMenuItemHiddenInputs($index, $item)
    {
        foreach ($item as $type => $value) : ?>
            <?php if (is_null($value)) : ?>
                <input type="hidden"
                    class="menu-item-<?php echo $type; ?>"
                    name="menu-item[<?php echo esc_attr($index); ?>][menu-item-<?php echo $type; ?>]"
                />
            <?php else : ?>
                <input
                    type="hidden"
                    class="menu-item-<?php echo $type; ?>"
                    name="menu-item[<?php echo esc_attr($index); ?>][menu-item-<?php echo $type; ?>]"
                    value="<?php echo esc_attr($value); ?>"
                />
            <?php endif; ?>
            <?php
        endforeach;
    }

    /**
     * Setup Jankx menu items
     *
     * @param object $menuItem
     * @return object
     */
    public function setupJankxItems($menuItem)
    {
        if (isset($this->menuItemTypes[$menuItem->type])) {
            $title = $this->menuItemTypes[$menuItem->type]['title'];

            // Ensure title is string
            if (is_array($title)) {
                $title = $title[0];
            }

            $menuItem->type_label = sprintf('Jankx %s', $title);
        }

        return $menuItem;
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
            $result = call_user_func($menu_item['callback'], $item, $args, $depth);

            // Ensure we return a string
            if (is_array($result)) {
                return implode('', $result);
            }

            return (string) $result;
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
     * Get configuration
     *
     * @return array
     */
    public function getConfig()
    {
        return $this->config;
    }
}
