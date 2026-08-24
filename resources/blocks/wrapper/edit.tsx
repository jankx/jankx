
import { useBlockProps, InnerBlocks, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	TextControl,
	Button,
	ButtonGroup,
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
	if (attrs.customBackgroundColor) styles.backgroundColor = attrs.customBackgroundColor;
	if (attrs.customTextColor) styles.color = attrs.customTextColor;
	if (attrs.customGradient) styles.background = attrs.customGradient;
	else if (attrs.gradient) styles.background = `var(--wp--preset--gradient--${attrs.gradient})`;
	if (attrs.customFontSize) styles.fontSize = `${attrs.customFontSize}px`;
	if (attrs.customFontFamily) styles.fontFamily = attrs.customFontFamily;
	if (attrs.fontWeight) styles.fontWeight = attrs.fontWeight;
	if (attrs.lineHeight) styles.lineHeight = attrs.lineHeight;
	if (attrs.letterSpacing) styles.letterSpacing = attrs.letterSpacing;
	if (attrs.textTransform) styles.textTransform = attrs.textTransform;
	if (attrs.textDecoration) styles.textDecoration = attrs.textDecoration;
	if (attrs.customBorderColor) styles.borderColor = attrs.customBorderColor;
	if (attrs.borderWidth) styles.borderWidth = attrs.borderWidth;
	if (attrs.borderStyle && attrs.borderStyle !== 'none') styles.borderStyle = attrs.borderStyle;
	if (attrs.borderRadius) {
		styles.borderRadius = attrs.borderRadius;
	} else {
		const tl = attrs.borderRadiusTopLeft || '0';
		const tr = attrs.borderRadiusTopRight || '0';
		const bl = attrs.borderRadiusBottomLeft || '0';
		const br = attrs.borderRadiusBottomRight || '0';
		if (attrs.borderRadiusTopLeft || attrs.borderRadiusTopRight || attrs.borderRadiusBottomLeft || attrs.borderRadiusBottomRight) {
			styles.borderRadius = `${tl} ${tr} ${br} ${bl}`;
		}
	}
	if (attrs.minHeight) styles.minHeight = attrs.minHeight;
	if (attrs.overflow) styles.overflow = attrs.overflow;
	if (attrs.position) styles.position = attrs.position;
	if (attrs.zIndex !== undefined && attrs.zIndex !== '') styles.zIndex = `${attrs.zIndex}`;
	return styles;
}

function buildBlockClasses(attrs: any): string[] {
	const classes: string[] = ['has-jankx-responsive-wrapper'];
	if (attrs.hideOnUltrawide) classes.push('hide-on-ultrawide');
	if (attrs.hideOnDesktop) classes.push('hide-on-desktop');
	if (attrs.hideOnTablet) classes.push('hide-on-tablet');
	if (attrs.hideOnMobile) classes.push('hide-on-mobile');
	if (attrs.backgroundColor) classes.push(`has-${attrs.backgroundColor}-background-color`);
	if (attrs.textColor) classes.push(`has-${attrs.textColor}-color`);
	if (attrs.gradient) classes.push(`has-${attrs.gradient}-gradient-background`);
	if (attrs.fontSize) classes.push(`has-${attrs.fontSize}-font-size`);
	return classes;
}

function buildWrapperInlineStyles(attrs: any): Record<string, string> {
	const styles: Record<string, string> = {};
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

const DEVICE_KEYS = {
	ultrawide: 'paddingUltrawide',
	desktop: 'paddingDesktop',
	tablet: 'paddingTablet',
	mobile: 'paddingMobile',
} as const;

const MARGIN_DEVICE_KEYS = {
	ultrawide: 'marginUltrawide',
	desktop: 'marginDesktop',
	tablet: 'marginTablet',
	mobile: 'marginMobile',
} as const;

function DeviceSwitcher({ value, onChange }: { value: string; onChange: (d: string) => void }) {
	const devices = [
		{ name: 'ultrawide', label: 'Ultrawide' },
		{ name: 'desktop', label: 'Desktop' },
		{ name: 'tablet', label: 'Tablet' },
		{ name: 'mobile', label: 'Mobile' },
	];
	return (
		<ButtonGroup style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
			{devices.map((d) => (
				<Tooltip key={d.name} text={d.label}>
					<Button
						size="small"
						variant={value === d.name ? 'primary' : 'secondary'}
						onClick={() => onChange(d.name)}
					>
						{d.name.charAt(0).toUpperCase()}
					</Button>
				</Tooltip>
			))}
		</ButtonGroup>
	);
}

export default function Edit({ attributes, setAttributes }: any) {
	const [paddingDevice, setPaddingDevice] = useState('desktop');
	const [marginDevice, setMarginDevice] = useState('desktop');

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
				{/* Layout */}
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
						onChange={(val) => setAttributes({ maxWidth: val || undefined })}
					/>
				</PanelBody>

				{/* Color */}
				<PanelBody title={__('Color', 'jankx')} initialOpen={false}>
					<div style={{ marginBottom: 12 }}>
						<label className="components-base-control__label" style={{ display: 'block', marginBottom: 6 }}>
							{__('Background Color', 'jankx')}
						</label>
						<ColorPalette
							value={attributes.customBackgroundColor || ''}
							onChange={(color) => setAttributes({ customBackgroundColor: color || undefined })}
						/>
					</div>
					<div style={{ marginBottom: 12 }}>
						<label className="components-base-control__label" style={{ display: 'block', marginBottom: 6 }}>
							{__('Text Color', 'jankx')}
						</label>
						<ColorPalette
							value={attributes.customTextColor || ''}
							onChange={(color) => setAttributes({ customTextColor: color || undefined })}
						/>
					</div>
					<div style={{ marginBottom: 12 }}>
						<label className="components-base-control__label" style={{ display: 'block', marginBottom: 6 }}>
							{__('Gradient', 'jankx')}
						</label>
						<ColorPalette
							value={attributes.customGradient || ''}
							onChange={(gradient) => setAttributes({ customGradient: gradient || undefined })}
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
						<RangeControl
							label={__('Custom Font Size (px)', 'jankx')}
							value={attributes.customFontSize ?? ''}
							min={8}
							max={100}
							onChange={(val) => setAttributes({ customFontSize: val })}
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
					<div style={{ marginBottom: 12 }}>
						<label className="components-base-control__label" style={{ display: 'block', marginBottom: 6 }}>
							{__('Border Color', 'jankx')}
						</label>
						<ColorPalette
							value={attributes.customBorderColor || ''}
							onChange={(color) => setAttributes({ customBorderColor: color || undefined })}
						/>
					</div>
					<SelectControl
						label={__('Border Style', 'jankx')}
						value={attributes.borderStyle || 'solid'}
						options={BORDER_STYLE_OPTIONS}
						onChange={(val) => setAttributes({ borderStyle: val || 'solid' })}
					/>
					{attributes.borderStyle && attributes.borderStyle !== 'none' && (
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
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
									<TextControl label={__('Top Left', 'jankx')} value={attributes.borderRadiusTopLeft || ''} placeholder="0px" onChange={(val) => setAttributes({ borderRadiusTopLeft: val || undefined })} />
									<TextControl label={__('Top Right', 'jankx')} value={attributes.borderRadiusTopRight || ''} placeholder="0px" onChange={(val) => setAttributes({ borderRadiusTopRight: val || undefined })} />
									<TextControl label={__('Bottom Left', 'jankx')} value={attributes.borderRadiusBottomLeft || ''} placeholder="0px" onChange={(val) => setAttributes({ borderRadiusBottomLeft: val || undefined })} />
									<TextControl label={__('Bottom Right', 'jankx')} value={attributes.borderRadiusBottomRight || ''} placeholder="0px" onChange={(val) => setAttributes({ borderRadiusBottomRight: val || undefined })} />
								</div>
							)}
						</>
					)}
				</PanelBody>

				{/* Responsive Padding */}
				<PanelBody title={__('Padding', 'jankx')} initialOpen={false}>
					<DeviceSwitcher value={paddingDevice} onChange={setPaddingDevice} />
					<RangeControl
						value={attributes[DEVICE_KEYS[paddingDevice]] || 0}
						onChange={(val) => setAttributes({ [DEVICE_KEYS[paddingDevice]]: val })}
						min={0}
						max={200}
					/>
				</PanelBody>

				{/* Responsive Margin */}
				<PanelBody title={__('Margin', 'jankx')} initialOpen={false}>
					<DeviceSwitcher value={marginDevice} onChange={setMarginDevice} />
					<RangeControl
						value={attributes[MARGIN_DEVICE_KEYS[marginDevice]] || 0}
						onChange={(val) => setAttributes({ [MARGIN_DEVICE_KEYS[marginDevice]]: val })}
						min={0}
						max={200}
					/>
				</PanelBody>

				{/* Visibility */}
				<PanelBody title={__('Visibility', 'jankx')} initialOpen={false}>
					<ToggleControl label={__('Hide on Ultrawide', 'jankx')} checked={attributes.hideOnUltrawide} onChange={(val) => setAttributes({ hideOnUltrawide: val })} />
					<ToggleControl label={__('Hide on Desktop', 'jankx')} checked={attributes.hideOnDesktop} onChange={(val) => setAttributes({ hideOnDesktop: val })} />
					<ToggleControl label={__('Hide on Tablet', 'jankx')} checked={attributes.hideOnTablet} onChange={(val) => setAttributes({ hideOnTablet: val })} />
					<ToggleControl label={__('Hide on Mobile', 'jankx')} checked={attributes.hideOnMobile} onChange={(val) => setAttributes({ hideOnMobile: val })} />
				</PanelBody>

				{/* Advanced */}
				<PanelBody title={__('Position', 'jankx')} initialOpen={false}>
					<SelectControl
						label={__('Position', 'jankx')}
						value={attributes.position || ''}
						options={POSITION_OPTIONS}
						onChange={(val) => setAttributes({ position: val || undefined })}
					/>
					{attributes.position && attributes.position !== '' && (
						<TextControl
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
						onChange={(val) => setAttributes({ renderMode: val })}
						help={__('Choose how this block should be rendered.', 'jankx')}
					/>
				</PanelBody>
			</InspectorControls>
			<InnerBlocks />
		</div>
	);
}
