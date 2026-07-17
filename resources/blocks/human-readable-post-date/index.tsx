import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import metadata from './block.json';

function Edit({ attributes, setAttributes }: { attributes: { showIcon: boolean }, setAttributes: (attrs: Partial<{ showIcon: boolean }>) => void }) {
    const blockProps = useBlockProps({ className: 'jankx-human-readable-post-date' });

    return _jsxs(_Fragment, { children: [
        _jsx(InspectorControls, { children:
            _jsx(PanelBody, { title: __('Settings', 'jankx'), children:
                _jsx(ToggleControl, {
                    label: __('Show clock icon', 'jankx'),
                    checked: attributes.showIcon,
                    onChange: (val: boolean) => setAttributes({ showIcon: val })
                })
            })
        }),
        _jsxs('div', { ...blockProps, children: [
            attributes.showIcon && _jsx('span', { className: 'post-date-icon', style: { marginRight: 6 }, children: '🕒' }),
            _jsx('span', { children: __('3 hours ago', 'jankx') }),
        ]})
    ]});
}

registerBlockType(metadata.name as any, {
    edit: Edit,
    save: () => null, // Dynamic block - rendered by PHP
});
