
import { JankxInspector } from '../../js/components/jankx-inspector/JankxInspector';
import { ResponsiveControl } from '../../js/components/jankx-inspector/ResponsiveControl';
import { useBlockProps, InnerBlocks, InspectorControls, ColorPalette, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	TextControl,
	TextareaControl,
	Button,
	ButtonGroup,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalNumberControl as NumberControl,
	__experimentalUnitControl as UnitControl,
	__experimentalBorderStylePicker as BorderStylePicker,
	Tooltip,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

const TAG_OPTIONS = [
	{ label: 'div', value: 'div' },
	{ label: 'section', value: 'section' },
	{ label: 'article', value: 'article' },
	{ label: 'aside', value: 'aside' },
	{ label: 'main', value: 'main' },
	{ label: 'header', value: 'header' },
	{ label: 'footer', value: 'footer' },
	{ label: 'figure', value: 'figure' },
];

const FONT_SIZE_OPTIONS = [
	{ label: 'Small', value: 'small' },
	{ label: 'Medium', value: 'medium' },
	{ label: 'Large', value: 'large' },
	{ label: 'X-Large', value: 'x-large' },
	{ label: 'XX-Large', value: 'xx-large' },
];

const FONT_WEIGHT_OPTIONS = [
	{ label: 'Default', value: '' },
	{ label: 'Light (300)', value: '300' },
	{ label: 'Regular (400)', value: '400' },
	{ label: 'Medium (500)', value: '500' },
	{ label: 'Semi-Bold (600)', value: '600' },
	{ label: 'Bold (700)', value: '700' },
	{ label: 'Extra-Bold (800)', value: '800' },
	{ label: 'Black (900)', value: '900' },
];

const BORDER_STYLE_OPTIONS = [
	{ label: 'None', value: 'none' },
	{ label: 'Solid', value: 'solid' },
	{ label: 'Dashed', value: 'dashed' },
	{ label: 'Dotted', value: 'dotted' },
	{ label: 'Double', value: 'double' },
	{ label: 'Groove', value: 'groove' },
	{ label: 'Ridge', value: 'ridge' },
];

const OVERFLOW_OPTIONS = [
	{ label: 'Default', value: '' },
	{ label: 'Hidden', value: 'hidden' },
	{ label: 'Scroll', value: 'scroll' },
	{ label: 'Auto', value: 'auto' },
	{ label: 'Visible', value: 'visible' },
];

const POSITION_OPTIONS = [
	{ label: 'Default', value: '' },
	{ label: 'Relative', value: 'relative' },
	{ label: 'Absolute', value: 'absolute' },
	{ label: 'Fixed', value: 'fixed' },
	{ label: 'Sticky', value: 'sticky' },
];

function buildInlineStyles(attrs: any): Record<string, string> {
	const styles: Record<string, string> = {};

	// Background
	if (attrs.customBackgroundColor) {
		styles.backgroundColor = attrs.customBackgroundColor;
	}

	// Text color
	if (attrs.customTextColor) {
		styles.color = attrs.customTextColor;
	}

	// Gradient
	if (attrs.customGradient) {
		styles.background = attrs.customGradient;
	} else if (attrs.gradient) {
		styles.background = `var(--wp--preset--gradient--${attrs.gradient})`;
	}

	// Font size
	if (attrs.customFontSize) {
		styles.fontSize = `${attrs.customFontSize}px`;
	}

	// Font family
	if (attrs.customFontFamily) {
		styles.fontFamily = attrs.customFontFamily;
	}

	// Font weight
	if (attrs.fontWeight) {
		styles.fontWeight = attrs.fontWeight;
	}

	// Line height
	if (attrs.lineHeight) {
		styles.lineHeight = attrs.lineHeight;
	}

	// Letter spacing
	if (attrs.letterSpacing) {
		styles.letterSpacing = attrs.letterSpacing;
	}

	// Text transform
	if (attrs.textTransform) {
		styles.textTransform = attrs.textTransform;
	}

	// Text decoration
	if (attrs.textDecoration) {
		styles.textDecoration = attrs.textDecoration;
	}

	// Border
	if (attrs.customBorderColor) {
		styles.borderColor = attrs.customBorderColor;
	}
	if (attrs.borderWidth) {
		styles.borderWidth = attrs.borderWidth;
	}
	if (attrs.borderStyle && attrs.borderStyle !== 'none') {
		styles.borderStyle = attrs.borderStyle;
	}

	// Border radius (unified or per-corner)
	if (attrs.borderRadius) {
		styles.borderRadius = attrs.borderRadius;
	} else {
		const corners = [
			['borderRadiusTopLeft', 'topLeft'],
			['borderRadiusTopRight', 'topRight'],
			['borderRadiusBottomLeft', 'bottomLeft'],
			['borderRadiusBottomRight', 'bottomRight'],
		];
		const radiusParts: string[] = [];
		let hasRadius = false;
		for (const [attr, _corner] of corners) {
			if (attrs[attr]) {
				radiusParts.push(attrs[attr]);
				hasRadius = true;
			} else {
				radiusParts.push('0');
			}
		}
		if (hasRadius) {
			styles.borderRadius = radiusParts.join(' ');
		}
	}

	// Min height
	if (attrs.minHeight) {
		styles.minHeight = attrs.minHeight;
	}

	// Overflow
	if (attrs.overflow) {
		styles.overflow = attrs.overflow;
	}

	// Position
	if (attrs.position) {
		styles.position = attrs.position;
	}

	// Z-index
	if (attrs.zIndex !== undefined && attrs.zIndex !== '') {
		styles.zIndex = `${attrs.zIndex}`;
	}

	return styles;
}

function buildBlockClasses(attrs: any): string[] {
	const classes: string[] = ['has-jankx-responsive-wrapper'];

	// Responsive visibility
	if (attrs.hideOnUltrawide) classes.push('hide-on-ultrawide');
	if (attrs.hideOnDesktop) classes.push('hide-on-desktop');
	if (attrs.hideOnTablet) classes.push('hide-on-tablet');
	if (attrs.hideOnMobile) classes.push('hide-on-mobile');

	// Color classes (theme preset)
	if (attrs.backgroundColor) classes.push(`has-${attrs.backgroundColor}-background-color`);
	if (attrs.textColor) classes.push(`has-${attrs.textColor}-color`);
	if (attrs.gradient) classes.push(`has-${attrs.gradient}-gradient-background`);

	// Font size class
	if (attrs.fontSize) classes.push(`has-${attrs.fontSize}-font-size`);

	return classes;
}

function buildWrapperInlineStyles(attrs: any): Record<string, string> {
	const styles: Record<string, string> = {};

	// CSS custom properties for responsive padding/margin
	if (attrs.paddingUltrawide) styles['--jankx-padding-ultrawide'] = `${attrs.paddingUltrawide}px`;
	if (attrs.paddingDesktop) styles['--jankx-padding-desktop'] = `${attrs.paddingDesktop}px`;
	if (attrs.paddingTablet) styles['--jankx-padding-tablet'] = `${attrs.paddingTablet}px`;
	if (attrs.paddingMobile) styles['--jankx-padding-mobile'] = `${attrs.paddingMobile}px`;
	if (attrs.marginUltrawide) styles['--jankx-margin-ultrawide'] = `${attrs.marginUltrawide}px`;
	if (attrs.marginDesktop) styles['--jankx-margin-desktop'] = `${attrs.marginDesktop}px`;
	if (attrs.marginTablet) styles['--jankx-margin-tablet'] = `${attrs.marginTablet}px`;
	if (attrs.marginMobile) styles['--jankx-margin-mobile'] = `${attrs.marginMobile}px`;
	if (attrs.maxWidth) styles['--jankx-max-width'] = attrs.maxWidth;
	if (attrs.maxWidth) styles.maxWidth = attrs.maxWidth;

	return styles;
}

export default function Edit({ attributes, setAttributes }: any) {
	const blockProps = useBlockProps({
		className: buildBlockClasses(attributes).join(' '),
		style: {
			...buildWrapperInlineStyles(attributes),
			...buildInlineStyles(attributes),
		} as any,
	});

	return (
		<div {...blockProps}>
			<InspectorControls>
				<JankxInspector
					tabs={[
						{ name: 'general', title: 'Layout' },
						{ name: 'style', title: 'Style' },
						{ name: 'responsive', title: 'Responsive' },
						{ name: 'advanced', title: 'Advanced' },
					]}
				>
					{(tab) => {
						if (tab.name === 'general') {
							return (
								<PanelBody title={__('Layout', 'jankx')} initialOpen={true}>
									<SelectControl
										label={__('HTML Tag', 'jankx')}
										value={attributes.tagName}
										options={TAG_OPTIONS}
										onChange={(tagName) => setAttributes({ tagName })}
									/>
									<TextControl
										label={__('Max Width', 'jankx')}
										value={attributes.maxWidth || ''}
										placeholder="e.g. 1200px, 80rem, 100%"
										help={__('Set the max-width of this wrapper. Leave empty for no restriction.', 'jankx')}
										onChange={(maxWidth) => setAttributes({ maxWidth: maxWidth || undefined })}
									/>
								</PanelBody>
							);
						}

						if (tab.name === 'style') {
							return (
								<>
									{/* Colors */}
									<PanelBody title={__('Color', 'jankx')} initialOpen={true}>
										<div style={{ marginBottom: '12px' }}>
											<label className="components-base-control__label" style={{ display: 'block', marginBottom: '6px' }}>
												{__('Background Color', 'jankx')}
											</label>
											<ColorPalette
												value={attributes.customBackgroundColor || ''}
												onChange={(color) => setAttributes({ customBackgroundColor: color || undefined })}
												disableCustomColors={false}
											/>
										</div>

										<div style={{ marginBottom: '12px' }}>
											<label className="components-base-control__label" style={{ display: 'block', marginBottom: '6px' }}>
												{__('Text Color', 'jankx')}
											</label>
											<ColorPalette
												value={attributes.customTextColor || ''}
												onChange={(color) => setAttributes({ customTextColor: color || undefined })}
												disableCustomColors={false}
											/>
										</div>

										<div style={{ marginBottom: '12px' }}>
											<label className="components-base-control__label" style={{ display: 'block', marginBottom: '6px' }}>
												{__('Gradient', 'jankx')}
											</label>
											<ColorPalette
												value={attributes.customGradient || ''}
												onChange={(gradient) => setAttributes({ customGradient: gradient || undefined })}
												disableCustomColors={false}
												clearable
											/>
										</div>
									</PanelBody>

									{/* Typography */}
									<PanelBody title={__('Typography', 'jankx')} initialOpen={false}>
										<SelectControl
											label={__('Font Size', 'jankx')}
											value={attributes.fontSize || ''}
											options={[{ label: 'Default', value: '' }, ...FONT_SIZE_OPTIONS]}
											onChange={(fontSize) => setAttributes({ fontSize: fontSize || undefined })}
										/>
										{!attributes.fontSize && (
											<NumberControl
												label={__('Custom Font Size (px)', 'jankx')}
												value={attributes.customFontSize ?? ''}
												min={8}
												max={100}
												onChange={(val) => setAttributes({ customFontSize: val !== '' ? Number(val) : undefined })}
											/>
										)}
										<TextControl
											label={__('Font Family', 'jankx')}
											value={attributes.customFontFamily || ''}
											placeholder="e.g. Inter, sans-serif"
											onChange={(val) => setAttributes({ customFontFamily: val || undefined })}
										/>
										<SelectControl
											label={__('Font Weight', 'jankx')}
											value={attributes.fontWeight || ''}
											options={FONT_WEIGHT_OPTIONS}
											onChange={(val) => setAttributes({ fontWeight: val || undefined })}
										/>
										<TextControl
											label={__('Line Height', 'jankx')}
											value={attributes.lineHeight || ''}
											placeholder="e.g. 1.5, 24px"
											onChange={(val) => setAttributes({ lineHeight: val || undefined })}
										/>
										<TextControl
											label={__('Letter Spacing', 'jankx')}
											value={attributes.letterSpacing || ''}
											placeholder="e.g. 0.05em, 1px"
											onChange={(val) => setAttributes({ letterSpacing: val || undefined })}
										/>
										<SelectControl
											label={__('Text Transform', 'jankx')}
											value={attributes.textTransform || ''}
											options={[
												{ label: 'None', value: '' },
												{ label: 'Uppercase', value: 'uppercase' },
												{ label: 'Lowercase', value: 'lowercase' },
												{ label: 'Capitalize', value: 'capitalize' },
											]}
											onChange={(val) => setAttributes({ textTransform: val || undefined })}
										/>
										<SelectControl
											label={__('Text Decoration', 'jankx')}
											value={attributes.textDecoration || ''}
											options={[
												{ label: 'None', value: '' },
												{ label: 'Underline', value: 'underline' },
												{ label: 'Overline', value: 'overline' },
												{ label: 'Line Through', value: 'line-through' },
											]}
											onChange={(val) => setAttributes({ textDecoration: val || undefined })}
										/>
									</PanelBody>

									{/* Border */}
									<PanelBody title={__('Border', 'jankx')} initialOpen={false}>
										<div style={{ marginBottom: '12px' }}>
											<label className="components-base-control__label" style={{ display: 'block', marginBottom: '6px' }}>
												{__('Border Color', 'jankx')}
											</label>
											<ColorPalette
												value={attributes.customBorderColor || ''}
												onChange={(color) => setAttributes({ customBorderColor: color || undefined })}
												disableCustomColors={false}
											/>
										</div>

										<SelectControl
											label={__('Border Style', 'jankx')}
											value={attributes.borderStyle || 'solid'}
											options={BORDER_STYLE_OPTIONS}
											onChange={(val) => setAttributes({ borderStyle: val || 'solid' })}
										/>

										{(attributes.borderStyle && attributes.borderStyle !== 'none') && (
											<>
												<TextControl
													label={__('Border Width', 'jankx')}
													value={attributes.borderWidth || ''}
													placeholder="e.g. 1px"
													onChange={(val) => setAttributes({ borderWidth: val || undefined })}
												/>
												<TextControl
													label={__('Border Radius', 'jankx')}
													value={attributes.borderRadius || ''}
													placeholder="e.g. 8px, 50%"
													help={__('Leave empty to set per-corner radius below.', 'jankx')}
													onChange={(val) => setAttributes({ borderRadius: val || undefined })}
												/>
												{!attributes.borderRadius && (
													<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
														<TextControl
															label={__('Top Left', 'jankx')}
															value={attributes.borderRadiusTopLeft || ''}
															placeholder="0px"
															onChange={(val) => setAttributes({ borderRadiusTopLeft: val || undefined })}
														/>
														<TextControl
															label={__('Top Right', 'jankx')}
															value={attributes.borderRadiusTopRight || ''}
															placeholder="0px"
															onChange={(val) => setAttributes({ borderRadiusTopRight: val || undefined })}
														/>
														<TextControl
															label={__('Bottom Left', 'jankx')}
															value={attributes.borderRadiusBottomLeft || ''}
															placeholder="0px"
															onChange={(val) => setAttributes({ borderRadiusBottomLeft: val || undefined })}
														/>
														<TextControl
															label={__('Bottom Right', 'jankx')}
															value={attributes.borderRadiusBottomRight || ''}
															placeholder="0px"
															onChange={(val) => setAttributes({ borderRadiusBottomRight: val || undefined })}
														/>
													</div>
												)}
											</>
										)}
									</PanelBody>
								</>
							);
						}

						if (tab.name === 'responsive') {
							return (
								<>
									<PanelBody title={__('Padding', 'jankx')} initialOpen={true}>
										<ResponsiveControl label={__('Inner Space', 'jankx')}>
											{(device) => (
												<RangeControl
													value={device === 'ultrawide' ? attributes.paddingUltrawide : device === 'desktop' ? attributes.paddingDesktop : device === 'tablet' ? attributes.paddingTablet : attributes.paddingMobile}
													onChange={(val) => {
														const key = device === 'ultrawide' ? 'paddingUltrawide' : device === 'desktop' ? 'paddingDesktop' : device === 'tablet' ? 'paddingTablet' : 'paddingMobile';
														setAttributes({ [key]: val });
													}}
													min={0}
													max={200}
												/>
											)}
										</ResponsiveControl>
									</PanelBody>
									<PanelBody title={__('Margin', 'jankx')} initialOpen={false}>
										<ResponsiveControl label={__('Outer Space', 'jankx')}>
											{(device) => (
												<RangeControl
													value={device === 'ultrawide' ? attributes.marginUltrawide : device === 'desktop' ? attributes.marginDesktop : device === 'tablet' ? attributes.marginTablet : attributes.marginMobile}
													onChange={(val) => {
														const key = device === 'ultrawide' ? 'marginUltrawide' : device === 'desktop' ? 'marginDesktop' : device === 'tablet' ? 'marginTablet' : 'marginMobile';
														setAttributes({ [key]: val });
													}}
													min={0}
													max={200}
												/>
											)}
										</ResponsiveControl>
									</PanelBody>
									<PanelBody title={__('Visibility', 'jankx')} initialOpen={false}>
										<ToggleControl
											label={__('Hide on Ultrawide', 'jankx')}
											checked={attributes.hideOnUltrawide}
											onChange={(hideOnUltrawide) => setAttributes({ hideOnUltrawide })}
										/>
										<ToggleControl
											label={__('Hide on Desktop', 'jankx')}
											checked={attributes.hideOnDesktop}
											onChange={(hideOnDesktop) => setAttributes({ hideOnDesktop })}
										/>
										<ToggleControl
											label={__('Hide on Tablet', 'jankx')}
											checked={attributes.hideOnTablet}
											onChange={(hideOnTablet) => setAttributes({ hideOnTablet })}
										/>
										<ToggleControl
											label={__('Hide on Mobile', 'jankx')}
											checked={attributes.hideOnMobile}
											onChange={(hideOnMobile) => setAttributes({ hideOnMobile })}
										/>
									</PanelBody>
								</>
							);
						}

						if (tab.name === 'advanced') {
							return (
								<>
									<PanelBody title={__('Position', 'jankx')} initialOpen={true}>
										<SelectControl
											label={__('Position', 'jankx')}
											value={attributes.position || ''}
											options={POSITION_OPTIONS}
											onChange={(val) => setAttributes({ position: val || undefined })}
										/>
										{(attributes.position === 'relative' || attributes.position === 'absolute' || attributes.position === 'fixed' || attributes.position === 'sticky') && (
											<NumberControl
												label={__('Z-Index', 'jankx')}
												value={attributes.zIndex ?? ''}
												onChange={(val) => setAttributes({ zIndex: val !== '' ? Number(val) : undefined })}
											/>
										)}
									</PanelBody>
									<PanelBody title={__('Overflow', 'jankx')} initialOpen={false}>
										<SelectControl
											label={__('Overflow', 'jankx')}
											value={attributes.overflow || ''}
											options={OVERFLOW_OPTIONS}
											onChange={(val) => setAttributes({ overflow: val || undefined })}
										/>
									</PanelBody>
									<PanelBody title={__('Utilities', 'jankx')} initialOpen={false}>
										<SelectControl
											label={__('Render Mode', 'jankx')}
											value={attributes.renderMode}
											options={[
												{ label: 'Dynamic (SSR)', value: 'dynamic' },
												{ label: 'Static (CSR)', value: 'static' },
											]}
											onChange={(renderMode) => setAttributes({ renderMode })}
											help={__('Choose how this block should be rendered.', 'jankx')}
										/>
									</PanelBody>
								</>
							);
						}

						return null;
					}}
				</JankxInspector>
			</InspectorControls>
			<InnerBlocks
				__experimentalLayout={{
					type: 'constrained',
					contentSize: attributes.maxWidth || undefined,
				}}
			/>
		</div>
	);
}
