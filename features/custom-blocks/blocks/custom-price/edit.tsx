import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
    const { metaKey, customMetaKey, currencySymbol } = attributes;
    
    // Default meta key options
    const defaultOptions = [
        { label: __('Price (_price)', 'jankx'), value: '_price' },
        { label: __('Regular Price (_regular_price)', 'jankx'), value: '_regular_price' },
        { label: __('Sale Price (_sale_price)', 'jankx'), value: '_sale_price' },
        { label: __('Custom Key', 'jankx'), value: 'custom' },
    ];

    const blockProps = useBlockProps({
        className: 'jankx-custom-price-block'
    });

    // Preview value
    const priceValue = '2.500.000';

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Price Settings', 'jankx')}>
                    <SelectControl
                        label={__('Select Price Meta Key', 'jankx')}
                        value={metaKey}
                        options={defaultOptions}
                        onChange={(value) => setAttributes({ metaKey: value })}
                    />
                    
                    {metaKey === 'custom' && (
                        <TextControl
                            label={__('Enter Custom Meta Key', 'jankx')}
                            value={customMetaKey}
                            onChange={(value) => setAttributes({ customMetaKey: value })}
                            help={__('Enter the meta key to retrieve the price from.', 'jankx')}
                        />
                    )}

                    <TextControl
                        label={__('Currency Symbol', 'jankx')}
                        value={currencySymbol}
                        onChange={(value) => setAttributes({ currencySymbol: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div className="jankx-custom-price">
                <span className="price-amount">{priceValue}</span>
                <span className="currency-symbol">{currencySymbol}</span>
            </div>
        </div>
    );
}
