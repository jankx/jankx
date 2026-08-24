import { useBlockProps } from '@wordpress/block-editor';
import { createElement } from '@wordpress/element';
export default function Save({ attributes = {} }) {
    const { tagName = 'hr', thickness = 2, widthPercent = 50, lineAlign = 'center' } = attributes;
    const blockProps = useBlockProps.save({
        className: `jankx-divider align-${lineAlign}`,
        style: {
            ['--divider-thickness']: `${thickness}px`,
            ['--divider-width']: `${widthPercent}%`,
        },
    });
    return createElement(tagName, blockProps);
}
