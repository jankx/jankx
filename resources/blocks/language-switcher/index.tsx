import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

interface Language {
    code: string;
    name: string;
    url: string;
    flag: string;
    current: boolean;
}

interface LanguageSwitcherAttributes {
    showFlags: boolean;
    showNames: boolean;
    showCurrent: boolean;
    displayType: 'dropdown' | 'list';
    className?: string;
}

interface LanguageSwitcherEditProps {
    attributes: LanguageSwitcherAttributes;
    setAttributes: (attributes: Partial<LanguageSwitcherAttributes>) => void;
}

function LanguageSwitcherEdit({ attributes, setAttributes }: LanguageSwitcherEditProps): JSX.Element {
    const {
        showFlags,
        showNames,
        showCurrent,
        displayType,
        className
    } = attributes;

    const [languages, setLanguages] = useState<Language[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const blockProps = useBlockProps({
        className: `language-switcher-block ${className || ''}`
    });

    useEffect(() => {
        const fetchLanguages = async (): Promise<void> => {
            try {
                setIsLoading(true);
                setError('');

                const response = await apiFetch<Language[]>({
                    path: '/jankx/v1/languages',
                    method: 'GET'
                });

                if (response && Array.isArray(response)) {
                    setLanguages(response);
                } else {
                    setLanguages([]);
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Failed to fetch languages:', err);
                setError('Failed to load languages. Please check if Polylang plugin is active.');
                setLanguages([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLanguages();
    }, []);

    const renderDropdownPreview = (): JSX.Element => {
        const currentLang: Language | undefined = languages.find(l => l.current) || languages[0];

        return (
            <div className="language-switcher-dropdown-wrapper">
                <button
                    className="language-switcher-dropdown"
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    {showFlags && currentLang?.flag && currentLang.flag.trim() !== '' && (
                        <img src={currentLang.flag} alt={currentLang.name} className="language-flag" />
                    )}
                    {showNames && <span className="language-name">{currentLang?.name || ''}</span>}
                    <span className="language-arrow">▼</span>
                </button>

                {isDropdownOpen && (
                    <ul className="language-switcher-dropdown-menu">
                        {languages.map((lang: Language) => (
                            <li key={lang.code} className={`language-dropdown-item ${lang.current ? 'current-language' : ''}`}>
                                <a href="#" className="language-dropdown-link" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}>
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

    const renderListPreview = (): JSX.Element => (
        <ul className="language-switcher-list">
            {languages.map((lang: Language) => (
                <li key={lang.code} className={`language-item ${lang.current ? 'current-language' : ''}`}>
                    <a href="#" className="language-link" onClick={(e: React.MouseEvent) => e.preventDefault()}>
                        {showFlags && lang.flag && lang.flag.trim() !== '' && (
                            <img src={lang.flag} alt={lang.name} className="language-flag" />
                        )}
                        {showNames && <span className="language-name">{lang.name}</span>}
                    </a>
                </li>
            ))}
        </ul>
    );

    const renderPreview = (): JSX.Element => {
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

        return displayType === 'list' ? renderListPreview() : renderDropdownPreview();
    };

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
                        onChange={(value: 'dropdown' | 'list') => setAttributes({ displayType: value })}
                    />

                    <ToggleControl
                        label={__('Show Flags', 'jankx')}
                        checked={showFlags}
                        onChange={(value: boolean) => setAttributes({ showFlags: value })}
                        help={__('Display country flags next to language names', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Show Names', 'jankx')}
                        checked={showNames}
                        onChange={(value: boolean) => setAttributes({ showNames: value })}
                        help={__('Display language names', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Show Current Language', 'jankx')}
                        checked={showCurrent}
                        onChange={(value: boolean) => setAttributes({ showCurrent: value })}
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

function LanguageSwitcherSave(): null {
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
