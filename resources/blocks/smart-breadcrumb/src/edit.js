import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import {
	InspectorControls,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { store as editorStore } from '@wordpress/editor';
import ServerSideRender from '@wordpress/server-side-render';
import {
	SelectControl,
	ToggleControl,
	TextControl,
	Panel,
	PanelBody,
	PanelRow,
	Spinner,
	RangeControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { getBreadcrumbStylePresetOptions } from './style-presets';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const {
		showHome,
		homeText,
		separator,
		showCurrent,
		maxDepth,
		stylePreset,
		useSeoPlugin,
		fallbackToCustom
	} = attributes;

	// Get block props with core styling support
	const blockProps = useBlockProps( {
		className: [
			'wp-block-jankx-smart-breadcrumb',
			stylePreset && stylePreset !== 'default' ? `breadcrumb-style-${stylePreset}` : '',
		].filter(Boolean).join(' '),
	} );

	// Get the autoupdate option from WordPress php.
	const autoupdateOption = useSelect( ( select ) => {
		const optionValue =
			select( 'core' ).getSite()?.jankx_autoupdate_enabled;
		if ( Number( optionValue ) !== 1 ) {
			return true;
		}
		return false;
	}, [] );

	const { returnisSaving, returnisSavingNonPostEntityChanges } = useSelect(
		( select ) => {
			const { isSavingPost, isSavingNonPostEntityChanges } =
				select( editorStore );
			return {
				returnisSaving: isSavingPost(),
				returnisSavingNonPostEntityChanges:
					returnisSavingNonPostEntityChanges(),
			};
		}
	);

	const advpanelicon = 'settings';

	const controls = (
		<BlockControls group="block">
			{ /* No specific toolbar controls needed for breadcrumb */ }
		</BlockControls>
	);

	const controlssidebar = (
		<InspectorControls>
			<Panel>
				<PanelBody title={ __( 'Breadcrumb Settings', 'jankx' ) }>
					<PanelRow>
						<ToggleControl
							label={ __( 'Show Home Link', 'jankx' ) }
							help={ __( 'Display home page link in breadcrumb', 'jankx' ) }
							checked={ showHome }
							onChange={ ( value ) => setAttributes( { showHome: value } ) }
						/>
					</PanelRow>
					{ showHome && (
						<PanelRow>
							<TextControl
								label={ __( 'Home Text', 'jankx' ) }
								help={ __( 'Text for home page link', 'jankx' ) }
								value={ homeText }
								onChange={ ( value ) => setAttributes( { homeText: value } ) }
							/>
						</PanelRow>
					) }
					<PanelRow>
						<TextControl
							label={ __( 'Separator', 'jankx' ) }
							help={ __( 'Character or symbol to separate breadcrumb items', 'jankx' ) }
							value={ separator }
							onChange={ ( value ) => setAttributes( { separator: value } ) }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Show Current Page', 'jankx' ) }
							help={ __( 'Display current page title in breadcrumb', 'jankx' ) }
							checked={ showCurrent }
							onChange={ ( value ) => setAttributes( { showCurrent: value } ) }
						/>
					</PanelRow>
					<PanelRow>
						<RangeControl
							label={ __( 'Maximum Depth', 'jankx' ) }
							help={ __( 'Maximum number of breadcrumb levels to display', 'jankx' ) }
							value={ maxDepth }
							onChange={ ( value ) => setAttributes( { maxDepth: value } ) }
							min={ 1 }
							max={ 5 }
						/>
					</PanelRow>
				</PanelBody>
			</Panel>
			<Panel>
				<PanelBody
					title={ __( 'SEO Plugin Integration', 'jankx' ) }
					icon="admin-site"
					initialOpen={ false }
				>
					<PanelRow>
						<ToggleControl
							label={ __( 'Use SEO Plugin Breadcrumb', 'jankx' ) }
							help={ __( 'Try to use breadcrumb from installed SEO plugins (RankMath, Yoast, etc.)', 'jankx' ) }
							checked={ useSeoPlugin }
							onChange={ ( value ) => setAttributes( { useSeoPlugin: value } ) }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Fallback to Custom Breadcrumb', 'jankx' ) }
							help={ __( 'Generate custom breadcrumb if SEO plugin breadcrumb is not available', 'jankx' ) }
							checked={ fallbackToCustom }
							onChange={ ( value ) => setAttributes( { fallbackToCustom: value } ) }
						/>
					</PanelRow>
					<PanelRow>
						<div style={ {
							marginTop: '1em',
							padding: '0.5em',
							backgroundColor: '#f0f8ff',
							border: '1px solid #b3d9ff',
							borderRadius: '4px',
							fontSize: '12px',
							color: '#0066cc'
						} }>
							<strong>{ __( 'Supported SEO Plugins:', 'jankx' ) }</strong><br/>
							• RankMath<br/>
							• Yoast SEO<br/>
							• SEOPress<br/>
							• Breadcrumb NavXT<br/>
							• WooCommerce
						</div>
					</PanelRow>
				</PanelBody>
			</Panel>
			<Panel>
				<PanelBody
					title={ __( 'Styles', 'jankx' ) }
					icon="admin-appearance"
					initialOpen={ false }
				>
					<PanelRow>
						<SelectControl
							label={ __( 'Style Preset', 'jankx' ) }
							value={ stylePreset }
							options={ getBreadcrumbStylePresetOptions().map( option => ({
								label: __( option.label, 'jankx' ),
								value: option.value
							}) ) }
							onChange={ ( value ) => setAttributes( { stylePreset: value } ) }
						/>
					</PanelRow>
				</PanelBody>
			</Panel>
		</InspectorControls>
	);

	return (
		<div { ...blockProps }>
			{ controls }
			{ controlssidebar }
			{ /* Conditional rendering based on autoupdate attribute */ }
			{ autoupdateOption &&
			( returnisSaving || returnisSavingNonPostEntityChanges ) ? (
				<Spinner />
			) : (
				<ServerSideRender
					block="jankx/smart-breadcrumb"
					attributes={ attributes }
				/>
			) }
		</div>
	);
}
