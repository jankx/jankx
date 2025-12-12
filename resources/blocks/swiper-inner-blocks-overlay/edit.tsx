import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Edit(): JSX.Element {
  const blockProps = useBlockProps({
    className: 'swiper-inner-blocks-overlay',
  });

  return (
    <div {...blockProps}>
      <InnerBlocks />
    </div>
  );
}
