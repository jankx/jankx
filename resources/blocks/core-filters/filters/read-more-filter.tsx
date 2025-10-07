/**
 * Core Read More Block Filter
 *
 * Thêm icon controls vào core/read-more block
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import IconControls from '../components/IconControls';

/**
 * Add icon attributes to core/read-more block
 */
const addIconAttributes = (settings: any, name: string) => {
    if (name !== 'core/read-more') {
        return settings;
    }

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            hasIcon: {
                type: 'boolean',
                default: false,
            },
            iconType: {
                type: 'string',
                default: '',
            },
            iconName: {
                type: 'string',
                default: '',
            },
            iconStyle: {
                type: 'string',
                default: 'filled',
            },
            iconSize: {
                type: 'string',
                default: '16px',
            },
            iconColor: {
                type: 'string',
                default: '',
            },
            iconPosition: {
                type: 'string',
                default: 'after',
            },
            imageUrl: {
                type: 'string',
                default: '',
            },
            imageAlt: {
                type: 'string',
                default: '',
            },
            imageSize: {
                type: 'string',
                default: '20px',
            },
            imageMarginRight: {
                type: 'string',
                default: '5px',
            },
            icon: {
                type: 'string',
                default: '',
            },
            width: {
                type: 'string',
                default: '20px',
            },
        },
    };
};

addFilter(
    'blocks.registerBlockType',
    'jankx/core-read-more/add-icon-attributes',
    addIconAttributes
);

/**
 * Add icon controls to block inspector
 */
const withIconControls = createHigherOrderComponent((BlockEdit) => {
    return (props: any) => {
        const { name, attributes, setAttributes } = props;

        if (name !== 'core/read-more') {
            return <BlockEdit {...props} />;
        }

        return (
            <>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody
                        title={__('Icon Settings', 'jankx')}
                        initialOpen={false}
                    >
                        <IconControls
                            attributes={attributes}
                            setAttributes={setAttributes}
                        />
                    </PanelBody>
                </InspectorControls>
            </>
        );
    };
}, 'withIconControls');

addFilter(
    'editor.BlockEdit',
    'jankx/core-read-more/with-icon-controls',
    withIconControls
);

/**
 * Add icon preview to block in editor
 */
const addIconPreview = createHigherOrderComponent((BlockListBlock) => {
    return (props: any) => {
        const { name, attributes } = props;

        if (name !== 'core/read-more' || !attributes.hasIcon || !attributes.iconType) {
            return <BlockListBlock {...props} />;
        }

        // Add custom class for styling
        const customClassName = `has-icon icon-position-${attributes.iconPosition}`;

        return (
            <BlockListBlock
                {...props}
                className={`${props.className || ''} ${customClassName}`}
            />
        );
    };
}, 'addIconPreview');

addFilter(
    'editor.BlockListBlock',
    'jankx/core-read-more/add-icon-preview',
    addIconPreview
);

