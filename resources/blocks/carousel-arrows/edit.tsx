import { __ } from '@wordpress/i18n';
import type { CSSProperties } from 'react';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	TextControl,
	TextareaControl,
	RangeControl,
	ColorPalette,
	Button,
	BaseControl,
} from '@wordpress/components';

interface CarouselArrowsAttributes {
	showArrows: boolean;
	arrowsPosition: string;
	navIconType: string;
	prevIconImageId: number;
	prevIconImageUrl: string;
	nextIconImageId: number;
	nextIconImageUrl: string;
	prevIconSvg: string;
	nextIconSvg: string;
	prevIconClass: string;
	nextIconClass: string;
	navIconSize: number;
	navIconColor: string;
	navBtnWidth: number;
	navBtnHeight: number;
	navBtnBorderRadius: number;
	navBtnBgColor: string;
}

interface EditProps {
	attributes: CarouselArrowsAttributes;
	setAttributes: ( attrs: Partial< CarouselArrowsAttributes > ) => void;
}

const buildStyledIcon = (
	type: string,
	{
		svg,
		imageUrl,
		imageAlt,
		iconClass,
	}: {
		svg?: string;
		imageUrl?: string;
		imageAlt?: string;
		iconClass?: string;
	},
	size: number,
	color: string,
	side: 'prev' | 'next' = 'prev'
): JSX.Element => {
	const sizeStyle = `width:${ size }px;height:${ size }px;`;
	const colorStyle = color ? `color:${ color };` : '';

	if ( type === 'image' && imageUrl ) {
		return (
			<img
				src={ imageUrl }
				alt={ imageAlt || '' }
				style={ {
					width: size,
					height: size,
					objectFit: 'contain',
					display: 'block',
				} }
			/>
		);
	}
	if ( type === 'svg' && svg ) {
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
				dangerouslySetInnerHTML={ { __html: svg } }
			/>
		);
	}
	if ( type === 'fonticon' && iconClass ) {
		return (
			<span
				className={ iconClass }
				style={ {
					fontSize: size,
					lineHeight: 1,
					color: color || undefined,
				} }
			/>
		);
	}
	return (
		<svg viewBox="0 0 24 24" width={ size } height={ size } fill="none">
			<path
				d={ side === 'prev' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6' }
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default function Edit( {
	attributes,
	setAttributes,
}: EditProps ): JSX.Element {
	const {
		showArrows = true,
		arrowsPosition = 'inside',
		navIconType = 'arrow',
		prevIconImageId = 0,
		prevIconImageUrl = '',
		nextIconImageId = 0,
		nextIconImageUrl = '',
		prevIconSvg = '',
		nextIconSvg = '',
		prevIconClass = '',
		nextIconClass = '',
		navIconSize = 24,
		navIconColor = '',
		navBtnWidth = 44,
		navBtnHeight = 44,
		navBtnBorderRadius = 50,
		navBtnBgColor = '',
	} = attributes;

	const blockProps = useBlockProps();

	const buttonStyle: CSSProperties = {
		width: navBtnWidth,
		height: navBtnHeight,
		borderRadius: navBtnBorderRadius,
		background: navBtnBgColor || undefined,
		color: navIconColor || undefined,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: 'none',
		cursor: 'pointer',
		padding: 0,
	};

	const renderIconPicker = (
		label: string,
		key: 'prev' | 'next'
	): JSX.Element => {
		const iconClass = key === 'prev' ? prevIconClass : nextIconClass;
		const iconSvg = key === 'prev' ? prevIconSvg : nextIconSvg;
		const imageUrl = key === 'prev' ? prevIconImageUrl : nextIconImageUrl;
		const imageId = key === 'prev' ? prevIconImageId : nextIconImageId;

		const setIcon = (
			patch: Partial< CarouselArrowsAttributes >
		): void => {
			setAttributes( patch );
		};

		return (
			<BaseControl
				label={ label }
				id={ `jankx-carousel-arrows-${ label
					.toLowerCase()
					.replace( /[^a-z0-9]+/g, '-' )
					.replace( /(^-|-$)/g, '' ) }` }
			>
				{ navIconType === 'image' && (
					<div
						style={ {
							display: 'flex',
							gap: '8px',
							alignItems: 'center',
						} }
					>
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={ [ 'image' ] }
								value={ imageId }
								onSelect={ ( media ) => {
									if ( key === 'prev' ) {
										setIcon( {
											prevIconImageId: media.id,
											prevIconImageUrl: media.url,
										} );
									} else {
										setIcon( {
											nextIconImageId: media.id,
											nextIconImageUrl: media.url,
										} );
									}
								} }
								render={ ( { open } ) => (
									<Button
										variant="secondary"
										onClick={ open }
									>
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
								onClick={ () => {
									if ( key === 'prev' ) {
										setIcon( {
											prevIconImageId: 0,
											prevIconImageUrl: '',
										} );
									} else {
										setIcon( {
											nextIconImageId: 0,
											nextIconImageUrl: '',
										} );
									}
								} }
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
						onChange={ ( value ) =>
							setIcon(
								key === 'prev'
									? { prevIconSvg: value }
									: { nextIconSvg: value }
							)
						}
						help={ __( 'Paste an inline <svg> element.', 'jankx' ) }
					/>
				) }
				{ navIconType === 'fonticon' && (
					<TextControl
						label={ __( 'Icon class', 'jankx' ) }
						value={ iconClass }
						onChange={ ( value ) =>
							setIcon(
								key === 'prev'
									? { prevIconClass: value }
									: { nextIconClass: value }
							)
						}
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
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Carousel Arrows', 'jankx' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Show prev/next arrows', 'jankx' ) }
						checked={ showArrows }
						onChange={ ( value ) =>
							setAttributes( { showArrows: value } )
						}
					/>
					<SelectControl
						label={ __( 'Arrows position', 'jankx' ) }
						value={ arrowsPosition }
						options={ [
							{
								label: __( 'Inside (sides)', 'jankx' ),
								value: 'inside',
							},
							{
								label: __( 'Outside edges', 'jankx' ),
								value: 'outside',
							},
							{ label: __( 'Bottom', 'jankx' ), value: 'bottom' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								arrowsPosition: value as CarouselArrowsAttributes[ 'arrowsPosition' ],
							} )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Icon Style', 'jankx' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Icon type', 'jankx' ) }
						value={ navIconType }
						options={ [
							{ label: __( 'Arrow', 'jankx' ), value: 'arrow' },
							{ label: __( 'Image', 'jankx' ), value: 'image' },
							{ label: __( 'SVG', 'jankx' ), value: 'svg' },
							{
								label: __( 'Font icon', 'jankx' ),
								value: 'fonticon',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( {
								navIconType: value as CarouselArrowsAttributes[ 'navIconType' ],
							} )
						}
					/>
					{ renderIconPicker(
						__( 'Previous icon', 'jankx' ),
						'prev'
					) }
					{ renderIconPicker( __( 'Next icon', 'jankx' ), 'next' ) }

					<RangeControl
						label={ __( 'Icon size', 'jankx' ) }
						value={ navIconSize }
						onChange={ ( value ) =>
							setAttributes( { navIconSize: value ?? 24 } )
						}
						min={ 12 }
						max={ 96 }
					/>
					<BaseControl
						label={ __( 'Icon color', 'jankx' ) }
						id="jankx-carousel-arrows-icon-color"
					>
						<ColorPalette
							value={ navIconColor || undefined }
							onChange={ ( color ) =>
								setAttributes( { navIconColor: color || '' } )
							}
						/>
						{ navIconColor && (
							<Button
								variant="tertiary"
								isDestructive
								onClick={ () =>
									setAttributes( { navIconColor: '' } )
								}
							>
								{ __( 'Reset', 'jankx' ) }
							</Button>
						) }
					</BaseControl>
				</PanelBody>

				<PanelBody
					title={ __( 'Button Style', 'jankx' ) }
					initialOpen={ false }
				>
					<RangeControl
						label={ __( 'Button width', 'jankx' ) }
						value={ navBtnWidth }
						onChange={ ( value ) =>
							setAttributes( { navBtnWidth: value ?? 44 } )
						}
						min={ 24 }
						max={ 96 }
					/>
					<RangeControl
						label={ __( 'Button height', 'jankx' ) }
						value={ navBtnHeight }
						onChange={ ( value ) =>
							setAttributes( { navBtnHeight: value ?? 44 } )
						}
						min={ 24 }
						max={ 96 }
					/>
					<RangeControl
						label={ __( 'Border radius', 'jankx' ) }
						value={ navBtnBorderRadius }
						onChange={ ( value ) =>
							setAttributes( { navBtnBorderRadius: value ?? 50 } )
						}
						min={ 0 }
						max={ 50 }
						help={ __(
							'Use 50 for a circle, 0 for square corners.',
							'jankx'
						) }
					/>
					<BaseControl
						label={ __( 'Button background', 'jankx' ) }
						id="jankx-carousel-arrows-btn-bg"
					>
						<ColorPalette
							value={ navBtnBgColor || undefined }
							onChange={ ( color ) =>
								setAttributes( { navBtnBgColor: color || '' } )
							}
						/>
						{ navBtnBgColor && (
							<Button
								variant="tertiary"
								isDestructive
								onClick={ () =>
									setAttributes( { navBtnBgColor: '' } )
								}
							>
								{ __( 'Reset', 'jankx' ) }
							</Button>
						) }
					</BaseControl>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="carousel-arrows-preview">
					<div className="carousel-arrows-preview__buttons">
						{ showArrows && (
							<>
								<button
									type="button"
									className="carousel-arrows-preview__btn"
									style={ buttonStyle }
									aria-label={ __(
										'Previous slide',
										'jankx'
									) }
								>
									{ buildStyledIcon(
										navIconType,
										{
											svg: prevIconSvg,
											imageUrl: prevIconImageUrl,
											iconClass: prevIconClass,
										},
										navIconSize,
										navIconColor,
										'prev'
									) }
								</button>
								<button
									type="button"
									className="carousel-arrows-preview__btn"
									style={ buttonStyle }
									aria-label={ __( 'Next slide', 'jankx' ) }
								>
									{ buildStyledIcon(
										navIconType,
										{
											svg: nextIconSvg,
											imageUrl: nextIconImageUrl,
											iconClass: nextIconClass,
										},
										navIconSize,
										navIconColor,
										'next'
									) }
								</button>
							</>
						) }
						{ ! showArrows && (
							<em>{ __( 'Arrows are hidden.', 'jankx' ) }</em>
						) }
					</div>
					<div className="carousel-arrows-preview__footer">
						<span>{ __( 'Carousel Navigation Controls', 'jankx' ) } ({ arrowsPosition })</span>
					</div>
				</div>
			</div>
		</>
	);
}
