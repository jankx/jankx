/**
 * Helper functions to render preset CSS in editor
 * These should match the PHP renderCSS methods
 */

import { ImageBoxPreset, PresetOptionValue } from './types';

/**
 * Render CSS for bordered-frame preset
 */
export function renderBorderedFrameCSS(
	preset: ImageBoxPreset,
	options: PresetOptionValue
): string {
	const borderWidth = Number(options.borderWidth ?? 4);
	const borderColor = String(options.borderColor ?? '#ffffff');
	const borderOffset = Number(options.borderOffset ?? 20);
	const titleFullWidth = Boolean(options.titleFullWidth ?? false);
	const titlePosition = String(options.titlePosition ?? 'bottom-center');
	const titleBackground = String(options.titleBackground ?? 'rgba(0, 0, 0, 0.8)');
	const titleColor = String(options.titleColor ?? '#ffffff');
	const titleMarginTop = Number(options.titleMarginTop ?? 0);
	const titleMarginRight = Number(options.titleMarginRight ?? 0);
	const titleMarginBottom = Number(options.titleMarginBottom ?? 0);
	const titleMarginLeft = Number(options.titleMarginLeft ?? 0);
	const titleWidth = Number(options.titleWidth ?? 0);
	const titleMinWidth = Number(options.titleMinWidth ?? 0);

	let titlePositionCSS = '';
	if (titleFullWidth) {
		// Full width/height based on position
		if (titlePosition.startsWith('top')) {
			titlePositionCSS = `top: 0; left: 0; right: 0; width: 100%;`;
		} else if (titlePosition.startsWith('bottom')) {
			titlePositionCSS = `bottom: 0; left: 0; right: 0; width: 100%;`;
		} else if (titlePosition.startsWith('left')) {
			titlePositionCSS = `top: 0; left: 0; bottom: 0; height: 100%;`;
		} else if (titlePosition.startsWith('right')) {
			titlePositionCSS = `top: 0; right: 0; bottom: 0; height: 100%;`;
		}
	} else {
		// 2D positioning
		switch (titlePosition) {
			case 'top-left':
				titlePositionCSS = `top: 0; left: 0;`;
				break;
			case 'top-center':
				titlePositionCSS = `top: 0; left: 50%; transform: translateX(-50%);`;
				break;
			case 'top-right':
				titlePositionCSS = `top: 0; right: 0;`;
				break;
			case 'bottom-left':
				titlePositionCSS = `bottom: 0; left: 0;`;
				break;
			case 'bottom-center':
				titlePositionCSS = `bottom: 0; left: 50%; transform: translateX(-50%);`;
				break;
			case 'bottom-right':
				titlePositionCSS = `bottom: 0; right: 0;`;
				break;
			case 'left-top':
				titlePositionCSS = `top: 0; left: 0;`;
				break;
			case 'left-center':
				titlePositionCSS = `top: 50%; left: 0; transform: translateY(-50%);`;
				break;
			case 'left-bottom':
				titlePositionCSS = `bottom: 0; left: 0;`;
				break;
			case 'right-top':
				titlePositionCSS = `top: 0; right: 0;`;
				break;
			case 'right-center':
				titlePositionCSS = `top: 50%; right: 0; transform: translateY(-50%);`;
				break;
			case 'right-bottom':
				titlePositionCSS = `bottom: 0; right: 0;`;
				break;
			case 'center':
				titlePositionCSS = `top: 50%; left: 50%; transform: translate(-50%, -50%);`;
				break;
			default:
				titlePositionCSS = `bottom: 0; left: 50%; transform: translateX(-50%);`;
		}
	}

	return `
.wp-block-jankx-advanced-image-box.preset-bordered-frame {
	position: relative;
	display: inline-block;
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame img {
	display: block;
	width: 100%;
	height: auto;
	transition: all 0.3s ease;
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__frame-wrapper {
	position: absolute;
	top: ${borderOffset}px;
	left: ${borderOffset}px;
	right: ${borderOffset}px;
	bottom: ${borderOffset}px;
	pointer-events: none;
	z-index: 1;
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__frame {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	border: ${borderWidth}px solid ${borderColor};
	pointer-events: none;
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box {
	position: absolute;
	background: ${titleBackground};
	color: ${titleColor};
	padding: 12px 20px;
	z-index: 2;
	pointer-events: none;
	margin-top: ${titleMarginTop}px;
	margin-right: ${titleMarginRight}px;
	margin-bottom: ${titleMarginBottom}px;
	margin-left: ${titleMarginLeft}px;
	box-sizing: border-box;
	max-width: 100%;
	${titleWidth > 0 ? `width: ${titleWidth}px;` : ''}
	${titleMinWidth > 0 ? `min-width: ${titleMinWidth}px;` : ''}
	${titlePositionCSS}
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box h3,
.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box .wp-block-heading {
	margin: 0;
	color: ${titleColor};
	font-size: 1.2em;
	font-weight: 600;
}

/* Ensure hover effects work with preset */
.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-zoom {
	transform: scale(1.05);
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-fade {
	opacity: 0.8;
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-blur {
	filter: blur(2px);
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-grayscale {
	filter: grayscale(100%);
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-sepia {
	filter: sepia(100%);
}

.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-brightness {
	filter: brightness(1.2);
}
`;
}

/**
 * Render CSS for a preset
 */
export function renderPresetCSS(
	preset: ImageBoxPreset,
	options: PresetOptionValue
): string {
	switch (preset.id) {
		case 'bordered-frame':
			return renderBorderedFrameCSS(preset, options);
		default:
			return '';
	}
}

