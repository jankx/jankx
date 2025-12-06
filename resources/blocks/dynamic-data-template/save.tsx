import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

interface SaveProps {
    attributes: Record<string, unknown>;
}

export default function Save({ attributes }: SaveProps): JSX.Element {
    const blockProps = useBlockProps.save();
    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}

