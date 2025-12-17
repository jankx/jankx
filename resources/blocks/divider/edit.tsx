import { useBlockProps } from '@wordpress/block-editor';
import { createElement } from '@wordpress/element';

type Props = {
  attributes: {
    tagName?: 'hr' | 'div';
  };
};

export default function Edit({ attributes }: Props): JSX.Element {
  const { tagName = 'hr' } = attributes;
  const blockProps = useBlockProps({
    className: 'jankx-divider',
  });
  return createElement(tagName, blockProps as any);
}
