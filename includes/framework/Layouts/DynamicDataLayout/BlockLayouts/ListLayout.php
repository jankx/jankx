<?php

namespace Jankx\Layouts\DynamicDataLayout\BlockLayouts;

use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayout;

class ListLayout extends BlockTemplateLayout
{
    protected $name = 'list';
    protected $title = 'List Layout';

    public function getIcon(): string
    {
        return 'dashicons-list-view';
    }

    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        return $this->renderView('post-layout/list', $this->getTemplateData());
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
