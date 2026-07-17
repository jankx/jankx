import { useBlockProps } from '@wordpress/block-editor';
import { createElement } from '@wordpress/element';

type Attributes = {
  tagName?: 'hr' | 'div';
  thickness?: number;
  widthPercent?: number;
  lineAlign?: 'left' | 'center' | 'right';
};

export default function Save({ attributes = {} as Attributes }): JSX.Element {
  const { tagName = 'hr', thickness = 2, widthPercent = 50, lineAlign = 'center' } = attributes;
  const blockProps = useBlockProps.save({
    className: `jankx-divider align-${lineAlign}`,
    style: {
      ['--divider-thickness' as any]: `${thickness}px`,
      ['--divider-width' as any]: `${widthPercent}%`,
    } as React.CSSProperties,
  });
  return createElement(tagName, blockProps as any);
}
