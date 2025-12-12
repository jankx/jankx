import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
    BlockPreview,
    store as blockEditorStore,
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    ToggleControl,
    RangeControl,
    TextControl,
} from '@wordpress/components';
import { useMemo, useEffect, useState, useRef, useCallback } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { cloneBlock } from '@wordpress/blocks';
import type { CSSProperties } from 'react';

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
    };
}

interface ContentLoopLayoutOption {
    name: string;
    title: string;
    postType: string;
}

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

    // Get layouts data from PHP
    const layoutsData = (window as any).jankxDynamicDataContentLoopLayouts || {
        layoutsByPostType: {},
        commonLayouts: [],
    };

    // Get available layouts for current post type
    const availableLayouts: ContentLoopLayoutOption[] = useMemo(() => {
        const layouts: ContentLoopLayoutOption[] = [];
        
        // Use layoutsByPostType which already includes common layouts
        // This avoids duplicates since getLayoutsForPostType() already merges common + post type specific
        if (layoutsData.layoutsByPostType && layoutsData.layoutsByPostType[postType]) {
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
        const defaultBlocksData = (window as any).jankxDynamicDataTemplateDefaultBlocks || {};
        return defaultBlocksData[postType] || [];
    }, [postType]);

    // Convert default blocks to template format
    const defaultTemplate = useMemo(() => {
        return defaultBlocks.map((blockConfig: { blockName: string; attrs: Record<string, unknown> }) => [
            blockConfig.blockName,
            blockConfig.attrs,
        ]);
    }, [defaultBlocks]);

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
            template: defaultTemplate.length > 0 ? defaultTemplate : undefined,
            templateLock: false, // Allow editing inner blocks
            allowedBlocks: undefined, // Allow all blocks
        }
    );

    // Dispatch để có thể update blocks
    const { replaceInnerBlocks } = useDispatch(blockEditorStore);

    // Get current template block innerBlocks từ store
    const templateBlock = useSelect(
        (select) => select(blockEditorStore).getBlock(clientId),
        [clientId]
    );

    const currentInnerBlocks = templateBlock?.innerBlocks || [];

    // Shared state cho tất cả items - dùng React state để đồng nhất
    const [sharedInnerBlocks, setSharedInnerBlocks] = useState<any[]>(currentInnerBlocks);
    const isSyncingRef = useRef(false);
    const lastSyncedBlocksRef = useRef<string>('');

    // Sync: khi innerBlocks của template block thay đổi, update shared state
    useEffect(() => {
        if (isSyncingRef.current) {
            return; // Đang sync, bỏ qua
        }

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
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {/* Container với layout grid/card */}
                <div 
                    className={`dynamic-data-template__items-container layout-${displayLayout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`}
                    style={{
                        '--columns-desktop': columns,
                        '--columns-tablet': columnsTablet,
                        '--columns-mobile': columnsMobile,
                        display: displayLayout === 'grid' || displayLayout === 'card' ? 'grid' : 'block',
                        gridTemplateColumns: (displayLayout === 'grid' || displayLayout === 'card') 
                            ? `repeat(${columns}, 1fr)` 
                            : 'none',
                        gap: '1rem',
                    } as CSSProperties}
                >
                    {/* Tất cả items đều editable với InnerBlocks thật - hiển thị giống nhau như frontend */}
                    {Array.from({ length: totalItems }).map((_, index) => (
                        <div
                            key={`template-item-${index}`}
                            className="dynamic-data-template__item"
                            data-item-index={index}
                        >
                            {/* Tất cả items đều dùng InnerBlocks - có thể edit trực tiếp, hiển thị giống nhau */}
                            <div {...innerBlocksProps} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

