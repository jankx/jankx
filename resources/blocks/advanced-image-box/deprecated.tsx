/**
 * Deprecated versions of the block
 */

import { AdvancedImageBoxAttributes } from './types';
import save from './save';
import metadata from './block.json';

const { attributes } = metadata;

// Original attributes configuration with source: attribute for alt
const v1Attributes = {
	...attributes,
	alt: {
		type: 'string',
		source: 'attribute',
		selector: 'img',
		attribute: 'alt',
		default: '',
		role: 'content'
	}
};

const v1 = {
	attributes: v1Attributes,
	save: save,
};

// V2 deprecation for the no-image case where alt text is inside div
const v2Attributes = {
    ...attributes,
    alt: {
        type: 'string',
        source: 'html',
        selector: '.wp-block-jankx-advanced-image-box__no-image__alt',
        default: '',
        role: 'content'
    }
};

const v2 = {
    attributes: v2Attributes,
    save: save,
};

export default [v2, v1];
