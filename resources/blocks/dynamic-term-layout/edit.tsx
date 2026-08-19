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
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useMemo, useEffect } from '@wordpress/element';
import type { CSSProperties } from 'react';
import './style.scss';
import './editor.scss';

type TokenLike = string | { value: string; [key: string]: unknown };

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

interface LayoutInfo {
    name: string;
    title: string;
    supportedOptions?: string[];
    readOnlyOptions?: string[];
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

    const publicTaxonomies: TaxonomyItem[] = Array.isArray((window as any).jankxPublicTaxonomies)
        ? (window as any).jankxPublicTaxonomies
        : [];

    const taxonomyOptions = useMemo(() => {
        const map = new Map<string, string>();
        publicTaxonomies.forEach((t) => {
            if (!map.has(t.slug)) map.set(t.slug, t.name || t.slug);
        });
        return Array.from(map.entries()).map(([value, label]) => ({ label, value }));
    }, [publicTaxonomies]);

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

    const layoutsData = (window as any).jankxDynamicTermContentLoopLayouts || (window as any).jankxDynamicTermLayouts || null;

    const availableLayouts = useMemo(() => {
        const layouts: LayoutInfo[] = [];
        const push = (info: LayoutInfo) => {
            if (!layouts.some((l) => l.name === info.name)) {
                layouts.push({ name: info.name, title: info.title || info.name });
            }
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
        'data-layout': resolvedLayout,
        'data-columns': columns,
        'data-columns-tablet': columnsTablet,
        'data-columns-mobile': columnsMobile,
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
                        onChange={(value) => setAttr('taxonomy', value)}
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

                    {isCarousel && (
                        <>
                            <ToggleControl
                                label={__('Loop', 'jankx')}
                                checked={loop}
                                onChange={(value) => setAttr('loop', value)}
                            />
                            <ToggleControl
                                label={__('Autoplay', 'jankx')}
                                checked={autoplay}
                                onChange={(value) => setAttr('autoplay', value)}
                            />
                            {autoplay && (
                                <RangeControl
                                    label={__('Autoplay Delay (ms)', 'jankx')}
                                    value={autoplayDelay}
                                    onChange={(value) => setAttr('autoplayDelay', value || 3000)}
                                    min={500}
                                    max={10000}
                                    step={500}
                                />
                            )}
                            <ToggleControl
                                label={__('Show Arrows', 'jankx')}
                                checked={showArrows}
                                onChange={(value) => setAttr('showArrows', value)}
                            />
                            <ToggleControl
                                label={__('Show Dots', 'jankx')}
                                checked={showDots}
                                onChange={(value) => setAttr('showDots', value)}
                            />
                            <RangeControl
                                label={__('Peek', 'jankx')}
                                value={carouselPeek}
                                onChange={(value) => setAttr('carouselPeek', value || 0)}
                                min={0}
                                max={200}
                            />
                        </>
                    )}
                </PanelBody>

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
