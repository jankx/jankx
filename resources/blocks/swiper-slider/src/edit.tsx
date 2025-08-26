import { useBlockProps, useInnerBlocksProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { BLOCK_CLASS_NAME } from './constants';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const {
        slidesPerView = 1,
        spaceBetween = 30,
        autoplay = true,
        autoplayDelay = 3000,
        loop = true,
        pagination = true,
        navigation = true,
    } = attributes;

    const blockProps = useBlockProps({
        className: `${BLOCK_CLASS_NAME} swiper-container`,
    });

    const { children, ...combinedBlockProps } = useInnerBlocksProps(blockProps, {
        allowedBlocks: ['jankx/swiper-slide', 'core/image', 'core/paragraph', 'core/heading'],
        renderAppender: InnerBlocks.ButtonBlockAppender,
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Swiper Settings', 'jankx')} initialOpen={true}>
                    <RangeControl
                        label={__('Slides per view', 'jankx')}
                        value={slidesPerView}
                        onChange={(value) => setAttributes({ slidesPerView: value })}
                        min={1}
                        max={6}
                        step={1}
                    />
                    <RangeControl
                        label={__('Space between slides', 'jankx')}
                        value={spaceBetween}
                        onChange={(value) => setAttributes({ spaceBetween: value })}
                        min={0}
                        max={100}
                        step={5}
                    />
                    <ToggleControl
                        label={__('Autoplay', 'jankx')}
                        checked={autoplay}
                        onChange={(value) => setAttributes({ autoplay: value })}
                    />
                    {autoplay && (
                        <RangeControl
                            label={__('Autoplay delay (ms)', 'jankx')}
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
                    <ToggleControl
                        label={__('Pagination', 'jankx')}
                        checked={pagination}
                        onChange={(value) => setAttributes({ pagination: value })}
                    />
                    <ToggleControl
                        label={__('Navigation', 'jankx')}
                        checked={navigation}
                        onChange={(value) => setAttributes({ navigation: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...combinedBlockProps}>
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
        </>
    );
}
