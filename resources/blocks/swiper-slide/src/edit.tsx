import { useBlockProps, useInnerBlocksProps, InnerBlocks, BlockIcon } from '@wordpress/block-editor';
import { Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { BLOCK_CLASS_NAME, ALLOWED_BLOCKS } from './constants';

import './editor.scss';

export default function Edit() {
	const blockProps = useBlockProps({
		className: `${BLOCK_CLASS_NAME} swiper-slide`,
	});
	const { children, ...combinedBlockProps } = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		renderAppender: false,
		placeholder: (
			<Placeholder
				icon={<BlockIcon icon="format-image" />}
				label={__('Slide', 'jankx')}
				instructions={__('Use a block from allowed list.', 'jankx')}
			>
				<InnerBlocks.ButtonBlockAppender />
			</Placeholder>
		),
	});

	return (
		<div {...combinedBlockProps}>
			<div className={`${BLOCK_CLASS_NAME}__inner`}>{children}</div>
		</div>
	);
}
