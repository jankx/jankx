/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
    useInnerBlocksProps,
    RichText,
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
import { code, brush } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import type { SmartTabProps } from './types';
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

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Tab Settings', 'jankx')} initialOpen={true}>
                    <TextControl
                        label={__('Tab Title', 'jankx')}
                        value={title}
                        onChange={(value: string) => setAttributes({ title: value })}
                        placeholder={__('Enter tab title', 'jankx')}
                    />
                </PanelBody>

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
            </InspectorControls>

            <InspectorControls group="styles">
                <PanelBody title={__('Normal Tab Style', 'jankx')} initialOpen={true}>
                    <div style={{ padding: '12px', background: '#ffeb3b', border: '2px solid #f57f17', borderRadius: '4px' }}>
                        <h3 style={{ margin: '0 0 8px 0', color: '#e65100' }}>🔍 DEBUG: Normal Tab Style Panel</h3>
                        <p style={{ margin: '0', fontSize: '12px', color: '#bf360c' }}>
                            Nếu bạn thấy text này, PanelBody đã hoạt động!
                        </p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#d84315' }}>
                            ColorGradientSettingsDropdown: {ColorGradientSettingsDropdown ? 'CÓ' : 'KHÔNG'}
                        </p>
                    </div>
                </PanelBody>

                <PanelBody title={__('Active Tab Style', 'jankx')} initialOpen={true}>
                    <div style={{ padding: '12px', background: '#4caf50', border: '2px solid #2e7d32', borderRadius: '4px' }}>
                        <h3 style={{ margin: '0 0 8px 0', color: '#1b5e20' }}>🔍 DEBUG: Active Tab Style Panel</h3>
                        <p style={{ margin: '0', fontSize: '12px', color: '#2e7d32' }}>
                            Nếu bạn thấy text này, PanelBody đã hoạt động!
                        </p>
                    </div>
                </PanelBody>

                <PanelBody title={__('Tab Content Style', 'jankx')} initialOpen={true}>
                    <div style={{ padding: '12px', background: '#2196f3', border: '2px solid #1565c0', borderRadius: '4px' }}>
                        <h3 style={{ margin: '0 0 8px 0', color: '#0d47a1' }}>🔍 DEBUG: Tab Content Style Panel</h3>
                        <p style={{ margin: '0', fontSize: '12px', color: '#1565c0' }}>
                            Nếu bạn thấy text này, PanelBody đã hoạt động!
                        </p>
                    </div>
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="smart-tab__header">
                    <RichText
                        tagName="div"
                        className="smart-tab__title-edit"
                        value={title}
                        onChange={(value: string) => setAttributes({ title: value })}
                        placeholder={__('Tab title...', 'jankx')}
                    />
                </div>
                <div {...innerBlocksProps} />
            </div>
        </>
    );
}

