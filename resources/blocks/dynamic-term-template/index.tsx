import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './style.scss';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deprecated: any[] = [
    // Previous save: imageRatio + thumbnailPosition only, no background data attrs
    {
        attributes: metadata.attributes,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        save({ attributes }: { attributes: any }): JSX.Element {
            const blockProps = useBlockProps.save({
                ...(attributes.imageRatio && { 'data-image-ratio': attributes.imageRatio }),
                ...(attributes.thumbnailPosition && { 'data-thumbnail-position': attributes.thumbnailPosition }),
            });
            return (
                <div {...blockProps}>
                    <InnerBlocks.Content />
                </div>
            );
        },
    },
    // Original save: plain div, no data attrs
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
