import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { JankxInspector } from '../../js/components/jankx-inspector/JankxInspector';
import { ResponsiveControl } from '../../js/components/jankx-inspector/ResponsiveControl';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ColorPalette } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps({
        className: 'jankx-typography-block',
        style: {
            '--jankx-font-size-desktop': attributes.fontSizeDesktop ? `${attributes.fontSizeDesktop}px` : undefined,
            '--jankx-font-size-tablet': attributes.fontSizeTablet ? `${attributes.fontSizeTablet}px` : undefined,
            '--jankx-font-size-mobile': attributes.fontSizeMobile ? `${attributes.fontSizeMobile}px` : undefined,
            '--jankx-line-clamp-desktop': attributes.lineClampDesktop || undefined,
            '--jankx-line-clamp-tablet': attributes.lineClampTablet || undefined,
            '--jankx-line-clamp-mobile': attributes.lineClampMobile || undefined,
            'color': attributes.textColor
        }
    });
    const innerBlockCount = useSelect((select) => select('core/block-editor').getBlockCount(clientId), [clientId]);
    const ALLOWED_BLOCKS = [
        'core/paragraph',
        'core/heading',
        'core/post-title',
        'core/post-content',
        'core/post-excerpt',
        'core/post-terms',
        'core/archive-title',
        'core/term-description',
        'core/site-title',
        'core/site-tagline',
        'woocommerce/product-title',
        'woocommerce/product-short-description',
        'woocommerce/product-content',
        'jankx/magic-text'
    ];
    return (_jsxs("div", { ...blockProps, children: [_jsx(InspectorControls, { children: _jsx(JankxInspector, { tabs: [
                        { name: 'style', title: 'Typography' },
                        { name: 'responsive', title: 'Responsive' }
                    ], children: (tab) => {
                        if (tab.name === 'style') {
                            return (_jsxs(_Fragment, { children: [_jsx(PanelBody, { title: "Colors", children: _jsx(ColorPalette, { value: attributes.textColor, onChange: (textColor) => setAttributes({ textColor }) }) }), _jsx(PanelBody, { title: "Line Clamp", children: _jsx(ResponsiveControl, { label: "Max Lines", children: (device) => (_jsx(RangeControl, { value: device === 'desktop' ? attributes.lineClampDesktop : device === 'tablet' ? attributes.lineClampTablet : attributes.lineClampMobile, onChange: (val) => {
                                                    const key = device === 'desktop' ? 'lineClampDesktop' : device === 'tablet' ? 'lineClampTablet' : 'lineClampMobile';
                                                    setAttributes({ [key]: val });
                                                }, min: 1, max: 10, allowReset: true })) }) })] }));
                        }
                        if (tab.name === 'responsive') {
                            return (_jsx(PanelBody, { title: "Font Size", children: _jsx(ResponsiveControl, { label: "Size (px)", children: (device) => (_jsx(RangeControl, { value: device === 'desktop' ? attributes.fontSizeDesktop : device === 'tablet' ? attributes.fontSizeTablet : attributes.fontSizeMobile, onChange: (val) => {
                                            const key = device === 'desktop' ? 'fontSizeDesktop' : device === 'tablet' ? 'fontSizeTablet' : 'fontSizeMobile';
                                            setAttributes({ [key]: val });
                                        }, min: 10, max: 100 })) }) }));
                        }
                        return null;
                    } }) }), _jsx(InnerBlocks, { allowedBlocks: ALLOWED_BLOCKS, template: [['core/paragraph']], renderAppender: innerBlockCount >= 1 ? false : InnerBlocks.ButtonBlockAppender })] }));
}
