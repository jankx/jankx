import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, useInnerBlocksProps, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, SelectControl, RangeControl, ColorPicker, Placeholder } from '@wordpress/components';
const BANNER_TEMPLATE = [
    ['core/heading', { level: 2, placeholder: __('Tiêu đề slide...', 'jankx'), textAlign: 'center' }],
    ['core/paragraph', { placeholder: __('Mô tả ngắn cho slide này...', 'jankx'), align: 'center' }],
];
export default function Edit({ attributes, setAttributes }) {
    const { imageId, imageUrl, imageAlt, imageCaption, linkUrl, linkTarget, bannerStyle, overlayOpacity, overlayColor, textAlign, textPosition, showCaption, height = 0, imageSize = 'cover' } = attributes;
    const blockProps = useBlockProps({
        className: `embla__slide embla-banner embla-banner--${bannerStyle} text-${textAlign} text-position-${textPosition} image-size-${imageSize}`
    });
    const innerBlocksProps = useInnerBlocksProps({ className: 'embla-banner__overlay-content' }, {
        template: BANNER_TEMPLATE,
        templateLock: false,
        renderAppender: InnerBlocks.ButtonBlockAppender,
    });
    const onSelectImage = (media) => {
        setAttributes({
            imageId: media.id,
            imageUrl: media.url,
            imageAlt: media.alt || '',
            imageCaption: media.caption || ''
        });
    };
    const removeImage = () => {
        setAttributes({
            imageId: 0,
            imageUrl: '',
            imageAlt: '',
            imageCaption: ''
        });
    };
    const imageStyles = imageUrl ? {
        backgroundImage: `url(${imageUrl})`,
        '--overlay-color': overlayColor,
        '--overlay-opacity': overlayOpacity,
        ...(imageSize === 'fullwidth'
            ? { backgroundSize: '100% 100%', backgroundPosition: 'center' }
            : imageSize === 'contain'
                ? { backgroundSize: 'contain' }
                : { backgroundSize: 'cover' })
    } : {};
    return (_jsxs("div", { ...blockProps, children: [_jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Image Settings', 'jankx'), initialOpen: true, children: [_jsx(MediaUploadCheck, { children: _jsx(MediaUpload, { onSelect: onSelectImage, allowedTypes: ['image'], value: imageId, render: ({ open }) => (_jsx(Button, { variant: "secondary", onClick: open, style: { width: '100%', marginBottom: '10px' }, children: imageUrl ? __('Change Image', 'jankx') : __('Select Image', 'jankx') })) }) }), imageUrl && (_jsx(Button, { variant: "link", isDestructive: true, onClick: removeImage, style: { width: '100%' }, children: __('Remove Image', 'jankx') })), imageUrl && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Image Size', 'jankx'), value: imageSize, options: [
                                            { label: __('Cover', 'jankx'), value: 'cover' },
                                            { label: __('Contain', 'jankx'), value: 'contain' },
                                            { label: __('Fullwidth', 'jankx'), value: 'fullwidth' }
                                        ], onChange: (val) => setAttributes({ imageSize: val }), help: __('Cover: Fill entire area, Contain: Fit entire image, Fullwidth: Stretch to 100% width and height', 'jankx') }), _jsx(TextControl, { label: __('Alt Text', 'jankx'), value: imageAlt, onChange: (val) => setAttributes({ imageAlt: val }), help: __('Describe the image for accessibility', 'jankx') })] }))] }), _jsxs(PanelBody, { title: __('Link Settings', 'jankx'), initialOpen: false, children: [_jsx(TextControl, { label: __('Link URL', 'jankx'), value: linkUrl, onChange: (val) => setAttributes({ linkUrl: val }), placeholder: __('https://example.com', 'jankx'), help: __('Optional link for the banner', 'jankx') }), _jsx(SelectControl, { label: __('Link Target', 'jankx'), value: linkTarget, options: [
                                    { label: __('Same Window', 'jankx'), value: '_self' },
                                    { label: __('New Window', 'jankx'), value: '_blank' }
                                ], onChange: (val) => setAttributes({ linkTarget: val }) })] }), _jsxs(PanelBody, { title: __('Style Settings', 'jankx'), initialOpen: false, children: [_jsx(SelectControl, { label: __('Banner Style', 'jankx'), value: bannerStyle, options: [
                                    { label: __('Banner', 'jankx'), value: 'banner' },
                                    { label: __('Circles', 'jankx'), value: 'circles' },
                                    { label: __('Square', 'jankx'), value: 'square' }
                                ], onChange: (val) => setAttributes({ bannerStyle: val }) }), bannerStyle === 'circles' && (_jsx(RangeControl, { label: __('Height (px)', 'jankx'), value: height || 0, onChange: (val) => setAttributes({ height: val || 0 }), min: 50, max: 1000, step: 10, help: __('Set height for circle banner. Width will automatically match height.', 'jankx') })), _jsx(SelectControl, { label: __('Content Alignment', 'jankx'), value: textAlign, options: [
                                    { label: __('Left', 'jankx'), value: 'left' },
                                    { label: __('Center', 'jankx'), value: 'center' },
                                    { label: __('Right', 'jankx'), value: 'right' }
                                ], onChange: (val) => setAttributes({ textAlign: val }) }), _jsx(SelectControl, { label: __('Content Position', 'jankx'), value: textPosition, options: [
                                    { label: __('Top', 'jankx'), value: 'top' },
                                    { label: __('Middle', 'jankx'), value: 'middle' },
                                    { label: __('Bottom', 'jankx'), value: 'bottom' }
                                ], onChange: (val) => setAttributes({ textPosition: val }) }), _jsx(RangeControl, { label: __('Overlay Opacity', 'jankx'), value: overlayOpacity, onChange: (val) => setAttributes({ overlayOpacity: val }), min: 0, max: 1, step: 0.1, help: __('Darkness of overlay over image (0 = none, 1 = fully dark)', 'jankx') }), _jsxs("div", { children: [_jsx("label", { children: __('Overlay Color', 'jankx') }), _jsx(ColorPicker, { color: overlayColor, onChange: (val) => setAttributes({ overlayColor: val }), disableAlpha: false })] })] })] }), imageUrl ? (_jsx("div", { className: `embla-banner__image image-size-${imageSize}`, style: imageStyles, "aria-hidden": "true" })) : (_jsx(Placeholder, { icon: "format-image", label: __('Carousel Banner', 'jankx'), instructions: __('Select a background image using the settings panel →', 'jankx'), className: "embla-banner__placeholder", children: _jsx(MediaUploadCheck, { children: _jsx(MediaUpload, { onSelect: onSelectImage, allowedTypes: ['image'], value: imageId, render: ({ open }) => (_jsx(Button, { variant: "primary", onClick: open, children: __('Select Image', 'jankx') })) }) }) })), imageUrl && overlayOpacity > 0 && (_jsx("div", { className: "embla-banner__overlay", style: {
                    backgroundColor: overlayColor,
                    opacity: overlayOpacity
                }, "aria-hidden": "true" })), _jsx("div", { ...innerBlocksProps })] }));
}
