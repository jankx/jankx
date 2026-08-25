
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
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

function buildBlockClasses(attrs: any): string[] {
	const classes: string[] = ['has-jankx-responsive-wrapper'];
	if (attrs.hideOnUltrawide) classes.push('hide-on-ultrawide');
	if (attrs.hideOnDesktop) classes.push('hide-on-desktop');
	if (attrs.hideOnTablet) classes.push('hide-on-tablet');
	if (attrs.hideOnMobile) classes.push('hide-on-mobile');
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
		style: buildWrapperInlineStyles(attributes) as any,
	});

	return (
		<div {...blockProps}>
			{/* Default Settings Sidebar */}
			<InspectorControls>
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

				<PanelBody title={__('Padding', 'jankx')} initialOpen={false}>
					<DeviceSwitcher value={paddingDevice} onChange={setPaddingDevice} />
					<RangeControl
						value={attributes[DEVICE_KEYS[paddingDevice]] || 0}
						onChange={(val) => setAttributes({ [DEVICE_KEYS[paddingDevice]]: val })}
						min={0}
						max={200}
					/>
				</PanelBody>

				<PanelBody title={__('Margin', 'jankx')} initialOpen={false}>
					<DeviceSwitcher value={marginDevice} onChange={setMarginDevice} />
					<RangeControl
						value={attributes[MARGIN_DEVICE_KEYS[marginDevice]] || 0}
						onChange={(val) => setAttributes({ [MARGIN_DEVICE_KEYS[marginDevice]]: val })}
						min={0}
						max={200}
					/>
				</PanelBody>

				<PanelBody title={__('Visibility', 'jankx')} initialOpen={false}>
					<ToggleControl label={__('Hide on Ultrawide', 'jankx')} checked={attributes.hideOnUltrawide} onChange={(val) => setAttributes({ hideOnUltrawide: val })} />
					<ToggleControl label={__('Hide on Desktop', 'jankx')} checked={attributes.hideOnDesktop} onChange={(val) => setAttributes({ hideOnDesktop: val })} />
					<ToggleControl label={__('Hide on Tablet', 'jankx')} checked={attributes.hideOnTablet} onChange={(val) => setAttributes({ hideOnTablet: val })} />
					<ToggleControl label={__('Hide on Mobile', 'jankx')} checked={attributes.hideOnMobile} onChange={(val) => setAttributes({ hideOnMobile: val })} />
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
