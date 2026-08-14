import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { buildClassName, buildInlineStyle, OverlapGroupAttributes } from './attributes';

type SaveProps = {
	attributes: OverlapGroupAttributes;
};

export default function Save({ attributes }: SaveProps) {
	const Tag = (attributes.tagName || 'div') as never;

	const blockProps = useBlockProps.save({
		className: buildClassName(attributes),
		style: buildInlineStyle(attributes) as never,
	});

	return (
		<Tag {...blockProps}>
			<InnerBlocks.Content />
		</Tag>
	);
}
