import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    InnerBlocks,
    RichText
} from '@wordpress/block-editor';
import {
    PanelBody,
    ToggleControl,
    SelectControl,
    Button,
    TextControl,
    TextareaControl
} from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

interface TabTitle {
    id: string;
    title: string;
    hasMedia: boolean;
    mediaType: 'iconLibrary' | 'uploadSVG';
    icon: string;
    customSVG: string;
}

interface AdvancedTabsAttributes {
    uniqueId: string;
    tabTitles: TabTitle[];
    tabChildCount: number;
    activeTab: string;
    iconPosition: 'left' | 'right';
    showSeparator: boolean;
    className?: string;
}

interface AdvancedTabsEditProps {
    attributes: AdvancedTabsAttributes;
    setAttributes: (attributes: Partial<AdvancedTabsAttributes>) => void;
    clientId: string;
}

function AdvancedTabsEdit({ attributes, setAttributes, clientId }: AdvancedTabsEditProps): JSX.Element {
    const {
        uniqueId,
        tabTitles,
        tabChildCount,
        activeTab,
        iconPosition,
        showSeparator,
        className
    } = attributes;

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const blockProps = useBlockProps({
        className: `advanced-tabs-block ${className || ''}`
    });

    const { innerBlocks } = useSelect((select) => {
        const { getBlocksByClientId } = select('core/block-editor');
        return {
            innerBlocks: getBlocksByClientId(clientId)[0]?.innerBlocks || []
        };
    }, [clientId]);

    const { updateBlockAttributes, replaceInnerBlocks } = useDispatch('core/block-editor');

    // Initialize uniqueId if not set
    useEffect(() => {
        if (!uniqueId) {
            setAttributes({ uniqueId: `jankx-tabs-${clientId.slice(0, 8)}` });
        }
    }, [uniqueId, clientId, setAttributes]);

    // Update child blocks with parent ID
    useEffect(() => {
        if (uniqueId && innerBlocks.length > 0) {
            innerBlocks.forEach((block) => {
                updateBlockAttributes(block.clientId, { tabParentId: uniqueId });
            });
        }
    }, [uniqueId, innerBlocks, updateBlockAttributes]);

    const handleTabClick = (tabId: string) => {
        setAttributes({ activeTab: tabId });
    };

    const addNewTab = () => {
        const newTabId = `${tabTitles.length + 1}`;
        const newTab: TabTitle = {
            id: newTabId,
            title: `Tab ${tabTitles.length + 1}`,
            hasMedia: false,
            mediaType: 'iconLibrary',
            icon: '0-circle',
            customSVG: ''
        };

        const updatedTitles = [...tabTitles, newTab];
        setAttributes({
            tabTitles: updatedTitles,
            tabChildCount: tabChildCount + 1
        });

        // Create new tab block
        const newTabBlock = createBlock('jankx/advanced-tab', {
            tabId: newTabId,
            tabParentId: uniqueId
        });

        const updatedBlocks = [...innerBlocks, newTabBlock];
        replaceInnerBlocks(clientId, updatedBlocks);
    };

    const removeTab = (index: number) => {
        if (tabTitles.length <= 1) return;

        const updatedTitles = tabTitles.filter((_, i) => i !== index);
        const updatedBlocks = innerBlocks.filter((_, i) => i !== index);

        setAttributes({
            tabTitles: updatedTitles,
            tabChildCount: tabChildCount - 1,
            activeTab: updatedTitles[0]?.id || '1'
        });

        replaceInnerBlocks(clientId, updatedBlocks);
    };

    const updateTabTitle = (index: number, title: string) => {
        const updatedTitles = [...tabTitles];
        updatedTitles[index].title = title;
        setAttributes({ tabTitles: updatedTitles });
    };

    const toggleTabMedia = (index: number) => {
        const updatedTitles = [...tabTitles];
        updatedTitles[index].hasMedia = !updatedTitles[index].hasMedia;
        setAttributes({ tabTitles: updatedTitles });
    };

    const updateTabIcon = (index: number, icon: string) => {
        const updatedTitles = [...tabTitles];
        updatedTitles[index].icon = icon;
        setAttributes({ tabTitles: updatedTitles });
    };

    const updateTabCustomSVG = (index: number, customSVG: string) => {
        const updatedTitles = [...tabTitles];
        updatedTitles[index].customSVG = customSVG;
        setAttributes({ tabTitles: updatedTitles });
    };

    const updateTabMediaType = (index: number, mediaType: 'iconLibrary' | 'uploadSVG') => {
        const updatedTitles = [...tabTitles];
        updatedTitles[index].mediaType = mediaType;
        setAttributes({ tabTitles: updatedTitles });
    };

    const renderTabPreview = () => (
        <div className="tabs-container">
            <div className="tabs-nav">
                <ul className="tabs-titles">
                    {tabTitles.map((tab, index) => (
                        <li
                            key={tab.id}
                            className={`tab-title ${iconPosition} ${activeTab === tab.id ? 'active' : ''}`}
                            data-title-tab-id={tab.id}
                            role="button"
                            onClick={() => handleTabClick(tab.id)}
                        >
                            {tab.hasMedia && (
                                <div className="tab-title-media">
                                    {tab.mediaType === 'iconLibrary' ? (
                                        <i className={`bi bi-${tab.icon}`}></i>
                                    ) : (
                                        tab.customSVG && <div dangerouslySetInnerHTML={{ __html: tab.customSVG }} />
                                    )}
                                </div>
                            )}
                            <RichText
                                tagName="span"
                                className="tab-title-text"
                                value={tab.title}
                                onChange={(value) => updateTabTitle(index, value)}
                                placeholder={__('Tab Title...', 'jankx')}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <div className="tabs-content">
                <InnerBlocks
                    templateLock="all"
                    template={tabTitles.map(tab => [
                        'jankx/advanced-tab',
                        { tabId: tab.id, tabParentId: uniqueId }
                    ])}
                    allowedBlocks={['jankx/advanced-tab']}
                />
            </div>
        </div>
    );

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Tab Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Icon Position', 'jankx')}
                        value={iconPosition}
                        options={[
                            { label: __('Left', 'jankx'), value: 'left' },
                            { label: __('Right', 'jankx'), value: 'right' }
                        ]}
                        onChange={(value: 'left' | 'right') => setAttributes({ iconPosition: value })}
                    />

                    <ToggleControl
                        label={__('Show Separator', 'jankx')}
                        checked={showSeparator}
                        onChange={(value: boolean) => setAttributes({ showSeparator: value })}
                        help={__('Display separator between tabs', 'jankx')}
                    />
                </PanelBody>

                <PanelBody title={__('Manage Tabs', 'jankx')} initialOpen={false}>
                    {tabTitles.map((tab, index) => (
                        <div key={tab.id} className="tab-settings-item">
                            <div className="tab-settings-header">
                                <TextControl
                                    label={__('Tab Title', 'jankx')}
                                    value={tab.title}
                                    onChange={(value) => updateTabTitle(index, value)}
                                />
                                <Button
                                    isDestructive
                                    onClick={() => removeTab(index)}
                                    disabled={tabTitles.length <= 1}
                                >
                                    {__('Remove', 'jankx')}
                                </Button>
                            </div>

                            <ToggleControl
                                label={__('Show Icon', 'jankx')}
                                checked={tab.hasMedia}
                                onChange={() => toggleTabMedia(index)}
                            />

                            {tab.hasMedia && (
                                <>
                                    <SelectControl
                                        label={__('Icon Type', 'jankx')}
                                        value={tab.mediaType}
                                        options={[
                                            { label: __('Icon Library', 'jankx'), value: 'iconLibrary' },
                                            { label: __('Custom SVG', 'jankx'), value: 'uploadSVG' }
                                        ]}
                                        onChange={(value: 'iconLibrary' | 'uploadSVG') => updateTabMediaType(index, value)}
                                    />

                                    {tab.mediaType === 'iconLibrary' ? (
                                        <TextControl
                                            label={__('Icon Name', 'jankx')}
                                            value={tab.icon}
                                            onChange={(value) => updateTabIcon(index, value)}
                                            help={__('Enter Bootstrap icon name (without bi- prefix)', 'jankx')}
                                        />
                                    ) : (
                                        <TextareaControl
                                            label={__('Custom SVG Code', 'jankx')}
                                            value={tab.customSVG}
                                            onChange={(value) => updateTabCustomSVG(index, value)}
                                            help={__('Paste your SVG code here', 'jankx')}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    ))}

                    <Button
                        variant="primary"
                        onClick={addNewTab}
                        className="add-tab-button"
                    >
                        {__('Add New Tab', 'jankx')}
                    </Button>
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {renderTabPreview()}
            </div>
        </>
    );
}

function AdvancedTabsSave(): null {
    return null;
}

registerBlockType('jankx/advanced-tabs', {
    title: 'Advanced Tabs',
    category: 'jankx',
    attributes: {
        uniqueId: { type: 'string' },
        tabTitles: {
            type: 'array',
            default: [
                {
                    id: '1',
                    title: 'Tab 1',
                    hasMedia: false,
                    mediaType: 'iconLibrary',
                    icon: '0-circle',
                    customSVG: ''
                },
                {
                    id: '2',
                    title: 'Tab 2',
                    hasMedia: false,
                    mediaType: 'iconLibrary',
                    icon: '0-circle',
                    customSVG: ''
                },
                {
                    id: '3',
                    title: 'Tab 3',
                    hasMedia: false,
                    mediaType: 'iconLibrary',
                    icon: '0-circle',
                    customSVG: ''
                }
            ]
        },
        tabChildCount: { type: 'number', default: 3 },
        activeTab: { type: 'string', default: '1' },
        iconPosition: { type: 'string', default: 'left' },
        showSeparator: { type: 'boolean', default: true },
        className: { type: 'string' }
    },
    edit: AdvancedTabsEdit,
    save: AdvancedTabsSave,
});
