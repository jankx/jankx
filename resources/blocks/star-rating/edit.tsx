import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, TextControl, ColorPalette, ToggleControl, TextareaControl, Spinner, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

interface Attributes {
    displayStyle: 'stars' | 'summary';
    ratingSource: string;
    manualRating: number;
    metaKey: string;
    countMetaKey: string;
    crawlerTable: string;
    starSize: number;
    starColor: string;
    starEmptyColor: string;
    showCount: boolean;
    align?: string;
    iconType: 'text' | 'svg';
    svgFull: string;
    svgHalf: string;
    svgEmpty: string;
    position?: string;
    [key: string]: unknown;
}

interface EditProps {
    attributes: Attributes;
    setAttributes: (attributes: Partial<Attributes>) => void;
}

interface EditorControl {
    type: 'range' | 'text' | 'select' | 'toggle';
    attribute: string;
    label: string;
    help?: string;
    default?: unknown;
    min?: number;
    max?: number;
    step?: number;
    options?: Array<{ value: string; label: string }>;
}

interface ProviderOption {
    value: string;
    label: string;
    editorConfig: EditorControl[];
}

const DEFAULT_SVG_FULL  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
const DEFAULT_SVG_HALF  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>';
const DEFAULT_SVG_EMPTY = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>';

const PRESETS: Array<{
    name: string;
    label: string;
    preview: string;
    attributes: Partial<Attributes>;
}> = [
    {
        name: 'stars-default',
        label: __('Stars', 'jankx'),
        preview: '★★★★☆',
        attributes: {
            displayStyle: 'stars',
            showCount: false,
            starColor: '#f1c40f',
            starEmptyColor: '#dddddd',
            starSize: 16,
            className: '',
        },
    },
    {
        name: 'stars-with-count',
        label: __('Stars + Count', 'jankx'),
        preview: '★★★★☆ (123)',
        attributes: {
            displayStyle: 'stars',
            showCount: true,
            starColor: '#f1c40f',
            starEmptyColor: '#dddddd',
            starSize: 16,
            className: '',
        },
    },
    {
        name: 'summary-default',
        label: __('Summary', 'jankx'),
        preview: '★ 4.5 (123)',
        attributes: {
            displayStyle: 'summary',
            showCount: true,
            starColor: '#f1c40f',
            starEmptyColor: '#dddddd',
            starSize: 18,
            className: '',
        },
    },
    {
        name: 'google-summary',
        label: __('Google Summary', 'jankx'),
        preview: '★ 4.6 (39,092)',
        attributes: {
            displayStyle: 'summary',
            showCount: true,
            starColor: '#5b8e29',
            starEmptyColor: '#dddddd',
            starSize: 20,
            className: 'is-style-google-summary',
        },
    },
    {
        name: 'compact-stars',
        label: __('Compact', 'jankx'),
        preview: '★★★★★',
        attributes: {
            displayStyle: 'stars',
            showCount: false,
            starColor: '#f1c40f',
            starEmptyColor: '#dddddd',
            starSize: 12,
            className: 'is-style-compact-stars',
        },
    },
];

const getActivePreset = (attributes: Attributes): string => {
    if (attributes.className === 'is-style-google-summary') return 'google-summary';
    if (attributes.className === 'is-style-compact-stars') return 'compact-stars';
    if (attributes.displayStyle === 'summary') return 'summary-default';
    if (attributes.displayStyle === 'stars' && attributes.showCount) return 'stars-with-count';
    return 'stars-default';
};

/** Render a single dynamic control based on provider's editorConfig */
const DynamicControl = ({
    control,
    value,
    onChange,
}: {
    control: EditorControl;
    value: unknown;
    onChange: (val: unknown) => void;
}) => {
    switch (control.type) {
        case 'range':
            return (
                <RangeControl
                    label={control.label}
                    value={Number(value) || 0}
                    onChange={(v) => onChange(v || 0)}
                    min={control.min ?? 0}
                    max={control.max ?? 5}
                    step={control.step ?? 0.1}
                    help={control.help}
                />
            );
        case 'text':
            return (
                <TextControl
                    label={control.label}
                    value={String(value || '')}
                    onChange={(v) => onChange(v)}
                    help={control.help}
                />
            );
        case 'select':
            return (
                <SelectControl
                    label={control.label}
                    value={String(value || '')}
                    options={control.options || []}
                    onChange={(v) => onChange(v)}
                    help={control.help}
                />
            );
        case 'toggle':
            return (
                <ToggleControl
                    label={control.label}
                    checked={!!value}
                    onChange={(v) => onChange(v)}
                    help={control.help}
                />
            );
        default:
            return null;
    }
};


const Edit = ({ attributes, setAttributes }: EditProps) => {
    const {
        displayStyle,
        ratingSource,
        manualRating,
        starSize,
        starColor,
        starEmptyColor,
        showCount,
        iconType,
        svgFull,
        svgHalf,
        svgEmpty,
        position,
    } = attributes;

    const [providerOptions, setProviderOptions] = useState<ProviderOption[]>([]);
    const [loadingProviders, setLoadingProviders] = useState(true);

    useEffect(() => {
        apiFetch<ProviderOption[]>({ path: '/jankx/v1/star-rating/providers' })
            .then((options) => {
                setProviderOptions(options);
            })
            .catch(() => {
                setProviderOptions([
                    { label: __('Manual', 'jankx'), value: 'manual', editorConfig: [
                        { type: 'range', attribute: 'manualRating', label: __('Rating Value', 'jankx'), min: 0, max: 5, step: 0.1 },
                    ]},
                    { label: __('WooCommerce Product', 'jankx'), value: 'woocommerce', editorConfig: [] },
                    { label: __('Post Meta', 'jankx'), value: 'meta', editorConfig: [
                        { type: 'text', attribute: 'metaKey', label: __('Rating Meta Key', 'jankx'), default: 'rating_score' },
                        { type: 'text', attribute: 'countMetaKey', label: __('Count Meta Key', 'jankx'), default: 'rating_count' },
                    ]},
                    { label: __('Crawler Data', 'jankx'), value: 'crawler', editorConfig: [
                        { type: 'text', attribute: 'crawlerTable', label: __('Crawler Table', 'jankx') },
                    ]},
                ]);
            })
            .finally(() => setLoadingProviders(false));
    }, []);

    const blockProps = useBlockProps({
        style: {
            '--star-size': `${starSize}px`,
            '--star-color': starColor,
            '--star-empty-color': starEmptyColor,
            textAlign: attributes.align,
            position: position ? position : undefined,
        } as React.CSSProperties
    });

    const [rating, setRating] = useState(manualRating);

    useEffect(() => {
        if (ratingSource === 'manual') {
            setRating(manualRating);
        } else {
            setRating(4.5);
        }
    }, [ratingSource, manualRating]);

    const renderStars = (ratingValue: number) => {
        const stars = [];
        const fullStars = Math.floor(ratingValue);
        const hasHalfStar = ratingValue % 1 >= 0.5;

        const renderIcon = (type: 'full' | 'half' | 'empty') => {
            if (iconType === 'svg') {
                let svgContent = '';
                if (type === 'full')  svgContent = svgFull  || DEFAULT_SVG_FULL;
                if (type === 'half')  svgContent = svgHalf  || DEFAULT_SVG_HALF;
                if (type === 'empty') svgContent = svgEmpty || DEFAULT_SVG_EMPTY;

                return <span className={`jankx-star ${type} is-svg`} dangerouslySetInnerHTML={{ __html: svgContent }} />;
            }
            return <span className={`jankx-star ${type}`}>{type === 'full' ? '★' : (type === 'half' ? '★' : '☆')}</span>;
        };

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<span key={i}>{renderIcon('full')}</span>);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<span key={i}>{renderIcon('half')}</span>);
            } else {
                stars.push(<span key={i}>{renderIcon('empty')}</span>);
            }
        }
        return stars;
    };

    // Find current provider's editor config
    const currentProvider = providerOptions.find((p) => p.value === ratingSource);
    const editorConfig = currentProvider?.editorConfig || [];

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Style Preset', 'jankx')} initialOpen={true}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                        {PRESETS.map((preset) => {
                            const isActive = getActivePreset(attributes) === preset.name;
                            return (
                                <Button
                                    key={preset.name}
                                    onClick={() => setAttributes(preset.attributes as any)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '64px',
                                        padding: '6px 4px',
                                        border: isActive
                                            ? '2px solid var(--wp-admin-theme-color, #007cba)'
                                            : '1px solid #ddd',
                                        borderRadius: '4px',
                                        background: isActive ? '#f0f6fc' : '#fff',
                                        cursor: 'pointer',
                                        gap: '4px',
                                        fontSize: '11px',
                                        whiteSpace: 'normal',
                                        textAlign: 'center',
                                        lineHeight: '1.3',
                                        color: isActive ? 'var(--wp-admin-theme-color, #007cba)' : '#1e1e1e',
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                >
                                    <span style={{ fontSize: '13px', letterSpacing: '-1px' }}>{preset.preview}</span>
                                    <span>{preset.label}</span>
                                </Button>
                            );
                        })}
                    </div>
                </PanelBody>

                <PanelBody title={__('Rating Settings', 'jankx')}>
                    {loadingProviders ? (
                        <Spinner />
                    ) : (
                        <SelectControl
                            label={__('Rating Source', 'jankx')}
                            value={ratingSource}
                            options={providerOptions.map((p) => ({ value: p.value, label: p.label }))}
                            onChange={(value) => setAttributes({ ratingSource: value })}
                            help={__('Sources registered by active extensions will appear here.', 'jankx')}
                        />
                    )}

                    {/* Dynamic controls from provider's editorConfig */}
                    {editorConfig.map((control) => (
                        <DynamicControl
                            key={control.attribute}
                            control={control}
                            value={attributes[control.attribute]}
                            onChange={(val) => setAttributes({ [control.attribute]: val })}
                        />
                    ))}

                    <SelectControl
                        label={__('Position', 'jankx')}
                        value={position || ''}
                        options={[
                            { label: __('Default (Static)', 'jankx'), value: '' },
                            { label: __('Relative', 'jankx'), value: 'relative' },
                            { label: __('Absolute', 'jankx'), value: 'absolute' },
                            { label: __('Fixed', 'jankx'), value: 'fixed' },
                        ]}
                        onChange={(value) => setAttributes({ position: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Visual Settings', 'jankx')}>
                    <RangeControl
                        label={__('Star Size (px)', 'jankx')}
                        value={starSize}
                        onChange={(value) => setAttributes({ starSize: value || 16 })}
                        min={10}
                        max={50}
                    />

                    <p>{__('Star Filled Color', 'jankx')}</p>
                    <ColorPalette
                        value={starColor}
                        onChange={(value) => setAttributes({ starColor: value })}
                    />

                    <p>{__('Star Empty Color', 'jankx')}</p>
                    <ColorPalette
                        value={starEmptyColor}
                        onChange={(value) => setAttributes({ starEmptyColor: value })}
                    />

                    <SelectControl
                        label={__('Icon Type', 'jankx')}
                        value={iconType}
                        options={[
                            { label: __('Text (★)', 'jankx'), value: 'text' },
                            { label: __('Custom SVG', 'jankx'), value: 'svg' },
                        ]}
                        onChange={(value) => setAttributes({ iconType: value as any })}
                    />

                    {iconType === 'svg' && (
                        <>
                            <TextareaControl
                                label={__('Full Star SVG', 'jankx')}
                                value={svgFull}
                                onChange={(value) => setAttributes({ svgFull: value })}
                                help={__('Paste SVG code for full star.', 'jankx')}
                            />
                            <TextareaControl
                                label={__('Half Star SVG', 'jankx')}
                                value={svgHalf}
                                onChange={(value) => setAttributes({ svgHalf: value })}
                                help={__('Paste SVG code for half star.', 'jankx')}
                            />
                            <TextareaControl
                                label={__('Empty Star SVG', 'jankx')}
                                value={svgEmpty}
                                onChange={(value) => setAttributes({ svgEmpty: value })}
                                help={__('Paste SVG code for empty star.', 'jankx')}
                            />
                        </>
                    )}

                    <ToggleControl
                        label={__('Show Rating Count', 'jankx')}
                        checked={showCount}
                        onChange={(value) => setAttributes({ showCount: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="jankx-star-rating">
                    {displayStyle === 'summary' ? (
                        <span className="jankx-rating-summary">
                            <span className="jankx-rating-summary__icon">★</span>
                            <span className="jankx-rating-summary__score">
                                {Number.isFinite(rating) ? rating.toFixed(1) : '0.0'}
                            </span>
                            {showCount && (
                                <span className="jankx-rating-summary__count">
                                    (123)
                                </span>
                            )}
                        </span>
                    ) : (
                        <>
                            <div className="jankx-stars">
                                {renderStars(rating)}
                            </div>
                            {showCount && (
                                <span className="jankx-rating-count">
                                    (123)
                                </span>
                            )}
                        </>
                    )}
                </div>
                {ratingSource !== 'manual' && (
                    <div className="jankx-block-placeholder-info">
                        {__(`Previewing ${ratingSource} rating`, 'jankx')}
                    </div>
                )}
            </div>
        </>
    );
};

export default Edit;
