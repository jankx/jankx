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
	formatListBullets,
	formatOutdent,
	formatIndent,
	update,
	formatListNumbered,
} from '@wordpress/icons';
import {
	SelectControl,
	ToolbarButton,
	ToggleControl,
	TextControl,
	RadioControl,
	Panel,
	PanelBody,
	PanelRow,
	ExternalLink,
	Spinner,
} from '@wordpress/components';
import HeadingLevelDropdown from './heading-level-dropdown';
import { useSelect } from '@wordpress/data';
import './editor.scss';
// import './../assets/accordion.css'; // Commented out - file doesn't exist

export default function Edit( { attributes, setAttributes } ) {
	const { hideTOC, hidden, accordion } = attributes;

	// Effect to adjust hideTOC based on hidden or accordion attributes
	useEffect( () => {
		// If hideTOC is already set, no need to adjust
		if ( hideTOC !== undefined ) {
			return;
		}

		// Determine if we need to activate hideTOC based on hidden or accordion
		if ( hidden || accordion ) {
			setAttributes( { hideTOC: true } );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] ); // Empty dependency array ensures this runs once on mount

	const blockProps = useBlockProps();

	// Get the autoupdate option from WordPress php.
	const autoupdateOption = useSelect( ( select ) => {
		const optionValue =
			select( 'core' ).getSite()?.jankx_autoupdate_enabled;
		if ( Number( optionValue ) !== 1 ) {
			return true;
		}
		return false;
	}, [] );

	const { autoupdate } = attributes;

	const { returnisSaving, returnisSavingNonPostEntityChanges } = useSelect(
		( select ) => {
			const { isSavingPost, isSavingNonPostEntityChanges } =
				select( editorStore );
			return {
				returnisSaving: isSavingPost(),
				returnisSavingNonPostEntityChanges:
					isSavingNonPostEntityChanges(),
			};
		}
	);

	const advpanelicon = 'settings';

	const controls = (
		<BlockControls group="block">
			{ ! (
				attributes.no_title ||
				attributes.accordion ||
				attributes.hidden
			) && (
				<HeadingLevelDropdown
					selectedLevel={ attributes.title_level }
					onChange={ ( level ) =>
						setAttributes( {
							title_level: Number( level ),
						} )
					}
				/>
			) }
			<ToolbarButton
				icon={ formatListBullets }
				title={ __( 'Convert to unordered list', 'jankx' ) }
				describedBy={ __( 'Convert to unordered list', 'jankx' ) }
				isActive={ attributes.use_ol === false }
				onClick={ () => {
					setAttributes( { use_ol: false } );
				} }
			/>
			<ToolbarButton
				icon={ formatListNumbered }
				title={ __( 'Convert to ordered list', 'jankx' ) }
				describedBy={ __( 'Convert to ordered list', 'jankx' ) }
				isActive={ attributes.use_ol === true }
				onClick={ () => {
					setAttributes( { use_ol: true } );
				} }
			/>
			<ToolbarButton
				icon={ formatOutdent }
				title={ __( 'Indent list', 'jankx' ) }
				describedBy={ __( 'Indent list', 'jankx' ) }
				isActive={ attributes.remove_indent === true }
				onClick={ () => {
					setAttributes( { remove_indent: true } );
				} }
			/>
			<ToolbarButton
				icon={ formatIndent }
				title={ __( 'Outdent list', 'jankx' ) }
				describedBy={ __( 'Outdent list', 'jankx' ) }
				isActive={ attributes.remove_indent === false }
				onClick={ () => {
					setAttributes( { remove_indent: false } );
				} }
			/>
			{ ( ! attributes.autoupdate || ! autoupdateOption ) && (
				<ToolbarButton
					icon={ update }
					label={ __( 'Update table of contents', 'jankx' ) }
					onClick={ () => setAttributes( { updated: Date.now() } ) }
				/>
			) }
		</BlockControls>
	);

	const controlssidebar = (
		<InspectorControls>
			<Panel>
				<PanelBody>
					{ ! attributes.no_title && (
						<PanelRow>
							<TextControl
								label={ __( 'Heading Text', 'jankx' ) }
								help={
									__(
										'Set the heading text of the block.',
										'jankx'
									) +
									' ' +
									__( 'Default value', 'jankx' ) +
									': ' +
									__( 'Table of Contents', 'jankx' )
								}
								value={ attributes.title_text }
								onChange={ ( value ) =>
									setAttributes( {
										title_text:
											value ||
											__(
												'Table of Contents',
												'jankx'
											),
									} )
								}
							/>
						</PanelRow>
					) }
					<PanelRow>
						<ToggleControl
							label={ __( 'Remove heading', 'jankx' ) }
							checked={ attributes.no_title }
							onChange={ () =>
								setAttributes( {
									no_title: ! attributes.no_title,
								} )
							}
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label={ __( 'Minimum level', 'jankx' ) }
							help={ __(
								'Minimum depth of the headings.',
								'jankx'
							) }
							value={ attributes.min_level }
							options={ [
								{
									label:
										__( 'Including', 'jankx' ) + ' H6',
									value: '6',
								},
								{
									label:
										__( 'Including', 'jankx' ) + ' H5',
									value: '5',
								},
								{
									label:
										__( 'Including', 'jankx' ) + ' H4',
									value: '4',
								},
								{
									label:
										__( 'Including', 'jankx' ) + ' H3',
									value: '3',
								},
								{
									label:
										__( 'Including', 'jankx' ) + ' H2',
									value: '2',
								},
								{
									label:
										__( 'Including', 'jankx' ) +
										' H1 (' +
										__( 'default', 'jankx' ) +
										')',
									value: '1',
								},
							] }
							onChange={ ( level ) =>
								setAttributes( {
									min_level: Number( level ),
								} )
							}
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label={ __( 'Maximum level', 'jankx' ) }
							help={ __(
								'Maximum depth of the headings.',
								'jankx'
							) }
							value={ attributes.max_level }
							options={ [
								{
									label:
										__( 'Including', 'jankx' ) +
										' H6 (' +
										__( 'default', 'jankx' ) +
										')',
									value: '6',
								},
								{
									label:
										__( 'Including', 'jankx' ) + ' H5',
									value: '5',
								},
								{
									label:
										__( 'Including', 'jankx' ) + ' H4',
									value: '4',
								},
								{
									label:
										__( 'Including', 'jankx' ) + ' H3',
									value: '3',
								},
								{
									label:
										__( 'Including', 'jankx' ) + ' H2',
									value: '2',
								},
								{
									label:
										__( 'Including', 'jankx' ) + ' H1',
									value: '1',
								},
							] }
							onChange={ ( level ) =>
								setAttributes( {
									max_level: Number( level ),
								} )
							}
						/>
					</PanelRow>
				</PanelBody>
			</Panel>
			<Panel>
				<PanelBody
					title={ __( 'Advanced Features', 'jankx' ) }
					icon={ advpanelicon }
					initialOpen={ false }
				>
					<PanelRow>
						<div
							style={ {
								marginBottom: '1em',
								border: '1px solid rgba(0, 0, 0, 0.05)',
								padding: '0.5em',
								backgroundColor: '#f7f7f7',
							} }
						>
							<p>
								<strong>
									{ __(
										'Think about making a donation if you use any of these features.',
										'jankx'
									) }
								</strong>
							</p>
							<ExternalLink href="https://marc.tv/out/donate">
								{ __( 'Donate here!', 'jankx' ) }
							</ExternalLink>
						</div>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Hide SimpleTOC', 'jankx' ) }
							checked={ attributes.hideTOC }
							onChange={ ( value ) => {
								if ( ! value ) {
									// When turning off the "Hide SimpleTOC", reset both 'hidden' and 'accordion'
									setAttributes( {
										hideTOC: false,
										hidden: false,
										accordion: false,
									} );
								} else {
									// When turning on, set 'hidden' true by default (and 'accordion' remains false unless chosen otherwise)
									setAttributes( {
										hideTOC: true,
										hidden: true,
									} );
								}
							} }
						/>
					</PanelRow>

					{ attributes.hideTOC && (
						<PanelRow>
							<RadioControl
								label={ __( 'Type', 'jankx' ) }
								selected={
									attributes.hidden ? 'hidden' : 'accordion'
								}
								options={ [
									{
										label: __(
											'Hide with a clickable dropdown (using <details> tag).',
											'jankx'
										),
										value: 'hidden',
									},
									{
										label: __(
											'Hide in accordion menu. Adds minimal JS and CSS.',
											'jankx'
										),
										value: 'accordion',
									},
								] }
								onChange={ ( value ) => {
									setAttributes( {
										hidden: value === 'hidden',
										accordion: value === 'accordion',
									} );
								} }
							/>
						</PanelRow>
					) }
					<PanelRow>
						<ToggleControl
							label={ __(
								'Smooth scrolling support',
								'jankx'
							) }
							help={ __(
								'Adds the following CSS to the HTML element: "scroll-behavior: smooth;"',
								'jankx'
							) }
							checked={ attributes.add_smooth }
							onChange={ () =>
								setAttributes( {
									add_smooth: ! attributes.add_smooth,
								} )
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Use absolute urls', 'jankx' ) }
							help={ __(
								'Adds the permalink url to the fragment.',
								'jankx'
							) }
							checked={ attributes.use_absolute_urls }
							onChange={ () =>
								setAttributes( {
									use_absolute_urls:
										! attributes.use_absolute_urls,
								} )
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Wrapper div', 'jankx' ) }
							help={ __(
								'Additionally adds the role "navigation" and ARIA attributes.',
								'jankx'
							) }
							checked={ attributes.wrapper }
							onChange={ () =>
								setAttributes( {
									wrapper: ! attributes.wrapper,
								} )
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Automatic refresh', 'jankx' ) }
							help={ __(
								'Automatic updating of the table of contents.',
								'jankx'
							) }
							checked={ attributes.autoupdate }
							onChange={ () =>
								setAttributes( {
									autoupdate: ! attributes.autoupdate,
								} )
							}
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
			autoupdate &&
			( returnisSaving || returnisSavingNonPostEntityChanges ) ? (
				<Spinner />
			) : (
				<ServerSideRender
					block="jankx/table-of-content"
					attributes={ attributes }
				/>
			) }
		</div>
	);
}
