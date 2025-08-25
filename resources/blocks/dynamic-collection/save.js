import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const {
        postType,
        template,
        postsPerPage,
        orderBy,
        order,
        offset,
        exclude,
        include,
        taxonomyFilters,
        metaFilters,
        presetFilters,
        customFilters,
        layout,
        pagination,
        displayOptions,
        styling,
        responsive
    } = attributes;

    const blockProps = useBlockProps.save({
        className: 'jankx-dynamic-collection'
    });

    // Embed configuration as JSON for frontend JavaScript
    const config = {
        postType,
        template,
        postsPerPage,
        orderBy,
        order,
        offset,
        exclude,
        include,
        taxonomyFilters,
        metaFilters,
        presetFilters,
        customFilters,
        layout,
        pagination,
        displayOptions,
        styling,
        responsive
    };

    return (
        <div {...blockProps}>
            <div
                className="jankx-dynamic-collection-config"
                data-config={JSON.stringify(config)}
                style={{ display: 'none' }}
            />
            <div className="jankx-dynamic-collection-content">
                <InnerBlocks.Content />
            </div>
        </div>
    );
}
