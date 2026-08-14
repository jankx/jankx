import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import {
	__experimentalUnitControl as UnitControl,
	BaseControl,
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { arrowDown, arrowLeft, arrowRight, arrowUp, dragHandle, Icon } from '@wordpress/icons';
import type { PointerEvent as ReactPointerEvent } from 'react';

import {
	applyMove,
	buildClassName,
	buildInlineStyle,
	MAX_PULL_UP,
	NUDGE_STEPS,
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
	clientId: string;
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

function NudgePad({
	attributes,
	setAttributes,
}: {
	attributes: OverlapGroupAttributes;
	setAttributes: EditProps['setAttributes'];
}) {
	const step = attributes.dragStep ?? 10;

	const handleMove = (dx: number, dy: number) => {
		setAttributes(applyMove(attributes, dx, dy));
	};

	return (
		<BaseControl label={__('Move', 'jankx')}>
			<div className="jankx-overlap-group__nudge-grid">
				<span />
				<Button
					icon={arrowUp}
					label={__('Move up', 'jankx')}
					onClick={() => handleMove(0, -step)}
				/>
				<span />
				<Button
					icon={arrowLeft}
					label={__('Move left', 'jankx')}
					onClick={() => handleMove(-step, 0)}
				/>
				<span />
				<Button
					icon={arrowRight}
					label={__('Move right', 'jankx')}
					onClick={() => handleMove(step, 0)}
				/>
				<span />
				<Button
					icon={arrowDown}
					label={__('Move down', 'jankx')}
					onClick={() => handleMove(0, step)}
				/>
				<span />
			</div>
			<SelectControl
				label={__('Nudge step', 'jankx')}
				value={String(step)}
				options={NUDGE_STEPS.map((n) => ({ value: String(n), label: `${n}px` }))}
				onChange={(next) => setAttributes({ dragStep: parseInt(next, 10) })}
				__nextHasNoMarginBottom
			/>
		</BaseControl>
	);
}

export default function Edit({ attributes, setAttributes, clientId }: EditProps) {
	const { positionType = 'relative', tagName = 'div' } = attributes;

	const { selectBlock } = useDispatch('core/block-editor');

	const dragStart = useRef<{ x: number; y: number; attrs: OverlapGroupAttributes } | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const blockProps = useBlockProps({
		className: buildClassName(attributes),
		style: buildInlineStyle(attributes) as never,
	});

	const onDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (event.button !== 0) {
			return;
		}
		event.preventDefault();
		selectBlock(clientId);
		dragStart.current = { x: event.clientX, y: event.clientY, attrs: { ...attributes } };
		event.currentTarget.setPointerCapture(event.pointerId);
		setIsDragging(true);
	};

	const onDragMove = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (!dragStart.current) {
			return;
		}
		const dx = event.clientX - dragStart.current.x;
		const dy = event.clientY - dragStart.current.y;
		setAttributes(applyMove(dragStart.current.attrs, dx, dy));
	};

	const onDragEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (!dragStart.current) {
			return;
		}
		dragStart.current = null;
		setIsDragging(false);
		if (event.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
	};

	return (
		<>
			<div {...blockProps}>
				{positionType !== 'static' && (
					<div
						className={
							'jankx-overlap-group__drag-handle' + (isDragging ? ' is-dragging' : '')
						}
						role="button"
						tabIndex={-1}
						aria-label={__('Drag to position the overlap group', 'jankx')}
						onPointerDown={onDragStart}
						onPointerMove={onDragMove}
						onPointerUp={onDragEnd}
						onPointerCancel={onDragEnd}
					>
						<Icon icon={dragHandle} size={18} />
					</div>
				)}
				<InnerBlocks />
			</div>

			<InspectorControls>
				<PanelBody title={__('Overlap Settings', 'jankx')} initialOpen={true}>
					<p className="components-base-control__help">
						{__(
							'Kéo thanh di chuyển trên block hoặc dùng các nút bên dưới để đẩy block đè lên các section khác.',
							'jankx'
						)}
					</p>
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
							<NudgePad attributes={attributes} setAttributes={setAttributes} />

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
						max={MAX_PULL_UP}
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
