import { registerBlockType } from '@wordpress/blocks';
import { FilterStyleEdit } from '../../shared/filter-style';
import metadata from './block.json';

registerBlockType(metadata.name, {
    ...metadata,
    edit: (props: any) => <FilterStyleEdit {...props} type="radio" />,
    save: () => null,
} as any);
