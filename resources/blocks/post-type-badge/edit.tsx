import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, ColorPicker } from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }: any) {
    const { position, offsetX, offsetY, backgroundColor, textColor, borderRadius, showLabel } = attributes;
    const blockProps = useBlockProps();

    return (
        <div { ...blockProps }>
            <InspectorControls>
                <PanelBody title={__('Position & Style', 'jankx')} initialOpen>
                    <SelectControl
                        label={__('Position', 'jankx')}
                        value={position}
                        options={[
                            { label: __('Top Right', 'jankx'), value: 'top-right' },
                            { label: __('Top Left', 'jankx'), value: 'top-left' },
                            { label: __('Bottom Right', 'jankx'), value: 'bottom-right' },
                            { label: __('Bottom Left', 'jankx'), value: 'bottom-left' },
                        ]}
                        onChange={(value: string) => setAttributes({ position: value })}
                    />

                    <TextControl
                        label={__('Offset X (eg. 12px)', 'jankx')}
                        value={offsetX}
                        onChange={(value: string) => setAttributes({ offsetX: value })}
                    />
                    <TextControl
                        label={__('Offset Y (eg. 12px)', 'jankx')}
                        value={offsetY}
                        onChange={(value: string) => setAttributes({ offsetY: value })}
                    />

                    <div style={{ marginTop: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '6px' }}>{__('Background Color', 'jankx')}</label>
                        <ColorPicker
                            color={backgroundColor}
                            onChangeComplete={(value: any) => setAttributes({ backgroundColor: value.hex })}
                        />
                    </div>

                    <div style={{ marginTop: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '6px' }}>{__('Text Color', 'jankx')}</label>
                        <ColorPicker
                            color={textColor}
                            onChangeComplete={(value: any) => setAttributes({ textColor: value.hex })}
                        />
                    </div>

                    <TextControl
                        label={__('Border radius (px)', 'jankx')}
                        type="number"
                        value={borderRadius}
                        onChange={(value: string) => setAttributes({ borderRadius: parseInt(value) || 0 })}
                    />
                </PanelBody>
            </InspectorControls>

            <div style={{ padding: '8px', border: '1px dashed #ddd', borderRadius: 6 }}>
                <strong>{__('Post Type Badge', 'jankx')}</strong>
                <div style={{ marginTop: 8 }}>{__('This block will display current post type in loop items.', 'jankx')}</div>
            </div>
        </div>
    );
}
