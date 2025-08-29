/**
 * WooCommerce Product Grid Block Filter
 * Enhance product grid with additional features
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Add custom attributes to the product grid block
addFilter(
    'blocks.registerBlockType',
    'jankx/enhance-product-grid',
    (settings, name) => {
        if (name !== 'woocommerce/product-grid') {
            return settings;
        }

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                showQuickView: {
                    type: 'boolean',
                    default: false
                },
                showWishlist: {
                    type: 'boolean',
                    default: false
                },
                showCompare: {
                    type: 'boolean',
                    default: false
                },
                animationEffect: {
                    type: 'string',
                    default: 'none'
                },
                hoverEffect: {
                    type: 'string',
                    default: 'zoom'
                }
            }
        };
    }
);

// Add custom controls to the product grid block
const withProductGridControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'woocommerce/product-grid') {
            return <BlockEdit {...props} />;
        }

        const { attributes, setAttributes } = props;
        const {
            showQuickView,
            showWishlist,
            showCompare,
            animationEffect,
            hoverEffect
        } = attributes;

        const animationOptions = [
            { label: 'None', value: 'none' },
            { label: 'Fade In', value: 'fade-in' },
            { label: 'Slide Up', value: 'slide-up' },
            { label: 'Scale', value: 'scale' },
            { label: 'Rotate', value: 'rotate' }
        ];

        const hoverOptions = [
            { label: 'None', value: 'none' },
            { label: 'Zoom', value: 'zoom' },
            { label: 'Slide', value: 'slide' },
            { label: 'Flip', value: 'flip' },
            { label: 'Shine', value: 'shine' }
        ];

        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody
                        title={__('Product Grid Enhancements', 'jankx')}
                        initialOpen={false}
                    >
                        <ToggleControl
                            label={__('Show Quick View', 'jankx')}
                            checked={showQuickView}
                            onChange={(value) => setAttributes({ showQuickView: value })}
                            help={__('Enable quick view functionality for products', 'jankx')}
                        />

                        <ToggleControl
                            label={__('Show Wishlist', 'jankx')}
                            checked={showWishlist}
                            onChange={(value) => setAttributes({ showWishlist: value })}
                            help={__('Enable wishlist functionality for products', 'jankx')}
                        />

                        <ToggleControl
                            label={__('Show Compare', 'jankx')}
                            checked={showCompare}
                            onChange={(value) => setAttributes({ showCompare: value })}
                            help={__('Enable product comparison functionality', 'jankx')}
                        />

                        <SelectControl
                            label={__('Animation Effect', 'jankx')}
                            value={animationEffect}
                            options={animationOptions}
                            onChange={(value) => setAttributes({ animationEffect: value })}
                            help={__('Choose animation effect for products', 'jankx')}
                        />

                        <SelectControl
                            label={__('Hover Effect', 'jankx')}
                            value={hoverEffect}
                            options={hoverOptions}
                            onChange={(value) => setAttributes({ hoverEffect: value })}
                            help={__('Choose hover effect for products', 'jankx')}
                        />
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withProductGridControls');

addFilter(
    'editor.BlockEdit',
    'jankx/enhance-product-grid',
    withProductGridControls
);
