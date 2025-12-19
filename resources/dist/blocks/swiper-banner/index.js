import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';
registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: Save,
    // Migration to remove .swiper-banner__content wrapper from old blocks
    migrate: (attributes, innerBlocks) => {
        return [attributes, innerBlocks];
    },
    // Deprecated version to handle old HTML structure with .swiper-banner__content
    deprecated: [
        {
            attributes: metadata.attributes,
            save: ({ attributes }) => {
                // OLD save function that included .swiper-banner__content wrapper
                // This matches the old HTML structure in database
                const { imageUrl, imageAlt, imageCaption, linkUrl, linkTarget, bannerStyle, overlayOpacity, overlayColor, textAlign, textPosition, showCaption, imageSize = 'cover' } = attributes;
                const blockProps = useBlockProps.save({
                    className: `swiper-slide swiper-banner swiper-banner--${bannerStyle} text-${textAlign} text-position-${textPosition} image-size-${imageSize}`
                });
                const imageStyles = {
                    backgroundImage: `url(${imageUrl})`,
                    '--overlay-color': overlayColor,
                    '--overlay-opacity': overlayOpacity
                };
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
                const imageContent = (_jsxs("div", { className: `swiper-banner__image image-size-${imageSize}`, style: imageStyles, children: [_jsx("div", { className: "swiper-banner__overlay" }), showCaption && imageCaption && (_jsx("div", { className: "swiper-banner__caption", children: _jsx("div", { className: "swiper-banner__caption-content", children: imageCaption }) }))] }));
                // OLD structure with .swiper-banner__content wrapper
                const content = (_jsx("div", { className: "swiper-banner__content", children: imageContent }));
                if (linkUrl) {
                    return (_jsx("div", { ...blockProps, children: _jsx("a", { href: linkUrl, target: linkTarget, rel: linkTarget === '_blank' ? 'noopener noreferrer' : undefined, className: "swiper-banner__link", children: content }) }));
                }
                return (_jsx("div", { ...blockProps, children: content }));
            },
            // Migration function: attributes stay the same, WordPress will use new save function
            migrate: (attributes) => {
                return attributes;
            }
        }
    ]
});
