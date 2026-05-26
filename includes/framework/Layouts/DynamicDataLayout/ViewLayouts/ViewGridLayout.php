<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

class ViewGridLayout extends AbstractViewLayout
{
    protected $name = 'grid';
    protected $title = 'Grid Layout';
    protected $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>';



    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        $columns = (int) $this->getOption('columns', 3);
        $columnsTablet = (int) $this->getOption('columnsTablet', 2);
        $columnsMobile = (int) $this->getOption('columnsMobile', 1);



        $ul_classes = [
            'wp-block-jankx-dynamic-ssr-layout',
            'view-type-layout-grid',
            'is-flex-container',
            'columns-' . max(1, $columns),
            'columns-tablet-' . max(1, $columnsTablet),
            'columns-mobile-' . max(1, $columnsMobile),
        ];

        ob_start();
        ?>
        <div class="<?php echo esc_attr(implode(' ', $ul_classes)); ?>"
            style="<?php echo esc_attr(sprintf('--columns-desktop: %d; --columns-tablet: %d; --columns-mobile: %d;', $columns, $columnsTablet, $columnsMobile)); ?>">
            <?php
            while ($this->query->have_posts()) {
                $this->query->the_post();
                $li_classes = get_post_class('wp-block-view', get_the_ID());
                echo '<div class="' . esc_attr(implode(' ', array_filter(array_map('sanitize_html_class', $li_classes)))) . '">';
                echo $this->renderViewItem();
                echo '</div>';
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

    public function appendClassesToWrapper(array $classes, array $options = []): array
    {
        $columns = (int) $this->getOption('columns', 3);
        $columnsTablet = (int) $this->getOption('columnsTablet', 2);
        $columnsMobile = (int) $this->getOption('columnsMobile', 1);

        // Add grid-specific classes
        $classes[] = 'view-type-layout-grid';
        $classes[] = 'is-flex-container';
        $classes[] = 'columns-' . max(1, $columns);
        $classes[] = 'columns-tablet-' . max(1, $columnsTablet);
        $classes[] = 'columns-mobile-' . max(1, $columnsMobile);



        return $classes;
    }
}
