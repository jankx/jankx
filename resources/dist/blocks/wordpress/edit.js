import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { wordpress as wordpressIcon } from '@wordpress/icons';
export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({
        className: 'jankx-wordpress-legacy-editor'
    });
    const legacyOptions = [
        { label: __('None', 'jankx'), value: 'none' },
        { label: __('Recent Comments', 'jankx'), value: 'recent_comments' },
        { label: __('Categories List (Legacy)', 'jankx'), value: 'categories' },
        { label: __('Archives', 'jankx'), value: 'archives' },
        { label: __('Pagination (Legacy)', 'jankx'), value: 'pagination' },
        { label: __('Meta (Login/RSS)', 'jankx'), value: 'meta' }
    ];
    return (_jsxs("div", { ...blockProps, children: [_jsx(InspectorControls, { children: _jsx(PanelBody, { title: __('Legacy Settings', 'jankx'), children: _jsx(SelectControl, { label: __('Feature Type', 'jankx'), value: attributes.legacyType, options: legacyOptions, onChange: (legacyType) => setAttributes({ legacyType }) }) }) }), attributes.legacyType === 'none' ? (_jsx(Placeholder, { icon: wordpressIcon, label: __('WordPress Legacy', 'jankx'), instructions: __('Select a legacy feature to handle intelligently.', 'jankx') })) : (_jsxs("div", { className: "legacy-preview", children: [_jsx("strong", { children: __('Legacy Feature:', 'jankx') }), " ", attributes.legacyType, _jsx("p", { style: { fontSize: '12px', opacity: 0.7 }, children: __('This will be rendered on the frontend using core WordPress functions without loading global style.css.', 'jankx') })] }))] }));
}
