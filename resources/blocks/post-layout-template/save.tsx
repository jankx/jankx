/**
 * Save component for post-layout-template block
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
    const blockProps = useBlockProps.save({
        className: attributes.className || '',
    });
    
    // Save InnerBlocks so WordPress can parse them correctly
    // The render_callback will use $block->parsed_block to access InnerBlocks
    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
