<?php

namespace Jankx\Layouts\PostLayout\Generators;

use Jankx\Layouts\PostLayout\Contracts\ContentGeneratorInterface;
use WP_Query;

/**
 * Default Content Generator
 *
 * Generator mặc định sử dụng logic render của PostLayout
 *
 * @package Jankx\Layouts\PostLayout\Generators
 */
class DefaultContentGenerator implements ContentGeneratorInterface
{
    /**
     * Layout instance để sử dụng logic render cũ
     *
     * @var \Jankx\Layouts\PostLayout\Contracts\PostLayoutInterface
     */
    protected $layout;

    /**
     * Constructor
     *
     * @param \Jankx\Layouts\PostLayout\Contracts\PostLayoutInterface $layout
     */
    public function __construct($layout)
    {
        $this->layout = $layout;
    }

    /**
     * {@inheritDoc}
     */
    public function generate(WP_Query $query, array $options = []): string
    {
        // Set options và query cho layout
        $this->layout->setOptions($options);
        $this->layout->setQuery($query);

        // Call renderDefault() directly - it's public
        return $this->layout->renderDefault();
    }

    /**
     * {@inheritDoc}
     */
    public function generatePreview(array $options = []): array
    {
        $this->layout->setOptions($options);
        return $this->layout->renderDefaultPreview();
    }

    /**
     * {@inheritDoc}
     */
    public function getName(): string
    {
        return 'default';
    }

    /**
     * {@inheritDoc}
     */
    public function getTitle(): string
    {
        return __('Default Generator', 'jankx');
    }

    /**
     * {@inheritDoc}
     */
    public function supportsOptions(array $options): bool
    {
        return true; // Default generator hỗ trợ tất cả options
    }
}
