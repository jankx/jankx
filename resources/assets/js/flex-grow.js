(function (wp) {
    var el = wp.element.createElement;
    var addFilter = wp.hooks.addFilter;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var ToggleControl = wp.components.ToggleControl;
    var createHigherOrderComponent = wp.compose.createHigherOrderComponent;
    var __ = wp.i18n.__;

    // 1. Add attribute to blocks
    addFilter(
        'blocks.registerBlockType',
        'jankx/flex-grow/attribute',
        function (settings) {
            settings.attributes = Object.assign(settings.attributes || {}, {
                jankxFlexGrow: {
                    type: 'boolean',
                    default: false
                }
            });
            return settings;
        }
    );

    // 2. Add UI to Inspector Controls
    var withFlexGrowControl = createHigherOrderComponent(function (BlockEdit) {
        return function (props) {
            // Only add to blocks that aren't core/column (usually columns already have flex controls)
            // or modify as needed for specific targets
            var isSupported = true;

            return el(
                wp.element.Fragment,
                null,
                el(BlockEdit, props),
                isSupported && props.isSelected && el(
                    InspectorControls,
                    null,
                    el(
                        PanelBody,
                        {
                            title: __('Flex Layout', 'jankx'),
                            initialOpen: false
                        },
                        el(ToggleControl, {
                            label: __('Enable Flex Grow', 'jankx'),
                            description: __('Make this block grow to fill available space.', 'jankx'),
                            checked: props.attributes.jankxFlexGrow,
                            onChange: function (value) {
                                props.setAttributes({ jankxFlexGrow: value });
                            }
                        })
                    )
                )
            );
        };
    }, 'withFlexGrowControl');

    addFilter(
        'editor.BlockEdit',
        'jankx/flex-grow/controls',
        withFlexGrowControl
    );

    // 3. Optional: Add visual feedback in editor
    var withFlexGrowStyle = createHigherOrderComponent(function (BlockListBlock) {
        return function (props) {
            if (props.attributes.jankxFlexGrow) {
                return el(BlockListBlock, Object.assign({}, props, {
                    wrapperProps: Object.assign({}, props.wrapperProps, {
                        style: Object.assign({}, (props.wrapperProps && props.wrapperProps.style) || {}, {
                            flex: '1'
                        })
                    })
                }));
            }
            return el(BlockListBlock, props);
        };
    }, 'withFlexGrowStyle');

    addFilter(
        'editor.BlockListBlock',
        'jankx/flex-grow/style',
        withFlexGrowStyle
    );

})(window.wp);
