import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './style.scss';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

const deprecated = [
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

