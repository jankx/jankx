import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    TextControl,
    SelectControl,
    ToggleControl,
    RangeControl,
    PanelBody,
    PanelRow,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { useBlockProps } from '@wordpress/block-editor';

interface LookbookRevealAttributes {
    title: string;
    description: string;
    products: any[];
    columns: number;
    revealEffect: string;
    autoplay: boolean;
    autoplaySpeed: number;
}

interface EditProps {
    attributes: LookbookRevealAttributes;
    setAttributes: (attributes: Partial<LookbookRevealAttributes>) => void;
}

const Edit: React.FC<EditProps> = ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps();
    const { title, description, columns, revealEffect, autoplay, autoplaySpeed } = attributes;

    const sampleProducts = [
        { id: 1, name: 'Fashion Book 1', price: '29.99' },
        { id: 2, name: 'Fashion Book 2', price: '34.99' },
        { id: 3, name: 'Fashion Book 3', price: '39.99' },
        { id: 4, name: 'Fashion Book 4', price: '44.99' },
        { id: 5, name: 'Fashion Book 5', price: '49.99' },
        { id: 6, name: 'Fashion Book 6', price: '54.99' }
    ];

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Lookbook Settings', 'jankx')} initialOpen={true}>
                    <PanelRow>
                        <TextControl
                            label={__('Title', 'jankx')}
                            value={title}
                            onChange={(value) => setAttributes({ title: value })}
                        />
                    </PanelRow>

                    <PanelRow>
                        <TextControl
                            label={__('Description', 'jankx')}
                            value={description}
                            onChange={(value) => setAttributes({ description: value })}
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
                        <SelectControl
                            label={__('Reveal Effect', 'jankx')}
                            value={revealEffect}
                            options={[
                                { label: __('Fade', 'jankx'), value: 'fade' },
                                { label: __('Slide', 'jankx'), value: 'slide' },
                                { label: __('Zoom', 'jankx'), value: 'zoom' }
                            ]}
                            onChange={(value) => setAttributes({ revealEffect: value })}
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
                                min={2000}
                                max={10000}
                                step={1000}
                            />
                        </PanelRow>
                    )}
                </PanelBody>
            </InspectorControls>

            <div className="wp-block-jankx-lookbook-reveal">
                <div className="lookbook-header">
                    <h2 className="lookbook-title">{title}</h2>
                    <p className="lookbook-description">{description}</p>
                </div>

                <div className="lookbook-grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                    {sampleProducts.map((product) => (
                        <div key={product.id} className="lookbook-item">
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

registerBlockType('jankx/lookbook-reveal', {
    title: __('Lookbook Reveal', 'jankx'),
    icon: 'visibility',
    category: 'widgets',
    description: __('Interactive lookbook with reveal functionality for product discovery.', 'jankx'),
    keywords: [__('lookbook', 'jankx'), __('reveal', 'jankx'), __('interactive', 'jankx'), __('products', 'jankx')],
    supports: {
        align: ['center', 'wide', 'full'],
        html: false
    },
    attributes: {
        title: {
            type: 'string',
            default: 'Lookbook Collection'
        },
        description: {
            type: 'string',
            default: 'Discover our latest collection'
        },
        products: {
            type: 'array',
            default: []
        },
        columns: {
            type: 'number',
            default: 3
        },
        revealEffect: {
            type: 'string',
            default: 'fade'
        },
        autoplay: {
            type: 'boolean',
            default: false
        },
        autoplaySpeed: {
            type: 'number',
            default: 5000
        }
    },
    edit: Edit,
    save: Save
});
