import { registerBlockType, BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';

interface TermPostCountAttributes {
    postTypes: string[];
    labelSingular: string;
    labelPlural: string;
    showLabel: boolean;
    labelPosition: 'before' | 'after';
    showZero: boolean;
    zeroText: string;
}

const blockSettings: Partial<BlockConfiguration<TermPostCountAttributes>> = {
    edit: Edit,
    // Rendered server-side: save returns null
    save: () => null,
};

registerBlockType<TermPostCountAttributes>(metadata.name, {
    ...metadata,
    ...blockSettings,
} as any);
