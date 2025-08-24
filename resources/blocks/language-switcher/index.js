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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

    const renderDropdownPreview = () => {
        const currentLang = languages.find(l => l.current) || languages[0];

        return (
            <div className="language-switcher-dropdown-wrapper">
                <button
                    className="language-switcher-dropdown"
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    {showFlags && currentLang.flag && currentLang.flag.trim() !== '' && (
                        <img src={currentLang.flag} alt={currentLang.name} className="language-flag" />
                    )}
                    {showNames && <span className="language-name">{currentLang.name}</span>}
                    <span className="language-arrow">▼</span>
                </button>

                {isDropdownOpen && (
                    <ul className="language-switcher-dropdown-menu">
                        {languages.map((lang) => (
                            <li key={lang.code} className={`language-dropdown-item ${lang.current ? 'current-language' : ''}`}>
                                <a href="#" className="language-dropdown-link" onClick={(e) => e.preventDefault()}>
                                    {showFlags && lang.flag && lang.flag.trim() !== '' && (
                                        <img src={lang.flag} alt={lang.name} className="language-flag" />
                                    )}
                                    {showNames && <span className="language-name">{lang.name}</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    const renderListPreview = () => (
        <ul className="language-switcher-list">
            {languages.map((lang) => (
                <li key={lang.code} className={`language-item ${lang.current ? 'current-language' : ''}`}>
                    <a href="#" className="language-link" onClick={(e) => e.preventDefault()}>
                        {showFlags && lang.flag && lang.flag.trim() !== '' && (
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
                {renderPreview()}
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
