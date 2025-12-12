<?php

namespace Jankx\Layouts\DynamicDataLayout\Supports;

use Jankx\Layouts\DynamicDataLayout\PostLayout;

class GridLayout extends PostLayout
{
    protected $name = 'grid';
    protected $title = 'Grid Layout';

    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        $columns = (int) $this->getOption('columns', 3);
        $columnsTablet = (int) $this->getOption('columnsTablet', 2);
        $columnsMobile = (int) $this->getOption('columnsMobile', 1);

        $wrapper_class = sprintf(
            'post-type-layout-grid wp-block-jankx-post-layout-template is-flex-container columns-%d columns-tablet-%d columns-mobile-%d',
            max(1, $columns),
            max(1, $columnsTablet),
            max(1, $columnsMobile)
        );

        ob_start();
        ?>
        <ul class="<?php echo esc_attr($wrapper_class); ?>"
            style="<?php echo esc_attr(sprintf('--columns-desktop:%d; --columns-tablet:%d; --columns-mobile:%d;', $columns, $columnsTablet, $columnsMobile)); ?>">
            <?php
            while ($this->query->have_posts()) {
                $this->query->the_post();
                echo sprintf('<li class="wp-block-post">%s</li>', $this->renderPostItem());
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
            'type' => 'grid',
            'columns' => $this->getOption('columns', 3),
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

