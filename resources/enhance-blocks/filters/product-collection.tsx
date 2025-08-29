/**
 * WooCommerce Product Collection Block Filter
 * Add custom collections based on product categories
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, TextControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Product categories data (you can fetch this dynamically)
const PRODUCT_CATEGORIES = [
    { label: 'All Categories', value: '' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' },
    { label: 'Home & Garden', value: 'home-garden' },
    { label: 'Sports', value: 'sports' },
    { label: 'Beauty', value: 'beauty' },
    { label: 'Toys', value: 'toys' },
    { label: 'Automotive', value: 'automotive' },
    { label: 'Health', value: 'health' }
];

// Collection types
const COLLECTION_TYPES = [
    { label: 'Featured Products', value: 'featured' },
    { label: 'On Sale', value: 'on-sale' },
    { label: 'Best Sellers', value: 'best-sellers' },
    { label: 'New Arrivals', value: 'new-arrivals' },
    { label: 'Top Rated', value: 'top-rated' },
    { label: 'Recently Viewed', value: 'recently-viewed' }
];

// Add custom attributes to the block
addFilter(
    'blocks.registerBlockType',
    'jankx/enhance-product-collection',
    (settings, name) => {
        if (name !== 'woocommerce/product-collection') {
            return settings;
        }

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                customCategory: {
                    type: 'string',
                    default: ''
                },
                showCustomCollection: {
                    type: 'boolean',
                    default: false
                },
                customCollectionType: {
                    type: 'string',
                    default: 'featured'
                },
                customCollectionTitle: {
                    type: 'string',
                    default: ''
                },
                customCollectionLimit: {
                    type: 'number',
                    default: 4
                }
            }
        };
    }
);

// Add custom controls to the block
const withCustomControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'woocommerce/product-collection') {
            return <BlockEdit {...props} />;
        }

        const { attributes, setAttributes } = props;
        const {
            customCategory,
            showCustomCollection,
            customCollectionType,
            customCollectionTitle,
            customCollectionLimit
        } = attributes;

        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody
                        title={__('Custom Collection Settings', 'jankx')}
                        initialOpen={false}
                    >
                        <ToggleControl
                            label={__('Show Custom Collection', 'jankx')}
                            checked={showCustomCollection}
                            onChange={(value) => setAttributes({ showCustomCollection: value })}
                            help={__('Enable to show additional collection based on category', 'jankx')}
                        />

                        {showCustomCollection && (
                            <>
                                <SelectControl
                                    label={__('Product Category', 'jankx')}
                                    value={customCategory}
                                    options={PRODUCT_CATEGORIES}
                                    onChange={(value) => setAttributes({ customCategory: value })}
                                    help={__('Select a product category for the custom collection', 'jankx')}
                                />

                                <SelectControl
                                    label={__('Collection Type', 'jankx')}
                                    value={customCollectionType}
                                    options={COLLECTION_TYPES}
                                    onChange={(value) => setAttributes({ customCollectionType: value })}
                                    help={__('Choose the type of collection to display', 'jankx')}
                                />

                                <TextControl
                                    label={__('Collection Title', 'jankx')}
                                    value={customCollectionTitle}
                                    onChange={(value) => setAttributes({ customCollectionTitle: value })}
                                    help={__('Custom title for the collection (optional)', 'jankx')}
                                />

                                <RangeControl
                                    label={__('Number of Products', 'jankx')}
                                    value={customCollectionLimit}
                                    onChange={(value) => setAttributes({ customCollectionLimit: value })}
                                    min={1}
                                    max={12}
                                    step={1}
                                    help={__('Number of products to display in the collection', 'jankx')}
                                />
                            </>
                        )}
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withCustomControls');

addFilter(
    'editor.BlockEdit',
    'jankx/enhance-product-collection',
    withCustomControls
);

// Export for use in other files
export {
    PRODUCT_CATEGORIES,
    COLLECTION_TYPES
};
