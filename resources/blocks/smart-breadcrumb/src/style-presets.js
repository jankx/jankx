/**
 * Style Presets for the Smart Breadcrumb Block.
 *
 * To add a new style preset:
 * 1. Add the preset object to the BREADCRUMB_STYLE_PRESETS array
 * 2. Add the corresponding CSS in style.css and editor.scss
 * 3. The preset will automatically appear in the editor dropdown
 */

export const BREADCRUMB_STYLE_PRESETS = [
    {
        value: 'default',
        label: 'Default',
        description: 'Simple breadcrumb with default styling',
        preview: {
            separator: '›',
            textColor: 'inherit'
        }
    },
    {
        value: 'minimal',
        label: 'Minimal',
        description: 'Clean minimal breadcrumb without decoration',
        preview: {
            separator: '/',
            textColor: '#666'
        }
    },
    {
        value: 'modern',
        label: 'Modern',
        description: 'Modern breadcrumb with hover effects',
        preview: {
            separator: '→',
            textColor: '#0073aa'
        }
    },
    {
        value: 'boxed',
        label: 'Boxed',
        description: 'Breadcrumb items with box background',
        preview: {
            separator: '',
            backgroundColor: '#f5f5f5'
        }
    },
    {
        value: 'underlined',
        label: 'Underlined',
        description: 'Links with underline decoration',
        preview: {
            separator: '›',
            textColor: '#0073aa'
        }
    },
    {
        value: 'badge',
        label: 'Badge',
        description: 'Breadcrumb items as badges',
        preview: {
            separator: '',
            backgroundColor: '#0073aa',
            textColor: '#ffffff'
        }
    }
];

export function getBreadcrumbStylePresetOptions() {
    return BREADCRUMB_STYLE_PRESETS;
}

