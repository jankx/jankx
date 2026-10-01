export const PRESET_IMAGE_RATIOS = ['16/9', '4/3', '21/9', '1/1', '3/4', '2/3', '9/16'] as const;

export type PresetImageRatio = (typeof PRESET_IMAGE_RATIOS)[number];
export type ImageRatioSelectValue = '' | 'custom' | PresetImageRatio;

const RATIO_PATTERN = /^\d{1,4}\s*\/\s*\d{1,4}$/;

/**
 * Normalise an image ratio attribute into a bare `w/h` string, or an empty
 * string when the value is unusable. Attribute values reach save() straight
 * from block markup, so this is also the guard against injecting anything that
 * is not a plain ratio into a custom property.
 */
export const normalizeImageRatio = (value: unknown): string => {
    const raw = typeof value === 'string' ? value.trim() : '';
    if (!raw || !RATIO_PATTERN.test(raw)) {
        return '';
    }

    const [width, height] = raw.split('/').map((part) => parseInt(part.trim(), 10));
    if (!width || !height) {
        return '';
    }

    return `${width}/${height}`;
};

/**
 * Map a stored ratio onto the value the ratio <select> expects. Anything that
 * is not a known preset becomes `custom` so the free-text field takes over.
 */
export const resolveImageRatioSelectValue = (value: unknown): ImageRatioSelectValue => {
    const ratio = normalizeImageRatio(value);
    if (ratio === '') {
        return '';
    }

    if ((PRESET_IMAGE_RATIOS as readonly string[]).includes(ratio)) {
        return ratio as PresetImageRatio;
    }

    return 'custom';
};
