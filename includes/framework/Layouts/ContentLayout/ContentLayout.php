<?php

namespace Jankx\Layouts\ContentLayout;

use Jankx\Layouts\ContentLayout\Contracts\ContentLayoutContract;

abstract class ContentLayout implements ContentLayoutContract
{
    protected $name;
    protected $title;
    protected $icon;
    protected $svgSkeleton;
    protected $description;
    protected $version;
    protected $template;
    protected $category;

    public function __construct($data = [])
    {
        $this->name = $data['name'] ?? '';
        $this->title = $data['title'] ?? '';
        $this->icon = $data['icon'] ?? '';
        $this->svgSkeleton = $data['svgSkeleton'] ?? '';
        $this->description = $data['description'] ?? '';
        $this->version = $data['version'] ?? '1.0.0';
        $this->template = $data['template'] ?? [];
        $this->category = $data['category'] ?? 'general';
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getIcon(): string
    {
        return $this->icon;
    }

    public function getSvgSkeleton(): string
    {
        return $this->svgSkeleton;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getVersion(): string
    {
        return $this->version;
    }

    public function getTemplate(): array
    {
        return $this->template;
    }

    public function getCategory(): string
    {
        return $this->category;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->getName(),
            'title' => $this->getTitle(),
            'icon' => $this->getIcon(),
            'svgSkeleton' => $this->getSvgSkeleton(),
            'description' => $this->getDescription(),
            'version' => $this->getVersion(),
            'template' => $this->getTemplate(),
            'category' => $this->getCategory(),
        ];
    }
}
