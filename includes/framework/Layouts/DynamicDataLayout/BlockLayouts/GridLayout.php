<?php

namespace Jankx\Layouts\DynamicDataLayout\BlockLayouts;

use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayout;

class GridLayout extends BlockTemplateLayout
{
    protected $name = 'grid';
    protected $title = 'Grid Layout';

    public function getIcon(): string
    {
        return 'dashicons-grid-view';
    }

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
            'post-type-layout-grid',
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
                $itemClasses = $this->buildItemClasses();
                echo '<li class="' . esc_attr($itemClasses) . '">';
                echo $this->renderPostItem();
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
        $classes[] = 'post-type-layout-grid';
        $classes[] = 'is-flex-container';
        $classes[] = 'columns-' . max(1, $columns);
        $classes[] = 'columns-tablet-' . max(1, $columnsTablet);
        $classes[] = 'columns-mobile-' . max(1, $columnsMobile);

        // Add image ratio class if set
        $imageRatio = $this->getOption('imageRatio', '');
        if (is_string($imageRatio) && strpos($imageRatio, '/') !== false) {
            [$w, $h] = array_map('floatval', explode('/', $imageRatio, 2));
            if ($w > 0 && $h > 0) {
                $classes[] = 'has-image-ratio';
            }
        }

        return $classes;
    }

    protected function getContainerStructure(array $options): array
    {
        $structure = parent::getContainerStructure($options);
        $structure['tag'] = 'ul';
        $structure['classes'][] = 'is-flex-container';
        
        // Ensure columns-tablet and columns-mobile are present in classes if defined
        if (!empty($options['columnsTablet'])) {
            $structure['classes'][] = 'columns-tablet-' . intval($options['columnsTablet']);
        }
        if (!empty($options['columnsMobile'])) {
            $structure['classes'][] = 'columns-mobile-' . intval($options['columnsMobile']);
        }
        
        return $structure;
    }

    protected function getItemWrapperStructure(array $options): array
    {
        $structure = parent::getItemWrapperStructure($options);
        $structure['tag'] = 'li';
        return $structure;
    }
}
