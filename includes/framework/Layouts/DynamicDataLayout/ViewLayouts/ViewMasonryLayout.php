<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

class ViewMasonryLayout extends AbstractViewLayout
{
    protected $name = 'masonry';
    protected $title = 'Masonry Layout';
    protected $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7v5H3z"/><path d="M14 3h7v9h-7z"/><path d="M14 16h7v5h-7z"/><path d="M3 12h7v9H3z"/></svg>';

    public function supportsColumns(): bool
    {
        return true;
    }

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
