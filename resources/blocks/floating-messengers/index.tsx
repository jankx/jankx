import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, TextControl, RangeControl, TextareaControl } from '@wordpress/components';
import './style.scss';
import './editor.scss';

type Position = 'left' | 'right';
type TriggerMode = 'toggle' | 'always';
type ExpandStyle = 'vertical' | 'fan' | 'bidirectional' | 'split';
type VerticalAlign = 'bottom' | 'center';
type IdleAnimation = 'none' | 'pulse-ring' | 'wiggle' | 'float';

interface Channels {
    messenger: { enabled: boolean; appId?: string; pageId?: string; label?: string; iconSvg?: string };
    whatsapp: { enabled: boolean; phone?: string; label?: string; iconSvg?: string };
    zalo: { enabled: boolean; phone?: string; label?: string; iconSvg?: string };
    telegram: { enabled: boolean; username?: string; label?: string; iconSvg?: string };
    phone: { enabled: boolean; phone?: string; label?: string; iconSvg?: string };
    sms: { enabled: boolean; phone?: string; label?: string; iconSvg?: string };
}

interface Attributes {
    expandStyle: ExpandStyle;
    verticalAlign: VerticalAlign;
    expandDistance: number;
    idleAnimation: IdleAnimation;
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
            expandStyle = 'vertical',
            verticalAlign = 'bottom',
            expandDistance = 72,
            idleAnimation = 'none',
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
            className: [
                'jankx-floating-messengers',
                `position-${position}`,
                `trigger-${triggerMode}`,
                `expand-${expandStyle}`,
                `v-${verticalAlign}`,
                idleAnimation !== 'none' ? `idle-${idleAnimation}` : '',
                showLabels ? 'show-labels' : '',
            ].filter(Boolean).join(' '),
            style: verticalAlign === 'bottom' ? { bottom: bottomOffset } : { top: '50%', transform: 'translateY(-50%)' },
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
                        <SelectControl
                            label={__('Căn theo trục Y', 'jankx')}
                            value={verticalAlign}
                            options={[
                                { label: __('Dưới cùng', 'jankx'), value: 'bottom' },
                                { label: __('Giữa màn hình', 'jankx'), value: 'center' },
                            ]}
                            onChange={(value: VerticalAlign) => setAttributes({ verticalAlign: value })}
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
                    <PanelBody title={__('Kiểu bung nút', 'jankx')} initialOpen={true}>
                        <SelectControl
                            label={__('Kiểu bung', 'jankx')}
                            value={expandStyle}
                            options={[
                                { label: __('Thẳng đứng', 'jankx'), value: 'vertical' },
                                { label: __('Xòe quạt', 'jankx'), value: 'fan' },
                                { label: __('Hai bên', 'jankx'), value: 'bidirectional' },
                                { label: __('Tách trên/dưới', 'jankx'), value: 'split' },
                            ]}
                            onChange={(value: ExpandStyle) => setAttributes({ expandStyle: value })}
                        />
                        <RangeControl
                            label={__('Khoảng cách bung (px)', 'jankx')}
                            value={expandDistance}
                            onChange={(value?: number) => setAttributes({ expandDistance: value || 72 })}
                            min={40}
                            max={160}
                        />
                    </PanelBody>
                    <PanelBody title={__('Hiệu ứng rảnh', 'jankx')} initialOpen={false}>
                        <SelectControl
                            label={__('Items Idle Animation', 'jankx')}
                            value={idleAnimation}
                            options={[
                                { label: __('Không', 'jankx'), value: 'none' },
                                { label: __('Pulsating Ring', 'jankx'), value: 'pulse-ring' },
                                { label: __('Wiggle', 'jankx'), value: 'wiggle' },
                                { label: __('Float', 'jankx'), value: 'float' },
                            ]}
                            onChange={(value: IdleAnimation) => setAttributes({ idleAnimation: value })}
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
                                <TextareaControl
                                    label={__('SVG Icon', 'jankx')}
                                    help={__('Dán mã SVG để tùy chỉnh icon', 'jankx')}
                                    value={channels.messenger?.iconSvg || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, messenger: { ...(channels.messenger || {}), iconSvg: value } },
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
                                <TextareaControl
                                    label={__('SVG Icon', 'jankx')}
                                    help={__('Dán mã SVG để tùy chỉnh icon', 'jankx')}
                                    value={channels.whatsapp?.iconSvg || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, whatsapp: { ...(channels.whatsapp || {}), iconSvg: value } },
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
                                <TextareaControl
                                    label={__('SVG Icon', 'jankx')}
                                    help={__('Dán mã SVG để tùy chỉnh icon', 'jankx')}
                                    value={channels.zalo?.iconSvg || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, zalo: { ...(channels.zalo || {}), iconSvg: value } },
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
                                <TextareaControl
                                    label={__('SVG Icon', 'jankx')}
                                    help={__('Dán mã SVG để tùy chỉnh icon', 'jankx')}
                                    value={channels.telegram?.iconSvg || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, telegram: { ...(channels.telegram || {}), iconSvg: value } },
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
                                <TextareaControl
                                    label={__('SVG Icon', 'jankx')}
                                    help={__('Dán mã SVG để tùy chỉnh icon', 'jankx')}
                                    value={channels.phone?.iconSvg || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, phone: { ...(channels.phone || {}), iconSvg: value } },
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
                                <TextareaControl
                                    label={__('SVG Icon', 'jankx')}
                                    help={__('Dán mã SVG để tùy chỉnh icon', 'jankx')}
                                    value={channels.sms?.iconSvg || ''}
                                    onChange={(value) =>
                                        setAttributes({
                                            channels: { ...channels, sms: { ...(channels.sms || {}), iconSvg: value } },
                                        })
                                    }
                                />
                            </>
                        )}
                    </PanelBody>
                </InspectorControls>
                <div 
                    {...blockProps} 
                    data-count={enabledTypes.length} 
                    style={{ 
                        ...(blockProps.style || {}), 
                        position: 'fixed',
                        zIndex: 9999,
                        left: position === 'left' ? '24px' : 'auto',
                        right: position === 'right' ? '24px' : 'auto',
                        bottom: verticalAlign === 'bottom' ? bottomOffset : 'auto',
                        top: verticalAlign === 'center' ? '50%' : 'auto',
                        transform: verticalAlign === 'center' ? 'translateY(-50%)' : 'none',
                        ['--fm-distance' as any]: `${expandDistance}px` 
                    }}
                >
                    {triggerMode === 'toggle' && (
                        <button className="fm-trigger" aria-label={__('Mở danh sách liên hệ', 'jankx')} type="button">
                            <span className="fm-trigger-dot" />
                        </button>
                    )}
                    <div className="fm-list">
                        {enabledTypes.length === 0 ? (
                            <div className="fm-placeholder">{__('Chọn kênh liên hệ trong panel bên phải', 'jankx')}</div>
                        ) : (
                            enabledTypes.map((t, idx) => {
                                const label =
                                    channels[t]?.label ||
                                    (t === 'phone' ? __('Gọi', 'jankx') : t.charAt(0).toUpperCase() + t.slice(1));
                                const customSvg = channels[t as keyof Channels]?.iconSvg;
                                const svgIcon = (() => {
                                    switch (t) {
                                        case 'messenger':
                                            return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.09 2 10.91c0 2.73 1.41 5.18 3.67 6.87v3.22l3.36-1.85c.93.26 1.92.4 2.97.4 5.52 0 10-4.09 10-8.91S17.52 2 12 2zm1.23 10.46l-2.1-2.23-4.1 2.23 4.51-4.87 2.15 2.23 4.03-2.23-4.49 4.87z"/></svg>;
                                        case 'whatsapp':
                                            return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M20.52 3.48A10.69 10.69 0 0012 0C5.37 0 0 5.37 0 12c0 2.1.56 4.16 1.62 5.97L0 24l6.2-1.63A11.97 11.97 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.22-3.48-8.52zm-8.52 18.3c-1.9 0-3.76-.5-5.38-1.45l-.38-.22-3.69.97.99-3.59-.25-.37A9.47 9.47 0 012.56 12C2.56 6.74 6.74 2.56 12 2.56c2.52 0 4.89.98 6.67 2.77a9.41 9.41 0 012.77 6.67c0 5.26-4.18 9.44-9.44 9.44zm5.48-6.96c-.3-.15-1.77-.87-2.05-.96-.28-.1-.48-.15-.68.15-.2.3-.78.95-.96 1.15-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.46-.89-.79-1.49-1.77-1.67-2.07-.18-.3-.02-.47.13-.62.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.65-.94-2.26-.25-.6-.5-.52-.68-.53l-.58-.01c-.2 0-.53.08-.82.38-.3.3-1.08 1.06-1.08 2.58 0 1.51 1.11 2.97 1.26 3.18.15.2 2.18 3.34 5.27 4.54.74.32 1.32.5 1.77.64.74.23 1.41.2 1.94.12.59-.09 1.77-.72 2.02-1.41.25-.69.25-1.28.18-1.41-.07-.13-.27-.2-.58-.34z"/></svg>;
                                        case 'zalo':
                                            return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M4 3h12a5 5 0 015 5v8a5 5 0 01-5 5H4a1 1 0 01-1-1V4a1 1 0 011-1zm3.5 6.5h-2V17h2V9.5zm1.5 0V17h5v-1.5h-3.5V9.5H9zm9.5 0H16V17h2v-4h1.5V9.5z"/></svg>;
                                        case 'telegram':
                                            return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M23.5 2.5L1.5 11.2c-1 .4-.9 1.8.2 2.1l5.5 1.7 2.1 6.7c.3 1 1.6 1.2 2.2.2l3.3-5.2 5.8 4.3c1 .7 2.3.1 2.6-1.1l3.2-15c.3-1.2-1-2.1-2.1-1.6z"/></svg>;
                                        case 'phone':
                                            return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M6.6 10.2c1.2 2.4 3.1 4.3 5.5 5.5l1.8-1.8c.4-.4 1-.5 1.5-.3 1.6.5 3.3.8 5.1.8.8 0 1.5.7 1.5 1.5V20c0 .8-.7 1.5-1.5 1.5C10.7 21.5 2.5 13.3 2.5 3.5 2.5 2.7 3.2 2 4 2h3.6c.8 0 1.5.7 1.5 1.5 0 1.8.3 3.5.8 5.1.2.5.1 1.1-.3 1.5l-2 2.1z"/></svg>;
                                        case 'sms':
                                            return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M20 2H4C2.9 2 2 2.9 2 4v14c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-4H6V6h12v2zm-6 8H6v-2h6v2z"/></svg>;
                                        default:
                                            return null;
                                    }
                                })();
                                return (
                                    <div key={t} className={`fm-node fm-${t}`} style={{ ['--index' as any]: idx + 1 }}>
                                        <a className={`fm-button`} href={channelUrl(t, channels)} target="_blank" rel="noopener" aria-label={label}>
                                            {customSvg ? (
                                                <span className="fm-icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: customSvg }} />
                                            ) : (
                                                <span className="fm-icon" aria-hidden="true">{svgIcon}</span>
                                            )}
                                            {showLabels && <span className="fm-label">{label}</span>}
                                            {!showLabels && <span className="fm-tooltip">{label}</span>}
                                        </a>
                                    </div>
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
