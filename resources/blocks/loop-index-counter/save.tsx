import { useBlockProps } from '@wordpress/block-editor';

type Attributes = {
    start?: number;
    padStart?: number;
    prefix?: string;
    suffix?: string;
};

export default function Save({ attributes }: { attributes: Attributes }): JSX.Element {
    const { start = 1, padStart = 0, prefix = '', suffix = '' } =
        attributes || ({} as Attributes);

    const blockProps = useBlockProps.save({
        'data-start': String(start),
        'data-pad': String(padStart),
        'data-prefix': prefix,
        'data-suffix': suffix,
    });

    return <div {...blockProps} />;
}
