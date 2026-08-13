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
        $greeting = $attributes['greetingText'] ?? __('Xin chào,', 'jankx');

        $menu_items = [
            'logout' => [
                'label' => __('Logout', 'jankx'),
                'url' => wp_logout_url(home_url()),
                'icon' => 'dashicons-logout',
            ],
        ];

        $menu_items = apply_filters('jankx/user_menu/items', $menu_items, $current_user);

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => 'jankx-user-menu logged-in',
        ]);

        $output = sprintf('<div %s>', $wrapper_attributes);
        
        $output .= '<div class="user-menu-trigger">';
        
        if ($show_name) {
            $output .= '<span class="user-greeting">';
            if ($greeting) {
                $output .= sprintf('<span class="greeting-text">%s</span>', esc_html($greeting));
            }
            $output .= sprintf('<span class="user-name">%s</span>', esc_html($current_user->display_name));
            $output .= '</span>';
        }

        $output .= sprintf(
            '<div class="user-avatar" style="width:%dpx; height:%dpx;">%s</div>',
            $avatar_size,
            $avatar_size,
            get_avatar($current_user->ID, $avatar_size)
        );
        $output .= '</div>';

        // Dropdown Menu
        $output .= '<div class="user-menu-dropdown">';
        $output .= '<ul>';
        foreach ($menu_items as $id => $item) {
            $output .= sprintf(
                '<li><a href="%s">%s</a></li>',
                esc_url($item['url']),
                esc_html($item['label'])
            );
        }
        $output .= '</ul>';
        $output .= '</div>';

        $output .= '<script>
            (function() {
                var triggers = document.querySelectorAll(".user-menu-trigger");
                triggers.forEach(function(trigger) {
                    trigger.addEventListener("click", function(e) {
                        e.stopPropagation();
                        var dropdown = this.nextElementSibling;
                        if (dropdown && dropdown.classList.contains("user-menu-dropdown")) {
                            dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
                        }
                    });
                });
                document.addEventListener("click", function() {
                    document.querySelectorAll(".user-menu-dropdown").forEach(function(d) {
                        d.style.display = "none";
                    });
                });
            })();
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

        $output = sprintf('<div %s>', $wrapper_attributes);

        if ($show_login) {
            $output .= sprintf(
                '<a href="%s" class="login-link">%s</a>',
                wp_login_url(),
                __('Đăng nhập', 'jankx')
            );
        }

        if ($show_register && get_option('users_can_register')) {
            $output .= sprintf(
                '<a href="%s" class="register-button">%s</a>',
                wp_registration_url(),
                __('Đăng ký', 'jankx')
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

    /**
     * Get My Account page URL for a sub-page
     */
    protected function getMyAccountUrl(string $subPage = ''): string
    {
        $pageId = get_option('jankx_my_account_page_id', 0);
        if (!$pageId) {
            return '';
        }

        $url = get_permalink($pageId);
        if (!$url) {
            return '';
        }

        if ($subPage) {
            $url = rtrim($url, '/') . '/' . $subPage . '/';
        }

        return $url;
    }
}
