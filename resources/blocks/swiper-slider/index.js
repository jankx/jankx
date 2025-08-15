import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    BlockControls,
    InnerBlocks,
    useInnerBlocksProps,
    Button,
    ButtonGroup,
    PanelBody,
    PanelRow,
    SelectControl,
    ToggleControl,
    RangeControl,
    Notice
} from '@wordpress/block-editor';
import {
    useState,
    useEffect
} from '@wordpress/element';
import {
    slides,
    plus,
    desktop,
    tablet,
    mobile
} from '@wordpress/icons';

// Import Swiper
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar, Autoplay, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCards, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-creative';

// Preset configurations
const PRESETS = {
    default: {
        name: 'Default Slider',
        config: {
            slidesPerView: 1,
            spaceBetween: 30,
            effect: 'slide',
            navigation: true,
            pagination: true,
            paginationType: 'bullets',
            autoplay: false,
            loop: false
        }
    },
    carousel: {
        name: 'Carousel',
        config: {
            slidesPerView: 3,
            spaceBetween: 20,
            effect: 'slide',
            navigation: true,
            pagination: true,
            paginationType: 'bullets',
            autoplay: true,
            autoplayDelay: 3000,
            loop: true,
            centeredSlides: true
        }
    },
    banner: {
        name: 'Banner',
        config: {
            slidesPerView: 1,
            spaceBetween: 0,
            effect: 'fade',
            navigation: false,
            pagination: true,
            paginationType: 'bullets',
            autoplay: true,
            autoplayDelay: 5000,
            loop: true
        }
    }
};

// Slide Template
const SLIDE_TEMPLATE = [
    ['core/group', {
        className: 'swiper-slide-content',
        layout: { type: 'constrained' }
    }, [
        ['core/image', {
            className: 'swiper-slide-image',
            url: '',
            alt: '',
            sizeSlug: 'large'
        }],
        ['core/group', {
            className: 'swiper-slide-text',
            backgroundColor: 'white',
            textColor: 'black',
            style: {
                spacing: {
                    padding: {
                        top: '20px',
                        right: '20px',
                        bottom: '20px',
                        left: '20px'
                    }
                }
            }
        }, [
            ['core/heading', {
                level: 3,
                placeholder: __('Slide Title', 'jankx'),
                className: 'swiper-slide-title'
            }],
            ['core/paragraph', {
                placeholder: __('Slide description...', 'jankx'),
                className: 'swiper-slide-description'
            }]
        ]]
    ]]
];

// Swiper Slider Edit Component
function SwiperSliderEdit({ attributes, setAttributes, clientId }) {
    const {
        sliderType,
        preset,
        slidesPerView,
        spaceBetween,
        effect,
        direction,
        loop,
        autoplay,
        autoplayDelay,
        autoplayDisableOnInteraction,
        navigation,
        pagination,
        paginationType,
        scrollbar,
        centeredSlides,
        grabCursor,
        speed
    } = attributes;

    const [activeTab, setActiveTab] = useState('desktop');
    const [swiperInstance, setSwiperInstance] = useState(null);
    const blockProps = useBlockProps({
        className: `swiper-slider-block swiper-slider-${sliderType}`
    });

    // Initialize Swiper in editor
    useEffect(() => {
        if (swiperInstance) {
            swiperInstance.destroy();
        }

        const swiperEl = document.querySelector(`#${blockProps.id || 'swiper-editor'} .swiper`);
        if (swiperEl) {
            const modules = [Navigation, Pagination, Scrollbar, Autoplay];

            // Add effect modules based on selected effect
            switch (effect) {
                case 'fade':
                    modules.push(EffectFade);
                    break;
                case 'cube':
                    modules.push(EffectCube);
                    break;
                case 'coverflow':
                    modules.push(EffectCoverflow);
                    break;
                case 'flip':
                    modules.push(EffectFlip);
                    break;
                case 'cards':
                    modules.push(EffectCards);
                    break;
                case 'creative':
                    modules.push(EffectCreative);
                    break;
            }

            const swiper = new Swiper(swiperEl, {
                modules,
                slidesPerView: slidesPerView,
                spaceBetween: spaceBetween,
                effect: effect,
                direction: direction,
                loop: loop,
                autoplay: autoplay ? {
                    delay: autoplayDelay,
                    disableOnInteraction: autoplayDisableOnInteraction
                } : false,
                navigation: navigation ? {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                } : false,
                pagination: pagination ? {
                    el: '.swiper-pagination',
                    type: paginationType,
                    clickable: true
                } : false,
                scrollbar: scrollbar ? {
                    el: '.swiper-scrollbar',
                    draggable: true
                } : false,
                centeredSlides: centeredSlides,
                grabCursor: grabCursor,
                speed: speed,
                breakpoints: breakpoints
            });

            setSwiperInstance(swiper);
        }

        return () => {
            if (swiperInstance) {
                swiperInstance.destroy();
            }
        };
    }, [slidesPerView, spaceBetween, effect, direction, loop, autoplay, autoplayDelay, autoplayDisableOnInteraction, navigation, pagination, paginationType, scrollbar, centeredSlides, grabCursor, speed, breakpoints]);

    // Inner blocks props
    const innerBlocksProps = useInnerBlocksProps(
        { className: 'swiper-wrapper' },
        {
            allowedBlocks: ['core/group'],
            template: SLIDE_TEMPLATE,
            templateLock: false,
            renderAppender: () => (
                <div className="swiper-slide-add">
                    <Button
                        icon={plus}
                        label={__('Add Slide', 'jankx')}
                        onClick={() => {
                            const { insertBlock } = wp.data.dispatch('core/block-editor');
                            const { createBlock } = wp.blocks;
                            const newSlide = createBlock('core/group', {
                                className: 'swiper-slide-content',
                                layout: { type: 'constrained' }
                            }, SLIDE_TEMPLATE[0][2]);
                            insertBlock(newSlide, undefined, clientId);
                        }}
                    >
                        {__('Add Slide', 'jankx')}
                    </Button>
                </div>
            )
        }
    );

    // Apply preset
    const applyPreset = (presetKey) => {
        const presetConfig = PRESETS[presetKey];
        if (presetConfig) {
            setAttributes({
                preset: presetKey,
                ...presetConfig.config
            });
        }
    };

    return (
        <>
            <BlockControls>
                <ButtonGroup>
                    <Button
                        icon={desktop}
                        label={__('Desktop', 'jankx')}
                        onClick={() => setActiveTab('desktop')}
                        isPressed={activeTab === 'desktop'}
                    />
                    <Button
                        icon={tablet}
                        label={__('Tablet', 'jankx')}
                        onClick={() => setActiveTab('tablet')}
                        isPressed={activeTab === 'tablet'}
                    />
                    <Button
                        icon={mobile}
                        label={__('Mobile', 'jankx')}
                        onClick={() => setActiveTab('mobile')}
                        isPressed={activeTab === 'mobile'}
                    />
                </ButtonGroup>
            </BlockControls>

            <InspectorControls>
                <PanelBody title={__('Slider Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Slider Type', 'jankx')}
                        value={sliderType}
                        options={[
                            { label: __('Slider', 'jankx'), value: 'slider' },
                            { label: __('Carousel', 'jankx'), value: 'carousel' },
                            { label: __('Banner', 'jankx'), value: 'banner' }
                        ]}
                        onChange={(value) => setAttributes({ sliderType: value })}
                    />

                    <SelectControl
                        label={__('Preset', 'jankx')}
                        value={preset}
                        options={Object.keys(PRESETS).map(key => ({
                            label: PRESETS[key].name,
                            value: key
                        }))}
                        onChange={applyPreset}
                    />
                </PanelBody>

                <PanelBody title={__('General Settings', 'jankx')} initialOpen={false}>
                    <PanelRow>
                        <RangeControl
                            label={__('Slides Per View', 'jankx')}
                            value={slidesPerView}
                            onChange={(value) => setAttributes({ slidesPerView: value })}
                            min={1}
                            max={10}
                        />
                    </PanelRow>

                    <PanelRow>
                        <RangeControl
                            label={__('Space Between', 'jankx')}
                            value={spaceBetween}
                            onChange={(value) => setAttributes({ spaceBetween: value })}
                            min={0}
                            max={100}
                        />
                    </PanelRow>

                    <PanelRow>
                        <SelectControl
                            label={__('Effect', 'jankx')}
                            value={effect}
                            options={[
                                { label: __('Slide', 'jankx'), value: 'slide' },
                                { label: __('Fade', 'jankx'), value: 'fade' },
                                { label: __('Cube', 'jankx'), value: 'cube' },
                                { label: __('Coverflow', 'jankx'), value: 'coverflow' },
                                { label: __('Flip', 'jankx'), value: 'flip' },
                                { label: __('Cards', 'jankx'), value: 'cards' },
                                { label: __('Creative', 'jankx'), value: 'creative' }
                            ]}
                            onChange={(value) => setAttributes({ effect: value })}
                        />
                    </PanelRow>

                    <PanelRow>
                        <SelectControl
                            label={__('Direction', 'jankx')}
                            value={direction}
                            options={[
                                { label: __('Horizontal', 'jankx'), value: 'horizontal' },
                                { label: __('Vertical', 'jankx'), value: 'vertical' }
                            ]}
                            onChange={(value) => setAttributes({ direction: value })}
                        />
                    </PanelRow>

                    <PanelRow>
                        <ToggleControl
                            label={__('Loop', 'jankx')}
                            checked={loop}
                            onChange={(value) => setAttributes({ loop: value })}
                        />
                    </PanelRow>

                    <PanelRow>
                        <ToggleControl
                            label={__('Grab Cursor', 'jankx')}
                            checked={grabCursor}
                            onChange={(value) => setAttributes({ grabCursor: value })}
                        />
                    </PanelRow>

                    <PanelRow>
                        <RangeControl
                            label={__('Speed', 'jankx')}
                            value={speed}
                            onChange={(value) => setAttributes({ speed: value })}
                            min={100}
                            max={2000}
                            step={100}
                        />
                    </PanelRow>
                </PanelBody>

                <PanelBody title={__('Autoplay Settings', 'jankx')} initialOpen={false}>
                    <ToggleControl
                        label={__('Enable Autoplay', 'jankx')}
                        checked={autoplay}
                        onChange={(value) => setAttributes({ autoplay: value })}
                    />

                    {autoplay && (
                        <>
                            <RangeControl
                                label={__('Delay (ms)', 'jankx')}
                                value={autoplayDelay}
                                onChange={(value) => setAttributes({ autoplayDelay: value })}
                                min={1000}
                                max={10000}
                                step={500}
                            />

                            <ToggleControl
                                label={__('Disable on Interaction', 'jankx')}
                                checked={autoplayDisableOnInteraction}
                                onChange={(value) => setAttributes({ autoplayDisableOnInteraction: value })}
                            />
                        </>
                    )}
                </PanelBody>

                <PanelBody title={__('Navigation & Controls', 'jankx')} initialOpen={false}>
                    <ToggleControl
                        label={__('Navigation Arrows', 'jankx')}
                        checked={navigation}
                        onChange={(value) => setAttributes({ navigation: value })}
                    />

                    <ToggleControl
                        label={__('Pagination', 'jankx')}
                        checked={pagination}
                        onChange={(value) => setAttributes({ pagination: value })}
                    />

                    {pagination && (
                        <SelectControl
                            label={__('Pagination Type', 'jankx')}
                            value={paginationType}
                            options={[
                                { label: __('Bullets', 'jankx'), value: 'bullets' },
                                { label: __('Fraction', 'jankx'), value: 'fraction' },
                                { label: __('Progressbar', 'jankx'), value: 'progressbar' },
                                { label: __('Custom', 'jankx'), value: 'custom' }
                            ]}
                            onChange={(value) => setAttributes({ paginationType: value })}
                        />
                    )}

                    <ToggleControl
                        label={__('Scrollbar', 'jankx')}
                        checked={scrollbar}
                        onChange={(value) => setAttributes({ scrollbar: value })}
                    />

                    <ToggleControl
                        label={__('Centered Slides', 'jankx')}
                        checked={centeredSlides}
                        onChange={(value) => setAttributes({ centeredSlides: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps} id={blockProps.id || 'swiper-editor'}>
                <div className="swiper-slider-header">
                    <div className="swiper-slider-info">
                        <h4>{PRESETS[preset]?.name || __('Swiper Slider', 'jankx')}</h4>
                        <p>{__('Add slides using the block inserter or click "Add Slide" below', 'jankx')}</p>
                    </div>
                </div>

                <div className="swiper">
                    <div className="swiper-wrapper">
                        <div {...innerBlocksProps} />
                    </div>

                    {navigation && (
                        <>
                            <div className="swiper-button-prev"></div>
                            <div className="swiper-button-next"></div>
                        </>
                    )}

                    {pagination && (
                        <div className="swiper-pagination"></div>
                    )}

                    {scrollbar && (
                        <div className="swiper-scrollbar"></div>
                    )}
                </div>
            </div>
        </>
    );
}

// Register the block
registerBlockType('jankx/swiper-slider', {
    edit: SwiperSliderEdit,
    save: () => <InnerBlocks.Content />
});
