<?php

namespace Jankx\Layouts\Testimonials;

class TestimonialLayoutManager
{
    protected static $instance;
    protected $layouts = [];

    public static function getInstance(): self
    {
        if (!static::$instance) {
            static::$instance = new static();
        }
        return static::$instance;
    }

    public function bootstrap(): void
    {
        $this->registerDefaultLayouts();
        do_action('jankx/testimonials/register-layouts', $this);
    }

    public function registerLayout(string $name, string $class): void
    {
        if (!class_exists($class)) {
            return;
        }
        $this->layouts[$name] = $class;
    }

    public function hasLayout(string $name): bool
    {
        return isset($this->layouts[$name]);
    }

    public function getLayoutNames(): array
    {
        return array_keys($this->layouts);
    }

    public function createLayout(string $name, array $options = []): ?TestimonialLayoutInterface
    {
        if (!$this->hasLayout($name)) {
            return null;
        }
        $class = $this->layouts[$name];
        $layout = new $class();
        if ($layout instanceof TestimonialLayoutInterface) {
            $layout->setOptions($options);
            return $layout;
        }
        return null;
    }

    protected function registerDefaultLayouts(): void
    {
        $this->registerLayout('default', DefaultTestimonialLayout::class);
    }
}

