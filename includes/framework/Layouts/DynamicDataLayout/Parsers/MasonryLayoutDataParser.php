<?php

namespace Jankx\Layouts\DynamicDataLayout\Parsers;

/**
 * Masonry Layout Data Parser
 * 
 * Prepares data for masonry-style displays.
 */
class MasonryLayoutDataParser extends DefaultLayoutDataParser
{
    /**
     * Parse masonry-specific data
     * 
     * @return array
     */
    public function parse(): array
    {
        $data = parent::parse();
        $options = $this->layout->getOptions();

        $data['columns'] = (int) ($options['columns'] ?? 3);

        return $data;
    }
}
