/**
 * Test Simple Block
 */

(function() {
    'use strict';

    // Check if we're in the editor
    if (typeof wp === 'undefined' || !wp.blocks) {
        return;
    }

    const { registerBlockType } = wp.blocks;
    const { __ } = wp.i18n;
    const { useBlockProps, RichText } = wp.blockEditor;

    // Register the simple test block
    registerBlockType('jankx/test-simple', {
        apiVersion: 2,
        title: __('Test Simple Block', 'jankx'),
        description: __('A simple test block', 'jankx'),
        category: 'common', // Use common category
        icon: 'smiley', // Use WordPress default icon
        keywords: ['test', 'simple'],
        supports: {
            html: false,
        },
        attributes: {
            content: {
                type: 'string',
                default: '',
            },
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const { content } = attributes;

            const blockProps = useBlockProps();

            return wp.element.createElement('div', blockProps,
                wp.element.createElement(RichText, {
                    tagName: 'p',
                    value: content,
                    onChange: (value) => setAttributes({ content: value }),
                    placeholder: __('Enter content...', 'jankx')
                })
            );
        },
        save: function(props) {
            const { attributes } = props;
            const { content } = attributes;

            return wp.element.createElement('div', useBlockProps.save(),
                wp.element.createElement(RichText.Content, {
                    tagName: 'p',
                    value: content
                })
            );
        }
    });

    console.log('Test simple block registered');

})();