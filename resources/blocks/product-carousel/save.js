import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
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
        showProductPrice,
        showProductRating,
        showAddToCart,
        imageSize,
        customClassName,
        anchor
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `jankx-product-carousel ${customClassName || ''}`.trim(),
        id: anchor || undefined
    });

    const renderTitle = () => {
        if (!showTitle) return null;

        const TagName = titleTag;
        const titleStyle = { textAlign: titleAlignment };

        return (
            <TagName className="jankx-product-carousel__title" style={titleStyle}>
                <RichText.Content value={title} />
            </TagName>
        );
    };

    const renderCarouselData = () => {
        const carouselConfig = {
            type: carouselType,
            slidesPerView: {
                desktop: slidesPerView,
                tablet: slidesPerViewTablet,
                mobile: slidesPerViewMobile
            },
            spaceBetween: spaceBetween,
            autoplay: autoplay,
            autoplayDelay: autoplayDelay,
            loop: loop,
            navigation: showNavigation,
            pagination: showPagination,
            navigationStyle: navigationStyle,
            paginationStyle: paginationStyle
        };

        return (
            <script
                type="application/json"
                className="jankx-product-carousel__config"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(carouselConfig)
                }}
            />
        );
    };

    return (
        <div {...blockProps}>
            {renderTitle()}
            <div className="jankx-product-carousel__container">
                <div className="jankx-product-carousel__content">
                    <InnerBlocks.Content />
                </div>
                {showNavigation && (
                    <div className="jankx-product-carousel__navigation">
                        {navigationStyle === 'arrows' || navigationStyle === 'both' ? (
                            <>
                                <button className="jankx-product-carousel__nav-prev" aria-label="Previous">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                                <button className="jankx-product-carousel__nav-next" aria-label="Next">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </>
                        ) : null}
                    </div>
                )}
                {showPagination && (
                    <div className="jankx-product-carousel__pagination">
                        {paginationStyle === 'dots' ? (
                            <div className="jankx-product-carousel__dots"></div>
                        ) : paginationStyle === 'numbers' ? (
                            <div className="jankx-product-carousel__numbers"></div>
                        ) : paginationStyle === 'progress' ? (
                            <div className="jankx-product-carousel__progress">
                                <div className="jankx-product-carousel__progress-bar"></div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
            {renderCarouselData()}
        </div>
    );
};

export default Save;
