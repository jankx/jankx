
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';

registerBlockType(metadata as any, {
    edit,
    save,
});
