import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, BlockControls, useInnerBlocksProps, __experimentalUseColorProps as useColorProps, __experimentalUseBorderProps as useBorderProps, } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, ToolbarGroup, ToolbarButton, } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
const Edit = ({ attributes, setAttributes, clientId }) => {
    const { isHeader, isFooter } = attributes;
    const { insertBlock } = useDispatch('core/block-editor');
    const { getBlockIndex, getBlockRootClientId } = useSelect((select) => select('core/block-editor'));
    const colorProps = useColorProps(attributes);
    const borderProps = useBorderProps(attributes);
    const TagName = isHeader ? 'thead' : isFooter ? 'tfoot' : 'tbody';
    const trProps = useBlockProps({
        className: [
            'wp-block-jankx-table-row',
            isHeader && 'is-header',
            isFooter && 'is-footer',
            colorProps.className,
            borderProps.className,
        ]
            .filter(Boolean)
            .join(' '),
        style: {
            ...colorProps.style,
            ...borderProps.style,
        },
    });
    const innerBlocksProps = useInnerBlocksProps({}, {
        allowedBlocks: ['jankx/table-cell'],
        template: [
            ['jankx/table-cell', {}],
            ['jankx/table-cell', {}],
        ],
        templateLock: false,
        renderAppender: false,
    });
    const handleInsertRowBefore = () => {
        const rootClientId = getBlockRootClientId(clientId);
        const index = getBlockIndex(clientId);
        const newBlock = createBlock('jankx/table-row', {});
        insertBlock(newBlock, index, rootClientId);
    };
    const handleInsertRowAfter = () => {
        const rootClientId = getBlockRootClientId(clientId);
        const index = getBlockIndex(clientId);
        const newBlock = createBlock('jankx/table-row', {});
        insertBlock(newBlock, index + 1, rootClientId);
    };
    return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Row Settings', 'jankx'), children: [_jsx(ToggleControl, { label: __('Header row', 'jankx'), checked: isHeader, onChange: (value) => setAttributes({ isHeader: value, isFooter: value ? false : isFooter }) }), _jsx(ToggleControl, { label: __('Footer row', 'jankx'), checked: isFooter, onChange: (value) => setAttributes({ isFooter: value, isHeader: value ? false : isHeader }) })] }) }), _jsx(BlockControls, { children: _jsxs(ToolbarGroup, { children: [_jsx(ToolbarButton, { icon: "table-row-before", label: __('Insert row before', 'jankx'), onClick: handleInsertRowBefore }), _jsx(ToolbarButton, { icon: "table-row-after", label: __('Insert row after', 'jankx'), onClick: handleInsertRowAfter })] }) }), _jsx(TagName, { children: _jsx("tr", { ...trProps, ...innerBlocksProps }) })] }));
};
export default Edit;
