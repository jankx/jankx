/**
 * Save component for post-type-layout block
 * 
 * For dynamic blocks with render_callback, we need to save InnerBlocks
 * so WordPress can parse them correctly. The render_callback will handle
 * the actual rendering on frontend.
 * Attributes are saved automatically via block.json.
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

interface SaveProps {
    attributes: Record<string, any>;
}

export default function Save({ attributes }: SaveProps) {
    const {
        layout,
        columns,
        columnsTablet,
        columnsMobile,
        thumbnailPosition = 'top',
    } = attributes;

    // Save InnerBlocks so WordPress can parse them correctly
    // The render_callback will use $block->parsed_block to access InnerBlocks
    // Attributes are automatically saved via block.json
    // Note: We avoid CSS custom properties in style to prevent WordPress from adding "px"
    // PHP render_callback will set CSS variables from attributes
    const blockProps = useBlockProps.save({
        className: `wp-block-jankx-post-type-layout post-type-layout layout-${layout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile} thumbnail-position-${thumbnailPosition}`,
        'data-block-id': attributes.queryId || '',
        'data-query-id': attributes.queryId || '',
        'data-post-type': attributes.postType || '',
        'data-layout': layout || 'grid',
        'data-posts-per-page': String(attributes.postsPerPage || 10),
        'data-columns': String(columns || 3),
        'data-columns-tablet': String(columnsTablet || 2),
        'data-columns-mobile': String(columnsMobile || 1),
        'data-order-by': attributes.orderBy || 'date',
        'data-order': attributes.order || 'DESC',
        'data-query-preset': attributes.queryPreset || 'custom',
        'data-image-ratio': attributes.imageRatio || '',
        'data-thumbnail-position': thumbnailPosition,
    });
    
    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
