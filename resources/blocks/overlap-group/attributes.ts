export type PositionType = 'static' | 'relative' | 'absolute';

export type OffsetUnit = 'px' | '%' | 'rem' | 'vw' | 'vh';

export type OverlapGroupAttributes = {
	tagName?: string;
	templateLock?: string | boolean;
	positionType?: PositionType;
	top?: number;
	right?: number;
	bottom?: number;
	left?: number;
	offsetUnit?: OffsetUnit;
	zIndex?: number;
	width?: string;
	maxWidth?: string;
	pullUp?: number;
};

export const OFFSET_SIDES = ['top', 'right', 'bottom', 'left'] as const;

export type OffsetSide = (typeof OFFSET_SIDES)[number];

export const OFFSET_UNITS: OffsetUnit[] = ['px', '%', 'rem', 'vw', 'vh'];

type StyleObject = Record<string, string | number | undefined>;

export function buildInlineStyle(attributes: OverlapGroupAttributes): StyleObject {
	const style: StyleObject = {};

	const { positionType = 'relative', offsetUnit = 'px' } = attributes;

	if (positionType !== 'static') {
		style.position = positionType;
	}

	for (const side of OFFSET_SIDES) {
		const value = attributes[side];
		if (value !== undefined && value !== null && value !== '') {
			style[side] = `${value}${offsetUnit}`;
		}
	}

	if (attributes.zIndex !== undefined && attributes.zIndex !== null && attributes.zIndex !== '') {
		style.zIndex = attributes.zIndex;
	}

	if (attributes.width) {
		style.width = attributes.width;
	}

	if (attributes.maxWidth) {
		style.maxWidth = attributes.maxWidth;
	}

	if (attributes.pullUp) {
		style.marginTop = `-${attributes.pullUp}px`;
	}

	return style;
}

export function buildClassName(attributes: OverlapGroupAttributes): string {
	const classes = ['jankx-overlap-group'];

	const positionType = attributes.positionType || 'relative';
	if (positionType !== 'static') {
		classes.push(`jankx-overlap-group--${positionType}`);
	}

	return classes.join(' ');
}
