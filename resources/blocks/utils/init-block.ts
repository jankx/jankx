/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

interface BlockConfig {
	metadata: Record<string, any>;
	settings: Record<string, any>;
	name: string;
}

/**
 * Function to register an individual block.
 *
 * @param {BlockConfig} block The block to be registered.
 *
 * @return {WPBlockType | undefined} The block, if it has been successfully registered;
 *                        otherwise `undefined`.
 */
export default function initBlock(block: BlockConfig) {
	if (!block) {
		return;
	}
	const { metadata, settings, name } = block;
	return registerBlockType({ name, ...metadata }, settings);
}
