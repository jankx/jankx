import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck, InnerBlocks } from '@wordpress/block-editor';
import { Button, Placeholder } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
export default function Edit({ attributes, setAttributes, clientId, context }) {
    const { images } = attributes;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { replaceInnerBlocks, selectBlock } = useDispatch('core/block-editor');
    // Get parent block ID
    const parentClientId = useSelect((select) => {
        const { getBlock } = select('core/block-editor');
        const block = getBlock(clientId);
        return block?.parentClientId;
    }, [clientId]);
    // Get settings from parent slideshow
    const showThumbnails = context['jankx/showThumbnails'] ?? true;
    const showNavigation = context['jankx/showNavigation'] ?? true;
    const transitionEffect = context['jankx/transitionEffect'] ?? 'slide';
    const prevText = context['jankx/prevText'] ?? '←';
    const nextText = context['jankx/nextText'] ?? '→';
    const blockProps = useBlockProps({
        className: 'slideshow-container-block'
    });
    // Load images from gallery and create slideshow-item blocks
    const onSelectImages = async (mediaList) => {
        setIsLoading(true);
        // Create slideshow-item blocks for each selected image
        const slideshowItems = mediaList.map(media => {
            const thumbnailUrl = media.sizes?.thumbnail?.url || media.sizes?.medium?.url || media.url;
            return createBlock('jankx/slideshow-item', {
                imageId: media.id,
                imageUrl: media.url,
                imageAlt: media.alt || '',
                imageCaption: media.caption || '',
                thumbnailUrl: thumbnailUrl,
                slideId: `slide-${media.id}-${Date.now()}`
            });
        });
        // Replace existing inner blocks with new slideshow-items
        replaceInnerBlocks(clientId, slideshowItems, false);
        // Also save images to attributes
        const newImages = mediaList.map(media => ({
            id: media.id,
            url: media.url,
            alt: media.alt || '',
            caption: media.caption || '',
            thumbnailUrl: media.sizes?.thumbnail?.url || media.sizes?.medium?.url || media.url,
            sizes: media.sizes
        }));
        setAttributes({ images: newImages });
        setIsLoading(false);
        // Focus back to parent slideshow block after a short delay
        if (parentClientId) {
            setTimeout(() => {
                selectBlock(parentClientId);
            }, 100);
        }
    };
    const onRemoveAllImages = () => {
        replaceInnerBlocks(clientId, [], false);
        setAttributes({ images: [] });
        setCurrentSlide(0);
        // Focus back to parent slideshow block after a short delay
        if (parentClientId) {
            setTimeout(() => {
                selectBlock(parentClientId);
            }, 100);
        }
    };
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };
    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };
    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };
    if (images.length === 0) {
        return (_jsx("div", { ...blockProps, children: _jsx(Placeholder, { icon: "format-gallery", label: __('Slideshow Container', 'jankx'), instructions: __('Select images from your media library to create a slideshow.', 'jankx'), children: _jsx(MediaUploadCheck, { children: _jsx(MediaUpload, { onSelect: onSelectImages, allowedTypes: ['image'], multiple: true, gallery: true, render: ({ open }) => (_jsx(Button, { variant: "primary", onClick: open, isBusy: isLoading, children: isLoading ? __('Loading...', 'jankx') : __('Select Images', 'jankx') })) }) }) }) }));
    }
    return (_jsxs("div", { ...blockProps, children: [_jsxs("div", { className: "slideshow-container-toolbar", children: [_jsx(MediaUploadCheck, { children: _jsx(MediaUpload, { onSelect: onSelectImages, allowedTypes: ['image'], multiple: true, gallery: true, value: images.map(img => img.id), render: ({ open }) => (_jsx(Button, { variant: "secondary", onClick: open, children: __('Change Images', 'jankx') })) }) }), _jsx(Button, { variant: "secondary", onClick: onRemoveAllImages, isDestructive: true, children: __('Remove All Images', 'jankx') })] }), showThumbnails && images.length > 1 && (_jsx("div", { className: "slideshow-thumbnails", children: images.map((image, index) => (_jsx("button", { className: `slideshow-thumbnail ${index === currentSlide ? 'active' : ''}`, onClick: () => goToSlide(index), style: { width: '60px', height: '60px' }, children: _jsx("img", { src: image.thumbnailUrl, alt: image.alt }) }, image.id))) })), _jsxs("div", { className: "slideshow-main", children: [_jsx("div", { className: "slideshow-container", children: _jsx("div", { className: "slideshow-track", children: images.map((image, index) => (_jsx("div", { className: `slideshow-slide ${index === currentSlide ? 'active' : ''}`, style: {
                                    transform: transitionEffect === 'slide'
                                        ? `translateX(${(index - currentSlide) * 100}%)`
                                        : 'translateX(0)',
                                    opacity: transitionEffect === 'fade'
                                        ? (index === currentSlide ? 1 : 0)
                                        : 1
                                }, children: _jsx("img", { src: image.url, alt: image.alt }) }, image.id))) }) }), showNavigation && images.length > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { className: "slideshow-nav slideshow-nav-prev", onClick: goToPrevious, "aria-label": __('Previous slide', 'jankx'), dangerouslySetInnerHTML: { __html: prevText } }), _jsx("button", { className: "slideshow-nav slideshow-nav-next", onClick: goToNext, "aria-label": __('Next slide', 'jankx'), dangerouslySetInnerHTML: { __html: nextText } })] }))] }), _jsx("div", { style: { display: 'none' }, children: _jsx(InnerBlocks, { allowedBlocks: ['jankx/slideshow-item'], template: [], templateLock: false }) })] }));
}
