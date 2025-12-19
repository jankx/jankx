import { jsx as _jsx } from "react/jsx-runtime";
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
const Save = ({ attributes }) => {
    const { isHeader, isFooter } = attributes;
    const TagName = isHeader ? 'thead' : isFooter ? 'tfoot' : 'tbody';
    const blockProps = useBlockProps.save({
        className: [
            'wp-block-jankx-table-row',
            isHeader && 'is-header',
            isFooter && 'is-footer',
        ]
            .filter(Boolean)
            .join(' '),
    });
    return (_jsx(TagName, { children: _jsx("tr", { ...blockProps, children: _jsx(InnerBlocks.Content, {}) }) }));
};
export default Save;
