import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './style.scss';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deprecated: any[] = [
    // v2 → v3: itemBg image attrs were only conditionally rendered (itemBgType === 'image').
    // Previously they were unconditionally rendered based on truthiness of the value,
    // causing validation failures on blocks saved without a background image.
    {
        attributes: metadata.attributes,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        save({ attributes }: { attributes: any }): JSX.Element {
            const blockProps = useBlockProps.save({
                ...(attributes.imageRatio && { 'data-image-ratio': attributes.imageRatio }),
                ...(attributes.thumbnailPosition && { 'data-thumbnail-position': attributes.thumbnailPosition }),
                ...(attributes.itemBgType && attributes.itemBgType !== 'none' && { 'data-item-bg-type': attributes.itemBgType }),
                ...(attributes.itemBgColor && { 'data-item-bg-color': attributes.itemBgColor }),
                ...(attributes.itemBgImageUrl && { 'data-item-bg-image-url': attributes.itemBgImageUrl }),
                ...(attributes.itemBgImageSource && { 'data-item-bg-image-source': attributes.itemBgImageSource }),
                ...(attributes.itemBgPosition && { 'data-item-bg-position': attributes.itemBgPosition }),
                ...(attributes.itemBgSize && { 'data-item-bg-size': attributes.itemBgSize }),
                ...(attributes.itemBgRepeat && { 'data-item-bg-repeat': attributes.itemBgRepeat }),
                ...(attributes.itemBgOverlay && { 'data-item-bg-overlay': attributes.itemBgOverlay }),
            });
            return (
                <div {...blockProps}>
                    <InnerBlocks.Content />
                </div>
            );
        },
    },
    // v1: plain div, no data attrs
    {
        attributes: metadata.attributes,
        save(): JSX.Element {
            const blockProps = useBlockProps.save();
            return (
                <div {...blockProps}>
                    <InnerBlocks.Content />
                </div>
            );
        },
    },
];

registerBlockType(metadata.name, {
    edit: Edit,
    save: Save,
    deprecated,
});

