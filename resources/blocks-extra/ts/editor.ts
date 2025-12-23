/**
 * Blocks Extra Editor TypeScript
 * 
 * Adds render mode selection dropdown to all Gutenberg blocks
 * for enhanced responsive control and SSR/CSR rendering options.
 */

'use strict';

// Import WordPress types
/// <reference path="./wp-types.d.ts" />

// Type definitions
type RenderMode = 'ssr' | 'csr';
type Device = 'desktop' | 'tablet' | 'mobile';

interface SelectOption {
    label: string;
    value: RenderMode;
}

interface EnhancedBlockProps extends wp.blockEditor.BlockEditProps {
    attributes: {
        jankxRenderMode?: RenderMode;
        [key: string]: any;
    };
}

// Constants
const RENDER_MODES: readonly SelectOption[] = [
    {
        label: 'SSR (Server-Side Rendering)',
        value: 'ssr'
    },
    {
        label: 'CSR (Client-Side Rendering)',
        value: 'csr'
    }
] as const;

const EXCLUDED_BLOCKS = [
    'core/block',
    'core/template-part',
    'core/template'
] as const;

/**
 * Add render mode control to all blocks
 */
function addRenderModeControl(BlockEdit: wp.element.ComponentType<wp.blockEditor.BlockEditProps>): wp.element.ComponentType<EnhancedBlockProps> {
    return function(props: EnhancedBlockProps): any {
        const { name, attributes, setAttributes, isSelected } = props;
        
        // Don't show for excluded blocks
        if (EXCLUDED_BLOCKS.some(excluded => name.startsWith(excluded))) {
            return wp.element.createElement(BlockEdit, props);
        }
        
        const renderMode: RenderMode = attributes.jankxRenderMode ?? 'ssr';
        
        // Create the enhanced block edit component
        const blockEdit = wp.element.createElement(BlockEdit, props);
        
        // Only show the panel when block is selected
        if (!isSelected) {
            return blockEdit;
        }
        
        // Add the render mode control to inspector
        const renderModeControl = wp.element.createElement(
            wp.blockEditor.InspectorControls,
            {},
            wp.element.createElement(
                wp.components.PanelBody,
                {
                    title: 'Jankx Advanced Settings',
                    initialOpen: false
                },
                wp.element.createElement(
                    wp.components.SelectControl,
                    {
                        label: 'Render Mode',
                        value: renderMode,
                        options: RENDER_MODES,
                        onChange: (value: string): void => {
                            setAttributes({
                                jankxRenderMode: value as RenderMode
                            });
                        },
                        help: 'SSR renders on server for better SEO and performance. CSR renders on client for interactive content.'
                    }
                )
            )
        );
        
        return [blockEdit, renderModeControl];
    };
}

/**
 * Add render mode attribute to block's save function
 */
function addRenderModeToSave(
    props: Record<string, any>,
    blockType: any,
    attributes: { jankxRenderMode?: RenderMode }
): Record<string, any> {
    if (attributes.jankxRenderMode) {
        const className = props.className ? 
            `${props.className} jankx-render-mode-${attributes.jankxRenderMode}` : 
            `jankx-render-mode-${attributes.jankxRenderMode}`;
        
        return {
            ...props,
            className
        };
    }
    
    return props;
}

/**
 * Filter block registration to add our attribute
 */
function addRenderModeAttribute(settings: any): any {
    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            jankxRenderMode: {
                type: 'string',
                default: 'ssr'
            }
        }
    };
}

/**
 * Initialize the blocks extra editor system
 */
function initializeBlocksExtraEditor(): void {
    // Apply filters
    wp.hooks.addFilter(
        'blocks.registerBlockType',
        'jankx/blocks-extra/add-render-mode-attribute',
        addRenderModeAttribute
    );
    
    wp.hooks.addFilter(
        'editor.BlockEdit',
        'jankx/blocks-extra/add-render-mode-control',
        addRenderModeControl
    );
    
    wp.hooks.addFilter(
        'blocks.getSaveContent.extraProps',
        'jankx/blocks-extra/add-render-mode-to-save',
        addRenderModeToSave
    );
    
    // Add Responsive Dimensions support
    wp.hooks.addFilter(
        'blocks.registerBlockType',
        'jankx/blocks-extra/add-responsive-dimensions-attributes',
        addResponsiveDimensionsAttributes
    );
    wp.hooks.addFilter(
        'editor.BlockEdit',
        'jankx/blocks-extra/add-responsive-dimensions-controls',
        addResponsiveDimensionsControls
    );
    wp.hooks.addFilter(
        'blocks.getSaveContent.extraProps',
        'jankx/blocks-extra/add-responsive-dimensions-to-save',
        addResponsiveDimensionsToSave
    );
    
    // Add CSS class to body for styling
    document.body.classList.add('jankx-blocks-extra-enabled');
    injectResponsiveDimensionsCSS();
}

// Initialize when DOM is ready
if (typeof wp !== 'undefined' && (wp as any).domReady) {
    (wp as any).domReady(initializeBlocksExtraEditor);
} else {
    // Fallback for environments where wp.domReady is unavailable
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initializeBlocksExtraEditor());
    } else {
        initializeBlocksExtraEditor();
    }
}

// Export types for external use
export type { RenderMode, SelectOption, EnhancedBlockProps };

/**
 * Responsive Dimensions: Attributes
 */
function addResponsiveDimensionsAttributes(settings: any, name: string): any {
    const spacingSupport = (wp.blocks as any).getBlockSupport
        ? (wp.blocks as any).getBlockSupport(name, 'spacing')
        : settings?.supports?.spacing;
    if (!spacingSupport) {
        return settings;
    }
    // Disable core padding/margin controls so we can replace them
    const supports = { ...(settings.supports || {}) };
    const spacing = { ...(supports.spacing || {}) };
    spacing.padding = false;
    spacing.margin = false;
    supports.spacing = spacing;
    settings.supports = supports;

    const attributes = {
        ...(settings.attributes || {}),
        jankxPaddingDesktop: { type: 'number' },
        jankxPaddingTablet: { type: 'number' },
        jankxPaddingMobile: { type: 'number' },
        jankxMarginDesktop: { type: 'number' },
        jankxMarginTablet: { type: 'number' },
        jankxMarginMobile: { type: 'number' },
        jankxGapDesktop: { type: 'number' },
        jankxGapTablet: { type: 'number' },
        jankxGapMobile: { type: 'number' },
    };
    return { ...settings, attributes };
}

/**
 * Responsive Dimensions: Controls
 */
function addResponsiveDimensionsControls(BlockEdit: wp.element.ComponentType<wp.blockEditor.BlockEditProps>) {
    return function(props: any) {
        const { name, attributes, setAttributes, isSelected } = props;
        const spacingSupport = (wp.blocks as any).getBlockSupport
            ? (wp.blocks as any).getBlockSupport(name, 'spacing')
            : true;
        if (!spacingSupport) {
            return wp.element.createElement(BlockEdit, props);
        }
        const blockEdit = wp.element.createElement(BlockEdit, props);
        if (!isSelected) {
            return blockEdit;
        }
        
        // ToolsPanel integration: render one ToolsPanelItem under Dimensions
        const ToolsPanelItem = (wp.components as any).__experimentalToolsPanelItem;
        const [current, setCurrent] = (wp.element as any).useState<Device>('desktop');
        const currentDevice = () => current;
        const getVal = (type: 'padding'|'margin'|'gap') => {
            const d = currentDevice();
            if (type === 'padding') return d === 'desktop' ? attributes.jankxPaddingDesktop : d === 'tablet' ? attributes.jankxPaddingTablet : attributes.jankxPaddingMobile;
            if (type === 'margin')  return d === 'desktop' ? attributes.jankxMarginDesktop  : d === 'tablet' ? attributes.jankxMarginTablet  : attributes.jankxMarginMobile;
            return d === 'desktop' ? attributes.jankxGapDesktop     : d === 'tablet' ? attributes.jankxGapTablet     : attributes.jankxGapMobile;
        };
        const setVal = (type: 'padding'|'margin'|'gap', value?: number) => {
            const d = currentDevice();
            const patch: any = {};
            if (type === 'padding') {
                if (d === 'desktop') patch.jankxPaddingDesktop = value;
                else if (d === 'tablet') patch.jankxPaddingTablet = value;
                else patch.jankxPaddingMobile = value;
            } else if (type === 'margin') {
                if (d === 'desktop') patch.jankxMarginDesktop = value;
                else if (d === 'tablet') patch.jankxMarginTablet = value;
                else patch.jankxMarginMobile = value;
            } else {
                if (d === 'desktop') patch.jankxGapDesktop = value;
                else if (d === 'tablet') patch.jankxGapTablet = value;
                else patch.jankxGapMobile = value;
            }
            setAttributes(patch);
        };
        
        const spacingPanel = wp.element.createElement(
            wp.blockEditor.InspectorControls,
            { group: 'dimensions' },
            wp.element.createElement(
                ToolsPanelItem,
                {
                    label: 'Padding (Responsive)',
                    isShownByDefault: true,
                    hasValue: () => {
                        const v = [
                            attributes.jankxPaddingDesktop, attributes.jankxPaddingTablet, attributes.jankxPaddingMobile
                        ];
                        return v.some((x: any) => typeof x === 'number');
                    },
                    onDeselect: () => {
                        setAttributes({
                            jankxPaddingDesktop: undefined,
                            jankxPaddingTablet: undefined,
                            jankxPaddingMobile: undefined
                        });
                    }
                },
                wp.element.createElement(
                    wp.components.ButtonGroup,
                    { style: { marginBottom: '12px' } },
                    wp.element.createElement(wp.components.Button, { isPressed: current === 'desktop', onClick: () => setCurrent('desktop'), variant: current === 'desktop' ? 'primary' : 'secondary', size: 'small', title: 'Desktop' }, '🖥️'),
                    wp.element.createElement(wp.components.Button, { isPressed: current === 'tablet', onClick: () => setCurrent('tablet'), variant: current === 'tablet' ? 'primary' : 'secondary', size: 'small', title: 'Tablet' }, '📱'),
                    wp.element.createElement(wp.components.Button, { isPressed: current === 'mobile', onClick: () => setCurrent('mobile'), variant: current === 'mobile' ? 'primary' : 'secondary', size: 'small', title: 'Mobile' }, '📱'),
                ),
                wp.element.createElement(wp.components.RangeControl, {
                    label: `Padding`,
                    value: getVal('padding'),
                    min: 0, max: 128, allowReset: true,
                    onChange: (v?: number) => setVal('padding', typeof v === 'number' ? v : undefined),
                    help: 'Khoảng cách bên trong khối; áp dụng cho tất cả các cạnh'
                }),
            ),
            wp.element.createElement(
                ToolsPanelItem,
                {
                    label: 'Margin (Responsive)',
                    isShownByDefault: true,
                    hasValue: () => {
                        const v = [
                            attributes.jankxMarginDesktop, attributes.jankxMarginTablet, attributes.jankxMarginMobile
                        ];
                        return v.some((x: any) => typeof x === 'number');
                    },
                    onDeselect: () => {
                        setAttributes({
                            jankxMarginDesktop: undefined,
                            jankxMarginTablet: undefined,
                            jankxMarginMobile: undefined
                        });
                    }
                },
                wp.element.createElement(
                    wp.components.ButtonGroup,
                    { style: { marginBottom: '12px' } },
                    wp.element.createElement(wp.components.Button, { isPressed: current === 'desktop', onClick: () => setCurrent('desktop'), variant: current === 'desktop' ? 'primary' : 'secondary', size: 'small', title: 'Desktop' }, '🖥️'),
                    wp.element.createElement(wp.components.Button, { isPressed: current === 'tablet', onClick: () => setCurrent('tablet'), variant: current === 'tablet' ? 'primary' : 'secondary', size: 'small', title: 'Tablet' }, '📱'),
                    wp.element.createElement(wp.components.Button, { isPressed: current === 'mobile', onClick: () => setCurrent('mobile'), variant: current === 'mobile' ? 'primary' : 'secondary', size: 'small', title: 'Mobile' }, '📱'),
                ),
                wp.element.createElement(wp.components.RangeControl, {
                    label: `Margin`,
                    value: getVal('margin'),
                    min: 0, max: 128, allowReset: true,
                    onChange: (v?: number) => setVal('margin', typeof v === 'number' ? v : undefined),
                    help: 'Khoảng cách bên ngoài khối; áp dụng cho tất cả các cạnh'
                })
            )
        );
        
        return [blockEdit, spacingPanel];
    };
}

/**
 * Responsive Dimensions: Save props
 */
function addResponsiveDimensionsToSave(props: Record<string, any>, _blockType: any, attributes: Record<string, any>) {
    const hasPadding = [attributes.jankxPaddingDesktop, attributes.jankxPaddingTablet, attributes.jankxPaddingMobile].some((v: any) => typeof v === 'number');
    const hasMargin  = [attributes.jankxMarginDesktop, attributes.jankxMarginTablet, attributes.jankxMarginMobile].some((v: any) => typeof v === 'number');
    const hasGap     = [attributes.jankxGapDesktop, attributes.jankxGapTablet, attributes.jankxGapMobile].some((v: any) => typeof v === 'number');
    if (hasPadding || hasMargin || hasGap) {
        const className = (props.className || '')
            + (/\bhas-jankx-responsive-dimensions\b/.test(props.className || '') ? '' : (props.className ? ' ' : '') + 'has-jankx-responsive-dimensions')
            + (hasPadding && !/\bhas-jankx-padding\b/.test(props.className || '') ? ' has-jankx-padding' : '')
            + (hasMargin  && !/\bhas-jankx-margin\b/.test(props.className || '') ? ' has-jankx-margin' : '')
            + (hasGap     && !/\bhas-jankx-gap\b/.test(props.className || '') ? ' has-jankx-gap' : '');
        const style = { ...(props.style || {}) };
        if (typeof attributes.jankxPaddingDesktop === 'number') style['--jankx-padding-desktop'] = attributes.jankxPaddingDesktop + 'px';
        if (typeof attributes.jankxPaddingTablet === 'number')  style['--jankx-padding-tablet']  = attributes.jankxPaddingTablet + 'px';
        if (typeof attributes.jankxPaddingMobile === 'number')  style['--jankx-padding-mobile']  = attributes.jankxPaddingMobile + 'px';
        if (typeof attributes.jankxMarginDesktop === 'number')  style['--jankx-margin-desktop']  = attributes.jankxMarginDesktop + 'px';
        if (typeof attributes.jankxMarginTablet === 'number')   style['--jankx-margin-tablet']   = attributes.jankxMarginTablet + 'px';
        if (typeof attributes.jankxMarginMobile === 'number')   style['--jankx-margin-mobile']   = attributes.jankxMarginMobile + 'px';
        if (typeof attributes.jankxGapDesktop === 'number')     style['--jankx-gap-desktop']     = attributes.jankxGapDesktop + 'px';
        if (typeof attributes.jankxGapTablet === 'number')      style['--jankx-gap-tablet']      = attributes.jankxGapTablet + 'px';
        if (typeof attributes.jankxGapMobile === 'number')      style['--jankx-gap-mobile']      = attributes.jankxGapMobile + 'px';
        return { ...props, className, style };
    }
    return props;
}

/**
 * Inject CSS for responsive dimensions
 */
function injectResponsiveDimensionsCSS() {
    const STYLE_ID = 'jankx-responsive-dimensions-css';
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
        .has-jankx-responsive-dimensions.has-jankx-padding { padding: var(--jankx-padding-desktop, initial); }
        .has-jankx-responsive-dimensions.has-jankx-margin { margin: var(--jankx-margin-desktop, initial); }
        .has-jankx-responsive-dimensions.has-jankx-gap {
            gap: var(--jankx-gap-desktop, var(--wp--style--block-gap, initial));
            --wp--style--block-gap: var(--jankx-gap-desktop, var(--wp--style--block-gap, initial));
        }
        @media (max-width: 1024px) {
            .has-jankx-responsive-dimensions.has-jankx-padding { padding: var(--jankx-padding-tablet, var(--jankx-padding-desktop, initial)); }
            .has-jankx-responsive-dimensions.has-jankx-margin { margin: var(--jankx-margin-tablet, var(--jankx-margin-desktop, initial)); }
            .has-jankx-responsive-dimensions.has-jankx-gap {
                gap: var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial)));
                --wp--style--block-gap: var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial)));
            }
        }
        @media (max-width: 768px) {
            .has-jankx-responsive-dimensions.has-jankx-padding { padding: var(--jankx-padding-mobile, var(--jankx-padding-tablet, var(--jankx-padding-desktop, initial))); }
            .has-jankx-responsive-dimensions.has-jankx-margin { margin: var(--jankx-margin-mobile, var(--jankx-margin-tablet, var(--jankx-margin-desktop, initial))); }
            .has-jankx-responsive-dimensions.has-jankx-gap {
                gap: var(--jankx-gap-mobile, var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial))));
                --wp--style--block-gap: var(--jankx-gap-mobile, var(--jankx-gap-tablet, var(--jankx-gap-desktop, var(--wp--style--block-gap, initial))));
            }
        }
    `;
    document.head.appendChild(style);
}
