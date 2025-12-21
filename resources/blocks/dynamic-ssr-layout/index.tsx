import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

import { registerBlockType } from '@wordpress/blocks';

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: Save,
} as any);

