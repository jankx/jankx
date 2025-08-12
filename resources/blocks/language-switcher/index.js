import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    PanelBody,
    ToggleControl,
    SelectControl,
    TextControl
} from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Language Switcher Block Editor Component
 *
 * This component handles the editor interface for the language switcher block.
 * It provides controls to configure display options and preview the language switcher.
 */
function LanguageSwitcherEdit({ attributes, setAttributes }) {
    const {
        showFlags,
        showNames,
        showCurrent,
        displayType,
        className
    } = attributes;

    const [languages, setLanguages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const blockProps = useBlockProps({
        className: `language-switcher-block ${className || ''}`
    });

    // Fetch available languages on component mount
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
                } else {
                    setLanguages([]);
                }
            } catch (error) {
                console.error('Failed to fetch languages:', error);
                setError('Failed to load languages. Please check if Polylang plugin is active.');
                setLanguages([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLanguages();
    }, []);

    // Render preview based on display type
    const renderPreview = () => {
        if (isLoading) {
            return (
                <div className="language-switcher-preview loading">
                    <p>{__('Loading languages...', 'jankx')}</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="language-switcher-preview error">
                    <p>{error}</p>
                </div>
            );
        }

        if (languages.length === 0) {
            return (
                <div className="language-switcher-preview no-languages">
                    <p>{__('No languages found. Please check Polylang configuration.', 'jankx')}</p>
                </div>
            );
        }

        switch (displayType) {
            case 'list':
                return renderListPreview();
            case 'dropdown':
            default:
                return renderDropdownPreview();
        }
    };

    const renderDropdownPreview = () => (
        <div className="language-switcher-dropdown-preview">
            <select className="language-switcher-dropdown" disabled>
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.url}>
                        {showFlags && lang.flag && (
                            <img src={lang.flag} alt={lang.name} className="language-flag" />
                        )}
                        {showNames && lang.name}
                    </option>
                ))}
            </select>
        </div>
    );

    const renderListPreview = () => (
        <ul className="language-switcher-list-preview">
            {languages.map((lang) => (
                <li key={lang.code} className={`language-item ${lang.current ? 'current-language' : ''}`}>
                    <a href="#" className="language-link" onClick={(e) => e.preventDefault()}>
                        {showFlags && lang.flag && (
                            <img src={lang.flag} alt={lang.name} className="language-flag" />
                        )}
                        {showNames && <span className="language-name">{lang.name}</span>}
                    </a>
                </li>
            ))}
        </ul>
    );

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Language Switcher Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Display Type', 'jankx')}
                        value={displayType}
                        options={[
                            { label: __('Dropdown', 'jankx'), value: 'dropdown' },
                            { label: __('List', 'jankx'), value: 'list' }
                        ]}
                        onChange={(value) => setAttributes({ displayType: value })}
                    />

                    <ToggleControl
                        label={__('Show Flags', 'jankx')}
                        checked={showFlags}
                        onChange={(value) => setAttributes({ showFlags: value })}
                        help={__('Display country flags next to language names', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Show Names', 'jankx')}
                        checked={showNames}
                        onChange={(value) => setAttributes({ showNames: value })}
                        help={__('Display language names', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Show Current Language', 'jankx')}
                        checked={showCurrent}
                        onChange={(value) => setAttributes({ showCurrent: value })}
                        help={__('Include current language in the switcher', 'jankx')}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="language-switcher-editor-preview">
                    <h4 className="language-switcher-title">
                        {__('Language Switcher Preview', 'jankx')}
                    </h4>
                    {renderPreview()}
                </div>

                {languages.length > 0 && (
                    <div className="language-switcher-info">
                        <p className="language-count">
                            {__('Available languages:', 'jankx')} {languages.length}
                        </p>
                        <p className="current-language-info">
                            {__('Current language:', 'jankx')} {languages.find(l => l.current)?.name || __('Unknown', 'jankx')}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

/**
 * Language Switcher Block Save Component
 *
 * This component handles the save functionality for the language switcher block.
 * Since we're using a render callback, this returns null.
 */
function LanguageSwitcherSave() {
    return null;
}

// Register the block
registerBlockType('jankx/language-switcher', {
    edit: LanguageSwitcherEdit,
    save: LanguageSwitcherSave,
});
