import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import {
    PanelBody,
    TextControl,
    ToggleControl,
    CheckboxControl,
    SelectControl,
    Spinner,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

interface TermPostCountAttributes {
    postTypes: string[];
    labelSingular: string;
    labelPlural: string;
    showLabel: boolean;
    labelPosition: 'before' | 'after';
    showZero: boolean;
    zeroText: string;
    prefix: string;
    suffix: string;
}

interface TermPostCountEditProps {
    attributes: TermPostCountAttributes;
    setAttributes: (attrs: Partial<TermPostCountAttributes>) => void;
    context: {
        termId?: number;
        taxonomy?: string;
        postId?: number;
        postType?: string;
    };
}

export default function Edit({ attributes, setAttributes, context }: TermPostCountEditProps): JSX.Element {
    const {
        postTypes,
        labelSingular,
        labelPlural,
        showLabel,
        labelPosition,
        showZero,
        zeroText,
        prefix,
        suffix,
    } = attributes;

    const selectedPostTypes = Array.isArray(postTypes) ? postTypes : [];
    const selectedKey = [...selectedPostTypes].sort().join(',');

    const termId = context.termId ?? context.postId ?? 0;
    const taxonomy = context.taxonomy ?? '';

    // --- fetch available post types ---
    const postTypesList = useSelect((select) => {
        const coreStore = select('core') as any;
        const types = coreStore?.getPostTypes?.({ per_page: -1 }) ?? [];
        return (types as any[]).filter(
            (pt: any) =>
                pt.viewable &&
                pt.slug !== 'attachment' &&
                pt.rest_base
        );
    }, []);

    const togglePostType = (slug: string) => {
        setAttributes({
            postTypes: selectedPostTypes.includes(slug)
                ? selectedPostTypes.filter((s) => s !== slug)
                : [...selectedPostTypes, slug],
        });
    };

    // --- fetch post count via REST API ---
    const [count, setCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isTemplateContext = !termId || termId === 0;

    useEffect(() => {
        if (isTemplateContext) {
            setCount(null);
            return;
        }

        let cancelled = false;
        setIsLoading(true);

        const apiFetch = (window as any)?.wp?.apiFetch;
        const selected = selectedKey === '' ? [] : selectedKey.split(',');

        if (selected.length === 0) {
            const coreEndpoint = `/wp/v2/${taxonomy ?? 'categories'}/${termId}`;
            const fetcher = apiFetch
                ? apiFetch({ path: coreEndpoint })
                : fetch(`/wp-json${coreEndpoint}`).then((r: Response) => r.json());

            (fetcher as Promise<any>)
                .then((term: any) => {
                    if (!cancelled) {
                        setCount(typeof term?.count === 'number' ? term.count : parseInt(term?.count ?? '0', 10));
                    }
                })
                .catch(() => { if (!cancelled) setCount(0); })
                .finally(() => { if (!cancelled) setIsLoading(false); });

            return () => { cancelled = true; };
        }

        const requests = selected.map((slug) => {
            const params = new URLSearchParams();
            params.set('per_page', '0');
            if (taxonomy) {
                params.set(taxonomy, String(termId));
            }
            const endpoint = `/wp/v2/${slug}?${params.toString()}`;
            const fetcher = apiFetch
                ? apiFetch({ path: endpoint, parse: false })
                : fetch(`/wp-json${endpoint}`);
            return (fetcher as Promise<any>).then((response: any) => {
                if (cancelled) return 0;
                const total = response?.headers?.get?.('X-WP-Total') ?? null;
                return total !== null ? parseInt(total, 10) : 0;
            });
        });

        Promise.all(requests)
            .then((totals) => {
                if (!cancelled) {
                    setCount(totals.reduce((a: number, b: number) => a + b, 0));
                }
            })
            .catch(() => { if (!cancelled) setCount(0); })
            .finally(() => { if (!cancelled) setIsLoading(false); });

        return () => { cancelled = true; };
    }, [termId, taxonomy, selectedKey, isTemplateContext]);

    // --- render ---
    const blockProps = useBlockProps({
        className: 'jankx-term-post-count',
    });

    const displayCount = isTemplateContext ? 24 : (count ?? 0);
    const shouldHide = !showZero && displayCount === 0 && !isTemplateContext;

    const resolvedLabelSingular = labelSingular || __('bài viết', 'jankx');
    const resolvedLabelPlural = labelPlural || __('bài viết', 'jankx');
    const label = displayCount === 1 ? resolvedLabelSingular : resolvedLabelPlural;

    const hasPrefixSuffix = (prefix ?? '') !== '' || (suffix ?? '') !== '';
    const useLabel = !hasPrefixSuffix && showLabel;

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Term Post Count Settings', 'jankx')} initialOpen={true}>
                    <div className="term-post-count__post-types">
                        <strong>{__('Post types cần đếm', 'jankx')}</strong>
                        <p className="term-post-count__post-types-help">
                            {__('Chọn 1 hoặc nhiều post types. Để trống = dùng term count mặc định (tất cả post types).', 'jankx')}
                        </p>
                        {(postTypesList ?? []).map((pt: any) => (
                            <CheckboxControl
                                key={pt.slug}
                                label={pt.name || pt.slug}
                                checked={selectedPostTypes.includes(pt.slug)}
                                onChange={() => togglePostType(pt.slug)}
                            />
                        ))}
                    </div>
                    <ToggleControl
                        label={__('Hiển thị nhãn', 'jankx')}
                        checked={showLabel}
                        onChange={(val: boolean) => setAttributes({ showLabel: val })}
                    />
                    {showLabel && (
                        <>
                            <TextControl
                                label={__('Nhãn số ít (vd: bài viết)', 'jankx')}
                                value={labelSingular}
                                onChange={(val: string) => setAttributes({ labelSingular: val })}
                                placeholder={__('bài viết', 'jankx')}
                            />
                            <TextControl
                                label={__('Nhãn số nhiều (vd: bài viết)', 'jankx')}
                                value={labelPlural}
                                onChange={(val: string) => setAttributes({ labelPlural: val })}
                                placeholder={__('bài viết', 'jankx')}
                            />
                            <SelectControl
                                label={__('Vị trí nhãn', 'jankx')}
                                value={labelPosition}
                                options={[
                                    { label: __('Sau số (vd: 12 bài viết)', 'jankx'), value: 'after' },
                                    { label: __('Trước số (vd: bài viết: 12)', 'jankx'), value: 'before' },
                                ]}
                                onChange={(val: string) => setAttributes({ labelPosition: val as 'before' | 'after' })}
                            />
                        </>
                    )}
                    <ToggleControl
                        label={__('Hiển thị khi bằng 0', 'jankx')}
                        checked={showZero}
                        onChange={(val: boolean) => setAttributes({ showZero: val })}
                    />
                    {showZero && (
                        <TextControl
                            label={__('Văn bản khi bằng 0', 'jankx')}
                            value={zeroText}
                            onChange={(val: string) => setAttributes({ zeroText: val })}
                            placeholder={__('Để trống = hiển thị số 0', 'jankx')}
                        />
                    )}
                    <TextControl
                        label={__('Prefix (trước số)', 'jankx')}
                        value={prefix}
                        onChange={(val: string) => setAttributes({ prefix: val })}
                        placeholder={__('vd: Có ', 'jankx')}
                    />
                    <TextControl
                        label={__('Suffix (sau số)', 'jankx')}
                        value={suffix}
                        onChange={(val: string) => setAttributes({ suffix: val })}
                        placeholder={__('vd:  hành trình', 'jankx')}
                    />
                </PanelBody>
            </InspectorControls>

            <span {...blockProps}>
                {isLoading ? (
                    <Spinner />
                ) : shouldHide ? null : (
                    <>
                        {useLabel && labelPosition === 'before' && (
                            <span className="term-post-count__label term-post-count__label--before">
                                {label}:{' '}
                            </span>
                        )}
                        <span className="term-post-count__number">
                            {prefix}{displayCount === 0 && zeroText ? zeroText : displayCount}{suffix}
                        </span>
                        {useLabel && labelPosition === 'after' && (
                            <span className="term-post-count__label term-post-count__label--after">
                                {' '}{label}
                            </span>
                        )}
                        {isTemplateContext && (
                            <span className="term-post-count__preview-note">
                                {' '}({__('preview', 'jankx')})
                            </span>
                        )}
                    </>
                )}
            </span>
        </>
    );
}