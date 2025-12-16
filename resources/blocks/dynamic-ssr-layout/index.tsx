import Edit from '../dynamic-data-layout/edit';
import Save from '../dynamic-data-layout/save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

import { registerBlockType } from '@wordpress/blocks';

registerBlockType(metadata.name, {
    edit: Edit as any,
    save: Save as any,
});

