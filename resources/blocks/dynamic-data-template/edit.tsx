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
    } = attributes;

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
        
        // Add common layouts
        if (layoutsData.commonLayouts) {
            layoutsData.commonLayouts.forEach((layoutInfo: ContentLoopLayoutOption) => {
                layouts.push(layoutInfo);
            });
        }
        
        // Add post type specific layouts
        if (layoutsData.layoutsByPostType && layoutsData.layoutsByPostType[postType]) {
            layoutsData.layoutsByPostType[postType].forEach((layoutInfo: ContentLoopLayoutOption) => {
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

