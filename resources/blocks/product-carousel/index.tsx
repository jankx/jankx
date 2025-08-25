import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import React from 'react';
import {
    useBlockProps,
    InspectorControls,
    BlockControls,
    AlignmentToolbar,
    RichText,
    InnerBlocks,
    useInnerBlocksProps
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, TextControl, RangeControl } from '@wordpress/components';
import { grid, settings, layout, navigation } from '@wordpress/icons';

type Alignment = 'left' | 'center' | 'right';
type TitleTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface ProductCarouselAttributes {
    title: string;
    showTitle: boolean;
    titleTag: TitleTag;
    titleAlignment: Alignment;
    carouselType: 'swiper' | 'slick' | 'owl';
    slidesPerView: number;
    slidesPerViewMobile: number;
    slidesPerViewTablet: number;
    spaceBetween: number;
    autoplay: boolean;
    autoplayDelay: number;
    loop: boolean;
    showNavigation: boolean;
    showPagination: boolean;
    navigationStyle: 'arrows' | 'dots' | 'both';
    paginationStyle: 'dots' | 'numbers' | 'progress';
    showProductImage: boolean;
    showProductTitle: boolean;
    showProductPrice: boolean;
    showProductRating: boolean;
    showAddToCart: boolean;
    imageSize: 'thumbnail' | 'medium' | 'large' | 'full';
    customClassName?: string;
    anchor?: string;
}

const ALLOWED_BLOCKS: string[] = [
    'woocommerce/product-query',
];

const TEMPLATE: any[] = [
    ['woocommerce/product-query', {}]
];

const Edit = ({ attributes, setAttributes }: { attributes: ProductCarouselAttributes; setAttributes: (attrs: Partial<ProductCarouselAttributes>) => void; }): JSX.Element => {
    const {
        title,
        showTitle,
        titleTag,
        titleAlignment,
        carouselType,
        slidesPerView,
        slidesPerViewMobile,
        slidesPerViewTablet,
        spaceBetween,
        autoplay,
        autoplayDelay,
        loop,
        showNavigation,
        showPagination,
        navigationStyle,
        paginationStyle,
        showProductImage,
        showProductTitle,
        showProductPrice,
        showProductRating,
        showAddToCart,
        imageSize,
        customClassName,
        anchor
    } = attributes;

    const blockProps = useBlockProps({
        className: `jankx-product-carousel ${customClassName || ''}`.trim()
    });

    const innerBlocksProps = useInnerBlocksProps(
        { className: 'jankx-product-carousel__content' },
        {
            allowedBlocks: ALLOWED_BLOCKS,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            template: TEMPLATE,
            templateLock: false
        }
    );

    const titleTagOptions = [
        { label: __('H1', 'jankx'), value: 'h1' },
        { label: __('H2', 'jankx'), value: 'h2' },
        { label: __('H3', 'jankx'), value: 'h3' },
        { label: __('H4', 'jankx'), value: 'h4' },
        { label: __('H5', 'jankx'), value: 'h5' },
        { label: __('H6', 'jankx'), value: 'h6' }
    ];

    const titleAlignmentOptions = [
        { label: __('Left', 'jankx'), value: 'left' },
        { label: __('Center', 'jankx'), value: 'center' },
        { label: __('Right', 'jankx'), value: 'right' }
    ];

    const carouselTypeOptions = [
        { label: __('Swiper', 'jankx'), value: 'swiper' },
        { label: __('Slick', 'jankx'), value: 'slick' },
        { label: __('Owl Carousel', 'jankx'), value: 'owl' }
    ];

    const navigationStyleOptions = [
        { label: __('Arrows', 'jankx'), value: 'arrows' },
        { label: __('Dots', 'jankx'), value: 'dots' },
        { label: __('Both', 'jankx'), value: 'both' }
    ];

    const paginationStyleOptions = [
        { label: __('Dots', 'jankx'), value: 'dots' },
        { label: __('Numbers', 'jankx'), value: 'numbers' },
        { label: __('Progress', 'jankx'), value: 'progress' }
    ];

    const imageSizeOptions = [
        { label: __('Thumbnail', 'jankx'), value: 'thumbnail' },
        { label: __('Medium', 'jankx'), value: 'medium' },
        { label: __('Large', 'jankx'), value: 'large' },
        { label: __('Full', 'jankx'), value: 'full' }
    ];

    const renderTitle = (): JSX.Element | null => {
        if (!showTitle) return null;

        const TagName = titleTag as keyof JSX.IntrinsicElements;
        const titleStyle = { textAlign: titleAlignment as React.CSSProperties['textAlign'] };

        return (
            <TagName className="jankx-product-carousel__title" style={titleStyle}>
                <RichText
                    value={title}
                    onChange={(value: string) => setAttributes({ title: value })}
                    placeholder={__('Enter carousel title...', 'jankx')}
                    allowedFormats={[]}
                />
            </TagName>
        );
    };

    const renderPlaceholder = (): JSX.Element => {
        return (
            <div className="jankx-product-carousel__placeholder">
                <div className="jankx-product-carousel__placeholder-icon">
                    {grid}
                </div>
                <h3>{__('Product Carousel', 'jankx')}</h3>
                <p>{__('Kéo product collections của WooCommerce vào đây để tạo carousel', 'jankx')}</p>
                <div className="jankx-product-carousel__placeholder-content">
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        template={TEMPLATE}
                        templateLock={false}
                    />
                </div>
            </div>
        );
    };

    return (
        <>
            <BlockControls>
                <AlignmentToolbar
                    value={titleAlignment}
                    onChange={(value: Alignment | undefined) => setAttributes({ titleAlignment: value || 'left' })}
                />
            </BlockControls>

            <InspectorControls>
                <PanelBody title={__('Title Settings', 'jankx')} icon={layout} initialOpen={true}>
                    <ToggleControl
                        label={__('Show Title', 'jankx')}
                        checked={showTitle}
                        onChange={(value: boolean) => setAttributes({ showTitle: value })}
                    />
                    {showTitle && (
                        <>
                            <SelectControl
                                label={__('Title Tag', 'jankx')}
                                value={titleTag}
                                options={titleTagOptions}
                                onChange={(value: TitleTag) => setAttributes({ titleTag: value })}
                            />
                            <SelectControl
                                label={__('Title Alignment', 'jankx')}
                                value={titleAlignment}
                                options={titleAlignmentOptions}
                                onChange={(value: Alignment) => setAttributes({ titleAlignment: value })}
                            />
                        </>
                    )}
                </PanelBody>

                <PanelBody title={__('Carousel Settings', 'jankx')} icon={grid} initialOpen={true}>
                    <SelectControl
                        label={__('Carousel Type', 'jankx')}
                        value={carouselType}
                        options={carouselTypeOptions}
                        onChange={(value: ProductCarouselAttributes['carouselType']) => setAttributes({ carouselType: value })}
                    />
                    <RangeControl
                        label={__('Slides Per View (Desktop)', 'jankx')}
                        value={slidesPerView}
                        onChange={(value?: number) => setAttributes({ slidesPerView: value || 1 })}
                        min={1}
                        max={8}
                        step={1}
                    />
                    <RangeControl
                        label={__('Slides Per View (Tablet)', 'jankx')}
                        value={slidesPerViewTablet}
                        onChange={(value?: number) => setAttributes({ slidesPerViewTablet: value || 1 })}
                        min={1}
                        max={6}
                        step={1}
                    />
                    <RangeControl
                        label={__('Slides Per View (Mobile)', 'jankx')}
                        value={slidesPerViewMobile}
                        onChange={(value?: number) => setAttributes({ slidesPerViewMobile: value || 1 })}
                        min={1}
                        max={3}
                        step={1}
                    />
                    <RangeControl
                        label={__('Space Between', 'jankx')}
                        value={spaceBetween}
                        onChange={(value?: number) => setAttributes({ spaceBetween: value || 0 })}
                        min={0}
                        max={100}
                        step={5}
                    />
                </PanelBody>

                <PanelBody title={__('Autoplay Settings', 'jankx')} icon={settings} initialOpen={false}>
                    <ToggleControl
                        label={__('Autoplay', 'jankx')}
                        checked={autoplay}
                        onChange={(value: boolean) => setAttributes({ autoplay: value })}
                    />
                    {autoplay && (
                        <RangeControl
                            label={__('Autoplay Delay (ms)', 'jankx')}
                            value={autoplayDelay}
                            onChange={(value?: number) => setAttributes({ autoplayDelay: value || 3000 })}
                            min={1000}
                            max={10000}
                            step={500}
                        />
                    )}
                    <ToggleControl
                        label={__('Loop', 'jankx')}
                        checked={loop}
                        onChange={(value: boolean) => setAttributes({ loop: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Navigation Settings', 'jankx')} icon={navigation} initialOpen={false}>
                    <ToggleControl
                        label={__('Show Navigation', 'jankx')}
                        checked={showNavigation}
                        onChange={(value: boolean) => setAttributes({ showNavigation: value })}
                    />
                    {showNavigation && (
                        <SelectControl
                            label={__('Navigation Style', 'jankx')}
                            value={navigationStyle}
                            options={navigationStyleOptions}
                            onChange={(value: ProductCarouselAttributes['navigationStyle']) => setAttributes({ navigationStyle: value })}
                        />
                    )}
                    <ToggleControl
                        label={__('Show Pagination', 'jankx')}
                        checked={showPagination}
                        onChange={(value: boolean) => setAttributes({ showPagination: value })}
                    />
                    {showPagination && (
                        <SelectControl
                            label={__('Pagination Style', 'jankx')}
                            value={paginationStyle}
                            options={paginationStyleOptions}
                            onChange={(value: ProductCarouselAttributes['paginationStyle']) => setAttributes({ paginationStyle: value })}
                        />
                    )}
                </PanelBody>

                <PanelBody title={__('Product Display', 'jankx')} icon={layout} initialOpen={false}>
                    <ToggleControl
                        label={__('Show Product Image', 'jankx')}
                        checked={showProductImage}
                        onChange={(value: boolean) => setAttributes({ showProductImage: value })}
                    />
                    <ToggleControl
                        label={__('Show Product Title', 'jankx')}
                        checked={showProductTitle}
                        onChange={(value: boolean) => setAttributes({ showProductTitle: value })}
                    />
                    <ToggleControl
                        label={__('Show Product Price', 'jankx')}
                        checked={showProductPrice}
                        onChange={(value: boolean) => setAttributes({ showProductPrice: value })}
                    />
                    <ToggleControl
                        label={__('Show Product Rating', 'jankx')}
                        checked={showProductRating}
                        onChange={(value: boolean) => setAttributes({ showProductRating: value })}
                    />
                    <ToggleControl
                        label={__('Show Add to Cart', 'jankx')}
                        checked={showAddToCart}
                        onChange={(value: boolean) => setAttributes({ showAddToCart: value })}
                    />
                    <SelectControl
                        label={__('Image Size', 'jankx')}
                        value={imageSize}
                        options={imageSizeOptions}
                        onChange={(value: ProductCarouselAttributes['imageSize']) => setAttributes({ imageSize: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Advanced', 'jankx')} icon={settings} initialOpen={false}>
                    <TextControl
                        label={__('CSS Class', 'jankx')}
                        value={customClassName}
                        onChange={(value: string) => setAttributes({ customClassName: value })}
                        placeholder={__('custom-carousel-class', 'jankx')}
                    />
                    <TextControl
                        label={__('HTML Anchor', 'jankx')}
                        value={anchor}
                        onChange={(value: string) => setAttributes({ anchor: value })}
                        placeholder={__('carousel-anchor', 'jankx')}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {renderTitle()}
                <div className="jankx-product-carousel__container">
                    <div {...innerBlocksProps}>
                        {renderPlaceholder()}
                    </div>
                </div>
            </div>
        </>
    );
};

registerBlockType('jankx/product-carousel', {
    edit: Edit,
});


