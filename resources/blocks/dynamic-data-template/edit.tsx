import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
    BlockPreview,
    BlockContextProvider,
    store as blockEditorStore,
    MediaUpload,
} from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { useResizeObserver } from '@wordpress/compose';
import {
    PanelBody,
    SelectControl,
    ToggleControl,
    RangeControl,
    TextControl,
    Button,
} from '@wordpress/components';
import { useMemo, useEffect, useState, useRef, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import type { CSSProperties } from 'react';
import type { BlockInstance } from '@wordpress/blocks';

interface DynamicDataTemplateAttributes {
    templateLayout: string;
    className?: string;
    itemSpacing?: 'none' | 'compact' | 'normal' | 'loose';
    showItemBorder?: boolean;
    itemBorderRadius?: number;
    itemPadding?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
    };
    thumbnailPosition?: 'top' | 'bottom' | 'left' | 'right';
    // Hero Overlay layout settings
    heroMinHeight?: string;
    heroAspectRatio?: string;
    heroOverlayGradient?: string;
    heroFallbackBackground?: string;
    heroBorderRadius?: string;
    heroContentPadding?: string;
    // Overlay icon settings
    overlayIcon?: string;
    overlayIconShowMode?: 'always-show' | 'hover-hide' | 'hover-show';
    overlayIconPosition?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    overlayIconSize?: number;
    overlayIconColor?: string;
    overlayIconBackground?: string;
    overlayIconTarget?: 'featured-image' | 'entry-image' | 'entire-item';
    overlayIconType?: 'class' | 'image' | 'text';
    overlayIconImageId?: number;
    overlayIconImageUrl?: string;
    overlayIconText?: string;
    overlayIconRotate?: number;
    animationType?: string;
    animationDuration?: number;
    animationDelay?: number;
    animationTarget?: 'entry' | 'thumbnail';
    animationReverse?: boolean;
}


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
        queryPreset?: string;
        includeStickyPosts?: boolean;
        orderBy?: string;
        order?: string;
        offset?: number;
        taxQuery?: any[];
        metaQuery?: any[];
        keyword?: string;
        authorIn?: number[];
        authorNotIn?: number[];
        postIn?: number[];
        postNotIn?: number[];
        metaKey?: string;
        metaType?: string;
        postStatus?: string[];
        postParent?: number;
        postParentIn?: number[];
        postParentNotIn?: number[];
        customQueryId?: string;
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
    templateItemStyle?: CSSProperties;
    templateItemClassName?: string;
}

/**
 * Build inline styles for template item from block attributes
 */
const buildTemplateItemStyle = (attributes: any): CSSProperties => {
    const styles: CSSProperties = {};
    const attrStyle = attributes?.style;

    if (!attrStyle) {
        return styles;
    }

    // Spacing - padding
    if (attrStyle?.spacing?.padding) {
        const p = attrStyle.spacing.padding;
        if (p.top) styles.paddingTop = p.top;
        if (p.right) styles.paddingRight = p.right;
        if (p.bottom) styles.paddingBottom = p.bottom;
        if (p.left) styles.paddingLeft = p.left;
    }

    // Spacing - margin
    if (attrStyle?.spacing?.margin) {
        const m = attrStyle.spacing.margin;
        if (m.top) styles.marginTop = m.top;
        if (m.right) styles.marginRight = m.right;
        if (m.bottom) styles.marginBottom = m.bottom;
        if (m.left) styles.marginLeft = m.left;
    }

    // Colors - background
    if (attrStyle?.color?.background) {
        styles.backgroundColor = attrStyle.color.background;
    }

    // Colors - text
    if (attrStyle?.color?.text) {
        styles.color = attrStyle.color.text;
    }

    // Colors - gradient
    if (attrStyle?.color?.gradient) {
        styles.background = attrStyle.color.gradient;
    }

    // Typography - font size
    if (attrStyle?.typography?.fontSize) {
        styles.fontSize = attrStyle.typography.fontSize;
    }

    // Typography - line height
    if (attrStyle?.typography?.lineHeight) {
        styles.lineHeight = attrStyle.typography.lineHeight;
    }

    // Typography - font family
    if (attrStyle?.typography?.fontFamily) {
        styles.fontFamily = attrStyle.typography.fontFamily;
    }

    // Typography - font weight
    if (attrStyle?.typography?.fontWeight) {
        styles.fontWeight = attrStyle.typography.fontWeight;
    }

    // Typography - font style
    if (attrStyle?.typography?.fontStyle) {
        styles.fontStyle = attrStyle.typography.fontStyle;
    }

    // Typography - text transform
    if (attrStyle?.typography?.textTransform) {
        styles.textTransform = attrStyle.typography.textTransform as any;
    }

    // Typography - text decoration
    if (attrStyle?.typography?.textDecoration) {
        styles.textDecoration = attrStyle.typography.textDecoration;
    }

    // Typography - letter spacing
    if (attrStyle?.typography?.letterSpacing) {
        styles.letterSpacing = attrStyle.typography.letterSpacing;
    }

    // Border
    if (attrStyle?.border) {
        const border = attrStyle.border;
        if (border.radius) {
            styles.borderRadius = border.radius;
        }
        if (border.width) {
            styles.borderWidth = border.width;
        }
        if (border.style) {
            styles.borderStyle = border.style;
        }
        if (border.color) {
            styles.borderColor = border.color;
        }
    }

    return styles;
};

/**
 * Build CSS classes for template item from block attributes
 */
const buildTemplateItemClasses = (attributes: any): string => {
    const classes: string[] = [];

    // Add custom className if present
    if (attributes?.className) {
        classes.push(attributes.className);
    }

    // Add color classes if using theme colors
    if (attributes?.backgroundColor) {
        classes.push(`has-${attributes.backgroundColor}-background-color`);
        classes.push('has-background');
    }

    if (attributes?.textColor) {
        classes.push(`has-${attributes.textColor}-color`);
        classes.push('has-text-color');
    }

    if (attributes?.gradient) {
        classes.push(`has-${attributes.gradient}-gradient-background`);
        classes.push('has-background');
    }

    // Add font size class if using preset
    if (attributes?.fontSize) {
        classes.push(`has-${attributes.fontSize}-font-size`);
    }

    return classes.filter(Boolean).join(' ');
};

const PreviewItem = ({
    blocks,
    className,
    style,
    index,
    templateItemStyle,
    templateItemClassName,
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
            <div
                className={`dynamic-data-template__inner-blocks${templateItemClassName ? ' ' + templateItemClassName : ''}`}
                style={templateItemStyle}
            >
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
        templateLayout = 'default',
        className = '',
        itemSpacing = 'normal',
        showItemBorder = false,
        itemBorderRadius = 0,
        itemPadding = {},
        thumbnailPosition = 'top',
        heroMinHeight = '320px',
        heroAspectRatio = '',
        heroOverlayGradient = 'linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.45) 45%,transparent 100%)',
        heroFallbackBackground = 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',
        heroBorderRadius = '12px',
        heroContentPadding = '30px 24px 24px',
        overlayIcon,
        overlayIconShowMode = 'always-show',
        overlayIconPosition = 'center',
        overlayIconSize = 24,
        overlayIconColor = '#ffffff',
        overlayIconBackground = 'rgba(0, 0, 0, 0.5)',
        overlayIconTarget = 'featured-image',
        overlayIconType = 'class',
        overlayIconImageId = 0,
        overlayIconImageUrl = '',
        overlayIconText = '',
        overlayIconRotate = 0,
        animationType = 'none',
        animationDuration = 1000,
        animationDelay = 0,
        animationTarget = 'entry',
        animationReverse = false,
    } = attributes;


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

    // Prepare query args
    const queryArgs = useMemo(() => {
        const args: Record<string, any> = {
            per_page: postsPerPage,
            offset: context.offset || 0,
            order: (context.order || 'desc').toLowerCase(),
            orderby: context.orderBy || 'date',
            status: Array.isArray(context.postStatus) ? context.postStatus.join(',') : (context.postStatus || 'publish'),
            _embed: true, // Fetch embedded data like featured media
        };

        if (context.keyword) args.search = context.keyword;
        if (context.authorIn?.length) args.author = context.authorIn.join(',');
        if (context.authorNotIn?.length) args.author_exclude = context.authorNotIn.join(',');
        if (context.postIn?.length) args.include = context.postIn.join(',');
        if (context.postNotIn?.length) args.exclude = context.postNotIn.join(',');
        if (context.postParent) args.parent = context.postParent;
        if (context.postParentIn?.length) args.parent = context.postParentIn.join(',');
        if (context.postParentNotIn?.length) args.parent_exclude = context.postParentNotIn.join(',');
        // ignore_sticky_posts logic depends on API version but generally REST doesn't sticky by default unless asked?
        // Actually REST API doesn't move sticky posts to top by default like WP_Query.
        // But let's leave it as is.

        return args;
    }, [context, postsPerPage]);

    // Fetch posts
    const { posts, hasResolved } = useSelect((select) => {
        const { getEntityRecords, hasFinishedResolution } = select(coreStore);
        const selectorArgs = ['postType', postType, queryArgs];
        return {
            posts: getEntityRecords(...selectorArgs),
            hasResolved: hasFinishedResolution('getEntityRecords', selectorArgs),
        };
    }, [postType, queryArgs]);

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
        className: `dynamic-data-template dynamic-data-template--${templateLayout}`,
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
        if (hasResolved && posts) {
            return Math.max(1, posts.length);
        }
        // Giới hạn tối đa 12 items cho performance khi loading
        return Math.min(Math.max(1, postsPerPage), 12);
    }, [postsPerPage, hasResolved, posts]);

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
                        value={templateLayout}
                        options={[
                            { label: __('Default', 'jankx'), value: 'default' },
                            { label: __('Hero Overlay', 'jankx'), value: 'hero-overlay' },
                            { label: __('Boxed', 'jankx'), value: 'boxed' },
                            { label: __('Horizontal', 'jankx'), value: 'horizontal' },
                            { label: __('Overlap Card', 'jankx'), value: 'overlap-card' },
                        ]}
                        onChange={(value: string): void => setAttributes({ templateLayout: value })}
                        help={__('Choose the overall item layout style.', 'jankx')}
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

                {templateLayout === 'hero-overlay' && (
                    <PanelBody title={__('Hero Overlay Settings', 'jankx')} initialOpen={true}>
                        <TextControl
                            label={__('Min Height', 'jankx')}
                            value={heroMinHeight}
                            onChange={(value: string) => setAttributes({ heroMinHeight: value })}
                            help={__('e.g. 320px, 50vh', 'jankx')}
                        />
                        <SelectControl
                            label={__('Aspect Ratio', 'jankx')}
                            value={heroAspectRatio}
                            options={[
                                { label: __('None (use min-height)', 'jankx'), value: '' },
                                { label: '16:9', value: '16/9' },
                                { label: '4:3', value: '4/3' },
                                { label: '3:2', value: '3/2' },
                                { label: '1:1', value: '1/1' },
                                { label: '21:9', value: '21/9' },
                            ]}
                            onChange={(value: string) => setAttributes({ heroAspectRatio: value })}
                            help={__('When set, overrides min-height on larger screens.', 'jankx')}
                        />
                        <TextControl
                            label={__('Border Radius', 'jankx')}
                            value={heroBorderRadius}
                            onChange={(value: string) => setAttributes({ heroBorderRadius: value })}
                            help={__('e.g. 12px, 0px', 'jankx')}
                        />
                        <TextControl
                            label={__('Content Padding', 'jankx')}
                            value={heroContentPadding}
                            onChange={(value: string) => setAttributes({ heroContentPadding: value })}
                            help={__('e.g. 30px 24px 24px', 'jankx')}
                        />
                        <div className="components-base-control">
                            <label className="components-base-control__label">
                                {__('Fallback Background', 'jankx')}
                            </label>
                            <TextControl
                                label=""
                                value={heroFallbackBackground}
                                onChange={(value: string) => setAttributes({ heroFallbackBackground: value })}
                                help={__('Color or gradient shown when no featured image. e.g. #1a1a2e or linear-gradient(...)', 'jankx')}
                            />
                        </div>
                        <div className="components-base-control">
                            <label className="components-base-control__label">
                                {__('Overlay Gradient', 'jankx')}
                            </label>
                            <TextControl
                                label=""
                                value={heroOverlayGradient}
                                onChange={(value: string) => setAttributes({ heroOverlayGradient: value })}
                                help={__('CSS gradient for the dark overlay on top of the image.', 'jankx')}
                            />
                        </div>
                    </PanelBody>
                )}

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

                </PanelBody>
            </InspectorControls>

            <InspectorControls>
                <PanelBody title={__('Overlay Icon Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Overlay Source', 'jankx')}
                        value={overlayIconType || 'class'}
                        options={[
                            { label: __('Icon Class', 'jankx'), value: 'class' },
                            { label: __('Image', 'jankx'), value: 'image' },
                        ]}
                        onChange={(value) => setAttributes({ overlayIconType: value as any })}
                    />

                    {overlayIconType === 'image' ? (
                        <>
                            <MediaUpload
                                onSelect={(media: any) => {
                                    const url = media?.url || '';
                                    const id = media?.id || 0;
                                    setAttributes({
                                        overlayIconImageUrl: url,
                                        overlayIconImageId: id,
                                    });
                                }}
                                allowedTypes={['image']}
                                value={overlayIconImageId || 0}
                                render={({ open }) => (
                                    <Button variant="primary" onClick={open}>
                                        {overlayIconImageUrl ? __('Change Overlay Image', 'jankx') : __('Select Overlay Image', 'jankx')}
                                    </Button>
                                )}
                            />
                            {overlayIconImageUrl && (
                                <div style={{ marginTop: 8 }}>
                                    <img src={overlayIconImageUrl} alt="" style={{ maxWidth: '100%', height: 'auto' }} />
                                    <Button
                                        variant="secondary"
                                        onClick={() => setAttributes({ overlayIconImageUrl: '', overlayIconImageId: 0 })}
                                        style={{ marginTop: 8 }}
                                    >
                                        {__('Remove Image', 'jankx')}
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : overlayIconType === 'text' ? (
                        <>
                            <TextControl
                                label={__('Symbol Text', 'jankx')}
                                value={overlayIconText}
                                onChange={(value) => setAttributes({ overlayIconText: value })}
                                help={__('Ví dụ: ▶, ★, ▷', 'jankx')}
                            />
                            <RangeControl
                                label={__('Rotate (deg)', 'jankx')}
                                value={overlayIconRotate || 0}
                                onChange={(value) => setAttributes({ overlayIconRotate: value || 0 })}
                                min={-180}
                                max={180}
                                step={1}
                            />
                        </>
                    ) : (
                        <TextControl
                            label={__('Icon Class', 'jankx')}
                            value={overlayIcon}
                            onChange={(value) => setAttributes({ overlayIcon: value })}
                            help={__('Enter icon class (e.g., fas fa-play, dashicons-video-alt3)', 'jankx')}
                        />
                    )}

                    {(overlayIconType === 'image' ? !!overlayIconImageUrl : (overlayIconType === 'text' ? !!overlayIconText : !!overlayIcon)) && (
                        <>
                            <SelectControl
                                label={__('Display Mode', 'jankx')}
                                value={overlayIconShowMode || 'always-show'}
                                options={[
                                    { label: __('Always Show', 'jankx'), value: 'always-show' },
                                    { label: __('Show on Hover', 'jankx'), value: 'hover-show' },
                                    { label: __('Hide on Hover', 'jankx'), value: 'hover-hide' },
                                ]}
                                onChange={(value) => setAttributes({ overlayIconShowMode: value as any })}
                            />

                            <SelectControl
                                label={__('Icon Position', 'jankx')}
                                value={overlayIconPosition || 'center'}
                                options={[
                                    { label: __('Center', 'jankx'), value: 'center' },
                                    { label: __('Top Left', 'jankx'), value: 'top-left' },
                                    { label: __('Top Right', 'jankx'), value: 'top-right' },
                                    { label: __('Bottom Left', 'jankx'), value: 'bottom-left' },
                                    { label: __('Bottom Right', 'jankx'), value: 'bottom-right' },
                                ]}
                                onChange={(value) => setAttributes({ overlayIconPosition: value as any })}
                            />

                            <SelectControl
                                label={__('Target Area', 'jankx')}
                                value={overlayIconTarget || 'featured-image'}
                                options={[
                                    { label: __('Featured Image', 'jankx'), value: 'featured-image' },
                                    { label: __('Entry Image', 'jankx'), value: 'entry-image' },
                                    { label: __('Entire Item', 'jankx'), value: 'entire-item' },
                                ]}
                                onChange={(value) => setAttributes({ overlayIconTarget: value as any })}
                                help={__('Choose where the overlay icon should appear', 'jankx')}
                            />

                            <RangeControl
                                label={__('Icon Size', 'jankx')}
                                value={overlayIconSize || 24}
                                onChange={(value) => setAttributes({ overlayIconSize: value || 24 })}
                                min={10}
                                max={100}
                                step={1}
                            />

                            <div className="components-base-control">
                                <label className="components-base-control__label">
                                    {__('Icon Color', 'jankx')}
                                </label>
                                <div className="components-color-palette-control__color-indicator-wrapper">
                                    <input
                                        type="color"
                                        value={overlayIconColor || '#ffffff'}
                                        onChange={(e) => setAttributes({ overlayIconColor: e.target.value })}
                                        style={{ width: '100%', height: '40px' }}
                                    />
                                </div>
                            </div>

                            <div className="components-base-control">
                                <label className="components-base-control__label">
                                    {__('Icon Background', 'jankx')}
                                </label>
                                <div className="components-color-palette-control__color-indicator-wrapper">
                                    <input
                                        type="color"
                                        value={overlayIconBackground || 'rgba(0, 0, 0, 0.5)'}
                                        onChange={(e) => setAttributes({ overlayIconBackground: e.target.value })}
                                        style={{ width: '100%', height: '40px' }}
                                    />
                                </div>
                                <p className="components-base-control__help">
                                    {__('Use RGBA format for transparency (e.g., rgba(0,0,0,0.5))', 'jankx')}
                                </p>
                            </div>
                        </>
                    )}
                </PanelBody>

                <PanelBody title={__('Scroll Animation', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Animation Type', 'jankx')}
                        value={animationType || 'none'}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('Fade In', 'jankx'), value: 'fade-in' },
                            { label: __('Fade In Up', 'jankx'), value: 'fade-in-up' },
                            { label: __('Fade In Down', 'jankx'), value: 'fade-in-down' },
                            { label: __('Fade In Left', 'jankx'), value: 'fade-in-left' },
                            { label: __('Fade In Right', 'jankx'), value: 'fade-in-right' },
                            { label: __('Zoom In', 'jankx'), value: 'zoom-in' },
                            { label: __('Slide In Up', 'jankx'), value: 'slide-in-up' },
                        ]}
                        onChange={(value) => setAttributes({ animationType: value })}
                    />
                    {animationType !== 'none' && (
                        <>
                            <RangeControl
                                label={__('Animation Duration (ms)', 'jankx')}
                                value={animationDuration || 1000}
                                onChange={(value) => setAttributes({ animationDuration: value || 1000 })}
                                min={100}
                                max={5000}
                                step={100}
                            />
                            <RangeControl
                                label={__('Animation Delay (ms)', 'jankx')}
                                value={animationDelay || 0}
                                onChange={(value) => setAttributes({ animationDelay: value || 0 })}
                                min={0}
                                max={5000}
                                step={100}
                            />
                            <SelectControl
                                label={__('Animation Target', 'jankx')}
                                value={animationTarget || 'entry'}
                                options={[
                                    { label: __('Whole Item (Entry)', 'jankx'), value: 'entry' },
                                    { label: __('Thumbnail Only', 'jankx'), value: 'thumbnail' },
                                ]}
                                onChange={(value) => setAttributes({ animationTarget: value as any })}
                            />
                            <ToggleControl
                                label={__('Reverse Animation on Scroll Out', 'jankx')}
                                checked={animationReverse}
                                onChange={(value) => setAttributes({ animationReverse: value })}
                                help={__('Hide item when scroll back up', 'jankx')}
                            />
                        </>
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
                                    const animationClass = animationType && animationType !== 'none' ? `jankx-reveal jankx-reveal--${animationType} jankx-reveal--target-${animationTarget} ${animationReverse ? 'jankx-reveal--reverse' : ''}` : '';
                                    const itemStyle: CSSProperties = {
                                        flex: `0 0 calc(100% / ${columns})`,
                                        scrollSnapAlign: carouselAlign,
                                    };
                                    if (animationType !== 'none') {
                                        (itemStyle as any)['--jankx-animation-duration'] = `${animationDuration}ms`;
                                        (itemStyle as any)['--jankx-animation-delay'] = `${index * animationDelay}ms`;
                                    }
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

                                    const postData = posts && posts[index] ? posts[index] : null;
                                    const contextValue = postData ? { postId: postData.id, postType: postData.type } : {};

                                    if (index === 0) {
                                        return (
                                            <div
                                                key={`item-${index}`}
                                                className={`dynamic-data-template__item ${animationClass}`}
                                                data-item-index={index}
                                                style={itemStyle}
                                            >
                                                {postData ? (
                                                    <BlockContextProvider value={contextValue}>
                                                        <div {...innerBlocksProps} />
                                                    </BlockContextProvider>
                                                ) : (
                                                    <div {...innerBlocksProps} />
                                                )}
                                            </div>
                                        );
                                    }
                                    return (
                                        <div
                                            key={`item-${index}`}
                                            className={`dynamic-data-template__item dynamic-data-template__item--preview ${animationClass}`}
                                            data-item-index={index}
                                            style={itemStyle}
                                        >
                                            {postData ? (
                                                <BlockContextProvider value={contextValue}>
                                                    <PreviewItem
                                                        index={index}
                                                        blocks={sharedInnerBlocks}
                                                        templateItemStyle={buildTemplateItemStyle(attributes)}
                                                        templateItemClassName={buildTemplateItemClasses(attributes)}
                                                    />
                                                </BlockContextProvider>
                                            ) : (
                                                <PreviewItem
                                                    index={index}
                                                    blocks={sharedInnerBlocks}
                                                    templateItemStyle={buildTemplateItemStyle(attributes)}
                                                    templateItemClassName={buildTemplateItemClasses(attributes)}
                                                />
                                            )}
                                        </div>
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
                            const animationClass = animationType && animationType !== 'none' ? `jankx-reveal jankx-reveal--${animationType} jankx-reveal--target-${animationTarget} ${animationReverse ? 'jankx-reveal--reverse' : ''}` : '';
                            const postData = posts && posts[index] ? posts[index] : null;
                            const contextValue = postData ? { postId: postData.id, postType: postData.type } : {};

                            if (index === 0) {
                                const itemStyle2: CSSProperties = {};
                                if (animationType !== 'none') {
                                    (itemStyle2 as any)['--jankx-animation-duration'] = `${animationDuration}ms`;
                                    (itemStyle2 as any)['--jankx-animation-delay'] = `${index * animationDelay}ms`;
                                }
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
                                        className={`dynamic-data-template__item ${animationClass}`}
                                        data-item-index={index}
                                        style={itemStyle2}
                                    >
                                        {postData ? (
                                            <BlockContextProvider value={contextValue}>
                                                <div {...innerBlocksProps} />
                                            </BlockContextProvider>
                                        ) : (
                                            <div {...innerBlocksProps} />
                                        )}
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
                                <div
                                    key={`item-${index}`}
                                    className={`dynamic-data-template__item dynamic-data-template__item--preview ${animationClass}`}
                                    data-item-index={index}
                                    style={itemStyle3}
                                >
                                    {postData ? (
                                        <BlockContextProvider value={contextValue}>
                                            <PreviewItem
                                                index={index}
                                                blocks={sharedInnerBlocks}
                                                templateItemStyle={buildTemplateItemStyle(attributes)}
                                                templateItemClassName={buildTemplateItemClasses(attributes)}
                                            />
                                        </BlockContextProvider>
                                    ) : (
                                        <PreviewItem
                                            index={index}
                                            blocks={sharedInnerBlocks}
                                            templateItemStyle={buildTemplateItemStyle(attributes)}
                                            templateItemClassName={buildTemplateItemClasses(attributes)}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
