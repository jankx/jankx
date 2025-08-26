import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { BLOCK_CLASS_NAME } from './constants';

export default function Save({ attributes }) {
    const {
        slidesPerView = 1,
        spaceBetween = 30,
        autoplay = true,
        autoplayDelay = 3000,
        loop = true,
        pagination = true,
        navigation = true,
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `${BLOCK_CLASS_NAME} swiper-container`,
        'data-slides-per-view': slidesPerView,
        'data-space-between': spaceBetween,
        'data-autoplay': autoplay ? 'true' : 'false',
        'data-autoplay-delay': autoplayDelay,
        'data-loop': loop ? 'true' : 'false',
        'data-pagination': pagination ? 'true' : 'false',
        'data-navigation': navigation ? 'true' : 'false',
    });

    const { children } = useInnerBlocksProps.save(blockProps);

    return (
        <div {...blockProps}>
            <div className="swiper-wrapper">
                {children}
            </div>
            {pagination && <div className="swiper-pagination"></div>}
            {navigation && (
                <>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                </>
            )}
        </div>
    );
}
