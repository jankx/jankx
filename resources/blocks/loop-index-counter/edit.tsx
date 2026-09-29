import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
    Notice,
    PanelBody,
    TextControl,
    __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { formatIndex, resolveIndex, watchDocument } from './utils';

type Attributes = {
    start?: number;
    padStart?: number;
    prefix?: string;
    suffix?: string;
};

type Props = {
    attributes: Attributes;
    setAttributes: (attrs: Partial<Attributes>) => void;
};

export default function Edit({ attributes, setAttributes }: Props): JSX.Element {
    const { start = 1, padStart = 0, prefix = '', suffix = '' } = attributes;
    const ref = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState({ index: 0, total: 1, inLoop: false });

    useEffect(() => {
        const sync = () => {
            const next = resolveIndex(ref.current);
            setPosition((current) =>
                current.index === next.index &&
                current.total === next.total &&
                current.inLoop === next.inLoop
                    ? current
                    : next
            );
        };

        sync();

        const doc = ref.current?.ownerDocument ?? document;
        return watchDocument(doc, sync);
    }, []);

    const blockProps = useBlockProps({
        ref,
        className: position.inLoop ? undefined : 'is-outside-loop',
        'data-start': String(start),
        'data-pad': String(padStart),
        'data-prefix': prefix,
        'data-suffix': suffix,
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Loop Index Settings', 'jankx')} initialOpen={true}>
                    <NumberControl
                        label={__('Số thứ tự bắt đầu', 'jankx')}
                        value={start}
                        min={0}
                        step={1}
                        onChange={(value?: number | string | null) =>
                            setAttributes({ start: Number(value) || 0 })
                        }
                        help={__('Giá trị đầu tiên của counter trong loop.', 'jankx')}
                    />
                    <NumberControl
                        label={__('Số chữ số tối thiểu', 'jankx')}
                        value={padStart}
                        min={0}
                        max={6}
                        step={1}
                        onChange={(value?: number | string | null) =>
                            setAttributes({ padStart: Math.max(0, Number(value) || 0) })
                        }
                        help={__('Ví dụ đặt 2 sẽ hiển thị 01, 02, 03...', 'jankx')}
                    />
                    <TextControl
                        label={__('Tiền tố', 'jankx')}
                        value={prefix}
                        onChange={(value: string) => setAttributes({ prefix: value })}
                        help={__('Hiển thị trước số, ví dụ "#".', 'jankx')}
                    />
                    <TextControl
                        label={__('Hậu tố', 'jankx')}
                        value={suffix}
                        onChange={(value: string) => setAttributes({ suffix: value })}
                        help={__('Hiển thị sau số, ví dụ "." hoặc ")"', 'jankx')}
                    />
                </PanelBody>
            </InspectorControls>

            {!position.inLoop && (
                <Notice status="warning" isDismissible={false}>
                    {__(
                        'Đặt block này bên trong loop (Post Template, Dynamic Data Template, Dynamic Term Template...) để số thứ tự được tính tự động.',
                        'jankx'
                    )}
                </Notice>
            )}

            <div {...blockProps}>
                {formatIndex(position.index, { start, padStart, prefix, suffix })}
            </div>
        </>
    );
}
