import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Edit(): JSX.Element {
    const blockProps = useBlockProps({
        className: 'jankx-site-decoration',
    });

    return (
        <div {...blockProps}>
            <InnerBlocks templateLock={false} />
        </div>
    );
}
