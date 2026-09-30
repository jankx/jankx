import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import metadata from './block.json';
import deprecated from './deprecated';
import { AVAILABLE_NETWORKS, getNetworkData } from './networks';
import { getShareUrl } from './shareUrls';

const { name } = metadata;

const Edit = (props) => {
    const { attributes, setAttributes, clientId } = props;
    const { network, iconSize, showLabel, customIcon, customLabel, url, title } = attributes;

    // Check if block has inner blocks
    const hasInnerBlocks = useSelect(
        (select) => {
            const { getBlockCount } = select('core/block-editor');
            return getBlockCount(clientId) > 0;
        },
        [clientId]
    );

    const networkData = getNetworkData(network);
    const displayIcon = customIcon || networkData.icon;
    const displayLabel = customLabel || networkData.label;

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

                    <TextControl
                        label={__('URL chia sẻ', 'jankx')}
                        value={url}
                        onChange={(value) => setAttributes({ url: value })}
                        help={__('Để trống để dùng URL của trang hiện tại', 'jankx')}
                    />

                    <TextControl
                        label={__('Tiêu đề chia sẻ', 'jankx')}
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        help={__('Để trống để dùng tiêu đề của trang hiện tại', 'jankx')}
                    />
                </PanelBody>

                <PanelBody title={__('Hiển thị', 'jankx')} initialOpen={true}>
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
                    <p className="components-base-control__help">
                        {__('Chèn block icon (Icon Picker, SVG Icon, hoặc Image) bên dưới để custom icon. Nếu không chèn, sẽ dùng icon mặc định hoặc icon text.', 'jankx')}
                    </p>

                    <TextControl
                        label={__('Icon tùy chỉnh (text)', 'jankx')}
                        value={customIcon}
                        onChange={(value) => setAttributes({ customIcon: value })}
                        help={__('Chỉ dùng khi không chèn block icon', 'jankx')}
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
                <a
                    className={`sharing-icon-button ${network} size-${iconSize}`}
                    data-network={network}
                    href={getShareUrl(network, url, title)}
                    aria-label={showLabel ? undefined : displayLabel}
                >
                    <span className="sharing-icon sharing-icon-with-fallback" data-fallback-icon={displayIcon}>
                        <InnerBlocks
                            allowedBlocks={['jankx/icon-picker', 'jankx/svg-icon', 'core/image']}
                            template={[]}
                            templateLock={false}
                            renderAppender={hasInnerBlocks ? undefined : InnerBlocks.ButtonBlockAppender}
                        />
                    </span>
                    {showLabel && <span className="sharing-label">{displayLabel}</span>}
                </a>
            </div>
        </>
    );
};

const Save = (props) => {
    const { attributes } = props;
    const { network, iconSize, showLabel, customIcon, customLabel, url, title } = attributes;
    const networkData = getNetworkData(network);
    const displayIcon = customIcon || networkData.icon;
    const displayLabel = customLabel || networkData.label;

    const blockProps = useBlockProps.save({
        className: 'social-sharing-icon-block',
    });

    return (
        <div {...blockProps}>
            <a
                className={`sharing-icon-button ${network} size-${iconSize}`}
                data-network={network}
                href={getShareUrl(network, url, title)}
                aria-label={showLabel ? undefined : displayLabel}
            >
                <span className="sharing-icon sharing-icon-with-fallback" data-fallback-icon={displayIcon}>
                    <InnerBlocks.Content />
                </span>
                {showLabel && <span className="sharing-label">{displayLabel}</span>}
            </a>
        </div>
    );
};

registerBlockType(name, {
    edit: Edit,
    save: Save,
    deprecated,
});

export { metadata, name };
