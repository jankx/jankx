import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
const blockSettings = {
    edit: Edit,
    save: () => null,
};
registerBlockType(metadata.name, {
    ...metadata,
    ...blockSettings,
});
