import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
export default function Save({ attributes }) {
    const { imageUrl, imageAlt, linkUrl, linkTarget, bannerStyle, overlayOpacity, overlayColor, textAlign, textPosition, imageSize = 'cover' } = attributes;
    const blockProps = useBlockProps.save({
        className: `embla__slide embla-banner embla-banner--${bannerStyle} text-${textAlign} text-position-${textPosition} image-size-${imageSize}`,
        'data-image-size': imageSize
    });
    const imageStyles = {
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        ...(imageSize === 'fullwidth'
            ? { backgroundSize: '100% 100%', backgroundPosition: 'center' }
            : imageSize === 'contain'
                ? { backgroundSize: 'contain' }
                : { backgroundSize: 'cover' })
    };
    const slideContent = (_jsxs(_Fragment, { children: [imageUrl && (_jsx("div", { className: `embla-banner__image image-size-${imageSize}`, style: imageStyles, role: "img", "aria-label": imageAlt || undefined })), imageUrl && overlayOpacity > 0 && (_jsx("div", { className: "embla-banner__overlay", style: {
                    backgroundColor: overlayColor,
                    opacity: overlayOpacity
                }, "aria-hidden": "true" })), _jsx("div", { className: "embla-banner__overlay-content", children: _jsx(InnerBlocks.Content, {}) })] }));
    if (linkUrl) {
        return (_jsx("div", { ...blockProps, children: _jsx("a", { href: linkUrl, target: linkTarget, rel: linkTarget === '_blank' ? 'noopener noreferrer' : undefined, className: "embla-banner__link", children: slideContent }) }));
    }
    return (_jsx("div", { ...blockProps, children: slideContent }));
}
