<?php
namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class AuthorBoxBlock extends Block
{
    protected $blockId = 'jankx/author-box';

    public function render($attributes, $content = '', $block = null)
    {
        // Get block attributes with defaults
        $author_id = $attributes['authorId'] ?? 0;
        $show_avatar = $attributes['showAvatar'] ?? true;
        $avatar_size = $attributes['avatarSize'] ?? 80;
        $show_bio = $attributes['showBio'] ?? true;
        $show_social = $attributes['showSocial'] ?? true;
        $show_posts = $attributes['showPosts'] ?? false;
        $posts_count = $attributes['postsCount'] ?? 3;
        $layout = $attributes['layout'] ?? 'horizontal';

        // Get author ID
        if ($author_id === 0) {
            // Try to get post author first
            $post_author = \get_the_author_meta('ID');

            if ($post_author) {
                $author_id = $post_author;
            } else {
                // If no post author (template editor or no post), use current user
                $current_user = \get_current_user_id();
                if ($current_user) {
                    $author_id = $current_user;
                }
            }
        }

        if (!$author_id) {
            // Fallback: try to get any admin user for preview
            $users = \get_users(['role' => 'administrator', 'number' => 1]);
            if (!empty($users)) {
                $author_id = $users[0]->ID;
            } else {
                return '<p>' . \__('No author found', 'jankx') . '</p>';
            }
        }

        // Get author data
        $author = \get_userdata($author_id);
        if (!$author) {
            return '<p>' . \__('Author not found', 'jankx') . '</p>';
        }

        // Build CSS classes
        $classes = ['wp-block-jankx-author-box'];
        $classes[] = 'layout-' . \sanitize_html_class($layout);

        // Get WordPress block wrapper attributes (includes spacing, colors, background, etc.)
        $block_wrapper_attrs = \get_block_wrapper_attributes([
            'class' => implode(' ', $classes)
        ]);

        ob_start();
        ?>
        <div <?php echo $block_wrapper_attrs; ?>>
            <?php if ($show_avatar) : ?>
                <div class="author-avatar">
                    <?php echo \get_avatar($author_id, $avatar_size, '', $author->display_name); ?>
                </div>
            <?php endif; ?>

            <div class="author-info">
                <h3 class="author-name">
                    <a href="<?php echo \esc_url(\get_author_posts_url($author_id)); ?>">
                        <?php echo \esc_html($author->display_name); ?>
                    </a>
                </h3>

                <?php if ($show_bio && !empty($author->description)) : ?>
                    <div class="author-bio">
                        <?php echo \wp_kses_post($author->description); ?>
                    </div>
                <?php endif; ?>

                <?php if ($show_social) : ?>
                    <div class="author-social">
                        <?php echo $this->renderSocialLinks($author_id); ?>
                    </div>
                <?php endif; ?>

                <?php if ($show_posts) : ?>
                    <div class="author-posts">
                        <h4 class="posts-title"><?php \_e('Recent Posts', 'jankx'); ?></h4>
                        <?php echo $this->renderRecentPosts($author_id, $posts_count); ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    private function renderSocialLinks($author_id)
    {
        $social_links = [];

        // Get social links from user meta
        $facebook = get_user_meta($author_id, 'facebook', true);
        $twitter = get_user_meta($author_id, 'twitter', true);
        $instagram = get_user_meta($author_id, 'instagram', true);
        $linkedin = get_user_meta($author_id, 'linkedin', true);
        $youtube = get_user_meta($author_id, 'youtube', true);
        $website = get_user_meta($author_id, 'user_url', true);

        if ($facebook) {
            $social_links[] = [
                'url' => $facebook,
                'icon' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
                'label' => 'Facebook'
            ];
        }

        if ($twitter) {
            $social_links[] = [
                'url' => $twitter,
                'icon' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
                'label' => 'Twitter'
            ];
        }

        if ($instagram) {
            $social_links[] = [
                'url' => $instagram,
                'icon' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.875-1.418-2.026-1.418-3.323s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244z"/></svg>',
                'label' => 'Instagram'
            ];
        }

        if ($linkedin) {
            $social_links[] = [
                'url' => $linkedin,
                'icon' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
                'label' => 'LinkedIn'
            ];
        }

        if ($youtube) {
            $social_links[] = [
                'url' => $youtube,
                'icon' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
                'label' => 'YouTube'
            ];
        }

        if ($website) {
            $social_links[] = [
                'url' => $website,
                'icon' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
                'label' => 'Website'
            ];
        }

        $output = '';
        foreach ($social_links as $link) {
            $output .= sprintf(
                '<a href="%s" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="%s">%s</a>',
                \esc_url($link['url']),
                \esc_attr($link['label']),
                $link['icon']
            );
        }

        return $output;
    }

    private function renderRecentPosts($author_id, $posts_count)
    {
        $posts = \get_posts([
            'author' => $author_id,
            'numberposts' => $posts_count,
            'post_status' => 'publish'
        ]);

        if (empty($posts)) {
            return '<p>' . \__('No posts found', 'jankx') . '</p>';
        }

        $output = '<ul class="posts-list">';
        foreach ($posts as $post) {
            $output .= sprintf(
                '<li><a href="%s">%s</a></li>',
                \esc_url(\get_permalink($post->ID)),
                \esc_html($post->post_title)
            );
        }
        $output .= '</ul>';

        return $output;
    }
}