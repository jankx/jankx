(function(){
    var registerBlockType = wp.blocks.registerBlockType;
    var InspectorControls = wp.blockEditor ? wp.blockEditor.InspectorControls : wp.editor.InspectorControls;
    var PanelBody = wp.components.PanelBody;
    var SelectControl = wp.components.SelectControl;
    var TextControl = wp.components.TextControl;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var blockJson = {
        name: 'jankx/per-unit',
        attributes: {
            metaKey: { type: 'string', default: '_unit' },
            customMetaKey: { type: 'string', default: '' },
            prefix: { type: 'string', default: '/' },
            fallbackText: { type: 'string', default: 'kg' }
        }
    };
    function Edit(props){
        var attrs = props.attributes;
        var setAttributes = props.setAttributes;
        var blockProps = useBlockProps({ className: 'jankx-per-unit' });
        var options = [
            { label: 'Unit (_unit)', value: '_unit' },
            { label: 'Custom Key', value: 'custom' }
        ];
        return wp.element.createElement('span', blockProps,
            wp.element.createElement(InspectorControls, null,
                wp.element.createElement(PanelBody, { title: 'Per Unit Settings' },
                    wp.element.createElement(SelectControl, {
                        label: 'Meta Key',
                        value: attrs.metaKey,
                        options: options,
                        onChange: function(v){ setAttributes({ metaKey: v }); }
                    }),
                    attrs.metaKey === 'custom' ? wp.element.createElement(TextControl, {
                        label: 'Custom Meta Key',
                        value: attrs.customMetaKey,
                        onChange: function(v){ setAttributes({ customMetaKey: v }); }
                    }) : null,
                    wp.element.createElement(TextControl, {
                        label: 'Prefix',
                        value: attrs.prefix,
                        onChange: function(v){ setAttributes({ prefix: v }); }
                    }),
                    wp.element.createElement(TextControl, {
                        label: 'Fallback Text',
                        value: attrs.fallbackText,
                        onChange: function(v){ setAttributes({ fallbackText: v }); }
                    })
                )
            ),
            wp.element.createElement('span', { className: 'per-unit-prefix' }, attrs.prefix || '/'),
            wp.element.createElement('span', { className: 'per-unit-value' }, attrs.fallbackText || 'kg')
        );
    }
    registerBlockType(blockJson.name, {
        edit: Edit,
        save: function(){ return null; }
    });
})();
