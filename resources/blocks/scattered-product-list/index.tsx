import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    TextControl,
    ToggleControl,
    RangeControl,
    SelectControl,
    PanelBody,
    PanelRow,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { useBlockProps } from '@wordpress/block-editor';

interface ScatteredProductListAttributes {
    title: string;
    products: any[];
    columns: number;
    gap: number;
    masonry: boolean;
    animation: string;
}

interface EditProps {
    attributes: ScatteredProductListAttributes;
    setAttributes: (attributes: Partial<ScatteredProductListAttributes>) => void;
}

const Edit: React.FC<EditProps> = ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps();
    const { title, columns, gap, masonry, animation } = attributes;

    const sampleProducts = [
        { id: 1, name: 'Book Title 1', price: '19.99', height: 'tall' },
        { id: 2, name: 'Book Title 2', price: '24.99', height: 'short' },
        { id: 3, name: 'Book Title 3', price: '29.99', height: 'medium' },
        { id: 4, name: 'Book Title 4', price: '34.99', height: 'tall' },
        { id: 5, name: 'Book Title 5', price: '39.99', height: 'short' },
        { id: 6, name: 'Book Title 6', price: '44.99', height: 'medium' },
        { id: 7, name: 'Book Title 7', price: '49.99', height: 'tall' },
        { id: 8, name: 'Book Title 8', price: '54.99', height: 'short' }
    ];

    const getHeightClass = (height: string) => {
        switch (height) {
            case 'tall': return 'height-tall';
            case 'short': return 'height-short';
            default: return 'height-medium';
        }
    };

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Layout Settings', 'jankx')} initialOpen={true}>
                    <PanelRow>
                        <TextControl
                            label={__('Title', 'jankx')}
                            value={title}
                            onChange={(value) => setAttributes({ title: value })}
                        />
                    </PanelRow>

                    <PanelRow>
                        <RangeControl
                            label={__('Columns', 'jankx')}
                            value={columns}
                            onChange={(value) => setAttributes({ columns: value })}
                            min={2}
                            max={6}
                        />
                    </PanelRow>

                    <PanelRow>
                        <RangeControl
                            label={__('Gap', 'jankx')}
                            value={gap}
                            onChange={(value) => setAttributes({ gap: value })}
                            min={0}
                            max={50}
                        />
                    </PanelRow>

                    <PanelRow>
                        <ToggleControl
                            label={__('Masonry Layout', 'jankx')}
                            checked={masonry}
                            onChange={(value) => setAttributes({ masonry: value })}
                        />
                    </PanelRow>

                    <PanelRow>
                        <SelectControl
                            label={__('Animation', 'jankx')}
                            value={animation}
                            options={[
                                { label: __('Fade In', 'jankx'), value: 'fade-in' },
                                { label: __('Slide Up', 'jankx'), value: 'slide-up' },
                                { label: __('Zoom In', 'jankx'), value: 'zoom-in' }
                            ]}
                            onChange={(value) => setAttributes({ animation: value })}
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>

            <div className="wp-block-jankx-scattered-product-list">
                <h2 className="section-title">{title}</h2>

                <div
                    className={`products-grid ${masonry ? 'masonry' : 'grid'}`}
                    style={{
                        gridTemplateColumns: `repeat(${columns}, 1fr)`,
                        gap: `${gap}px`
                    }}
                >
                    {sampleProducts.map((product) => (
                        <div
                            key={product.id}
                            className={`product-item ${getHeightClass(product.height)}`}
                        >
                            <div className="product-image">
                                <div className="placeholder-image">
                                    {__('Book Cover', 'jankx')}
                                </div>
                            </div>
                            <div className="product-info">
                                <h3 className="product-title">{product.name}</h3>
                                <div className="product-price">${product.price}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Save: React.FC = () => {
    return null; // Server-side rendering
};

registerBlockType('jankx/scattered-product-list', {
    title: __('Scattered Product List', 'jankx'),
    icon: 'grid-view',
    category: 'widgets',
    description: __('Display products in a scattered, masonry-style layout.', 'jankx'),
    keywords: [__('products', 'jankx'), __('scattered', 'jankx'), __('masonry', 'jankx'), __('layout', 'jankx')],
    supports: {
        align: ['center', 'wide', 'full'],
        html: false
    },
    attributes: {
        title: {
            type: 'string',
            default: 'Featured Products'
        },
        products: {
            type: 'array',
            default: []
        },
        columns: {
            type: 'number',
            default: 4
        },
        gap: {
            type: 'number',
            default: 20
        },
        masonry: {
            type: 'boolean',
            default: true
        },
        animation: {
            type: 'string',
            default: 'fade-in'
        }
    },
    edit: Edit,
    save: Save
});
