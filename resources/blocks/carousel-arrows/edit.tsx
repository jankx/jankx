import { __ } from '@wordpress/i18n';
import type { CSSProperties } from 'react';
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import {
	NavButtonStyleSettings,
	NavIconSettings,
	navButtonStyle,
	renderNavIcon,
} from '../../shared/components/CarouselNavSettings';

interface CarouselArrowsAttributes {
	showArrows: boolean;
	alwaysShowArrows?: boolean;
	arrowsPosition: 'inside' | 'outside' | 'bottom';
	navIconType: 'arrow' | 'image' | 'svg' | 'fonticon';
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

const buildStyledIcon = renderNavIcon;

export default function Edit( {
	attributes,
	setAttributes,
}: EditProps ): JSX.Element {
	const {
		showArrows = true,
		alwaysShowArrows = false,
		arrowsPosition = 'inside',
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

	const buttonStyle: CSSProperties = navButtonStyle( attributes );

	const blockProps = useBlockProps( {
		className: [
			'carousel-arrows-editor-preview',
			`carousel-arrows-position--${ arrowsPosition }`,
			! showArrows ? 'carousel-arrows--hidden' : '',
			alwaysShowArrows ? 'carousel-arrows--always-show' : '',
		]
			.filter( Boolean )
			.join( ' ' ),
		'data-arrows-position': arrowsPosition,
		'data-always-show': alwaysShowArrows ? 'true' : 'false',
		'data-show-arrows': showArrows ? 'true' : 'false',
	} );

	// Build a single nav button
	const renderNavBtn = ( side: 'prev' | 'next' ) => (
		<button
			type="button"
			className={ `carousel-nav carousel-${ side }` }
			style={ buttonStyle }
			aria-label={ side === 'prev' ? __( 'Previous slide', 'jankx' ) : __( 'Next slide', 'jankx' ) }
			tabIndex={ -1 }
		>
			{ buildStyledIcon(
				navIconType,
				{
					svg: side === 'prev' ? prevIconSvg : nextIconSvg,
					imageUrl: side === 'prev' ? prevIconImageUrl : nextIconImageUrl,
					iconClass: side === 'prev' ? prevIconClass : nextIconClass,
				},
				navIconSize,
				navIconColor,
				side
			) }
		</button>
	);

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
					{ showArrows && (
						<ToggleControl
							label={ __( 'Always show arrows', 'jankx' ) }
							help={ __(
								'Always keep buttons visible even when at the start or end of slides.',
								'jankx'
							) }
							checked={ alwaysShowArrows }
							onChange={ ( value ) =>
								setAttributes( { alwaysShowArrows: value } )
							}
						/>
					) }
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
					<NavIconSettings
						attributes={ attributes }
						setAttributes={ setAttributes }
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Button Style', 'jankx' ) }
					initialOpen={ false }
				>
					<NavButtonStyleSettings
						attributes={ attributes }
						setAttributes={ setAttributes }
					/>
				</PanelBody>
			</InspectorControls>

			{ /* Canvas render: arrows positioned relative to parent carousel */ }
			<div { ...blockProps }>
				{ showArrows ? (
					<>
						{ arrowsPosition !== 'bottom' ? (
							<>
								{ renderNavBtn( 'prev' ) }
								{ renderNavBtn( 'next' ) }
							</>
						) : (
							<div className="carousel-arrows-bottom-row">
								{ renderNavBtn( 'prev' ) }
								{ renderNavBtn( 'next' ) }
							</div>
						) }
					</>
				) : (
					<span className="carousel-arrows-hidden-notice">
						<svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" style={ { verticalAlign: 'middle', marginRight: 4 } }>
							<path d="M13.586 3H18a1 1 0 011 1v4.414a1 1 0 01-.293.707l-8 8a1 1 0 01-1.414 0l-5.414-5.414a1 1 0 010-1.414l8-8A1 1 0 0113.586 3zM15 7a1 1 0 100-2 1 1 0 000 2z" />
						</svg>
						{ __( 'Arrows disabled', 'jankx' ) }
					</span>
				) }
			</div>
		</>
	);
}
