import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';

registerBlockType(metadata.name as any, {
    ...metadata,
    edit: Edit,
    save: () => null, // Dynamic block - rendered by PHP
} as any);
