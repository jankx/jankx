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
 * Deprecated version 1: Before adding data-micromodal-trigger
 */
const v1 = {
	attributes: {
		// Same attributes as current version
	},
	save( props: any ) {
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
					const iconsAll = flattenIconsArray( getIcons() );
					const namedIcon = iconsAll.filter( ( i ) => i.name === iconName );
					let printedIcon: any = '';

					if ( icon && isEmpty( namedIcon ) ) {
						printedIcon = parseIcon( icon );
						if ( isEmpty( printedIcon?.props ) ) {
							printedIcon = '';
						}
					} else if ( ! isEmpty( namedIcon ) ) {
						printedIcon = namedIcon[ 0 ]?.icon;
						if ( typeof printedIcon === 'string' ) {
							printedIcon = parseIcon( printedIcon );
						}
					}

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

		const buttonClasses = classnames( 'wp-block-button__link', borderProps?.className, {
			'has-icon-color': iconColorValue,
			'has-no-icon-fill-color': hasNoIconFill,
			'has-icon-background-color':
				iconBackgroundColorValue ||
				iconBackgroundColor ||
				gradient ||
				customGradient,
			'has-background-color': customBackgroundColor || backgroundColor,
			'has-text-color': customTextColor || textColor,
			[ `has-${ iconBackgroundColor }-background-color` ]:
				iconBackgroundColor,
			[ `has-${ iconColor }-color` ]: iconColor,
			[ `has-${ gradient }-gradient-background` ]: gradient,
			[ `has-${ backgroundColor }-background-color` ]: backgroundColor,
			[ `has-${ textColor }-color` ]: textColor,
			[ `hover-effect-${ hoverEffect }` ]: hoverEffect && hoverEffect !== 'none',
		} );

		const buttonStyles = {
			backgroundColor: customBackgroundColor,
			color: customTextColor,
			...(blockProps.style as any),
			...(borderProps.style as any),
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
				// OLD VERSION: Without data-micromodal-trigger
				const modalDataAttrs: any = {
					'data-modal-id': modalId || '',
					'data-trigger-type': 'modal'
				};

				if ( modalShareObjectId ) {
					modalDataAttrs['data-share-object-id'] = 'true';
				}
				if ( modalSharePostTitle ) {
					modalDataAttrs['data-share-post-title'] = 'true';
				}
				if ( modalShareCurrentUrl ) {
					modalDataAttrs['data-share-current-url'] = 'true';
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
};

export default [ v1 ];

