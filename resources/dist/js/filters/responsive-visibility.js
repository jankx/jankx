import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
/**
 * Add responsive visibility attributes to all blocks
 */
addFilter('blocks.registerBlockType', 'jankx/responsive-visibility/attributes', (settings) => {
    if (!settings)
        return settings;
    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            jankxHideOnUltrawide: {
                type: 'boolean',
                default: false
            },
            jankxHideOnPc: {
                type: 'boolean',
                default: false
            },
            jankxHideOnTablet: {
                type: 'boolean',
                default: false
            },
            jankxHideOnMobile: {
                type: 'boolean',
                default: false
            }
        }
    };
});
/**
 * Add Responsive Visibility UI to Inspector Controls
 */
const withResponsiveVisibilityControl = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { attributes, setAttributes, clientId, name } = props;
        const { jankxHideOnUltrawide, jankxHideOnPc, jankxHideOnTablet, jankxHideOnMobile } = attributes;
        // Only show for blocks inside jankx/wrapper
        const isInsideWrapper = useSelect((select) => {
            const blockEditor = select('core/block-editor');
            if (!blockEditor)
                return false;
            const { getBlockParents, getBlockName } = blockEditor;
            const parents = getBlockParents(clientId);
            // If the block itself is a wrapper, we might want to show it too 
            // but the request said "inner blocks". Let's show it for all blocks 
            // that are inside or IS the wrapper? 
            // Actually, if it's the wrapper itself, it already has its own hide settings in block.json
            if (name === 'jankx/wrapper')
                return false;
            return parents.some((parentId) => getBlockName(parentId) === 'jankx/wrapper');
        }, [clientId, name]);
        if (!isInsideWrapper) {
            return _jsx(BlockEdit, { ...props });
        }
        return (_jsxs(_Fragment, { children: [_jsx(BlockEdit, { ...props }), _jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Responsive Visibility', 'jankx'), initialOpen: false, children: [_jsx(ToggleControl, { label: __('Hide on Ultrawide', 'jankx'), checked: !!jankxHideOnUltrawide, onChange: (val) => setAttributes({ jankxHideOnUltrawide: val }) }), _jsx(ToggleControl, { label: __('Hide on Desktop', 'jankx'), checked: !!jankxHideOnPc, onChange: (val) => setAttributes({ jankxHideOnPc: val }) }), _jsx(ToggleControl, { label: __('Hide on Tablet', 'jankx'), checked: !!jankxHideOnTablet, onChange: (val) => setAttributes({ jankxHideOnTablet: val }) }), _jsx(ToggleControl, { label: __('Hide on Mobile', 'jankx'), checked: !!jankxHideOnMobile, onChange: (val) => setAttributes({ jankxHideOnMobile: val }) })] }) })] }));
    };
}, 'withResponsiveVisibilityControl');
addFilter('editor.BlockEdit', 'jankx/responsive-visibility/controls', withResponsiveVisibilityControl);
/**
 * Apply opacity in Editor Preview for hidden blocks
 */
const withResponsiveVisibilityStyle = createHigherOrderComponent((BlockListBlock) => {
    return (props) => {
        const { attributes } = props;
        const { jankxHideOnUltrawide, jankxHideOnPc, jankxHideOnTablet, jankxHideOnMobile } = attributes;
        if (jankxHideOnUltrawide || jankxHideOnPc || jankxHideOnTablet || jankxHideOnMobile) {
            const style = {
                ...props.wrapperProps?.style,
            };
            // In editor, we just dim it a bit to show it's "conditionally hidden"
            style.opacity = '0.5';
            style.border = '1px dashed #ccc';
            return (_jsx(BlockListBlock, { ...props, wrapperProps: {
                    ...props.wrapperProps,
                    style
                } }));
        }
        return _jsx(BlockListBlock, { ...props });
    };
}, 'withResponsiveVisibilityStyle');
addFilter('editor.BlockListBlock', 'jankx/responsive-visibility/style', withResponsiveVisibilityStyle);
