/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
    useInnerBlocksProps,
    BlockControls,
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
    PanelColorGradientSettings,
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    Button,
    ToolbarGroup,
    ToolbarButton,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import type { SmartTabsProps, TabItem } from './types';

/**
 * Edit component for Smart Tabs block
 */
export default function Edit({ attributes, setAttributes, clientId }: SmartTabsProps): JSX.Element {
    const {
        tabType,
        styleType,
        activeTab,
        tabAlignment,
        tabItemTextColor,
        tabItemBackgroundColor,
        tabItemGradient,
        activeTabTextColor,
        activeTabBackgroundColor,
        activeTabGradient,
    } = attributes;

    const { innerBlocks, selectedBlockClientId } = useSelect(
        (select: any) => {
            const { getBlocks, getSelectedBlockClientId } = select('core/block-editor');
            return {
                innerBlocks: getBlocks(clientId),
                selectedBlockClientId: getSelectedBlockClientId(),
            };
        },
        [clientId]
    );

    const { insertBlock, selectBlock } = useDispatch('core/block-editor');

    const tabItems: TabItem[] = innerBlocks.map((block: any) => ({
        clientId: block.clientId,
        title: block.attributes.title || __('Tab', 'jankx'),
        icon: block.attributes.icon,
        iconType: block.attributes.iconType,
        normalTabTextColor: block.attributes.normalTabTextColor,
        normalTabBackgroundColor: block.attributes.normalTabBackgroundColor,
        normalTabGradient: block.attributes.normalTabGradient,
        activeTabTextColor: block.attributes.activeTabTextColor,
        activeTabBackgroundColor: block.attributes.activeTabBackgroundColor,
        activeTabGradient: block.attributes.activeTabGradient,
        contentTextColor: block.attributes.contentTextColor,
        contentBackgroundColor: block.attributes.contentBackgroundColor,
        contentGradient: block.attributes.contentGradient,
    }));

    // Handle tab click in editor
    const handleTabClick = (index: number, tabClientId: string): void => {
        setAttributes({ activeTab: index });
        selectBlock(tabClientId);
    };

    // Add new tab
    const addNewTab = (): void => {
        const newTab = createBlock('jankx/smart-tab', {
            title: __('New Tab', 'jankx'),
        });

        insertBlock(newTab, innerBlocks.length, clientId, false);
        setAttributes({ activeTab: innerBlocks.length });
    };

    const blockProps = useBlockProps({
        className: `smart-tabs smart-tabs--${tabType} smart-tabs--style-${styleType}`,
    });

    const innerBlocksProps = useInnerBlocksProps(
        { className: 'smart-tabs__content' },
        {
            allowedBlocks: ['jankx/smart-tab'],
            template: [
                ['jankx/smart-tab', { title: __('Tab 1', 'jankx') }],
                ['jankx/smart-tab', { title: __('Tab 2', 'jankx') }],
            ],
            orientation: 'vertical',
            renderAppender: false,
        }
    );

    // Determine which tab is active
    const currentActiveTab = Math.min(activeTab, tabItems.length - 1);

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon="editor-alignleft"
                        title={__('Align Left', 'jankx')}
                        onClick={() => setAttributes({ tabAlignment: 'left' })}
                        isActive={tabAlignment === 'left'}
                    />
                    <ToolbarButton
                        icon="editor-aligncenter"
                        title={__('Align Center', 'jankx')}
                        onClick={() => setAttributes({ tabAlignment: 'center' })}
                        isActive={tabAlignment === 'center'}
                    />
                    <ToolbarButton
                        icon="editor-alignright"
                        title={__('Align Right', 'jankx')}
                        onClick={() => setAttributes({ tabAlignment: 'right' })}
                        isActive={tabAlignment === 'right'}
                    />
                    <ToolbarButton
                        icon="editor-justify"
                        title={__('Justify', 'jankx')}
                        onClick={() => setAttributes({ tabAlignment: 'justify' })}
                        isActive={tabAlignment === 'justify'}
                    />
                </ToolbarGroup>
            </BlockControls>

            <InspectorControls>
                <PanelBody title={__('Tab Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Tab Type', 'jankx')}
                        value={tabType}
                        options={[
                            { label: __('Horizontal', 'jankx'), value: 'horizontal' },
                            { label: __('Vertical', 'jankx'), value: 'vertical' },
                        ]}
                        onChange={(value: string) => setAttributes({ tabType: value as 'horizontal' | 'vertical' })}
                        help={__('Choose the tab layout orientation', 'jankx')}
                    />
                    <SelectControl
                        label={__('Style Type', 'jankx')}
                        value={styleType}
                        options={[
                            { label: __('Default', 'jankx'), value: 'default' },
                            { label: __('Minimal', 'jankx'), value: 'minimal' },
                            { label: __('Modern', 'jankx'), value: 'modern' },
                            { label: __('Boxed', 'jankx'), value: 'boxed' },
                        ]}
                        onChange={(value: string) =>
                            setAttributes({ styleType: value as 'default' | 'minimal' | 'modern' | 'boxed' })
                        }
                        help={__('Choose the visual style for tabs', 'jankx')}
                    />

                    <SelectControl
                        label={__('Tab Alignment', 'jankx')}
                        value={tabAlignment}
                        options={[
                            { label: __('Left', 'jankx'), value: 'left' },
                            { label: __('Center', 'jankx'), value: 'center' },
                            { label: __('Right', 'jankx'), value: 'right' },
                            { label: __('Justify', 'jankx'), value: 'justify' },
                        ]}
                        onChange={(value: string) =>
                            setAttributes({ tabAlignment: value as 'left' | 'center' | 'right' | 'justify' })
                        }
                        help={__('Align tabs horizontally', 'jankx')}
                    />
                </PanelBody>
            </InspectorControls>

            <InspectorControls group="styles">
                <PanelColorGradientSettings
                    title={__('Tab Items Style', 'jankx')}
                    initialOpen={false}
                    settings={[
                        {
                            label: __('Text Color', 'jankx'),
                            colorValue: tabItemTextColor,
                            onColorChange: (value: string) => setAttributes({ tabItemTextColor: value }),
                        },
                        {
                            label: __('Background', 'jankx'),
                            colorValue: tabItemBackgroundColor,
                            gradientValue: tabItemGradient,
                            onColorChange: (value: string) => setAttributes({ tabItemBackgroundColor: value }),
                            onGradientChange: (value: string) => setAttributes({ tabItemGradient: value }),
                        },
                    ]}
                />

                <PanelColorGradientSettings
                    title={__('Active Tab Style', 'jankx')}
                    initialOpen={false}
                    settings={[
                        {
                            label: __('Text Color', 'jankx'),
                            colorValue: activeTabTextColor,
                            onColorChange: (value: string) => setAttributes({ activeTabTextColor: value }),
                        },
                        {
                            label: __('Background', 'jankx'),
                            colorValue: activeTabBackgroundColor,
                            gradientValue: activeTabGradient,
                            onColorChange: (value: string) => setAttributes({ activeTabBackgroundColor: value }),
                            onGradientChange: (value: string) => setAttributes({ activeTabGradient: value }),
                        },
                    ]}
                />
            </InspectorControls>

            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon={plus}
                        label={__('Add Tab', 'jankx')}
                        onClick={addNewTab}
                    />
                </ToolbarGroup>
            </BlockControls>

            <div {...blockProps}>
                <div className="smart-tabs__navigation">
                    <div className={`smart-tabs__nav-list align-${tabAlignment}`}>
                        {tabItems.map((tab, index) => {
                            const isActiveTab = index === currentActiveTab;

                            // Build inline styles for tab using parent settings
                            const tabStyles: React.CSSProperties = {};

                            if (isActiveTab) {
                                // Active tab styles from parent
                                if (activeTabTextColor) {
                                    tabStyles.color = activeTabTextColor;
                                }
                                if (activeTabGradient) {
                                    tabStyles.background = activeTabGradient;
                                } else if (activeTabBackgroundColor) {
                                    tabStyles.backgroundColor = activeTabBackgroundColor;
                                }
                            } else {
                                // Normal tab styles from parent
                                if (tabItemTextColor) {
                                    tabStyles.color = tabItemTextColor;
                                }
                                if (tabItemGradient) {
                                    tabStyles.background = tabItemGradient;
                                } else if (tabItemBackgroundColor) {
                                    tabStyles.backgroundColor = tabItemBackgroundColor;
                                }
                            }

                            return (
                                <button
                                    key={tab.clientId}
                                    className={`smart-tabs__nav-item${
                                        isActiveTab ? ' is-active' : ''
                                    }`}
                                    style={Object.keys(tabStyles).length > 0 ? tabStyles : undefined}
                                    onClick={() => handleTabClick(index, tab.clientId)}
                                    type="button"
                                >
                                    {tab.iconType !== 'none' && tab.icon && (
                                        <span
                                            className="smart-tabs__nav-icon"
                                            dangerouslySetInnerHTML={{ __html: tab.icon }}
                                        />
                                    )}
                                    <span className="smart-tabs__nav-label">{tab.title}</span>
                                </button>
                            );
                        })}
                        <Button
                            className="smart-tabs__add-tab"
                            icon={plus}
                            label={__('Add Tab', 'jankx')}
                            onClick={addNewTab}
                            variant="secondary"
                        />
                    </div>
                </div>
                <div {...innerBlocksProps} />
            </div>
        </>
    );
}

