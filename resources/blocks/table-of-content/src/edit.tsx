import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { 
	PanelBody, 
	ToggleControl, 
	TextControl, 
	SelectControl, 
	RangeControl 
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { useSelect } from '@wordpress/data';
import type { TableOfContentEditProps, MarkerStyleOption } from './types';
import './editor.scss';

export default function Edit({ attributes, setAttributes }: TableOfContentEditProps): JSX.Element {
	const {
		title,
		showTitle,
		titleLevel,
		minLevel,
		maxLevel,
		markerStyle,
		useNumbers,
		removeIndent,
		smoothScroll,
		absoluteUrls
	} = attributes;

	const blockProps = useBlockProps({
		className: 'wp-block-jankx-table-of-content'
	});

	// Get current post ID for context
	const postId = useSelect((select) => {
		return select('core/editor')?.getCurrentPostId();
	}, []);

	const markerStyleOptions: MarkerStyleOption[] = [
		{ label: __('List (Disc)', 'jankx'), value: 'list' },
		{ label: __('Numbers', 'jankx'), value: 'numbers' },
		{ label: __('Circles', 'jankx'), value: 'circles' },
		{ label: __('Roman Numerals', 'jankx'), value: 'roman' },
		{ label: __('Plus/Minus', 'jankx'), value: 'plus-minus' }
	];

	const titleLevelOptions = [
		{ label: 'H1', value: 1 },
		{ label: 'H2', value: 2 },
		{ label: 'H3', value: 3 },
		{ label: 'H4', value: 4 },
		{ label: 'H5', value: 5 },
		{ label: 'H6', value: 6 }
	];

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Table of Contents Settings', 'jankx')} initialOpen={true}>
					<ToggleControl
						label={__('Show Title', 'jankx')}
						checked={showTitle}
						onChange={(value) => setAttributes({ showTitle: value })}
					/>

					{showTitle && (
						<>
							<TextControl
								label={__('Title Text', 'jankx')}
								value={title}
								onChange={(value) => setAttributes({ title: value })}
							/>

							<SelectControl
								label={__('Title Level', 'jankx')}
								value={titleLevel}
								options={titleLevelOptions}
								onChange={(value: string) => setAttributes({ titleLevel: parseInt(value, 10) })}
							/>
						</>
					)}

					<RangeControl
						label={__('Minimum Heading Level', 'jankx')}
						value={minLevel}
						onChange={(value: number) => setAttributes({ minLevel: value })}
						min={1}
						max={6}
						step={1}
					/>

					<RangeControl
						label={__('Maximum Heading Level', 'jankx')}
						value={maxLevel}
						onChange={(value: number) => setAttributes({ maxLevel: value })}
						min={1}
						max={6}
						step={1}
					/>

					<SelectControl
						label={__('Marker Style', 'jankx')}
						value={markerStyle}
						options={markerStyleOptions}
						onChange={(value: string) => setAttributes({ markerStyle: value as TableOfContentAttributes['markerStyle'] })}
					/>

					<ToggleControl
						label={__('Use Numbers', 'jankx')}
						help={__('Override marker style with numbers', 'jankx')}
						checked={useNumbers}
						onChange={(value: boolean) => setAttributes({ useNumbers: value })}
					/>

					<ToggleControl
						label={__('Remove Indentation', 'jankx')}
						checked={removeIndent}
						onChange={(value: boolean) => setAttributes({ removeIndent: value })}
					/>

					<ToggleControl
						label={__('Smooth Scrolling', 'jankx')}
						help={__('Add smooth scroll behavior to links', 'jankx')}
						checked={smoothScroll}
						onChange={(value: boolean) => setAttributes({ smoothScroll: value })}
					/>

					<ToggleControl
						label={__('Absolute URLs', 'jankx')}
						help={__('Use full URLs instead of anchors', 'jankx')}
						checked={absoluteUrls}
						onChange={(value: boolean) => setAttributes({ absoluteUrls: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<ServerSideRender
				block="jankx/table-of-content"
				attributes={attributes}
			/>
		</div>
	);
}
