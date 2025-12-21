<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

class ViewMasonryLayout extends AbstractViewLayout
{
    protected $name = 'masonry';
    protected $title = 'Masonry Layout';

    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        $columns = (int) $this->getOption('columns', 3);

        ob_start();
        ?>
        <div class="wp-block-jankx-dynamic-ssr-layout view-type-layout-masonry columns-<?php echo esc_attr(max(1, $columns)); ?>">
            <?php
            while ($this->query->have_posts()) {
                $this->query->the_post();
                echo $this->renderViewItem();
            }
            wp_reset_postdata();
            ?>
        </div>
        <?php
        return (string) ob_get_clean();
    }

    public function renderDefaultPreview(): array
    {
        return [
            'name' => $this->name,
            'title' => $this->title,
            'type' => 'masonry',
            'supportedOptions' => $this->getSupportedOptions(),
        ];
    }

    public function getSupportedOptions(): array
    {
        return [
            'columns',
            'postsPerPage',
            'showFeaturedImage',
            'showTitle',
            'showExcerpt',
            'showDate',
            'showAuthor',
            'excerptLength',
            'thumbnailPosition',
        ];
    }

    public function getReadOnlyOptions(): array
    {
        return ['showTitle'];
    }
}
