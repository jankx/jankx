import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, TextControl } from '@wordpress/components';
import './style.scss';
import './editor.scss';

type Position = 'left' | 'right';
type TriggerMode = 'toggle' | 'always';

interface Channels {
    messenger: { enabled: boolean; appId?: string; pageId?: string; label?: string };
    whatsapp: { enabled: boolean; phone?: string; label?: string };
    zalo: { enabled: boolean; phone?: string; label?: string };
    telegram: { enabled: boolean; username?: string; label?: string };
    phone: { enabled: boolean; phone?: string; label?: string };
    sms: { enabled: boolean; phone?: string; label?: string };
}

interface Attributes {
    position: Position;
    bottomOffset: string;
    showLabels: boolean;
    triggerMode: TriggerMode;
    channels: Channels;
}

function channelUrl(type: keyof Channels, channels: Channels): string {
    switch (type) {
        case 'messenger':
            if (channels.messenger.pageId) return `https://m.me/${channels.messenger.pageId}`;
            return '#';
        case 'whatsapp':
            if (channels.whatsapp.phone) return `https://wa.me/${channels.whatsapp.phone.replace(/\D/g, '')}`;
            return '#';
        case 'zalo':
            if (channels.zalo.phone) return `https://zalo.me/${channels.zalo.phone.replace(/\D/g, '')}`;
            return '#';
        case 'telegram':
            if (channels.telegram.username) return `https://t.me/${channels.telegram.username.replace(/^@/, '')}`;
            return '#';
        case 'phone':
            if (channels.phone.phone) return `tel:${channels.phone.phone.replace(/\s/g, '')}`;
            return '#';
        case 'sms':
            if (channels.sms.phone) return `sms:${channels.sms.phone.replace(/\s/g, '')}`;
            return '#';
        default:
            return '#';
    }
}

registerBlockType('jankx/floating-messengers', {
    edit: ({ attributes, setAttributes }: { attributes: Attributes; setAttributes: (a: Partial<Attributes>) => void }) => {
        const {
            position = 'right',
            bottomOffset = '24px',
            showLabels = false,
            triggerMode = 'toggle',
            channels = {
                messenger: { enabled: false, label: 'Messenger' },
                whatsapp: { enabled: false, label: 'WhatsApp' },
                zalo: { enabled: false, label: 'Zalo' },
                telegram: { enabled: false, label: 'Telegram' },
                phone: { enabled: false, label: 'Gọi' },
                sms: { enabled: false, label: 'SMS' },
            },
        } = attributes as Attributes;

        const blockProps = useBlockProps({
            className: `jankx-floating-messengers position-${position} trigger-${triggerMode} ${showLabels ? 'show-labels' : ''}`,
            style: { bottom: bottomOffset },
        });

        const enabledTypes: Array<keyof Channels> = (Object.keys(channels) as Array<keyof Channels>).filter(
            (t) => channels[t]?.enabled
        );

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Vị trí hiển thị', 'jankx')} initialOpen={true}>
                        <SelectControl
                            label={__('Vị trí', 'jankx')}
                            value={position}
                            options={[
                                { label: __('Bên trái', 'jankx'), value: 'left' },
                                { label: __('Bên phải', 'jankx'), value: 'right' },
                            ]}
                            onChange={(value: Position) => setAttributes({ position: value })}
                        />
                        <TextControl
                            label={__('Khoảng cách dưới', 'jankx')}
                            value={bottomOffset}
                            onChange={(value) => setAttributes({ bottomOffset: value })}
                            help={__('Ví dụ: 24px, 2rem', 'jankx')}
                        />
                        <SelectControl
                            label={__('Chế độ hiển thị', 'jankx')}
                            value={triggerMode}
                            options={[
                                { label: __('Nút toggle', 'jankx'), value: 'toggle' },
                                { label: __('Luôn hiển thị', 'jankx'), value: 'always' },
                            ]}
                            onChange={(value: TriggerMode) => setAttributes({ triggerMode: value })}
                        />
                        <ToggleControl
                            label={__('Hiển thị nhãn', 'jankx')}
                            checked={showLabels}
                            onChange={(value: boolean) => setAttributes({ showLabels: value })}
                        />
                    </PanelBody>

                    <PanelBody title={__('Kênh liên hệ', 'jankx')} initialOpen={true}>
                        <ToggleControl
                            label={__('Messenger', 'jankx')}
                            checked={!!channels.messenger?.enabled}
                            onChange={(value) => setAttributes({ channels: { ...channels, messenger: { ...(channels.messenger || {}), enabled: value } } })}
                        />
                        {!!channels.messenger?.enabled && (
                            <>
                                <TextControl
                                    label={__('Page ID/User', 'jankx')}
                                    value={channels.messenger?.pageId || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, messenger: { ...(channels.messenger || {}), pageId: value } },
                                        })
                                    }
                                />
                                <TextControl
                                    label={__('Label', 'jankx')}
                                    value={channels.messenger?.label || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, messenger: { ...(channels.messenger || {}), label: value } },
                                        })
                                    }
                                />
                            </>
                        )}

                        <ToggleControl
                            label={__('WhatsApp', 'jankx')}
                            checked={!!channels.whatsapp?.enabled}
                            onChange={(value) => setAttributes({ channels: { ...channels, whatsapp: { ...(channels.whatsapp || {}), enabled: value } } })}
                        />
                        {!!channels.whatsapp?.enabled && (
                            <>
                                <TextControl
                                    label={__('Số điện thoại', 'jankx')}
                                    value={channels.whatsapp?.phone || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, whatsapp: { ...(channels.whatsapp || {}), phone: value } },
                                        })
                                    }
                                />
                                <TextControl
                                    label={__('Label', 'jankx')}
                                    value={channels.whatsapp?.label || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, whatsapp: { ...(channels.whatsapp || {}), label: value } },
                                        })
                                    }
                                />
                            </>
                        )}

                        <ToggleControl
                            label={__('Zalo', 'jankx')}
                            checked={!!channels.zalo?.enabled}
                            onChange={(value) => setAttributes({ channels: { ...channels, zalo: { ...(channels.zalo || {}), enabled: value } } })}
                        />
                        {!!channels.zalo?.enabled && (
                            <>
                                <TextControl
                                    label={__('Số điện thoại', 'jankx')}
                                    value={channels.zalo?.phone || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, zalo: { ...(channels.zalo || {}), phone: value } },
                                        })
                                    }
                                />
                                <TextControl
                                    label={__('Label', 'jankx')}
                                    value={channels.zalo?.label || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, zalo: { ...(channels.zalo || {}), label: value } },
                                        })
                                    }
                                />
                            </>
                        )}

                        <ToggleControl
                            label={__('Telegram', 'jankx')}
                            checked={!!channels.telegram?.enabled}
                            onChange={(value) => setAttributes({ channels: { ...channels, telegram: { ...(channels.telegram || {}), enabled: value } } })}
                        />
                        {!!channels.telegram?.enabled && (
                            <>
                                <TextControl
                                    label={__('Username', 'jankx')}
                                    value={channels.telegram?.username || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, telegram: { ...(channels.telegram || {}), username: value.replace(/^@/, '') } },
                                        })
                                    }
                                />
                                <TextControl
                                    label={__('Label', 'jankx')}
                                    value={channels.telegram?.label || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, telegram: { ...(channels.telegram || {}), label: value } },
                                        })
                                    }
                                />
                            </>
                        )}

                        <ToggleControl
                            label={__('Gọi điện', 'jankx')}
                            checked={!!channels.phone?.enabled}
                            onChange={(value) => setAttributes({ channels: { ...channels, phone: { ...(channels.phone || {}), enabled: value } } })}
                        />
                        {!!channels.phone?.enabled && (
                            <>
                                <TextControl
                                    label={__('Số điện thoại', 'jankx')}
                                    value={channels.phone?.phone || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, phone: { ...(channels.phone || {}), phone: value } },
                                        })
                                    }
                                />
                                <TextControl
                                    label={__('Label', 'jankx')}
                                    value={channels.phone?.label || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, phone: { ...(channels.phone || {}), label: value } },
                                        })
                                    }
                                />
                            </>
                        )}

                        <ToggleControl
                            label={__('SMS', 'jankx')}
                            checked={!!channels.sms?.enabled}
                            onChange={(value) => setAttributes({ channels: { ...channels, sms: { ...(channels.sms || {}), enabled: value } } })}
                        />
                        {!!channels.sms?.enabled && (
                            <>
                                <TextControl
                                    label={__('Số điện thoại', 'jankx')}
                                    value={channels.sms?.phone || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, sms: { ...(channels.sms || {}), phone: value } },
                                        })
                                    }
                                />
                                <TextControl
                                    label={__('Label', 'jankx')}
                                    value={channels.sms?.label || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, sms: { ...(channels.sms || {}), label: value } },
                                        })
                                    }
                                />
                            </>
                        )}
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    {triggerMode === 'toggle' && (
                        <button className="fm-trigger" aria-label={__('Mở danh sách liên hệ', 'jankx')} type="button">
                            +
                        </button>
                    )}
                    <div className="fm-list">
                        {enabledTypes.length === 0 ? (
                            <div className="fm-placeholder">{__('Chọn kênh liên hệ trong panel bên phải', 'jankx')}</div>
                        ) : (
                            enabledTypes.map((t) => {
                                const label =
                                    channels[t]?.label ||
                                    (t === 'phone' ? __('Gọi', 'jankx') : t.charAt(0).toUpperCase() + t.slice(1));
                                return (
                                    <a key={t} className={`fm-item fm-${t}`} href={channelUrl(t, channels)} target="_blank" rel="noopener">
                                        <span className="fm-icon" aria-hidden="true" />
                                        {showLabels && <span className="fm-label">{label}</span>}
                                    </a>
                                );
                            })
                        )}
                    </div>
                </div>
            </>
        );
    },
    save: () => null,
});

