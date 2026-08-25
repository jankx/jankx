import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	TextControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

const IMAGE_SIZE_OPTIONS = [
	{ label: 'Thumbnail (150px)', value: 'thumbnail' },
	{ label: 'Medium (300px)', value: 'medium' },
	{ label: 'Medium Large (768px)', value: 'medium_large' },
	{ label: 'Large (1024px)', value: 'large' },
	{ label: 'Full Size', value: 'full' },
];

const ASPECT_RATIO_OPTIONS = [
	{ label: __('Original', 'jankx'), value: '' },
	{ label: 'Square — 1:1', value: '1' },
	{ label: 'Standard — 4:3', value: '4/3' },
	{ label: 'Portrait — 3:4', value: '3/4' },
	{ label: 'Classic — 3:2', value: '3/2' },
	{ label: 'Wide — 16:9', value: '16/9' },
	{ label: 'Tall — 9:16', value: '9/16' },
];

const OBJECT_FIT_OPTIONS = [
	{ label: 'Cover (fill & crop)', value: 'cover' },
	{ label: 'Contain (fit inside)', value: 'contain' },
	{ label: 'Fill (stretch)', value: 'fill' },
	{ label: 'None', value: 'none' },
	{ label: 'Scale Down', value: 'scale-down' },
];

const TAXONOMY_FALLBACKS = [
	{ label: 'Category', value: 'category' },
	{ label: 'Post Tag', value: 'post_tag' },
	{ label: 'Product Category', value: 'product_cat' },
	{ label: 'Experience Category', value: 'experience_category' },
];

export default function Edit({ attributes, setAttributes, context }: any) {
	const {
		termId,
		taxonomy,
		imageSize,
		aspectRatio,
		objectFit,
		isLink,
		linkTarget,
		showPlaceholder,
	} = attributes;

	const contextTermId = context?.termId || 0;
	const contextTaxonomy = context?.taxonomy || '';

	const previewTermId = termId || contextTermId;
	const previewTaxonomy = taxonomy || contextTaxonomy;

	const { media, hasResolved } = useSelect(
		(select: any) => {
			if (!previewTermId || !previewTaxonomy) {
				return { media: null, hasResolved: true };
			}
			const term = select('core').getEntityRecord(
				'taxonomy',
				previewTaxonomy,
				previewTermId
			);
			const imageId =
				term?.meta?.['_thumbnail_id'] !== undefined
					? Number(term.meta['_thumbnail_id'])
					: 0;
			const m = imageId ? select('core').getMedia(imageId, { context: 'view' }) : null;
			return { media: m, hasResolved: true };
		},
		[previewTermId, previewTaxonomy]
	);

	const taxonomies = useSelect((select: any) => {
		if (!termId) {
			return [];
		}
		return (
			select('core').getTaxonomies({ per_page: -1 })?.map((t: any) => ({
				label: t.labels?.singular_name || t.name,
				value: t.slug,
			})) || TAXONOMY_FALLBACKS
		);
	}, [termId]);

	const blockProps = useBlockProps({
		className: 'term-featured-image-block',
	});

	const figureStyle: Record<string, string> = {};
	if (aspectRatio) {
		figureStyle.aspectRatio = aspectRatio.replace('/', ' / ');
	}

	const imgStyle: Record<string, string> = {};
	if (aspectRatio) {
		imgStyle.objectFit = objectFit;
		imgStyle.width = '100%';
		imgStyle.height = '100%';
	}

	const showImage = !!(media && media.source_url);

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Image Settings', 'jankx')} initialOpen={true}>
					<SelectControl
						label={__('Image Size', 'jankx')}
						value={imageSize}
						options={IMAGE_SIZE_OPTIONS}
						onChange={(value) => setAttributes({ imageSize: value })}
					/>
					<SelectControl
						label={__('Aspect Ratio', 'jankx')}
						value={aspectRatio}
						options={ASPECT_RATIO_OPTIONS}
						onChange={(value) => setAttributes({ aspectRatio: value })}
					/>
					{aspectRatio && (
						<SelectControl
							label={__('Object Fit', 'jankx')}
							value={objectFit}
							options={OBJECT_FIT_OPTIONS}
							onChange={(value) => setAttributes({ objectFit: value })}
						/>
					)}
				</PanelBody>

				<PanelBody title={__('Link Settings', 'jankx')} initialOpen={false}>
					<ToggleControl
						label={__('Link to Term Archive', 'jankx')}
						checked={isLink}
						onChange={(value) => setAttributes({ isLink: value })}
					/>
					{isLink && (
						<>
							<SelectControl
								label={__('Open In New Tab', 'jankx')}
								value={linkTarget}
								options={[
									{ label: __('Same Tab', 'jankx'), value: '_self' },
									{ label: __('New Tab', 'jankx'), value: '_blank' },
								]}
								onChange={(value) => setAttributes({ linkTarget: value })}
							/>
							<TextControl
								label={__('Link Rel', 'jankx')}
								value={attributes.rel || ''}
								placeholder="noopener noreferrer"
								onChange={(value) => setAttributes({ rel: value || undefined })}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Fallback', 'jankx')} initialOpen={false}>
					<ToggleControl
						label={__('Show Placeholder When Empty', 'jankx')}
						help={__(
							'Display a placeholder box when the term has no featured image.',
							'jankx'
						)}
						checked={showPlaceholder}
						onChange={(value) => setAttributes({ showPlaceholder: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Static Term (Optional)', 'jankx')} initialOpen={false}>
					<TextControl
						label={__('Term ID Override', 'jankx')}
						type="number"
						value={termId || ''}
						help={__(
							'Leave empty to auto-detect: current archive term or loop term. Set an ID to always show that specific term.',
							'jankx'
						)}
						onChange={(value) =>
							setAttributes({ termId: value ? parseInt(value, 10) : 0 })
						}
					/>
					{!!termId && (
						<SelectControl
							label={__('Taxonomy', 'jankx')}
							value={taxonomy}
							options={[
								{ label: __('Auto Detect', 'jankx'), value: '' },
								...(taxonomies.length ? taxonomies : TAXONOMY_FALLBACKS),
							]}
							onChange={(value) => setAttributes({ taxonomy: value })}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div className="term-featured-image" style={figureStyle}>
				{showImage ? (
					<img
						src={media.source_url}
						alt={media.alt_text || ''}
						style={imgStyle as any}
					/>
				) : showPlaceholder || !hasResolved ? (
					<div className="term-featured-image__placeholder">
						<span className="dashicons dashicons-format-image"></span>
						<span className="term-featured-image__hint">
							{contextTermId
								? __('No image for this term yet', 'jankx')
								: __('Term Featured Image (auto)', 'jankx')}
						</span>
					</div>
				) : null}
			</div>
		</div>
	);
}
