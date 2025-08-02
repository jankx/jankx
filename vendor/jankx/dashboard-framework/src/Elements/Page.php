<?php

namespace Jankx\Dashboard\Elements;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

use Jankx\Dashboard\Interfaces\PageInterface;
use JsonSerializable;

class Page implements PageInterface, JsonSerializable
{
    protected $title;
    protected $sections;

    public function __construct($title, $sections = [])
    {
        $this->title = $title;
        $this->sections = $sections;
    }

    public function addSection(Section $section)
    {
        $this->sections[] = $section;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function getSections()
    {
        if (!is_array($this->sections)) {
            return [];
        }
        return $this->sections;
    }



    public function jsonSerialize(): array
    {
        return [
            'title' => $this->title,
            'sections' => $this->sections,
        ];
    }
}
