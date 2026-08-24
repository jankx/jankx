
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }: any) {
	const blockProps = useBlockProps({
		className: 'has-jankx-responsive-wrapper',
	});

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Layout', 'jankx')}>
					<TextControl
						label={__('Max Width', 'jankx')}
						value={attributes.maxWidth || ''}
						onChange={(val) => setAttributes({ maxWidth: val || undefined })}
					/>
				</PanelBody>
			</InspectorControls>
			<InnerBlocks />
		</div>
	);
}
