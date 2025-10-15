import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import type { SwiperSlideProps } from './types';

export default function Edit({ attributes, setAttributes, clientId }: SwiperSlideProps): JSX.Element {
  const blockProps = useBlockProps({
    className: 'swiper-slide'
  });

  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    templateLock: false
  });

  return <div {...innerBlocksProps} />;
}
