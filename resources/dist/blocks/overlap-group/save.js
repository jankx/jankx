import { jsx as _jsx } from "react/jsx-runtime";
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { buildClassName, buildInlineStyle } from './attributes';
export default function Save({ attributes }) {
    const Tag = (attributes.tagName || 'div');
    const blockProps = useBlockProps.save({
        className: buildClassName(attributes),
        style: buildInlineStyle(attributes),
    });
    return (_jsx(Tag, { ...blockProps, children: _jsx(InnerBlocks.Content, {}) }));
}
