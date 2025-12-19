import { jsx as _jsx } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { buttons as icon } from '@wordpress/icons';
import { InnerBlocks } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';
/**
 * Register Smart Tabs block
 */
registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit: Edit,
    save: () => {
        // PHP sẽ render wrapper với tabType và styleType classes
        return _jsx(InnerBlocks.Content, {});
    },
});
