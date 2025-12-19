import { jsx as _jsx } from "react/jsx-runtime";
import { useBlockProps } from '@wordpress/block-editor';
export default function Save({ attributes }) {
    const { imageUrl, imageAlt, imageCaption, linkUrl, linkTarget, bannerStyle, overlayOpacity, overlayColor, textAlign, textPosition, showCaption, imageSize = 'cover' } = attributes;
    const blockProps = useBlockProps.save({
        className: `swiper-slide swiper-banner swiper-banner--${bannerStyle} text-${textAlign} text-position-${textPosition} image-size-${imageSize}`,
        'data-image-size': imageSize
    });
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
    const content = (_jsx("div", { className: `swiper-banner__image image-size-${imageSize}`, style: imageStyles, children: showCaption && imageCaption && (_jsx("div", { className: "swiper-banner__caption", children: _jsx("div", { className: "swiper-banner__caption-content", children: imageCaption }) })) }));
    if (linkUrl) {
        return (_jsx("div", { ...blockProps, children: _jsx("a", { href: linkUrl, target: linkTarget, rel: linkTarget === '_blank' ? 'noopener noreferrer' : undefined, className: "swiper-banner__link", children: content }) }));
    }
    return (_jsx("div", { ...blockProps, children: content }));
}
