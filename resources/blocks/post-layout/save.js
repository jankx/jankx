import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const {
        postType,
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
        className: 'jankx-post-layout'
    });

    // Validate required attributes
    const validateAttributes = () => {
        const errors = [];

        if (!postType || typeof postType !== 'string') {
            errors.push('postType is required and must be a string');
        }

        if (!postsPerPage || typeof postsPerPage !== 'number' || postsPerPage < 1) {
            errors.push('postsPerPage must be a positive number');
        }

        if (orderBy && typeof orderBy !== 'string') {
            errors.push('orderBy must be a string');
        }

        if (order && !['ASC', 'DESC'].includes(order)) {
            errors.push('order must be either ASC or DESC');
        }

        if (offset && (typeof offset !== 'number' || offset < 0)) {
            errors.push('offset must be a non-negative number');
        }

        if (exclude && !Array.isArray(exclude)) {
            errors.push('exclude must be an array');
        }

        if (include && !Array.isArray(include)) {
            errors.push('include must be an array');
        }

        if (taxonomyFilters && typeof taxonomyFilters !== 'object') {
            errors.push('taxonomyFilters must be an object');
        }

        if (metaFilters && typeof metaFilters !== 'object') {
            errors.push('metaFilters must be an object');
        }

        if (errors.length > 0) {
            throw new Error(`Post Layout Block Configuration Error: ${errors.join(', ')}`);
        }
    };

    try {
        // Validate attributes before rendering
        validateAttributes();
    } catch (error) {
        console.error('Post Layout Block Error:', error.message);
        // Return error state instead of crashing
        return (
            <div {...blockProps}>
                <div className="jankx-post-layout-error">
                    <p>Lỗi cấu hình block: {error.message}</p>
                </div>
            </div>
        );
    }

    // Embed configuration as JSON for frontend JavaScript
    const config = {
        postType: postType || 'post',
        postsPerPage: postsPerPage || 6,
        orderBy: orderBy || 'date',
        order: order || 'DESC',
        offset: offset || 0,
        exclude: exclude || [],
        include: include || [],
        taxonomyFilters: taxonomyFilters || {},
        metaFilters: metaFilters || {},
        presetFilters: presetFilters || [],
        customFilters: customFilters || [],
        layout: layout || 'grid',
        pagination: pagination || { enabled: true, type: 'numbers' },
        displayOptions: displayOptions || {
            showImage: true,
            showTitle: true,
            showExcerpt: true,
            showMeta: true
        },
        styling: styling || {
            viewType: 'grid',
            hoverEffect: 'lift',
            borderRadius: 8,
            shadow: 'medium'
        },
        responsive: responsive || {
            mobile: true,
            tablet: true,
            desktop: true
        }
    };

    return (
        <div {...blockProps}>
            <div
                className="jankx-post-layout-config"
                data-config={JSON.stringify(config)}
                style={{ display: 'none' }}
            />
            <div className="jankx-post-layout-content">
                <div className="jankx-post-layout-loading">
                    <div className="jankx-post-layout-loading__spinner"></div>
                    <p>Đang tải...</p>
                </div>
            </div>
            <div className="jankx-post-layout-pagination" style={{ display: 'none' }}>
                <div className="jankx-post-layout-pagination__links"></div>
            </div>
        </div>
    );
}
