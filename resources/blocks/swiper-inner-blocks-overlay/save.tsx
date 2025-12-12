import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save(): JSX.Element {
  const blockProps = useBlockProps.save({
    className: 'swiper-inner-blocks-overlay',
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
}
