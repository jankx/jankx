import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
} from '@wordpress/components';
import { useCallback, useMemo } from '@wordpress/element';

interface DynamicDataLayoutAttributes {
    queryPreset: string;
    postType: string;
    postsPerPage: number;
    layout: string;
    columns: number;
    columnsTablet: number;
    columnsMobile: number;
    orderBy: string;
    order: string;
    offset: number;
    includeStickyPosts: boolean;
    // Carousel specific
    slidesToScroll?: number;
    loop?: boolean;
    autoplay?: boolean;
    autoplayDelay?: number;
    showArrows?: boolean;
    showDots?: boolean;
}

interface DynamicDataLayoutEditProps {
    attributes: DynamicDataLayoutAttributes;
    setAttributes: (attributes: Partial<DynamicDataLayoutAttributes>) => void;
    clientId: string;
}

interface LayoutOption {
    name: string;
    title: string;
    postType: string;
}

export default function Edit({ attributes, setAttributes, clientId }: DynamicDataLayoutEditProps): JSX.Element {
    const {
        postType = 'post',
        postsPerPage = 10,
        layout = 'grid',
        columns = 3,
        columnsTablet = 2,
        columnsMobile = 1,
        orderBy = 'date',
        order = 'DESC',
        offset = 0,
        includeStickyPosts = false,
    } = attributes;

    // Get layouts data from PHP
    const layoutsData = (window as any).jankxDynamicDataLayouts || {
        layoutsByPostType: {},
        commonLayouts: [],
    };

    // Get available layouts for current post type
    const availableLayouts: LayoutOption[] = useMemo(() => {
        const layouts: LayoutOption[] = [];
        
        // Add common layouts
        if (layoutsData.commonLayouts) {
            layoutsData.commonLayouts.forEach((layoutInfo: LayoutOption) => {
                layouts.push(layoutInfo);
            });
        }
        
        // Add post type specific layouts
        if (layoutsData.layoutsByPostType && layoutsData.layoutsByPostType[postType]) {
            layoutsData.layoutsByPostType[postType].forEach((layoutInfo: LayoutOption) => {
                layouts.push(layoutInfo);
            });
        }
        
        return layouts;
    }, [postType, layoutsData]);

    // Layout options for SelectControl
    const layoutOptions = useMemo(() => {
        return availableLayouts.map((layoutInfo: LayoutOption) => ({
            label: layoutInfo.title || layoutInfo.name,
            value: layoutInfo.name,
        }));
    }, [availableLayouts]);

    const blockProps = useBlockProps({
        className: `dynamic-data-layout dynamic-data-layout--${layout}`,
    });

    const innerBlocksProps = {
        allowedBlocks: ['jankx/dynamic-data-template'],
        template: [['jankx/dynamic-data-template']],
        templateLock: false,
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Query Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Post Type', 'jankx')}
                        value={postType}
                        options={[
                            { label: __('Post', 'jankx'), value: 'post' },
                            { label: __('Page', 'jankx'), value: 'page' },
                            { label: __('Product', 'jankx'), value: 'product' },
                        ]}
                        onChange={(value: string): void => setAttributes({ postType: value })}
                    />
                    <RangeControl
                        label={__('Posts Per Page', 'jankx')}
                        value={postsPerPage}
                        onChange={(value: number | undefined): void => 
                            setAttributes({ postsPerPage: value || 10 })
                        }
                        min={1}
                        max={50}
                    />
                    <SelectControl
                        label={__('Order By', 'jankx')}
                        value={orderBy}
                        options={[
                            { label: __('Date', 'jankx'), value: 'date' },
                            { label: __('Title', 'jankx'), value: 'title' },
                            { label: __('Menu Order', 'jankx'), value: 'menu_order' },
                            { label: __('Random', 'jankx'), value: 'rand' },
                        ]}
                        onChange={(value: string): void => setAttributes({ orderBy: value })}
                    />
                    <SelectControl
                        label={__('Order', 'jankx')}
                        value={order}
                        options={[
                            { label: __('Descending', 'jankx'), value: 'DESC' },
                            { label: __('Ascending', 'jankx'), value: 'ASC' },
                        ]}
                        onChange={(value: string): void => setAttributes({ order: value })}
                    />
                    <RangeControl
                        label={__('Offset', 'jankx')}
                        value={offset}
                        onChange={(value: number | undefined): void => 
                            setAttributes({ offset: value || 0 })
                        }
                        min={0}
                        max={100}
                    />
                    <ToggleControl
                        label={__('Include Sticky Posts', 'jankx')}
                        checked={includeStickyPosts}
                        onChange={(value: boolean): void => setAttributes({ includeStickyPosts: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Layout Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Layout', 'jankx')}
                        value={layout}
                        options={layoutOptions}
                        onChange={(value: string): void => setAttributes({ layout: value })}
                    />
                    {layout !== 'carousel' && (
                        <>
                            <RangeControl
                                label={__('Columns (Desktop)', 'jankx')}
                                value={columns}
                                onChange={(value: number | undefined): void => 
                                    setAttributes({ columns: value || 3 })
                                }
                                min={1}
                                max={6}
                            />
                            <RangeControl
                                label={__('Columns (Tablet)', 'jankx')}
                                value={columnsTablet}
                                onChange={(value: number | undefined): void => 
                                    setAttributes({ columnsTablet: value || 2 })
                                }
                                min={1}
                                max={4}
                            />
                            <RangeControl
                                label={__('Columns (Mobile)', 'jankx')}
                                value={columnsMobile}
                                onChange={(value: number | undefined): void => 
                                    setAttributes({ columnsMobile: value || 1 })
                                }
                                min={1}
                                max={2}
                            />
                        </>
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <InnerBlocks {...innerBlocksProps} />
            </div>
        </>
    );
}

