import { jsx as _jsx } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import Edit from './edit';
import metadata from './block.json';
import './style.scss';
import './editor.scss';
registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: ({ attributes }) => {
        const { imageSize = 'cover' } = attributes;
        const blockProps = useBlockProps.save({
            className: `swiper-slide image-size-${imageSize}`,
            'data-image-size': imageSize
        });
        return (_jsx("div", { ...blockProps, children: _jsx(InnerBlocks.Content, {}) }));
    }
});
