<?php

namespace Jankx\Gutenberg\Blocks;

class TestimonialBlock extends AbstractBlock
{
    protected static $attributes = [
        'content' => [
            'type' => 'string',
            'default' => '',
        ],
        'author' => [
            'type' => 'string',
            'default' => '',
        ],
        'position' => [
            'type' => 'string',
            'default' => '',
        ],
        'company' => [
            'type' => 'string',
            'default' => '',
        ],
        'avatar' => [
            'type' => 'object',
            'default' => null,
        ],
        'rating' => [
            'type' => 'number',
            'default' => 5,
        ],
        'style' => [
            'type' => 'string',
            'default' => 'default',
        ],
        'alignment' => [
            'type' => 'string',
            'default' => 'center',
        ],
        'showAvatar' => [
            'type' => 'boolean',
            'default' => true,
        ],
        'showRating' => [
            'type' => 'boolean',
            'default' => true,
        ],
        'backgroundColor' => [
            'type' => 'string',
            'default' => '',
        ],
        'textColor' => [
            'type' => 'string',
            'default' => '',
        ],
    ];

    protected static $supports = [
        'align' => ['wide', 'full'],
        'html' => false,
        'anchor' => true,
        'customClassName' => true,
        'spacing' => [
            'margin' => true,
            'padding' => true,
        ],
        'color' => [
            'background' => true,
            'text' => true,
        ],
    ];

    public static function getBlockName()
    {
        return 'testimonial';
    }

    public static function getTitle()
    {
        return __('Testimonial', 'jankx');
    }

    public static function getDescription()
    {
        return __('Display customer testimonials with author information and ratings.', 'jankx');
    }

    public static function getCategory()
    {
        return 'jankx-blocks';
    }

    public static function getIcon()
    {
        return 'format-quote';
    }

    public static function getKeywords()
    {
        return ['testimonial', 'quote', 'review', 'customer', 'feedback'];
    }

    public static function render($attributes, $content)
    {
        $block_id = self::getBlockId($attributes);
        $class_name = self::getClassName($attributes);

        // Get attributes with defaults
        $content = self::getAttribute($attributes, 'content', '');
        $author = self::getAttribute($attributes, 'author', '');
        $position = self::getAttribute($attributes, 'position', '');
        $company = self::getAttribute($attributes, 'company', '');
        $avatar = self::getAttribute($attributes, 'avatar', null);
        $rating = self::getAttribute($attributes, 'rating', 5);
        $style = self::getAttribute($attributes, 'style', 'default');
        $alignment = self::getAttribute($attributes, 'alignment', 'center');
        $show_avatar = self::getAttribute($attributes, 'showAvatar', true);
        $show_rating = self::getAttribute($attributes, 'showRating', true);
        $background_color = self::getAttribute($attributes, 'backgroundColor', '');
        $text_color = self::getAttribute($attributes, 'textColor', '');

        // Build inline styles
        $inline_styles = [];
        if ($background_color) {
            $inline_styles[] = "background-color: {$background_color}";
        }
        if ($text_color) {
            $inline_styles[] = "color: {$text_color}";
        }
        $style_attr = !empty($inline_styles) ? ' style="' . implode('; ', $inline_styles) . '"' : '';

        // Add style and alignment classes
        $class_name .= " jankx-testimonial-style-{$style} jankx-testimonial-align-{$alignment}";

        // Get avatar URL
        $avatar_url = '';
        if ($avatar && isset($avatar['url'])) {
            $avatar_url = $avatar['url'];
        }

        // Render testimonial
        ob_start();
        ?>
        <div id="<?php echo esc_attr($block_id); ?>" class="<?php echo esc_attr($class_name); ?>"<?php echo $style_attr; ?>>
            <div class="jankx-testimonial-content">
                <?php if ($show_rating && $rating > 0): ?>
                    <div class="jankx-testimonial-rating">
                        <?php for ($i = 1; $i <= 5; $i++): ?>
                            <span class="jankx-star <?php echo $i <= $rating ? 'filled' : 'empty'; ?>">★</span>
                        <?php endfor; ?>
                    </div>
                <?php endif; ?>

                <blockquote class="jankx-testimonial-quote">
                    <?php echo wp_kses_post($content); ?>
                </blockquote>

                <?php if ($author || $position || $company): ?>
                    <div class="jankx-testimonial-author">
                        <?php if ($show_avatar && $avatar_url): ?>
                            <div class="jankx-testimonial-avatar">
                                <img src="<?php echo esc_url($avatar_url); ?>" alt="<?php echo esc_attr($author); ?>" />
                            </div>
                        <?php endif; ?>

                        <div class="jankx-testimonial-author-info">
                            <?php if ($author): ?>
                                <div class="jankx-testimonial-author-name"><?php echo esc_html($author); ?></div>
                            <?php endif; ?>

                            <?php if ($position || $company): ?>
                                <div class="jankx-testimonial-author-meta">
                                    <?php if ($position): ?>
                                        <span class="jankx-testimonial-position"><?php echo esc_html($position); ?></span>
                                    <?php endif; ?>

                                    <?php if ($position && $company): ?>
                                        <span class="jankx-testimonial-separator">, </span>
                                    <?php endif; ?>

                                    <?php if ($company): ?>
                                        <span class="jankx-testimonial-company"><?php echo esc_html($company); ?></span>
                                    <?php endif; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}