<?php

namespace Jankx\Layouts\DynamicDataLayout\BlockLayouts;

use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayout;

class GridLayout extends BlockTemplateLayout
{
    protected $name = 'grid';
    protected $title = 'Grid Layout';

    public function supportsColumns(): bool
    {
        return true;
    }

    public function getIcon(): string
    {
        return 'dashicons-grid-view';
    }

    /**
     * Render the grid layout using ViewService
     * 
     * @return string
     */
    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        return $this->renderView('post-layout/grid', $this->getTemplateData());
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
