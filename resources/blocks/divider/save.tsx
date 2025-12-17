import { useBlockProps } from '@wordpress/block-editor';
import { createElement } from '@wordpress/element';

type Attributes = {
  tagName?: 'hr' | 'div';
};

export default function Save({ attributes = {} as Attributes }): JSX.Element {
  const { tagName = 'hr' } = attributes;
  const blockProps = useBlockProps.save({
    className: 'jankx-divider',
  });
  return createElement(tagName, blockProps as any);
}
