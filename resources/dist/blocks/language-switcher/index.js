import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
function LanguageSwitcherEdit({ attributes, setAttributes }) {
    const { showFlags, showNames, showCurrent, displayType, className } = attributes;
    const [languages, setLanguages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const blockProps = useBlockProps({
        className: `language-switcher-block ${className || ''}`
    });
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                setIsLoading(true);
                setError('');
                const response = await apiFetch({
                    path: '/jankx/v1/languages',
                    method: 'GET'
                });
                if (response && Array.isArray(response)) {
                    setLanguages(response);
                }
                else {
                    setLanguages([]);
                }
            }
            catch (err) {
                // eslint-disable-next-line no-console
                console.error('Failed to fetch languages:', err);
                setError('Failed to load languages. Please check if Polylang plugin is active.');
                setLanguages([]);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchLanguages();
    }, []);
    const renderDropdownPreview = () => {
        const currentLang = languages.find(l => l.current) || languages[0];
        return (_jsxs("div", { className: "language-switcher-dropdown-wrapper", children: [_jsxs("button", { className: "language-switcher-dropdown", type: "button", onClick: () => setIsDropdownOpen(!isDropdownOpen), children: [showFlags && currentLang?.flag && currentLang.flag.trim() !== '' && (_jsx("img", { src: currentLang.flag, alt: currentLang.name, className: "language-flag" })), showNames && _jsx("span", { className: "language-name", children: currentLang?.name || '' }), _jsx("span", { className: "language-arrow", children: "\u25BC" })] }), isDropdownOpen && (_jsx("ul", { className: "language-switcher-dropdown-menu", children: languages.map((lang) => (_jsx("li", { className: `language-dropdown-item ${lang.current ? 'current-language' : ''}`, children: _jsxs("a", { href: "#", className: "language-dropdown-link", onClick: (e) => e.preventDefault(), children: [showFlags && lang.flag && lang.flag.trim() !== '' && (_jsx("img", { src: lang.flag, alt: lang.name, className: "language-flag" })), showNames && _jsx("span", { className: "language-name", children: lang.name })] }) }, lang.code))) }))] }));
    };
    const renderListPreview = () => (_jsx("ul", { className: "language-switcher-list", children: languages.map((lang) => (_jsx("li", { className: `language-item ${lang.current ? 'current-language' : ''}`, children: _jsxs("a", { href: "#", className: "language-link", onClick: (e) => e.preventDefault(), children: [showFlags && lang.flag && lang.flag.trim() !== '' && (_jsx("img", { src: lang.flag, alt: lang.name, className: "language-flag" })), showNames && _jsx("span", { className: "language-name", children: lang.name })] }) }, lang.code))) }));
    const renderPreview = () => {
        if (isLoading) {
            return (_jsx("div", { className: "language-switcher-preview loading", children: _jsx("p", { children: __('Loading languages...', 'jankx') }) }));
        }
        if (error) {
            return (_jsx("div", { className: "language-switcher-preview error", children: _jsx("p", { children: error }) }));
        }
        if (languages.length === 0) {
            return (_jsx("div", { className: "language-switcher-preview no-languages", children: _jsx("p", { children: __('No languages found. Please check Polylang configuration.', 'jankx') }) }));
        }
        return displayType === 'list' ? renderListPreview() : renderDropdownPreview();
    };
    return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Language Switcher Settings', 'jankx'), initialOpen: true, children: [_jsx(SelectControl, { label: __('Display Type', 'jankx'), value: displayType, options: [
                                { label: __('Dropdown', 'jankx'), value: 'dropdown' },
                                { label: __('List', 'jankx'), value: 'list' }
                            ], onChange: (value) => setAttributes({ displayType: value }) }), _jsx(ToggleControl, { label: __('Show Flags', 'jankx'), checked: showFlags, onChange: (value) => setAttributes({ showFlags: value }), help: __('Display country flags next to language names', 'jankx') }), _jsx(ToggleControl, { label: __('Show Names', 'jankx'), checked: showNames, onChange: (value) => setAttributes({ showNames: value }), help: __('Display language names', 'jankx') }), _jsx(ToggleControl, { label: __('Show Current Language', 'jankx'), checked: showCurrent, onChange: (value) => setAttributes({ showCurrent: value }), help: __('Include current language in the switcher', 'jankx') })] }) }), _jsx("div", { ...blockProps, children: renderPreview() })] }));
}
function LanguageSwitcherSave() {
    return null;
}
registerBlockType('jankx/language-switcher', {
    title: 'Language Switcher',
    category: 'widgets',
    attributes: {
        showFlags: { type: 'boolean', default: true },
        showNames: { type: 'boolean', default: true },
        showCurrent: { type: 'boolean', default: true },
        displayType: { type: 'string', default: 'dropdown' },
        className: { type: 'string' }
    },
    edit: LanguageSwitcherEdit,
    save: LanguageSwitcherSave,
});
