import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import {
	UnitControl,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import {
	buildClassName,
	buildInlineStyle,
	OFFSET_SIDES,
	OFFSET_UNITS,
	OverlapGroupAttributes,
	OffsetSide,
	PositionType,
} from './attributes';

const SIDE_LABELS: Record<OffsetSide, string> = {
	top: __('Top', 'jankx'),
	right: __('Right', 'jankx'),
	bottom: __('Bottom', 'jankx'),
	left: __('Left', 'jankx'),
};

type EditProps = {
	attributes: OverlapGroupAttributes;
	setAttributes: (attrs: Partial<OverlapGroupAttributes>) => void;
};

function OffsetControl({
	side,
	attributes,
	setAttributes,
}: {
	side: OffsetSide;
	attributes: OverlapGroupAttributes;
	setAttributes: EditProps['setAttributes'];
}) {
	const value = attributes[side];
	const unit = attributes.offsetUnit || 'px';

	const onChange = (next: string | undefined) => {
		if (next === undefined || next === '') {
			setAttributes({ [side]: undefined });
			return;
		}

		const match = String(next).match(/^([+-]?\d+(?:\.\d+)?)([a-z%]*)$/i);
		if (match) {
			const num = parseFloat(match[1]);
			const nextUnit = match[2] || 'px';
			setAttributes({
				[side]: num,
				offsetUnit: OFFSET_UNITS.includes(nextUnit as never) ? (nextUnit as OffsetUnit) : unit,
			});
			return;
		}

		setAttributes({ [side]: parseFloat(next) || undefined });
	};

	return (
		<UnitControl
			label={SIDE_LABELS[side]}
			value={value !== undefined ? `${value}${unit}` : ''}
			onChange={onChange}
			units={OFFSET_UNITS.map((u) => ({ value: u, label: u }))}
			allowReset={true}
			__next40pxDefaultSize={true}
			min={-1000}
			max={1000}
		/>
	);
}

export default function Edit({ attributes, setAttributes }: EditProps) {
	const { positionType = 'relative', tagName = 'div' } = attributes;

	const blockProps = useBlockProps({
		className: buildClassName(attributes),
		style: buildInlineStyle(attributes) as never,
	});

	return (
		<>
			<div {...blockProps}>
				<InnerBlocks />
			</div>

			<InspectorControls>
				<PanelBody title={__('Position & Overlap', 'jankx')} initialOpen={true}>
					<SelectControl
						label={__('Position type', 'jankx')}
						value={positionType}
						options={[
							{ label: __('Static (in flow)', 'jankx'), value: 'static' },
							{ label: __('Relative', 'jankx'), value: 'relative' },
							{ label: __('Absolute (overlap)', 'jankx'), value: 'absolute' },
						]}
						onChange={(next) => setAttributes({ positionType: next as PositionType })}
						help={
							positionType === 'absolute'
								? __('Positioned relative to the nearest positioned ancestor. The parent section needs a position (e.g. relative) for the offsets to apply to it.', 'jankx')
								: positionType === 'relative'
									? __('Relative keeps the group in the document flow but lets you shift it. Use a negative pull-up or offsets to overlap the section above.', 'jankx')
									: undefined
						}
					/>

					{positionType !== 'static' && (
						<>
							<hr className="components-divider" style={{ border: 0, borderTop: '1px solid #ccc', margin: '8px 0' }} />
							<p className="components-base-control__help">
								{__('Offsets', 'jankx')}
							</p>
							{OFFSET_SIDES.map((side) => (
								<OffsetControl
									key={side}
									side={side}
									attributes={attributes}
									setAttributes={setAttributes}
								/>
							))}
							<RangeControl
								label={__('Z-index', 'jankx')}
								value={attributes.zIndex ?? 0}
								onChange={(zIndex) => setAttributes({ zIndex })}
								min={0}
								max={1000}
							/>
						</>
					)}

				<hr className="components-divider" style={{ border: 0, borderTop: '1px solid #ccc', margin: '8px 0' }} />

				<RangeControl
					label={__('Pull up to overlap section above', 'jankx')}
						value={attributes.pullUp ?? 0}
						onChange={(pullUp) => setAttributes({ pullUp })}
						min={0}
						max={400}
						help={__('Applies a negative top margin (px) so this group climbs over the section above it.', 'jankx')}
					/>
				</PanelBody>

				<PanelBody title={__('Size', 'jankx')} initialOpen={false}>
					<TextControl
						label={__('Width', 'jankx')}
						value={attributes.width || ''}
						placeholder={__('e.g. 400px, 60%, 80rem', 'jankx')}
						onChange={(width) => setAttributes({ width: width || undefined })}
					/>
					<TextControl
						label={__('Max width', 'jankx')}
						value={attributes.maxWidth || ''}
						placeholder={__('e.g. 1200px, 80rem, 100%', 'jankx')}
						onChange={(maxWidth) => setAttributes({ maxWidth: maxWidth || undefined })}
					/>
				</PanelBody>

				<PanelBody title={__('Container', 'jankx')} initialOpen={false}>
					<SelectControl
						label={__('HTML tag', 'jankx')}
						value={tagName}
						options={[
							{ label: 'div', value: 'div' },
							{ label: 'section', value: 'section' },
							{ label: 'article', value: 'article' },
							{ label: 'aside', value: 'aside' },
							{ label: 'main', value: 'main' },
						]}
						onChange={(tagName) => setAttributes({ tagName })}
					/>
					<ToggleControl
						label={__('Lock inner blocks', 'jankx')}
						checked={attributes.templateLock === 'all'}
						onChange={(locked) =>
							setAttributes({ templateLock: locked ? 'all' : false })
						}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
