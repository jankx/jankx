<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

class ViewHorizontalLayout extends AbstractViewLayout
{
    protected $name = 'horizontal';
    protected $title = 'Horizontal Layout';

    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        $itemWidth = $this->getOption('itemWidth', '300px');
        $itemGap = $this->getOption('itemGap', '16px');
        $scrollSnap = (bool) $this->getOption('scrollSnap', true);
        $showScrollbar = (bool) $this->getOption('showScrollbar', true);

        $containerClasses = [
            'wp-block-jankx-view-horizontal-layout',
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
                    echo '<div class="horizontal-item">';
                    echo $this->renderViewItem();
                    echo '</div>';
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
        <div class="wp-block-jankx-view-horizontal-layout horizontal-scroll-container scroll-snap show-scrollbar" 
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
