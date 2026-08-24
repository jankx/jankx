import { jsx as _jsx } from "react/jsx-runtime";
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
export default function Save({ attributes }) {
    const blockProps = useBlockProps.save({
        ...(attributes.imageRatio && { 'data-image-ratio': attributes.imageRatio }),
        ...(attributes.thumbnailPosition && { 'data-thumbnail-position': attributes.thumbnailPosition }),
    });
    return (_jsx("div", { ...blockProps, children: _jsx(InnerBlocks.Content, {}) }));
}
