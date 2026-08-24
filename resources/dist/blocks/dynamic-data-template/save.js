import { jsx as _jsx } from "react/jsx-runtime";
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
function attr(condition, key, value) {
    return condition && value ? { [key]: value } : {};
}
export default function Save({ attributes }) {
    const blockProps = useBlockProps.save(Object.assign({}, attr(!!attributes.imageRatio, 'data-image-ratio', attributes.imageRatio), attr(!!attributes.thumbnailPosition, 'data-thumbnail-position', attributes.thumbnailPosition), attr(!!attributes.itemBgType && attributes.itemBgType !== 'none', 'data-item-bg-type', attributes.itemBgType), attr(!!attributes.itemBgColor, 'data-item-bg-color', attributes.itemBgColor), attr(!!attributes.itemBgImageUrl, 'data-item-bg-image-url', attributes.itemBgImageUrl), attr(attributes.itemBgType === 'image' && !!attributes.itemBgImageSource, 'data-item-bg-image-source', attributes.itemBgImageSource), attr(attributes.itemBgType === 'image' && !!attributes.itemBgPosition, 'data-item-bg-position', attributes.itemBgPosition), attr(attributes.itemBgType === 'image' && !!attributes.itemBgSize, 'data-item-bg-size', attributes.itemBgSize), attr(attributes.itemBgType === 'image' && !!attributes.itemBgRepeat, 'data-item-bg-repeat', attributes.itemBgRepeat), attr(!!attributes.itemBgOverlay, 'data-item-bg-overlay', attributes.itemBgOverlay)));
    return (_jsx("div", { ...blockProps, children: _jsx(InnerBlocks.Content, {}) }));
}
