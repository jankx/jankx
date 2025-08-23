import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl, TextControl, ToggleControl } from '@wordpress/components';

export default function QueryControls({ attributes, postTypes, onUpdate }) {
    const {
        postType,
        postsPerPage,
        orderBy,
        order,
        offset,
        exclude,
        include
    } = attributes;

    const postTypeOptions = postTypes ? Object.values(postTypes).map(type => ({
        label: type.labels.singular_name || type.name,
        value: type.slug
    })) : [];

    const orderByOptions = [
        { label: __('Date', 'jankx'), value: 'date' },
        { label: __('Title', 'jankx'), value: 'title' },
        { label: __('ID', 'jankx'), value: 'ID' },
        { label: __('Author', 'jankx'), value: 'author' },
        { label: __('Modified', 'jankx'), value: 'modified' },
        { label: __('Comment Count', 'jankx'), value: 'comment_count' },
        { label: __('Menu Order', 'jankx'), value: 'menu_order' },
        { label: __('Random', 'jankx'), value: 'rand' }
    ];

    const orderOptions = [
        { label: __('Descending', 'jankx'), value: 'DESC' },
        { label: __('Ascending', 'jankx'), value: 'ASC' }
    ];

    return (
        <PanelBody title={__('Query Settings', 'jankx')} initialOpen={true}>
            <SelectControl
                label={__('Post Type', 'jankx')}
                value={postType}
                options={postTypeOptions}
                onChange={(value) => onUpdate('postType', value)}
                help={__('Select the post type to display', 'jankx')}
            />

            <RangeControl
                label={__('Posts Per Page', 'jankx')}
                value={postsPerPage}
                onChange={(value) => onUpdate('postsPerPage', value)}
                min={1}
                max={100}
                help={__('Number of posts to display per page', 'jankx')}
            />

            <SelectControl
                label={__('Order By', 'jankx')}
                value={orderBy}
                options={orderByOptions}
                onChange={(value) => onUpdate('orderBy', value)}
                help={__('Sort posts by this field', 'jankx')}
            />

            <SelectControl
                label={__('Order', 'jankx')}
                value={order}
                options={orderOptions}
                onChange={(value) => onUpdate('order', value)}
                help={__('Sort order (ascending or descending)', 'jankx')}
            />

            <RangeControl
                label={__('Offset', 'jankx')}
                value={offset}
                onChange={(value) => onUpdate('offset', value)}
                min={0}
                max={1000}
                help={__('Number of posts to skip', 'jankx')}
            />

            <TextControl
                label={__('Include Posts', 'jankx')}
                value={include.join(', ')}
                onChange={(value) => onUpdate('include', value.split(',').map(id => id.trim()).filter(Boolean))}
                help={__('Comma-separated list of post IDs to include', 'jankx')}
            />

            <TextControl
                label={__('Exclude Posts', 'jankx')}
                value={exclude.join(', ')}
                onChange={(value) => onUpdate('exclude', value.split(',').map(id => id.trim()).filter(Boolean))}
                help={__('Comma-separated list of post IDs to exclude', 'jankx')}
            />
        </PanelBody>
    );
}
