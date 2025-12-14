/**
 * Blocks Extra Editor JavaScript
 * 
 * Adds render mode selection dropdown to all Gutenberg blocks
 * for enhanced responsive control and SSR/CSR rendering options.
 */

wp.domReady(() => {
    const { addFilter } = wp.hooks;
    const { createElement: el } = wp.element;
    const { PanelBody, SelectControl } = wp.components;
    const { InspectorControls } = wp.blockEditor;
    
    /**
     * Add render mode control to all blocks
     */
    function addRenderModeControl(BlockEdit) {
        return function(props) {
            const { name, attributes, setAttributes, isSelected } = props;
            
            // Don't show for reusable blocks or certain internal blocks
            if (name === 'core/block' || name.startsWith('core/template-part')) {
                return el(BlockEdit, props);
            }
            
            const renderMode = attributes.jankxRenderMode || 'ssr';
            
            // Create the enhanced block edit component
            const blockEdit = el(BlockEdit, props);
            
            // Only show the panel when block is selected
            if (!isSelected) {
                return blockEdit;
            }
            
            // Add the render mode control to inspector
            const renderModeControl = el(
                InspectorControls,
                {},
                el(
                    PanelBody,
                    {
                        title: 'Jankx Advanced Settings',
                        initialOpen: false
                    },
                    el(
                        SelectControl,
                        {
                            label: 'Render Mode',
                            value: renderMode,
                            options: [
                                {
                                    label: 'SSR (Server-Side Rendering)',
                                    value: 'ssr'
                                },
                                {
                                    label: 'CSR (Client-Side Rendering)',
                                    value: 'csr'
                                }
                            ],
                            onChange: (value) => {
                                setAttributes({
                                    jankxRenderMode: value
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
    function addRenderModeToSave(props, blockType, attributes) {
        if (attributes.jankxRenderMode) {
            props.className = (props.className || '') + ` jankx-render-mode-${attributes.jankxRenderMode}`;
        }
        return props;
    }
    
    /**
     * Filter block registration to add our attribute
     */
    function addRenderModeAttribute(settings) {
        if (!settings.attributes) {
            settings.attributes = {};
        }
        
        settings.attributes.jankxRenderMode = {
            type: 'string',
            default: 'ssr'
        };
        
        return settings;
    }
    
    // Apply filters
    addFilter('blocks.registerBlockType', 'jankx/blocks-extra/add-render-mode-attribute', addRenderModeAttribute);
    addFilter('editor.BlockEdit', 'jankx/blocks-extra/add-render-mode-control', addRenderModeControl);
    addFilter('blocks.getSaveContent.extraProps', 'jankx/blocks-extra/add-render-mode-to-save', addRenderModeToSave);
    
    // Add CSS class to body for styling
    document.body.classList.add('jankx-blocks-extra-enabled');
});
