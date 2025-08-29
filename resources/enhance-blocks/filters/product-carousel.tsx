/**
 * WooCommerce Product Carousel Block Filter
 * Enhance product carousel with additional features
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl, SelectControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Add custom attributes to the product carousel block
addFilter(
    'blocks.registerBlockType',
    'jankx/enhance-product-carousel',
    (settings, name) => {
        if (name !== 'woocommerce/product-carousel') {
            return settings;
        }

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                autoplay: {
                    type: 'boolean',
                    default: true
                },
                autoplaySpeed: {
                    type: 'number',
                    default: 3000
                },
                showArrows: {
                    type: 'boolean',
                    default: true
                },
                showDots: {
                    type: 'boolean',
                    default: true
                },
                infinite: {
                    type: 'boolean',
                    default: true
                },
                slidesToShow: {
                    type: 'number',
                    default: 4
                },
                slidesToScroll: {
                    type: 'number',
                    default: 1
                },
                responsive: {
                    type: 'boolean',
                    default: true
                },
                carouselEffect: {
                    type: 'string',
                    default: 'slide'
                }
            }
        };
    }
);

// Add custom controls to the product carousel block
const withProductCarouselControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'woocommerce/product-carousel') {
            return <BlockEdit {...props} />;
        }

        const { attributes, setAttributes } = props;
        const {
            autoplay,
            autoplaySpeed,
            showArrows,
            showDots,
            infinite,
            slidesToShow,
            slidesToScroll,
            responsive,
            carouselEffect
        } = attributes;

        const effectOptions = [
            { label: 'Slide', value: 'slide' },
            { label: 'Fade', value: 'fade' },
            { label: 'Cube', value: 'cube' },
            { label: 'Coverflow', value: 'coverflow' },
            { label: 'Flip', value: 'flip' }
        ];

        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody
                        title={__('Carousel Settings', 'jankx')}
                        initialOpen={false}
                    >
                        <ToggleControl
                            label={__('Autoplay', 'jankx')}
                            checked={autoplay}
                            onChange={(value) => setAttributes({ autoplay: value })}
                            help={__('Enable automatic sliding', 'jankx')}
                        />

                        {autoplay && (
                            <RangeControl
                                label={__('Autoplay Speed (ms)', 'jankx')}
                                value={autoplaySpeed}
                                onChange={(value) => setAttributes({ autoplaySpeed: value })}
                                min={1000}
                                max={10000}
                                step={500}
                                help={__('Time between slides in milliseconds', 'jankx')}
                            />
                        )}

                        <ToggleControl
                            label={__('Show Navigation Arrows', 'jankx')}
                            checked={showArrows}
                            onChange={(value) => setAttributes({ showArrows: value })}
                            help={__('Display previous/next arrows', 'jankx')}
                        />

                        <ToggleControl
                            label={__('Show Dots', 'jankx')}
                            checked={showDots}
                            onChange={(value) => setAttributes({ showDots: value })}
                            help={__('Display pagination dots', 'jankx')}
                        />

                        <ToggleControl
                            label={__('Infinite Loop', 'jankx')}
                            checked={infinite}
                            onChange={(value) => setAttributes({ infinite: value })}
                            help={__('Enable infinite scrolling', 'jankx')}
                        />

                        <RangeControl
                            label={__('Slides to Show', 'jankx')}
                            value={slidesToShow}
                            onChange={(value) => setAttributes({ slidesToShow: value })}
                            min={1}
                            max={6}
                            step={1}
                            help={__('Number of slides visible at once', 'jankx')}
                        />

                        <RangeControl
                            label={__('Slides to Scroll', 'jankx')}
                            value={slidesToScroll}
                            onChange={(value) => setAttributes({ slidesToScroll: value })}
                            min={1}
                            max={slidesToShow}
                            step={1}
                            help={__('Number of slides to scroll at once', 'jankx')}
                        />

                        <ToggleControl
                            label={__('Responsive', 'jankx')}
                            checked={responsive}
                            onChange={(value) => setAttributes({ responsive: value })}
                            help={__('Enable responsive behavior', 'jankx')}
                        />

                        <SelectControl
                            label={__('Carousel Effect', 'jankx')}
                            value={carouselEffect}
                            options={effectOptions}
                            onChange={(value) => setAttributes({ carouselEffect: value })}
                            help={__('Choose transition effect', 'jankx')}
                        />
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withProductCarouselControls');

addFilter(
    'editor.BlockEdit',
    'jankx/enhance-product-carousel',
    withProductCarouselControls
);
