<?php

namespace Jankx\Layouts\DynamicDataLayout\BlockLayouts;

use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayout;

class MasonryLayout extends BlockTemplateLayout
{
    protected $name = 'masonry';
    protected $title = 'Masonry Layout';

    public function supportsColumns(): bool
    {
        return true;
    }

    public function getIcon(): string
    {
        return 'dashicons-layout';
    }

    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        return $this->renderView('post-layout/masonry', $this->getTemplateData());
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
