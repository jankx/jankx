<?php

namespace Jankx\Layouts\ContentLayout;

use Jankx\Layouts\ContentLayout\Contracts\ContentLayoutContract;

class ContentLayoutManager
{
    protected static $instance;
    protected $layouts = [];

    public static function getInstance()
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function register($layout)
    {
        if (is_array($layout)) {
            $layout = new GenericContentLayout($layout);
        }

        if ($layout instanceof ContentLayoutContract) {
            $this->layouts[$layout->getName()] = $layout;
        }
    }

    public function get($name)
    {
        return $this->layouts[$name] ?? null;
    }

    public function all()
    {
        return $this->layouts;
    }

    public function getForJs()
    {
        $data = [];
        foreach ($this->layouts as $layout) {
            $data[] = $layout->toArray();
        }
        return $data;
    }
}
