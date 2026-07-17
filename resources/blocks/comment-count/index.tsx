import { registerBlockType, BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';

type CommentCountAttributes = Record<string, never>;

const blockSettings: Partial<BlockConfiguration<CommentCountAttributes>> = {
    edit: Edit,
    save: () => null,
};

registerBlockType<CommentCountAttributes>(metadata.name, {
    ...metadata,
    ...blockSettings,
});

