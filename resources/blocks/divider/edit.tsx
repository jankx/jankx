import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Edit(): JSX.Element {
  const blockProps = useBlockProps({
    className: 'jankx-divider',
  });

  return (
    <div {...blockProps}>
      <InnerBlocks />
    </div>
  );
}
