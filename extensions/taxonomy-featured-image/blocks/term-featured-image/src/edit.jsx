import clsx from 'clsx';
import { isBlobURL } from '@wordpress/blob';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	SelectControl,
	ToggleControl,
	Placeholder,
	Button,
	Spinner,
	TextControl,
	ExternalLink,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import {
	InspectorControls,
	BlockControls,
	MediaPlaceholder,
	MediaReplaceFlow,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
	useBlockEditingMode,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useMemo, useEffect, useState, memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { upload } from '@wordpress/icons';
import { store as noticesStore } from '@wordpress/notices';
import DimensionControls from './dimension-controls';
import OverlayControls from './overlay-controls';
import Overlay from './overlay';

const ALLOWED_MEDIA_TYPES = [ 'image' ];
const DEFAULT_MEDIA_SIZE_SLUG = 'full';

const IMAGE_SIZE_OPTIONS = [
	{ label: 'Thumbnail (150px)', value: 'thumbnail' },
	{ label: 'Medium (300px)', value: 'medium' },
	{ label: 'Medium Large (768px)', value: 'medium_large' },
	{ label: 'Large (1024px)', value: 'large' },
	{ label: 'Full Size', value: 'full' },
];

const useToolsPanelDropdownMenuProps = () => {};

function TermFeaturedImageResolutionTool( { image, value, onChange } ) {
	const { imageSizes } = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return {
			imageSizes: getSettings().imageSizes,
		};
	}, [] );

	if ( ! imageSizes?.length ) {
		return null;
	}

	const imageSizeOptions = imageSizes
		.filter(
			( { slug } ) => image?.media_details?.sizes?.[ slug ]?.source_url
		)
		.map( ( { name, slug } ) => ( { value: slug, label: name } ) );

	// Fallback to hardcoded options if no dynamic sizes available.
	const options = imageSizeOptions.length
		? imageSizeOptions
		: IMAGE_SIZE_OPTIONS;

	return (
		<ToolsPanelItem
			label={ __( 'Image size' ) }
			isShownByDefault
			hasValue={ () => !! value }
			onDeselect={ () => onChange( DEFAULT_MEDIA_SIZE_SLUG ) }
			panelId={ 'image-size' }
		>
			<SelectControl
				label={ __( 'Image size' ) }
				value={ value || DEFAULT_MEDIA_SIZE_SLUG }
				options={ options }
				onChange={ onChange }
			/>
		</ToolsPanelItem>
	);
}

const hasDimensionValue = ( value ) =>
	value !== undefined && value !== null && value !== '';

function TermFeaturedImageEdit( {
	attributes,
	setAttributes,
	context: { termId, taxonomy },
} ) {
	const {
		isLink,
		aspectRatio,
		height,
		width,
		scale,
		sizeSlug,
		rel,
		linkTarget,
	} = attributes;

	const [ temporaryURL, setTemporaryURL ] = useState();

	// Resolve image from term meta _thumbnail_id (the Jankx API).
	const { media, termLink } = useSelect(
		( select ) => {
			if ( ! termId || ! taxonomy ) {
				return { media: null, termLink: '' };
			}
			const term = select( coreStore ).getEntityRecord(
				'taxonomy',
				taxonomy,
				termId
			);
			const imageId =
				term?.meta?.[ '_thumbnail_id' ] !== undefined
					? Number( term.meta[ '_thumbnail_id' ] )
					: 0;
			return {
				media: imageId
					? select( coreStore ).getEntityRecord(
							'postType',
							'attachment',
							imageId,
							{ context: 'view' }
					  )
					: null,
				termLink: term?.link || '',
			};
		},
		[ termId, taxonomy ]
	);

	const mediaUrl =
		media?.media_details?.sizes?.[ sizeSlug ]?.source_url ||
		media?.source_url;

	const blockProps = useBlockProps( {
		className: clsx( {
			'is-transient': temporaryURL,
		} ),
	} );
	const borderProps = useBorderProps( attributes );
	const shadowProps = getShadowClassesAndStyles( attributes );
	const blockEditingMode = useBlockEditingMode();
	const aspectRatioStyle = aspectRatio === 'auto' ? undefined : aspectRatio;

	const placeholder = ( content ) => {
		return (
			<Placeholder
				className={ clsx(
					'block-editor-media-placeholder',
					borderProps.className
				) }
				withIllustration
				style={ {
					aspectRatio: aspectRatioStyle,
					height: hasDimensionValue( height )
						? height
						: hasDimensionValue( width ) && 'auto',
					width: hasDimensionValue( width )
						? width
						: !! aspectRatio && '100%',
					...borderProps.style,
					...shadowProps.style,
				} }
			>
				{ content }
			</Placeholder>
		);
	};

	const onSelectImage = ( value ) => {
		if ( value?.id ) {
			setAttributes( { defaultImageId: value.id } );
		}

		if ( value?.url && isBlobURL( value.url ) ) {
			setTemporaryURL( value.url );
		}
	};

	const onResetImage = () => {
		setAttributes( {
			isLink: false,
			linkTarget: '_self',
			rel: '',
			sizeSlug: undefined,
		} );
	};

	// Reset temporary url when media is available.
	useEffect( () => {
		if ( mediaUrl && temporaryURL ) {
			setTemporaryURL();
		}
	}, [ mediaUrl, temporaryURL ] );

	const { createErrorNotice } = useDispatch( noticesStore );
	const onUploadError = ( message ) => {
		createErrorNotice( message, { type: 'snackbar' } );
		setTemporaryURL();
	};

	const dropdownMenuProps = useToolsPanelDropdownMenuProps;

	const controls = blockEditingMode === 'default' && (
		<>
			<InspectorControls group="color">
				<OverlayControls
					attributes={ attributes }
					setAttributes={ setAttributes }
					clientId={ 'term-featured-image' }
				/>
			</InspectorControls>
			<InspectorControls group="dimensions">
				<DimensionControls
					clientId={ 'term-featured-image' }
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
			</InspectorControls>
			{ ( media || ! termId ) && (
				<InspectorControls>
					<ToolsPanel
						label={ __( 'Settings' ) }
						resetAll={ () => {
							setAttributes( {
								isLink: false,
								linkTarget: '_self',
								rel: '',
								sizeSlug: DEFAULT_MEDIA_SIZE_SLUG,
							} );
						} }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							label={ __( 'Link to term' ) }
							isShownByDefault
							hasValue={ () => !! isLink }
							onDeselect={ () =>
								setAttributes( {
									isLink: false,
								} )
							}
						>
							<ToggleControl
								label={ __( 'Make image a link' ) }
								onChange={ () =>
									setAttributes( { isLink: ! isLink } )
								}
								checked={ isLink }
							/>
						</ToolsPanelItem>

						{ isLink && (
							<ToolsPanelItem
								label={ __( 'Open in new tab' ) }
								isShownByDefault
								hasValue={ () => '_self' !== linkTarget }
								onDeselect={ () =>
									setAttributes( {
										linkTarget: '_self',
									} )
								}
							>
								<ToggleControl
									label={ __( 'Open in new tab' ) }
									onChange={ ( value ) =>
										setAttributes( {
											linkTarget: value
												? '_blank'
												: '_self',
										} )
									}
									checked={ linkTarget === '_blank' }
								/>
							</ToolsPanelItem>
						) }
						{ isLink && (
							<ToolsPanelItem
								label={ __( 'Link relation' ) }
								isShownByDefault
								hasValue={ () => !! rel }
								onDeselect={ () =>
									setAttributes( {
										rel: '',
									} )
								}
							>
								<TextControl
									label={ __( 'Link relation' ) }
									value={ rel }
									onChange={ ( newRel ) =>
										setAttributes( { rel: newRel } )
									}
								/>
							</ToolsPanelItem>
						) }
						{ !! media && (
							<TermFeaturedImageResolutionTool
								image={ media }
								value={ sizeSlug }
								onChange={ ( nextSizeSlug ) =>
									setAttributes( { sizeSlug: nextSizeSlug } )
								}
							/>
						) }
					</ToolsPanel>
				</InspectorControls>
			) }
		</>
	);

	let image;

	// No image set and in a context without termId — show placeholder only.
	if ( ! media && ! temporaryURL && ! termId ) {
		return (
			<>
				{ controls }
				<div { ...blockProps }>
					{ placeholder() }
					<Overlay
						attributes={ attributes }
						setAttributes={ setAttributes }
						clientId={ 'term-featured-image' }
					/>
				</div>
			</>
		);
	}

	const label = __( 'Add a featured image' );
	const imageStyles = {
		...borderProps.style,
		...shadowProps.style,
		aspectRatio: aspectRatioStyle,
		height: hasDimensionValue( height )
			? height
			: hasDimensionValue( width ) && 'auto',
		width: hasDimensionValue( width ) ? width : !! aspectRatio && '100%',
		objectFit: !! ( height || aspectRatio ) && scale,
	};

	// No image set but has termId — show MediaPlaceholder for selection.
	if ( ! media && ! temporaryURL ) {
		image = (
			<MediaPlaceholder
				onSelect={ onSelectImage }
				accept="image/*"
				allowedTypes={ ALLOWED_MEDIA_TYPES }
				onError={ onUploadError }
				placeholder={ placeholder }
				mediaLibraryButton={ ( { open } ) => {
					return (
						<Button
							__next40pxDefaultSize
							icon={ upload }
							variant="primary"
							label={ label }
							showTooltip
							tooltipPosition="top center"
							onClick={ () => {
								open();
							} }
						/>
					);
				} }
			/>
		);
	} else {
		// Have an image — show loading placeholder or the image.
		image =
			! media && ! temporaryURL ? (
				placeholder()
			) : (
				<>
					<img
						className={ borderProps.className }
						src={ temporaryURL || mediaUrl }
						alt={
							media && media?.alt_text
								? sprintf(
										// translators: %s: The image's alt text.
										__( 'Featured image: %s' ),
										media.alt_text
									)
								: __( 'Featured image' )
						}
						style={ imageStyles }
					/>
					{ temporaryURL && <Spinner /> }
				</>
			);
	}

	return (
		<>
			{ ! temporaryURL && controls }
			{ !! media && (
				<BlockControls group="other">
					<MediaReplaceFlow
						mediaId={ media.id }
						mediaURL={ mediaUrl }
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						accept="image/*"
						onSelect={ onSelectImage }
						onError={ onUploadError }
						onReset={ onResetImage }
					/>
				</BlockControls>
			) }
			<figure { ...blockProps }>
				{ !! isLink ? (
					<a href={ termLink } target={ linkTarget }>
						{ image }
					</a>
				) : (
					image
				) }
				<Overlay
					attributes={ attributes }
					setAttributes={ setAttributes }
					clientId={ 'term-featured-image' }
				/>
			</figure>
		</>
	);
}

export default memo( TermFeaturedImageEdit );
