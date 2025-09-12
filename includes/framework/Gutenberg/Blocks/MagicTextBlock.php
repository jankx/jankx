<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class MagicTextBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/magic-text';



    /**
     * Init
     */
    public function init()
    {
        // Register post meta for theme selector
        add_action('init', [$this, 'registerPostMeta']);

        // Add custom body class if a custom theme is selected
        add_filter('body_class', [$this, 'addBodyClass']);
    }

    /**
     * Register post meta for theme selector
     */
    public function registerPostMeta(): void
    {
        register_post_meta(
            '',
            'jankx_magic_text_theme_meta',
            array(
                'show_in_rest'  => true,
                'single'        => true,
                'type'          => 'string',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                },
            )
        );
    }

    /**
     * Add custom body class if a custom theme is selected
     *
     * @param array $classes Existing body classes
     * @return array Modified body classes
     */
    public function addBodyClass($classes): array
    {
        if (is_singular()) {
            $post_id = get_queried_object_id();
            $saved_theme = get_post_meta($post_id, 'jankx_magic_text_theme_meta', true);

            if ($saved_theme && $saved_theme !== 'default') {
                $classes[] = 'theme-' . sanitize_html_class($saved_theme);
            }
        }

        return $classes;
    }
}
