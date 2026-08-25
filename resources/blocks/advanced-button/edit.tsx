/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ExternalLink,
	Popover,
	SelectControl,
	TextControl,
	ToggleControl,
	ToolbarButton,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import {
	BlockControls,
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
	withColors,
	ButtonBlockAppender,
	__experimentalLinkControl as LinkControl,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	useBlockEditingMode,
	BlockEdit,
} from '@wordpress/block-editor';
import { useState, useRef, useCallback, useEffect, useMemo } from '@wordpress/element';
import { displayShortcut, isKeyboardEvent } from '@wordpress/keycodes';
import { link } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';

interface EditProps {
	attributes: {
		triggerType: string;
		buttonType: string;
		modalId: string;
		modalShareObjectId: boolean;
		modalSharePostTitle: boolean;
		modalShareCurrentUrl: boolean;
		modalShareFeaturedImageId?: boolean;
		modalShareFeaturedImageUrl?: boolean;
		formData: Array<{ key: string; value: string }>;
		formMappings?: Array<{ source: string; selector: string; mode?: 'value' | 'attribute'; attributeName?: string }>;
		text: string;
		url: string;
		title: string;
		linkTarget: string;
		rel: string;
		placeholder: string;
		backgroundColor: string;
		textColor: string;
		gradient: string;
		width: number;
		style: Record<string, any>;
		useIconBlocks: boolean;
		iconPosition: string;
		showLabel: boolean;
		showForPostType?: string;
		hoverAnimation: string;
		unhoverAnimation: string;
		className?: string;
		renderIconOutside: boolean;
	};
	setAttributes: (attrs: Partial<EditProps['attributes']>) => void;
	backgroundColor: any;
	textColor: any;
	setBackgroundColor: (color: string | undefined) => void;
	setTextColor: (color: string | undefined) => void;
	clientId: string;
}

const NEW_TAB_REL = 'noreferrer noopener';
const ALLOWED_BLOCKS = ['jankx/icon-picker', 'jankx/svg-icon', 'core/image', 'core/html'];
const ICON_TEMPLATE: any[] = [];

/**
 * The edit function for the Advanced Button Block.
 */
export function Edit(props: EditProps) {
	const {
		attributes,
		setAttributes,
		backgroundColor,
		textColor,
		setBackgroundColor,
		setTextColor,
		clientId,
	} = props;

	const {
		triggerType = 'link',
		buttonType = 'button',
		modalId = '',
		modalShareObjectId = false,
		modalSharePostTitle = false,
		modalShareCurrentUrl = false,
		modalShareFeaturedImageId = false,
		modalShareFeaturedImageUrl = false,
		modalFeaturedImageSize = 'full',
		formData = [],
		formMappings = [],
		text,
		url,
		title,
		linkTarget,
		rel,
		placeholder,
		style,
		useIconBlocks = false,
		iconPosition = 'left',
		showLabel = true,
		conditionType = 'always',
		showForPostType = '',
		hoverAnimation = 'none',
		unhoverAnimation = 'none',
	} = attributes;
	const { renderIconOutside } = attributes;

	const shareEnabled =
		(modalShareObjectId || modalSharePostTitle || modalShareCurrentUrl || modalShareFeaturedImageId || modalShareFeaturedImageUrl);
	// Backward compatibility auto-migrate
	useEffect(() => {
		if (!(attributes as any)?.conditionType && showForPostType) {
			setAttributes({ conditionType: 'post-type' });
		}
	}, [showForPostType]);

	// Check if block has inner blocks (icon blocks)
	const hasInnerBlocks = useSelect(
		(select: any) => {
			const { getBlockCount } = select('core/block-editor');
			return getBlockCount(clientId) > 0;
		},
		[clientId]
	);
	const { isInsideDynamicTemplate, multiPostTypes, detectedPostType } = useSelect(
		(select: any) => {
			const { getBlockParents, getBlock } = select('core/block-editor');
			const parents: string[] = getBlockParents(clientId) || [];
			const templateId = parents.find((id) => getBlock(id)?.name === 'jankx/dynamic-data-template');
			let multi = { enabled: false, postTypes: [] as string[] };
			let detected = '';
			if (templateId) {
				const layoutId = getBlockParents(templateId).find((id: string) => ['jankx/dynamic-data-layout', 'jankx/dynamic-ssr-layout'].includes(getBlock(id)?.name));
				if (layoutId) {
					const layoutBlock = getBlock(layoutId);
					const attrs = layoutBlock?.attributes || {};
					if (attrs?.useMultiPostType && Array.isArray(attrs?.postTypes) && attrs.postTypes.length > 1) {
						multi = { enabled: true, postTypes: attrs.postTypes as string[] };
					}
					if (attrs?.postType) {
						detected = attrs.postType as string;
					} else if (Array.isArray(attrs?.postTypes) && attrs.postTypes.length > 0) {
						detected = attrs.postTypes[0] as string;
					}
				}
			}
			return { isInsideDynamicTemplate: !!templateId, multiPostTypes: multi, detectedPostType: detected };
		},
		[clientId]
	);
	const wpPostTypes = useSelect((select: any) => {
		const core = select('core');
		return core.getPostTypes({ per_page: -1 }) || [];
	}, []);
	const publicPostTypes: Array<{ slug: string; name: string }> = Array.isArray((window as any).jankxPublicPostTypes)
		? (window as any).jankxPublicPostTypes
		: [];
	const postTypeOptions = useMemo(
		() => {
			const map = new Map<string, string>();
			(wpPostTypes || [])
				.filter((type: any) => type.slug !== 'attachment')
				.forEach((type: any) => {
					if (!map.has(type.slug)) {
						map.set(type.slug, type.name);
					}
				});
			publicPostTypes
				.filter((pt) => pt.slug !== 'attachment')
				.forEach((pt) => {
					if (!map.has(pt.slug)) {
						map.set(pt.slug, pt.name || pt.slug);
					}
				});
			return Array.from(map.entries()).map(([value, label]) => ({ label, value }));
		},
		[wpPostTypes, publicPostTypes]
	);
	useEffect(() => {
		if (
			isInsideDynamicTemplate &&
			conditionType === 'always' &&
			(!showForPostType || showForPostType === '') &&
			detectedPostType
		) {
			setAttributes({ conditionType: 'post-type', showForPostType: detectedPostType });
		}
	}, [isInsideDynamicTemplate, detectedPostType, conditionType, showForPostType, setAttributes]);
	useEffect(() => {
		if (isInsideDynamicTemplate && conditionType === 'post-type') {
			const isInvalid =
				showForPostType === 'attachment' ||
				(!!showForPostType && !postTypeOptions.some((opt) => opt.value === showForPostType));
			if (isInvalid && detectedPostType) {
				setAttributes({ showForPostType: detectedPostType });
			}
		}
	}, [isInsideDynamicTemplate, conditionType, showForPostType, detectedPostType, postTypeOptions, setAttributes]);

	// Get all modal blocks from the page
	const modalBlocks = useSelect(
		(select: any) => {
			const { getBlocks } = select('core/block-editor');
			const allBlocks = getBlocks();

			// Recursively find all jankx/modal blocks
			const findModalBlocks = (blocks: any[]): any[] => {
				let modals: any[] = [];
				blocks.forEach((block: any) => {
					if (block.name === 'jankx/modal' && block.attributes?.modalId) {
						modals.push({
							id: block.attributes.modalId,
							title: block.attributes.modalTitle || block.attributes.modalId,
						});
					}
					if (block.innerBlocks && block.innerBlocks.length > 0) {
						modals = [...modals, ...findModalBlocks(block.innerBlocks)];
					}
				});
				return modals;
			};

			return findModalBlocks(allBlocks);
		},
		[]
	);
	const [isEditingURL, setIsEditingURL] = useState<boolean>(false);
	const [isCustomModalId, setIsCustomModalId] = useState<boolean>(false);
	const linkRef = useRef<HTMLButtonElement>(null);
	const isURLSet = !!url;
	const opensInNewTab = linkTarget === '_blank';

	const unlink = useCallback(() => {
		setAttributes({
			url: undefined,
			linkTarget: undefined,
			rel: undefined,
		});
		setIsEditingURL(false);
	}, [setAttributes]);

	const onToggleOpenInNewTab = useCallback((value: boolean) => {
		const newLinkTarget = value ? '_blank' : undefined;
		let updatedRel = rel;

		if (newLinkTarget && !rel) {
			updatedRel = NEW_TAB_REL;
		} else if (!newLinkTarget && rel === NEW_TAB_REL) {
			updatedRel = undefined;
		}

		setAttributes({
			linkTarget: newLinkTarget,
			rel: updatedRel,
		});
	}, [rel, setAttributes]);

	const onKeyDown = useCallback((event: React.KeyboardEvent) => {
		if (isKeyboardEvent.primary(event as any, 'k')) {
			event.preventDefault();
			setIsEditingURL(true);
		} else if (isKeyboardEvent.primaryShift(event as any, 'k')) {
			unlink();
			linkRef.current?.focus();
		}
	}, [unlink]);

	const blockProps = useBlockProps({
		className: classnames('jankx-advanced-button', {
			[`icon-position-${iconPosition}`]: hasInnerBlocks && iconPosition,
		}),
		onKeyDown,
	});

	const borderProps = getBorderClassesAndStyles(attributes);

	// Check if button has no color settings
	const hasNoColorSettings = !backgroundColor?.slug &&
		!backgroundColor?.color &&
		!textColor?.slug &&
		!textColor?.color &&
		!attributes.gradient &&
		!attributes.style?.color?.background &&
		!attributes.style?.color?.text &&
		!attributes.style?.color?.gradient;

	// Check style variants
	const isOutline = attributes.className?.includes('is-style-outline');
	const isTextLink = attributes.className?.includes('is-style-text-link');

	const buttonClasses = classnames('jankx-advanced-button__link', borderProps?.className, {
		[`has-${backgroundColor?.slug}-background-color`]: backgroundColor?.slug && !isOutline,
		[`has-${textColor?.slug}-color`]: textColor?.slug,
		'has-background': backgroundColor?.color && !isOutline,
		'has-text-color': textColor?.color,
		[`icon-position-${iconPosition}`]: hasInnerBlocks && iconPosition,
		'is-default-colors': hasNoColorSettings,
		[`hover-ani-${hoverAnimation}`]: hoverAnimation !== 'none',
		[`unhover-ani-${unhoverAnimation}`]: unhoverAnimation !== 'none',
	});

	// Build button styles - gradient takes priority over background color
	const buttonStyles: Record<string, any> = {
		...blockProps.style,
		...borderProps?.style,
	};

	// Apply custom colors from style.color if set (these have highest priority)
	if (attributes.style?.color?.text) {
		buttonStyles.color = attributes.style.color.text;
	}

	// Apply gradient if set (gradient takes priority over background color)
	if (attributes.style?.color?.gradient) {
		buttonStyles.background = attributes.style.color.gradient;
		// Remove backgroundColor when gradient is set
		delete buttonStyles.backgroundColor;
	} else if (attributes.style?.color?.background) {
		// Only apply background color if no gradient is set
		buttonStyles.backgroundColor = attributes.style.color.background;
	}

	// Apply preset colors only if custom colors are not set
	if (!attributes.style?.color?.text && textColor?.color) {
		buttonStyles.color = textColor.color;
	}
	if (!attributes.style?.color?.background && !attributes.style?.color?.gradient && backgroundColor?.color) {
		buttonStyles.backgroundColor = backgroundColor.color;
	}

	// For Outline style, force transparent background and apply border color
	if (isOutline) {
		delete buttonStyles.backgroundColor;
		delete buttonStyles.background;
		// Use text color for border color
		if (buttonStyles.color) {
			buttonStyles.borderColor = buttonStyles.color;
		}
	}

	// For Text Link style, force transparency and remove padding
	if (isTextLink) {
		delete buttonStyles.backgroundColor;
		delete buttonStyles.background;
		buttonStyles.border = 'none';
		buttonStyles.padding = '0';
	}

	// Render button content - Always render InnerBlocks at the same position
	// Use CSS flex-order to control visual position
	const renderButtonInnerContent = () => (
		<>
			{!renderIconOutside && (
				<span className="button-icon-wrapper">
					<InnerBlocks
						allowedBlocks={ALLOWED_BLOCKS}
						template={ICON_TEMPLATE}
						templateLock={false}
						renderAppender={hasInnerBlocks ? false : InnerBlocks.ButtonBlockAppender}
						orientation="horizontal"
						__experimentalCaptureToolbars={false}
					/>
				</span>
			)}
			{showLabel && (
				<RichText
					tagName="span"
					className="button-text"
					value={text}
					onChange={(value: string) => setAttributes({ text: value })}
					placeholder={placeholder || __('Button text...', 'jankx')}
					allowedFormats={[]}
				/>
			)}
		</>
	);

	const renderIconMarkup = () => (
		renderIconOutside ? (
			<span className="button-icon-wrapper">
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					template={ICON_TEMPLATE}
					templateLock={false}
					renderAppender={hasInnerBlocks ? false : InnerBlocks.ButtonBlockAppender}
					orientation="horizontal"
					__experimentalCaptureToolbars={false}
				/>
			</span>
		) : null
	);

	const renderButton = (content: React.ReactNode) => {
		const iconMarkup = renderIconMarkup();
		if (!renderIconOutside) return <div {...blockProps}>{content}</div>;

		return (
			<div {...blockProps}>
				{iconPosition === 'left' || iconPosition === 'top' ? iconMarkup : null}
				{content}
				{iconPosition === 'right' || iconPosition === 'bottom' ? iconMarkup : null}
			</div>
		);
	};

	// Render button element based on trigger type
	let buttonElement = null;

	switch (triggerType) {
		case 'link':
			buttonElement = (
				<a
					className={buttonClasses}
					target={linkTarget}
					rel={rel}
					style={buttonStyles}
					title={title}
					data-hover-ani={hoverAnimation !== 'none' ? hoverAnimation : undefined}
					data-unhover-ani={unhoverAnimation !== 'none' ? unhoverAnimation : undefined}
					onClick={(e: React.MouseEvent) => {
						// In editor, prevent default navigation completely
						e.preventDefault();
					}}
					onClickCapture={(e: React.MouseEvent) => {
						// Allow appender clicks to work normally
						const target = e.target as HTMLElement;
						if (target.closest('.block-list-appender')) {
							// Don't prevent appender clicks
							return;
						}
						// Allow clicks within inner blocks to propagate normally
						// This ensures icon blocks can handle their own events
						if (target.closest('.block-editor-block-list__block:not(.block-list-appender)')) {
							// Let inner blocks handle their own interactions
							return;
						}
					}}
				>
					{renderButtonInnerContent()}
				</a>
			);
			break;

		case 'button':
			buttonElement = (
				<button
					className={buttonClasses}
					type={buttonType as any}
					style={buttonStyles}
					title={title}
					data-hover-ani={hoverAnimation !== 'none' ? hoverAnimation : undefined}
					data-unhover-ani={unhoverAnimation !== 'none' ? unhoverAnimation : undefined}
				>
					{renderButtonInnerContent()}
				</button>
			);
			break;

		case 'detail-link':
			buttonElement = (
				<a
					className={buttonClasses}
					href="javascript:void(0)"
					style={buttonStyles}
					title={title}
					data-hover-ani={hoverAnimation !== 'none' ? hoverAnimation : undefined}
					data-unhover-ani={unhoverAnimation !== 'none' ? unhoverAnimation : undefined}
					onClick={(e: React.MouseEvent) => {
						// Prevent navigation in editor
						e.preventDefault();
					}}
					onClickCapture={(e: React.MouseEvent) => {
						// Allow clicks within inner blocks to propagate normally
						const target = e.target as HTMLElement;
						if (target.closest('.block-list-appender') || target.closest('.block-editor-block-list__block:not(.block-list-appender)')) {
							return; // Let inner blocks handle their own interactions
						}
					}}
				>
					{renderButtonInnerContent()}
				</a>
			);
			break;

		case 'modal':
			buttonElement = (
				<button
					className={buttonClasses}
					type="button"
					data-modal-id={modalId}
					style={buttonStyles}
					title={title}
					data-hover-ani={hoverAnimation !== 'none' ? hoverAnimation : undefined}
					data-unhover-ani={unhoverAnimation !== 'none' ? unhoverAnimation : undefined}
				>
					{renderButtonInnerContent()}
				</button>
			);
			break;

		default:
			buttonElement = (
				<button
					className={buttonClasses}
					style={buttonStyles}
					title={title}
					data-hover-ani={hoverAnimation !== 'none' ? hoverAnimation : undefined}
					data-unhover-ani={unhoverAnimation !== 'none' ? unhoverAnimation : undefined}
				>
					{renderButtonInnerContent()}
				</button>
			);
	}

	return (
		<>
			<BlockControls group="block">
				{/* Hide link toolbar for detail-link and modal triggers */}
				{triggerType === 'link' && (
					<>
						<ToolbarButton
							ref={linkRef}
							name="link"
							icon={link}
							title={__('Link', 'jankx')}
							shortcut={displayShortcut.primary('k')}
							onClick={() => setIsEditingURL(true)}
							isActive={isURLSet}
						/>
						{isEditingURL && (
							<Popover
								className="wp-block-jankx-advanced-button__link-popover"
								anchor={linkRef?.current}
								offset={12}
								placement="bottom"
								onClose={() => {
									setIsEditingURL(false);
									linkRef.current?.focus();
								}}
								focusOnMount={isEditingURL ? 'firstElement' : false}
								variant="alternate"
							>
								<LinkControl
									value={{ url, opensInNewTab }}
									onChange={({
										url: newURL = '',
										opensInNewTab: newOpensInNewTab,
									}: any) => {
										setAttributes({ url: newURL });

										if (opensInNewTab !== newOpensInNewTab) {
											onToggleOpenInNewTab(newOpensInNewTab);
										}
									}}
									onRemove={() => {
										unlink();
										linkRef.current?.focus();
									}}
									settings={[
										{
											id: 'opensInNewTab',
											title: __('Open in new tab', 'jankx'),
										},
									]}
									showSuggestions={true}
									showInitialSuggestions={true}
								/>
							</Popover>
						)}
					</>
				)}
			</BlockControls>

			<InspectorControls group="settings">
				<ToolsPanel
					label={__('Trigger Settings', 'jankx')}
					resetAll={() => {
						setAttributes({
							triggerType: 'link',
							buttonType: 'button',
							url: undefined,
							linkTarget: undefined,
							rel: undefined,
							conditionType: 'always',
							showForPostType: '',
						});
					}}
				>
					<ToolsPanelItem
						label={__('Condition Type', 'jankx')}
						isShownByDefault
						hasValue={() => conditionType !== 'always'}
						onDeselect={() => {
							setAttributes({ conditionType: 'always', showForPostType: '' });
						}}
					>
						<SelectControl
							label={__('Condition Type', 'jankx')}
							value={conditionType}
							options={[
								{ label: __('Always show', 'jankx'), value: 'always' },
								{ label: __('Only show for Post Type', 'jankx'), value: 'post-type' },
							]}
							onChange={(value) => setAttributes({ conditionType: value })}
							help={__('Choose when this button should be visible', 'jankx')}
						/>
						{conditionType === 'post-type' && (
							<SelectControl
								label={__('Post Type', 'jankx')}
								value={showForPostType || ''}
								options={[{ label: __('Select Post Type', 'jankx'), value: '' }, ...postTypeOptions]}
								onChange={(value) => setAttributes({ showForPostType: value })}
								help={__('Only render this button for the selected post type', 'jankx')}
							/>
						)}
					</ToolsPanelItem>
					<ToolsPanelItem
						label={__('Trigger Type', 'jankx')}
						isShownByDefault
						hasValue={() => triggerType !== 'link'}
						onDeselect={() => setAttributes({ triggerType: 'link' })}
					>
						<SelectControl
							label={__('Trigger Type', 'jankx')}
							value={triggerType}
							options={[
								{ label: __('🔗 Link - Custom URL', 'jankx'), value: 'link' },
								{ label: __('🔘 Button - Form Action', 'jankx'), value: 'button' },
								{ label: __('📄 Detail Link - Current Object', 'jankx'), value: 'detail-link' },
								{ label: __('🪟 Modal - Open Modal', 'jankx'), value: 'modal' }
							]}
							onChange={(value) => setAttributes({ triggerType: value })}
							help={__('Choose what happens when users click this button', 'jankx')}
						/>
					</ToolsPanelItem>

					{triggerType === 'link' && (
						<>
							<ToolsPanelItem
								label={__('URL', 'jankx')}
								isShownByDefault
								hasValue={() => !!url}
								onDeselect={() => setAttributes({ url: undefined })}
							>
								<TextControl
									label={__('URL', 'jankx')}
									value={url || ''}
									onChange={(value) => setAttributes({ url: value })}
									placeholder={__('Enter URL...', 'jankx')}
									__nextHasNoMarginBottom
								/>
							</ToolsPanelItem>
							<ToolsPanelItem
								label={__('Open in new tab', 'jankx')}
								isShownByDefault
								hasValue={() => opensInNewTab}
								onDeselect={() => onToggleOpenInNewTab(false)}
							>
								<ToggleControl
									label={__('Open in new tab', 'jankx')}
									checked={opensInNewTab}
									onChange={onToggleOpenInNewTab}
									help={__('Adds target="_blank" and rel="noreferrer noopener"', 'jankx')}
								/>
							</ToolsPanelItem>
						</>
					)}

					{triggerType === 'button' && (
						<ToolsPanelItem
							label={__('Button Type', 'jankx')}
							isShownByDefault
							hasValue={() => buttonType !== 'button'}
							onDeselect={() => setAttributes({ buttonType: 'button' })}
						>
							<SelectControl
								label={__('Button Type', 'jankx')}
								value={buttonType}
								options={[
									{ label: __('Button', 'jankx'), value: 'button' },
									{ label: __('Submit', 'jankx'), value: 'submit' },
									{ label: __('Reset', 'jankx'), value: 'reset' }
								]}
								onChange={(value) => setAttributes({ buttonType: value })}
								help={__('Defines the button behavior in forms', 'jankx')}
							/>
						</ToolsPanelItem>
					)}

					{triggerType === 'detail-link' && (
						<div style={{
							padding: '12px',
							background: '#fff3cd',
							borderRadius: '4px',
							marginTop: '12px',
							border: '1px solid #ffeaa7'
						}}>
							<p style={{ margin: '0', fontSize: '12px', color: '#856404' }}>
								📄 {__('This button will link to the current post/page permalink on the frontend.', 'jankx')}
							</p>
						</div>
					)}

					{triggerType === 'modal' && (
						<>
							<ToolsPanelItem
								label={__('Modal ID', 'jankx')}
								isShownByDefault
								hasValue={() => !!modalId}
								onDeselect={() => {
									setAttributes({ modalId: undefined });
									setIsCustomModalId(false);
								}}
							>
								<SelectControl
									label={__('Modal ID', 'jankx')}
									value={isCustomModalId ? '__custom__' : (modalId || '')}
									options={[
										{ label: __('Select a modal...', 'jankx'), value: '' },
										...modalBlocks.map((modal: any) => ({
											label: modal.title,
											value: modal.id,
										})),
										{ label: __('✏️ Custom ID (Manual Input)', 'jankx'), value: '__custom__' },
									]}
									onChange={(value) => {
										if (value === '__custom__') {
											setIsCustomModalId(true);
											setAttributes({ modalId: '' });
										} else {
											setIsCustomModalId(false);
											setAttributes({ modalId: value });
										}
									}}
									help={
										isCustomModalId
											? __('Enter custom modal ID in the field below', 'jankx')
											: modalBlocks.length === 0
												? __('No modal blocks found on this page. Add a modal block first or use custom ID.', 'jankx')
												: __('Select a modal block to trigger, or choose custom ID', 'jankx')
									}
									__nextHasNoMarginBottom
								/>
								{isCustomModalId && (
									<>
										<div style={{ marginTop: '12px' }}>
											<TextControl
												label={__('Custom Modal ID', 'jankx')}
												value={modalId || ''}
												onChange={(value) => setAttributes({ modalId: value })}
												placeholder={__('e.g. modal-contact-form', 'jankx')}
												help={__('Enter the ID of your modal. Must match exactly with the modal block ID.', 'jankx')}
												__nextHasNoMarginBottom
											/>
										</div>
									</>
								)}
							</ToolsPanelItem>
							<div style={{ marginTop: '16px', borderTop: '1px solid #ddd', paddingTop: '16px', gridColumn: '1 / -1' }}>
								<p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
									{__('Form Data Mapping', 'jankx')}
								</p>
								{!shareEnabled && (
									<div style={{
										padding: '10px',
										borderRadius: '6px',
										background: '#fff3cd',
										border: '1px solid #ffeaa7',
										marginBottom: '12px'
									}}>
										<p style={{ margin: 0, fontSize: '12px', color: '#856404' }}>
											{__('Enable Share Data options above to use mapping. Without shared data attributes, mappings will have no values.', 'jankx')}
										</p>
									</div>
								)}
								{shareEnabled && (formMappings || []).map((item, index) => (
									<div
										key={index}
										style={{
											border: '1px solid #e0e0e0',
											borderRadius: '6px',
											padding: '10px',
											marginBottom: '10px',
											display: 'flex',
											flexDirection: 'column',
											gap: '8px'
										}}
									>
										<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
											<span style={{ fontSize: '12px', fontWeight: 600 }}>
												{__('Mapping', 'jankx')} #{index + 1}
											</span>
											<button
												type="button"
												onClick={() => {
													const next = (formMappings || []).filter((_, i) => i !== index);
													setAttributes({ formMappings: next });
												}}
												style={{
													background: 'none',
													border: 'none',
													cursor: 'pointer',
													color: '#cc1818',
													padding: '4px',
												}}
												aria-label={__('Remove mapping', 'jankx')}
												title={__('Remove mapping', 'jankx')}
											>
												✕
											</button>
										</div>
										<SelectControl
											label={__('Source', 'jankx')}
											value={item.source}
											options={[
												{ label: __('Button Title', 'jankx'), value: 'button_title' },
												{ label: __('Current Post Title', 'jankx'), value: 'current_post_title' },
												{ label: __('Current Post ID', 'jankx'), value: 'current_post_id' },
												{ label: __('Current URL', 'jankx'), value: 'current_url' },
												{ label: __('Featured Image URL', 'jankx'), value: 'current_featured_image_url' },
												{ label: __('Featured Image ID', 'jankx'), value: 'current_featured_image_id' },
											]}
											onChange={(val) => {
												const next = [...formMappings];
												next[index] = { ...next[index], source: val };
												setAttributes({ formMappings: next });
											}}
											__nextHasNoMarginBottom
										/>
										<SelectControl
											label={__('Apply To', 'jankx')}
											value={item.mode || 'value'}
											options={[
												{ label: __('Value', 'jankx'), value: 'value' },
												{ label: __('Attribute', 'jankx'), value: 'attribute' },
												{ label: __('Text Content', 'jankx'), value: 'text' },
											]}
											onChange={(val) => {
												const next = [...formMappings];
												next[index] = { ...next[index], mode: val as any };
												setAttributes({ formMappings: next });
											}}
											__nextHasNoMarginBottom
										/>
										{(item.mode || 'value') === 'attribute' && (
											<TextControl
												label={__('Attribute Name', 'jankx')}
												placeholder="e.g. value, href, src, alt, data-foo"
												value={item.attributeName || ''}
												onChange={(val) => {
													const next = [...formMappings];
													next[index] = { ...next[index], attributeName: val };
													setAttributes({ formMappings: next });
												}}
												__nextHasNoMarginBottom
											/>
										)}
										<TextControl
											label={__('Destination Selector', 'jankx')}
											placeholder="e.g. input[name='your-name']"
											value={item.selector || ''}
											onChange={(val) => {
												const next = [...formMappings];
												next[index] = { ...next[index], selector: val };
												setAttributes({ formMappings: next });
											}}
											__nextHasNoMarginBottom
										/>
									</div>
								))}
								<button
									type="button"
									onClick={() => {
										setAttributes({ formMappings: [...(formMappings || []), { source: 'button_title', selector: '', mode: 'value', attributeName: '' }] });
									}}
									style={{
										background: '#f0f0f0',
										border: '1px dashed #ccc',
										width: '100%',
										padding: '6px',
										cursor: 'pointer',
										borderRadius: '4px',
										fontSize: '12px'
									}}
									disabled={!shareEnabled}
								>
									+ {__('Add Mapping', 'jankx')}
								</button>
								<p style={{ fontSize: '11px', color: '#666', marginTop: '4px', fontStyle: 'italic' }}>
									{__('When clicking the button, values will be pushed into matched elements inside the modal.', 'jankx')}
								</p>
							</div>
							<ToolsPanelItem
								label={__('Share Data with Modal', 'jankx')}
								isShownByDefault={true}
								hasValue={() => !!(modalShareObjectId || modalSharePostTitle || modalShareCurrentUrl)}
								onDeselect={() => setAttributes({
									modalShareObjectId: false,
									modalSharePostTitle: false,
									modalShareCurrentUrl: false
								})}
							>
								<div style={{ marginBottom: '12px' }}>
									<p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
										{__('Share current post data with modal:', 'jankx')}
									</p>
									<ToggleControl
										label={__('Share Object ID', 'jankx')}
										checked={modalShareObjectId || false}
										onChange={(value) => setAttributes({ modalShareObjectId: value })}
										help={__('Share current post/page ID', 'jankx')}
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={__('Share Post Title', 'jankx')}
										checked={modalSharePostTitle || false}
										onChange={(value) => setAttributes({ modalSharePostTitle: value })}
										help={__('Share current post/page title', 'jankx')}
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={__('Share Current URL', 'jankx')}
										checked={modalShareCurrentUrl || false}
										onChange={(value) => setAttributes({ modalShareCurrentUrl: value })}
										help={__('Share current page URL', 'jankx')}
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={__('Share Featured Image ID', 'jankx')}
										checked={modalShareFeaturedImageId || false}
										onChange={(value) => setAttributes({ modalShareFeaturedImageId: value })}
										help={__('Share current post featured image ID', 'jankx')}
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={__('Share Featured Image URL', 'jankx')}
										checked={modalShareFeaturedImageUrl || false}
										onChange={(value) => setAttributes({ modalShareFeaturedImageUrl: value })}
										help={__('Share current post featured image URL', 'jankx')}
										__nextHasNoMarginBottom
									/>
									{modalShareFeaturedImageUrl && (
										<SelectControl
											label={__('Featured image size', 'jankx')}
											value={modalFeaturedImageSize}
											options={[
												{ label: 'thumbnail', value: 'thumbnail' },
												{ label: 'medium', value: 'medium' },
												{ label: 'medium_large', value: 'medium_large' },
												{ label: 'large', value: 'large' },
												{ label: 'full', value: 'full' }
											]}
											onChange={(value) => setAttributes({ modalFeaturedImageSize: value })}
											__nextHasNoMarginBottom
										/>
									)}

									<div style={{ marginTop: '16px', borderTop: '1px solid #ddd', paddingTop: '16px' }}>
										<p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
											{__('Custom Form Data', 'jankx')}
										</p>
										{formData.map((item, index) => (
											<div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
												<TextControl
													placeholder="Key"
													value={item.key}
													onChange={(val) => {
														const newFormData = [...formData];
														newFormData[index].key = val;
														setAttributes({ formData: newFormData });
													}}
													__nextHasNoMarginBottom
												/>
												<TextControl
													placeholder="Value"
													value={item.value}
													onChange={(val) => {
														const newFormData = [...formData];
														newFormData[index].value = val;
														setAttributes({ formData: newFormData });
													}}
													__nextHasNoMarginBottom
												/>
												<button
													type="button"
													onClick={() => {
														const newFormData = formData.filter((_, i) => i !== index);
														setAttributes({ formData: newFormData });
													}}
													style={{
														background: 'none',
														border: 'none',
														cursor: 'pointer',
														color: '#cc1818',
														padding: '4px'
													}}
												>
													✕
												</button>
											</div>
										))}
										<button
											type="button"
											onClick={() => {
												setAttributes({ formData: [...formData, { key: '', value: '' }] });
											}}
											style={{
												background: '#f0f0f0',
												border: '1px dashed #ccc',
												width: '100%',
												padding: '6px',
												cursor: 'pointer',
												borderRadius: '4px',
												fontSize: '12px'
											}}
										>
											+ {__('Add Data Item', 'jankx')}
										</button>
										<p style={{ fontSize: '11px', color: '#666', marginTop: '4px', fontStyle: 'italic' }}>
											{__('These values will be sent to the modal form. Use {post_title}, {price}, {post_id} as placeholders.', 'jankx')}
										</p>
									</div>
								</div>
							</ToolsPanelItem>
						</>
					)}

					<ToolsPanelItem
						label={__('Show Label', 'jankx')}
						isShownByDefault
						hasValue={() => !showLabel}
						onDeselect={() => setAttributes({ showLabel: true })}
					>
						<ToggleControl
							label={__('Show Label', 'jankx')}
							checked={showLabel}
							onChange={(value) => setAttributes({ showLabel: value })}
							help={__('Show or hide button label text', 'jankx')}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>

					{hasInnerBlocks && (
						<ToolsPanelItem
							label={__('Icon Position', 'jankx')}
							isShownByDefault
							hasValue={() => iconPosition !== 'left' || renderIconOutside}
							onDeselect={() => setAttributes({ iconPosition: 'left', renderIconOutside: false })}
						>
							<SelectControl
								label={__('Icon Position', 'jankx')}
								value={iconPosition}
								options={[
									{ label: __('⬅️ Left', 'jankx'), value: 'left' },
									{ label: __('➡️ Right', 'jankx'), value: 'right' },
									{ label: __('⬆️ Top', 'jankx'), value: 'top' },
									{ label: __('⬇️ Bottom', 'jankx'), value: 'bottom' }
								]}
								onChange={(value) => setAttributes({ iconPosition: value })}
								help={__('Choose where to display the icon relative to text', 'jankx')}
							/>
							<ToggleControl
								label={__('Render Icon Outside Link', 'jankx')}
								checked={renderIconOutside}
								onChange={(value) => setAttributes({ renderIconOutside: value })}
								help={__('Place the icon outside the <a> or <button> tag', 'jankx')}
								__nextHasNoMarginBottom
							/>
						</ToolsPanelItem>
					)}
				</ToolsPanel>

				<ToolsPanel
					label={__('Animation Settings', 'jankx')}
					resetAll={() => {
						setAttributes({
							hoverAnimation: 'none',
							unhoverAnimation: 'none',
						});
					}}
				>
					<ToolsPanelItem
						label={__('Hover Animation', 'jankx')}
						isShownByDefault
						hasValue={() => hoverAnimation !== 'none'}
						onDeselect={() => setAttributes({ hoverAnimation: 'none' })}
					>
						<SelectControl
							label={__('Hover Animation', 'jankx')}
							value={hoverAnimation}
							options={[
								{ label: __('None', 'jankx'), value: 'none' },
								{ label: __('Bounce', 'jankx'), value: 'bounce' },
								{ label: __('Flash', 'jankx'), value: 'flash' },
								{ label: __('Pulse', 'jankx'), value: 'pulse' },
								{ label: __('Rubber Band', 'jankx'), value: 'rubberBand' },
								{ label: __('Shake', 'jankx'), value: 'shakeX' },
								{ label: __('Swing', 'jankx'), value: 'swing' },
								{ label: __('Tada', 'jankx'), value: 'tada' },
								{ label: __('Wobble', 'jankx'), value: 'wobble' },
								{ label: __('Jello', 'jankx'), value: 'jello' },
								{ label: __('Heart Beat', 'jankx'), value: 'heartBeat' },
							]}
							onChange={(value) => setAttributes({ hoverAnimation: value })}
							help={__('Animation effect when hovering over the button', 'jankx')}
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						label={__('Unhover Animation', 'jankx')}
						isShownByDefault
						hasValue={() => unhoverAnimation !== 'none'}
						onDeselect={() => setAttributes({ unhoverAnimation: 'none' })}
					>
						<SelectControl
							label={__('Unhover Animation', 'jankx')}
							value={unhoverAnimation}
							options={[
								{ label: __('None', 'jankx'), value: 'none' },
								{ label: __('Bounce', 'jankx'), value: 'bounce' },
								{ label: __('Flash', 'jankx'), value: 'flash' },
								{ label: __('Pulse', 'jankx'), value: 'pulse' },
								{ label: __('Rubber Band', 'jankx'), value: 'rubberBand' },
								{ label: __('Shake', 'jankx'), value: 'shakeX' },
								{ label: __('Swing', 'jankx'), value: 'swing' },
								{ label: __('Tada', 'jankx'), value: 'tada' },
								{ label: __('Wobble', 'jankx'), value: 'wobble' },
								{ label: __('Jello', 'jankx'), value: 'jello' },
								{ label: __('Heart Beat', 'jankx'), value: 'heartBeat' },
							]}
							onChange={(value) => setAttributes({ unhoverAnimation: value })}
							help={__('Animation effect when mouse leaves the button', 'jankx')}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<InspectorControls group="advanced">
				<TextControl
					label={__('Link rel', 'jankx')}
					value={rel || ''}
					onChange={(value) => setAttributes({ rel: value })}
					help={__('Additional rel attributes for the link', 'jankx')}
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={__('Title attribute', 'jankx')}
					value={title || ''}
					onChange={(value) => setAttributes({ title: value })}
					help={
						<>
							{__('Describe the role of this button on the page.', 'jankx')}
							<ExternalLink href="https://www.w3.org/TR/html52/dom.html#the-title-attribute">
								{__('Note: many devices and browsers do not display this text', 'jankx')}
							</ExternalLink>
						</>
					}
					__nextHasNoMarginBottom
				/>
			</InspectorControls>

			{renderButton(buttonElement)}
		</>
	);
}

const colorAttributes = {
	backgroundColor: 'background-color',
	textColor: 'text-color',
};

export default withColors(colorAttributes)(Edit);
