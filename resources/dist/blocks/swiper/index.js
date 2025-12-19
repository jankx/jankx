import { jsx as _jsx } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import Edit from './edit';
import metadata from './block.json';
import './style.scss';
import './editor.scss';
registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: () => _jsx(InnerBlocks.Content, {})
});
