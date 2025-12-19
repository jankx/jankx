import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, SelectControl, RangeControl, ToggleControl, ColorPicker, Placeholder } from '@wordpress/components';
export default function Edit({ attributes, setAttributes }) {
    const { imageId, imageUrl, imageAlt, imageCaption, linkUrl, linkTarget, bannerStyle, overlayOpacity, overlayColor, textAlign, textPosition, showCaption, height = 0, imageSize = 'cover' } = attributes;
    const blockProps = useBlockProps({
        className: `swiper-slide swiper-banner swiper-banner--${bannerStyle} text-${textAlign} text-position-${textPosition} image-size-${imageSize}`
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
    const renderImage = () => {
        if (!imageUrl) {
            return (_jsx(Placeholder, { icon: "format-image", label: __('Swiper Banner', 'jankx'), instructions: __('Select an image to create a banner slide', 'jankx'), children: _jsx(MediaUploadCheck, { children: _jsx(MediaUpload, { onSelect: onSelectImage, allowedTypes: ['image'], value: imageId, render: ({ open }) => (_jsx(Button, { variant: "primary", onClick: open, children: __('Select Image', 'jankx') })) }) }) }));
        }
        const imageStyles = {
            backgroundImage: `url(${imageUrl})`,
            '--overlay-color': overlayColor,
            '--overlay-opacity': overlayOpacity
        };
        // Apply fullwidth styles
        if (imageSize === 'fullwidth') {
            imageStyles.backgroundSize = '100% 100%';
            imageStyles.backgroundPosition = 'center';
        }
        else if (imageSize === 'contain') {
            imageStyles.backgroundSize = 'contain';
        }
        else {
            imageStyles.backgroundSize = 'cover';
        }
        return (_jsx("div", { className: `swiper-banner__image image-size-${imageSize}`, style: imageStyles, children: showCaption && imageCaption && (_jsx("div", { className: "swiper-banner__caption", children: _jsx("div", { className: "swiper-banner__caption-content", children: imageCaption }) })) }));
    };
    return (_jsxs("div", { ...blockProps, children: [_jsxs(InspectorControls, { children: [_jsxs(PanelBody, { title: __('Image Settings', 'jankx'), initialOpen: true, children: [_jsx(MediaUploadCheck, { children: _jsx(MediaUpload, { onSelect: onSelectImage, allowedTypes: ['image'], value: imageId, render: ({ open }) => (_jsx(Button, { variant: "secondary", onClick: open, style: { width: '100%', marginBottom: '10px' }, children: imageUrl ? __('Change Image', 'jankx') : __('Select Image', 'jankx') })) }) }), imageUrl && (_jsx(Button, { variant: "link", isDestructive: true, onClick: removeImage, style: { width: '100%' }, children: __('Remove Image', 'jankx') })), imageUrl && (_jsxs(_Fragment, { children: [_jsx(SelectControl, { label: __('Image Size', 'jankx'), value: imageSize, options: [
                                            { label: __('Cover', 'jankx'), value: 'cover' },
                                            { label: __('Contain', 'jankx'), value: 'contain' },
                                            { label: __('Fullwidth', 'jankx'), value: 'fullwidth' }
                                        ], onChange: (val) => setAttributes({ imageSize: val }), help: __('Cover: Fill entire area, Contain: Fit entire image, Fullwidth: Stretch to 100% width and height', 'jankx') }), _jsx(TextControl, { label: __('Alt Text', 'jankx'), value: imageAlt, onChange: (val) => setAttributes({ imageAlt: val }), help: __('Describe the image for accessibility', 'jankx') }), _jsx(TextControl, { label: __('Caption', 'jankx'), value: imageCaption, onChange: (val) => setAttributes({ imageCaption: val }), help: __('Text to display over the image', 'jankx') }), _jsx(ToggleControl, { label: __('Show Caption', 'jankx'), checked: showCaption, onChange: (val) => setAttributes({ showCaption: val }) })] }))] }), _jsxs(PanelBody, { title: __('Link Settings', 'jankx'), initialOpen: false, children: [_jsx(TextControl, { label: __('Link URL', 'jankx'), value: linkUrl, onChange: (val) => setAttributes({ linkUrl: val }), placeholder: __('https://example.com', 'jankx'), help: __('Optional link for the banner', 'jankx') }), _jsx(SelectControl, { label: __('Link Target', 'jankx'), value: linkTarget, options: [
                                    { label: __('Same Window', 'jankx'), value: '_self' },
                                    { label: __('New Window', 'jankx'), value: '_blank' }
                                ], onChange: (val) => setAttributes({ linkTarget: val }) })] }), _jsxs(PanelBody, { title: __('Style Settings', 'jankx'), initialOpen: false, children: [_jsx(SelectControl, { label: __('Banner Style', 'jankx'), value: bannerStyle, options: [
                                    { label: __('Banner', 'jankx'), value: 'banner' },
                                    { label: __('Circles', 'jankx'), value: 'circles' },
                                    { label: __('Square', 'jankx'), value: 'square' }
                                ], onChange: (val) => setAttributes({ bannerStyle: val }) }), bannerStyle === 'circles' && (_jsx(RangeControl, { label: __('Height (px)', 'jankx'), value: height || 0, onChange: (val) => setAttributes({ height: val || 0 }), min: 50, max: 1000, step: 10, help: __('Set height for circle banner. Width will automatically match height.', 'jankx') })), _jsx(SelectControl, { label: __('Text Alignment', 'jankx'), value: textAlign, options: [
                                    { label: __('Left', 'jankx'), value: 'left' },
                                    { label: __('Center', 'jankx'), value: 'center' },
                                    { label: __('Right', 'jankx'), value: 'right' }
                                ], onChange: (val) => setAttributes({ textAlign: val }) }), _jsx(SelectControl, { label: __('Text Position', 'jankx'), value: textPosition, options: [
                                    { label: __('Top', 'jankx'), value: 'top' },
                                    { label: __('Middle', 'jankx'), value: 'middle' },
                                    { label: __('Bottom', 'jankx'), value: 'bottom' }
                                ], onChange: (val) => setAttributes({ textPosition: val }) }), _jsx(RangeControl, { label: __('Overlay Opacity', 'jankx'), value: overlayOpacity, onChange: (val) => setAttributes({ overlayOpacity: val }), min: 0, max: 1, step: 0.1, help: __('Darkness of overlay over image', 'jankx') }), _jsxs("div", { children: [_jsx("label", { children: __('Overlay Color', 'jankx') }), _jsx(ColorPicker, { color: overlayColor, onChange: (val) => setAttributes({ overlayColor: val }), disableAlpha: false })] })] })] }), renderImage()] }));
}
