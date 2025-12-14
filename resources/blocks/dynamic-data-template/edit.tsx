import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
    BlockPreview,
    store as blockEditorStore,
} from '@wordpress/block-editor';
import { useResizeObserver } from '@wordpress/compose';
import {
    PanelBody,
    SelectControl,
    ToggleControl,
    RangeControl,
    TextControl,
} from '@wordpress/components';
import { useMemo, useEffect, useState, useRef, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import type { CSSProperties } from 'react';
import type { BlockInstance } from '@wordpress/blocks';

interface DynamicDataTemplateAttributes {
    contentLoopLayout: string;
    className?: string;
    itemSpacing?: string;
    showItemBorder?: boolean;
    itemBorderRadius?: number;
    itemPadding?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
    };
    thumbnailPosition?: 'top' | 'bottom' | 'left' | 'right';
    imageRatio?: string;
    overlayIcon?: string;
    overlayIconMode?: 'always-show' | 'hover-hide' | 'hover-show';
}

// Image ratio presets
const PRESET_IMAGE_RATIOS = ['16/9', '4/3', '21/9', '1/1', '3/4', '2/3', '9/16'] as const;
type PresetImageRatio = typeof PRESET_IMAGE_RATIOS[number];
type ImageRatioSelectValue = '' | 'custom' | PresetImageRatio;

interface DynamicDataTemplateEditProps {
    attributes: DynamicDataTemplateAttributes;
    setAttributes: (attributes: Partial<DynamicDataTemplateAttributes>) => void;
    clientId: string;
    context: {
        query?: {
            postType?: string;
        };
        postType?: string;
        postsPerPage?: number;
        displayLayout?: string;
        columns?: number;
        columnsTablet?: number;
        columnsMobile?: number;
        slidesToScroll?: number;
        showArrows?: boolean;
        showDots?: boolean;
        carouselAlign?: 'start' | 'center' | 'end';
    };
}

interface ContentLoopLayoutOption {
    name: string;
    title: string;
    postType: string;
}

declare global {
    interface Window {
        jankxDynamicDataContentLoopLayouts?: {
            layoutsByPostType: Record<string, ContentLoopLayoutOption[]>;
            commonLayouts: ContentLoopLayoutOption[];
        };
        jankxDynamicDataTemplateDefaultBlocks?: Record<string, { blockName: string; attrs: Record<string, unknown> }[]>;
    }
}

const DEFAULT_LAYOUTS_DATA = {
    layoutsByPostType: {},
    commonLayouts: [],
};

const DEFAULT_BLOCKS_DATA: Record<string, { blockName: string; attrs: Record<string, unknown> }[]> = {};

interface PreviewItemProps {
    blocks: BlockInstance[];
    className?: string;
    style?: CSSProperties;
    index: number;
}

const PreviewItem = ({
    blocks,
    className,
    style,
    index,
}: PreviewItemProps) => {
    const [resizeListener, sizes] = useResizeObserver();
    const width = sizes && sizes.width;

    return (
        <div
            className={className}
            data-item-index={index}
            style={style}
        >
            {resizeListener}
            <div className="dynamic-data-template__inner-blocks">
                {!!width && (
                    <BlockPreview
                        blocks={blocks}
                        viewportWidth={width}
                    />
                )}
            </div>
        </div>
    );
};

export default function Edit({
    attributes,
    setAttributes,
    clientId,
    context,
}: DynamicDataTemplateEditProps): JSX.Element {
    const {
        contentLoopLayout = 'default',
        itemSpacing = 'normal',
        showItemBorder = false,
        itemBorderRadius = 0,
        thumbnailPosition = 'top',
        imageRatio = '',
        overlayIcon = '',
        overlayIconMode = 'always-show',
    } = attributes;

    // Image ratio handling
    const imageRatioSelectValue = useMemo<ImageRatioSelectValue>(() => {
        if (!imageRatio) {
            return '';
        }
        if ((PRESET_IMAGE_RATIOS as readonly string[]).includes(imageRatio)) {
            return imageRatio as PresetImageRatio;
        }
        return 'custom';
    }, [imageRatio]);

    const isCustomImageRatio = imageRatioSelectValue === 'custom';
    const customImageRatioValue = isCustomImageRatio && imageRatio ? imageRatio : '';

    // Get post type and settings from context
    const postType: string = context?.query?.postType || context?.postType || 'post';
    const postsPerPage: number = context?.postsPerPage || 10;
    const displayLayout: string = context?.displayLayout || 'grid';
    const columns: number = context?.columns || 3;
    const columnsTablet: number = context?.columnsTablet || 2;
    const columnsMobile: number = context?.columnsMobile || 1;
    const slidesToScroll: number = context?.slidesToScroll || 1;
    const showArrows: boolean = !!context?.showArrows;
    const showDots: boolean = !!context?.showDots;
    const carouselAlign = context?.carouselAlign || 'start';

    // Get layouts data from PHP
    const layoutsData = window.jankxDynamicDataContentLoopLayouts || DEFAULT_LAYOUTS_DATA;

    // Get available layouts for current post type
    const availableLayouts: ContentLoopLayoutOption[] = useMemo(() => {
        const layouts: ContentLoopLayoutOption[] = [];
        
        // Use layoutsByPostType which already includes common layouts
        // This avoids duplicates since getLayoutsForPostType() already merges common + post type specific
        if (layoutsData.layoutsByPostType && typeof layoutsData.layoutsByPostType === 'object' && postType in layoutsData.layoutsByPostType && Array.isArray(layoutsData.layoutsByPostType[postType])) {
            layoutsData.layoutsByPostType[postType].forEach((layoutInfo: ContentLoopLayoutOption) => {
                layouts.push(layoutInfo);
            });
        } else if (layoutsData.commonLayouts) {
            // Fallback to common layouts if post type specific layouts not found
            layoutsData.commonLayouts.forEach((layoutInfo: ContentLoopLayoutOption) => {
                layouts.push(layoutInfo);
            });
        }
        
        return layouts;
    }, [postType, layoutsData]);

    // Layout options for SelectControl
    const layoutOptions = useMemo(() => {
        return availableLayouts.map((layoutInfo: ContentLoopLayoutOption) => ({
            label: layoutInfo.title || layoutInfo.name,
            value: layoutInfo.name,
        }));
    }, [availableLayouts]);

    // Get default blocks for post type
    const defaultBlocks = useMemo(() => {
        const defaultBlocksData = window.jankxDynamicDataTemplateDefaultBlocks || DEFAULT_BLOCKS_DATA;
        return defaultBlocksData[postType] || [];
    }, [postType]);

    // Recursive function to convert blocks to template format
    const convertToTemplate = useCallback((blocks: any[]): any[] => {
        return blocks.map((block) => [
            block.blockName,
            block.attrs || {},
            block.innerBlocks ? convertToTemplate(block.innerBlocks) : []
        ]);
    }, []);

    // Convert default blocks to template format
    const defaultTemplate = useMemo(() => {
        return convertToTemplate(defaultBlocks);
    }, [defaultBlocks, convertToTemplate]);

    const blockProps = useBlockProps({
        className: `dynamic-data-template dynamic-data-template--${contentLoopLayout}`,
        ...(imageRatio && { 'data-image-ratio': imageRatio }),
        ...(thumbnailPosition && { 'data-thumbnail-position': thumbnailPosition }),
    });

    // InnerBlocks props cho tất cả items (tất cả đều editable)
    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'dynamic-data-template__inner-blocks',
        },
        {
            template: defaultTemplate.length > 0 ? defaultTemplate as any : undefined,
            templateLock: false, // Allow editing inner blocks
            allowedBlocks: undefined, // Allow all blocks
        }
    );

    // Get current template block innerBlocks từ store
    const templateBlock = useSelect(
        (select) => select(blockEditorStore).getBlock(clientId),
        [clientId]
    );

    const currentInnerBlocks = templateBlock?.innerBlocks || [];

    // Shared state cho tất cả items - dùng React state để đồng nhất
    const [sharedInnerBlocks, setSharedInnerBlocks] = useState<BlockInstance[]>(currentInnerBlocks);
    const lastSyncedBlocksRef = useRef<string>('');

    // Sync: khi innerBlocks của template block thay đổi, update shared state
    useEffect(() => {
        const currentBlocksStr = JSON.stringify(currentInnerBlocks);
        
        // Chỉ sync nếu thực sự có thay đổi
        if (currentBlocksStr !== lastSyncedBlocksRef.current) {
            lastSyncedBlocksRef.current = currentBlocksStr;
            setSharedInnerBlocks(currentInnerBlocks);
        }
    }, [currentInnerBlocks]);


    // Calculate total items to display (including editable one)
    const totalItems = useMemo(() => {
        // Giới hạn tối đa 12 items cho performance
        return Math.min(Math.max(1, postsPerPage), 12);
    }, [postsPerPage]);

    const viewportRef = useRef<HTMLDivElement | null>(null);
    const scrollBySlides = useCallback((n: number) => {
        const vp = viewportRef.current;
        if (!vp) return;
        const width = vp.clientWidth;
        const perSlide = width / Math.max(1, columns);
        vp.scrollBy({ left: n * perSlide * Math.max(1, slidesToScroll), behavior: 'smooth' });
    }, [columns, slidesToScroll]);
    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Template Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Content Loop Layout', 'jankx')}
                        value={contentLoopLayout}
                        options={layoutOptions}
                        onChange={(value: string): void => setAttributes({ contentLoopLayout: value })}
                    />
                    <SelectControl
                        label={__('Item Spacing', 'jankx')}
                        value={itemSpacing}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('Compact', 'jankx'), value: 'compact' },
                            { label: __('Normal', 'jankx'), value: 'normal' },
                            { label: __('Loose', 'jankx'), value: 'loose' },
                        ]}
                        onChange={(value: string): void => setAttributes({ itemSpacing: value })}
                    />
                    <ToggleControl
                        label={__('Show Item Border', 'jankx')}
                        checked={showItemBorder}
                        onChange={(value: boolean): void => setAttributes({ showItemBorder: value })}
                    />
                    {showItemBorder && (
                        <RangeControl
                            label={__('Border Radius', 'jankx')}
                            value={itemBorderRadius}
                            onChange={(value: number | undefined): void => 
                                setAttributes({ itemBorderRadius: value || 0 })
                            }
                            min={0}
                            max={50}
                        />
                    )}
                </PanelBody>

                <PanelBody title={__('Image Settings', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Thumbnail Position', 'jankx')}
                        value={thumbnailPosition || 'top'}
                        options={[
                            { label: __('Top (Default)', 'jankx'), value: 'top' },
                            { label: __('Bottom', 'jankx'), value: 'bottom' },
                            { label: __('Left', 'jankx'), value: 'left' },
                            { label: __('Right', 'jankx'), value: 'right' },
                        ]}
                        onChange={(value) => setAttributes({ thumbnailPosition: value as DynamicDataTemplateAttributes['thumbnailPosition'] })}
                        help={__('Choose where the featured image appears relative to the content.', 'jankx')}
                    />
                    <SelectControl
                        label={__('Image Aspect Ratio', 'jankx')}
                        value={imageRatioSelectValue}
                        onChange={(value) => {
                            if (value === 'custom') {
                                setAttributes({ imageRatio: '' });
                            } else {
                                setAttributes({ imageRatio: value || '' });
                            }
                        }}
                        help={__('Set the aspect ratio for featured images', 'jankx')}
                        options={[
                            { label: __('Default (3:2)', 'jankx'), value: '' },
                            { label: __('16:9 (Landscape)', 'jankx'), value: '16/9' },
                            { label: __('4:3 (Landscape)', 'jankx'), value: '4/3' },
                            { label: __('21:9 (Ultra Wide)', 'jankx'), value: '21/9' },
                            { label: __('1:1 (Square)', 'jankx'), value: '1/1' },
                            { label: __('3:4 (Portrait)', 'jankx'), value: '3/4' },
                            { label: __('2:3 (Portrait)', 'jankx'), value: '2/3' },
                            { label: __('9:16 (Vertical)', 'jankx'), value: '9/16' },
                            { label: __('Custom', 'jankx'), value: 'custom' },
                        ]}
                    />
                    {isCustomImageRatio && (
                        <TextControl
                            label={__('Custom Ratio', 'jankx')}
                            value={customImageRatioValue}
                            onChange={(value) => {
                                const ratioPattern = /^\d+\/\d+$/;
                                if (!value || ratioPattern.test(value)) {
                                    setAttributes({ imageRatio: value || '' });
                                }
                            }}
                            help={__('Enter aspect ratio in format: width/height (e.g., 16/9, 3/4)', 'jankx')}
                            placeholder="16/9"
                        />
                    )}
                    <TextControl
                        label={__('Overlay Icon Class', 'jankx')}
                        value={overlayIcon}
                        onChange={(value) => setAttributes({ overlayIcon: value })}
                        help={__('Enter icon class (e.g., fas fa-play, dashicons-video-alt3)', 'jankx')}
                    />
                    {overlayIcon && (
                        <SelectControl
                            label={__('Overlay Icon Mode', 'jankx')}
                            value={overlayIconMode}
                            options={[
                                { label: __('Always Show', 'jankx'), value: 'always-show' },
                                { label: __('Hover to Hide', 'jankx'), value: 'hover-hide' },
                                { label: __('Hover to Show', 'jankx'), value: 'hover-show' },
                            ]}
                            onChange={(value) => setAttributes({ overlayIconMode: value as any })}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {displayLayout === 'carousel' ? (
                    <div className={`dynamic-data-template__carousel columns-${columns}`}>
                        {showArrows ? (
                            <div className="dynamic-data-template__carousel-nav">
                                <button type="button" className="carousel-button prev" onClick={() => scrollBySlides(-1)}>Prev</button>
                                <button type="button" className="carousel-button next" onClick={() => scrollBySlides(1)}>Next</button>
                            </div>
                        ) : null}
                        <div
                            ref={viewportRef}
                            className="dynamic-data-template__carousel-viewport"
                            style={{
                                overflow: 'hidden',
                            } as CSSProperties}
                        >
                            <div
                                className={`dynamic-data-template__items-container layout-${displayLayout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`}
                                style={{
                                    '--columns-desktop': columns,
                                    '--columns-tablet': columnsTablet,
                                    '--columns-mobile': columnsMobile,
                                    display: 'flex',
                                    gap: '1rem',
                                    scrollSnapType: 'x mandatory',
                                } as CSSProperties}
                            >
                                {Array.from({ length: totalItems }).map((_, index) => {
                                    const itemStyle: CSSProperties = {
                                        flex: `0 0 calc(100% / ${columns})`,
                                        scrollSnapAlign: carouselAlign,
                                    };
                                    const spacing = (attributes as any)?.style?.spacing;
                                    if (spacing?.padding) {
                                        const p = spacing.padding;
                                        if (p.top) itemStyle.paddingTop = p.top as any;
                                        if (p.right) itemStyle.paddingRight = p.right as any;
                                        if (p.bottom) itemStyle.paddingBottom = p.bottom as any;
                                        if (p.left) itemStyle.paddingLeft = p.left as any;
                                    }
                                    if (spacing?.margin) {
                                        const m = spacing.margin;
                                        if (m.top) itemStyle.marginTop = m.top as any;
                                        if (m.right) itemStyle.marginRight = m.right as any;
                                        if (m.bottom) itemStyle.marginBottom = m.bottom as any;
                                        if (m.left) itemStyle.marginLeft = m.left as any;
                                    }
                                    if (index === 0) {
                                        return (
                                            <div
                                                key={`item-${index}`}
                                                className="dynamic-data-template__item"
                                                data-item-index={index}
                                                style={itemStyle}
                                            >
                                                <div {...innerBlocksProps} />
                                            </div>
                                        );
                                    }
                                    return (
                                        <PreviewItem
                                            key={`item-${index}`}
                                            className="dynamic-data-template__item dynamic-data-template__item--preview"
                                            index={index}
                                            style={itemStyle}
                                            blocks={sharedInnerBlocks}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        {showDots ? (
                            <div className="dynamic-data-template__carousel-dots"></div>
                        ) : null}
                    </div>
                ) : (
                    <div 
                        className={`dynamic-data-template__items-container layout-${displayLayout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`}
                        style={{
                            '--columns-desktop': columns,
                            '--columns-tablet': columnsTablet,
                            '--columns-mobile': columnsMobile,
                            display: displayLayout === 'grid' || displayLayout === 'card' ? 'grid' : 'block',
                            gridTemplateColumns: (displayLayout === 'grid' || displayLayout === 'card') 
                                ? `repeat(${columns}, minmax(0, 1fr))` 
                                : 'none',
                            gap: '1rem',
                        } as CSSProperties}
                    >
                        {Array.from({ length: totalItems }).map((_, index) => {
                            if (index === 0) {
                                const itemStyle2: CSSProperties = {};
                                const spacing2 = (attributes as any)?.style?.spacing;
                                if (spacing2?.padding) {
                                    const p2 = spacing2.padding;
                                    if (p2.top) itemStyle2.paddingTop = p2.top as any;
                                    if (p2.right) itemStyle2.paddingRight = p2.right as any;
                                    if (p2.bottom) itemStyle2.paddingBottom = p2.bottom as any;
                                    if (p2.left) itemStyle2.paddingLeft = p2.left as any;
                                }
                                if (spacing2?.margin) {
                                    const m2 = spacing2.margin;
                                    if (m2.top) itemStyle2.marginTop = m2.top as any;
                                    if (m2.right) itemStyle2.marginRight = m2.right as any;
                                    if (m2.bottom) itemStyle2.marginBottom = m2.bottom as any;
                                    if (m2.left) itemStyle2.marginLeft = m2.left as any;
                                }
                                return (
                                    <div
                                        key={`item-${index}`}
                                        className="dynamic-data-template__item"
                                        data-item-index={index}
                                        style={itemStyle2}
                                    >
                                        <div {...innerBlocksProps} />
                                    </div>
                                );
                            }
                            const itemStyle3: CSSProperties = {};
                            const spacing3 = (attributes as any)?.style?.spacing;
                            if (spacing3?.padding) {
                                const p3 = spacing3.padding;
                                if (p3.top) itemStyle3.paddingTop = p3.top as any;
                                if (p3.right) itemStyle3.paddingRight = p3.right as any;
                                if (p3.bottom) itemStyle3.paddingBottom = p3.bottom as any;
                                if (p3.left) itemStyle3.paddingLeft = p3.left as any;
                            }
                            if (spacing3?.margin) {
                                const m3 = spacing3.margin;
                                if (m3.top) itemStyle3.marginTop = m3.top as any;
                                if (m3.right) itemStyle3.marginRight = m3.right as any;
                                if (m3.bottom) itemStyle3.marginBottom = m3.bottom as any;
                                if (m3.left) itemStyle3.marginLeft = m3.left as any;
                            }
                            return (
                                <PreviewItem
                                    key={`item-${index}`}
                                    className="dynamic-data-template__item dynamic-data-template__item--preview"
                                    index={index}
                                    style={itemStyle3}
                                    blocks={sharedInnerBlocks}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
