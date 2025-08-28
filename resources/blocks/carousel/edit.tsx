/* eslint-disable @wordpress/no-unsafe-wp-apis */
/* eslint-disable import/no-unresolved */

import { range } from 'lodash';

import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	RichText,
	InnerBlocks,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	ColorPalette,
	PanelBody,
	PanelRow,
	RangeControl,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
	__experimentalRadio as Radio,
	__experimentalRadioGroup as RadioGroup,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { BLOCK_CLASS_NAME } from './constants';
import {
	TITLE_TAG,
	HAS_TITLE_DEFAULT,
	HAS_DESCRIPTION_DEFAULT,
	SLIDES_PER_VIEW_DEFAULT,
	SLIDES_PER_VIEW_MAX,
	SPACE_BETWEEN_DEFAULT,
	ALLOW_PAGINATION,
	HAS_PAGINATION_DEFAULT,
	ALLOW_NAVIGATION,
	HAS_NAVIGATION_DEFAULT,
	ALLOWED_BLOCKS,
	TEMPLATE,
	ALLOW_AUTOPLAY,
	AUTOPLAY_DEFAULT,
	ALLOW_LOOP,
	LOOP_DEFAULT,
	// Logo integration
	SCALE_FACTOR_DEFAULT,
	COLOR_SCHEMES,
	BACKGROUND_COLOR_DEFAULT,
	COLOR_DEFAULT,
} from './constants/editor';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './editor.scss';

function Appender({ ...props }: any) {
	return (
		<div className={`${BLOCK_CLASS_NAME}-inner-blocks__appender`}>
			<InnerBlocks.ButtonBlockAppender {...props} />
		</div>
	);
}

export default function Edit({ attributes, setAttributes, clientId, isSelected }: any) {
	const {
		hasTitle = HAS_TITLE_DEFAULT,
		title,
		hasDescription = HAS_DESCRIPTION_DEFAULT,
		description,
		slidesPerView = SLIDES_PER_VIEW_DEFAULT,
		spaceBetween = SPACE_BETWEEN_DEFAULT,
		hasPagination = HAS_PAGINATION_DEFAULT,
		hasNavigation = HAS_NAVIGATION_DEFAULT,
		shouldAutoplay = AUTOPLAY_DEFAULT,
		shouldLoop = LOOP_DEFAULT,
		// Logo integration
		scaleFactor = SCALE_FACTOR_DEFAULT,
		backgroundColor = BACKGROUND_COLOR_DEFAULT,
		color = COLOR_DEFAULT,
	} = attributes;

	const onChange = (key: any, value: any) => {
		setAttributes({ [key]: value });
	};

	const onHasTitleChange = () => onChange('hasTitle', !hasTitle);
	const onTitleChange = (value: any) => onChange('title', value);
	const onHasDescriptionChange = () => onChange('hasDescription', !hasDescription);
	const onDescriptionChange = (value: any) => onChange('description', value);
	const onSlidesPerViewChange = (value: any) => onChange('slidesPerView', value);
	const onSpaceBetweenChange = (value: any) => onChange('spaceBetween', value);
	const onHasPaginationChange = (value: any) => onChange('hasPagination', value ? 'true' : 'false');
	const onHasNavigationChange = (value: any) => onChange('hasNavigation', value ? 'true' : 'false');
	const onShouldAutoplayChange = (value: any) => onChange('shouldAutoplay', value ? 'true' : 'false');
	const onShouldLoopChange = (value: any) => onChange('shouldLoop', value ? 'true' : 'false');
	// Logo integration
	const onScaleFactorChange = (value: any) => onChange('scaleFactor', value);
	const onBackgroundColorChange = (value: any) => onChange('backgroundColor', value);
	const onColorChange = (value: any) => onChange('color', value);

	const innerBlocksCount = useSelect(
		(select: any) => select(blockEditorStore).getBlock(clientId)?.innerBlocks?.length || 0,
		[clientId]
	);
	const isParentOfSelectedBlock = useSelect(
		(select: any) => select(blockEditorStore).hasSelectedInnerBlock?.(clientId, true) || false,
		[clientId]
	);
	const isOpened = isSelected || isParentOfSelectedBlock;

	return (
		<div
			{...useBlockProps({
				className: `${BLOCK_CLASS_NAME} ${BLOCK_CLASS_NAME}_is-${
					isOpened ? 'opened' : 'closed'
				} ${BLOCK_CLASS_NAME}_columns-${slidesPerView}`,
			})}
		>
			<InspectorControls>
				<PanelBody title={__('Settings', 'jankx')}>
					<PanelRow>
						<ToggleControl label={__('Show title', 'jankx')} checked={hasTitle} onChange={onHasTitleChange} />
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show description', 'jankx')}
							checked={hasDescription}
							onChange={onHasDescriptionChange}
						/>
					</PanelRow>
					<PanelRow className="is-vertical">
						<legend className="blocks-base-control__label">{__('Columns', 'jankx')}</legend>
						<RadioGroup label={__('Columns', 'jankx')} onChange={onSlidesPerViewChange} checked={slidesPerView}>
							<Radio value="auto">{__('Auto', 'jankx')}</Radio>
							{range(1, (SLIDES_PER_VIEW_MAX as number) + 1).map((i) => (
								<Radio key={i} value={i.toString()}>
									{i}
								</Radio>
							))}
						</RadioGroup>
					</PanelRow>
					<PanelRow>
						<NumberControl
							label={__('Space between', 'jankx')}
							value={spaceBetween}
							onChange={onSpaceBetweenChange}
							min={0}
						/>
					</PanelRow>
					{ALLOW_PAGINATION && (
						<PanelRow>
							<ToggleControl
								label={__('Use pagination', 'jankx')}
								checked={hasPagination === 'true'}
								onChange={onHasPaginationChange}
							/>
						</PanelRow>
					)}
					{ALLOW_NAVIGATION && (
						<PanelRow>
							<ToggleControl
								label={__('Use navigation', 'jankx')}
								checked={hasNavigation === 'true'}
								onChange={onHasNavigationChange}
							/>
						</PanelRow>
					)}
					{ALLOW_AUTOPLAY && (
						<PanelRow>
							<ToggleControl
								label={__('Autoplay', 'jankx')}
								checked={shouldAutoplay === 'true'}
								onChange={onShouldAutoplayChange}
							/>
						</PanelRow>
					)}
					{ALLOW_LOOP && (
						<PanelRow>
							<ToggleControl
								label={__('Loop', 'jankx')}
								checked={shouldLoop === 'true'}
								onChange={onShouldLoopChange}
							/>
						</PanelRow>
					)}
				</PanelBody>
				<PanelBody title={__('Logo settings', 'jankx')} initialOpen={false}>
					<RangeControl
						label={__('Scale factor', 'jankx')}
						value={scaleFactor}
						onChange={onScaleFactorChange}
						withInputField={false}
						allowReset
						resetFallbackValue={SCALE_FACTOR_DEFAULT}
						min={1}
						max={1000}
						step={1}
					/>
					<legend>{__('Background', 'wpd-blocks')}</legend>
					<ColorPalette
						colors={COLOR_SCHEMES}
						value={backgroundColor}
						onChange={onBackgroundColorChange}
						className="components-color-list-picker__color-picker"
					/>
					<legend>{__('Text', 'wpd-blocks')}</legend>
					<ColorPalette
						colors={COLOR_SCHEMES.slice().reverse()}
						value={color}
						onChange={onColorChange}
						className="components-color-list-picker__color-picker"
					/>
				</PanelBody>
			</InspectorControls>
			<div className={`${BLOCK_CLASS_NAME}__header`}>
				{hasTitle && (
					<RichText
						tagName={TITLE_TAG}
						value={title}
						placeholder={__('Title', 'wpd-blocks')}
						onChange={onTitleChange}
						className={`${BLOCK_CLASS_NAME}__title`}
					/>
				)}
				{hasDescription && (
					<RichText
						tagName="div"
						multiline="p"
						value={description}
						placeholder={__('Description', 'wpd-blocks')}
						onChange={onDescriptionChange}
						className={`${BLOCK_CLASS_NAME}__description`}
					/>
				)}
			</div>
			<div
				className="swiper"
				data-slides-per-view={slidesPerView}
				data-space-between={spaceBetween}
				{...(ALLOW_PAGINATION && { 'data-has-pagination': hasPagination })}
				{...(ALLOW_NAVIGATION && { 'data-has-navigation': hasNavigation })}
				{...(ALLOW_AUTOPLAY && { 'data-should-autoplay': shouldAutoplay })}
				{...(ALLOW_LOOP && { 'data-should-loop': shouldLoop })}
				style={{
					'--space-between': `${spaceBetween}px`,
				}}
			>
				<div
					{...useInnerBlocksProps(
						{
							className: 'swiper-wrapper',
						},
						{
							allowedBlocks: ALLOWED_BLOCKS,
							orientation: 'horizontal',
							renderAppender: isOpened && Appender,
							template: TEMPLATE,
						}
					)}
				/>
				{!isOpened && (
					<>
						{ALLOW_PAGINATION && hasPagination === 'true' && (
							<div className="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal">
								{range(innerBlocksCount).map((i) => (
									<span
										key={i}
										className={`swiper-pagination-bullet ${i === 0 ? 'swiper-pagination-bullet-active' : ''}`}
									/>
								))}
							</div>
						)}
						{ALLOW_NAVIGATION && hasNavigation === 'true' && (
							<>
								<div className="swiper-button-prev" />
								<div className="swiper-button-next" />
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
