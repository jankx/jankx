import { jsx as _jsx } from "react/jsx-runtime";
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
const Save = ({ attributes, }) => {
    const { hasFixedLayout } = attributes;
    const blockProps = useBlockProps.save({
        className: [
            'wp-block-jankx-master-table__wrapper',
            hasFixedLayout && 'has-fixed-layout',
        ]
            .filter(Boolean)
            .join(' '),
    });
    return (_jsx("div", { ...blockProps, children: _jsx("table", { className: "wp-block-jankx-master-table", children: _jsx(InnerBlocks.Content, {}) }) }));
};
export default Save;
