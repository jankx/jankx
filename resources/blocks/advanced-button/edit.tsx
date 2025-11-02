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
import { useState, useRef, useCallback } from '@wordpress/element';
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
	} = attributes;

	// Check if block has inner blocks (icon blocks)
	const hasInnerBlocks = useSelect(
		(select: any) => {
			const { getBlockCount } = select('core/block-editor');
			return getBlockCount(clientId) > 0;
		},
		[clientId]
	);

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


	const buttonClasses = classnames('jankx-advanced-button__link', borderProps?.className, {
		[`has-${backgroundColor?.slug}-background-color`]: backgroundColor?.slug,
		[`has-${textColor?.slug}-color`]: textColor?.slug,
		'has-background': backgroundColor?.color,
		'has-text-color': textColor?.color,
		[`icon-position-${iconPosition}`]: hasInnerBlocks && iconPosition,
		'has-base-color': hasNoColorSettings,
	});

	// Build button styles - gradient takes priority over background color
	const buttonStyles: Record<string, any> = {
		...blockProps.style,
		...borderProps?.style,
	};
	
	// Apply preset colors if set
	if (backgroundColor?.color) {
		buttonStyles.backgroundColor = backgroundColor.color;
	}
	if (textColor?.color) {
		buttonStyles.color = textColor.color;
	}
	
	// Apply custom colors from style.color if set (overrides preset colors)
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

	// Render button content - Always render InnerBlocks at the same position
	// Use CSS flex-order to control visual position
	const renderButtonContent = () => (
		<>
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
					{renderButtonContent()}
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
				>
					{renderButtonContent()}
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
					{renderButtonContent()}
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
				>
					{renderButtonContent()}
				</button>
			);
			break;

		default:
			buttonElement = (
				<button
					className={buttonClasses}
					style={buttonStyles}
					title={title}
				>
					{renderButtonContent()}
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
						});
					}}
				>
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
								)}
							</ToolsPanelItem>
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
							hasValue={() => iconPosition !== 'left'}
							onDeselect={() => setAttributes({ iconPosition: 'left' })}
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
						</ToolsPanelItem>
					)}
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

			<div {...blockProps}>
				{buttonElement}
			</div>
		</>
	);
}

const colorAttributes = {
	backgroundColor: 'background-color',
	textColor: 'text-color',
};

export default withColors(colorAttributes)(Edit);
