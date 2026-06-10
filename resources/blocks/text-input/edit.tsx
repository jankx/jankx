import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { PanelBody, TextControl, SelectControl, ToggleControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

type Props = {
  attributes: {
    label?: string;
    placeholder?: string;
    inputType?: 'text' | 'email' | 'tel' | 'url' | 'search' | 'password' | 'number';
    required?: boolean;
    disabled?: boolean;
    inputName?: string;
    inputValue?: string;
    width?: string;
    borderRadius?: number;
    iconPosition?: 'left' | 'right';
  };
  setAttributes: (attrs: Partial<Props['attributes']>) => void;
};

export default function Edit({ attributes, setAttributes }: Props): JSX.Element {
  const {
    label = '',
    placeholder = '',
    inputType = 'text',
    required = false,
    disabled = false,
    inputName = '',
    inputValue = '',
    width = '100%',
    borderRadius = 4,
    iconPosition = 'left',
  } = attributes;

  const { clientId } = useBlockProps();

  // Detect if text-input is a child of advanced-filter
  const isInsideAdvancedFilter = useSelect((select: any) => {
    const { getBlockParents, getBlock } = select('core/block-editor');
    const parents: string[] = getBlockParents(clientId) || [];
    return parents.some((id: string) => getBlock(id)?.name === 'jankx/advanced-filter');
  }, [clientId]);

  const blockProps = useBlockProps({
    className: `jankx-text-input-wrapper jankx-text-input-wrapper--has-icon jankx-text-input-wrapper--icon-${iconPosition}`,
    style: {
      width: width,
      position: 'relative',
    } as React.CSSProperties,
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Input Settings', 'jankx')} initialOpen={true}>
          <TextControl
            label={__('Label', 'jankx')}
            value={label}
            onChange={(v: string) => setAttributes({ label: v })}
            help={__('Optional label text above the input', 'jankx')}
          />
          <TextControl
            label={__('Placeholder', 'jankx')}
            value={placeholder}
            onChange={(v: string) => setAttributes({ placeholder: v })}
          />
          <SelectControl
            label={__('Input Type', 'jankx')}
            value={inputType}
            options={[
              { label: __('Text', 'jankx'), value: 'text' },
              { label: __('Email', 'jankx'), value: 'email' },
              { label: __('Phone', 'jankx'), value: 'tel' },
              { label: __('URL', 'jankx'), value: 'url' },
              { label: __('Search', 'jankx'), value: 'search' },
              { label: __('Password', 'jankx'), value: 'password' },
              { label: __('Number', 'jankx'), value: 'number' },
            ]}
            onChange={(v: 'text' | 'email' | 'tel' | 'url' | 'search' | 'password' | 'number') => setAttributes({ inputType: v })}
          />
          {!isInsideAdvancedFilter && (
            <TextControl
              label={__('Input Name', 'jankx')}
              value={inputName}
              onChange={(v: string) => setAttributes({ inputName: v })}
              help={__('Name attribute for form submission', 'jankx')}
            />
          )}
          {isInsideAdvancedFilter && (
            <div style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px', fontSize: '12px', color: '#555' }}>
              {__('Input Name is automatically set to "keyword" when inside Advanced Filter', 'jankx')}
            </div>
          )}
          <TextControl
            label={__('Default Value', 'jankx')}
            value={inputValue}
            onChange={(v: string) => setAttributes({ inputValue: v })}
          />
          <TextControl
            label={__('Width', 'jankx')}
            value={width}
            onChange={(v: string) => setAttributes({ width: v })}
            help={__('CSS width value (e.g., 100%, 300px, 50%)', 'jankx')}
          />
          <RangeControl
            label={__('Border Radius (px)', 'jankx')}
            value={borderRadius}
            onChange={(v?: number) => setAttributes({ borderRadius: v ?? 4 })}
            min={0}
            max={50}
          />
          <ToggleControl
            label={__('Required', 'jankx')}
            checked={required}
            onChange={(v: boolean) => setAttributes({ required: v })}
          />
          <ToggleControl
            label={__('Disabled', 'jankx')}
            checked={disabled}
            onChange={(v: boolean) => setAttributes({ disabled: v })}
          />
          <SelectControl
            label={__('Icon Position', 'jankx')}
            value={iconPosition}
            options={[
              { label: __('Left', 'jankx'), value: 'left' },
              { label: __('Right', 'jankx'), value: 'right' },
            ]}
            onChange={(v: 'left' | 'right') => setAttributes({ iconPosition: v })}
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        {label && <label className="jankx-text-input-label">{label}</label>}
        <div className="jankx-text-input-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div className="jankx-text-input-icon-container" style={{
            position: 'absolute',
            [iconPosition]: '10px',
            zIndex: 1,
            pointerEvents: 'none',
            display: 'flex',
          }}>
            <InnerBlocks
              allowedBlocks={['jankx/svg-icon']}
              template={[['jankx/svg-icon', {}]]}
              templateLock={false}
            />
          </div>
          <input
            type={inputType}
            placeholder={placeholder}
            name={isInsideAdvancedFilter ? 'keyword' : inputName}
            value={inputValue}
            required={required}
            disabled={disabled}
            className="jankx-text-input"
            style={{
              borderRadius: `${borderRadius}px`,
              paddingLeft: iconPosition === 'left' ? '35px' : '10px',
              paddingRight: iconPosition === 'right' ? '35px' : '10px',
              width: '100%',
            } as React.CSSProperties}
          />
        </div>
      </div>
    </>
  );
}
