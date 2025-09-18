/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useState, useRef } from '@wordpress/element';
import {
	BlockControls,
	InspectorControls,
	MediaReplaceFlow,
	RichText,
	useBlockProps,
	InnerBlocks,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
	store as blockEditorStore,
	useBlockEditingMode,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	ColorPicker,
	Notice,
	Button,
	ToolbarGroup,
	ToolbarButton,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { crop, edit as editIcon, link, linkOff, plus } from '@wordpress/icons';
import { isBlobURL } from '@wordpress/blob';

/**
 * Internal dependencies
 */
import { AdvancedImageBoxEditProps, ValidationIssue } from './types';
import {
	ANIMATION_OPTIONS,
	OVERLAY_POSITIONS,
	HOVER_EFFECTS,
	ALLOWED_INNER_BLOCKS,
	DEFAULT_INNER_BLOCKS_TEMPLATE
} from './constants';
import { validateBlockContent, getValidationSummary } from './validationUtils';

export default function edit({
	attributes,
	setAttributes,
	isSelected,
	className,
	clientId,
	context,
	onReplace,
	insertBlocksAfter,
}: AdvancedImageBoxEditProps) {
	const {
		url = '',
		alt = '',
		title = '',
		id = 0,
		width = '',
		height = '',
		aspectRatio = '',
		scale = '',
		href = '',
		linkTarget = '',
		rel = '',
		caption = '',
		showOverlayOnHover = false,
		overlayAnimation = 'fadeIn',
		overlayAnimationDuration = 1000,
		overlayAnimationDelay = 0,
		overlayPosition = 'bottom',
		overlayBackground = 'rgba(0,0,0,0.5)',
		overlayOpacity = 1,
		imageHoverEffect = 'none',
		borderRadius = '0px'
	} = attributes || {};

	// Validation state removed for better UX
	const [isEditingURL, setIsEditingURL] = useState(false);
	const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

	const borderProps = useBorderProps(attributes);
	const shadowProps = getShadowClassesAndStyles(attributes);
	const blockEditingMode = useBlockEditingMode();

	const { getSettings, getBlockRootClientId } = useSelect(blockEditorStore);
	const { createErrorNotice } = useDispatch('core/notices');

	// Get inner blocks for validation
	const innerBlocks = useSelect((select) => {
		const blocks = select(blockEditorStore).getBlocks(clientId);
		return Array.isArray(blocks) ? blocks : [];
	}, [clientId]);

	// Validation removed for better UX

	const blockProps = useBlockProps({
		ref: setPopoverAnchor,
		className: clsx(className, 'wp-block-jankx-advanced-image-box', {
			'has-overlay': showOverlayOnHover,
			'has-hover-effect': imageHoverEffect && imageHoverEffect !== 'none',
			'is-selected': isSelected,
		}),
	});

	const onSelectImage = (media: any) => {
		if (!media || !media.url) {
			setAttributes({
				url: undefined,
				alt: undefined,
				id: undefined,
				title: undefined,
			});
			return;
		}

		if (isBlobURL(media.url)) {
			return;
		}

		const { imageDefaultSize } = getSettings();
		const newSize = imageDefaultSize || 'full';

		setAttributes({
			url: media.url,
			alt: media.alt || '',
			title: media.title || '',
			id: media.id,
			sizeSlug: newSize,
		});
	};

	const onSelectURL = (newURL: string) => {
		if (newURL !== url) {
			setAttributes({
				url: newURL,
				id: undefined,
				sizeSlug: getSettings().imageDefaultSize,
			});
		}
	};

	const onUploadError = (message: string) => {
		createErrorNotice(message, { type: 'snackbar' });
		setAttributes({
			url: undefined,
			id: undefined,
		});
	};

	const startEditing = () => {
		setIsEditingURL(true);
	};

	const unlink = () => {
		setAttributes({
			href: undefined,
			linkTarget: undefined,
			rel: undefined,
		});
		setIsEditingURL(false);
	};

	// Validation notice removed for better UX

	const imageElement = url ? (
		<img
			src={url}
			alt={alt || ''}
			title={title}
			className={clsx(
				'wp-block-jankx-advanced-image-box__image',
				borderProps.className,
				{
					[`has-hover-${imageHoverEffect}`]: imageHoverEffect && imageHoverEffect !== 'none',
				}
			)}
			style={{
				...borderProps.style,
				...shadowProps.style,
				aspectRatio,
				objectFit: scale,
				width,
				height,
				borderRadius,
			}}
		/>
	) : (
		<div className="wp-block-jankx-advanced-image-box__placeholder">
			<MediaReplaceFlow
				mediaId={id}
				mediaURL={url}
				allowedTypes={['image']}
				accept="image/*"
				onSelect={onSelectImage}
				onSelectURL={onSelectURL}
				onError={onUploadError}
				name={!url ? __('Add image') : __('Replace')}
			/>
		</div>
	);

	const overlayContent = showOverlayOnHover && (
		<div
			className={clsx(
				'wp-block-jankx-advanced-image-box__overlay',
				`wp-block-jankx-advanced-image-box__overlay--${overlayPosition}`,
				'animated',
				overlayAnimation
			)}
			style={{
				opacity: overlayOpacity,
				animationDuration: `${overlayAnimationDuration}ms`,
				animationDelay: `${overlayAnimationDelay}ms`,
			}}
		>
			<div className="wp-block-jankx-advanced-image-box__overlay__content">
				<InnerBlocks
					allowedBlocks={ALLOWED_INNER_BLOCKS}
					templateLock={false}
					renderAppender={InnerBlocks.ButtonBlockAppender}
				/>
			</div>
		</div>
	);

	return (
		<>
			<div {...blockProps}>
				{imageElement}
				{overlayContent}
				{!RichText.isEmpty(caption) && (
					<RichText
						className="wp-block-jankx-advanced-image-box__caption"
						tagName="figcaption"
						value={caption}
						onChange={(value) => setAttributes({ caption: value })}
						placeholder={__('Add caption…')}
					/>
				)}
			</div>

			{isSelected && (
				<BlockControls>
					<ToolbarGroup>
						<MediaReplaceFlow
							mediaId={id}
							mediaURL={url}
							allowedTypes={['image']}
							accept="image/*"
							onSelect={onSelectImage}
							onSelectURL={onSelectURL}
							onError={onUploadError}
							name={!url ? __('Add image') : __('Replace')}
						/>
						{href && (
							<ToolbarButton
								icon={linkOff}
								label={__('Unlink')}
								onClick={unlink}
							/>
						)}
						{!href && (
							<ToolbarButton
								icon={link}
								label={__('Link')}
								onClick={startEditing}
							/>
						)}
					</ToolbarGroup>
				</BlockControls>
			)}

			<InspectorControls>
				<PanelBody title={__('Image Settings')} initialOpen={true}>
					<RichText
						className="wp-block-jankx-advanced-image-box__alt-text"
						tagName="p"
						value={alt || ''}
						onChange={(value) => setAttributes({ alt: value })}
						placeholder={__('Add alt text…')}
						help={__('Describe the purpose of the image. Leave empty if decorative.')}
					/>
					<RichText
						className="wp-block-jankx-advanced-image-box__title"
						tagName="p"
						value={title || ''}
						onChange={(value) => setAttributes({ title: value })}
						placeholder={__('Add title…')}
						help={__('Describe the role of this image on the page.')}
					/>
				</PanelBody>

				<PanelBody title={__('Overlay Settings')} initialOpen={false}>
					<ToggleControl
						label={__('Show overlay on hover')}
						checked={showOverlayOnHover}
						onChange={(value) => setAttributes({ showOverlayOnHover: value })}
					/>

					{showOverlayOnHover && (
						<>
							<SelectControl
								label={__('Animation')}
								value={overlayAnimation}
								options={[
									{ label: __('None'), value: 'none' },
									...ANIMATION_OPTIONS.map(option => ({
										label: option.label,
										value: option.value
									}))
								]}
								onChange={(value) => setAttributes({ overlayAnimation: value })}
							/>

							<RangeControl
								label={__('Animation Duration (ms)')}
								value={overlayAnimationDuration}
								onChange={(value) => setAttributes({ overlayAnimationDuration: value })}
								min={100}
								max={5000}
								step={100}
							/>

							<RangeControl
								label={__('Animation Delay (ms)')}
								value={overlayAnimationDelay}
								onChange={(value) => setAttributes({ overlayAnimationDelay: value })}
								min={0}
								max={2000}
								step={100}
							/>

							<SelectControl
								label={__('Overlay Position')}
								value={overlayPosition}
								options={OVERLAY_POSITIONS.map(position => ({
									label: position.label,
									value: position.value
								}))}
								onChange={(value) => setAttributes({ overlayPosition: value })}
							/>

							<ColorPicker
								color={overlayBackground}
								onChange={(value) => setAttributes({ overlayBackground: value })}
								label={__('Overlay Background')}
							/>

							<RangeControl
								label={__('Overlay Opacity')}
								value={overlayOpacity}
								onChange={(value) => setAttributes({ overlayOpacity: value })}
								min={0}
								max={1}
								step={0.1}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Hover Effects')} initialOpen={false}>
					<SelectControl
						label={__('Image Hover Effect')}
						value={imageHoverEffect}
						options={HOVER_EFFECTS.map(effect => ({
							label: effect.label,
							value: effect.value
						}))}
						onChange={(value) => setAttributes({ imageHoverEffect: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Styling')} initialOpen={false}>
					<RangeControl
						label={__('Border Radius (px)')}
						value={parseInt(borderRadius) || 0}
						onChange={(value) => setAttributes({ borderRadius: `${value}px` })}
						min={0}
						max={50}
						step={1}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
