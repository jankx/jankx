import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, BlockControls, useInnerBlocksProps, __experimentalUseBorderProps as useBorderProps, __experimentalUseColorProps as useColorProps, } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, ToolbarGroup, ToolbarButton, } from '@wordpress/components';
const Edit = ({ attributes, setAttributes, clientId }) => {
    const { hasFixedLayout, hasHeaderRow, hasFooterRow } = attributes;
    const colorProps = useColorProps(attributes);
    const borderProps = useBorderProps(attributes);
    const blockProps = useBlockProps({
        className: [
            'wp-block-jankx-master-table__wrapper',
            hasFixedLayout && 'has-fixed-layout',
        ]
            .filter(Boolean)
            .join(' '),
    });
    const innerBlocksProps = useInnerBlocksProps({
        className: [
            'wp-block-jankx-master-table',
            borderProps.className,
            colorProps.className,
        ]
            .filter(Boolean)
            .join(' '),
        style: {
            ...borderProps.style,
            ...colorProps.style,
        },
    }, {
        allowedBlocks: ['jankx/table-row'],
        template: [
            ['jankx/table-row', { isHeader: hasHeaderRow }],
            ['jankx/table-row', {}],
        ],
        templateLock: false,
        renderAppender: false,
    });
    return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Table Settings', 'jankx'), children: [_jsx(ToggleControl, { label: __('Fixed table layout', 'jankx'), checked: hasFixedLayout, onChange: (value) => setAttributes({ hasFixedLayout: value }), help: __('Fixed layout distributes column width equally', 'jankx') }), _jsx(ToggleControl, { label: __('Header row', 'jankx'), checked: hasHeaderRow, onChange: (value) => setAttributes({ hasHeaderRow: value }) }), _jsx(ToggleControl, { label: __('Footer row', 'jankx'), checked: hasFooterRow, onChange: (value) => setAttributes({ hasFooterRow: value }) })] }) }), _jsx(BlockControls, { children: _jsxs(ToolbarGroup, { children: [_jsx(ToolbarButton, { icon: "table-row-before", label: __('Insert row before', 'jankx'), onClick: () => {
                                // Will be handled by row toolbar
                            }, disabled: true }), _jsx(ToolbarButton, { icon: "table-row-after", label: __('Insert row after', 'jankx'), onClick: () => {
                                // Will be handled by row toolbar
                            }, disabled: true })] }) }), _jsx("div", { ...blockProps, children: _jsx("table", { ...innerBlocksProps }) })] }));
};
export default Edit;
