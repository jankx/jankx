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
 * The save function for the SVG Icon Button Block.
 *
 * @param {Object} props All props passed to this function.
 */
export default function Save( props: any ) {
	const {
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
	} = props.attributes;

	// If there is no text and no icon, don't save anything.
	if ( ! text && ! ( icon || iconName ) ) {
		return null;
	}

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

	// If a label is set, add as aria-label. Will overwite any aria-label in
	// custom icons.
	if ( label && printedIcon ) {
		printedIcon = {
			...printedIcon,
			props: { ...printedIcon.props, 'aria-label': label },
		};
	}

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
		background: ! gradient ? customGradient : undefined,
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
		...(blockProps.style as any),
		...(borderProps.style as any),
	};

	const rel = isEmpty( linkRel ) ? undefined : linkRel;
	const target = isEmpty( linkTarget ) ? undefined : linkTarget;

	const iconMarkup = showIcon && printedIcon ? (
		<div className="icon-container" style={ iconStyles }>
			{ printedIcon }
		</div>
	) : null;

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

	const buttonElement = url ? (
		<a
			className={ buttonClasses }
			href={ url }
			target={ target }
			rel={ rel }
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
		<div
			{ ...useBlockProps.save( {
				className: 'wp-block-button',
			} ) }
		>
			{ buttonElement }
		</div>
	);
}
