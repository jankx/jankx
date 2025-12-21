<?php
/**
 * Menu Builder Widget
 * 
 * @package App\MenuBuilder\Widget
 * @since 1.0.0
 */

namespace App\MenuBuilder\Widget;

use WP_Widget;
use App\MenuBuilder\Renderer\MenuRenderer;

class MenuWidget extends WP_Widget
{
    /**
     * Menu renderer
     */
    protected $menuRenderer;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct(
            'jankx_menu_builder_widget',
            __('JankX Menu Builder', 'jankx'),
            [
                'description' => __('Display a responsive menu built with JankX Menu Builder', 'jankx'),
                'customize_selective_refresh' => true,
            ]
        );

        // Get menu renderer from service container
        if (function_exists('app') && is_callable('app')) {
            $this->menuRenderer = app()->get(MenuRenderer::class);
        } else {
            // Fallback for when service container is not available
            $this->menuRenderer = new MenuRenderer(
                new \App\MenuBuilder\Database\MenuRepository(),
                new \App\MenuBuilder\Database\MenuItemRepository(),
                new \App\MenuBuilder\Assets\AssetManager()
            );
        }
    }

    /**
     * Frontend display
     */
    public function widget($args, $instance)
    {
        echo $args['before_widget'];

        if (!empty($instance['title'])) {
            echo $args['before_title'] . apply_filters('widget_title', $instance['title']) . $args['after_title'];
        }

        // Get menu attributes
        $attributes = [
            'menuId' => $instance['menu_id'] ?? '',
            'menuClass' => $instance['menu_class'] ?? 'jankx-responsive-menu widget-menu',
            'mobileBreakpoint' => intval($instance['mobile_breakpoint'] ?? 768),
            'desktopBreakpoint' => intval($instance['desktop_breakpoint'] ?? 1024),
            'enableMobileMenu' => ($instance['enable_mobile_menu'] ?? 'true') === 'true',
            'enableDesktopMenu' => ($instance['enable_desktop_menu'] ?? 'true') === 'true',
        ];

        // Add mobile menu options
        if (!empty($instance['mobile_menu_options'])) {
            $attributes['mobileMenuOptions'] = json_decode($instance['mobile_menu_options'], true) ?: [];
        }

        // Add desktop menu options
        if (!empty($instance['desktop_menu_options'])) {
            $attributes['desktopMenuOptions'] = json_decode($instance['desktop_menu_options'], true) ?: [];
        }

        // Add submenu types
        if (!empty($instance['submenu_types'])) {
            $attributes['submenuTypes'] = json_decode($instance['submenu_types'], true) ?: [];
        }

        // Render menu
        echo $this->menuRenderer->renderBlock($attributes, '');

        echo $args['after_widget'];
    }

    /**
     * Backend form
     */
    public function form($instance)
    {
        $title = !empty($instance['title']) ? $instance['title'] : __('Menu', 'jankx');
        $menuId = !empty($instance['menu_id']) ? $instance['menu_id'] : '';
        $menuClass = !empty($instance['menu_class']) ? $instance['menu_class'] : 'jankx-responsive-menu widget-menu';
        $mobileBreakpoint = !empty($instance['mobile_breakpoint']) ? $instance['mobile_breakpoint'] : 768;
        $desktopBreakpoint = !empty($instance['desktop_breakpoint']) ? $instance['desktop_breakpoint'] : 1024;
        $enableMobileMenu = !empty($instance['enable_mobile_menu']) ? $instance['enable_mobile_menu'] : 'true';
        $enableDesktopMenu = !empty($instance['enable_desktop_menu']) ? $instance['enable_desktop_menu'] : 'true';

        // Get all available menus
        $menus = $this->menuRenderer->getAllMenus();
        ?>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('title')); ?>">
                <?php esc_attr_e('Title:', 'jankx'); ?>
            </label>
            <input 
                class="widefat" 
                id="<?php echo esc_attr($this->get_field_id('title')); ?>" 
                name="<?php echo esc_attr($this->get_field_name('title')); ?>" 
                type="text" 
                value="<?php echo esc_attr($title); ?>"
            >
        </p>

        <p>
            <label for="<?php echo esc_attr($this->get_field_id('menu_id')); ?>">
                <?php esc_attr_e('Select Menu:', 'jankx'); ?>
            </label>
            <select 
                class="widefat" 
                id="<?php echo esc_attr($this->get_field_id('menu_id')); ?>" 
                name="<?php echo esc_attr($this->get_field_name('menu_id')); ?>"
            >
                <option value=""><?php esc_html_e('— Select a menu —', 'jankx'); ?></option>
                <?php foreach ($menus as $menu): ?>
                    <option 
                        value="<?php echo esc_attr($menu->id); ?>" 
                        <?php selected($menuId, $menu->id); ?>
                    >
                        <?php echo esc_html($menu->name); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </p>

        <p>
            <label for="<?php echo esc_attr($this->get_field_id('menu_class')); ?>">
                <?php esc_attr_e('Menu CSS Class:', 'jankx'); ?>
            </label>
            <input 
                class="widefat" 
                id="<?php echo esc_attr($this->get_field_id('menu_class')); ?>" 
                name="<?php echo esc_attr($this->get_field_name('menu_class')); ?>" 
                type="text" 
                value="<?php echo esc_attr($menuClass); ?>"
            >
        </p>

        <p>
            <label for="<?php echo esc_attr($this->get_field_id('mobile_breakpoint')); ?>">
                <?php esc_attr_e('Mobile Breakpoint (px):', 'jankx'); ?>
            </label>
            <input 
                class="widefat" 
                id="<?php echo esc_attr($this->get_field_id('mobile_breakpoint')); ?>" 
                name="<?php echo esc_attr($this->get_field_name('mobile_breakpoint')); ?>" 
                type="number" 
                value="<?php echo esc_attr($mobileBreakpoint); ?>"
                min="320"
                max="1200"
            >
        </p>

        <p>
            <label for="<?php echo esc_attr($this->get_field_id('desktop_breakpoint')); ?>">
                <?php esc_attr_e('Desktop Breakpoint (px):', 'jankx'); ?>
            </label>
            <input 
                class="widefat" 
                id="<?php echo esc_attr($this->get_field_id('desktop_breakpoint')); ?>" 
                name="<?php echo esc_attr($this->get_field_name('desktop_breakpoint')); ?>" 
                type="number" 
                value="<?php echo esc_attr($desktopBreakpoint); ?>"
                min="768"
                max="1920"
            >
        </p>

        <p>
            <label for="<?php echo esc_attr($this->get_field_id('enable_mobile_menu')); ?>">
                <?php esc_attr_e('Enable Mobile Menu:', 'jankx'); ?>
            </label>
            <select 
                class="widefat" 
                id="<?php echo esc_attr($this->get_field_id('enable_mobile_menu')); ?>" 
                name="<?php echo esc_attr($this->get_field_name('enable_mobile_menu')); ?>"
            >
                <option value="true" <?php selected($enableMobileMenu, 'true'); ?>>
                    <?php esc_html_e('Yes', 'jankx'); ?>
                </option>
                <option value="false" <?php selected($enableMobileMenu, 'false'); ?>>
                    <?php esc_html_e('No', 'jankx'); ?>
                </option>
            </select>
        </p>

        <p>
            <label for="<?php echo esc_attr($this->get_field_id('enable_desktop_menu')); ?>">
                <?php esc_attr_e('Enable Desktop Menu:', 'jankx'); ?>
            </label>
            <select 
                class="widefat" 
                id="<?php echo esc_attr($this->get_field_id('enable_desktop_menu')); ?>" 
                name="<?php echo esc_attr($this->get_field_name('enable_desktop_menu')); ?>"
            >
                <option value="true" <?php selected($enableDesktopMenu, 'true'); ?>>
                    <?php esc_html_e('Yes', 'jankx'); ?>
                </option>
                <option value="false" <?php selected($enableDesktopMenu, 'false'); ?>>
                    <?php esc_html_e('No', 'jankx'); ?>
                </option>
            </select>
        </p>

        <?php
    }

    /**
     * Save widget settings
     */
    public function update($new_instance, $old_instance)
    {
        $instance = [];
        
        $instance['title'] = (!empty($new_instance['title'])) ? sanitize_text_field($new_instance['title']) : '';
        $instance['menu_id'] = (!empty($new_instance['menu_id'])) ? sanitize_text_field($new_instance['menu_id']) : '';
        $instance['menu_class'] = (!empty($new_instance['menu_class'])) ? sanitize_text_field($new_instance['menu_class']) : '';
        $instance['mobile_breakpoint'] = (!empty($new_instance['mobile_breakpoint'])) ? absint($new_instance['mobile_breakpoint']) : 768;
        $instance['desktop_breakpoint'] = (!empty($new_instance['desktop_breakpoint'])) ? absint($new_instance['desktop_breakpoint']) : 1024;
        $instance['enable_mobile_menu'] = (!empty($new_instance['enable_mobile_menu'])) ? sanitize_text_field($new_instance['enable_mobile_menu']) : 'true';
        $instance['enable_desktop_menu'] = (!empty($new_instance['enable_desktop_menu'])) ? sanitize_text_field($new_instance['enable_desktop_menu']) : 'true';

        return $instance;
    }
}
