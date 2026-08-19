import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './style.scss';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

// Deprecated v1: old save used only data-layout + data-columns, no extra classes or CSS vars
const deprecated = [
    {
        attributes: metadata.attributes,
        migrate(attributes: Record<string, any>) {
            return attributes;
        },
        save({ attributes }: { attributes: Record<string, any> }): JSX.Element {
            const layout = attributes.layout || 'grid';
            const columns = attributes.columns || 3;
            const blockProps = useBlockProps.save({
                'data-layout': layout,
                'data-columns': columns,
            });
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

