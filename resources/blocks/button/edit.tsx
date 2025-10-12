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
	SelectControl,
	RangeControl,
	Button,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import {
	BlockControls,
	ContrastChecker,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
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
import { useEffect, useRef, useState, useMemo, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { displayShortcut, isKeyboardEvent, DOWN } from '@wordpress/keycodes';
import {
	code,
	flipHorizontal as flipH,
	flipVertical as flipV,
	link,
	media as mediaIcon,
	rotateRight,
	image as imageIcon,
	brush,
} from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies - SVG Icon components
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

/**
 * Internal dependencies - Icon Picker component
 */
import IconPicker from '../../shared/components/IconPicker';

const NEW_TAB_REL = 'noreferrer noopener';

/**
 * The edit function for the Unified Button Block.
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
		triggerType = 'link',
		buttonType = 'button',
		modalId = '',
		modalShareObjectId = false,
		modalSharePostTitle = false,
		modalShareCurrentUrl = false,
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
		iconType,
		iconSet,
		iconStyle,
		imageId,
		imageUrl,
		imageAlt,
		imageWidth,
		imageHeight,
		imageSizeSlug,
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

	// Memoize icon styles to prevent recalculation
	const iconStyles = useMemo( () => {
		const [ widthQuantity, widthUnit ] =
			parseQuantityAndUnitFromRawValue( width );

		let iconWidth = ! height ? '16px' : undefined;

		if ( widthQuantity ) {
			iconWidth = widthUnit
				? `${ widthQuantity }${ widthUnit }`
				: `${ widthQuantity }px`;
		}

		const rotateValue = rotate ? `${ rotate }deg` : '0deg';
		const scaleXValue = flipHorizontal ? '-1' : '1';
		const scaleYValue = flipVertical ? '-1' : '1';

		return {
			background: gradientValue,
			backgroundColor: iconBackgroundColorValue,
			color: iconColorValue,
			width: iconWidth,
			height: height || undefined,
			transform: `rotate(${ rotateValue }) scaleX(${ scaleXValue }) scaleY(${ scaleYValue })`,
			marginRight: iconPosition === 'left' && showText ? iconSpacing : undefined,
			marginLeft: iconPosition === 'right' && showText ? iconSpacing : undefined,
		};
	}, [ width, height, rotate, flipHorizontal, flipVertical, gradientValue, iconBackgroundColorValue, iconColorValue, iconPosition, showText, iconSpacing ] );

	// Render icon based on type (optimized with useCallback)
	const renderIconPreview = useCallback( () => {
		if ( iconType === 'none' || ! showIcon ) return null;

		switch ( iconType ) {
			case 'svg':
				// SVG Icon from library or custom
				if ( icon || iconName ) {
					return (
						<div className="icon-container" style={ iconStyles }>
							{ printedIcon }
						</div>
					);
				}
				return null;

			case 'image':
				// Image from media library
				if ( imageUrl ) {
					return (
						<div className="icon-container" style={ iconStyles }>
							<img
								src={ imageUrl }
								alt={ imageAlt || '' }
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						</div>
					);
				}
				return null;

			case 'picker':
				// Icon from Icon Picker (Material Icons, FontAwesome, Dashicons)
				if ( iconName && iconSet ) {
					const renderPickerIcon = () => {
						if ( iconSet === 'material' ) {
							const styleClass = iconStyle !== 'filled' ? `material-icons-${ iconStyle }` : 'material-icons';
							return (
								<span className={ styleClass }>
									{ iconName }
								</span>
							);
						} else if ( iconSet === 'fontawesome' ) {
							return (
								<i className={ `fas fa-${ iconName }` } />
							);
						} else if ( iconSet === 'dashicons' ) {
							return (
								<span className={ `dashicons dashicons-${ iconName }` } />
							);
						}
						return null;
					};

					return (
						<div className="icon-container" style={ iconStyles }>
							{ renderPickerIcon() }
						</div>
					);
				}
				return null;

			default:
				return null;
		}
	}, [ iconType, showIcon, icon, iconName, imageUrl, imageAlt, iconSet, iconStyle, iconStyles, printedIcon ] );

	const replaceText =
		( icon || iconName || imageUrl )
			? __( 'Replace Icon', 'jankx' )
			: __( 'Add Icon', 'jankx' );
	const customIconText =
		( icon || iconName || imageUrl )
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
								setAttributes({ iconType: 'svg' });
								setInserterOpen( true );
								onClose( true );
							} }
							icon={ defaultIcon }
						>
							{ __( 'Browse SVG Icon Library', 'jankx' ) }
						</MenuItem>
						{ isSVGUploadAllowed && (
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes({ iconType: 'svg' });
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
											'Upload SVG from Media',
											'jankx'
										) }
									</MenuItem>
								) }
							/>
						) }
						{ enableCustomIcons && (
							<MenuItem
								onClick={ () => {
									setAttributes({ iconType: 'svg' });
									setCustomInserterOpen( true );
									onClose( true );
								} }
								icon={ code }
							>
								{ customIconText }
							</MenuItem>
						) }
						<MenuItem
							onClick={ () => {
								setAttributes({ iconType: 'image' });
								onClose( true );
							} }
							icon={ imageIcon }
						>
							{ __( 'Choose Image from Media', 'jankx' ) }
						</MenuItem>
						<MenuItem
							onClick={ () => {
								setAttributes({ iconType: 'picker' });
								onClose( true );
							} }
							icon={ brush }
						>
							{ __( 'Choose from Icon Picker', 'jankx' ) }
						</MenuItem>
					</MenuGroup>
					{ ( icon || iconName || imageUrl ) && (
						<MenuGroup>
							<MenuItem
								onClick={ () => {
									setAttributes( {
										icon: undefined,
										iconName: undefined,
										imageUrl: undefined,
										imageId: undefined,
										iconType: 'none',
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
					{/* Hide link toolbar for detail-link and modal triggers */}
					{ triggerType === 'link' && (
						<>
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
									className="wp-block-jankx-button__link-popover"
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
						</>
					) }
					{ ( icon || iconName || imageUrl ) && iconType === 'svg' && (
						<>
							<ToolbarButton
								className={ `jankx-button__rotate-button-${ rotate }` }
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
					label={ __( 'Button Settings', 'jankx' ) }
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
						label={ __( 'Icon Type', 'jankx' ) }
						isShownByDefault
						hasValue={ () => iconType !== 'none' }
						onDeselect={ () =>
							setAttributes( { iconType: 'none' } )
						}
					>
						<SelectControl
							label={ __( 'Icon Type', 'jankx' ) }
							value={ iconType }
							options={ [
								{ label: __( 'No Icon', 'jankx' ), value: 'none' },
								{ label: __( 'SVG Icon', 'jankx' ), value: 'svg' },
								{ label: __( 'Image', 'jankx' ), value: 'image' },
								{ label: __( 'Icon Picker', 'jankx' ), value: 'picker' },
							] }
							onChange={ ( value ) => setAttributes( { iconType: value } ) }
						/>
					</ToolsPanelItem>

					{/* SVG Icon Settings */}
					{ iconType === 'svg' && ( icon || iconName ) && (
						<>
							<div style={{
								padding: '12px',
								background: '#f0f6fc',
								borderRadius: '4px',
								marginBottom: '16px',
								border: '1px solid #c5d9ed'
							}}>
								<p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#0073aa' }}>
									🎨 { __( 'SVG Icon Preview', 'jankx' ) }
								</p>
								<div style={{
									padding: '16px',
									background: '#fff',
									borderRadius: '4px',
									textAlign: 'center',
									border: '1px solid #ddd'
								}}>
									<div style={{
										width: '48px',
										height: '48px',
										margin: '0 auto',
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center'
									}}>
										{ printedIcon }
									</div>
								</div>
								{ iconName && (
									<p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#666' }}>
										{ __( 'Selected:', 'jankx' ) } <strong>{ iconName }</strong>
									</p>
								) }
								{ icon && ! iconName && (
									<p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#666' }}>
										{ __( 'Custom SVG Icon', 'jankx' ) }
									</p>
								) }
							</div>
						</>
					) }

					{/* Image Icon Settings */}
					{ iconType === 'image' && (
						<>
							<div style={{
								padding: '12px',
								background: '#f0f6fc',
								borderRadius: '4px',
								marginBottom: '16px',
								border: '1px solid #c5d9ed'
							}}>
								<p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#0073aa' }}>
									📷 { __( 'Image Icon Settings', 'jankx' ) }
								</p>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ ( media ) => {
											setAttributes( {
												imageId: media.id,
												imageUrl: media.url,
												imageAlt: media.alt || '',
												imageWidth: media.width,
												imageHeight: media.height,
											} );
										} }
										allowedTypes={ [ 'image' ] }
										value={ imageId }
										render={ ( { open } ) => (
											<div>
												<Button
													onClick={ open }
													variant="secondary"
													style={{ width: '100%', marginBottom: '8px' }}
												>
													{ imageUrl ? __( 'Change Image', 'jankx' ) : __( 'Select Image', 'jankx' ) }
												</Button>
												{ imageUrl && (
													<div style={{ marginTop: '8px' }}>
														<img
															src={ imageUrl }
															alt={ imageAlt }
															style={{
																maxWidth: '100%',
																height: 'auto',
																borderRadius: '4px',
																border: '1px solid #ddd',
																display: 'block'
															}}
														/>
														<p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#666' }}>
															{ __( 'Selected:', 'jankx' ) } <strong>{ imageAlt || __( 'Image', 'jankx' ) }</strong>
														</p>
													</div>
												) }
											</div>
										) }
									/>
								</MediaUploadCheck>
							</div>
						</>
					) }

					{/* Icon Picker Settings */}
					{ iconType === 'picker' && (
						<>
							<div style={{
								padding: '12px',
								background: '#f0f6fc',
								borderRadius: '4px',
								marginBottom: '16px',
								border: '1px solid #c5d9ed'
							}}>
								<p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#0073aa' }}>
									🎨 { __( 'Icon Picker Settings', 'jankx' ) }
								</p>
								<IconPicker
									value={ iconName ? { name: iconName, iconSet: iconSet || 'material' } : null }
									onChange={ ( icon ) => {
										setAttributes( {
											iconName: icon.name,
											iconSet: icon.iconSet || 'material',
										} );
									} }
									iconType={ iconSet || 'material' }
									onIconTypeChange={ ( type ) => setAttributes( { iconSet: type } ) }
								/>
								{ iconName && (
									<p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#666' }}>
										{ __( 'Selected:', 'jankx' ) } <strong>{ iconName }</strong> ({ iconSet })
									</p>
								) }
							</div>
						</>
					) }

					<ToolsPanelItem
						label={ __( 'Icon Position', 'jankx' ) }
						isShownByDefault
						hasValue={ () => iconPosition !== 'left' }
						onDeselect={ () =>
							setAttributes( { iconPosition: 'left' } )
						}
					>
						<SelectControl
							label={ __( 'Icon Position', 'jankx' ) }
							value={ iconPosition }
							options={ [
								{ label: __( 'Left', 'jankx' ), value: 'left' },
								{ label: __( 'Right', 'jankx' ), value: 'right' },
							] }
							onChange={ ( value ) => setAttributes( { iconPosition: value } ) }
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
					{ ( icon || iconName || imageUrl ) && (
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
							{ iconType === 'svg' && (
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
							) }
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
								key={ `button-color-${ colorLabel }` }
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
					{ iconType === 'svg' && ( iconColor.color || iconColorValue ) && (
						<>
							<p className="jankx-button__color-settings__help">
								{ __(
									'Any color or fill values in the SVG icon itself will take precedent over the chosen color.',
									'jankx'
								) }
							</p>
							<ToggleControl
								className="jankx-button__color-settings__apply-fill"
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
					label={ __( 'Trigger Settings', 'jankx' ) }
					resetAll={ () => {
						setAttributes( {
							triggerType: 'link',
							buttonType: 'button',
							url: undefined,
							linkTarget: undefined,
							linkRel: undefined,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Trigger Type', 'jankx' ) }
						isShownByDefault
						hasValue={ () => triggerType !== 'link' }
						onDeselect={ () => setAttributes( { triggerType: 'link' } ) }
					>
						<SelectControl
							label={ __( 'Trigger Type', 'jankx' ) }
							value={ triggerType }
							options={ [
								{ label: __( '🔗 Link - Custom URL', 'jankx' ), value: 'link' },
								{ label: __( '🔘 Button - Form Action', 'jankx' ), value: 'button' },
								{ label: __( '📄 Detail Link - Current Object', 'jankx' ), value: 'detail-link' },
								{ label: __( '🪟 Modal - Open Modal', 'jankx' ), value: 'modal' }
							] }
							onChange={ ( value ) => setAttributes( { triggerType: value } ) }
							help={ __( 'Choose what happens when users click this button', 'jankx' ) }
						/>
					</ToolsPanelItem>

					{ triggerType === 'link' && (
						<>
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
						</>
					) }

					{ triggerType === 'button' && (
						<ToolsPanelItem
							label={ __( 'Button Type', 'jankx' ) }
							isShownByDefault
							hasValue={ () => buttonType !== 'button' }
							onDeselect={ () => setAttributes( { buttonType: 'button' } ) }
						>
							<SelectControl
								label={ __( 'Button Type', 'jankx' ) }
								value={ buttonType }
								options={ [
									{ label: __( 'Button', 'jankx' ), value: 'button' },
									{ label: __( 'Submit', 'jankx' ), value: 'submit' },
									{ label: __( 'Reset', 'jankx' ), value: 'reset' }
								] }
								onChange={ ( value ) => setAttributes( { buttonType: value } ) }
								help={ __( 'Defines the button behavior in forms', 'jankx' ) }
							/>
						</ToolsPanelItem>
					) }

					{ triggerType === 'detail-link' && (
						<div style={{
							padding: '12px',
							background: '#fff3cd',
							borderRadius: '4px',
							marginTop: '12px',
							border: '1px solid #ffeaa7'
						}}>
							<p style={{ margin: '0', fontSize: '12px', color: '#856404' }}>
								📄 { __( 'This button will link to the current post/page permalink on the frontend.', 'jankx' ) }
							</p>
						</div>
					) }

					{ triggerType === 'modal' && (
						<>
							<ToolsPanelItem
								label={ __( 'Modal ID', 'jankx' ) }
								isShownByDefault
								hasValue={ () => !! modalId }
								onDeselect={ () => setAttributes( { modalId: undefined } ) }
							>
								<TextControl
									label={ __( 'Modal ID', 'jankx' ) }
									value={ modalId || '' }
									onChange={ ( value ) => setAttributes( { modalId: value } ) }
									placeholder={ __( 'modal-123', 'jankx' ) }
									help={ __( 'Enter the ID of the modal block to open', 'jankx' ) }
									__nextHasNoMarginBottom
								/>
							</ToolsPanelItem>
							<ToolsPanelItem
								label={ __( 'Share Data with Modal', 'jankx' ) }
								isShownByDefault={ true }
								hasValue={ () => !! ( attributes.modalShareObjectId || attributes.modalSharePostTitle || attributes.modalShareCurrentUrl ) }
								onDeselect={ () => setAttributes( {
									modalShareObjectId: false,
									modalSharePostTitle: false,
									modalShareCurrentUrl: false
								} ) }
							>
								<div style={{ marginBottom: '12px' }}>
									<p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
										{ __( 'Share current post data with modal:', 'jankx' ) }
									</p>
									<ToggleControl
										label={ __( 'Share Object ID', 'jankx' ) }
										checked={ attributes.modalShareObjectId || false }
										onChange={ ( value ) => setAttributes( { modalShareObjectId: value } ) }
										help={ __( 'Share current post/page ID', 'jankx' ) }
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={ __( 'Share Post Title', 'jankx' ) }
										checked={ attributes.modalSharePostTitle || false }
										onChange={ ( value ) => setAttributes( { modalSharePostTitle: value } ) }
										help={ __( 'Share current post/page title', 'jankx' ) }
										__nextHasNoMarginBottom
									/>
									<ToggleControl
										label={ __( 'Share Current URL', 'jankx' ) }
										checked={ attributes.modalShareCurrentUrl || false }
										onChange={ ( value ) => setAttributes( { modalShareCurrentUrl: value } ) }
										help={ __( 'Share current page URL', 'jankx' ) }
										__nextHasNoMarginBottom
									/>
								</div>
							</ToolsPanelItem>
						</>
					) }
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
					className="jankx-button__title-control"
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

	// Check if current style is outline
	const isOutlineStyle = blockProps.className?.includes('is-style-outline');

	// Only generate color classes if attributes are explicitly set (not defaults)
	const hasExplicitBackgroundColor = customBackgroundColor || (backgroundColor.color && backgroundColor.slug !== 'primary');
	const hasExplicitTextColor = customTextColor || (textColor.color && textColor.slug !== 'light-text');

	const buttonClasses = classnames( 'wp-block-button__link', borderProps?.className, {
		'has-icon-color': iconColor.color || iconColorValue,
		'has-no-icon-fill-color': hasNoIconFill,
		'has-icon-background-color':
			iconBackgroundColor.color ||
			iconBackgroundColorValue ||
			gradientValue,
		'has-background-gradient': gradientValue,
		'has-background-color': !isOutlineStyle && hasExplicitBackgroundColor,
		'has-text-color': hasExplicitTextColor,
		[ `has-${ themeIconColor }-color` ]: themeIconColor,
		[ `has-${ themeIconBackgroundColor }-background-color` ]:
			themeIconBackgroundColor,
		[ `has-${ themeBackgroundColor }-background-color` ]: !isOutlineStyle && hasExplicitBackgroundColor,
		[ `has-${ themeTextColor }-color` ]: hasExplicitTextColor,
		[ gradientClass ]: gradientClass,
		[ `hover-effect-${ hoverEffect }` ]: hoverEffect && hoverEffect !== 'none',
	} );

	const buttonStyles = {
		...blockProps.style,
		...borderProps.style,
		backgroundColor: customBackgroundColor,
		color: customTextColor,
	};

	const handleTextChange = useCallback( ( value ) => {
		setAttributes( { text: value } );
	}, [ setAttributes ] );

	// Memoized icon markup to prevent unnecessary re-renders
	const iconMarkup = useMemo( () => {
		return showIcon ? renderIconPreview() : null;
	}, [ showIcon, renderIconPreview ] );

	// Render button content
	const renderButtonContent = () => (
		<>
			{ iconPosition === 'left' && iconMarkup }
			{ showText && (
				<RichText
					tagName="span"
					className="button-text"
					value={ text }
					onChange={ handleTextChange }
					placeholder={ placeholder || __( 'Button text...', 'jankx' ) }
				/>
			) }
			{ iconPosition === 'right' && iconMarkup }
		</>
	);

	// Render button element based on trigger type
	let buttonElement = null;

	switch ( triggerType ) {
		case 'link':
			buttonElement = (
				<a
					className={ buttonClasses }
					href={ url || '#' }
					target={ linkTarget }
					rel={ linkRel }
					style={ buttonStyles }
					title={ title }
					onClick={ ( e ) => {
						// Prevent default in editor to avoid page jump
						e.preventDefault();
						e.stopPropagation();
					} }
					onMouseDown={ ( e ) => {
						// Prevent middle-click and other mouse navigation
						if ( e.button !== 0 || ! url || url === '#' ) {
							e.preventDefault();
						}
					} }
				>
					{ renderButtonContent() }
				</a>
			);
			break;

		case 'button':
			buttonElement = (
				<button
					className={ buttonClasses }
					type={ buttonType }
					style={ buttonStyles }
					title={ title }
				>
					{ renderButtonContent() }
				</button>
			);
			break;

		case 'detail-link':
			buttonElement = (
				<a
					className={ buttonClasses }
					href="#"
					style={ buttonStyles }
					title={ title }
					onClick={ ( e ) => {
						e.preventDefault();
						e.stopPropagation();
					} }
					onMouseDown={ ( e ) => {
						// Prevent any mouse-related navigation
						if ( e.button === 0 ) {
							e.preventDefault();
						}
					} }
				>
					{ renderButtonContent() }
				</a>
			);
			break;

		case 'modal':
			buttonElement = (
				<button
					className={ buttonClasses }
					type="button"
					data-modal-id={ modalId }
					style={ buttonStyles }
					title={ title }
				>
					{ renderButtonContent() }
				</button>
			);
			break;

		default:
			buttonElement = (
				<button
					className={ buttonClasses }
					style={ buttonStyles }
					title={ title }
				>
					{ renderButtonContent() }
				</button>
			);
	}

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
				{ iconType === 'svg' && ! icon && ! iconName && showIcon ? (
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
				) : iconType === 'image' && ! imageUrl && showIcon ? (
					<div style={{ padding: '20px', textAlign: 'center', border: '2px dashed #ccc', borderRadius: '4px' }}>
						<p style={{ margin: '0 0 10px 0', color: '#666' }}>
							{ __( 'Select an image from the sidebar', 'jankx' ) } →
						</p>
					</div>
				) : iconType === 'picker' && ! iconName && showIcon ? (
					<div style={{ padding: '20px', textAlign: 'center', border: '2px dashed #ccc', borderRadius: '4px' }}>
						<p style={{ margin: '0 0 10px 0', color: '#666' }}>
							{ __( 'Choose an icon from the sidebar', 'jankx' ) } →
						</p>
					</div>
				) : (
					buttonElement
				) }
				{ iconType === 'svg' && isSVGUploadAllowed && (
					<IconDropZone
						attributes={ attributes }
						setAttributes={ setAttributes }
						mediaUpload={ mediaUpload }
						isSVGUploadAllowed={ isSVGUploadAllowed }
					/>
				) }
			</div>
			{ isInserterOpen && (
				<InserterModal
					isInserterOpen={ isInserterOpen }
					setInserterOpen={ setInserterOpen }
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
			) }
			{ enableCustomIcons && isCustomInserterOpen && (
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