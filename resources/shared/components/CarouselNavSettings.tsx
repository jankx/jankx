import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	ColorPalette,
	RangeControl,
	SelectControl,
	TextareaControl,
	TextControl,
} from '@wordpress/components';
import type { CSSProperties } from 'react';

export type NavSide = 'prev' | 'next';

export interface CarouselNavAttributes {
	navIconType?: 'arrow' | 'image' | 'svg' | 'fonticon';
	prevIconImageId?: number;
	prevIconImageUrl?: string;
	nextIconImageId?: number;
	nextIconImageUrl?: string;
	prevIconSvg?: string;
	nextIconSvg?: string;
	prevIconClass?: string;
	nextIconClass?: string;
	navIconSize?: number;
	navIconColor?: string;
	navBtnWidth?: number;
	navBtnHeight?: number;
	navBtnBorderRadius?: number;
	navBtnBgColor?: string;
}

interface SettableProps {
	attributes: CarouselNavAttributes;
	setAttributes: ( attrs: Partial< CarouselNavAttributes > ) => void;
}

/**
 * Render the prev/next icon. Falls back to an inline chevron SVG so the
 * default arrow type always shows something (the old CSS ::after approach
 * never had a `content` rule, leaving empty buttons).
 */
export function renderNavIcon(
	type: string,
	opts: { imageUrl?: string; svg?: string; iconClass?: string },
	size: number,
	color: string,
	side: NavSide
): JSX.Element {
	if ( type === 'image' && opts.imageUrl ) {
		return (
			<img
				src={ opts.imageUrl }
				alt={ side === 'prev' ? 'Previous' : 'Next' }
				style={ {
					width: size,
					height: size,
					objectFit: 'contain',
					display: 'block',
				} }
			/>
		);
	}

	if ( type === 'svg' && opts.svg ) {
		return (
			<span
				style={ {
					width: size,
					height: size,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: color || undefined,
				} }
				dangerouslySetInnerHTML={ { __html: opts.svg } }
			/>
		);
	}

	if ( type === 'fonticon' && opts.iconClass ) {
		return (
			<span
				className={ opts.iconClass }
				style={ {
					fontSize: size,
					lineHeight: 1,
					color: color || undefined,
				} }
				aria-hidden="true"
			/>
		);
	}

	return (
		<svg
			viewBox="0 0 24 24"
			width={ size }
			height={ size }
			fill="none"
			aria-hidden="true"
		>
			<path
				d={
					side === 'prev'
						? 'M15 18l-6-6 6-6'
						: 'M9 18l6-6-6-6'
				}
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				style={ color ? { color } : undefined }
			/>
		</svg>
	);
}

/**
 * Inline style shared by the editor preview buttons. Matches the frontend
 * renderer (CarouselArrowsRenderer): width/height in px, radius in percent.
 */
export function navButtonStyle( attrs: CarouselNavAttributes ): CSSProperties {
	const {
		navBtnWidth = 44,
		navBtnHeight = 44,
		navBtnBorderRadius = 50,
		navBtnBgColor = '',
		navIconColor = '',
	} = attrs;

	return {
		width: navBtnWidth,
		height: navBtnHeight,
		borderRadius: `${ navBtnBorderRadius }%`,
		background: navBtnBgColor || undefined,
		color: navIconColor || undefined,
	};
}

interface NavPreviewButtonProps {
	side: NavSide;
	attributes: CarouselNavAttributes;
	onClick?: () => void;
	disabled?: boolean;
}

/**
 * Editor canvas preview button. Uses the same classes as the frontend
 * markup so the shared positioning CSS applies everywhere.
 */
export function NavPreviewButton( {
	side,
	attributes,
	onClick,
	disabled,
}: NavPreviewButtonProps ): JSX.Element {
	const {
		navIconType = 'arrow',
		prevIconImageUrl = '',
		nextIconImageUrl = '',
		prevIconSvg = '',
		nextIconSvg = '',
		prevIconClass = '',
		nextIconClass = '',
		navIconSize = 24,
		navIconColor = '',
	} = attributes;

	const imageUrl = side === 'prev' ? prevIconImageUrl : nextIconImageUrl;
	const svg = side === 'prev' ? prevIconSvg : nextIconSvg;
	const iconClass = side === 'prev' ? prevIconClass : nextIconClass;

	return (
		<button
			type="button"
			className={ `embla__button embla__button--${ side } carousel-nav carousel-${ side }` }
			style={ navButtonStyle( attributes ) }
			aria-label={
				side === 'prev'
					? __( 'Previous slide', 'jankx' )
					: __( 'Next slide', 'jankx' )
			}
			tabIndex={ -1 }
			disabled={ disabled }
			onClick={ onClick }
		>
			{ renderNavIcon(
				navIconType,
				{ imageUrl, svg, iconClass },
				navIconSize,
				navIconColor,
				side
			) }
		</button>
	);
}

function IconPicker( {
	label,
	side,
	attributes,
	setAttributes,
}: {
	label: string;
	side: NavSide;
	attributes: CarouselNavAttributes;
	setAttributes: SettableProps[ 'setAttributes' ];
} ): JSX.Element {
	const {
		navIconType = 'arrow',
		prevIconImageId = 0,
		prevIconImageUrl = '',
		nextIconImageId = 0,
		nextIconImageUrl = '',
		prevIconSvg = '',
		nextIconSvg = '',
		prevIconClass = '',
		nextIconClass = '',
	} = attributes;

	const imageId = side === 'prev' ? prevIconImageId : nextIconImageId;
	const imageUrl = side === 'prev' ? prevIconImageUrl : nextIconImageUrl;
	const iconSvg = side === 'prev' ? prevIconSvg : nextIconSvg;
	const iconClass = side === 'prev' ? prevIconClass : nextIconClass;

	const slug = label
		.toLowerCase()
		.replace( /[^a-z0-9]+/g, '-' )
		.replace( /(^-|-$)/g, '' );

	return (
		<BaseControl label={ label } id={ `jankx-carousel-nav-${ slug }` }>
			{ navIconType === 'image' && (
				<div style={ { display: 'flex', gap: '8px', alignItems: 'center' } }>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={ [ 'image' ] }
							value={ imageId }
							onSelect={ ( media: any ) =>
								setAttributes(
									side === 'prev'
										? {
												prevIconImageId: media.id,
												prevIconImageUrl: media.url,
										  }
										: {
												nextIconImageId: media.id,
												nextIconImageUrl: media.url,
										  }
								)
							}
							render={ ( { open }: { open: () => void } ) => (
								<Button variant="secondary" onClick={ open }>
									{ imageUrl
										? __( 'Replace image', 'jankx' )
										: __( 'Select image', 'jankx' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
					{ imageUrl && (
						<Button
							variant="tertiary"
							isDestructive
							onClick={ () =>
								setAttributes(
									side === 'prev'
										? { prevIconImageId: 0, prevIconImageUrl: '' }
										: { nextIconImageId: 0, nextIconImageUrl: '' }
								)
							}
						>
							{ __( 'Remove', 'jankx' ) }
						</Button>
					) }
				</div>
			) }
			{ navIconType === 'svg' && (
				<TextareaControl
					label={ __( 'SVG markup', 'jankx' ) }
					value={ iconSvg }
					onChange={ ( value: string ) =>
						setAttributes(
							side === 'prev'
								? { prevIconSvg: value }
								: { nextIconSvg: value }
						)
					}
					help={ __( 'Paste an inline <svg> element.', 'jankx' ) }
					rows={ 4 }
				/>
			) }
			{ navIconType === 'fonticon' && (
				<TextControl
					label={ __( 'Icon class', 'jankx' ) }
					value={ iconClass }
					onChange={ ( value: string ) =>
						setAttributes(
							side === 'prev'
								? { prevIconClass: value }
								: { nextIconClass: value }
						)
					}
					placeholder="fas fa-chevron-left"
				/>
			) }
			{ navIconType === 'arrow' && (
				<p
					className="components-base-control__help"
					style={ { marginTop: 0 } }
				>
					{ __( 'Uses the default chevron arrow.', 'jankx' ) }
				</p>
			) }
		</BaseControl>
	);
}

/**
 * Icon type + per-side icon pickers + size + color. Shared by the Carousel
 * block and the Carousel Arrows block.
 */
export function NavIconSettings( {
	attributes,
	setAttributes,
}: SettableProps ): JSX.Element {
	const { navIconType = 'arrow', navIconSize = 24, navIconColor = '' } =
		attributes;

	return (
		<>
			<SelectControl
				label={ __( 'Icon type', 'jankx' ) }
				value={ navIconType }
				options={ [
					{ label: __( 'Arrow', 'jankx' ), value: 'arrow' },
					{ label: __( 'Image', 'jankx' ), value: 'image' },
					{ label: __( 'SVG', 'jankx' ), value: 'svg' },
					{ label: __( 'Font icon', 'jankx' ), value: 'fonticon' },
				] }
				onChange={ ( value: string ) =>
					setAttributes( {
						navIconType: value as CarouselNavAttributes[ 'navIconType' ],
					} )
				}
			/>
			<IconPicker
				label={ __( 'Previous icon', 'jankx' ) }
				side="prev"
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			<IconPicker
				label={ __( 'Next icon', 'jankx' ) }
				side="next"
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			<RangeControl
				label={ __( 'Icon size', 'jankx' ) }
				value={ navIconSize }
				onChange={ ( value?: number ) =>
					setAttributes( { navIconSize: value ?? 24 } )
				}
				min={ 12 }
				max={ 96 }
			/>
			<BaseControl
				label={ __( 'Icon color', 'jankx' ) }
				id="jankx-carousel-nav-icon-color"
			>
				<ColorPalette
					value={ navIconColor || undefined }
					onChange={ ( color?: string ) =>
						setAttributes( { navIconColor: color || '' } )
					}
				/>
				{ navIconColor && (
					<Button
						variant="tertiary"
						isDestructive
						onClick={ () => setAttributes( { navIconColor: '' } ) }
					>
						{ __( 'Reset', 'jankx' ) }
					</Button>
				) }
			</BaseControl>
		</>
	);
}

/**
 * Button container size/radius/background. Shared by the Carousel block and
 * the Carousel Arrows block.
 */
export function NavButtonStyleSettings( {
	attributes,
	setAttributes,
}: SettableProps ): JSX.Element {
	const {
		navBtnWidth = 44,
		navBtnHeight = 44,
		navBtnBorderRadius = 50,
		navBtnBgColor = '',
	} = attributes;

	return (
		<>
			<RangeControl
				label={ __( 'Button width', 'jankx' ) }
				value={ navBtnWidth }
				onChange={ ( value?: number ) =>
					setAttributes( { navBtnWidth: value ?? 44 } )
				}
				min={ 20 }
				max={ 100 }
			/>
			<RangeControl
				label={ __( 'Button height', 'jankx' ) }
				value={ navBtnHeight }
				onChange={ ( value?: number ) =>
					setAttributes( { navBtnHeight: value ?? 44 } )
				}
				min={ 20 }
				max={ 100 }
			/>
			<RangeControl
				label={ __( 'Border radius', 'jankx' ) }
				value={ navBtnBorderRadius }
				onChange={ ( value?: number ) =>
					setAttributes( {
						navBtnBorderRadius:
							typeof value !== 'undefined' ? value : 50,
					} )
				}
				min={ 0 }
				max={ 50 }
				help={ __( 'Use 50 for a circle, 0 for square corners.', 'jankx' ) }
			/>
			<BaseControl
				label={ __( 'Button background', 'jankx' ) }
				id="jankx-carousel-nav-btn-bg"
			>
				<ColorPalette
					value={ navBtnBgColor || undefined }
					onChange={ ( color?: string ) =>
						setAttributes( { navBtnBgColor: color || '' } )
					}
				/>
				{ navBtnBgColor && (
					<Button
						variant="tertiary"
						isDestructive
						onClick={ () => setAttributes( { navBtnBgColor: '' } ) }
					>
						{ __( 'Reset', 'jankx' ) }
					</Button>
				) }
			</BaseControl>
		</>
	);
}
