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
            wp.components.InspectorControls,
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
    
    // Add CSS class to body for styling
    document.body.classList.add('jankx-blocks-extra-enabled');
}

// Initialize when DOM is ready
wp.dom.ready(initializeBlocksExtraEditor);

// Export types for external use
export type { RenderMode, SelectOption, EnhancedBlockProps };
