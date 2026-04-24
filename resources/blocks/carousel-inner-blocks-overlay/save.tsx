import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save(): JSX.Element {
  const blockProps = useBlockProps.save({
    className: 'carousel-inner-blocks-overlay',
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
}
