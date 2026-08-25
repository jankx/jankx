
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

function buildSaveClasses(attrs: any): string {
	const classes: string[] = ['has-jankx-responsive-wrapper'];

	if (attrs.hideOnUltrawide) classes.push('hide-on-ultrawide');
	if (attrs.hideOnDesktop) classes.push('hide-on-desktop');
	if (attrs.hideOnTablet) classes.push('hide-on-tablet');
	if (attrs.hideOnMobile) classes.push('hide-on-mobile');

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
