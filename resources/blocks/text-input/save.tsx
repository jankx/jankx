import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

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
};

export default function Save({ attributes }: Props): JSX.Element {
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

  const blockProps = useBlockProps.save({
    className: `jankx-text-input-wrapper jankx-text-input-wrapper--has-icon jankx-text-input-wrapper--icon-${iconPosition}`,
    style: {
      width: width,
      position: 'relative',
    } as React.CSSProperties,
  });

  return (
    <div {...blockProps}>
      {label && <label className="jankx-text-input-label">{label}</label>}
      <div className="jankx-text-input-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <div className="jankx-text-input-icon-container" style={{
          position: 'absolute',
          [iconPosition]: '15px',
          zIndex: 1,
          pointerEvents: 'none',
          display: 'flex',
        }}>
          <InnerBlocks.Content />
        </div>
        <input
          type={inputType}
          placeholder={placeholder}
          name={inputName}
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
  );
}
