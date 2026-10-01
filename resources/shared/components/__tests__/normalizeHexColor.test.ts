/**
 * @jest-environment node
 */
import { normalizeHexColor } from '../normalizeHexColor';

describe('normalizeHexColor', () => {
    it('passes a 6 digit hex straight through', () => {
        expect(normalizeHexColor('#1a2b3c', '#ffffff')).toBe('#1a2b3c');
        expect(normalizeHexColor('#1A2B3C', '#ffffff')).toBe('#1a2b3c');
    });

    it('expands a 3 digit hex', () => {
        expect(normalizeHexColor('#abc', '#ffffff')).toBe('#aabbcc');
    });

    it('strips alpha from 4 and 8 digit hex instead of resetting to black', () => {
        // These used to fall through to the fallback, which made the swatch
        // read as #000000 rather than the colour the author picked.
        expect(normalizeHexColor('#abcd', '#ffffff')).toBe('#aabbcc');
        expect(normalizeHexColor('#1a2b3c80', '#ffffff')).toBe('#1a2b3c');
        expect(normalizeHexColor('#00000000', '#ffffff')).toBe('#000000');
    });

    it('converts rgb() and rgba() ignoring the alpha channel', () => {
        expect(normalizeHexColor('rgb(26, 43, 60)', '#ffffff')).toBe('#1a2b3c');
        expect(normalizeHexColor('rgba(255, 0, 0, 0.5)', '#ffffff')).toBe('#ff0000');
        expect(normalizeHexColor('rgb(26 43 60)', '#ffffff')).toBe('#1a2b3c');
    });

    it('clamps out of range channels', () => {
        expect(normalizeHexColor('rgb(300, -20, 60)', '#ffffff')).toBe('#ff003c');
    });

    it('falls back for anything it cannot parse', () => {
        expect(normalizeHexColor('var(--brand)', '#ffffff')).toBe('#ffffff');
        expect(normalizeHexColor('not-a-color', '#000000')).toBe('#000000');
        expect(normalizeHexColor('', '#abcdef')).toBe('#abcdef');
        expect(normalizeHexColor(undefined, '#abcdef')).toBe('#abcdef');
        expect(normalizeHexColor(null, '#abcdef')).toBe('#abcdef');
    });
});
