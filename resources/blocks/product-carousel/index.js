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
import {
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl,
    RangeControl,
    ButtonGroup,
    Button
} from '@wordpress/components';
import {
    slides,
    settings,
    visibility,
    layout
} from '@wordpress/icons';

const ALLOWED_BLOCKS = [
    'woocommerce/product-query',
    'woocommerce/product-template',
    'woocommerce/product-collection',
    'woocommerce/featured-product',
    'woocommerce/handpicked-products',
    'woocommerce/product-categories',
    'woocommerce/product-tag',
    'woocommerce/product-on-sale',
    'woocommerce/products-by-attribute',
    'woocommerce/product-best-sellers',
    'woocommerce/product-top-rated',
    'woocommerce/product-new',
    'woocommerce/product-on-backorder',
    'woocommerce/product-price-range',
    'woocommerce/product-stock-status',
    'woocommerce/product-reviews',
    'woocommerce/product-reviews-list',
    'woocommerce/product-reviews-summary',
    'woocommerce/product-reviews-form',
    'woocommerce/product-reviews-count',
    'woocommerce/product-reviews-rating',
    'woocommerce/product-reviews-title',
    'woocommerce/product-reviews-content',
    'woocommerce/product-reviews-date',
    'woocommerce/product-reviews-author',
    'woocommerce/product-reviews-avatar',
    'woocommerce/product-reviews-pagination',
    'woocommerce/product-reviews-sort',
    'woocommerce/product-reviews-filter',
    'woocommerce/product-reviews-search',
    'woocommerce/product-reviews-load-more',
    'woocommerce/product-reviews-infinite-scroll',
    'woocommerce/product-reviews-lazy-load',
    'woocommerce/product-reviews-virtual-scroll',
    'woocommerce/product-reviews-infinite-scroll-button',
    'woocommerce/product-reviews-infinite-scroll-spinner',
    'woocommerce/product-reviews-infinite-scroll-end',
    'woocommerce/product-reviews-infinite-scroll-error',
    'woocommerce/product-reviews-infinite-scroll-loading',
    'woocommerce/product-reviews-infinite-scroll-no-more',
    'woocommerce/product-reviews-infinite-scroll-retry',
    'woocommerce/product-reviews-infinite-scroll-reset',
    'woocommerce/product-reviews-infinite-scroll-refresh',
    'woocommerce/product-reviews-infinite-scroll-update',
    'woocommerce/product-reviews-infinite-scroll-append',
    'woocommerce/product-reviews-infinite-scroll-prepend',
    'woocommerce/product-reviews-infinite-scroll-insert',
    'woocommerce/product-reviews-infinite-scroll-replace',
    'woocommerce/product-reviews-infinite-scroll-remove',
    'woocommerce/product-reviews-infinite-scroll-clear',
    'woocommerce/product-reviews-infinite-scroll-destroy',
    'woocommerce/product-reviews-infinite-scroll-rebuild',
    'woocommerce/product-reviews-infinite-scroll-refresh',
    'woocommerce/product-reviews-infinite-scroll-update',
    'woocommerce/product-reviews-infinite-scroll-append',
    'woocommerce/product-reviews-infinite-scroll-prepend',
    'woocommerce/product-reviews-infinite-scroll-insert',
    'woocommerce/product-reviews-infinite-scroll-replace',
    'woocommerce/product-reviews-infinite-scroll-remove',
    'woocommerce/product-reviews-infinite-scroll-clear',
    'woocommerce/product-reviews-infinite-scroll-destroy',
    'woocommerce/product-reviews-infinite-scroll-rebuild'
];

const TEMPLATE = [
    ['woocommerce/product-query', {}]
];

const Edit = ({ attributes, setAttributes, isSelected }) => {
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

    const renderTitle = () => {
        if (!showTitle) return null;

        const TagName = titleTag;
        const titleStyle = { textAlign: titleAlignment };

        return (
            <TagName className="jankx-product-carousel__title" style={titleStyle}>
                <RichText
                    value={title}
                    onChange={(value) => setAttributes({ title: value })}
                    placeholder={__('Enter carousel title...', 'jankx')}
                    allowedFormats={[]}
                />
            </TagName>
        );
    };

    const renderPlaceholder = () => {
        return (
            <div className="jankx-product-carousel__placeholder">
                <div className="jankx-product-carousel__placeholder-icon">
                    <slides />
                </div>
                <h3>{__('Product Carousel', 'jankx')}</h3>
                <p>{__('Kéo product collections của WooCommerce vào đây để tạo carousel', 'jankx')}</p>
                <div className="jankx-product-carousel__placeholder-content">
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
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
                    onChange={(value) => setAttributes({ titleAlignment: value })}
                />
            </BlockControls>

            <InspectorControls>
                <PanelBody title={__('Title Settings', 'jankx')} icon={layout} initialOpen={true}>
                    <ToggleControl
                        label={__('Show Title', 'jankx')}
                        checked={showTitle}
                        onChange={(value) => setAttributes({ showTitle: value })}
                    />
                    {showTitle && (
                        <>
                            <SelectControl
                                label={__('Title Tag', 'jankx')}
                                value={titleTag}
                                options={titleTagOptions}
                                onChange={(value) => setAttributes({ titleTag: value })}
                            />
                            <SelectControl
                                label={__('Title Alignment', 'jankx')}
                                value={titleAlignment}
                                options={titleAlignmentOptions}
                                onChange={(value) => setAttributes({ titleAlignment: value })}
                            />
                        </>
                    )}
                </PanelBody>

                <PanelBody title={__('Carousel Settings', 'jankx')} icon={slides} initialOpen={true}>
                    <SelectControl
                        label={__('Carousel Type', 'jankx')}
                        value={carouselType}
                        options={carouselTypeOptions}
                        onChange={(value) => setAttributes({ carouselType: value })}
                    />
                    
                    <RangeControl
                        label={__('Slides Per View (Desktop)', 'jankx')}
                        value={slidesPerView}
                        onChange={(value) => setAttributes({ slidesPerView: value })}
                        min={1}
                        max={8}
                        step={1}
                    />
                    
                    <RangeControl
                        label={__('Slides Per View (Tablet)', 'jankx')}
                        value={slidesPerViewTablet}
                        onChange={(value) => setAttributes({ slidesPerViewTablet: value })}
                        min={1}
                        max={6}
                        step={1}
                    />
                    
                    <RangeControl
                        label={__('Slides Per View (Mobile)', 'jankx')}
                        value={slidesPerViewMobile}
                        onChange={(value) => setAttributes({ slidesPerViewMobile: value })}
                        min={1}
                        max={3}
                        step={1}
                    />
                    
                    <RangeControl
                        label={__('Space Between', 'jankx')}
                        value={spaceBetween}
                        onChange={(value) => setAttributes({ spaceBetween: value })}
                        min={0}
                        max={100}
                        step={5}
                    />
                </PanelBody>

                <PanelBody title={__('Autoplay Settings', 'jankx')} icon={settings} initialOpen={false}>
                    <ToggleControl
                        label={__('Autoplay', 'jankx')}
                        checked={autoplay}
                        onChange={(value) => setAttributes({ autoplay: value })}
                    />
                    {autoplay && (
                        <RangeControl
                            label={__('Autoplay Delay (ms)', 'jankx')}
                            value={autoplayDelay}
                            onChange={(value) => setAttributes({ autoplayDelay: value })}
                            min={1000}
                            max={10000}
                            step={500}
                        />
                    )}
                    <ToggleControl
                        label={__('Loop', 'jankx')}
                        checked={loop}
                        onChange={(value) => setAttributes({ loop: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Navigation Settings', 'jankx')} icon={visibility} initialOpen={false}>
                    <ToggleControl
                        label={__('Show Navigation', 'jankx')}
                        checked={showNavigation}
                        onChange={(value) => setAttributes({ showNavigation: value })}
                    />
                    {showNavigation && (
                        <SelectControl
                            label={__('Navigation Style', 'jankx')}
                            value={navigationStyle}
                            options={navigationStyleOptions}
                            onChange={(value) => setAttributes({ navigationStyle: value })}
                        />
                    )}
                    
                    <ToggleControl
                        label={__('Show Pagination', 'jankx')}
                        checked={showPagination}
                        onChange={(value) => setAttributes({ showPagination: value })}
                    />
                    {showPagination && (
                        <SelectControl
                            label={__('Pagination Style', 'jankx')}
                            value={paginationStyle}
                            options={paginationStyleOptions}
                            onChange={(value) => setAttributes({ paginationStyle: value })}
                        />
                    )}
                </PanelBody>

                <PanelBody title={__('Product Display', 'jankx')} icon={visibility} initialOpen={false}>
                    <ToggleControl
                        label={__('Show Product Image', 'jankx')}
                        checked={showProductImage}
                        onChange={(value) => setAttributes({ showProductImage: value })}
                    />
                    <ToggleControl
                        label={__('Show Product Title', 'jankx')}
                        checked={showProductTitle}
                        onChange={(value) => setAttributes({ showProductTitle: value })}
                    />
                    <ToggleControl
                        label={__('Show Product Price', 'jankx')}
                        checked={showProductPrice}
                        onChange={(value) => setAttributes({ showProductPrice: value })}
                    />
                    <ToggleControl
                        label={__('Show Product Rating', 'jankx')}
                        checked={showProductRating}
                        onChange={(value) => setAttributes({ showProductRating: value })}
                    />
                    <ToggleControl
                        label={__('Show Add to Cart', 'jankx')}
                        checked={showAddToCart}
                        onChange={(value) => setAttributes({ showAddToCart: value })}
                    />
                    <SelectControl
                        label={__('Image Size', 'jankx')}
                        value={imageSize}
                        options={imageSizeOptions}
                        onChange={(value) => setAttributes({ imageSize: value })}
                    />
                </PanelBody>

                <PanelBody title={__('Advanced', 'jankx')} icon={settings} initialOpen={false}>
                    <TextControl
                        label={__('CSS Class', 'jankx')}
                        value={customClassName}
                        onChange={(value) => setAttributes({ customClassName: value })}
                        placeholder={__('custom-carousel-class', 'jankx')}
                    />
                    <TextControl
                        label={__('HTML Anchor', 'jankx')}
                        value={anchor}
                        onChange={(value) => setAttributes({ anchor: value })}
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
    edit: Edit
});
