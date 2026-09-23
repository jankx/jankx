import { __, _x } from '@wordpress/i18n';
import {
	SelectControl,
	__experimentalUnitControl as UnitControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

const SCALE_OPTIONS = [
	{
		value: 'cover',
		label: _x( 'Cover', 'Scale option for Image dimension control' ),
	},
	{
		value: 'contain',
		label: _x( 'Contain', 'Scale option for Image dimension control' ),
	},
	{
		value: 'fill',
		label: _x( 'Fill', 'Scale option for Image dimension control' ),
	},
];

const ASPECT_RATIO_OPTIONS = [
	{ value: '', label: __( 'Original', 'jankx' ) },
	{ value: 'auto', label: __( 'Auto', 'jankx' ) },
	{ value: '1', label: '1:1' },
	{ value: '4/3', label: '4:3' },
	{ value: '3/4', label: '3:4' },
	{ value: '3/2', label: '3:2' },
	{ value: '16/9', label: '16:9' },
	{ value: '9/16', label: '9:16' },
];

const DimensionControls = ( {
	clientId,
	attributes,
	setAttributes,
} ) => {
	const { aspectRatio, width, height, scale } = attributes;

	return (
		<>
			<ToolsPanelItem
				label={ __( 'Aspect ratio' ) }
				isShownByDefault
				hasValue={ () => !! aspectRatio }
				onDeselect={ () =>
					setAttributes( {
						aspectRatio: undefined,
					} )
				}
				panelId={ clientId }
			>
				<SelectControl
					label={ __( 'Aspect ratio' ) }
					value={ aspectRatio || '' }
					options={ ASPECT_RATIO_OPTIONS }
					onChange={ ( newAspectRatio ) =>
						setAttributes( {
							aspectRatio: newAspectRatio || undefined,
						} )
					}
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				label={ __( 'Width' ) }
				isShownByDefault
				hasValue={ () => !! width }
				onDeselect={ () =>
					setAttributes( {
						width: undefined,
					} )
				}
				panelId={ clientId }
			>
				<UnitControl
					label={ __( 'Width' ) }
					value={ width || '' }
					onChange={ ( newWidth ) =>
						setAttributes( {
							width: newWidth || undefined,
						} )
					}
					units={ [
						{ value: 'px', label: 'px', default: 0 },
						{ value: '%', label: '%', default: 0 },
						{ value: 'vw', label: 'vw', default: 0 },
						{ value: 'em', label: 'em', default: 0 },
						{ value: 'rem', label: 'rem', default: 0 },
					] }
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				label={ __( 'Height' ) }
				isShownByDefault
				hasValue={ () => !! height }
				onDeselect={ () =>
					setAttributes( {
						height: undefined,
					} )
				}
				panelId={ clientId }
			>
				<UnitControl
					label={ __( 'Height' ) }
					value={ height || '' }
					onChange={ ( newHeight ) =>
						setAttributes( {
							height: newHeight || undefined,
						} )
					}
					units={ [
						{ value: 'px', label: 'px', default: 0 },
						{ value: '%', label: '%', default: 0 },
						{ value: 'vh', label: 'vh', default: 0 },
						{ value: 'em', label: 'em', default: 0 },
						{ value: 'rem', label: 'rem', default: 0 },
					] }
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				label={ __( 'Scale' ) }
				isShownByDefault
				hasValue={ () => !! scale && scale !== 'cover' }
				onDeselect={ () =>
					setAttributes( {
						scale: 'cover',
					} )
				}
				panelId={ clientId }
			>
				<SelectControl
					label={ __( 'Scale' ) }
					value={ scale || 'cover' }
					options={ SCALE_OPTIONS }
					onChange={ ( newScale ) =>
						setAttributes( {
							scale: newScale,
						} )
					}
				/>
			</ToolsPanelItem>
		</>
	);
};

export default DimensionControls;
