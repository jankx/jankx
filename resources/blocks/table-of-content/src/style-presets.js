/**
 * Style Presets Configuration for Table of Contents Block
 *
 * This file contains all available style presets and their configurations.
 * To add a new style preset:
 * 1. Add the preset object to the STYLE_PRESETS array
 * 2. Add the corresponding CSS in style.css
 * 3. The preset will automatically appear in the editor dropdown
 */

export const STYLE_PRESETS = [
    {
        value: 'default',
        label: 'Disc Markers',
        description: 'Standard disc, circle, and square markers',
        preview: {
            backgroundColor: 'transparent',
            textColor: 'inherit',
            borderColor: 'transparent'
        }
    },
    {
        value: 'boxed',
        label: 'Numbered Markers',
        description: 'Numbered list with decimal, alpha, and roman markers',
        preview: {
            backgroundColor: '#f8f9fa',
            textColor: '#333',
            borderColor: '#e9ecef'
        }
    },
    {
        value: 'minimal',
        label: 'No Markers',
        description: 'Clean list without any markers',
        preview: {
            backgroundColor: 'transparent',
            textColor: '#6c757d',
            borderColor: 'transparent'
        }
    },
    {
        value: 'bordered',
        label: 'Arrow Markers',
        description: 'Arrow markers with left border accent',
        preview: {
            backgroundColor: 'rgba(0, 115, 170, 0.03)',
            textColor: '#0073aa',
            borderColor: '#0073aa'
        }
    },
    {
        value: 'card',
        label: 'Check Markers',
        description: 'Check marks and symbols with card styling',
        preview: {
            backgroundColor: '#ffffff',
            textColor: '#2c3e50',
            borderColor: '#e0e0e0'
        }
    },
    {
        value: 'highlight',
        label: 'Star Markers',
        description: 'Star markers with gradient background',
        preview: {
            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            textColor: '#ffffff',
            borderColor: 'transparent'
        }
    },
    {
        value: 'dark-red',
        label: 'Plus Markers',
        description: 'Plus, minus, and bullet markers on dark red background',
        preview: {
            backgroundColor: '#8B0000',
            textColor: '#ffffff',
            borderColor: 'transparent'
        }
    }
];

/**
 * Get style preset by value
 * @param {string} value - The preset value
 * @returns {Object|null} - The preset object or null if not found
 */
export function getStylePreset(value) {
    return STYLE_PRESETS.find(preset => preset.value === value) || null;
}

/**
 * Get all available style presets
 * @returns {Array} - Array of all style presets
 */
export function getAllStylePresets() {
    return STYLE_PRESETS;
}

/**
 * Get style presets formatted for WordPress SelectControl
 * @returns {Array} - Array of options for SelectControl
 */
export function getStylePresetOptions() {
    return STYLE_PRESETS.map(preset => ({
        label: preset.label,
        value: preset.value
    }));
}
