import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, ColorPicker } from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }: any) {
    const { displayType = 'absolute', position, offsetX, offsetY, backgroundColor, textColor, borderRadius, showLabel } = attributes;
    
    // Prepare styles for preview
    const style: React.CSSProperties = {
        backgroundColor,
        color: textColor,
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
        padding: '8px 12px',
        fontWeight: 700,
        fontSize: '12px',
        textTransform: 'uppercase',
        boxShadow: displayType === 'absolute' ? '0 4px 10px rgba(0,0,0,0.12)' : 'none',
        lineHeight: 1,
        display: 'inline-block',
    };

    if (displayType === 'absolute') {
        style.position = 'absolute';
        if (position.includes('top')) style.top = offsetY;
        else style.bottom = offsetY;
        
        if (position.includes('right')) style.right = offsetX;
        else style.left = offsetX;
        style.zIndex = 20;
    } else {
        style.position = 'static';
        style.marginBottom = '0.5em';
    }

    const blockProps = useBlockProps({
        className: `jankx-post-type-badge ${displayType === 'absolute' ? `position-${position}` : 'display-normal'}`,
        style: displayType === 'absolute' ? { position: 'relative', minHeight: '50px', border: '1px dashed #ddd' } : {}
    });

    return (
        <div { ...blockProps }>
            <InspectorControls>
                <PanelBody title={__('Position & Style', 'jankx')} initialOpen>
                    <SelectControl
                        label={__('Display Type', 'jankx')}
                        value={displayType}
                        options={[
                            { label: __('Absolute', 'jankx'), value: 'absolute' },
                            { label: __('Normal', 'jankx'), value: 'normal' },
                        ]}
                        onChange={(value: string) => setAttributes({ displayType: value })}
                    />
                    
                    {displayType === 'absolute' && (
                        <>
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
                        </>
                    )}

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

            {displayType === 'absolute' ? (
                <>
                    <div style={style}>
                        {__('Post Type', 'jankx')}
                    </div>
                    <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>
                        {__('Post Content Area', 'jankx')}
                    </div>
                </>
            ) : (
                <div style={style}>
                    {__('Post Type', 'jankx')}
                </div>
            )}
        </div>
    );
}
