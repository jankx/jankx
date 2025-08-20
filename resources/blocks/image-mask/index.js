import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    PanelBody,
    SelectControl,
    RangeControl,
    ColorPicker,
    Button,
    TextControl
} from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { 
    mediaUpload, 
    mediaUploadCheck 
} from '@wordpress/block-editor';

/**
 * Image Mask Block Editor Component
 */
function ImageMaskEdit({ attributes, setAttributes }) {
    const {
        imageId,
        imageUrl,
        imageAlt,
        maskType,
        waveDirection,
        waveHeight,
        waveFrequency,
        cornerPosition,
        cornerSize,
        backgroundColor,
        customMask
    } = attributes;

    const [isImageSelected, setIsImageSelected] = useState(!!imageUrl);

    const blockProps = useBlockProps({
        className: `image-mask-block ${attributes.className || ''}`
    });

    const onSelectImage = (media) => {
        setAttributes({
            imageId: media.id,
            imageUrl: media.url,
            imageAlt: media.alt || media.title || 'Image'
        });
        setIsImageSelected(true);
    };

    const removeImage = () => {
        setAttributes({
            imageId: null,
            imageUrl: '',
            imageAlt: ''
        });
        setIsImageSelected(false);
    };

    const renderImageUpload = () => {
        if (!isImageSelected) {
            return (
                <MediaUploadCheck>
                    <MediaUpload
                        onSelect={onSelectImage}
                        allowedTypes={['image']}
                        value={imageId}
                        render={({ open }) => (
                            <div className="image-mask-upload">
                                <Button
                                    onClick={open}
                                    variant="secondary"
                                    className="image-mask-upload-button"
                                >
                                    {__('Choose Image', 'jankx')}
                                </Button>
                                <p>{__('Select an image to apply mask effects', 'jankx')}</p>
                            </div>
                        )}
                    />
                </MediaUploadCheck>
            );
        }

        return (
            <div className="image-mask-preview">
                <img 
                    src={imageUrl} 
                    alt={imageAlt}
                    className="image-mask-image"
                />
                <div className="image-mask-overlay">
                    <div className="image-mask-controls">
                        <Button
                            onClick={removeImage}
                            variant="secondary"
                            isSmall
                        >
                            {__('Remove Image', 'jankx')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const renderMaskPreview = () => {
        if (!imageUrl) return null;

        const maskStyles = {
            '--mask-type': maskType,
            '--wave-direction': waveDirection,
            '--wave-height': `${waveHeight}px`,
            '--wave-frequency': waveFrequency,
            '--corner-position': cornerPosition,
            '--corner-size': `${cornerSize}px`,
            '--background-color': backgroundColor
        };

        return (
            <div className="image-mask-preview-container" style={maskStyles}>
                <div className="image-mask-wrapper">
                    <img 
                        src={imageUrl} 
                        alt={imageAlt}
                        className="image-mask-image"
                    />
                    <div className={`image-mask-effect image-mask-${maskType}`}></div>
                </div>
            </div>
        );
    };

    return (
        <>
            <InspectorControls>
                <PanelBody
                    title={__('Image Settings', 'jankx')}
                    initialOpen={true}
                >
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectImage}
                            allowedTypes={['image']}
                            value={imageId}
                            render={({ open }) => (
                                <Button
                                    onClick={open}
                                    variant="secondary"
                                    isFullWidth
                                >
                                    {imageUrl ? __('Change Image', 'jankx') : __('Choose Image', 'jankx')}
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                    
                    {imageUrl && (
                        <Button
                            onClick={removeImage}
                            variant="link"
                            isDestructive
                            isFullWidth
                        >
                            {__('Remove Image', 'jankx')}
                        </Button>
                    )}
                </PanelBody>

                <PanelBody
                    title={__('Mask Effects', 'jankx')}
                    initialOpen={true}
                >
                    <SelectControl
                        label={__('Mask Type', 'jankx')}
                        value={maskType}
                        options={[
                            { label: __('Wave', 'jankx'), value: 'wave' },
                            { label: __('Corner Blend', 'jankx'), value: 'corner' },
                            { label: __('Circle', 'jankx'), value: 'circle' },
                            { label: __('Triangle', 'jankx'), value: 'triangle' },
                            { label: __('Custom SVG', 'jankx'), value: 'custom' }
                        ]}
                        onChange={(value) => setAttributes({ maskType: value })}
                    />

                    {maskType === 'wave' && (
                        <>
                            <SelectControl
                                label={__('Wave Direction', 'jankx')}
                                value={waveDirection}
                                options={[
                                    { label: __('Top', 'jankx'), value: 'top' },
                                    { label: __('Bottom', 'jankx'), value: 'bottom' },
                                    { label: __('Left', 'jankx'), value: 'left' },
                                    { label: __('Right', 'jankx'), value: 'right' }
                                ]}
                                onChange={(value) => setAttributes({ waveDirection: value })}
                            />
                            
                            <RangeControl
                                label={__('Wave Height', 'jankx')}
                                value={waveHeight}
                                onChange={(value) => setAttributes({ waveHeight: value })}
                                min={10}
                                max={200}
                                step={5}
                            />
                            
                            <RangeControl
                                label={__('Wave Frequency', 'jankx')}
                                value={waveFrequency}
                                onChange={(value) => setAttributes({ waveFrequency: value })}
                                min={1}
                                max={10}
                                step={0.5}
                            />
                        </>
                    )}

                    {maskType === 'corner' && (
                        <>
                            <SelectControl
                                label={__('Corner Position', 'jankx')}
                                value={cornerPosition}
                                options={[
                                    { label: __('Top Left', 'jankx'), value: 'top-left' },
                                    { label: __('Top Right', 'jankx'), value: 'top-right' },
                                    { label: __('Bottom Left', 'jankx'), value: 'bottom-left' },
                                    { label: __('Bottom Right', 'jankx'), value: 'bottom-right' }
                                ]}
                                onChange={(value) => setAttributes({ cornerPosition: value })}
                            />
                            
                            <RangeControl
                                label={__('Corner Size', 'jankx')}
                                value={cornerSize}
                                onChange={(value) => setAttributes({ cornerSize: value })}
                                min={50}
                                max={300}
                                step={10}
                            />
                        </>
                    )}

                    <div className="image-mask-color-picker">
                        <label>{__('Background Color', 'jankx')}</label>
                        <ColorPicker
                            color={backgroundColor}
                            onChange={(color) => setAttributes({ backgroundColor: color })}
                            enableAlpha={true}
                        />
                    </div>

                    {maskType === 'custom' && (
                        <TextControl
                            label={__('Custom SVG Path', 'jankx')}
                            value={customMask}
                            onChange={(value) => setAttributes({ customMask: value })}
                            help={__('Enter SVG path data (e.g., M0,0 L100,100 Z)', 'jankx')}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {renderImageUpload()}
                {renderMaskPreview()}
            </div>
        </>
    );
}

// Register the block
registerBlockType('jankx/image-mask', {
    edit: ImageMaskEdit,
    save: () => null, // Dynamic block, no save needed
});
