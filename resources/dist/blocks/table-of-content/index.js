import { registerBlockType } from '@wordpress/blocks';
import { list as icon } from '@wordpress/icons';
/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';
/**
 * Block configuration
 */
const blockConfig = {
    icon,
    edit: Edit,
    save: () => {
        // Rendered by PHP
        return null;
    },
};
/**
 * Register Table of Content block
 */
registerBlockType(metadata.name, {
    ...metadata,
    ...blockConfig,
});
