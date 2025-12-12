import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

interface SaveProps {
    attributes: {
        imageRatio?: string;
        thumbnailPosition?: string;
        [key: string]: unknown;
    };
}

export default function Save({ attributes }: SaveProps): JSX.Element {
    const blockProps = useBlockProps.save({
        ...(attributes.imageRatio && { 'data-image-ratio': attributes.imageRatio }),
        ...(attributes.thumbnailPosition && { 'data-thumbnail-position': attributes.thumbnailPosition }),
    });
    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}

