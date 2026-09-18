import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
    TextControl,
    FormTokenField,
    BaseControl,
    Spinner,
    Button,
} from '@wordpress/components';
import * as WPComponents from '@wordpress/components';
// Fallback for WP 7.1 where UnitControl moved to experimental
const UnitControl: any =
    (WPComponents as any).UnitControl || (WPComponents as any).__experimentalUnitControl || TextControl;
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useMemo, useEffect, useCallback } from '@wordpress/element';
import type { CSSProperties } from 'react';
import './style.scss';
import './editor.scss';

type TokenLike = string | { value: string;[key: string]: unknown };

interface TaxonomyItem {
    slug: string;
    name: string;
    rest_base: string;
}

interface TermItem {
    id: number;
    name: string;
    count?: number;
}

interface SettingDefinition {
    name?: string;
    type?: 'text' | 'number' | 'range' | 'toggle' | 'select' | 'panel' | string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default?: any;
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    help?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    condition?: Record<string, any>;
    options?: Array<{ label: string; value: string }>;
    title?: string;
    initialOpen?: boolean;
    controls?: SettingDefinition[];
}

interface LayoutInfo {
    name: string;
    title: string;
    supportedOptions?: string[];
    readOnlyOptions?: string[];
    settingsDefinition?: SettingDefinition[];
}

interface TermLayoutAttributes {
    taxonomy: string;
    termIn: number[];
    termNotIn: number[];
    termParent: number;
    hideEmpty: boolean;
    showTermCount: boolean;
    postsPerPage: number;
    layout: string;
    columns: number;
    columnsTablet: number;
    columnsMobile: number;
    spaceBetween: number;
    slidesToScroll: number;
    loop: boolean;
    autoplay: boolean;
    autoplayDelay: number;
    showArrows: boolean;
    showDots: boolean;
    carouselAlign: string;
    carouselAxis: string;
    carouselDirection: string;
    carouselStartIndex: number;
    carouselDuration: number;
    carouselDragFree: boolean;
    carouselDragThreshold: number;
    carouselSkipSnaps: boolean;
    carouselContainScroll: string;
    carouselInViewThreshold: number;
    carouselPeek: number;
    orderBy: string;
    order: string;
    keyword: string;
    offset: number;
    renderOffset: number;
    renderLimit: number;
    thumbnailPosition: string;
    imageRatio: string;
    showEmptyMessage: boolean;
    emptyMessage: string;
    className: string;
    align: string;
    itemsWrapperClass: string;
    itemClass: string;
}

interface EditProps {
    attributes: Record<string, any>;
    setAttributes: (attrs: Record<string, unknown>) => void;
    clientId: string;
}

declare global {
    interface Window {
        jankxPublicTaxonomies?: TaxonomyItem[];
        jankxDynamicTermLayouts?: {
            layoutsByTaxonomy: Record<string, LayoutInfo[]>;
            commonLayouts: LayoutInfo[];
        };
        jankxDynamicTermContentLoopLayouts?: {
            layoutsByTaxonomy: Record<string, LayoutInfo[]>;
            commonLayouts: LayoutInfo[];
        };
    }
}

const DEFAULT_LAYOUTS: LayoutInfo[] = [
    { name: 'grid', title: 'Grid' },
    { name: 'list', title: 'List' },
    { name: 'card', title: 'Card' },
    { name: 'carousel', title: 'Carousel' },
    { name: 'masonry', title: 'Masonry' },
];

function tokenLabel(token: TokenLike): string {
    return typeof token === 'string' ? token : (token.label as string) || token.value;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
    const {
        taxonomy = 'category',
        termIn = [],
        termNotIn = [],
        termParent = 0,
        hideEmpty = true,
        showTermCount = true,
        postsPerPage = 10,
        layout = 'grid',
        columns = 3,
        columnsTablet = 2,
        columnsMobile = 1,
        spaceBetween = 16,
        slidesToScroll = 1,
        loop = false,
        autoplay = false,
        autoplayDelay = 3000,
        showArrows = true,
        showDots = true,
        carouselAlign = 'start',
        carouselAxis = 'x',
        carouselDirection = 'ltr',
        carouselStartIndex = 0,
        carouselDuration = 25,
        carouselDragFree = false,
        carouselDragThreshold = 10,
        carouselSkipSnaps = false,
        carouselContainScroll = 'trimSnaps',
        carouselInViewThreshold = 0,
        carouselPeek = 0,
        orderBy = 'name',
        order = 'ASC',
        keyword = '',
        offset = 0,
        renderOffset = 0,
        renderLimit = 0,
        thumbnailPosition = 'top',
        imageRatio = '',
        showEmptyMessage = true,
        emptyMessage = __('No terms found.', 'jankx'),
        className,
        itemsWrapperClass = '',
        itemClass = '',
    } = attributes as TermLayoutAttributes;

    const setAttr = (key: string, value: unknown) => setAttributes({ [key]: value } as Record<string, unknown>);

    // Responsive Min Height state - must be at top level (Rules of Hooks)
    const [minHeightDevice, setMinHeightDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    const publicTaxonomies: TaxonomyItem[] = Array.isArray((window as any).jankxPublicTaxonomies)
        ? (window as any).jankxPublicTaxonomies
        : [];

    // Fallback: fetch taxonomies from WordPress core store if jankxPublicTaxonomies is empty
    const coreTaxonomies = useSelect((select) => {
        if (publicTaxonomies.length > 0) return [];
        return (select(coreStore).getTaxonomies as any)({ per_page: -1 }) as Array<{ slug: string; name: string; visibility?: { public?: boolean } }> | null;
    }, [publicTaxonomies.length]);

    const taxonomyOptions = useMemo(() => {
        const map = new Map<string, string>();
        publicTaxonomies.forEach((t) => {
            if (!map.has(t.slug)) map.set(t.slug, t.name || t.slug);
        });
        // Merge core taxonomies as fallback
        if (publicTaxonomies.length === 0 && coreTaxonomies) {
            coreTaxonomies.forEach((t) => {
                if (t.visibility?.public !== false && !map.has(t.slug)) {
                    map.set(t.slug, t.name || t.slug);
                }
            });
        }
        return Array.from(map.entries()).map(([value, label]) => ({ label, value }));
    }, [publicTaxonomies, coreTaxonomies]);

    const { terms, termsResolved } = useSelect((select) => {
        const selectorArgs = ['taxonomy', taxonomy, { per_page: 100, orderby: 'name', order: 'asc', hide_empty: false, _fields: 'id,name,count' }];
        return {
            terms: (select(coreStore).getEntityRecords as any)(...selectorArgs) as TermItem[] | null,
            termsResolved: (select(coreStore).hasFinishedResolution as any)('getEntityRecords', selectorArgs) as boolean,
        };
    }, [taxonomy]);

    const termOptions = useMemo(() => (terms || []).map((t) => ({ id: t.id, name: t.name })), [terms]);

    const termNameById = useMemo(() => {
        const map = new Map<number, string>();
        termOptions.forEach((t) => map.set(t.id, t.name));
        return (id: number) => map.get(id) || String(id);
    }, [termOptions]);

    const termIdByName = useMemo(() => {
        const map = new Map<string, number>();
        termOptions.forEach((t) => map.set(t.name, t.id));
        return map;
    }, [termOptions]);

    const handleTokenChange = (tokens: TokenLike[], key: 'termIn' | 'termNotIn') => {
        const ids: number[] = [];
        tokens.forEach((tk) => {
            const label = tokenLabel(tk);
            const exact = termIdByName.get(label);
            if (exact !== undefined) {
                ids.push(exact);
            } else if (/^\d+$/.test(label)) {
                ids.push(parseInt(label, 10));
            }
        });
        setAttr(key, ids);
    };

    const tokenFromIds = (ids: number[] | undefined): string[] => (ids || []).map((id) => termNameById(id));

    const layoutsData = (window as any).jankxDynamicTermLayouts || (window as any).jankxDynamicTermContentLoopLayouts || null;

    const availableLayouts = useMemo(() => {
        const layouts: LayoutInfo[] = [];
        const push = (info: LayoutInfo) => {
            if (!info?.name || layouts.some((l) => l.name === info.name)) {
                return;
            }
            const layoutItem: LayoutInfo = {
                name: info.name,
                title: info.title || info.name,
            };
            if (Array.isArray(info.supportedOptions)) {
                layoutItem.supportedOptions = info.supportedOptions;
            }
            if (Array.isArray(info.readOnlyOptions)) {
                layoutItem.readOnlyOptions = info.readOnlyOptions;
            }
            if (Array.isArray(info.settingsDefinition)) {
                layoutItem.settingsDefinition = info.settingsDefinition;
            }
            layouts.push(layoutItem);
        };
        if (layoutsData && Array.isArray(layoutsData.layoutsByTaxonomy?.[taxonomy])) {
            layoutsData.layoutsByTaxonomy[taxonomy].forEach(push);
        }
        if (layoutsData && Array.isArray(layoutsData.commonLayouts)) {
            layoutsData.commonLayouts.forEach(push);
        }
        DEFAULT_LAYOUTS.forEach(push);
        return layouts.length ? layouts : DEFAULT_LAYOUTS;
    }, [layoutsData, taxonomy]);

    const layoutOptions = availableLayouts.map((l) => ({ label: l.title || l.name, value: l.name }));
    const resolvedLayout = layoutOptions.some((o) => o.value === layout) ? layout : (layoutOptions[0]?.value || 'grid');
    const isCarousel = resolvedLayout === 'carousel';

    // Layout specific settings provided by PHP (e.g. full carousel config)
    const currentLayout = availableLayouts.find((l) => l.name === resolvedLayout);
    const settingsDefinition: SettingDefinition[] = currentLayout?.settingsDefinition || [];

    const editorStyle: CSSProperties = {
        '--columns-desktop': columns,
        '--columns-tablet': columnsTablet,
        '--columns-mobile': columnsMobile,
        '--peek-amount': '0%',
        '--slides-per-view': (columns || 1) + ((carouselPeek || 0) / 100),
    } as CSSProperties;

    // Helper to render dynamic settings from the layout definition
    const renderSettingsControl = (setting: SettingDefinition, index: number): JSX.Element | null => {
        if (setting.condition) {
            const shouldRender = Object.entries(setting.condition).every(([key, value]) => {
                return (attributes as any)[key] === value;
            });
            if (!shouldRender) {
                return null;
            }
        }

        const commonProps = {
            key: index,
            label: setting.label,
            help: setting.help,
        };

        switch (setting.type) {
            case 'text':
                return (
                    <TextControl
                        {...commonProps}
                        value={(attributes as any)[setting.name!] || setting.default || ''}
                        onChange={(value) => setAttributes({ [setting.name!]: value })}
                    />
                );
            case 'number':
                return (
                    <TextControl
                        {...commonProps}
                        type="number"
                        value={(attributes as any)[setting.name!] || setting.default || ''}
                        onChange={(value) => setAttributes({ [setting.name!]: Number(value) })}
                    />
                );
            case 'range':
                return (
                    <RangeControl
                        {...commonProps}
                        value={(attributes as any)[setting.name!] || setting.default}
                        onChange={(value) => setAttributes({ [setting.name!]: value })}
                        min={setting.min}
                        max={setting.max}
                        step={setting.step}
                    />
                );
            case 'toggle':
                return (
                    <ToggleControl
                        {...commonProps}
                        checked={(attributes as any)[setting.name!] ?? setting.default}
                        onChange={(value) => setAttributes({ [setting.name!]: value })}
                    />
                );
            case 'select':
                return (
                    <SelectControl
                        {...commonProps}
                        value={(attributes as any)[setting.name!] || setting.default}
                        options={setting.options || []}
                        onChange={(value) => setAttributes({ [setting.name!]: value })}
                    />
                );
            case 'panel':
                return (
                    <PanelBody title={setting.title} initialOpen={setting.initialOpen} key={index}>
                        {setting.controls?.map((childSetting, childIndex) =>
                            renderSettingsControl(childSetting, childIndex)
                        )}
                    </PanelBody>
                );
            default:
                return null;
        }
    };

    const blockProps = useBlockProps({
        className: [
            'dynamic-term-layout',
            `dynamic-term-layout--${resolvedLayout}`,
            `columns-${columns}`,
            `columns-tablet-${columnsTablet}`,
            `columns-mobile-${columnsMobile}`,
            itemsWrapperClass,
            className,
        ].filter(Boolean).join(' ') || undefined,
        style: editorStyle,
        'data-layout': resolvedLayout,
        'data-columns': columns,
        'data-columns-tablet': columnsTablet,
        'data-columns-mobile': columnsMobile,
        'data-slides-per-view': columns,
        'data-peek-amount': carouselPeek || 0,
        ...(isCarousel && spaceBetween ? { 'data-space-between': spaceBetween } : {}),
    });

    useEffect(() => {
        if (!layoutOptions.some((o) => o.value === layout) && layoutOptions.length) {
            setAttr('layout', layoutOptions[0].value);
        }
    }, [layoutOptions, layout]);

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Term Query', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Taxonomy', 'jankx')}
                        value={taxonomy}
                        options={taxonomyOptions}
                        onChange={(value) => {
                            setAttributes({
                                taxonomy: value,
                                termIn: [],
                                termNotIn: [],
                                termParent: 0,
                            } as any);
                        }}
                        help={__('Select a taxonomy to display its terms.', 'jankx')}
                    />

                    {termsResolved && !terms && (
                        <BaseControl>
                            <Spinner />
                        </BaseControl>
                    )}

                    <FormTokenField
                        label={__('Include specific terms', 'jankx')}
                        value={tokenFromIds(termIn)}
                        suggestions={termOptions.map((t) => t.name)}
                        onChange={(tokens) => handleTokenChange(tokens as TokenLike[], 'termIn')}
                        __experimentalExpandOnFocus
                        __experimentalShowHowTo={false}
                    />

                    <FormTokenField
                        label={__('Exclude terms', 'jankx')}
                        value={tokenFromIds(termNotIn)}
                        suggestions={termOptions.map((t) => t.name)}
                        onChange={(tokens) => handleTokenChange(tokens as TokenLike[], 'termNotIn')}
                        __experimentalExpandOnFocus
                        __experimentalShowHowTo={false}
                    />

                    <TextControl
                        label={__('Parent term ID', 'jankx')}
                        type="number"
                        value={termParent || ''}
                        onChange={(value) => setAttr('termParent', parseInt(value || '0', 10) || 0)}
                        help={__('Show only direct children of this term (0 = all).', 'jankx')}
                    />

                    <ToggleControl
                        label={__('Hide empty terms', 'jankx')}
                        checked={hideEmpty}
                        onChange={(value) => setAttr('hideEmpty', value)}
                    />

                    <ToggleControl
                        label={__('Show term count', 'jankx')}
                        checked={showTermCount}
                        onChange={(value) => setAttr('showTermCount', value)}
                    />

                    <RangeControl
                        label={__('Number of terms', 'jankx')}
                        value={postsPerPage}
                        onChange={(value) => setAttr('postsPerPage', value || 10)}
                        min={1}
                        max={100}
                    />

                    <SelectControl
                        label={__('Order by', 'jankx')}
                        value={orderBy}
                        options={[
                            { label: __('Name', 'jankx'), value: 'name' },
                            { label: __('Slug', 'jankx'), value: 'slug' },
                            { label: __('Count', 'jankx'), value: 'count' },
                            { label: __('Term order', 'jankx'), value: 'term_order' },
                            { label: __('Description', 'jankx'), value: 'description' },
                        ]}
                        onChange={(value) => setAttr('orderBy', value)}
                    />

                    <SelectControl
                        label={__('Order', 'jankx')}
                        value={order}
                        options={[
                            { label: __('ASC', 'jankx'), value: 'ASC' },
                            { label: __('DESC', 'jankx'), value: 'DESC' },
                        ]}
                        onChange={(value) => setAttr('order', value)}
                    />

                    <TextControl
                        label={__('Keyword', 'jankx')}
                        value={keyword}
                        onChange={(value) => setAttr('keyword', value)}
                    />
                </PanelBody>

                <PanelBody title={__('Layout', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Layout', 'jankx')}
                        value={resolvedLayout}
                        options={layoutOptions}
                        onChange={(value) => setAttr('layout', value)}
                    />

                    {['grid', 'card', 'masonry', 'carousel'].includes(resolvedLayout) && (
                        <BaseControl label={__('Columns', 'jankx')}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <RangeControl
                                    label={__('Desktop', 'jankx')}
                                    value={columns}
                                    onChange={(value) => setAttr('columns', value || 1)}
                                    min={1}
                                    max={6}
                                />
                                <RangeControl
                                    label={__('Tablet', 'jankx')}
                                    value={columnsTablet}
                                    onChange={(value) => setAttr('columnsTablet', value || 1)}
                                    min={1}
                                    max={4}
                                />
                                <RangeControl
                                    label={__('Mobile', 'jankx')}
                                    value={columnsMobile}
                                    onChange={(value) => setAttr('columnsMobile', value || 1)}
                                    min={1}
                                    max={2}
                                />
                            </div>
                        </BaseControl>
                    )}

                    <RangeControl
                        label={__('Space Between', 'jankx')}
                        value={spaceBetween}
                        onChange={(value) => setAttr('spaceBetween', value || 0)}
                        min={0}
                        max={100}
                    />
                    {/* Responsive Min Height */}
                    {(() => {
                        const minHeightValues = (attributes as any).minHeight || { desktop: '', tablet: '', mobile: '' };
                        const units = [
                            { value: 'px', label: 'px' },
                            { value: 'vh', label: 'vh' },
                            { value: '%', label: '%' },
                        ];
                        return (
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '500' }}>{__('Min Height', 'jankx')}</label>
                                    <div style={{ display: 'flex', gap: '2px', background: '#f0f0f0', borderRadius: '4px', padding: '2px' }}>
                                        {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
                                            <Button
                                                key={device}
                                                isPressed={minHeightDevice === device}
                                                onClick={() => setMinHeightDevice(device)}
                                                variant={minHeightDevice === device ? 'primary' : 'secondary'}
                                                size="small"
                                                title={device.charAt(0).toUpperCase() + device.slice(1)}
                                            >
                                                {device === 'desktop' ? '🖥️' : '📱'}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <UnitControl
                                    value={minHeightValues[minHeightDevice] || ''}
                                    onChange={(value: string | undefined) => setAttr('minHeight', {
                                        ...minHeightValues,
                                        [minHeightDevice]: value
                                    })}
                                    units={units}
                                    help={__('Set minimum height for the wrapper', 'jankx')}
                                />
                            </div>
                        );
                    })()}

                    {/* Layout Specific Settings (Inline) */}
                    {settingsDefinition
                        .filter((setting) => setting.type !== 'panel')
                        .map((setting, index) => renderSettingsControl(setting, index))}
                </PanelBody>

                {/* Layout Specific Panels (Dynamic) */}
                {settingsDefinition
                    .filter((setting) => setting.type === 'panel')
                    .map((setting, index) => renderSettingsControl(setting, index))}

                <PanelBody title={__('Empty State', 'jankx')} initialOpen={false}>
                    <ToggleControl
                        label={__('Show empty message', 'jankx')}
                        checked={showEmptyMessage}
                        onChange={(value) => setAttr('showEmptyMessage', value)}
                    />
                    {showEmptyMessage && (
                        <TextControl
                            label={__('Empty message', 'jankx')}
                            value={emptyMessage}
                            onChange={(value) => setAttr('emptyMessage', value)}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={['jankx/dynamic-term-template', 'core/heading']}
                    template={[['jankx/dynamic-term-template', {}]]}
                    templateLock={false}
                    renderAppender={InnerBlocks.ButtonBlockAppender}
                />
            </div>
        </>
    );
}
