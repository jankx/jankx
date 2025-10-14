import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, CheckboxControl, SelectControl, RangeControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Available social networks from vanilla-sharing
const AVAILABLE_NETWORKS = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'pinterest', label: 'Pinterest' },
    { value: 'reddit', label: 'Reddit' },
    { value: 'email', label: 'Email' },
    { value: 'copy', label: 'Copy Link' },
    { value: 'messenger', label: 'Messenger' },
    { value: 'viber', label: 'Viber' },
    { value: 'line', label: 'Line' },
];

const Edit = (props) => {
    const { attributes, setAttributes } = props;
    const { networks, iconSize, showLabels, style, alignment } = attributes;

    const blockProps = useBlockProps({
        className: `social-sharing-block alignment-${alignment}`,
    });

    const toggleNetwork = (network) => {
        const newNetworks = networks.includes(network)
            ? networks.filter((n) => n !== network)
            : [...networks, network];
        setAttributes({ networks: newNetworks });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Cài đặt mạng xã hội', 'jankx')} initialOpen={true}>
                    <p><strong>{__('Chọn các nền tảng chia sẻ:', 'jankx')}</strong></p>
                    {AVAILABLE_NETWORKS.map((network) => (
                        <CheckboxControl
                            key={network.value}
                            label={network.label}
                            checked={networks.includes(network.value)}
                            onChange={() => toggleNetwork(network.value)}
                        />
                    ))}
                </PanelBody>

                <PanelBody title={__('Hiển thị', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Kích thước icon', 'jankx')}
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
                        checked={showLabels}
                        onChange={(value) => setAttributes({ showLabels: value })}
                    />

                    <SelectControl
                        label={__('Kiểu hiển thị', 'jankx')}
                        value={style}
                        options={[
                            { label: __('Mặc định', 'jankx'), value: 'default' },
                            { label: __('Có viền', 'jankx'), value: 'outlined' },
                            { label: __('Đầy màu', 'jankx'), value: 'filled' },
                            { label: __('Tròn', 'jankx'), value: 'rounded' },
                        ]}
                        onChange={(value) => setAttributes({ style: value })}
                    />

                    <SelectControl
                        label={__('Căn chỉnh', 'jankx')}
                        value={alignment}
                        options={[
                            { label: __('Trái', 'jankx'), value: 'left' },
                            { label: __('Giữa', 'jankx'), value: 'center' },
                            { label: __('Phải', 'jankx'), value: 'right' },
                        ]}
                        onChange={(value) => setAttributes({ alignment: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className={`social-sharing-preview style-${style} size-${iconSize}`}>
                    {networks.length > 0 ? (
                        <>
                            <p className="sharing-title">
                                <strong>{__('Chia sẻ:', 'jankx')}</strong>
                            </p>
                            <div className="sharing-buttons">
                                {networks.map((network) => (
                                    <button
                                        key={network}
                                        className={`sharing-button ${network}`}
                                        disabled
                                    >
                                        <span className="sharing-icon">{network[0].toUpperCase()}</span>
                                        {showLabels && (
                                            <span className="sharing-label">
                                                {AVAILABLE_NETWORKS.find((n) => n.value === network)?.label}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="no-networks">
                            {__('Vui lòng chọn ít nhất một mạng xã hội từ panel bên phải', 'jankx')}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

registerBlockType('jankx/social-sharing', {
    edit: Edit,
    save: () => null, // Dynamic block, no save
});

