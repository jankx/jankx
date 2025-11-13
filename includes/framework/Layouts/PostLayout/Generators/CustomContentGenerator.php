<?php

namespace Jankx\Layouts\PostLayout\Generators;

use Jankx\Layouts\PostLayout\Contracts\ContentGeneratorInterface;
use WP_Query;

/**
 * Custom Content Generator
 *
 * Generator cho phép custom logic render hoàn toàn
 *
 * @package Jankx\Layouts\PostLayout\Generators
 */
class CustomContentGenerator implements ContentGeneratorInterface
{
    /**
     * Generator name
     *
     * @var string
     */
    protected $name;

    /**
     * Generator title
     *
     * @var string
     */
    protected $title;

    /**
     * Custom render callback
     *
     * @var callable
     */
    protected $renderCallback;

    /**
     * Custom preview callback
     *
     * @var callable|null
     */
    protected $previewCallback;

    /**
     * Supported options
     *
     * @var array
     */
    protected $supportedOptions = [];

    /**
     * Constructor
     *
     * @param string $name Generator name
     * @param string $title Generator title
     * @param callable $renderCallback Custom render function
     * @param callable|null $previewCallback Custom preview function
     * @param array $supportedOptions Supported options
     */
    public function __construct(
        string $name,
        string $title,
        callable $renderCallback,
        ?callable $previewCallback = null,
        array $supportedOptions = []
    ) {
        $this->name = $name;
        $this->title = $title;
        $this->renderCallback = $renderCallback;
        $this->previewCallback = $previewCallback;
        $this->supportedOptions = $supportedOptions;
    }

    /**
     * {@inheritDoc}
     */
    public function generate(WP_Query $query, array $options = []): string
    {
        return call_user_func($this->renderCallback, $query, $options);
    }

    /**
     * {@inheritDoc}
     */
    public function generatePreview(array $options = []): array
    {
        if ($this->previewCallback) {
            return call_user_func($this->previewCallback, $options);
        }

        // Default preview
        return [
            'name' => $this->name,
            'title' => $this->title,
            'type' => 'custom',
            'generator' => $this->name,
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * {@inheritDoc}
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * {@inheritDoc}
     */
    public function supportsOptions(array $options): bool
    {
        if (empty($this->supportedOptions)) {
            return true;
        }

        foreach ($options as $key => $value) {
            if (!in_array($key, $this->supportedOptions, true)) {
                return false;
            }
        }

        return true;
    }

    /**
     * {@inheritDoc}
     */
    public function wrapCarouselHtml(WP_Query $query, array $options, string $carouselHtml): string
    {
        // Custom generator doesn't need special wrapper by default, return as is
        // Can be overridden by custom callback if needed
        return $carouselHtml;
    }
}
