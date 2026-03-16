import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
    const { metaKey, customMetaKey, maxPriceMetaKey, maxPriceCustomMetaKey, currencySymbol, emptyText, numberFormat } = attributes;
    
    // Default meta key options
    const defaultOptions = [
        { label: __('Price (_price)', 'jankx'), value: '_price' },
        { label: __('Regular Price (_regular_price)', 'jankx'), value: '_regular_price' },
        { label: __('Sale Price (_sale_price)', 'jankx'), value: '_sale_price' },
        { label: __('Custom Key', 'jankx'), value: 'custom' },
    ];
    const maxOptions = [
        { label: __('None', 'jankx'), value: 'none' },
        { label: __('Max Price (_price_max)', 'jankx'), value: '_price_max' },
        { label: __('Custom Key', 'jankx'), value: 'custom' },
    ];

    const blockProps = useBlockProps({
        className: 'jankx-custom-price-block'
    });

    const formatOptions = [
        { label: __('Vietnamese (vi-VN)', 'jankx'), value: 'vi-VN' },
        { label: __('English (en-US)', 'jankx'), value: 'en-US' },
    ];

    // Preview value based on numberFormat
    const previewNumber = 2500000;
    const priceValue = (() => {
        try {
            return new Intl.NumberFormat(numberFormat || 'vi-VN', { maximumFractionDigits: 0 }).format(previewNumber);
        } catch (e) {
            return '2.500.000';
        }
    })();

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

                    <SelectControl
                        label={__('Select Max Price Meta Key', 'jankx')}
                        value={maxPriceMetaKey}
                        options={maxOptions}
                        onChange={(value) => setAttributes({ maxPriceMetaKey: value })}
                        help={__('Choose to show a price range', 'jankx')}
                    />
                    {maxPriceMetaKey === 'custom' && (
                        <TextControl
                            label={__('Enter Custom Max Price Key', 'jankx')}
                            value={maxPriceCustomMetaKey}
                            onChange={(value) => setAttributes({ maxPriceCustomMetaKey: value })}
                            help={__('Enter the meta key for max price.', 'jankx')}
                        />
                    )}

                    <TextControl
                        label={__('Currency Symbol', 'jankx')}
                        value={currencySymbol}
                        onChange={(value) => setAttributes({ currencySymbol: value })}
                    />
                    <TextControl
                        label={__('Empty Price Text', 'jankx')}
                        value={emptyText}
                        onChange={(value) => setAttributes({ emptyText: value })}
                        help={__('Shown when price is empty or 0', 'jankx')}
                    />
                    <SelectControl
                        label={__('Number Format', 'jankx')}
                        value={numberFormat}
                        options={formatOptions}
                        onChange={(value) => setAttributes({ numberFormat: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div className="jankx-custom-price">
                <span className="price-amount">{priceValue || emptyText}</span>
                {priceValue ? <span className="currency-symbol">{currencySymbol}</span> : null}
            </div>
        </div>
    );
}
