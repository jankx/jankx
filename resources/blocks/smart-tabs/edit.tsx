/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
    useInnerBlocksProps,
    BlockControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl,
    Button,
    ToolbarGroup,
    ToolbarButton,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { plus } from '@wordpress/icons';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { SmartTabsProps, TabItem, WPBlock, BlockEditorSelect, BlockEditorDispatch } from './types';
import type { SmartTabTriggerConfig } from '../smart-tab/types';

/**
 * Edit component for Smart Tabs block
 */
export default function Edit({ attributes, setAttributes, clientId }: SmartTabsProps): JSX.Element {
    const {
        tabType,
        styleType,
        activeTab,
        tabAlignment,
        hideTabsBorderBottom,
        centerNavigation,
        label = '',
        showLabel = false,
    } = attributes;

    const { innerBlocks, selectedBlockClientId } = useSelect(
        (select) => {
            const blockEditorSelect = select('core/block-editor') as BlockEditorSelect;
            return {
                innerBlocks: blockEditorSelect.getBlocks(clientId),
                selectedBlockClientId: blockEditorSelect.getSelectedBlockClientId(),
            };
        },
        [clientId]
    );

    const dispatch = useDispatch('core/block-editor') as BlockEditorDispatch;
    const { insertBlock, selectBlock } = dispatch;

    const manualTriggerFallback: SmartTabTriggerConfig = useMemo(
        () => ({
            key: 'manual',
            label: __('Custom Content', 'jankx'),
            description: __('Use manual tab title and content.', 'jankx'),
            previewTitle: __('Tab', 'jankx'),
            supports: {
                customTitle: true,
                customContent: true,
                icon: true,
            },
        }),
        []
    );

    const triggersMap = useMemo(() => {
        const items = (window?.JankxSmartTabTriggers?.items ?? {}) as Record<string, SmartTabTriggerConfig>;
        if (Object.keys(items).length === 0) {
            return { manual: manualTriggerFallback };
        }

        return {
            manual: manualTriggerFallback,
            ...items,
        };
    }, [manualTriggerFallback]);

    const tabItems: TabItem[] = innerBlocks.map((block: WPBlock): TabItem => ({
        clientId: block.clientId,
        title: (() => {
            const triggerKey = (block.attributes.trigger as string) || 'manual';
            const triggerConfig = triggersMap[triggerKey] ?? triggersMap.manual;
            const supports = triggerConfig?.supports || {};
            const allowCustomTitle = supports.customTitle !== false;
            const blockTitle = (block.attributes.title as string) || '';

            if (allowCustomTitle && blockTitle) {
                return blockTitle;
            }

            return (
                triggerConfig?.previewTitle ||
                triggerConfig?.label ||
                blockTitle ||
                __('Tab', 'jankx')
            );
        })(),
        trigger: (block.attributes.trigger as string) || 'manual',
        previewTitle: (() => {
            const triggerKey = (block.attributes.trigger as string) || 'manual';
            const triggerConfig = triggersMap[triggerKey] ?? triggersMap.manual;
            return triggerConfig?.previewTitle || triggerConfig?.label || '';
        })(),
        icon: (block.attributes.icon as string) || '',
        iconType: (block.attributes.iconType as string) || '',
        normalTabTextColor: (block.attributes.normalTabTextColor as string) || '',
        normalTabBackgroundColor: (block.attributes.normalTabBackgroundColor as string) || '',
        normalTabGradient: (block.attributes.normalTabGradient as string) || '',
        activeTabTextColor: (block.attributes.activeTabTextColor as string) || '',
        activeTabBackgroundColor: (block.attributes.activeTabBackgroundColor as string) || '',
        activeTabGradient: (block.attributes.activeTabGradient as string) || '',
        contentTextColor: (block.attributes.contentTextColor as string) || '',
        contentBackgroundColor: (block.attributes.contentBackgroundColor as string) || '',
        contentGradient: (block.attributes.contentGradient as string) || '',
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
            trigger: 'manual',
        });

        insertBlock(newTab, innerBlocks.length, clientId, false);
        setAttributes({ activeTab: innerBlocks.length });
    };

    const blockProps = useBlockProps({
        className: `smart-tabs smart-tabs--${tabType} smart-tabs--style-${styleType}${hideTabsBorderBottom ? ' smart-tabs--hide-border-bottom' : ''}${centerNavigation ? ' smart-tabs--center-navigation' : ''}`,
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
                    <ToggleControl
                        label={__('Hide Tabs Border Bottom', 'jankx')}
                        checked={hideTabsBorderBottom}
                        onChange={(value: boolean) => setAttributes({ hideTabsBorderBottom: value })}
                        help={__('Hide the border bottom of tabs navigation', 'jankx')}
                        __nextHasNoMarginBottom
                    />

                    <ToggleControl
                        label={__('Center Navigation', 'jankx')}
                        checked={centerNavigation}
                        onChange={(value: boolean) => setAttributes({ centerNavigation: value })}
                        help={__('Center the tabs navigation with fit-content width', 'jankx')}
                        __nextHasNoMarginBottom
                    />

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
                            { label: __('Bordered', 'jankx'), value: 'bordered' },
                        ]}
                        onChange={(value: string) =>
                            setAttributes({ styleType: value as 'default' | 'minimal' | 'modern' | 'boxed' | 'bordered' })
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

                <PanelBody title={__('Label Settings', 'jankx')} initialOpen={false}>
                    <ToggleControl
                        label={__('Show Label', 'jankx')}
                        checked={showLabel}
                        onChange={(value: boolean) => setAttributes({ showLabel: value })}
                        help={__('Display a label before the tabs navigation', 'jankx')}
                        __nextHasNoMarginBottom
                    />

                    {showLabel && (
                        <TextControl
                            label={__('Label Text', 'jankx')}
                            value={label}
                            onChange={(value: string) => setAttributes({ label: value })}
                            placeholder={__('Enter label text', 'jankx')}
                            help={__('Text to display as label before tabs', 'jankx')}
                        />
                    )}
                </PanelBody>
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
                    {showLabel && label && (
                        <div className="smart-tabs__label">
                            {label}
                        </div>
                    )}
                    <div className={`smart-tabs__nav-list align-${tabAlignment}`}>
                        {tabItems.map((tab, index) => {
                            const isActiveTab = index === currentActiveTab;

                            return (
                                <button
                                    key={tab.clientId}
                                    className={`smart-tabs__nav-item${
                                        isActiveTab ? ' is-active' : ''
                                    }`}
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

