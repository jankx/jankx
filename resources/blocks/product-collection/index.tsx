/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './style.scss';

interface ProductCollectionAttributes {
    columns: number;
    rows: number;
    orderby: string;
    order: 'ASC' | 'DESC';
    categories: number[];
    tags: number[];
    productsToShow: number;
    align: string;
}

const ProductCollectionEdit = ({ attributes, setAttributes }: {
    attributes: ProductCollectionAttributes;
    setAttributes: (attributes: Partial<ProductCollectionAttributes>) => void;
}) => {
    const blockProps = useBlockProps();

    const orderByOptions = [
        { label: __('Date', 'cheephub'), value: 'date' },
        { label: __('Title', 'cheephub'), value: 'title' },
        { label: __('Price', 'cheephub'), value: 'price' },
        { label: __('Popularity', 'cheephub'), value: 'popularity' },
        { label: __('Rating', 'cheephub'), value: 'rating' },
    ];

    const orderOptions = [
        { label: __('Descending', 'cheephub'), value: 'DESC' },
        { label: __('Ascending', 'cheephub'), value: 'ASC' },
    ];

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Layout Settings', 'cheephub')}>
                    <RangeControl
                        label={__('Columns', 'cheephub')}
                        value={attributes.columns}
                        onChange={(columns) => columns && setAttributes({ columns })}
                        min={1}
                        max={6}
                    />
                    <RangeControl
                        label={__('Rows', 'cheephub')}
                        value={attributes.rows}
                        onChange={(rows) => rows && setAttributes({ rows })}
                        min={1}
                        max={6}
                    />
                </PanelBody>
                <PanelBody title={__('Query Settings', 'cheephub')}>
                    <SelectControl
                        label={__('Order By', 'cheephub')}
                        value={attributes.orderby}
                        options={orderByOptions}
                        onChange={(orderby) => orderby && setAttributes({ orderby })}
                    />
                    <SelectControl
                        label={__('Order', 'cheephub')}
                        value={attributes.order}
                        options={orderOptions}
                        onChange={(order) => order && setAttributes({ order: order as 'ASC' | 'DESC' })}
                    />
                    <RangeControl
                        label={__('Products to Show', 'cheephub')}
                        value={attributes.productsToShow}
                        onChange={(productsToShow) => productsToShow && setAttributes({ productsToShow })}
                        min={1}
                        max={50}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <div className="product-collection-preview">
                    <h3>{__('Product Collection', 'cheephub')}</h3>
                    <p>
                        {__('This block will display', 'cheephub')} {attributes.productsToShow} {__('products in a', 'cheephub')} {attributes.columns}x{attributes.rows} {__('grid layout.', 'cheephub')}
                    </p>
                    <p>
                        {__('Ordered by', 'cheephub')} {orderByOptions.find(opt => opt.value === attributes.orderby)?.label} {__('in', 'cheephub')} {orderOptions.find(opt => opt.value === attributes.order)?.label} {__('order.', 'cheephub')}
                    </p>
                </div>
            </div>
        </>
    );
};

const ProductCollectionSave = () => {
    return null; // Dynamic block, rendered by PHP
};

registerBlockType('cheephub/product-collection', {
    title: __('Product Collection', 'cheephub'),
    description: __('Display a collection of WooCommerce products.', 'cheephub'),
    category: 'woocommerce',
    icon: 'grid-view',
    supports: {
        align: ['wide', 'full'],
        html: false,
    },
    attributes: {
        columns: {
            type: 'number',
            default: 3,
        },
        rows: {
            type: 'number',
            default: 3,
        },
        orderby: {
            type: 'string',
            default: 'date',
        },
        order: {
            type: 'string',
            default: 'DESC',
        },
        categories: {
            type: 'array',
            default: [],
        },
        tags: {
            type: 'array',
            default: [],
        },
        productsToShow: {
            type: 'number',
            default: 9,
        },
        align: {
            type: 'string',
            default: 'wide',
        },
    },
    edit: ProductCollectionEdit,
    save: ProductCollectionSave,
});
