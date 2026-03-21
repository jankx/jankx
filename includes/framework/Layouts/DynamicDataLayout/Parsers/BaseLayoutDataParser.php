<?php

namespace Jankx\Layouts\DynamicDataLayout\Parsers;

use Jankx\Layouts\DynamicDataLayout\Contracts\LayoutDataParserInterface;
use Jankx\Layouts\DynamicDataLayout\Contracts\BlockTemplateLayoutInterface;

/**
 * Abstract Base Layout Data Parser
 * 
 * Provides basic logic for parsing layout data. Specific layouts can extend this 
 * to add custom fields or logic.
 */
abstract class BaseLayoutDataParser implements LayoutDataParserInterface
{
    /**
     * @var BlockTemplateLayoutInterface
     */
    protected $layout;

    /**
     * Constructor
     * 
     * @param BlockTemplateLayoutInterface $layout
     */
    public function __construct(BlockTemplateLayoutInterface $layout)
    {
        $this->layout = $layout;
    }

    /**
     * Get common data fields across all layouts
     * 
     * @return array
     */
    protected function getCommonData(): array
    {
        return [
            'name' => $this->layout->getName(),
            'options' => $this->layout->getOptions(),
            'layout' => $this->layout,
        ];
    }

    /**
     * Parse and return data as array (suitable for view and JSON)
     * 
     * @return array
     */
    public function parse(): array
    {
        return $this->getCommonData();
    }
}
