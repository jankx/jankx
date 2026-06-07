import { useBlockProps } from '@wordpress/block-editor';

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
  } = attributes;

  const blockProps = useBlockProps.save({
    className: 'jankx-text-input-wrapper',
    style: {
      width: width,
    } as React.CSSProperties,
  });

  return (
    <div {...blockProps}>
      {label && <label className="jankx-text-input-label">{label}</label>}
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
        } as React.CSSProperties}
      />
    </div>
  );
}
