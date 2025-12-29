<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

class ViewRankingLayout extends AbstractViewLayout
{
    protected $name = 'ranking-list';
    protected $title = 'Ranking List Layout';

    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        $ul_classes = [
            'wp-block-jankx-dynamic-ssr-layout',
            'view-type-layout-list',
            'ranking-list-layout',
        ];

        ob_start();
        ?>
        <ul class="<?php echo esc_attr(implode(' ', $ul_classes)); ?>">
            <?php
            while ($this->query->have_posts()) {
                $this->query->the_post();

                $li_classes = get_post_class('wp-block-view', get_the_ID());
                $rank = (int) $this->query->current_post + 1;
                $showRankBadge = (bool) ($this->getOption('showRankBadge', true));

                $badgeClass = '';
                if ($rank === 1) {
                    $badgeClass = 'rank-badge rank-gold';
                } elseif ($rank === 2) {
                    $badgeClass = 'rank-badge rank-silver';
                } elseif ($rank === 3) {
                    $badgeClass = 'rank-badge rank-bronze';
                }

                echo '<li class="' . esc_attr(implode(' ', array_filter(array_map('sanitize_html_class', $li_classes)))) . '">';
                if ($showRankBadge) {
                    $icon = $badgeClass ? '👑' : '';
                    echo '<span class="' . esc_attr($badgeClass) . '" aria-hidden="true">' . esc_html($icon) . '</span>';
                }
                echo $this->renderViewItem();
                echo '</li>';
            }
            wp_reset_postdata();
            ?>
        </ul>
        <?php
        return (string) ob_get_clean();
    }

    public function renderDefaultPreview(): array
    {
        return [
            'name' => $this->name,
            'title' => $this->title,
            'type' => 'ranking-list',
            'supportedOptions' => $this->getSupportedOptions(),
        ];
    }

    public function getSupportedOptions(): array
    {
        return [
            'postsPerPage',
            'showFeaturedImage',
            'showTitle',
            'showExcerpt',
            'showDate',
            'showAuthor',
            'excerptLength',
            'thumbnailPosition',
            'itemStyle',
            'showRankBadge',
        ];
    }

    public function getReadOnlyOptions(): array
    {
        return ['showTitle'];
    }

    public function appendClassesToWrapper(array $classes, array $options = []): array
    {
        $classes[] = 'ranking-list-wrapper';
        return $classes;
    }
}

