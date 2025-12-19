import { jsx as _jsx } from "react/jsx-runtime";
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
export default function Save() {
    const blockProps = useBlockProps.save({
        className: 'swiper-inner-blocks-overlay',
    });
    return (_jsx("div", { ...blockProps, children: _jsx(InnerBlocks.Content, {}) }));
}
