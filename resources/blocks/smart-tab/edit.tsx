/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
    useInnerBlocksProps,
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    withColors,
} from '@wordpress/block-editor';
import { BlockControls } from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    TextControl,
    Button,
    Dropdown,
    MenuGroup,
    MenuItem,
    ColorPicker,
    __experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { code, brush } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import type { SmartTabProps, SmartTabTriggerConfig } from './types';
import IconPicker from '../../shared/components/IconPicker';
import {
    CustomInserterModal,
    IconDropZone,
    IconPlaceholder,
    InserterModal,
} from '../svg-icon/components';
import {
    flattenIconsArray,
    parseIcon,
    parseUploadedMediaAndSetIcon,
} from '../svg-icon/utils';
import getIcons from '../svg-icon/icons';

/**
 * Edit component for Smart Tab block
 */
export default function Edit({ attributes, setAttributes, clientId, context }: SmartTabProps): JSX.Element {
    const {
        title,
        trigger = 'manual',
        iconType,
        icon,
        iconName,
        iconSet,
        iconPosition,
        iconSize,
        iconColor,
        normalTabTextColor,
        normalTabBackgroundColor,
        normalTabGradient,
        activeTabTextColor,
        activeTabBackgroundColor,
        activeTabGradient,
        contentTextColor,
        contentBackgroundColor,
        contentGradient,
    } = attributes;

    const activeTabIndex = context?.['jankx/activeTab'] ?? 0;

    const rawTriggerConfig = (window?.JankxSmartTabTriggers?.items ?? {}) as Record<string, SmartTabTriggerConfig>;
    const fallbackTrigger: SmartTabTriggerConfig = useMemo(
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
            settingsSchema: [],
        }),
        []
    );

    const triggersMap = useMemo(() => {
        if (Object.keys(rawTriggerConfig).length === 0) {
            return { manual: fallbackTrigger };
        }

        return {
            manual: fallbackTrigger,
            ...rawTriggerConfig,
        };
    }, [rawTriggerConfig, fallbackTrigger]);

    const triggerOptions = useMemo(
        () =>
            Object.values(triggersMap).map((config) => ({
                label: config.label,
                value: config.key,
            })),
        [triggersMap]
    );

    const triggerConfig = triggersMap[trigger] ?? triggersMap.manual ?? fallbackTrigger;
    const triggerSupports = triggerConfig?.supports || {};
    const allowCustomTitle = triggerSupports.customTitle !== false;
    const allowCustomContent = triggerSupports.customContent !== false;
    const allowCustomIcon = triggerSupports.icon !== false;
    const previewTitle =
        triggerConfig.previewTitle || triggerConfig.label || (title ? title : __('Tab', 'jankx'));

    // Color and gradient settings
    const colorGradientSettings = useMultipleOriginColorsAndGradients() || {};

    const { blockIndex } = useSelect(
        (select: any) => {
            const { getBlockIndex } = select('core/block-editor');
            return {
                blockIndex: getBlockIndex(clientId),
            };
        },
        [clientId]
    );

    const isActive = blockIndex === activeTabIndex;

    // Build content styles
    const contentStyles: React.CSSProperties = {};
    if (contentTextColor) {
        contentStyles.color = contentTextColor;
    }
    if (contentGradient) {
        contentStyles.background = contentGradient;
    } else if (contentBackgroundColor) {
        contentStyles.backgroundColor = contentBackgroundColor;
    }

    const blockProps = useBlockProps({
        className: `smart-tab${isActive ? ' is-active' : ''}`,
        'data-trigger': trigger,
        // Chỉ hiển thị tab đang active để tập trung edit
        style: {
            display: isActive ? 'block' : 'none',
        },
    });

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'smart-tab__content',
            style: contentStyles,
        },
        {
            templateLock: false,
            // Chỉ tab active mới có block appender
            renderAppender: isActive ? undefined : false,
        }
    );

    // Handle icon selection from picker
    const handleIconSelect = (selectedIcon: any): void => {
        if (selectedIcon && selectedIcon.icon) {
            setAttributes({
                icon: selectedIcon.icon,
                iconName: selectedIcon.name || '',
                iconType: 'picker',
            });
        }
    };

    // Parse and set SVG icon
    const handleCustomSvg = (svgContent: string): void => {
        const parsedIcon = parseIcon(svgContent);
        if (parsedIcon) {
            setAttributes({
                icon: parsedIcon,
                iconType: 'svg',
            });
        }
    };

    const allIcons = flattenIconsArray(getIcons());

    const handleTriggerChange = (value: string): void => {
        const newTriggerKey = triggersMap[value] ? value : 'manual';
        const config = triggersMap[newTriggerKey] ?? triggersMap.manual ?? fallbackTrigger;

        const updatedAttributes: Partial<SmartTabProps['attributes']> = {
            trigger: newTriggerKey,
            triggerSettings: {},
        };

        if (config?.supports?.customTitle === false) {
            updatedAttributes.title = '';
        }

        if (config?.supports?.icon === false) {
            updatedAttributes.iconType = 'none';
            updatedAttributes.icon = '';
            updatedAttributes.iconName = '';
        }

        setAttributes(updatedAttributes);
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Tab Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Trigger', 'jankx')}
                        value={trigger}
                        options={triggerOptions}
                        onChange={handleTriggerChange}
                        help={triggerConfig?.description || __('Select behaviour for this tab.', 'jankx')}
                    />

                    <TextControl
                        label={__('Tab Title', 'jankx')}
                        value={allowCustomTitle ? title : previewTitle}
                        onChange={(value: string) => {
                            if (!allowCustomTitle) {
                                return;
                            }
                            setAttributes({ title: value });
                        }}
                        placeholder={__('Enter tab title', 'jankx')}
                        disabled={!allowCustomTitle}
                        help={
                            allowCustomTitle
                                ? undefined
                                : __('Title is managed by the selected trigger.', 'jankx')
                        }
                    />
                </PanelBody>

                {allowCustomIcon && (
                <PanelBody title={__('Tab Icon', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Icon Type', 'jankx')}
                        value={iconType}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('SVG Code', 'jankx'), value: 'svg' },
                            { label: __('Icon Picker', 'jankx'), value: 'picker' },
                        ]}
                        onChange={(value: string) => setAttributes({ iconType: value as 'none' | 'svg' | 'picker' })}
                    />

                    {iconType === 'svg' && (
                        <>
                            <InserterModal
                                isInserterOpen={false}
                                setInserterOpen={() => {}}
                                onSelect={(selectedIcon: any) => {
                                    if (selectedIcon?.icon) {
                                        handleCustomSvg(selectedIcon.icon);
                                    }
                                }}
                                icons={allIcons}
                            />
                            <TextControl
                                label={__('SVG Code', 'jankx')}
                                value={icon}
                                onChange={handleCustomSvg}
                                placeholder={__('Paste SVG code here', 'jankx')}
                                help={__('Paste your SVG code', 'jankx')}
                            />
                        </>
                    )}

                    {iconType === 'picker' && (
                        <div className="smart-tab-icon-picker">
                            <IconPicker
                                value={iconName}
                                onChange={handleIconSelect}
                                iconSet={iconSet}
                            />
                        </div>
                    )}

                    {iconType !== 'none' && icon && (
                        <>
                            <SelectControl
                                label={__('Icon Position', 'jankx')}
                                value={iconPosition}
                                options={[
                                    { label: __('Before', 'jankx'), value: 'before' },
                                    { label: __('After', 'jankx'), value: 'after' },
                                ]}
                                onChange={(value: string) =>
                                    setAttributes({ iconPosition: value as 'before' | 'after' })
                                }
                            />

                            <UnitControl
                                label={__('Icon Size', 'jankx')}
                                value={iconSize}
                                onChange={(value: string | undefined) =>
                                    setAttributes({ iconSize: value || '16px' })
                                }
                            />

                            <div className="components-base-control">
                                <label className="components-base-control__label">
                                    {__('Icon Color', 'jankx')}
                                </label>
                                <Dropdown
                                    renderToggle={({ isOpen, onToggle }: any) => (
                                        <Button
                                            icon={brush}
                                            onClick={onToggle}
                                            aria-expanded={isOpen}
                                            variant="secondary"
                                        >
                                            {__('Choose Color', 'jankx')}
                                        </Button>
                                    )}
                                    renderContent={() => (
                                        <ColorPicker
                                            color={iconColor}
                                            onChange={(value: string) => setAttributes({ iconColor: value })}
                                            enableAlpha
                                            defaultValue="#000000"
                                        />
                                    )}
                                />
                            </div>
                        </>
                    )}
                </PanelBody>
                )}
            </InspectorControls>

            <div {...blockProps}>
                {allowCustomContent ? (
                    <div {...innerBlocksProps} />
                ) : (
                    <div className="smart-tab__content smart-tab__content--locked">
                        <p>
                            {triggerConfig?.description ||
                                __('Content is generated by the selected trigger.', 'jankx')}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

