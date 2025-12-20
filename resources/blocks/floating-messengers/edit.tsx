import { __ } from '@wordpress/i18n';
import {
  PanelBody,
  SelectControl,
  RangeControl,
  TextControl,
  ToggleControl,
  ColorPalette,
} from '@wordpress/components';
import {
  InspectorControls,
  useBlockProps,
} from '@wordpress/block-editor';
import { useMemo } from '@wordpress/element';

type MessengerItem = {
  id: string;
  name: string;
  enabled: boolean;
  color: string;
  url: string;
  iconLabel?: string;
};

interface EditProps {
  attributes: {
    positionX: 'left' | 'right';
    positionY: 'bottom' | 'center';
    offsetBottom: number;
    expansionStyle: 'vertical' | 'horizontal' | 'fan' | 'split';
    idleAnimation: 'none' | 'pulse-ring' | 'wiggle' | 'float';
    spacing: number;
    messengers: MessengerItem[];
  };
  setAttributes: (attrs: Partial<EditProps['attributes']>) => void;
}

const presetColors = [
  { name: 'Blue', color: '#0068FF' },
  { name: 'Light Blue', color: '#00B2FF' },
  { name: 'Pink', color: '#E1306C' },
  { name: 'Teal', color: '#34D399' },
  { name: 'Telegram', color: '#229ED9' },
  { name: 'Black', color: '#111827' },
  { name: 'Gray', color: '#6B7280' },
  { name: 'Indigo', color: '#4F46E5' },
];

export default function Edit(props: EditProps) {
  const { attributes, setAttributes } = props;
  const {
    positionX = 'right',
    positionY = 'bottom',
    offsetBottom = 24,
    expansionStyle = 'vertical',
    idleAnimation = 'none',
    spacing = 60,
    messengers = [],
  } = attributes;

  const blockProps = useBlockProps({
    className: 'jankx-floating-messengers',
  });

  const enabledMessengers = useMemo(
    () => (Array.isArray(messengers) ? messengers.filter((m) => m.enabled) : []),
    [messengers]
  );

  const updateMessenger = (id: string, patch: Partial<MessengerItem>) => {
    const next = (messengers || []).map((m) => (m.id === id ? { ...m, ...patch } : m));
    setAttributes({ messengers: next });
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Vị trí & Hiển thị', 'jankx')} initialOpen={true}>
          <SelectControl
            label={__('Trục X', 'jankx')}
            value={positionX}
            options={[
              { label: __('Trái', 'jankx'), value: 'left' },
              { label: __('Phải', 'jankx'), value: 'right' },
            ]}
            onChange={(value: any) => setAttributes({ positionX: value })}
          />
          <SelectControl
            label={__('Trục Y', 'jankx')}
            value={positionY}
            options={[
              { label: __('Dưới', 'jankx'), value: 'bottom' },
              { label: __('Giữa', 'jankx'), value: 'center' },
            ]}
            onChange={(value: any) => setAttributes({ positionY: value })}
          />
          {positionY === 'bottom' && (
            <RangeControl
              label={__('Khoảng cách so với đáy (px)', 'jankx')}
              value={offsetBottom}
              min={10}
              max={200}
              onChange={(val: number) => setAttributes({ offsetBottom: val })}
            />
          )}
          <SelectControl
            label={__('Kiểu bung ra', 'jankx')}
            value={expansionStyle}
            options={[
              { label: __('Dọc', 'jankx'), value: 'vertical' },
              { label: __('Ngang', 'jankx'), value: 'horizontal' },
              { label: __('Quạt', 'jankx'), value: 'fan' },
              { label: __('Tách đôi', 'jankx'), value: 'split' },
            ]}
            onChange={(value: any) => setAttributes({ expansionStyle: value })}
          />
          <SelectControl
            label={__('Hiệu ứng nghỉ của item', 'jankx')}
            value={idleAnimation}
            options={[
              { label: __('Không', 'jankx'), value: 'none' },
              { label: __('Vòng tròn đập', 'jankx'), value: 'pulse-ring' },
              { label: __('Lắc', 'jankx'), value: 'wiggle' },
              { label: __('Nổi', 'jankx'), value: 'float' },
            ]}
            onChange={(value: any) => setAttributes({ idleAnimation: value })}
          />
          <RangeControl
            label={__('Khoảng cách giữa item (px)', 'jankx')}
            value={spacing}
            min={40}
            max={120}
            onChange={(val: number) => setAttributes({ spacing: val })}
          />
        </PanelBody>

        <PanelBody title={__('Cấu hình từng Messenger', 'jankx')} initialOpen={true}>
          {(messengers || []).map((m) => (
            <div key={m.id} style={{ borderTop: '1px solid #eee', paddingTop: 12, marginTop: 12 }}>
              <ToggleControl
                label={`${m.name} (${m.id})`}
                checked={!!m.enabled}
                onChange={(checked) => updateMessenger(m.id, { enabled: checked })}
              />
              {m.enabled && (
                <>
                  <TextControl
                    label={__('Tên hiển thị', 'jankx')}
                    value={m.name}
                    onChange={(val) => updateMessenger(m.id, { name: val })}
                  />
                  <TextControl
                    label={__('Đường dẫn/URL', 'jankx')}
                    value={m.url}
                    onChange={(val) => updateMessenger(m.id, { url: val })}
                  />
                  <TextControl
                    label={__('Ký tự/Icon Label (tuỳ chọn)', 'jankx')}
                    value={m.iconLabel || ''}
                    onChange={(val) => updateMessenger(m.id, { iconLabel: val })}
                  />
                  <div style={{ marginTop: 8 }}>
                    <span style={{ display: 'block', marginBottom: 6 }}>{__('Màu nền', 'jankx')}</span>
                    <ColorPalette
                      colors={presetColors}
                      value={m.color}
                      onChange={(val?: string) => updateMessenger(m.id, { color: val || m.color })}
                      disableCustomColors={false}
                      clearable={false}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </PanelBody>
      </InspectorControls>

      <div {...blockProps} data-editor-preview="true">
        <div
          className="fm-container-preview"
          data-position-x={positionX}
          data-position-y={positionY}
          data-expansion-style={expansionStyle}
          data-idle-animation={idleAnimation}
          data-offset-bottom={offsetBottom}
          data-spacing={spacing}
        >
          <div className="fm-items-preview">
            {enabledMessengers.map((m, index) => (
              <div
                key={m.id}
                className="fm-item-preview"
                style={{ backgroundColor: m.color }}
                title={m.name}
              >
                <span className="fm-item-label">{m.iconLabel || m.name.charAt(0)}</span>
              </div>
            ))}
          </div>
          <div className="fm-main-button-preview">{__('Chat', 'jankx')}</div>
        </div>
      </div>
    </>
  );
}

