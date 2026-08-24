import { jsx as _jsx } from "react/jsx-runtime";
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
export default function Edit() {
    const blockProps = useBlockProps({
        className: 'carousel-inner-blocks-overlay',
    });
    return (_jsx("div", { ...blockProps, children: _jsx(InnerBlocks, {}) }));
}
