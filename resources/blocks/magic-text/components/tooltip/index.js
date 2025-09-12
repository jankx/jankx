import { registerFormatType, toggleFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import {
    Popover,
    TextControl,
    SelectControl,
    Button,
    ColorPicker,
    ToggleControl,
    TabPanel,
    Flex,
    FlexBlock
} from '@wordpress/components';
import { comment } from '@wordpress/icons';
import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import './style.scss';
import { tooltipPositions } from './options';
import IconTooltip from './icon-tooltip';

const TooltipEffectUI = ({
    LABEL_POPOVER_TITLE,
    LABEL_TOOLTIP_TEXT,
    LABEL_APPLY_BUTTON,
    LABEL_TOOLTIP_POSITION,
    onChange,
    setTooltipText,
    tooltipText,
    popoverAnchor,
    tooltipBgColor,
    setTolltipBgColor,
    tooltipTextColor,
    setTooltipTextColor,
    tooltipPosition,
    setTooltipPosition,
    useGradient,
    setUseGradient,
    gradientStartColor,
    setGradientStartColor,
    gradientEndColor,
    setGradientEndColor,
    gradientDirection,
    setGradientDirection,
    onClose
}) => {

    const gradientDirections = [
        { label: __('To Right', 'jankx'), value: 'to right' },
        { label: __('To Left', 'jankx'), value: 'to left' },
        { label: __('To Bottom', 'jankx'), value: 'to bottom' },
        { label: __('To Top', 'jankx'), value: 'to top' },
        { label: __('Diagonal ↘', 'jankx'), value: 'to bottom right' },
        { label: __('Diagonal ↙', 'jankx'), value: 'to bottom left' },
    ];

    return (
        <Popover
            anchor={popoverAnchor}
            className="jankx-popover"
            onClose={onClose}
        >
            <div style={{ padding: '16px', width: '320px' }}>
                <h4 style={{ marginTop: 0, marginBottom: '16px' }}>{LABEL_POPOVER_TITLE}</h4>

                {/* Tooltip Text */}
                <TextControl
                    label={LABEL_TOOLTIP_TEXT}
                    value={tooltipText}
                    placeholder={__('Enter tooltip text', 'jankx')}
                    onChange={(value) => setTooltipText(value)}
                    style={{ marginBottom: '16px' }}
                />

                
                <SelectControl
                    label={LABEL_TOOLTIP_POSITION}
                    help={__('Select the position of the tooltip', 'jankx')}
                    value={tooltipPosition}
                    options={tooltipPositions}
                    onChange={(value) => setTooltipPosition(value)}
                    style={{ marginBottom: '16px' }}
                />

                
                <ToggleControl
                    label={__('Use Gradient Background', 'jankx')}
                    help={useGradient ?
                        __('Gradient background enabled', 'jankx') :
                        __('Solid color background', 'jankx')
                    }
                    checked={useGradient}
                    onChange={(value) => setUseGradient(value)}
                    style={{ marginBottom: '16px' }}
                />

                <TabPanel
                    className="tooltip-color-tabs"
                    activeClass="active-tab"
                    tabs={[
                        {
                            name: 'background',
                            title: __('Background', 'jankx'),
                            className: 'background-tab',
                        },
                        {
                            name: 'text',
                            title: __('Text Color', 'jankx'),
                            className: 'text-tab',
                        },
                    ]}
                >
                    {(tab) => (
                        <div style={{ marginTop: '12px' }}>
                            {tab.name === 'background' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {!useGradient ? (
                                        <div>
                                            <strong>{__('Background Color', 'jankx')}</strong>
                                            <ColorPicker
                                                color={tooltipBgColor}
                                                onChange={(color) => setTolltipBgColor(color)}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <strong>{__('Gradient Background', 'jankx')}</strong>

                                            {/* Gradient Direction */}
                                            <SelectControl
                                                label={__('Gradient Direction', 'jankx')}
                                                value={gradientDirection}
                                                options={gradientDirections}
                                                onChange={(value) => setGradientDirection(value)}
                                                style={{ marginBottom: '12px' }}
                                            />

                                            {/* Start Color */}
                                            <div style={{ marginBottom: '16px' }}>
                                                <strong>{__('Start Color', 'jankx')}</strong>
                                                <ColorPicker
                                                    color={gradientStartColor}
                                                    onChange={(color) => setGradientStartColor(color)}
                                                />
                                            </div>

                                            {/* End Color */}
                                            <div>
                                                <strong>{__('End Color', 'jankx')}</strong>
                                                <ColorPicker
                                                    color={gradientEndColor}
                                                    onChange={(color) => setGradientEndColor(color)}
                                                />
                                            </div>

                                            {/* Gradient Preview */}
                                            <div style={{ marginTop: '12px' }}>
                                                <strong>{__('Preview', 'jankx')}</strong>
                                                <div
                                                    style={{
                                                        height: '30px',
                                                        background: `linear-gradient(${gradientDirection}, ${gradientStartColor}, ${gradientEndColor})`,
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px',
                                                        marginTop: '4px'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {tab.name === 'text' && (
                                <div>
                                    <strong>{__('Text Color', 'jankx')}</strong>
                                    <ColorPicker
                                        color={tooltipTextColor}
                                        onChange={(color) => setTooltipTextColor(color)}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </TabPanel>

                <Flex justify="space-between" style={{ marginTop: '20px' }}>
                    <FlexBlock>
                        <Button
                            variant="secondary"
                            onClick={onClose}
                        >
                            {__('Cancel', 'jankx')}
                        </Button>
                    </FlexBlock>
                    <FlexBlock>
                        <Button
                            variant="primary"
                            onClick={onChange}
                        >
                            {LABEL_APPLY_BUTTON}
                        </Button>
                    </FlexBlock>
                </Flex>
            </div>
        </Popover>
    );
};

const TooltipEffect = ({ isActive, value, onChange, textDomain = "jankx" }) => {
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const [tooltipText, setTooltipText] = useState('Default Tooltip Text');
    const [popoverAnchor, setPopoverAnchor] = useState();
    const [tooltipBgColor, setTolltipBgColor] = useState('#000000');
    const [tooltipTextColor, setTooltipTextColor] = useState('#ffffff');
    const [tooltipPosition, setTooltipPosition] = useState('top');

    const [useGradient, setUseGradient] = useState(false);
    const [gradientStartColor, setGradientStartColor] = useState('#4f46e5');
    const [gradientEndColor, setGradientEndColor] = useState('#7c3aed');
    const [gradientDirection, setGradientDirection] = useState('to right');

    const LABEL_POPOVER_TITLE = __("Tooltip Settings", textDomain) || "Tooltip Settings";
    const LABEL_TOOLTIP_TEXT = __("Tooltip Text", textDomain) || "Tooltip Text";
    const LABEL_TOOLTIP_POSITION = __("Tooltip Position", textDomain) || "Tooltip Position";
    const LABEL_APPLY_BUTTON = __("Apply", textDomain) || "Apply";

    const applyTooltip = useCallback(() => {

        let backgroundStyle;
        if (useGradient) {
            backgroundStyle = `linear-gradient(${gradientDirection}, ${gradientStartColor}, ${gradientEndColor})`;
        } else {
            backgroundStyle = tooltipBgColor;
        }

        onChange(toggleFormat(value, {
            type: 'jankx/tooltip',
            attributes: {
                'data-tooltip': tooltipText,
                class: `tooltip-${tooltipPosition}`,
                style: `--tooltip-bg: ${backgroundStyle}; --tooltip-text-color: ${tooltipTextColor}; --tooltip-use-gradient: ${useGradient};`,
            }
        }));
    }, [value, onChange, tooltipText, tooltipBgColor, tooltipTextColor, tooltipPosition, useGradient, gradientStartColor, gradientEndColor, gradientDirection]);

    const handleTooltipClick = useCallback(() => {
        if (isActive) {
            setIsPopoverVisible(true);
        } else {
            setIsPopoverVisible(true);
        }
    }, [isActive, value, onChange]);

    return (
        <>
            <div ref={setPopoverAnchor}>
                <RichTextToolbarButton
                    icon={IconTooltip}
                    title={__('Add Tooltip', 'jankx')}
                    onClick={handleTooltipClick}
                    isActive={isActive}
                />
            </div>
            {isPopoverVisible && (
                <TooltipEffectUI
                    onClose={() => setIsPopoverVisible(false)}
                    onChange={() => {
                        applyTooltip();
                        setIsPopoverVisible(false);
                    }}
                    setTooltipText={setTooltipText}
                    tooltipText={tooltipText}
                    popoverAnchor={popoverAnchor}
                    tooltipBgColor={tooltipBgColor}
                    setTolltipBgColor={setTolltipBgColor}
                    tooltipTextColor={tooltipTextColor}
                    setTooltipTextColor={setTooltipTextColor}
                    tooltipPosition={tooltipPosition}
                    setTooltipPosition={setTooltipPosition}
                    useGradient={useGradient}
                    setUseGradient={setUseGradient}
                    gradientStartColor={gradientStartColor}
                    setGradientStartColor={setGradientStartColor}
                    gradientEndColor={gradientEndColor}
                    setGradientEndColor={setGradientEndColor}
                    gradientDirection={gradientDirection}
                    setGradientDirection={setGradientDirection}
                    LABEL_POPOVER_TITLE={LABEL_POPOVER_TITLE}
                    LABEL_TOOLTIP_TEXT={LABEL_TOOLTIP_TEXT}
                    LABEL_APPLY_BUTTON={LABEL_APPLY_BUTTON}
                    LABEL_TOOLTIP_POSITION={LABEL_TOOLTIP_POSITION}
                />
            )}
        </>
    );
};

registerFormatType('jankx/tooltip', {
    title: __('Tooltip', 'jankx'),
    tagName: 'span',
    className: 'jankx-tooltip',
    attributes: {
        'data-tooltip': 'data-tooltip',
        class: 'class',
        style: 'style',
    },
    edit: TooltipEffect,
});