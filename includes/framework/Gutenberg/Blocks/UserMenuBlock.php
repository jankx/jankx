<?php
/**
 * User Menu Block
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 2.0.0
 */

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class UserMenuBlock extends Block
{
    /**
     * Block ID.
     *
     * @var string
     */
    protected $blockId = 'jankx/user-menu';

    /**
     * Render the block on the frontend.
     *
     * @param array $attributes Block attributes.
     * @param string $content Inner block content.
     * @param \WP_Block|null $block Block instance.
     *
     * @return string
     */
    public function render($attributes, $content = '', $block = null)
    {
        if (is_user_logged_in()) {
            return $this->renderLoggedInMode($attributes);
        }

        return $this->renderLoggedOutMode($attributes);
    }

    /**
     * Render for logged in users
     */
    protected function renderLoggedInMode($attributes)
    {
        $current_user = wp_get_current_user();
        $avatar_size = $attributes['avatarSize'] ?? 35;
        $show_name = $attributes['showUserName'] ?? false;
        $greeting = $attributes['greetingText'] ?? __('Hello,', 'jankx');

        $menu_items = [
            'profile' => [
                'label' => __('Profile', 'jankx'),
                'url' => admin_url('profile.php'),
                'icon' => 'dashicons-admin-users',
            ],
            'logout' => [
                'label' => __('Logout', 'jankx'),
                'url' => wp_logout_url(home_url()),
                'icon' => 'dashicons-logout',
            ],
        ];

        // Apply filters to allow adding items
        $menu_items = apply_filters('jankx/user_menu/items', $menu_items, $current_user);

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => 'jankx-user-menu logged-in',
        ]);

        $output = sprintf('<div %s>', $wrapper_attributes);
        
        $output .= '<div class="user-menu-trigger" style="display:flex; align-items:center; cursor:pointer; gap:10px;">';
        
        if ($show_name) {
            $output .= sprintf(
                '<span class="user-greeting" style="font-size:13px; opacity:0.8;">%s <strong>%s</strong></span>',
                esc_html($greeting),
                esc_html($current_user->display_name)
            );
        }

        $output .= sprintf(
            '<div class="user-avatar" style="border-radius:50%%; overflow:hidden; width:%dpx; height:%dpx; border:2px solid rgba(255,255,255,0.1);">%s</div>',
            $avatar_size,
            $avatar_size,
            get_avatar($current_user->ID, $avatar_size)
        );
        $output .= '</div>';

        // Dropdown Menu
        $output .= '<div class="user-menu-dropdown" style="display:none; position:absolute; right:0; top:100%%; background:#FFF; box-shadow:0 4px 15px rgba(0,0,0,0.1); border-radius:8px; padding:10px; min-width:180px; z-index:100; margin-top:10px;">';
        $output .= '<ul style="list-style:none; margin:0; padding:0;">';
        foreach ($menu_items as $id => $item) {
            $output .= sprintf(
                '<li style="margin-bottom:5px;"><a href="%s" style="display:block; padding:8px 12px; color:#333; text-decoration:none; font-size:14px; border-radius:4px; transition:background 0.2s;" onmouseover="this.style.background=\'#f5f5f5\'" onmouseout="this.style.background=\'transparent\'">%s</a></li>',
                esc_url($item['url']),
                esc_html($item['label'])
            );
        }
        $output .= '</ul>';
        $output .= '</div>';

        // Simple inline JS for dropdown toggle (temporary until handled by block JS)
        $output .= '<script>
            document.querySelector(".user-menu-trigger").addEventListener("click", function(e) { e.stopPropagation(); const d = this.nextElementSibling; d.style.display = d.style.display === "none" ? "block" : "none"; });
            document.addEventListener("click", function() { const d = document.querySelector(".user-menu-dropdown"); if(d) d.style.display = "none"; });
        </script>';

        $output .= '</div>';

        return $output;
    }

    /**
     * Render for logged out users
     */
    protected function renderLoggedOutMode($attributes)
    {
        $show_login = $attributes['showLogin'] ?? true;
        $show_register = $attributes['showRegister'] ?? true;

        if (!$show_login && !$show_register) {
            return '';
        }

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => 'jankx-user-menu logged-out',
        ]);

        $output = sprintf('<div %s style="display:flex; gap:12px; align-items:center;">', $wrapper_attributes);

        if ($show_login) {
            $output .= sprintf(
                '<a href="%s" class="login-link" style="font-size:13px; font-weight:700; color:inherit; text-decoration:none;">%s</a>',
                wp_login_url(),
                __('Login', 'jankx')
            );
        }

        if ($show_register && get_option('users_can_register')) {
            $output .= sprintf(
                '<a href="%s" class="register-button" style="background:var(--wp--preset--color--primary); color:#FFF; padding:8px 20px; border-radius:30px; font-size:12px; font-weight:800; text-decoration:none; text-transform:uppercase;">%s</a>',
                wp_registration_url(),
                __('Register', 'jankx')
            );
        }

        $output .= '</div>';

        return $output;
    }

    /**
     * Resolve post ID (required by base class)
     */
    protected function resolvePostId($block)
    {
        return get_the_ID();
    }
}
