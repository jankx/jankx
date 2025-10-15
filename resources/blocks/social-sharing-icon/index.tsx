import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Available social networks
const AVAILABLE_NETWORKS = [
    { value: 'facebook', label: 'Facebook', icon: 'f' },
    { value: 'twitter', label: 'Twitter/X', icon: '𝕏' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'in' },
    { value: 'whatsapp', label: 'WhatsApp', icon: 'W' },
    { value: 'telegram', label: 'Telegram', icon: 'T' },
    { value: 'pinterest', label: 'Pinterest', icon: 'P' },
    { value: 'reddit', label: 'Reddit', icon: 'R' },
    { value: 'email', label: 'Email', icon: '@' },
    { value: 'copy', label: 'Copy Link', icon: '🔗' },
    { value: 'messenger', label: 'Messenger', icon: 'M' },
    { value: 'viber', label: 'Viber', icon: 'V' },
    { value: 'line', label: 'Line', icon: 'L' },
];

const getNetworkData = (network: string) => {
    return AVAILABLE_NETWORKS.find((n) => n.value === network) || AVAILABLE_NETWORKS[0];
};

const SharingIconButton = ({ attributes }) => {
    const { network, iconStyle, iconSize, showLabel, customIcon, customLabel } = attributes;
    const networkData = getNetworkData(network);
    const displayIcon = customIcon || networkData.icon;
    const displayLabel = customLabel || networkData.label;

    return (
        <button
            className={`sharing-icon-button ${network} style-${iconStyle} size-${iconSize}`}
            data-network={network}
            type="button"
        >
            <span className="sharing-icon">{displayIcon}</span>
            {showLabel && <span className="sharing-label">{displayLabel}</span>}
        </button>
    );
};

const Edit = (props) => {
    const { attributes, setAttributes } = props;
    const { network, iconStyle, iconSize, showLabel, customIcon, customLabel } = attributes;

    const blockProps = useBlockProps({
        className: 'social-sharing-icon-block',
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Cài đặt mạng xã hội', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Mạng xã hội', 'jankx')}
                        value={network}
                        options={AVAILABLE_NETWORKS.map((n) => ({
                            label: n.label,
                            value: n.value,
                        }))}
                        onChange={(value) => setAttributes({ network: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Kiểu hiển thị', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Kiểu icon', 'jankx')}
                        value={iconStyle}
                        options={[
                            { label: __('Mặc định', 'jankx'), value: 'default' },
                            { label: __('Có viền', 'jankx'), value: 'outlined' },
                            { label: __('Đầy màu', 'jankx'), value: 'filled' },
                            { label: __('Tròn', 'jankx'), value: 'rounded' },
                            { label: __('Vuông', 'jankx'), value: 'square' },
                        ]}
                        onChange={(value) => setAttributes({ iconStyle: value })}
                    />

                    <SelectControl
                        label={__('Kích thước', 'jankx')}
                        value={iconSize}
                        options={[
                            { label: __('Nhỏ', 'jankx'), value: 'small' },
                            { label: __('Trung bình', 'jankx'), value: 'medium' },
                            { label: __('Lớn', 'jankx'), value: 'large' },
                        ]}
                        onChange={(value) => setAttributes({ iconSize: value })}
                    />

                    <ToggleControl
                        label={__('Hiển thị nhãn', 'jankx')}
                        checked={showLabel}
                        onChange={(value) => setAttributes({ showLabel: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Tùy chỉnh', 'jankx')} initialOpen={false}>
                    <TextControl
                        label={__('Icon tùy chỉnh', 'jankx')}
                        value={customIcon}
                        onChange={(value) => setAttributes({ customIcon: value })}
                        help={__('Để trống để dùng icon mặc định', 'jankx')}
                    />

                    <TextControl
                        label={__('Nhãn tùy chỉnh', 'jankx')}
                        value={customLabel}
                        onChange={(value) => setAttributes({ customLabel: value })}
                        help={__('Để trống để dùng nhãn mặc định', 'jankx')}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <SharingIconButton attributes={attributes} />
            </div>
        </>
    );
};

const Save = (props) => {
    const { attributes } = props;
    const blockProps = useBlockProps.save({
        className: 'social-sharing-icon-block',
    });

    return (
        <div {...blockProps}>
            <SharingIconButton attributes={attributes} />
        </div>
    );
};

registerBlockType('jankx/social-sharing-icon', {
    edit: Edit,
    save: Save,
});

