import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor';
import { Button, Placeholder } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
export default function Edit({ attributes, setAttributes }) {
    const { imageId, imageUrl, imageAlt, imageCaption, thumbnailUrl } = attributes;
    const blockProps = useBlockProps({
        className: 'slideshow-item-block'
    });
    // Generate slide ID if not exists
    useEffect(() => {
        if (!attributes.slideId) {
            setAttributes({ slideId: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` });
        }
    }, [attributes.slideId, setAttributes]);
    const onSelectImage = (media) => {
        if (media && media.type === 'image') {
            const thumbnailUrl = media.sizes?.thumbnail?.url || media.sizes?.medium?.url || media.url;
            setAttributes({
                imageId: media.id,
                imageUrl: media.url,
                imageAlt: media.alt || '',
                imageCaption: media.caption || '',
                thumbnailUrl: thumbnailUrl
            });
        }
    };
    const onRemoveImage = () => {
        setAttributes({
            imageId: 0,
            imageUrl: '',
            imageAlt: '',
            imageCaption: '',
            thumbnailUrl: ''
        });
    };
    if (!imageId || !imageUrl) {
        return (_jsx("div", { ...blockProps, children: _jsx(Placeholder, { icon: "format-gallery", label: __('Slideshow Item', 'jankx'), instructions: __('Select an image for this slideshow item.', 'jankx'), children: _jsx(MediaUploadCheck, { children: _jsx(MediaUpload, { onSelect: onSelectImage, allowedTypes: ['image'], value: imageId, render: ({ open }) => (_jsx(Button, { variant: "primary", onClick: open, children: __('Select Image', 'jankx') })) }) }) }) }));
    }
    return (_jsx("div", { ...blockProps, children: _jsxs("div", { className: "slideshow-slide", children: [_jsxs("div", { className: "slideshow-item-image", children: [imageUrl ? (_jsx("img", { src: imageUrl, alt: imageAlt })) : (_jsxs("div", { className: "slideshow-placeholder", children: [_jsx("div", { className: "placeholder-icon", children: "\uD83D\uDCF7" }), _jsx("div", { className: "placeholder-text", children: "No image selected" })] })), _jsxs("div", { className: "slideshow-item-overlay", children: [_jsx(MediaUploadCheck, { children: _jsx(MediaUpload, { onSelect: onSelectImage, allowedTypes: ['image'], value: imageId, render: ({ open }) => (_jsx(Button, { variant: "secondary", onClick: open, className: "change-image-btn", children: __('Change Image', 'jankx') })) }) }), _jsx(Button, { variant: "secondary", onClick: onRemoveImage, className: "remove-image-btn", children: __('Remove', 'jankx') })] })] }), _jsx("div", { className: "slideshow-caption", children: _jsx(RichText, { tagName: "div", value: imageCaption, onChange: (value) => setAttributes({ imageCaption: value }), placeholder: __('Enter caption for this image...', 'jankx'), allowedFormats: ['core/bold', 'core/italic', 'core/link'] }) })] }) }));
}
