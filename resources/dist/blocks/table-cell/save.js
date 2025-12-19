import { jsx as _jsx } from "react/jsx-runtime";
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
const Save = ({ attributes }) => {
    const { isHeaderCell, colspan, rowspan, verticalAlignment } = attributes;
    const TagName = isHeaderCell ? 'th' : 'td';
    const blockProps = useBlockProps.save({
        className: [
            'wp-block-jankx-table-cell',
            isHeaderCell && 'is-header-cell',
            `vertical-align-${verticalAlignment}`,
        ]
            .filter(Boolean)
            .join(' '),
        style: {
            verticalAlign: verticalAlignment,
        },
        colSpan: colspan > 1 ? colspan : undefined,
        rowSpan: rowspan > 1 ? rowspan : undefined,
    });
    return (_jsx(TagName, { ...blockProps, children: _jsx("div", { className: "wp-block-jankx-table-cell__content", children: _jsx(InnerBlocks.Content, {}) }) }));
};
export default Save;
