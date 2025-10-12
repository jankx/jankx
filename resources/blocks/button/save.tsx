/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue } from '@wordpress/components';
import {
	useBlockProps,
	RichText,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import getIcons from '../svg-icon/icons';
import { flattenIconsArray, parseIcon } from '../svg-icon/utils';

/**
 * The save function for the Unified Button Block.
 */
export default function Save( props: any ) {
	const {
		triggerType = 'link',
		buttonType = 'button',
		modalId = '',
		modalShareObjectId = false,
		modalSharePostTitle = false,
		modalShareCurrentUrl = false,
		customGradient,
		flipHorizontal,
		flipVertical,
		gradient,
		hasNoIconFill,
		icon,
		iconBackgroundColor,
		iconBackgroundColorValue,
		iconColor,
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
		backgroundColor,
		customBackgroundColor,
		textColor,
		customTextColor,
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
	} = props.attributes;

	// If there is no text and no icon, don't save anything.
	if ( ! text && ! ( icon || iconName || imageUrl ) ) {
		return null;
	}

	// Render icon based on type
	const renderIconMarkup = () => {
		if ( iconType === 'none' || ! showIcon ) return null;

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

		const iconStyles = {
			background: ! gradient ? customGradient : undefined,
			backgroundColor: iconBackgroundColorValue,
			color: iconColorValue,
			width: iconWidth,
			height: height || undefined,
			transform: `rotate(${ rotateValue }) scaleX(${ scaleXValue }) scaleY(${ scaleYValue })`,
			marginRight: iconPosition === 'left' && showText ? iconSpacing : undefined,
			marginLeft: iconPosition === 'right' && showText ? iconSpacing : undefined,
		};

		switch ( iconType ) {
			case 'svg': {
				// SVG Icon from library or custom
				const iconsAll = flattenIconsArray( getIcons() );
				const namedIcon = iconsAll.filter( ( i ) => i.name === iconName );
				let printedIcon: any = '';

				if ( icon && isEmpty( namedIcon ) ) {
					// Custom icons are strings and need to be parsed.
					printedIcon = parseIcon( icon );

					if ( isEmpty( printedIcon?.props ) ) {
						printedIcon = '';
					}
				} else if ( ! isEmpty( namedIcon ) ) {
					// Icon choosen from library.
					printedIcon = namedIcon[ 0 ]?.icon;

					// Icons provided by third-parties are generally strings.
					if ( typeof printedIcon === 'string' ) {
						printedIcon = parseIcon( printedIcon );
					}
				}

				// If a label is set, add as aria-label.
				if ( label && printedIcon ) {
					printedIcon = {
						...printedIcon,
						props: { ...printedIcon.props, 'aria-label': label },
					};
				}

				if ( printedIcon ) {
					return (
						<div className="icon-container" style={ iconStyles }>
							{ printedIcon }
						</div>
					);
				}
				return null;
			}

			case 'image': {
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
			}

			case 'picker': {
				// Icon from Icon Picker
				if ( iconName && iconSet ) {
					let iconElement = null;

					if ( iconSet === 'material' ) {
						const styleClass = iconStyle !== 'filled' ? `material-icons-${ iconStyle }` : 'material-icons';
						iconElement = (
							<span className={ styleClass }>
								{ iconName }
							</span>
						);
					} else if ( iconSet === 'fontawesome' ) {
						iconElement = (
							<i className={ `fas fa-${ iconName }` } />
						);
					} else if ( iconSet === 'dashicons' ) {
						iconElement = (
							<span className={ `dashicons dashicons-${ iconName }` } />
						);
					}

					if ( iconElement ) {
						return (
							<div className="icon-container" style={ iconStyles }>
								{ iconElement }
							</div>
						);
					}
				}
				return null;
			}

			default:
				return null;
		}
	};

	const blockProps = useBlockProps.save();
	const borderProps = { className: '', style: {} };

	// Check if current style is outline from block props
	const isOutlineStyle = blockProps.className?.includes('is-style-outline');

	// Only generate color classes if attributes are explicitly set (not defaults)
	const hasExplicitBackgroundColor = customBackgroundColor || (backgroundColor && backgroundColor !== 'primary');
	const hasExplicitTextColor = customTextColor || (textColor && textColor !== 'light-text');

	const buttonClasses = classnames( 'wp-block-button__link', borderProps?.className, {
		'has-icon-color': iconColorValue,
		'has-no-icon-fill-color': hasNoIconFill,
		'has-icon-background-color':
			iconBackgroundColorValue ||
			iconBackgroundColor ||
			gradient ||
			customGradient,
		'has-background-color': !isOutlineStyle && hasExplicitBackgroundColor,
		'has-text-color': hasExplicitTextColor,
		[ `has-${ iconBackgroundColor }-background-color` ]:
			iconBackgroundColor,
		[ `has-${ iconColor }-color` ]: iconColor,
		[ `has-${ gradient }-gradient-background` ]: gradient,
		[ `has-${ backgroundColor }-background-color` ]: !isOutlineStyle && hasExplicitBackgroundColor,
		[ `has-${ textColor }-color` ]: hasExplicitTextColor,
		[ `hover-effect-${ hoverEffect }` ]: hoverEffect && hoverEffect !== 'none',
	} );

	const buttonStyles = {
		...(blockProps.style as any),
		...(borderProps.style as any),
		backgroundColor: customBackgroundColor,
		color: customTextColor,
	};

	const rel = isEmpty( linkRel ) ? undefined : linkRel;
	const target = isEmpty( linkTarget ) ? undefined : linkTarget;

	const iconMarkup = showIcon && renderIconMarkup();

	const textMarkup = showText ? (
		<RichText.Content
			tagName="span"
			className="button-text"
			value={ text }
		/>
	) : null;

	const buttonContent = (
		<>
			{ iconPosition === 'left' && iconMarkup }
			{ textMarkup }
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
					target={ target }
					rel={ rel }
					style={ buttonStyles }
					title={ title }
					data-trigger-type="link"
				>
					{ buttonContent }
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
					data-trigger-type="button"
				>
					{ buttonContent }
				</button>
			);
			break;

		case 'detail-link':
			// href="#" will be replaced by PHP with actual permalink
			buttonElement = (
				<a
					className={ buttonClasses + ' jankx-button-detail-link' }
					href="#"
					data-trigger-type="detail-link"
					style={ buttonStyles }
					title={ title }
				>
					{ buttonContent }
				</a>
			);
			break;

		case 'modal':
			// Build data attributes object for Micromodal
			const modalDataAttrs: any = {
				'data-micromodal-trigger': modalId || '', // Micromodal standard attribute
				'data-modal-id': modalId || '', // Keep for backward compatibility
				'data-trigger-type': 'modal'
			};

			// Add share data attributes if enabled
			// These will be read by the modal's view.js when triggered
			if ( modalShareObjectId ) {
				modalDataAttrs['data-share-object-id'] = 'true';
				modalDataAttrs['data-current-object-id'] = '{{CURRENT_POST_ID}}';
			}
			if ( modalSharePostTitle ) {
				modalDataAttrs['data-share-post-title'] = 'true';
				modalDataAttrs['data-current-post-title'] = '{{CURRENT_POST_TITLE}}';
			}
			if ( modalShareCurrentUrl ) {
				modalDataAttrs['data-share-current-url'] = 'true';
				modalDataAttrs['data-current-url'] = '{{CURRENT_POST_URL}}';
			}

			buttonElement = (
				<button
					className={ buttonClasses + ' jankx-button-modal-trigger' }
					type="button"
					{ ...modalDataAttrs }
					style={ buttonStyles }
					title={ title }
				>
					{ buttonContent }
				</button>
			);
			break;

		default:
			buttonElement = (
				<a
					className={ buttonClasses }
					href="#"
					style={ buttonStyles }
					title={ title }
					data-trigger-type="link"
				>
					{ buttonContent }
				</a>
			);
	}

	return (
		<div
			{ ...useBlockProps.save( {
				className: 'wp-block-button',
			} ) }
		>
			{ buttonElement }
		</div>
	);
}