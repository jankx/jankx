import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, TextControl, Button, ColorPalette } from '@wordpress/components';

type Messenger = { id: string; name: string; color: string; url: string; };

registerBlockType('jankx/floating-messengers', {
  edit({ attributes, setAttributes }) {
    const { positionX, positionY, offsetBottom, expansionStyle, idleAnimation, spacing, messengers } = attributes as any;
    const blockProps = useBlockProps({ className: 'jankx-floating-messengers-editor' });

    const updateMessenger = (index: number, key: keyof Messenger, value: string) => {
      const next = [...(messengers as Messenger[])];
      next[index] = { ...next[index], [key]: value };
      setAttributes({ messengers: next });
    };

    const addMessenger = () => {
      const next = [...(messengers as Messenger[])];
      next.push({ id: `custom-${next.length + 1}`, name: 'Custom', color: '#4B5563', url: '#' });
      setAttributes({ messengers: next });
    };

    const removeMessenger = (index: number) => {
      const next = [...(messengers as Messenger[])];
      next.splice(index, 1);
      setAttributes({ messengers: next });
    };

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Position', 'jankx')} initialOpen={true}>
            <SelectControl
              label={__('Position X', 'jankx')}
              value={positionX}
              options={[
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ]}
              onChange={(v: string) => setAttributes({ positionX: v })}
            />
            <SelectControl
              label={__('Position Y', 'jankx')}
              value={positionY}
              options={[
                { label: 'Bottom', value: 'bottom' },
                { label: 'Center', value: 'center' },
              ]}
              onChange={(v: string) => setAttributes({ positionY: v })}
            />
            {positionY === 'bottom' && (
              <RangeControl
                label={__('Bottom Offset', 'jankx')}
                value={offsetBottom}
                min={0}
                max={200}
                onChange={(v: number) => setAttributes({ offsetBottom: v })}
              />
            )}
          </PanelBody>
          <PanelBody title={__('Behavior', 'jankx')} initialOpen={true}>
            <SelectControl
              label={__('Expansion Style', 'jankx')}
              value={expansionStyle}
              options={[
                { label: 'Vertical', value: 'vertical' },
                { label: 'Horizontal', value: 'horizontal' },
                { label: 'Fan', value: 'fan' },
                { label: 'Split', value: 'split' },
              ]}
              onChange={(v: string) => setAttributes({ expansionStyle: v })}
            />
            <SelectControl
              label={__('Idle Animation', 'jankx')}
              value={idleAnimation}
              options={[
                { label: 'None', value: 'none' },
                { label: 'Pulsating Ring', value: 'pulse-ring' },
                { label: 'Wiggle', value: 'wiggle' },
                { label: 'Float', value: 'float' },
              ]}
              onChange={(v: string) => setAttributes({ idleAnimation: v })}
            />
            <RangeControl
              label={__('Spacing', 'jankx')}
              value={spacing}
              min={30}
              max={120}
              onChange={(v: number) => setAttributes({ spacing: v })}
            />
          </PanelBody>
          <PanelBody title={__('Messengers', 'jankx')} initialOpen={false}>
            {(messengers as Messenger[]).map((m, i) => (
              <div key={i} style={{ borderTop: '1px solid #e5e7eb', paddingTop: 12, marginTop: 12 }}>
                <TextControl label={__('ID', 'jankx')} value={m.id} onChange={(v: string) => updateMessenger(i, 'id', v)} />
                <TextControl label={__('Name', 'jankx')} value={m.name} onChange={(v: string) => updateMessenger(i, 'name', v)} />
                <TextControl label={__('URL', 'jankx')} value={m.url} onChange={(v: string) => updateMessenger(i, 'url', v)} />
                <ColorPalette value={m.color} onChange={(v: string) => updateMessenger(i, 'color', v || '#4B5563')} />
                <Button isDestructive onClick={() => removeMessenger(i)} variant="secondary">
                  {__('Remove', 'jankx')}
                </Button>
              </div>
            ))}
            <Button variant="primary" onClick={addMessenger}>
              {__('Add Messenger', 'jankx')}
            </Button>
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <div className="jfm-preview">
            <div className="jfm-main-btn">{__('Contact', 'jankx')}</div>
          </div>
        </div>
      </>
    );
  },
  save({ attributes }) {
    const { positionX, positionY, offsetBottom, expansionStyle, idleAnimation, spacing, messengers } = attributes as any;
    const props = useBlockProps.save({
      className: 'jankx-floating-messengers',
      'data-config': JSON.stringify({ positionX, positionY, offsetBottom, expansionStyle, idleAnimation, spacing, messengers }),
    } as any);
    return <div {...props} />;
  },
});
