import { createBlock } from '@wordpress/blocks';
import type { BlockInstance } from '@wordpress/blocks';

/**
 * A node in the nested tuple form WordPress templates are written in:
 * `[blockName, attributes, innerBlocks]`.
 */
export type TemplateNode = [
    blockName: string,
    attributes?: Record< string, unknown >,
    innerBlocks?: TemplateNode[],
];

/**
 * Build block objects from the nested tuple form used by our layout templates.
 *
 * `@wordpress/blocks` used to expose `createBlocksFromTemplate` for this, but
 * it is no longer exported, so the walk is done here instead. It is a direct
 * structural equivalent: the same tuples in, the same block objects out, with
 * the same depth-first ordering.
 */
export function createBlocksFromTemplate(
    template: TemplateNode[]
): BlockInstance[] {
    return ( template || [] ).map(
        ( [ blockName, attributes = {}, innerBlocks = [] ] ) =>
            createBlock(
                blockName,
                attributes as Record< string, unknown >,
                createBlocksFromTemplate( innerBlocks )
            )
    );
}
