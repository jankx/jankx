/* eslint-disable no-unused-vars */
import {
	useBlockProps,
	BlockControls,
	InspectorControls,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// editor style
import './editor.scss';

// component
import Devices from './components/devices';

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		galleryId,
		images,
		colDevice,
		deskCol,
		tabCol,
		phoneCol,
		gapDevice,
		deskGap,
		tabGap,
		phoneGap,
		enableLightbox,
		imageHoverEffect,
		layout,
		rows,
	} = attributes;
	const isMasonry = layout === 'masonry';
	const isHorizontalMasonry = layout === 'horizontal-masonry';
	// cols number
	const colsNumber = images ? (isMasonry ? deskCol : 1) : 1;
	const tabletColumns = isMasonry ? tabCol : 1;
	const phoneColumns = isMasonry ? phoneCol : 1;

	// gallery id
	setAttributes({ galleryId: clientId.slice(0, 8) });

	const blockProps = useBlockProps({
		className: `layout__${layout} dc__${colsNumber} tc__${tabletColumns} pc__${phoneColumns} dg__${deskGap} tg__${tabGap} pg__${phoneGap} ${isHorizontalMasonry ? `rows__${rows}` : ''}`,
	});

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={__('Gallery Settings', 'jankx')}
					initialOpen={true}
				>
					<SelectControl
						label={__('Layout', 'jankx')}
						value={layout}
						options={[
							{
								label: __('Masonry', 'jankx'),
								value: 'masonry',
							},
							{
								label: __('Masonry (Horizontal)', 'jankx'),
								value: 'horizontal-masonry',
							},
							{
								label: __('Stacked (Portrait)', 'jankx'),
								value: 'stacked',
							},
						]}
						onChange={(value) =>
							setAttributes({
								layout: value,
							})
						}
					/>
					{isHorizontalMasonry && (
						<RangeControl
							label={__('Number of Rows', 'jankx')}
							value={rows}
							onChange={(value) => setAttributes({ rows: value })}
							min={1}
							max={4}
						/>
					)}
					{isMasonry && (
						<>
							<Devices
								device={colDevice}
								title={__('Number of Columns', 'jankx')}
								renderFunction={(device) =>
									setAttributes({
										colDevice: device,
									})
								}
							/>
							{colDevice === 'desktop' && (
								<RangeControl
									value={deskCol}
									onChange={(value) =>
										setAttributes({ deskCol: value })
									}
									min={1}
									max={5}
								/>
							)}

							{colDevice === 'tablet' && (
								<RangeControl
									value={tabCol}
									onChange={(value) =>
										setAttributes({ tabCol: value })
									}
									min={1}
									max={5}
								/>
							)}

							{colDevice === 'smartphone' && (
								<RangeControl
									value={phoneCol}
									onChange={(value) =>
										setAttributes({ phoneCol: value })
									}
									min={1}
									max={5}
								/>
							)}
						</>
					)}
					{/* Columns Gap */}
					<Devices
						device={gapDevice}
						title={__('Items Gutter', 'jankx')}
						renderFunction={(device) =>
							setAttributes({
								gapDevice: device,
							})
						}
					/>
					{gapDevice === 'desktop' && (
						<RangeControl
							value={deskGap}
							onChange={(value) =>
								setAttributes({ deskGap: value })
							}
							min={0}
							max={100}
							help={__(
								'unit in pixel (px)',
								'jankx'
							)}
						/>
					)}

					{gapDevice === 'tablet' && (
						<RangeControl
							value={tabGap}
							onChange={(value) =>
								setAttributes({ tabGap: value })
							}
							min={0}
							max={100}
							help={__(
								'unit in pixel (px)',
								'jankx'
							)}
						/>
					)}

					{gapDevice === 'smartphone' && (
						<RangeControl
							value={phoneGap}
							onChange={(value) =>
								setAttributes({ phoneGap: value })
							}
							min={0}
							max={100}
							help={__(
								'unit in pixel (px)',
								'jankx'
							)}
						/>
					)}
				</PanelBody>
				<PanelBody
					title={__(
						'Gallery Image Settings',
						'jankx'
					)}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Enable Lightbox')}
						checked={enableLightbox}
						onChange={() =>
							setAttributes({ enableLightbox: !enableLightbox })
						}
					/>
					<SelectControl
						label={__(
							'Image Hover Effect',
							'jankx'
						)}
						value={imageHoverEffect}
						options={[
							{
								label: __('None', 'jankx'),
								value: 'none',
							},
							{
								label: __('Zoom In', 'jankx'),
								value: 'zoom__in',
							},
							{
								label: __('Zoom Out', 'jankx'),
								value: 'zoom__out',
							},
							{
								label: __('GrayScale', 'jankx'),
								value: 'gray__scale',
							},
						]}
						onChange={(effect) => {
							setAttributes({ imageHoverEffect: effect });
						}}
					/>
				</PanelBody>
			</InspectorControls>
			{images && (
				<BlockControls>
					<ToolbarGroup>
						<MediaUploadCheck>
							<MediaUpload
								multiple={true}
								onSelect={(media) =>
									setAttributes({
										images: media,
									})
								}
								gallery={true}
								allowedTypes={['image']}
								value={images.map((image) => image.id)}
								render={({ open }) => {
									return (
										<ToolbarButton
											label={__(
												'Edit Images',
												'jankx'
											)}
											onClick={open}
											icon="edit"
										/>
									);
								}}
							/>
						</MediaUploadCheck>
					</ToolbarGroup>
				</BlockControls>
			)}
			<div
				{...blockProps}
			>
				{images ? (
					images.map((image) => {
						return (
							<div
								key={image.id}
								className={`single-gallery-image ${imageHoverEffect} dg__${deskGap} tg__${tabGap} pg__${phoneGap}`}
							>
								<img
									src={image.url}
									alt={
										image.alt
											? image.alt
											: __(
													'Gallery Image',
													'jankx'
											  )
									}
									className={`wp-image${image.id}`}
								/>
							</div>
						);
					})
				) : (
					<MediaPlaceholder
						multiple={true}
						onSelect={(media) =>
							setAttributes({
								images: media,
							})
						}
						onFilesPreUpload={(media) =>
							setAttributes({
								images: media,
							})
						}
						onSelectURL={false}
						allowedTypes={['image']}
						labels={{
							title: __(
								'Add Gallery Images',
								'jankx'
							),
						}}
					/>
				)}
			</div>
		</Fragment>
	);
}
