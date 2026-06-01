import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';
import './style.scss';

registerBlockType(metadata.name as any, {
    ...metadata,
    edit: Edit,
    save: () => null, // Dynamic block - rendered by PHP
} as any);
