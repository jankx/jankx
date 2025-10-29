import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, useInnerBlocksProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, SelectControl, Button, TabPanel, ColorPicker } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import type { SwiperProps } from './types';

export default function Edit({ attributes, setAttributes, clientId }: SwiperProps): JSX.Element {
  const {
    slidesPerView,
    spaceBetween,
    loop,
    autoplay,
    autoplayDelay,
    speed,
    navigation,
    pagination,
    effect,
    height,
    minHeight,
    contentMode,
    galleryImages,
    bannerStyle,
    bannerTextColor,
    bannerBackgroundColor,
    bannerPadding,
    bannerBorderRadius
  } = attributes;

  const swiperRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const blockProps = useBlockProps({
    ref: containerRef,
    className: `swiper-block swiper-effect-${effect} banner-style-${bannerStyle}`,
    style: {
      '--swiper-height': `${height}px`,
      '--swiper-min-height': `${minHeight}px`,
      '--banner-style': bannerStyle,
      '--banner-text-color': bannerTextColor,
      '--banner-background-color': bannerBackgroundColor,
      '--banner-padding': `${bannerPadding}px`,
      '--banner-border-radius': `${bannerBorderRadius}px`
    } as React.CSSProperties
  });

  const innerBlocksProps = useInnerBlocksProps(
    { className: 'swiper-wrapper' },
    {
      allowedBlocks: contentMode === 'slides' ? ['jankx/swiper-slide'] : ['jankx/swiper-banner'],
      template: contentMode === 'slides' ? [
        ['jankx/swiper-slide'],
        ['jankx/swiper-slide'],
        ['jankx/swiper-slide']
      ] : [],
      templateLock: false,
      orientation: 'horizontal'
    }
  );

  // Handle gallery image selection
  const onSelectGalleryImages = (images: any[]) => {
    const galleryData = images.map(img => ({
      id: img.id,
      url: img.url,
      alt: img.alt || '',
      caption: img.caption || ''
    }));
    
    setAttributes({ galleryImages: galleryData });
    
    // Create swiper-banner blocks for each image
    const bannerBlocks = images.map(img => 
      createBlock('jankx/swiper-banner', {
        imageId: img.id,
        imageUrl: img.url,
        imageAlt: img.alt || '',
        imageCaption: img.caption || ''
      })
    );
    
    // Replace inner blocks with banner blocks
    wp.data.dispatch('core/block-editor').replaceInnerBlocks(clientId, bannerBlocks);
  };

  // Initialize Swiper in editor
  useEffect(() => {
    if (!containerRef.current) return;

    const loadSwiper = async () => {
      await new Promise(resolve => setTimeout(resolve, 200));

      if (containerRef.current) {
        const swiperEl = containerRef.current.querySelector('.swiper');
        if (!swiperEl) return;

        // If Swiper already exists, just update params instead of destroying
        if (swiperRef.current) {
          // Update params
          Object.assign(swiperRef.current.params, {
            slidesPerView,
            spaceBetween,
            loop,
            speed,
            effect,
            autoplay: autoplay ? {
              delay: autoplayDelay,
              disableOnInteraction: false
            } : false,
            navigation: navigation ? {
              nextEl: swiperEl.querySelector('.swiper-button-next'),
              prevEl: swiperEl.querySelector('.swiper-button-prev')
            } : false,
            pagination: pagination ? {
              el: swiperEl.querySelector('.swiper-pagination'),
              clickable: true
            } : false
          });

          // Update navigation
          if (navigation && swiperRef.current.navigation) {
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
          }

          // Update pagination
          if (pagination && swiperRef.current.pagination) {
            swiperRef.current.pagination.init();
            swiperRef.current.pagination.render();
            swiperRef.current.pagination.update();
          } else if (!pagination && swiperRef.current.pagination) {
            swiperRef.current.pagination.destroy();
          }

          // Update Swiper
          swiperRef.current.update();

          // Update autoplay
          if (autoplay && swiperRef.current.autoplay) {
            swiperRef.current.autoplay.start();
          } else if (swiperRef.current.autoplay) {
            swiperRef.current.autoplay.stop();
          }
        } else {
          // Create new instance only if doesn't exist
          swiperRef.current = new Swiper(swiperEl, {
            slidesPerView,
            spaceBetween,
            loop,
            speed,
            effect,
            autoplay: autoplay ? {
              delay: autoplayDelay,
              disableOnInteraction: false
            } : false,
            navigation: navigation ? {
              nextEl: swiperEl.querySelector('.swiper-button-next'),
              prevEl: swiperEl.querySelector('.swiper-button-prev')
            } : false,
            pagination: pagination ? {
              el: swiperEl.querySelector('.swiper-pagination'),
              clickable: true
            } : false,
            fadeEffect: { crossFade: true },
            cubeEffect: { shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 },
            coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true },
            flipEffect: { slideShadows: true, limitRotation: true },
            cardsEffect: { perSlideOffset: 8, perSlideRotate: 2 }
          });
        }
      }
    };

    const timeoutId = setTimeout(loadSwiper, 100);

    return () => {
      clearTimeout(timeoutId);
      // Don't destroy on settings change, only update
    };
  }, [slidesPerView, spaceBetween, loop, autoplay, autoplayDelay, speed, navigation, pagination, effect, height, minHeight]);

  // Cleanup only on unmount
  useEffect(() => {
    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(false, false);
        swiperRef.current = null;
      }
    };
  }, []);

  return (
    <div {...blockProps}>
      <InspectorControls>
        <TabPanel
          className="swiper-tabs"
          activeClass="is-active"
          onSelect={(tabName: string) => {
            if (tabName === 'gallery') {
              setAttributes({ contentMode: 'gallery' });
            } else {
              setAttributes({ contentMode: 'slides' });
            }
          }}
          tabs={[
            {
              name: 'slides',
              title: __('Slides', 'jankx'),
              className: 'tab-slides'
            },
            {
              name: 'gallery',
              title: __('Gallery', 'jankx'),
              className: 'tab-gallery'
            }
          ]}
        >
          {(tab) => (
            <>
              {tab.name === 'slides' && (
                <PanelBody title={__('Add Slides', 'jankx')} initialOpen={true}>
                  <p>{__('Use the + button to add individual slides', 'jankx')}</p>
                </PanelBody>
              )}
              
              {tab.name === 'gallery' && (
                <PanelBody title={__('Select Images', 'jankx')} initialOpen={true}>
                  <MediaUploadCheck>
                    <MediaUpload
                      onSelect={onSelectGalleryImages}
                      allowedTypes={['image']}
                      multiple={true}
                      value={galleryImages.map(img => img.id)}
                      render={({ open }) => (
                        <Button
                          variant="primary"
                          onClick={open}
                          style={{ width: '100%', marginBottom: '10px' }}
                        >
                          {galleryImages.length > 0 
                            ? __('Change Images', 'jankx') 
                            : __('Select Images', 'jankx')
                          }
                        </Button>
                      )}
                    />
                  </MediaUploadCheck>
                  
                  {galleryImages.length > 0 && (
                    <p>
                      {__('Selected', 'jankx')}: {galleryImages.length} {__('images', 'jankx')}
                    </p>
                  )}
                </PanelBody>
              )}
            </>
          )}
        </TabPanel>

        <PanelBody title={__('Slider Settings', 'jankx')} initialOpen={true}>
          <RangeControl
            label={__('Slides Per View', 'jankx')}
            value={slidesPerView}
            onChange={(val: number) => setAttributes({ slidesPerView: val })}
            min={1}
            max={4}
            step={1}
          />

          <RangeControl
            label={__('Space Between (px)', 'jankx')}
            value={spaceBetween}
            onChange={(val: number) => setAttributes({ spaceBetween: val })}
            min={0}
            max={100}
            step={10}
          />

          <RangeControl
            label={__('Speed (ms)', 'jankx')}
            value={speed}
            onChange={(val: number) => setAttributes({ speed: val })}
            min={100}
            max={2000}
            step={100}
          />

          <RangeControl
            label={__('Height (px)', 'jankx')}
            value={height}
            onChange={(val: number) => setAttributes({ height: val })}
            min={200}
            max={1000}
            step={50}
            help={__('Height for desktop (max-height on mobile)', 'jankx')}
          />

          <RangeControl
            label={__('Min Height (px)', 'jankx')}
            value={minHeight}
            onChange={(val: number) => setAttributes({ minHeight: val })}
            min={150}
            max={600}
            step={50}
            help={__('Minimum height on mobile devices', 'jankx')}
          />

          <SelectControl
            label={__('Effect', 'jankx')}
            value={effect}
            options={[
              { label: __('Slide', 'jankx'), value: 'slide' },
              { label: __('Fade', 'jankx'), value: 'fade' },
              { label: __('Cube', 'jankx'), value: 'cube' },
              { label: __('Coverflow', 'jankx'), value: 'coverflow' },
              { label: __('Flip', 'jankx'), value: 'flip' },
              { label: __('Cards', 'jankx'), value: 'cards' }
            ]}
            onChange={(val: string) => setAttributes({ effect: val as any })}
          />

          <ToggleControl
            label={__('Loop', 'jankx')}
            checked={loop}
            onChange={(val: boolean) => setAttributes({ loop: val })}
          />

          <ToggleControl
            label={__('Navigation', 'jankx')}
            checked={navigation}
            onChange={(val: boolean) => setAttributes({ navigation: val })}
          />

          <ToggleControl
            label={__('Pagination', 'jankx')}
            checked={pagination}
            onChange={(val: boolean) => setAttributes({ pagination: val })}
          />

          <ToggleControl
            label={__('Autoplay', 'jankx')}
            checked={autoplay}
            onChange={(val: boolean) => setAttributes({ autoplay: val })}
          />

          {autoplay && (
            <RangeControl
              label={__('Autoplay Delay (ms)', 'jankx')}
              value={autoplayDelay}
              onChange={(val: number) => setAttributes({ autoplayDelay: val })}
              min={1000}
              max={10000}
              step={500}
            />
          )}
        </PanelBody>

        <PanelBody title={__('Banner Style Settings', 'jankx')} initialOpen={false}>
          <SelectControl
            label={__('Banner Style', 'jankx')}
            value={bannerStyle}
            options={[
              { label: __('Default', 'jankx'), value: 'default' },
              { label: __('Circles', 'jankx'), value: 'circles' },
              { label: __('Square', 'jankx'), value: 'square' },
              { label: __('Banner', 'jankx'), value: 'banner' }
            ]}
            onChange={(val: string) => setAttributes({ bannerStyle: val })}
          />

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              {__('Text Color', 'jankx')}
            </label>
            <ColorPicker
              color={bannerTextColor}
              onChange={(color: string) => setAttributes({ bannerTextColor: color })}
              disableAlpha={false}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              {__('Background Color', 'jankx')}
            </label>
            <ColorPicker
              color={bannerBackgroundColor}
              onChange={(color: string) => setAttributes({ bannerBackgroundColor: color })}
              disableAlpha={false}
            />
          </div>

          <RangeControl
            label={__('Padding (px)', 'jankx')}
            value={bannerPadding}
            onChange={(val: number) => setAttributes({ bannerPadding: val })}
            min={0}
            max={50}
            step={5}
          />

          <RangeControl
            label={__('Border Radius (px)', 'jankx')}
            value={bannerBorderRadius}
            onChange={(val: number) => setAttributes({ bannerBorderRadius: val })}
            min={0}
            max={20}
            step={1}
          />
        </PanelBody>
      </InspectorControls>

      <div className="swiper">
        <div {...innerBlocksProps} />

        {navigation && (
          <>
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </>
        )}

        {pagination && (
          <div className="swiper-pagination"></div>
        )}
      </div>
    </div>
  );
}
