import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	BlockControls,
	useBlockProps,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { store as editorStore } from '@wordpress/editor';
import ServerSideRender from '@wordpress/server-side-render';
import {
	SelectControl,
	ToggleControl,
	TextControl,
	TextareaControl,
	Panel,
	PanelBody,
	PanelRow,
	Spinner,
	RangeControl,
	Button,
	BaseControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { getBreadcrumbStylePresetOptions } from './style-presets';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const {
		showHome,
		homeItemType,
		homeItemText,
		homeItemIcon,
		homeItemSvg,
		homeItemImage,
		showHomeText,
		separator,
		showCurrent,
		maxDepth,
		stylePreset,
		useSeoPlugin,
		fallbackToCustom
	} = attributes;

	// Get block props with core styling support
	const blockProps = useBlockProps({
		className: [
			'wp-block-jankx-smart-breadcrumb',
			stylePreset && stylePreset !== 'default' ? `breadcrumb-style-${stylePreset}` : '',
		].filter(Boolean).join(' '),
	});

	// Get the autoupdate option from WordPress php.
	const autoupdateOption = useSelect((select) => {
		const optionValue =
			select('core').getSite()?.jankx_autoupdate_enabled;
		if (Number(optionValue) !== 1) {
			return true;
		}
		return false;
	}, []);

	const { isSaving, isSavingNonPostChanges } = useSelect(
		(select) => {
			const { isSavingPost, isSavingNonPostEntityChanges } =
				select(editorStore);
			return {
				isSaving: isSavingPost(),
				isSavingNonPostChanges: isSavingNonPostEntityChanges(),
			};
		}
	);

	const controls = (
		<BlockControls group="block">
			{ /* No specific toolbar controls needed for breadcrumb */}
		</BlockControls>
	);

	const controlssidebar = (
		<InspectorControls>
			<Panel>
				<PanelBody title={__('Breadcrumb Settings', 'jankx')}>
					<ToggleControl
						label={__('Show Home Link', 'jankx')}
						help={__('Display home page link in breadcrumb', 'jankx')}
						checked={showHome}
						onChange={(value) => setAttributes({ showHome: value })}
					/>
					{showHome && (
						<>
							<SelectControl
								label={__('Home Item Type', 'jankx')}
								value={homeItemType}
								options={[
									{ label: __('Text', 'jankx'), value: 'text' },
									{ label: __('CSS Icon (FontAwesome, etc.)', 'jankx'), value: 'css' },
									{ label: __('SVG Code', 'jankx'), value: 'svg' },
									{ label: __('Image', 'jankx'), value: 'image' },
								]}
								onChange={(value) => setAttributes({ homeItemType: value })}
							/>
							{homeItemType === 'text' && (
								<TextControl
									label={__('Home Text', 'jankx')}
									value={homeItemText}
									onChange={(value) => setAttributes({ homeItemText: value })}
								/>
							)}
							{homeItemType === 'css' && (
								<TextControl
									label={__('Icon Class', 'jankx')}
									help={__('e.g. fa fa-home', 'jankx')}
									value={homeItemIcon}
									onChange={(value) => setAttributes({ homeItemIcon: value })}
								/>
							)}
							{homeItemType === 'svg' && (
								<TextareaControl
									label={__('SVG Code', 'jankx')}
									help={__('Paste raw SVG code here', 'jankx')}
									value={homeItemSvg}
									onChange={(value) => setAttributes({ homeItemSvg: value })}
								/>
							)}
							{homeItemType === 'image' && (
								<BaseControl label={__('Home Image', 'jankx')}>
									<MediaUploadCheck>
										<MediaUpload
											onSelect={(media) => setAttributes({ homeItemImage: { id: media.id, url: media.url } })}
											allowedTypes={['image']}
											value={homeItemImage?.id}
											render={({ open }) => (
												<div className="jankx-media-upload-preview">
													{homeItemImage?.url ? (
														<>
															<img src={homeItemImage.url} alt="" style={{ maxWidth: '100%', display: 'block', marginBottom: '10px' }} />
															<Button isSecondary onClick={open}>
																{__('Replace Image', 'jankx')}
															</Button>
															<Button isDestructive onClick={() => setAttributes({ homeItemImage: null })} style={{ marginLeft: '10px' }}>
																{__('Remove', 'jankx')}
															</Button>
														</>
													) : (
														<Button isPrimary onClick={open}>
															{__('Select Image', 'jankx')}
														</Button>
													)}
												</div>
											)}
										/>
									</MediaUploadCheck>
								</BaseControl>
							)}

							{homeItemType !== 'text' && (
								<ToggleControl
									label={__('Show Home Text', 'jankx')}
									checked={showHomeText}
									onChange={(value) => setAttributes({ showHomeText: value })}
								/>
							)}

							{showHomeText && homeItemType !== 'text' && (
								<TextControl
									label={__('Home Text', 'jankx')}
									value={homeItemText}
									onChange={(value) => setAttributes({ homeItemText: value })}
								/>
							)}
						</>
					)}
					<TextControl
						label={__('Separator', 'jankx')}
						help={__('Character or symbol to separate breadcrumb items', 'jankx')}
						value={separator}
						onChange={(value) => setAttributes({ separator: value })}
					/>
					<ToggleControl
						label={__('Show Current Page', 'jankx')}
						help={__('Display current page title in breadcrumb', 'jankx')}
						checked={showCurrent}
						onChange={(value) => setAttributes({ showCurrent: value })}
					/>
					<RangeControl
						label={__('Maximum Depth', 'jankx')}
						help={__('Maximum number of breadcrumb levels to display', 'jankx')}
						value={maxDepth}
						onChange={(value) => setAttributes({ maxDepth: value })}
						min={1}
						max={5}
					/>
				</PanelBody>
			</Panel>
			<Panel>
				<PanelBody
					title={__('SEO Plugin Integration', 'jankx')}
					icon="admin-site"
					initialOpen={false}
				>
					<ToggleControl
						label={__('Use SEO Plugin Breadcrumb', 'jankx')}
						help={__('Try to use breadcrumb from installed SEO plugins (RankMath, Yoast, etc.)', 'jankx')}
						checked={useSeoPlugin}
						onChange={(value) => setAttributes({ useSeoPlugin: value })}
					/>
					<ToggleControl
						label={__('Fallback to Custom Breadcrumb', 'jankx')}
						help={__('Generate custom breadcrumb if SEO plugin breadcrumb is not available', 'jankx')}
						checked={fallbackToCustom}
						onChange={(value) => setAttributes({ fallbackToCustom: value })}
					/>
				</PanelBody>
			</Panel>
			<Panel>
				<PanelBody
					title={__('Styles', 'jankx')}
					icon="admin-appearance"
					initialOpen={false}
				>
					<SelectControl
						label={__('Style Preset', 'jankx')}
						value={stylePreset}
						options={getBreadcrumbStylePresetOptions().map(option => ({
							label: __(option.label, 'jankx'),
							value: option.value
						}))}
						onChange={(value) => setAttributes({ stylePreset: value })}
					/>
				</PanelBody>
			</Panel>
		</InspectorControls>
	);

	return (
		<div {...blockProps}>
			{controls}
			{controlssidebar}
			{ /* Conditional rendering based on autoupdate attribute */}
			{autoupdateOption &&
				(isSaving || isSavingNonPostChanges) ? (
				<Spinner />
			) : (
				<ServerSideRender
					block="jankx/smart-breadcrumb"
					attributes={attributes}
				/>
			)}
		</div>
	);
}
