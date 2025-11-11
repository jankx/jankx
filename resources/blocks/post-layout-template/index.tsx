import { registerBlockType } from '@wordpress/blocks';
import { layout } from '@wordpress/icons';

import metadata from './block.json';
import edit from './edit';
import save from './save';
import './style.scss';
import './editor.scss';

registerBlockType(metadata.name, {
    ...metadata,
    icon: layout,
    edit,
    save,
} as any);

