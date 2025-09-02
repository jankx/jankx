/**
 * WordPress dependencies
 */
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

interface SaveProps {
	attributes: {
		tagName?: string;
		[name: string]: any;
	};
}

export default function save( { attributes: { tagName: Tag = 'div' } }: SaveProps ) {
	const blockProps = useBlockProps.save();
	const innerBlocksProps = useInnerBlocksProps.save( blockProps );
	return <Tag { ...innerBlocksProps } />;
}
