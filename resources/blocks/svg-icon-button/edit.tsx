/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNumber } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Dropdown,
	DropdownMenu,
	ExternalLink,
	MenuGroup,
	MenuItem,
	NavigableMenu,
	Popover,
	TextControl,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
} from '@wordpress/components';
import {
	BlockControls,
	ContrastChecker,
	InspectorControls,
	MediaUpload,
	RichText,
	useBlockProps,
	withColors,
	useBlockEditingMode,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	__experimentalUseGradient as useGradient,
	__experimentalLinkControl as LinkControl,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
} from '@wordpress/block-editor';
import { useEffect, useRef, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { displayShortcut, isKeyboardEvent, DOWN } from '@wordpress/keycodes';
import {
	code,
	flipHorizontal as flipH,
	flipVertical as flipV,
	link,
	media as mediaIcon,
	rotateRight,
} from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import {
	CustomInserterModal,
	IconDropZone,
	IconPlaceholder,
	InserterModal,
	DimensionControl,
} from '../svg-icon/components';
import {
	flattenIconsArray,
	parseIcon,
	parseUploadedMediaAndSetIcon,
} from '../svg-icon/utils';
import { bolt as defaultIcon } from '../svg-icon/icons/bolt';
import getIcons from '../svg-icon/icons';
import { useToolsPanelDropdownMenuProps } from '../svg-icon/utils/hooks';

const NEW_TAB_REL = 'noreferrer noopener';

/**
 * The edit function for the SVG Icon Button Block.
 *
 * @param {Object} props All props passed to this function.
 */
export function Edit( props ) {
	const {
		clientId,
		attributes,
		iconBackgroundColor,
		iconColor,
		backgroundColor,
		textColor,
		setAttributes,
		setIconBackgroundColor,
		setIconColor,
		setBackgroundColor,
		setTextColor,
	} = props;
	const {
		flipHorizontal,
		flipVertical,
		hasNoIconFill,
		icon,
		iconBackgroundColorValue,
		iconColorValue,
		iconName,
		label,
		linkRel,
		linkTarget,
		url,
		rotate,
		title,
		width,
		height,
		text,
		placeholder,
		backgroundColor: buttonBackgroundColor,
		customBackgroundColor,
		textColor: buttonTextColor,
		customTextColor,
		fontSize,
		fontFamily,
		fontWeight,
		hoverEffect,
		iconPosition,
		iconSpacing,
		showIcon,
		showText,
	} = attributes;

	// Allowed types for the current user.
	const { allowedMimeTypes, mediaUpload } = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );

		return {
			allowedMimeTypes: getSettings().allowedMimeTypes,
			mediaUpload: getSettings().mediaUpload,
		};
	}, [] );

	const isSVGUploadAllowed = allowedMimeTypes
		? Object.values( allowedMimeTypes ).includes( 'image/svg+xml' )
		: false;

	const { gradientClass, gradientValue, setGradient } = useGradient();

	const [ isInserterOpen, setInserterOpen ] = useState( false );
	const [ isQuickInserterOpen, setQuickInserterOpen ] = useState( false );
	const [ isCustomInserterOpen, setCustomInserterOpen ] = useState( false );
	const [ isEditingURL, setIsEditingURL ] = useState( false );

	// Allow users to disable custom SVG icons.
	const enableCustomIcons = applyFilters(
		'iconBlock.enableCustomIcons',
		true
	);

	const isContentOnlyMode = useBlockEditingMode() === 'contentOnly';
	const linkRef = useRef( null );
	const isURLSet = !! url;
	const opensInNewTab = linkTarget === '_blank';

	const iconsAll = flattenIconsArray( getIcons() );
	const namedIcon = iconsAll.filter( ( i ) => i.name === iconName );
	let customIcon = defaultIcon;

	if ( icon && isEmpty( namedIcon ) ) {
		customIcon = parseIcon( icon );

		if ( isEmpty( customIcon?.props ) ) {
			customIcon = defaultIcon;
		}
	}

	let printedIcon = ! isEmpty( namedIcon ) ? namedIcon[ 0 ].icon : customIcon;

	// Icons provided by third-parties are generally strings.
	if ( typeof printedIcon === 'string' ) {
		printedIcon = parseIcon( printedIcon );
	}

	function setRotate( value ) {
		const currentValue = ! value || ! isNumber( value ) ? 0 : value;

		let newValue = 0;

		if ( currentValue < 90 ) {
			newValue = 90;
		} else if ( currentValue < 180 ) {
			newValue = 180;
		} else if ( currentValue < 270 ) {
			newValue = 270;
		}

		setAttributes( { rotate: newValue } );
	}

	function unlink() {
		setAttributes( {
			url: undefined,
			linkTarget: undefined,
			linkRel: undefined,
		} );
		setIsEditingURL( false );
	}

	function resetAll() {
		setAttributes( {
			label: undefined,
			width: undefined,
			height: undefined,
		} );
	}

	function onToggleOpenInNewTab( value ) {
		const newLinkTarget = value ? '_blank' : undefined;

		let updatedRel = linkRel;
		if ( newLinkTarget && ! linkRel ) {
			updatedRel = NEW_TAB_REL;
		} else if ( ! newLinkTarget && linkRel === NEW_TAB_REL ) {
			updatedRel = undefined;
		}

		setAttributes( {
			linkTarget: newLinkTarget,
			linkRel: updatedRel,
		} );
	}

	function onKeyDown( event ) {
		if ( isKeyboardEvent.primary( event, 'k' ) ) {
			// Prevent the command palette from opening.
			event.preventDefault();
			setIsEditingURL( true );
		} else if ( isKeyboardEvent.primaryShift( event, 'k' ) ) {
			unlink();
			linkRef.current?.focus();
		}
	}

	const openOnArrowDown = ( event ) => {
		if ( event.keyCode === DOWN ) {
			event.preventDefault();
			event.target.click();
		}
	};

	const replaceText =
		icon || iconName
			? __( 'Replace Icon', 'jankx' )
			: __( 'Add Icon', 'jankx' );
	const customIconText =
		icon || iconName
			? __( 'Add/edit custom icon', 'jankx' )
			: __( 'Add custom icon', 'jankx' );

	const replaceDropdown = (
		<Dropdown
			renderToggle={ ( { isOpen, onToggle } ) => (
				<ToolbarButton
					aria-expanded={ isOpen }
					aria-haspopup="true"
					onClick={ onToggle }
					onKeyDown={ openOnArrowDown }
				>
					{ replaceText }
				</ToolbarButton>
			) }
			renderContent={ ( { onClose } ) => (
				<NavigableMenu>
					<MenuGroup>
						<MenuItem
							onClick={ () => {
								setInserterOpen( true );
								onClose( true );
							} }
							icon={ defaultIcon }
						>
							{ __( 'Browse Icon Library', 'jankx' ) }
						</MenuItem>
						{ isSVGUploadAllowed && (
							<MediaUpload
								onSelect={ ( media ) => {
									parseUploadedMediaAndSetIcon(
										media,
										attributes,
										setAttributes
									);
									onClose( true );
								} }
								allowedTypes={ [ 'image/svg+xml' ] }
								render={ ( { open } ) => (
									<MenuItem
										onClick={ open }
										icon={ mediaIcon }
									>
										{ __(
											'Open Media Library',
											'jankx'
										) }
									</MenuItem>
								) }
							/>
						) }
						{ enableCustomIcons && (
							<MenuItem
								onClick={ () => {
									setCustomInserterOpen( true );
									onClose( true );
								} }
								icon={ code }
							>
								{ customIconText }
							</MenuItem>
						) }
					</MenuGroup>
					{ ( icon || iconName ) && (
						<MenuGroup>
							<MenuItem
								onClick={ () => {
									setAttributes( {
										icon: undefined,
										iconName: undefined,
									} );
									onClose( true );
								} }
							>
								{ __( 'Reset', 'jankx' ) }
							</MenuItem>
						</MenuGroup>
					) }
				</NavigableMenu>
			) }
		/>
	);

	const blockControls = (
		<>
			<BlockControls group="block">
				<ToolbarGroup>
					<ToolbarButton
						ref={ linkRef }
						name="link"
						icon={ link }
						title={ __( 'Link', 'jankx' ) }
						shortcut={ displayShortcut.primary( 'k' ) }
						onClick={ () => setIsEditingURL( true ) }
						isActive={ isURLSet }
					/>
					{ isEditingURL && (
						<Popover
							className="wp-block-jankx-svg-icon-button__link-popover"
							anchor={ linkRef?.current }
							offset={ 12 }
							placement="bottom"
							onClose={ () => {
								setIsEditingURL( false );
								linkRef.current?.focus();
							} }
							focusOnMount={
								isEditingURL ? 'firstElement' : false
							}
							variant="alternate"
						>
							<LinkControl
								value={ { url, opensInNewTab } }
								onChange={ ( {
									url: newURL = '',
									opensInNewTab: newOpensInNewTab,
								} ) => {
									setAttributes( { url: newURL } );

									if (
										opensInNewTab !== newOpensInNewTab
									) {
										onToggleOpenInNewTab(
											newOpensInNewTab
										);
									}
								} }
								onRemove={ () => {
									unlink();
									linkRef.current?.focus();
								} }
								settings={ [
									{
										id: 'opensInNewTab',
										title: __( 'Open in new tab', 'jankx' ),
									},
									{
										id: 'nofollow',
										title: __( 'Add nofollow', 'jankx' ),
									},
									{
										id: 'sponsored',
										title: __( 'Add sponsored', 'jankx' ),
									},
								] }
								showSuggestions={ true }
								showInitialSuggestions={ true }
							/>
						</Popover>
					) }
					{ ( icon || iconName ) && (
						<>
							<ToolbarButton
								className={ `jankx-svg-icon-button__rotate-button-${ rotate }` }
								icon={ rotateRight }
								label={ __( 'Rotate Icon', 'jankx' ) }
								onClick={ () => setRotate( rotate ) }
								isPressed={ rotate }
							/>
							<ToolbarButton
								icon={ flipH }
								label={ __(
									'Flip Icon Horizontal',
									'jankx'
								) }
								onClick={ () =>
									setAttributes( {
										flipHorizontal: ! flipHorizontal,
									} )
								}
								isPressed={ flipHorizontal }
							/>
							<ToolbarButton
								icon={ flipV }
								label={ __(
									'Flip Icon Vertical',
									'jankx'
								) }
								onClick={ () =>
									setAttributes( {
										flipVertical: ! flipVertical,
									} )
								}
								isPressed={ flipVertical }
							/>
						</>
					) }
				</ToolbarGroup>
			</BlockControls>
			<BlockControls group="other">
				{ enableCustomIcons || isSVGUploadAllowed ? (
					replaceDropdown
				) : (
					<ToolbarButton
						onClick={ () => {
							setInserterOpen( true );
						} }
					>
						{ replaceText }
					</ToolbarButton>
				) }
			</BlockControls>
		</>
	);

	const colorSettings = [
		{
			colorLabel: __( 'Icon color', 'jankx' ),
			colorValue: iconColor.color || iconColorValue,
			onChange: ( colorValue ) => {
				setIconColor( colorValue );
				setAttributes( {
					iconColorValue: colorValue,
				} );
			},
			resetAllFilter: () => {
				setIconColor( undefined );
				setAttributes( { iconColorValue: undefined } );
			},
		},
		{
			colorLabel: __( 'Icon background color', 'jankx' ),
			colorValue: iconBackgroundColor.color || iconBackgroundColorValue,
			colorGradientValue: gradientValue,
			onChange: ( colorValue ) => {
				setIconBackgroundColor( colorValue );
				setAttributes( {
					iconBackgroundColorValue: colorValue,
				} );
			},
			onGradientChange: setGradient,
			resetAllFilter: () => {
				setIconBackgroundColor( undefined );
				setAttributes( { iconBackgroundColorValue: undefined } );
			},
		},
		{
			colorLabel: __( 'Button background color', 'jankx' ),
			colorValue: backgroundColor.color || customBackgroundColor,
			onChange: ( colorValue ) => {
				setBackgroundColor( colorValue );
				setAttributes( {
					customBackgroundColor: colorValue,
				} );
			},
			resetAllFilter: () => {
				setBackgroundColor( undefined );
				setAttributes( { customBackgroundColor: undefined } );
			},
		},
		{
			colorLabel: __( 'Text color', 'jankx' ),
			colorValue: textColor.color || customTextColor,
			onChange: ( colorValue ) => {
				setTextColor( colorValue );
				setAttributes( {
					customTextColor: colorValue,
				} );
			},
			resetAllFilter: () => {
				setTextColor( undefined );
				setAttributes( { customTextColor: undefined } );
			},
		},
	];

	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	// In WordPress <=6.2 this will return null, so default to true in those cases.
	const hasColorsOrGradients =
		colorGradientSettings?.hasColorsOrGradients ?? true;

	const inspectorControls = (
		<>
			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Button Settings' ) }
					resetAll={ resetAll }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Button Text', 'jankx' ) }
						isShownByDefault
						hasValue={ () => !! text }
						onDeselect={ () =>
							setAttributes( { text: 'Button' } )
						}
					>
						<TextControl
							label={ __( 'Button Text', 'jankx' ) }
							value={ text || '' }
							onChange={ ( value ) =>
								setAttributes( { text: value } )
							}
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						label={ __( 'Icon Position', 'jankx' ) }
						isShownByDefault
						hasValue={ () => iconPosition !== 'left' }
						onDeselect={ () =>
							setAttributes( { iconPosition: 'left' } )
						}
					>
						<Dropdown
							renderToggle={ ( { isOpen, onToggle } ) => (
								<TextControl
									label={ __( 'Icon Position', 'jankx' ) }
									value={ iconPosition === 'left' ? __( 'Left', 'jankx' ) : __( 'Right', 'jankx' ) }
									onClick={ onToggle }
									readOnly
								/>
							) }
							renderContent={ ( { onClose } ) => (
								<MenuGroup>
									<MenuItem
										onClick={ () => {
											setAttributes( { iconPosition: 'left' } );
											onClose();
										} }
									>
										{ __( 'Left', 'jankx' ) }
									</MenuItem>
									<MenuItem
										onClick={ () => {
											setAttributes( { iconPosition: 'right' } );
											onClose();
										} }
									>
										{ __( 'Right', 'jankx' ) }
									</MenuItem>
								</MenuGroup>
							) }
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						label={ __( 'Icon Spacing', 'jankx' ) }
						isShownByDefault={ false }
						hasValue={ () => iconSpacing !== '8px' }
						onDeselect={ () =>
							setAttributes( { iconSpacing: '8px' } )
						}
					>
						<DimensionControl
							label={ __( 'Icon Spacing', 'jankx' ) }
							value={ iconSpacing }
							onChange={ ( value ) =>
								setAttributes( { iconSpacing: value } )
							}
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						label={ __( 'Show Icon', 'jankx' ) }
						isShownByDefault
						hasValue={ () => ! showIcon }
						onDeselect={ () =>
							setAttributes( { showIcon: true } )
						}
					>
						<ToggleControl
							label={ __( 'Show Icon', 'jankx' ) }
							checked={ showIcon }
							onChange={ ( value ) =>
								setAttributes( { showIcon: value } )
							}
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						label={ __( 'Show Text', 'jankx' ) }
						isShownByDefault
						hasValue={ () => ! showText }
						onDeselect={ () =>
							setAttributes( { showText: true } )
						}
					>
						<ToggleControl
							label={ __( 'Show Text', 'jankx' ) }
							checked={ showText }
							onChange={ ( value ) =>
								setAttributes( { showText: value } )
							}
						/>
					</ToolsPanelItem>
					{ ( icon || iconName ) && (
						<>
							<ToolsPanelItem
								label={ __( 'Icon Width', 'jankx' ) }
								isShownByDefault={ false }
								hasValue={ () => !! width }
								onDeselect={ () =>
									setAttributes( { width: undefined } )
								}
							>
								<DimensionControl
									label={ __( 'Icon Width', 'jankx' ) }
									value={ width }
									onChange={ ( value ) =>
										setAttributes( { width: value } )
									}
								/>
							</ToolsPanelItem>
							<ToolsPanelItem
								label={ __( 'Icon Height', 'jankx' ) }
								isShownByDefault={ false }
								hasValue={ () => !! height }
								onDeselect={ () =>
									setAttributes( { height: undefined } )
								}
							>
								<DimensionControl
									label={ __( 'Icon Height', 'jankx' ) }
									value={ height }
									onChange={ ( value ) =>
										setAttributes( { height: value } )
									}
									units={ [ 'px', 'em', 'rem', 'vh', 'vw' ] }
								/>
							</ToolsPanelItem>
							<ToolsPanelItem
								label={ __( 'Icon Rotation', 'jankx' ) }
								isShownByDefault={ false }
								hasValue={ () => !! rotate }
								onDeselect={ () =>
									setAttributes( { rotate: undefined } )
								}
							>
								<DimensionControl
									label={ __( 'Icon Rotation', 'jankx' ) }
									value={ `${ rotate }deg` }
									onChange={ ( value ) =>
										setAttributes( {
											rotate: parseQuantityAndUnitFromRawValue(
												value
											)[ 0 ],
										} )
									}
									units={ [ 'deg' ] }
								/>
							</ToolsPanelItem>
						</>
					) }
				</ToolsPanel>
			</InspectorControls>
			{ hasColorsOrGradients && (
				<InspectorControls group="color">
					{ colorSettings.map(
						( {
							colorLabel,
							colorValue,
							colorGradientValue,
							onChange,
							onGradientChange,
							resetAllFilter,
						} ) => (
							<ColorGradientSettingsDropdown
								key={ `svg-icon-button-color-${ colorLabel }` }
								__experimentalIsRenderedInSidebar
								settings={ [
									{
										label: colorLabel,
										colorValue,
										gradientValue: colorGradientValue,
										onColorChange: onChange,
										onGradientChange,
										isShownByDefault: true,
										resetAllFilter,
										enableAlpha: true,
									},
								] }
								panelId={ clientId }
								{ ...colorGradientSettings }
							/>
						)
					) }
					{ ( iconColor.color || iconColorValue ) && (
						<>
							<p className="jankx-svg-icon-button__color-settings__help">
								{ __(
									'Any color or fill values in the SVG icon itself will take precedent over the chosen color.',
									'jankx'
								) }
							</p>
							<ToggleControl
								className="jankx-svg-icon-button__color-settings__apply-fill"
								checked={ ! hasNoIconFill }
								label={ __(
									'Apply icon color to fill',
									'jankx'
								) }
								help={ __(
									'Set the SVG fill value to the chosen icon color. Disable as needed.',
									'jankx'
								) }
								onChange={ () =>
									setAttributes( {
										hasNoIconFill: ! hasNoIconFill,
									} )
								}
							/>
						</>
					) }
					<ContrastChecker
						{ ...{
							textColor: customTextColor || buttonTextColor,
							backgroundColor: customBackgroundColor || buttonBackgroundColor,
						} }
						isLargeText={ false }
					/>
				</InspectorControls>
			) }
			<InspectorControls group="settings">
				<ToolsPanel
					label={ __( 'Link Settings', 'jankx' ) }
					resetAll={ () => {
						setAttributes( {
							url: undefined,
							linkTarget: undefined,
							linkRel: undefined,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'URL', 'jankx' ) }
						isShownByDefault
						hasValue={ () => !! url }
						onDeselect={ () => setAttributes( { url: undefined } ) }
					>
						<TextControl
							label={ __( 'URL', 'jankx' ) }
							value={ url || '' }
							onChange={ ( value ) => setAttributes( { url: value } ) }
							placeholder={ __( 'Enter URL...', 'jankx' ) }
							__nextHasNoMarginBottom
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						label={ __( 'Open in new tab', 'jankx' ) }
						isShownByDefault
						hasValue={ () => opensInNewTab }
						onDeselect={ () => onToggleOpenInNewTab( false ) }
					>
						<ToggleControl
							label={ __( 'Open in new tab', 'jankx' ) }
							checked={ opensInNewTab }
							onChange={ onToggleOpenInNewTab }
							help={ __( 'Adds target="_blank" and rel="noreferrer noopener"', 'jankx' ) }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<InspectorControls group="advanced">
				<TextControl
					label={ __( 'Link rel', 'jankx' ) }
					value={ linkRel || '' }
					onChange={ ( value ) =>
						setAttributes( { linkRel: value } )
					}
					help={ __( 'Additional rel attributes for the link', 'jankx' ) }
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={ __( 'Title attribute', 'jankx' ) }
					className="jankx-svg-icon-button__title-control"
					value={ title || '' }
					onChange={ ( value ) => setAttributes( { title: value } ) }
					help={
						<>
							{ __(
								'Describe the role of this button on the page.',
								'jankx'
							) }
							<ExternalLink href="https://www.w3.org/TR/html52/dom.html#the-title-attribute">
								{ __(
									'Note: many devices and browsers do not display this text',
									'jankx'
								) }
							</ExternalLink>
						</>
					}
					__nextHasNoMarginBottom
				/>
			</InspectorControls>
		</>
	);

	const blockProps = useBlockProps();
	const borderProps = getBorderClassesAndStyles( attributes );
	const themeIconBackgroundColor =
		iconBackgroundColor?.slug || attributes.iconBackgroundColor;
	const themeIconColor = iconColor?.slug || attributes.iconColor;
	const themeBackgroundColor = backgroundColor?.slug || attributes.backgroundColor;
	const themeTextColor = textColor?.slug || attributes.textColor;

	const buttonClasses = classnames( 'wp-block-button__link', borderProps?.className, {
		'has-icon-color': iconColor.color || iconColorValue,
		'has-no-icon-fill-color': hasNoIconFill,
		'has-icon-background-color':
			iconBackgroundColor.color ||
			iconBackgroundColorValue ||
			gradientValue,
		'has-background-gradient': gradientValue,
		'has-background-color': backgroundColor.color || customBackgroundColor,
		'has-text-color': textColor.color || customTextColor,
		[ `has-${ themeIconColor }-color` ]: themeIconColor,
		[ `has-${ themeIconBackgroundColor }-background-color` ]:
			themeIconBackgroundColor,
		[ `has-${ themeBackgroundColor }-background-color` ]: themeBackgroundColor,
		[ `has-${ themeTextColor }-color` ]: themeTextColor,
		[ gradientClass ]: gradientClass,
		[ `hover-effect-${ hoverEffect }` ]: hoverEffect && hoverEffect !== 'none',
	} );

	const [ widthQuantity, widthUnit ] =
		parseQuantityAndUnitFromRawValue( width );

	// Default icon width when there is no height set.
	let iconWidth = ! height ? '16px' : undefined;

	if ( widthQuantity ) {
		iconWidth = widthUnit
			? `${ widthQuantity }${ widthUnit }`
			: `${ widthQuantity }px`;
	}

	const rotateValue = rotate ? `${ rotate }deg` : '0deg';
	const scaleXValue = flipHorizontal ? '-1' : '1';
	const scaleYValue = flipVertical ? '-1' : '1';

	const iconStyles = {
		background: gradientValue,
		backgroundColor: iconBackgroundColorValue,
		color: iconColorValue,
		width: iconWidth,
		height: height || undefined,
		transform: `rotate(${ rotateValue }) scaleX(${ scaleXValue }) scaleY(${ scaleYValue })`,
		marginRight: iconPosition === 'left' && showText ? iconSpacing : undefined,
		marginLeft: iconPosition === 'right' && showText ? iconSpacing : undefined,
	};

	const buttonStyles = {
		backgroundColor: customBackgroundColor,
		color: customTextColor,
		...blockProps.style,
		...borderProps.style,
	};

	const iconMarkup = showIcon && ( icon || iconName ) ? (
		<div className="icon-container" style={ iconStyles }>
			{ printedIcon }
		</div>
	) : null;

	const textMarkup = showText ? (
		<RichText
			tagName="span"
			className="button-text"
			value={ text }
			onChange={ ( value ) => setAttributes( { text: value } ) }
			placeholder={ placeholder || __( 'Button text...', 'jankx' ) }
		/>
	) : null;

	const buttonContent = (
		<>
			{ iconPosition === 'left' && iconMarkup }
			{ textMarkup }
			{ iconPosition === 'right' && iconMarkup }
		</>
	);

	const buttonElement = url ? (
		<a
			className={ buttonClasses }
			href={ url }
			target={ linkTarget }
			rel={ linkRel }
			style={ buttonStyles }
			title={ title }
		>
			{ buttonContent }
		</a>
	) : (
		<button
			className={ buttonClasses }
			style={ buttonStyles }
			title={ title }
		>
			{ buttonContent }
		</button>
	);

	return (
		<>
			{ blockControls }
			{ inspectorControls }
			<div
				{ ...useBlockProps( {
					className: 'wp-block-button',
					onKeyDown,
				} ) }
			>
				{ ! icon && ! iconName && showIcon ? (
					<IconPlaceholder
						setInserterOpen={ setInserterOpen }
						isQuickInserterOpen={ isQuickInserterOpen }
						setQuickInserterOpen={ setQuickInserterOpen }
						isCustomInserterOpen={ isCustomInserterOpen }
						setCustomInserterOpen={ setCustomInserterOpen }
						attributes={ attributes }
						setAttributes={ setAttributes }
						enableCustomIcons={ enableCustomIcons }
						isSVGUploadAllowed={ isSVGUploadAllowed }
					/>
				) : (
					buttonElement
				) }
				<IconDropZone
					attributes={ attributes }
					setAttributes={ setAttributes }
					mediaUpload={ mediaUpload }
					isSVGUploadAllowed={ isSVGUploadAllowed }
				/>
			</div>
			<InserterModal
				isInserterOpen={ isInserterOpen }
				setInserterOpen={ setInserterOpen }
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			{ enableCustomIcons && (
				<CustomInserterModal
					isCustomInserterOpen={ isCustomInserterOpen }
					setCustomInserterOpen={ setCustomInserterOpen }
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
			) }
		</>
	);
}

const colorAttributes = {
	iconColor: 'icon-color',
	iconBackgroundColor: 'icon-background-color',
	backgroundColor: 'background-color',
	textColor: 'text-color',
};

export default withColors( colorAttributes )( Edit );
