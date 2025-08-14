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
    useState
} from '@wordpress/element';
import { 
    slides, 
    plus,
    desktop,
    tablet,
    mobile
} from '@wordpress/icons';

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
    const blockProps = useBlockProps({
        className: `swiper-slider-block swiper-slider-${sliderType}`
    });

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

            <div {...blockProps}>
                <div className="swiper-slider-header">
                    <div className="swiper-slider-info">
                        <h4>{PRESETS[preset]?.name || __('Swiper Slider', 'jankx')}</h4>
                        <p>{__('Add slides using the block inserter or click "Add Slide" below', 'jankx')}</p>
                    </div>
                </div>

                <div className="swiper-container">
                    <div {...innerBlocksProps} />
                </div>

                {navigation && (
                    <div className="swiper-navigation">
                        <button className="swiper-button-prev" type="button">
                            {__('Previous', 'jankx')}
                        </button>
                        <button className="swiper-button-next" type="button">
                            {__('Next', 'jankx')}
                        </button>
                    </div>
                )}

                {pagination && (
                    <div className="swiper-pagination"></div>
                )}

                {scrollbar && (
                    <div className="swiper-scrollbar"></div>
                )}
            </div>
        </>
    );
}

// Register the block
registerBlockType('jankx/swiper-slider', {
    edit: SwiperSliderEdit,
    save: () => <InnerBlocks.Content />
});
