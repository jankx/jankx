<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

class ViewCardLayout extends AbstractViewLayout
{
    protected $name = 'card';
    protected $title = 'Card Layout';

    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        $columns = (int) $this->getOption('columns', 3);
        $columnsTablet = (int) $this->getOption('columnsTablet', 2);
        $columnsMobile = (int) $this->getOption('columnsMobile', 1);

        $hasImageRatio = false;
        $imageRatio = $this->getOption('imageRatio', '');
        $ratioStyle = '';
        if (is_string($imageRatio) && strpos($imageRatio, '/') !== false) {
            [$w, $h] = array_map('floatval', explode('/', $imageRatio, 2));
            if ($w > 0 && $h > 0) {
                $percent = ($h / $w) * 100.0;
                $ratioStyle = sprintf('--jankx-image-ratio: %.4f%%;', $percent);
                $hasImageRatio = true;
            }
        }

        $ul_classes = [
            'wp-block-jankx-dynamic-ssr-layout',
            'view-type-layout-card',
            'is-flex-container',
            'columns-' . max(1, $columns),
            'columns-tablet-' . max(1, $columnsTablet),
            'columns-mobile-' . max(1, $columnsMobile),
        ];
        if ($hasImageRatio) {
            $ul_classes[] = 'has-image-ratio';
        }

        ob_start();
        ?>
        <ul class="<?php echo esc_attr(implode(' ', $ul_classes)); ?>"
            style="<?php echo esc_attr(sprintf('--columns-desktop: %d; --columns-tablet: %d; --columns-mobile: %d; %s', $columns, $columnsTablet, $columnsMobile, $ratioStyle)); ?>">
            <?php
            while ($this->query->have_posts()) {
                $this->query->the_post();
                $li_classes = get_post_class('wp-block-view', get_the_ID());
                echo '<li class="' . esc_attr(implode(' ', array_filter(array_map('sanitize_html_class', $li_classes)))) . '">';
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
            'type' => 'card',
            'supportedOptions' => $this->getSupportedOptions(),
        ];
    }

    public function getSupportedOptions(): array
    {
        return [
            'columns',
            'columnsTablet',
            'columnsMobile',
            'postsPerPage',
            'showFeaturedImage',
            'showTitle',
            'showExcerpt',
            'showDate',
            'showAuthor',
            'excerptLength',
            'thumbnailPosition',
            'itemStyle',
        ];
    }

    public function getReadOnlyOptions(): array
    {
        return ['showTitle'];
    }
}
