/**
 * Blocks Extra Editor JavaScript
 * 
 * Adds render mode selection dropdown to all Gutenberg blocks
 * for enhanced responsive control and SSR/CSR rendering options.
 */

wp.domReady(() => {
    const { addFilter } = wp.hooks;
    const { createElement: el } = wp.element;
    const { PanelBody, SelectControl, RangeControl } = wp.components;
    const { InspectorControls } = wp.blockEditor;
    const CLAMP_TARGETS = ['core/post-title', 'core/heading', 'core/paragraph'];
    
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
     * Add line clamp attribute to targeted blocks
     */
    function addLineClampAttribute(settings, name) {
        if (!CLAMP_TARGETS.includes(name)) {
            return settings;
        }
        if (!settings.attributes) {
            settings.attributes = {};
        }
        settings.attributes.jankxLineClamp = {
            type: 'number',
            default: 0
        };
        return settings;
    }
    
    /**
     * Add line clamp control in Inspector for targeted blocks
     */
    function addLineClampControl(BlockEdit) {
        return function(props) {
            const { name, attributes, setAttributes, isSelected } = props;
            if (!CLAMP_TARGETS.includes(name)) {
                return el(BlockEdit, props);
            }
            const clamp = typeof attributes.jankxLineClamp === 'number' ? attributes.jankxLineClamp : 0;
            const blockEdit = el(BlockEdit, props);
            if (!isSelected) {
                return blockEdit;
            }
            const clampControl = el(
                InspectorControls,
                {},
                el(
                    PanelBody,
                    {
                        title: 'Line Clamp',
                        initialOpen: false
                    },
                    el(RangeControl, {
                        label: 'Lines',
                        value: clamp,
                        min: 0,
                        max: 10,
                        allowReset: true,
                        onChange: (value) => {
                            const nextClamp = typeof value === 'number' ? value : 0;
                            const prevClass = attributes.className || '';
                            const cleaned = prevClass.replace(/\bjankx-line-clamp-lines-\d+\b/g, '').replace(/\bjankx-line-clamp\b/g, '').trim();
                            const nextClasses = nextClamp > 0
                                ? (cleaned ? cleaned + ' ' : '') + `jankx-line-clamp jankx-line-clamp-lines-${nextClamp}`
                                : cleaned;
                            setAttributes({
                                jankxLineClamp: nextClamp,
                                className: nextClasses
                            });
                        },
                        help: '0 để tắt clamp; >0 sẽ giới hạn số dòng hiển thị'
                    })
                )
            );
            return [blockEdit, clampControl];
        };
    }
    
    /**
     * Add line clamp styles/class on save (for static blocks)
     */
    function addLineClampToSave(props, blockType, attributes) {
        const clamp = attributes.jankxLineClamp;
        if (typeof clamp === 'number' && clamp > 0 && CLAMP_TARGETS.includes(blockType.name)) {
            props.className = (props.className || '');
            if (!/\bjankx-line-clamp\b/.test(props.className)) {
                props.className += (props.className ? ' ' : '') + 'jankx-line-clamp';
            }
            if (!new RegExp(`\\bjankx-line-clamp-lines-${clamp}\\b`).test(props.className)) {
                props.className += ` jankx-line-clamp-lines-${clamp}`;
            }
            props['data-line-clamp'] = clamp;
            const style = props.style || {};
            style.display = '-webkit-box';
            style.WebkitLineClamp = clamp;
            style.WebkitBoxOrient = 'vertical';
            style.overflow = 'hidden';
            props.style = style;
        }
        return props;
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
    addFilter('blocks.registerBlockType', 'jankx/blocks-extra/add-line-clamp-attribute', addLineClampAttribute);
    addFilter('editor.BlockEdit', 'jankx/blocks-extra/add-line-clamp-control', addLineClampControl);
    addFilter('blocks.getSaveContent.extraProps', 'jankx/blocks-extra/add-line-clamp-to-save', addLineClampToSave);
    
    // Add CSS class to body for styling
    document.body.classList.add('jankx-blocks-extra-enabled');
});
