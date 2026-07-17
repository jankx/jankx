<?php

namespace Jankx\Layouts\DynamicDataLayout\Parsers;

/**
 * Grid Layout Data Parser
 * 
 * Prepares data specific to grid-based displays.
 */
class GridLayoutDataParser extends DefaultLayoutDataParser
{
    /**
     * Parse grid-specific data
     * 
     * @return array
     */
    public function parse(): array
    {
        $data = parent::parse();
        $options = $this->layout->getOptions();

        $columns = (int) ($options['columns'] ?? 3);
        $columnsTablet = (int) ($options['columnsTablet'] ?? 2);
        $columnsMobile = (int) ($options['columnsMobile'] ?? 1);



        $data['columns'] = $columns;
        $data['columns_tablet'] = $columnsTablet;
        $data['columns_mobile'] = $columnsMobile;

        $ulClasses = [
            'post-type-layout-grid',
            'is-flex-container',
            'columns-' . max(1, $columns),
            'columns-tablet-' . max(1, $columnsTablet),
            'columns-mobile-' . max(1, $columnsMobile),
        ];



        $data['ul_classes'] = $ulClasses;

        return $data;
    }
}
