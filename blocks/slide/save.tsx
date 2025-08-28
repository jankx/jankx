import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save({ attributes }: any) {
	const blockProps = useBlockProps.save();
	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlocksProps} />;
}
