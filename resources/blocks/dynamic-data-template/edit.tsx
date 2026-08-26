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
    Tooltip,
    FocalPointPicker,
} from '@wordpress/components';
import { useMemo, useEffect, useState, useRef, useCallback } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlocksFromTemplate } from '@wordpress/blocks';
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
    animationTarget?: string;
    animationReverse?: boolean;
    hoverAnimation?: string;
    unhoverAnimation?: string;
    // Overlap Card specific settings
    overlapMarginTop?: string;
    overlapPadding?: string;
    overlapBorderRadius?: string;
    overlapBackgroundColor?: string;
    carouselPeek?: number;
    // Item Background settings
    itemBgType?: 'none' | 'color' | 'image';
    itemBgColor?: string;
    itemBgImageId?: number;
    itemBgImageUrl?: string;
    itemBgImageSource?: 'custom' | 'featured';
    itemBgPosition?: string;
    itemBgSize?: 'cover' | 'contain' | 'auto';
    itemBgRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
    itemBgOverlay?: string;
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
        carouselPeek?: number;
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

const LAYOUT_ICONS: Record<string, JSX.Element> = {
    default: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="8" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
            <rect x="4" y="15" width="16" height="1.5" rx="0.75" fill="currentColor" />
            <rect x="4" y="18.5" width="10" height="1.5" rx="0.75" fill="currentColor" />
        </svg>
    ),
    boxed: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="6" y="6" width="12" height="8" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
            <rect x="6" y="16" width="12" height="1.2" rx="0.6" fill="currentColor" />
        </svg>
    ),
    horizontal: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="6" width="7" height="12" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
            <rect x="13" y="8" width="7" height="1.5" rx="0.75" fill="currentColor" />
            <rect x="13" y="11" width="7" height="1.5" rx="0.75" fill="currentColor" />
            <rect x="13" y="14" width="4" height="1.5" rx="0.75" fill="currentColor" />
        </svg>
    ),
    'overlap-card': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="10" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
            <rect x="6" y="11" width="12" height="9" rx="1" fill="white" stroke="currentColor" strokeWidth="1.5" />
            <rect x="8" y="13.5" width="8" height="1.2" rx="0.6" fill="currentColor" />
            <rect x="8" y="16" width="6" height="1.2" rx="0.6" fill="currentColor" />
        </svg>
    ),
    'hero-overlay': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
            <rect x="4" y="4" width="16" height="16" rx="1" fill="url(#hero-gradient)" fillOpacity="0.3" />
            <rect x="6" y="14" width="12" height="1.5" rx="0.75" fill="currentColor" />
            <rect x="6" y="16.5" width="8" height="1.5" rx="0.75" fill="currentColor" />
            <defs>
                <linearGradient id="hero-gradient" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="currentColor" stopOpacity="0.6" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0.1" />
                </linearGradient>
            </defs>
        </svg>
    ),
};

const GET_LAYOUT_TEMPLATE = (layout: string) => {
    switch (layout) {
        case 'horizontal':
            return [
                ['core/columns', {}, [
                    ['core/column', { width: '33.33%' }, [
                        ['core/post-featured-image', {}]
                    ]],
                    ['core/column', { width: '66.66%' }, [
                        ['core/post-title', { isLink: true }],
                        ['jankx/human-readable-post-date', {}],
                        ['core/post-excerpt', {}]
                    ]]
                ]]
            ];
        case 'overlap-card':
            return [
                ['core/post-featured-image', {}],
                ['core/group', { className: 'overlap-card-content' }, [
                    ['core/post-title', { isLink: true }],
                    ['jankx/human-readable-post-date', {}]
                ]]
            ];
        case 'boxed':
            return [
                ['core/post-featured-image', {}],
                ['core/group', { style: { spacing: { padding: { top: '15px', right: '15px', bottom: '15px', left: '15px' } } } }, [
                    ['core/post-title', { isLink: true }],
                    ['jankx/human-readable-post-date', {}],
                    ['core/post-excerpt', {}]
                ]]
            ];
        case 'hero-overlay':
            return [
                ['core/post-featured-image', {}],
                ['core/post-title', { isLink: true }],
                ['jankx/human-readable-post-date', {}]
            ];
        default:
            return [
                ['core/post-featured-image', {}],
                ['core/post-title', { isLink: true }],
                ['jankx/human-readable-post-date', {}],
                ['core/post-excerpt', {}]
            ];
    }
};

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

    // Add template layout class
    if (attributes?.templateLayout) {
        classes.push(`content-loop-layout--${attributes.templateLayout}`);
    }

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

/**
 * Build inline styles for item background from block attributes
 */
const buildItemBackgroundStyle = (attributes: any): CSSProperties => {
    const styles: CSSProperties = {};
    const bgType = attributes?.itemBgType;

    if (!bgType || bgType === 'none') {
        return styles;
    }

    if (bgType === 'color') {
        if (attributes?.itemBgColor) {
            styles.backgroundColor = attributes.itemBgColor;
        }
    }

    if (bgType === 'image') {
        if (attributes?.itemBgImageUrl) {
            styles.backgroundImage = `url(${attributes.itemBgImageUrl})`;
        } else if (attributes?.itemBgImageSource === 'featured') {
            // Featured image will be handled via CSS class or data attribute
            styles.backgroundImage = 'var(--item-bg-image, none)';
        }
        if (attributes?.itemBgSize) {
            styles.backgroundSize = attributes.itemBgSize;
        }
        if (attributes?.itemBgRepeat) {
            styles.backgroundRepeat = attributes.itemBgRepeat;
        }
        if (attributes?.itemBgPosition) {
            styles.backgroundPosition = attributes.itemBgPosition;
        }
        if (attributes?.itemBgOverlay) {
            styles.position = 'relative';
        }
    }

    return styles;
};

/**
 * Build overlay style for item background image
 */
const buildItemBackgroundOverlayStyle = (attributes: any): CSSProperties => {
    const styles: CSSProperties = {};

    if (attributes?.itemBgType !== 'image' || !attributes?.itemBgOverlay) {
        return styles;
    }

    styles.position = 'absolute';
    styles.inset = '0';
    styles.backgroundColor = attributes.itemBgOverlay;
    styles.pointerEvents = 'none';
    styles.zIndex = '1';

    return styles;
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
        heroContentPadding = '5px 10px',
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
        hoverAnimation = 'none',
        unhoverAnimation = 'none',
        overlapMarginTop = '-60px',
        overlapPadding = '20px',
        overlapBorderRadius = '8px',
        overlapBackgroundColor = '#ffffff',
        itemBgType = 'none',
        itemBgColor = '',
        itemBgImageId = 0,
        itemBgImageUrl = '',
        itemBgImageSource = 'custom',
        itemBgPosition = 'center center',
        itemBgSize = 'cover',
        itemBgRepeat = 'no-repeat',
        itemBgOverlay = '',
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
    const carouselPeek = context?.carouselPeek || 0;

    const { replaceInnerBlocks } = useDispatch(blockEditorStore);

    const onLayoutChange = useCallback((newLayout: string) => {
        setAttributes({ templateLayout: newLayout });

        // Auto replace inner blocks
        const template = GET_LAYOUT_TEMPLATE(newLayout);
        const newBlocks = createBlocksFromTemplate(template as any);
        replaceInnerBlocks(clientId, newBlocks);
    }, [clientId, setAttributes, replaceInnerBlocks]);

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
        className: `dynamic-data-template content-loop-layout--${templateLayout}`,
        ...(thumbnailPosition && { 'data-thumbnail-position': thumbnailPosition }),
        style: templateLayout === 'overlap-card' ? {
            '--jankx-overlap-margin-top': overlapMarginTop,
            '--jankx-overlap-padding': overlapPadding,
            '--jankx-overlap-radius': overlapBorderRadius,
            '--jankx-overlap-bg': overlapBackgroundColor,
        } as React.CSSProperties : undefined,
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
                    <div className="jankx-layout-chooser">
                        <label className="jankx-layout-chooser__label">{__('Content Loop Layout', 'jankx')}</label>
                        <div className="jankx-layout-chooser__group" style={{display:'flex',gap:'2px'}}>
                            {[
                                { label: __('Default', 'jankx'), value: 'default' },
                                { label: __('Boxed', 'jankx'), value: 'boxed' },
                                { label: __('Horizontal', 'jankx'), value: 'horizontal' },
                                { label: __('Overlap Card', 'jankx'), value: 'overlap-card' },
                                { label: __('Hero Overlay', 'jankx'), value: 'hero-overlay' },
                            ].map((option) => (
                                <Tooltip text={option.label} key={option.value}>
                                    <Button
                                        isPressed={templateLayout === option.value}
                                        onClick={() => onLayoutChange(option.value)}
                                        className="jankx-layout-chooser__button"
                                        variant={templateLayout === option.value ? 'primary' : 'secondary'}
                                    >
                                        {LAYOUT_ICONS[option.value] || option.label}
                                    </Button>
                                </Tooltip>
                            ))}
                        </div>
                        <p className="jankx-layout-chooser__help">{__('Choose the overall item layout style. Changing this will reset item content.', 'jankx')}</p>
                    </div>

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

                {templateLayout === 'overlap-card' && (
                    <PanelBody title={__('Overlap Card Settings', 'jankx')} initialOpen={true}>
                        <TextControl
                            label={__('Margin Top', 'jankx')}
                            value={overlapMarginTop}
                            onChange={(value: string) => setAttributes({ overlapMarginTop: value })}
                            help={__('Tiếp xúc với hình ảnh, e.g. -60px', 'jankx')}
                        />
                        <TextControl
                            label={__('Padding', 'jankx')}
                            value={overlapPadding}
                            onChange={(value: string) => setAttributes({ overlapPadding: value })}
                            help={__('e.g. 20px', 'jankx')}
                        />
                        <TextControl
                            label={__('Border Radius', 'jankx')}
                            value={overlapBorderRadius}
                            onChange={(value: string) => setAttributes({ overlapBorderRadius: value })}
                            help={__('e.g. 8px', 'jankx')}
                        />
                        <div className="components-base-control">
                            <label className="components-base-control__label">
                                {__('Background Color', 'jankx')}
                            </label>
                            <div className="components-color-palette-control__color-indicator-wrapper">
                                <input
                                    type="color"
                                    value={overlapBackgroundColor || '#ffffff'}
                                    onChange={(e) => setAttributes({ overlapBackgroundColor: e.target.value })}
                                    style={{ width: '100%', height: '40px' }}
                                />
                            </div>
                        </div>
                    </PanelBody>
                )}

                {templateLayout === 'hero-overlay' && (
                    <PanelBody title={__('Hero Overlay Settings', 'jankx')} initialOpen={true}>
                        <TextControl
                            label={__('Min Height', 'jankx')}
                            value={heroMinHeight}
                            onChange={(value: string) => setAttributes({ heroMinHeight: value })}
                            help={__('e.g. 320px, 50vh', 'jankx')}
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
                            help={__('e.g. 5px 10px', 'jankx')}
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

                <PanelBody title={__('Item Background', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Background Type', 'jankx')}
                        value={itemBgType}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('Color', 'jankx'), value: 'color' },
                            { label: __('Image', 'jankx'), value: 'image' },
                        ]}
                        onChange={(value) => setAttributes({ itemBgType: value as any })}
                    />

                    {itemBgType === 'color' && (
                        <div className="components-base-control">
                            <label className="components-base-control__label">
                                {__('Background Color', 'jankx')}
                            </label>
                            <div className="components-color-palette-control__color-indicator-wrapper">
                                <input
                                    type="color"
                                    value={itemBgColor || '#ffffff'}
                                    onChange={(e) => setAttributes({ itemBgColor: e.target.value })}
                                    style={{ width: '100%', height: '40px' }}
                                />
                            </div>
                        </div>
                    )}

                    {itemBgType === 'image' && (
                        <>
                            <SelectControl
                                label={__('Image Source', 'jankx')}
                                value={itemBgImageSource}
                                options={[
                                    { label: __('Custom Image', 'jankx'), value: 'custom' },
                                    { label: __('Featured Image', 'jankx'), value: 'featured' },
                                ]}
                                onChange={(value) => setAttributes({ itemBgImageSource: value as any })}
                            />

                            {itemBgImageSource === 'custom' && (
                                <MediaUpload
                                    onSelect={(media: any) => {
                                        setAttributes({
                                            itemBgImageId: media?.id || 0,
                                            itemBgImageUrl: media?.url || '',
                                        });
                                    }}
                                    allowedTypes={['image']}
                                    value={itemBgImageId || 0}
                                    render={({ open }) => (
                                        <Button variant="secondary" onClick={open} style={{ marginBottom: 8 }}>
                                            {itemBgImageUrl ? __('Change Background Image', 'jankx') : __('Select Background Image', 'jankx')}
                                        </Button>
                                    )}
                                />
                            )}

                            {itemBgImageSource === 'custom' && itemBgImageUrl && (
                                <div style={{ marginBottom: 8 }}>
                                    <img src={itemBgImageUrl} alt="" style={{ maxWidth: '100%', height: 'auto', borderRadius: 4 }} />
                                    <Button
                                        variant="secondary"
                                        onClick={() => setAttributes({ itemBgImageUrl: '', itemBgImageId: 0 })}
                                        style={{ marginTop: 8 }}
                                    >
                                        {__('Remove Image', 'jankx')}
                                    </Button>
                                </div>
                            )}

                            {itemBgImageSource === 'featured' && (
                                <p className="components-base-control__help">
                                    {__('Will use each item\'s featured image as background.', 'jankx')}
                                </p>
                            )}

                            <SelectControl
                                label={__('Background Size', 'jankx')}
                                value={itemBgSize}
                                options={[
                                    { label: __('Cover', 'jankx'), value: 'cover' },
                                    { label: __('Contain', 'jankx'), value: 'contain' },
                                    { label: __('Auto', 'jankx'), value: 'auto' },
                                ]}
                                onChange={(value) => setAttributes({ itemBgSize: value as any })}
                            />

                            <SelectControl
                                label={__('Background Repeat', 'jankx')}
                                value={itemBgRepeat}
                                options={[
                                    { label: __('No Repeat', 'jankx'), value: 'no-repeat' },
                                    { label: __('Repeat', 'jankx'), value: 'repeat' },
                                    { label: __('Repeat X', 'jankx'), value: 'repeat-x' },
                                    { label: __('Repeat Y', 'jankx'), value: 'repeat-y' },
                                ]}
                                onChange={(value) => setAttributes({ itemBgRepeat: value as any })}
                            />

                            <div className="components-base-control">
                                <label className="components-base-control__label">
                                    {__('Background Position', 'jankx')}
                                </label>
                                <FocalPointPicker
                                    value={itemBgPosition}
                                    onChange={(value) => setAttributes({ itemBgPosition: value })}
                                    dimensions={{ width: 100, height: 100 }}
                                    url={itemBgImageUrl || undefined}
                                    style={{ width: '100%', height: 120 }}
                                />
                            </div>

                            <div className="components-base-control">
                                <label className="components-base-control__label">
                                    {__('Overlay Color', 'jankx')}
                                </label>
                                <div className="components-color-palette-control__color-indicator-wrapper">
                                    <input
                                        type="color"
                                        value={itemBgOverlay || '#000000'}
                                        onChange={(e) => setAttributes({ itemBgOverlay: e.target.value })}
                                        style={{ width: '100%', height: '40px' }}
                                    />
                                </div>
                                <p className="components-base-control__help">
                                    {__('Optional color overlay on top of background image.', 'jankx')}
                                </p>
                            </div>
                        </>
                    )}
                </PanelBody>
            </InspectorControls>

            <InspectorControls>
                <PanelBody title={__('Overlay Icon Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Overlay Source', 'jankx')}
                        value={(overlayIconType || 'class') as 'class' | 'image' | 'text'}
                        options={[
                            { label: __('Icon Class', 'jankx'), value: 'class' },
                            { label: __('Image', 'jankx'), value: 'image' },
                            { label: __('Small Text/Symbol', 'jankx'), value: 'text' },
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
                            { label: __('Rotate In', 'jankx'), value: 'rotate-in' },
                            { label: __('Flip In X', 'jankx'), value: 'flip-in-x' },
                            { label: __('Flip In Y', 'jankx'), value: 'flip-in-y' },
                            { label: __('Slide In Up', 'jankx'), value: 'slide-in-up' },
                            { label: __('Slide In Down', 'jankx'), value: 'slide-in-down' },
                            { label: __('Slide In Left', 'jankx'), value: 'slide-in-left' },
                            { label: __('Slide In Right', 'jankx'), value: 'slide-in-right' },
                        ]}
                        onChange={(value) => setAttributes({ animationType: value as any })}
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

                <PanelBody title={__('Hover Animation', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Hover Animation', 'jankx')}
                        value={hoverAnimation}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('Bounce', 'jankx'), value: 'bounce' },
                            { label: __('Flash', 'jankx'), value: 'flash' },
                            { label: __('Pulse', 'jankx'), value: 'pulse' },
                            { label: __('Rubber Band', 'jankx'), value: 'rubberBand' },
                            { label: __('Shake X', 'jankx'), value: 'shakeX' },
                            { label: __('Shake Y', 'jankx'), value: 'shakeY' },
                            { label: __('Head Shake', 'jankx'), value: 'headShake' },
                            { label: __('Swing', 'jankx'), value: 'swing' },
                            { label: __('Tada', 'jankx'), value: 'tada' },
                            { label: __('Wobble', 'jankx'), value: 'wobble' },
                            { label: __('Jello', 'jankx'), value: 'jello' },
                            { label: __('Heart Beat', 'jankx'), value: 'heartBeat' },
                            { label: __('Back In Down', 'jankx'), value: 'backInDown' },
                            { label: __('Back In Up', 'jankx'), value: 'backInUp' },
                            { label: __('Back In Left', 'jankx'), value: 'backInLeft' },
                            { label: __('Back In Right', 'jankx'), value: 'backInRight' },
                            { label: __('Bounce In', 'jankx'), value: 'bounceIn' },
                            { label: __('Bounce In Down', 'jankx'), value: 'bounceInDown' },
                            { label: __('Bounce In Up', 'jankx'), value: 'bounceInUp' },
                            { label: __('Fade In', 'jankx'), value: 'fadeIn' },
                            { label: __('Fade In Down', 'jankx'), value: 'fadeInDown' },
                            { label: __('Fade In Up', 'jankx'), value: 'fadeInUp' },
                            { label: __('Flip', 'jankx'), value: 'flip' },
                            { label: __('Flip In X', 'jankx'), value: 'flipInX' },
                            { label: __('Flip In Y', 'jankx'), value: 'flipInY' },
                            { label: __('Light Speed In Right', 'jankx'), value: 'lightSpeedInRight' },
                            { label: __('Light Speed In Left', 'jankx'), value: 'lightSpeedInLeft' },
                            { label: __('Rotate In', 'jankx'), value: 'rotateIn' },
                            { label: __('Zoom In', 'jankx'), value: 'zoomIn' },
                            { label: __('Zoom Out', 'jankx'), value: 'zoomOut' },
                            { label: __('Slide In Down', 'jankx'), value: 'slideInDown' },
                            { label: __('Slide In Up', 'jankx'), value: 'slideInUp' },
                            { label: __('Slide In Left', 'jankx'), value: 'slideInLeft' },
                            { label: __('Slide In Right', 'jankx'), value: 'slideInRight' },
                        ]}
                        onChange={(value) => setAttributes({ hoverAnimation: value })}
                        help={__('animate.css effect when hovering over an item', 'jankx')}
                    />
                    <SelectControl
                        label={__('Unhover Animation', 'jankx')}
                        value={unhoverAnimation}
                        options={[
                            { label: __('None', 'jankx'), value: 'none' },
                            { label: __('Bounce Out', 'jankx'), value: 'bounceOut' },
                            { label: __('Bounce Out Down', 'jankx'), value: 'bounceOutDown' },
                            { label: __('Bounce Out Up', 'jankx'), value: 'bounceOutUp' },
                            { label: __('Fade Out', 'jankx'), value: 'fadeOut' },
                            { label: __('Fade Out Down', 'jankx'), value: 'fadeOutDown' },
                            { label: __('Fade Out Up', 'jankx'), value: 'fadeOutUp' },
                            { label: __('Fade Out Left', 'jankx'), value: 'fadeOutLeft' },
                            { label: __('Fade Out Right', 'jankx'), value: 'fadeOutRight' },
                            { label: __('Flip Out X', 'jankx'), value: 'flipOutX' },
                            { label: __('Flip Out Y', 'jankx'), value: 'flipOutY' },
                            { label: __('Light Speed Out Right', 'jankx'), value: 'lightSpeedOutRight' },
                            { label: __('Light Speed Out Left', 'jankx'), value: 'lightSpeedOutLeft' },
                            { label: __('Rotate Out', 'jankx'), value: 'rotateOut' },
                            { label: __('Zoom Out', 'jankx'), value: 'zoomOut' },
                            { label: __('Slide Out Down', 'jankx'), value: 'slideOutDown' },
                            { label: __('Slide Out Up', 'jankx'), value: 'slideOutUp' },
                            { label: __('Slide Out Left', 'jankx'), value: 'slideOutLeft' },
                            { label: __('Slide Out Right', 'jankx'), value: 'slideOutRight' },
                            { label: __('Bounce', 'jankx'), value: 'bounce' },
                            { label: __('Flash', 'jankx'), value: 'flash' },
                            { label: __('Pulse', 'jankx'), value: 'pulse' },
                            { label: __('Rubber Band', 'jankx'), value: 'rubberBand' },
                            { label: __('Shake X', 'jankx'), value: 'shakeX' },
                            { label: __('Tada', 'jankx'), value: 'tada' },
                        ]}
                        onChange={(value) => setAttributes({ unhoverAnimation: value })}
                        help={__('animate.css effect when mouse leaves an item', 'jankx')}
                    />
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
                                    const effectiveCols = Math.max(0.1, (columns || 1) + ((carouselPeek || 0) / 100));
                                    const itemStyle: CSSProperties = {
                                        flex: `0 0 calc(100% / ${effectiveCols})`,
                                        width: `calc(100% / ${effectiveCols})`,
                                        maxWidth: `calc(100% / ${effectiveCols})`,
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

                                    // Apply item background styles
                                    const bgStyle = buildItemBackgroundStyle(attributes);
                                    Object.assign(itemStyle, bgStyle);
                                    Object.assign(itemStyle, buildTemplateItemStyle(attributes));

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
                                                {itemBgType === 'image' && itemBgOverlay && (
                                                    <div style={buildItemBackgroundOverlayStyle(attributes)} />
                                                )}
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
                                            {itemBgType === 'image' && itemBgOverlay && (
                                                <div style={buildItemBackgroundOverlayStyle(attributes)} />
                                            )}
                                            {postData ? (
                                                <BlockContextProvider value={contextValue}>
                                                    <PreviewItem
                                                        index={index}
                                                        blocks={sharedInnerBlocks}
                                                        templateItemClassName={buildTemplateItemClasses(attributes)}
                                                    />
                                                </BlockContextProvider>
                                            ) : (
                                                <PreviewItem
                                                    index={index}
                                                    blocks={sharedInnerBlocks}
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

                                // Apply item background styles
                                const bgStyle2 = buildItemBackgroundStyle(attributes);
                                Object.assign(itemStyle2, bgStyle2);
                                Object.assign(itemStyle2, buildTemplateItemStyle(attributes));

                                return (
                                    <div
                                        key={`item-${index}`}
                                        className={`dynamic-data-template__item ${animationClass}`}
                                        data-item-index={index}
                                        data-hover-ani={hoverAnimation !== 'none' ? hoverAnimation : undefined}
                                        data-unhover-ani={unhoverAnimation !== 'none' ? unhoverAnimation : undefined}
                                        style={itemStyle2}
                                    >
                                        {itemBgType === 'image' && itemBgOverlay && (
                                            <div style={buildItemBackgroundOverlayStyle(attributes)} />
                                        )}
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

                            // Apply item background styles
                            const bgStyle3 = buildItemBackgroundStyle(attributes);
                            Object.assign(itemStyle3, bgStyle3);
                            Object.assign(itemStyle3, buildTemplateItemStyle(attributes));

                            return (
                                <div
                                    key={`item-${index}`}
                                    className={`dynamic-data-template__item dynamic-data-template__item--preview ${animationClass}`}
                                    data-item-index={index}
                                    data-hover-ani={hoverAnimation !== 'none' ? hoverAnimation : undefined}
                                    data-unhover-ani={unhoverAnimation !== 'none' ? unhoverAnimation : undefined}
                                    style={itemStyle3}
                                >
                                    {itemBgType === 'image' && itemBgOverlay && (
                                        <div style={buildItemBackgroundOverlayStyle(attributes)} />
                                    )}
                                    {postData ? (
                                        <BlockContextProvider value={contextValue}>
                                            <PreviewItem
                                                index={index}
                                                blocks={sharedInnerBlocks}
                                                templateItemClassName={buildTemplateItemClasses(attributes)}
                                            />
                                        </BlockContextProvider>
                                    ) : (
                                        <PreviewItem
                                            index={index}
                                            blocks={sharedInnerBlocks}
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
