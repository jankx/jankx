<?php

namespace Jankx\Layouts\DynamicDataLayout\Parsers;

/**
 * Default Layout Data Parser
 * 
 * Basic implementation of a data parser for most layout types.
 */
class DefaultLayoutDataParser extends BaseLayoutDataParser
{
    /**
     * Parse and return all template data
     * 
     * @return array
     */
    public function parse(): array
    {
        $data = parent::parse();

        // Add default fields for all templates
        $data['item_classes'] = method_exists($this->layout, 'buildItemClasses') 
            ? $this->layout->buildItemClasses() 
            : '';
            
        return $data;
    }
}
