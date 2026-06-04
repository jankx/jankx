/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType, BlockConfiguration } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import { list as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';
import type { TableOfContentAttributes } from './types';

/**
 * Block configuration
 */
const blockConfig: Partial<BlockConfiguration<TableOfContentAttributes>> = {
    icon,
    edit: Edit,
    save: () => {
        return <InnerBlocks.Content />;
    },
};

/**
 * Register Table of Content block
 */
registerBlockType<TableOfContentAttributes>(metadata.name, {
    ...metadata,
    ...blockConfig,
});

