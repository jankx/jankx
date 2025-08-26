import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    TextControl,
    SelectControl,
    ToggleControl,
    Button,
    RangeControl,
    PanelBody,
    PanelRow,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

interface ProductsCarouselAttributes {
    productIDs: string;
    align: string;
    queryOrder: string;
    columns: number;
    queryDisplayType: string;
    queryProducts: string;
    spaceBetween: number;
    autoplay: boolean;
    autoplaySpeed: number;
    loop: boolean;
    navigation: boolean;
    pagination: boolean;
}

interface EditProps {
    attributes: ProductsCarouselAttributes;
    setAttributes: (attributes: Partial<ProductsCarouselAttributes>) => void;
}

const Edit: React.FC<EditProps> = ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps();
    const {
        productIDs,
        columns,
        spaceBetween,
        autoplay,
        autoplaySpeed,
        loop,
        navigation,
        pagination,
        queryDisplayType
    } = attributes;

    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (queryDisplayType === 'all_products') {
            loadSampleProducts();
        }
    }, [queryDisplayType]);

    const loadSampleProducts = async () => {
        setIsLoading(true);
        try {
            const response = await apiFetch({
                path: '/wc/v3/products?per_page=6&status=publish'
            });
            setProducts(response);
        } catch (error) {
            // Fallback to sample data
            setProducts([
                { id: 1, name: 'Sample Book 1', price: '19.99', images: [] },
                { id: 2, name: 'Sample Book 2', price: '24.99', images: [] },
                { id: 3, name: 'Sample Book 3', price: '29.99', images: [] },
                { id: 4, name: 'Sample Book 4', price: '34.99', images: [] },
                { id: 5, name: 'Sample Book 5', price: '39.99', images: [] },
                { id: 6, name: 'Sample Book 6', price: '44.99', images: [] }
            ]);
        }
        setIsLoading(false);
    };

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Carousel Settings', 'jankx')} initialOpen={true}>
                    <PanelRow>
                        <SelectControl
                            label={__('Display Type', 'jankx')}
                            value={queryDisplayType}
                            options={[
                                { label: __('All Products', 'jankx'), value: 'all_products' },
                                { label: __('Specific Products', 'jankx'), value: 'specific' },
                                { label: __('Filter By', 'jankx'), value: 'filter_by' },
                                { label: __('By Category', 'jankx'), value: 'by_category' }
                            ]}
                            onChange={(value) => setAttributes({ queryDisplayType: value })}
                        />
                    </PanelRow>

                    <PanelRow>
                        <RangeControl
                            label={__('Columns', 'jankx')}
                            value={columns}
                            onChange={(value) => setAttributes({ columns: value })}
                            min={1}
                            max={6}
                        />
                    </PanelRow>

                    <PanelRow>
                        <RangeControl
                            label={__('Space Between', 'jankx')}
                            value={spaceBetween}
                            onChange={(value) => setAttributes({ spaceBetween: value })}
                            min={0}
                            max={100}
                        />
                    </PanelRow>

                    <PanelRow>
                        <ToggleControl
                            label={__('Autoplay', 'jankx')}
                            checked={autoplay}
                            onChange={(value) => setAttributes({ autoplay: value })}
                        />
                    </PanelRow>

                    {autoplay && (
                        <PanelRow>
                            <RangeControl
                                label={__('Autoplay Speed (ms)', 'jankx')}
                                value={autoplaySpeed}
                                onChange={(value) => setAttributes({ autoplaySpeed: value })}
                                min={1000}
                                max={10000}
                                step={500}
                            />
                        </PanelRow>
                    )}

                    <PanelRow>
                        <ToggleControl
                            label={__('Loop', 'jankx')}
                            checked={loop}
                            onChange={(value) => setAttributes({ loop: value })}
                        />
                    </PanelRow>

                    <PanelRow>
                        <ToggleControl
                            label={__('Navigation Arrows', 'jankx')}
                            checked={navigation}
                            onChange={(value) => setAttributes({ navigation: value })}
                        />
                    </PanelRow>

                    <PanelRow>
                        <ToggleControl
                            label={__('Pagination Dots', 'jankx')}
                            checked={pagination}
                            onChange={(value) => setAttributes({ pagination: value })}
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>

            <div className="wp-block-jankx-products-carousel">
                <div className="jankx-products-carousel-wrapper">
                    {isLoading ? (
                        <div className="loading-placeholder">
                            {__('Loading products...', 'jankx')}
                        </div>
                    ) : (
                        <div className="jankx-products-carousel" style={{ gap: `${spaceBetween}px` }}>
                            {products.map((product) => (
                                <div key={product.id} className="jankx-product-carousel-item">
                                    <div className="product-image">
                                        <div className="placeholder-image">
                                            {__('Book Cover', 'jankx')}
                                        </div>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-title">{product.name}</h4>
                                        <div className="product-price">${product.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {navigation && (
                    <div className="carousel-navigation">
                        <button className="nav-prev" disabled>
                            {__('‹', 'jankx')}
                        </button>
                        <button className="nav-next" disabled>
                            {__('›', 'jankx')}
                        </button>
                    </div>
                )}

                {pagination && (
                    <div className="carousel-pagination">
                        {Array.from({ length: Math.ceil(products.length / columns) }).map((_, index) => (
                            <span key={index} className="pagination-dot active"></span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const Save: React.FC = () => {
    return null; // Server-side rendering
};

registerBlockType('jankx/products-carousel', {
    title: __('Products Carousel', 'jankx'),
    icon: 'slides',
    category: 'widgets',
    description: __('Display a carousel of products with various filtering options.', 'jankx'),
    keywords: [__('products', 'jankx'), __('carousel', 'jankx'), __('slider', 'jankx'), __('woocommerce', 'jankx')],
    supports: {
        align: ['center', 'wide', 'full'],
        html: false
    },
    attributes: {
        productIDs: {
            type: 'string',
            default: ''
        },
        align: {
            type: 'string',
            default: 'center'
        },
        queryOrder: {
            type: 'string',
            default: ''
        },
        columns: {
            type: 'number',
            default: 3
        },
        queryDisplayType: {
            type: 'string',
            default: 'all_products'
        },
        queryProducts: {
            type: 'string',
            default: 'wc/v3/products?per_page=10'
        },
        spaceBetween: {
            type: 'number',
            default: 20
        },
        autoplay: {
            type: 'boolean',
            default: false
        },
        autoplaySpeed: {
            type: 'number',
            default: 3000
        },
        loop: {
            type: 'boolean',
            default: true
        },
        navigation: {
            type: 'boolean',
            default: true
        },
        pagination: {
            type: 'boolean',
            default: true
        }
    },
    edit: Edit,
    save: Save
});
