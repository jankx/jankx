import { __ } from '@wordpress/i18n';
import {
    PanelBody,
    ToggleControl,
    TextControl,
    RangeControl,
    SelectControl,
    ButtonGroup,
    Button
} from '@wordpress/components';

const DisplaySettings = ({ attributes, setAttributes }) => {
    const { displaySettings, styling } = attributes;

    const updateDisplaySettings = (key, value) => {
        setAttributes({
            displaySettings: {
                ...displaySettings,
                [key]: value
            }
        });
    };

    const updateStyling = (key, value) => {
        setAttributes({
            styling: {
                ...styling,
                [key]: value
            }
        });
    };

    return (
        <div className="jankx-advanced-filter-display-settings">
            <PanelBody title={__('Cài đặt hiển thị', 'jankx')} initialOpen={true}>
                <ToggleControl
                    label={__('Hiển thị nhãn', 'jankx')}
                    checked={displaySettings.showLabel || false}
                    onChange={(value) => updateDisplaySettings('showLabel', value)}
                />

                {displaySettings.showLabel && (
                    <TextControl
                        label={__('Text nhãn', 'jankx')}
                        value={displaySettings.labelText || ''}
                        onChange={(value) => updateDisplaySettings('labelText', value)}
                        placeholder={__('Lọc theo:', 'jankx')}
                    />
                )}

                <ToggleControl
                    label={__('Hiển thị nút reset', 'jankx')}
                    checked={displaySettings.showReset || false}
                    onChange={(value) => updateDisplaySettings('showReset', value)}
                />

                {displaySettings.showReset && (
                    <TextControl
                        label={__('Text nút reset', 'jankx')}
                        value={displaySettings.resetText || ''}
                        onChange={(value) => updateDisplaySettings('resetText', value)}
                        placeholder={__('Xóa bộ lọc', 'jankx')}
                    />
                )}

                <ToggleControl
                    label={__('Hiển thị số lượng', 'jankx')}
                    checked={displaySettings.showCount || false}
                    onChange={(value) => updateDisplaySettings('showCount', value)}
                />

                <ToggleControl
                    label={__('Hiển thị loading', 'jankx')}
                    checked={displaySettings.showLoading || false}
                    onChange={(value) => updateDisplaySettings('showLoading', value)}
                />

                <ToggleControl
                    label={__('Responsive', 'jankx')}
                    checked={displaySettings.responsive || false}
                    onChange={(value) => updateDisplaySettings('responsive', value)}
                />
            </PanelBody>

            <PanelBody title={__('Cài đặt AJAX', 'jankx')} initialOpen={false}>
                <ToggleControl
                    label={__('Bật AJAX', 'jankx')}
                    checked={attributes.ajaxSettings?.enabled || false}
                    onChange={(value) => setAttributes({
                        ajaxSettings: {
                            ...attributes.ajaxSettings,
                            enabled: value
                        }
                    })}
                />

                {attributes.ajaxSettings?.enabled && (
                    <>
                        <TextControl
                            label={__('Text loading', 'jankx')}
                            value={attributes.ajaxSettings.loadingText || ''}
                            onChange={(value) => setAttributes({
                                ajaxSettings: {
                                    ...attributes.ajaxSettings,
                                    loadingText: value
                                }
                            })}
                            placeholder={__('Đang tải...', 'jankx')}
                        />

                        <TextControl
                            label={__('Text lỗi', 'jankx')}
                            value={attributes.ajaxSettings.errorText || ''}
                            onChange={(value) => setAttributes({
                                ajaxSettings: {
                                    ...attributes.ajaxSettings,
                                    errorText: value
                                }
                            })}
                            placeholder={__('Có lỗi xảy ra', 'jankx')}
                        />

                        <ToggleControl
                            label={__('Cập nhật URL', 'jankx')}
                            checked={attributes.ajaxSettings.updateURL || false}
                            onChange={(value) => setAttributes({
                                ajaxSettings: {
                                    ...attributes.ajaxSettings,
                                    updateURL: value
                                }
                            })}
                        />

                        <ToggleControl
                            label={__('Cuộn đến kết quả', 'jankx')}
                            checked={attributes.ajaxSettings.scrollToResults || false}
                            onChange={(value) => setAttributes({
                                ajaxSettings: {
                                    ...attributes.ajaxSettings,
                                    scrollToResults: value
                                }
                            })}
                        />

                        <RangeControl
                            label={__('Thời gian animation (ms)', 'jankx')}
                            value={attributes.ajaxSettings.animationDuration || 300}
                            onChange={(value) => setAttributes({
                                ajaxSettings: {
                                    ...attributes.ajaxSettings,
                                    animationDuration: value
                                }
                            })}
                            min={100}
                            max={1000}
                            step={50}
                        />

                        <RangeControl
                            label={__('Delay debounce (ms)', 'jankx')}
                            value={attributes.ajaxSettings.debounceDelay || 300}
                            onChange={(value) => setAttributes({
                                ajaxSettings: {
                                    ...attributes.ajaxSettings,
                                    debounceDelay: value
                                }
                            })}
                            min={100}
                            max={1000}
                            step={50}
                        />
                    </>
                )}
            </PanelBody>

            <PanelBody title={__('Styling', 'jankx')} initialOpen={false}>
                <SelectControl
                    label={__('Layout', 'jankx')}
                    value={styling.layout || 'horizontal'}
                    options={[
                        { label: __('Ngang', 'jankx'), value: 'horizontal' },
                        { label: __('Dọc', 'jankx'), value: 'vertical' },
                        { label: __('Grid', 'jankx'), value: 'grid' }
                    ]}
                    onChange={(value) => updateStyling('layout', value)}
                />

                <RangeControl
                    label={__('Khoảng cách (px)', 'jankx')}
                    value={styling.gap || 15}
                    onChange={(value) => updateStyling('gap', value)}
                    min={0}
                    max={50}
                    step={5}
                />

                <RangeControl
                    label={__('Border radius (px)', 'jankx')}
                    value={styling.borderRadius || 8}
                    onChange={(value) => updateStyling('borderRadius', value)}
                    min={0}
                    max={20}
                    step={1}
                />

                <SelectControl
                    label={__('Shadow', 'jankx')}
                    value={styling.shadow || 'none'}
                    options={[
                        { label: __('Không', 'jankx'), value: 'none' },
                        { label: __('Nhẹ', 'jankx'), value: 'light' },
                        { label: __('Trung bình', 'jankx'), value: 'medium' },
                        { label: __('Đậm', 'jankx'), value: 'heavy' }
                    ]}
                    onChange={(value) => updateStyling('shadow', value)}
                />

                <TextControl
                    label={__('Màu nền', 'jankx')}
                    value={styling.backgroundColor || ''}
                    onChange={(value) => updateStyling('backgroundColor', value)}
                    placeholder={__('transparent', 'jankx')}
                />

                <TextControl
                    label={__('Màu chữ', 'jankx')}
                    value={styling.textColor || ''}
                    onChange={(value) => updateStyling('textColor', value)}
                    placeholder={__('inherit', 'jankx')}
                />
            </PanelBody>
        </div>
    );
};

export default DisplaySettings;
