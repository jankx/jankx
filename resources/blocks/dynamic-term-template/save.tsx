import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Attrs = Record<string, any>;

function attr(condition: boolean, key: string, value: unknown): Attrs {
    return condition && value ? { [key]: value } : {};
}

interface SaveProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributes: Record<string, any>;
}

export default function Save({ attributes }: SaveProps): JSX.Element {
    const blockProps = useBlockProps.save(
        Object.assign(
            {},
            attr(!!attributes.imageRatio, 'data-image-ratio', attributes.imageRatio),
            attr(!!attributes.thumbnailPosition, 'data-thumbnail-position', attributes.thumbnailPosition),
            attr(!!attributes.itemBgType && attributes.itemBgType !== 'none', 'data-item-bg-type', attributes.itemBgType),
            attr(!!attributes.itemBgColor, 'data-item-bg-color', attributes.itemBgColor),
            attr(!!attributes.itemBgImageUrl, 'data-item-bg-image-url', attributes.itemBgImageUrl),
            attr(attributes.itemBgType === 'image' && !!attributes.itemBgImageSource, 'data-item-bg-image-source', attributes.itemBgImageSource),
            attr(attributes.itemBgType === 'image' && !!attributes.itemBgPosition, 'data-item-bg-position', attributes.itemBgPosition),
            attr(attributes.itemBgType === 'image' && !!attributes.itemBgSize, 'data-item-bg-size', attributes.itemBgSize),
            attr(attributes.itemBgType === 'image' && !!attributes.itemBgRepeat, 'data-item-bg-repeat', attributes.itemBgRepeat),
            attr(!!attributes.itemBgOverlay, 'data-item-bg-overlay', attributes.itemBgOverlay),
            attr(attributes.itemFeaturedImage, 'data-item-featured-image', attributes.itemFeaturedImage),
            attr(!!attributes.itemDefaultImageId, 'data-item-default-image-id', attributes.itemDefaultImageId),
            attr(!!attributes.itemDefaultImageUrl, 'data-item-default-image-url', attributes.itemDefaultImageUrl)
        )
    );
    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
