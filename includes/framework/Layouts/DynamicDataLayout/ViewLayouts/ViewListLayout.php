<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

class ViewListLayout extends AbstractViewLayout
{
    protected $name = 'list';
    protected $title = 'List Layout';

    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        ob_start();
        ?>
        <div class="wp-block-jankx-dynamic-ssr-layout view-type-layout-list">
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
            'type' => 'list',
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
        ];
    }

    public function getReadOnlyOptions(): array
    {
        return ['showTitle'];
    }
}
