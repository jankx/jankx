import { __ } from '@wordpress/i18n';
import { InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } from '@wordpress/block-editor';
import { Button, ColorPicker, PanelBody, RangeControl, SelectControl, ToggleControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }: any): JSX.Element {
    const {
        section = 'footer',
        headingUnderline = 'ornament',
        underlineColor = '',
        underlineWidth = 48,
        afterBackgroundColor = '',
        afterBackgroundImage = '',
        afterBackgroundSize = 'auto',
        afterOpacity = 1,
        afterHeight = 72,
        afterPosition = 'bottom',
        afterLayer = 'behind',
    } = attributes;

    const blockProps = useBlockProps({
        className: `jankx-site-decoration jankx-site-decoration--${section} jankx-site-decoration--underline-${headingUnderline} jankx-site-decoration--after-${afterPosition} jankx-site-decoration--layer-${afterLayer}`,
        style: {
            '--jankx-decoration-underline-color': underlineColor || undefined,
            '--jankx-decoration-underline-width': `${underlineWidth}px`,
            '--jankx-decoration-after-color': afterBackgroundColor || undefined,
            '--jankx-decoration-after-image': afterBackgroundImage ? `url(${afterBackgroundImage})` : undefined,
            '--jankx-decoration-after-size': afterBackgroundSize,
            '--jankx-decoration-after-opacity': afterOpacity,
            '--jankx-decoration-after-height': `${afterHeight}px`,
            '--jankx-decoration-after-position': afterPosition,
            '--jankx-decoration-after-z-index': afterLayer === 'front' ? 1 : -1,
        } as any,
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Decoration', 'jankx')} initialOpen>
                    <SelectControl
                        label={__('Section', 'jankx')}
                        value={section}
                        options={[
                            { label: __('Footer', 'jankx'), value: 'footer' },
                            { label: __('Header', 'jankx'), value: 'header' },
                            { label: __('Cover', 'jankx'), value: 'cover' },
                        ]}
                        onChange={(value) => setAttributes({ section: value })}
                    />
                    <SelectControl
                        label={__('Heading underline', 'jankx')}
                        value={headingUnderline}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('Solid', 'jankx'), value: 'solid' },
                            { label: __('Double', 'jankx'), value: 'double' },
                            { label: __('Dotted', 'jankx'), value: 'dotted' },
                            { label: __('Ornament', 'jankx'), value: 'ornament' },
                        ]}
                        onChange={(value) => setAttributes({ headingUnderline: value })}
                    />
                    {headingUnderline !== 'none' && (
                        <>
                            <RangeControl
                                label={__('Underline width', 'jankx')}
                                value={underlineWidth}
                                min={12}
                                max={180}
                                onChange={(value) => setAttributes({ underlineWidth: value || 48 })}
                            />
                            <ColorPicker
                                color={underlineColor || '#d9a441'}
                                onChangeComplete={(value) => setAttributes({ underlineColor: value.hex })}
                                disableAlpha
                            />
                        </>
                    )}
                </PanelBody>
                <PanelBody title={__('Header after background', 'jankx')} initialOpen={false}>
                    <ColorPicker
                        color={afterBackgroundColor || '#d9a441'}
                        onChangeComplete={(value) => setAttributes({ afterBackgroundColor: value.hex })}
                        disableAlpha
                    />
                    <MediaUploadCheck>
                        <MediaUpload
                            allowedTypes={['image']}
                            value={afterBackgroundImage ? undefined : 0}
                            onSelect={(media) => setAttributes({ afterBackgroundImage: media.url })}
                            render={({ open }) => (
                                <Button variant="secondary" onClick={open}>
                                    {afterBackgroundImage ? __('Replace ornament image', 'jankx') : __('Choose ornament image', 'jankx')}
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                    {afterBackgroundImage && (
                        <Button isDestructive onClick={() => setAttributes({ afterBackgroundImage: '' })}>
                            {__('Remove ornament image', 'jankx')}
                        </Button>
                    )}
                    <SelectControl
                        label={__('Image size', 'jankx')}
                        value={afterBackgroundSize}
                        options={[
                            { label: __('Original', 'jankx'), value: 'auto' },
                            { label: __('Cover', 'jankx'), value: 'cover' },
                            { label: __('Contain', 'jankx'), value: 'contain' },
                        ]}
                        onChange={(value) => setAttributes({ afterBackgroundSize: value })}
                    />
                    <RangeControl label={__('Opacity', 'jankx')} value={afterOpacity} min={0} max={1} step={0.05} onChange={(value) => setAttributes({ afterOpacity: value ?? 1 })} />
                    <RangeControl label={__('Height', 'jankx')} value={afterHeight} min={8} max={240} onChange={(value) => setAttributes({ afterHeight: value || 72 })} />
                    <SelectControl
                        label={__('Position', 'jankx')}
                        value={afterPosition}
                        options={[{ label: __('Top', 'jankx'), value: 'top' }, { label: __('Bottom', 'jankx'), value: 'bottom' }]}
                        onChange={(value) => setAttributes({ afterPosition: value })}
                    />
                    <ToggleControl
                        label={__('Place ornament in front', 'jankx')}
                        checked={afterLayer === 'front'}
                        onChange={(value) => setAttributes({ afterLayer: value ? 'front' : 'behind' })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <InnerBlocks templateLock={false} />
            </div>
        </>
    );
}
