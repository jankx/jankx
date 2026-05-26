import { registerBlockType, BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';

type SearchResultsCountAttributes = Record<string, never>;

const blockSettings: Partial<BlockConfiguration<SearchResultsCountAttributes>> = {
    edit: Edit,
    save: () => null,
};

registerBlockType<SearchResultsCountAttributes>(metadata.name, {
    ...metadata,
    ...blockSettings,
});

