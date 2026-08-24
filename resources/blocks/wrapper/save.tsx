
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

function buildSaveClasses(attrs: any): string {
	const classes: string[] = ['has-jankx-responsive-wrapper'];

	if (attrs.hideOnUltrawide) classes.push('hide-on-ultrawide');
	if (attrs.hideOnDesktop) classes.push('hide-on-desktop');
	if (attrs.hideOnTablet) classes.push('hide-on-tablet');
	if (attrs.hideOnMobile) classes.push('hide-on-mobile');
	if (attrs.backgroundColor) classes.push(`has-${attrs.backgroundColor}-background-color`);
	if (attrs.textColor) classes.push(`has-${attrs.textColor}-color`);
	if (attrs.gradient) classes.push(`has-${attrs.gradient}-gradient-background`);
	if (attrs.fontSize) classes.push(`has-${attrs.fontSize}-font-size`);

	return classes.filter(Boolean).join(' ');
}

function buildSaveStyles(attrs: any): Record<string, string> {
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

	// Background color
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

	// Border radius
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

export default function save({ attributes }: any) {
	const Tag = attributes.tagName || 'div';
	const blockProps = useBlockProps.save({
		className: buildSaveClasses(attributes),
		style: buildSaveStyles(attributes) as any,
	});

	return (
		<Tag {...blockProps}>
			<InnerBlocks.Content />
		</Tag>
	);
}
