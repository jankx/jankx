<?php

namespace Jankx\Layouts\DynamicDataLayout\BlockLayouts;

use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayout;

class HorizontalLayout extends BlockTemplateLayout
{
    protected $name = 'horizontal';
    protected $title = 'Horizontal Layout';

    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        $options = $this->getOptions();
        $showFeaturedImage = (bool) ($options['showFeaturedImage'] ?? true);
        $showTitle = (bool) ($options['showTitle'] ?? true);
        $showExcerpt = (bool) ($options['showExcerpt'] ?? false);
        $showDate = (bool) ($options['showDate'] ?? true);
        $showAuthor = (bool) ($options['showAuthor'] ?? false);
        $imageSize = $options['imageSize'] ?? 'medium';
        $excerptLength = (int) ($options['excerptLength'] ?? 55);
        $itemWidth = $options['itemWidth'] ?? '300px';
        $itemGap = $options['itemGap'] ?? '16px';
        $scrollSnap = (bool) ($options['scrollSnap'] ?? true);
        $showScrollbar = (bool) ($options['showScrollbar'] ?? true);

        $containerClasses = [
            'wp-block-jankx-horizontal-layout',
            'horizontal-scroll-container',
        ];

        if ($scrollSnap) {
            $containerClasses[] = 'scroll-snap';
        }

        if ($showScrollbar) {
            $containerClasses[] = 'show-scrollbar';
        } else {
            $containerClasses[] = 'hide-scrollbar';
        }

        ob_start();
        ?>
        <div class="<?php echo esc_attr(implode(' ', $containerClasses)); ?>" 
             style="--item-width: <?php echo esc_attr($itemWidth); ?>; --item-gap: <?php echo esc_attr($itemGap); ?>;">
            <div class="horizontal-scroll-wrapper">
                <?php
                while ($this->query->have_posts()) {
                    $this->query->the_post();
                    ?>
                    <div class="horizontal-item">
                        <?php
                        if ($showFeaturedImage && has_post_thumbnail()) {
                            ?>
                            <div class="horizontal-item-image">
                                <a href="<?php the_permalink(); ?>">
                                    <?php echo get_the_post_thumbnail(get_the_ID(), $imageSize, ['class' => 'horizontal-item-thumbnail']); ?>
                                </a>
                            </div>
                            <?php
                        }

                        if ($showTitle) {
                            ?>
                            <h3 class="horizontal-item-title">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h3>
                            <?php
                        }

                        if ($showDate || $showAuthor) {
                            ?>
                            <div class="horizontal-item-meta">
                                <?php
                                if ($showDate) {
                                    ?>
                                    <time class="horizontal-item-date" datetime="<?php echo esc_attr(get_the_date('c')); ?>">
                                        <?php echo esc_html(get_the_date()); ?>
                                    </time>
                                    <?php
                                }
                                if ($showAuthor) {
                                    ?>
                                    <span class="horizontal-item-author">
                                        <?php echo esc_html(get_the_author()); ?>
                                    </span>
                                    <?php
                                }
                                ?>
                            </div>
                            <?php
                        }

                        if ($showExcerpt) {
                            ?>
                            <div class="horizontal-item-excerpt">
                                <?php
                                if ($excerptLength > 0) {
                                    add_filter('excerpt_length', function() use ($excerptLength) {
                                        return $excerptLength;
                                    }, 999);
                                }
                                the_excerpt();
                                if ($excerptLength > 0) {
                                    remove_all_filters('excerpt_length', 999);
                                }
                                ?>
                            </div>
                            <?php
                        }
                        ?>
                    </div>
                    <?php
                }
                wp_reset_postdata();
                ?>
            </div>
            
            <?php if ($showScrollbar) { ?>
            <div class="horizontal-scroll-indicator">
                <div class="scroll-progress"></div>
            </div>
            <?php } ?>
        </div>
        <?php

        return (string) ob_get_clean();
    }

    public function renderPreview(): array
    {
        return [
            'name' => $this->name,
            'title' => $this->title,
            'description' => 'Horizontal scrollable layout with customizable item width and gap',
            'preview' => $this->generatePreviewContent(),
            'options' => [
                'showFeaturedImage' => [
                    'type' => 'boolean',
                    'default' => true,
                    'label' => 'Show Featured Image'
                ],
                'showTitle' => [
                    'type' => 'boolean',
                    'default' => true,
                    'label' => 'Show Title'
                ],
                'showExcerpt' => [
                    'type' => 'boolean',
                    'default' => false,
                    'label' => 'Show Excerpt'
                ],
                'showDate' => [
                    'type' => 'boolean',
                    'default' => true,
                    'label' => 'Show Date'
                ],
                'showAuthor' => [
                    'type' => 'boolean',
                    'default' => false,
                    'label' => 'Show Author'
                ],
                'imageSize' => [
                    'type' => 'select',
                    'default' => 'medium',
                    'label' => 'Image Size',
                    'options' => [
                        'thumbnail' => 'Thumbnail',
                        'medium' => 'Medium',
                        'large' => 'Large',
                        'full' => 'Full Size'
                    ]
                ],
                'excerptLength' => [
                    'type' => 'number',
                    'default' => 55,
                    'label' => 'Excerpt Length'
                ],
                'itemWidth' => [
                    'type' => 'text',
                    'default' => '300px',
                    'label' => 'Item Width (CSS value)'
                ],
                'itemGap' => [
                    'type' => 'text',
                    'default' => '16px',
                    'label' => 'Item Gap (CSS value)'
                ],
                'scrollSnap' => [
                    'type' => 'boolean',
                    'default' => true,
                    'label' => 'Enable Scroll Snap'
                ],
                'showScrollbar' => [
                    'type' => 'boolean',
                    'default' => true,
                    'label' => 'Show Scrollbar'
                ]
            ]
        ];
    }

    protected function generatePreviewContent(): string
    {
        ob_start();
        ?>
        <div class="wp-block-jankx-horizontal-layout horizontal-scroll-container scroll-snap show-scrollbar" 
             style="--item-width: 300px; --item-gap: 16px;">
            <div class="horizontal-scroll-wrapper">
                <div class="horizontal-item">
                    <div class="horizontal-item-image">
                        <img src="https://via.placeholder.com/300x200" alt="Sample Image" class="horizontal-item-thumbnail">
                    </div>
                    <h3 class="horizontal-item-title">Sample Title 1</h3>
                    <div class="horizontal-item-meta">
                        <time class="horizontal-item-date" datetime="2024-01-01">January 1, 2024</time>
                    </div>
                </div>
                <div class="horizontal-item">
                    <div class="horizontal-item-image">
                        <img src="https://via.placeholder.com/300x200" alt="Sample Image" class="horizontal-item-thumbnail">
                    </div>
                    <h3 class="horizontal-item-title">Sample Title 2</h3>
                    <div class="horizontal-item-meta">
                        <time class="horizontal-item-date" datetime="2024-01-01">January 1, 2024</time>
                    </div>
                </div>
                <div class="horizontal-item">
                    <div class="horizontal-item-image">
                        <img src="https://via.placeholder.com/300x200" alt="Sample Image" class="horizontal-item-thumbnail">
                    </div>
                    <h3 class="horizontal-item-title">Sample Title 3</h3>
                    <div class="horizontal-item-meta">
                        <time class="horizontal-item-date" datetime="2024-01-01">January 1, 2024</time>
                    </div>
                </div>
            </div>
            <div class="horizontal-scroll-indicator">
                <div class="scroll-progress"></div>
            </div>
        </div>
        <?php
        return (string) ob_get_clean();
    }
}
