/**
 * @jest-environment node
 */
import {
    PRESET_IMAGE_RATIOS,
    normalizeImageRatio,
    resolveImageRatioSelectValue,
} from '../imageRatio';

describe('imageRatio', () => {
    describe('normalizeImageRatio', () => {
        it('keeps a valid ratio', () => {
            expect(normalizeImageRatio('16/9')).toBe('16/9');
            expect(normalizeImageRatio(' 4/3 ')).toBe('4/3');
            expect(normalizeImageRatio('3 / 4')).toBe('3/4');
        });

        it('rejects anything that is not a plain ratio', () => {
            // Guards against the value reaching a custom property verbatim.
            expect(normalizeImageRatio('16/9; background:url(x)')).toBe('');
            expect(normalizeImageRatio('red')).toBe('');
            expect(normalizeImageRatio('16/0')).toBe('');
            expect(normalizeImageRatio('0/9')).toBe('');
            expect(normalizeImageRatio('auto')).toBe('');
            expect(normalizeImageRatio('')).toBe('');
            expect(normalizeImageRatio(null)).toBe('');
            expect(normalizeImageRatio(16)).toBe('');
        });
    });

    describe('resolveImageRatioSelectValue', () => {
        it('maps every offered preset to itself', () => {
            // Regression: 3/2 was offered in the <select> but missing from
            // PRESET_IMAGE_RATIOS, so it was classified as custom and the
            // select showed nothing selected.
            PRESET_IMAGE_RATIOS.forEach((ratio) => {
                expect(resolveImageRatioSelectValue(ratio)).toBe(ratio);
            });
            expect(resolveImageRatioSelectValue('3/2')).toBe('3/2');
        });

        it('falls back to custom for a valid but unoffered ratio', () => {
            expect(resolveImageRatioSelectValue('7/3')).toBe('custom');
        });

        it('returns empty for unset or invalid values', () => {
            expect(resolveImageRatioSelectValue('')).toBe('');
            expect(resolveImageRatioSelectValue(undefined)).toBe('');
            expect(resolveImageRatioSelectValue('nope')).toBe('');
        });
    });
});
