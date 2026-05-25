import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, useInnerBlocksProps, MediaUpload, MediaUploadCheck, BlockControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, SelectControl, Button, TabPanel, ColorPicker, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { gallery, cover, layout, quote } from '@wordpress/icons';
import { useEffect, useRef } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import EmblaCarousel from 'embla-carousel';
import type { CarouselProps } from './types';

// Utility function to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

export default function Edit({ attributes, setAttributes, clientId }: CarouselProps): JSX.Element {
  const {
    slidesPerView,
    slidesPerViewTablet,
    slidesPerViewMobile,
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
    bannerBorderRadius,
    gradientOverlay,
    gradientColor,
    gradientOpacity,
    gradientHeight,
    className,
    fitViewportMinusHeader = false,
    fullHeight = false
  } = attributes;

  // Get block's style variation
  const styleVariation = useSelect((select) => {
    const block = select('core/block-editor').getBlock(clientId);
    if (!block) return 'default';

    // Extract style variation from className
    const match = className?.match(/is-style-(\w+)/);
    return match ? match[1] : 'default';
  }, [clientId, className]);

  // Function to update style variation
  const updateStyleVariation = (variation: string) => {
    // Remove existing variation classes
    const currentClassName = className || '';
    const cleanedClassName = currentClassName
      .replace(/\bis-style-\w+\b/g, '')
      .trim();

    // Add new variation class
    const newVariationClass = variation === 'default' ? '' : `is-style-${variation}`;
    const newClassName = [cleanedClassName, newVariationClass].filter(Boolean).join(' ');

    setAttributes({ className: newClassName });
  };

  const carouselRef = useRef<any>(null);
  const emblaRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert gradient color to RGB for CSS variables
  const gradientRgb = hexToRgb(gradientColor || '#000000');

  const blockProps = useBlockProps({
    ref: containerRef,
    className: `carousel-block banner-style-${bannerStyle} ${gradientOverlay ? 'has-gradient-overlay' : ''} ${className || ''} ${fitViewportMinusHeader ? 'fit-vh-minus-header' : ''} ${fullHeight ? 'is-full-height' : ''}`.trim(),
    style: {
      '--carousel-height': fullHeight ? '100vh' : `${height}px`,
      '--carousel-min-height': `${minHeight}px`,
      '--banner-style': bannerStyle,
      '--banner-text-color': bannerTextColor,
      '--banner-background-color': bannerBackgroundColor,
      '--banner-padding': `${bannerPadding}px`,
      '--banner-border-radius': `${bannerBorderRadius}px`,
      '--gradient-overlay-enabled': gradientOverlay ? '1' : '0',
      '--gradient-color-r': gradientRgb.r,
      '--gradient-color-g': gradientRgb.g,
      '--gradient-color-b': gradientRgb.b,
      '--gradient-opacity': gradientOpacity,
      '--gradient-height': `${gradientHeight}%`,
      '--slides-per-view-desktop': slidesPerView,
      '--slides-per-view-tablet': slidesPerViewTablet,
      '--slides-per-view-mobile': slidesPerViewMobile,
      '--space-between': `${spaceBetween}px`
    } as React.CSSProperties
  });

  const innerBlocksProps = useInnerBlocksProps(
    { className: 'carousel-wrapper' },
    {
      allowedBlocks: contentMode === 'slides'
        ? ['jankx/carousel-slide', 'jankx/carousel-inner-blocks-overlay']
        : ['jankx/carousel-banner', 'jankx/carousel-inner-blocks-overlay'],
      template: contentMode === 'slides' ? [
        ['jankx/carousel-slide'],
        ['jankx/carousel-slide'],
        ['jankx/carousel-slide']
      ] : [],
      templateLock: false,
      orientation: 'horizontal',
      renderAppender: InnerBlocks.ButtonBlockAppender
    }
  );

  const hasInnerBlocks = useSelect(
    (select) => {
      const { getBlock } = select('core/block-editor');
      const block = getBlock(clientId);
      return !!(block && block.innerBlocks.length);
    },
    [clientId]
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

    // Create carousel-banner blocks for each image
    const bannerBlocks = images.map(img =>
      createBlock('jankx/carousel-banner', {
        imageId: img.id,
        imageUrl: img.url,
        imageAlt: img.alt || '',
        imageCaption: img.caption || ''
      })
    );

    // Replace inner blocks with banner blocks
    wp.data.dispatch('core/block-editor').replaceInnerBlocks(clientId, bannerBlocks);
  };

  // Initialize Embla in editor
  useEffect(() => {
    if (!containerRef.current) return;

    const loadCarousel = async () => {
      await new Promise(resolve => setTimeout(resolve, 200));

      if (containerRef.current) {
        const carouselEl = containerRef.current.querySelector('.embla');
        if (!carouselEl) return;

        const nextEl = carouselEl.querySelector('.embla__button--next');
        const prevEl = carouselEl.querySelector('.embla__button--prev');
        const paginationEl = carouselEl.querySelector('.embla__dots');

        carouselEl.classList.add('embla__viewport');
        const track = carouselEl.querySelector('.embla__container') || carouselEl.querySelector('.carousel-wrapper');
        if (track && !track.classList.contains('embla__container')) track.classList.add('embla__container');

        const options: any = {
          loop: loop,
          duration: speed,
          align: 'start'
        };

        if (emblaRef.current) {
          emblaRef.current.reInit(options);
        } else {
          emblaRef.current = EmblaCarousel(carouselEl, options);
          if (navigation && nextEl && prevEl) {
            nextEl.addEventListener('click', () => emblaRef.current.scrollNext(), { passive: true });
            prevEl.addEventListener('click', () => emblaRef.current.scrollPrev(), { passive: true });
          }
          if (pagination && paginationEl) {
            const slides = emblaRef.current.slideNodes();
            paginationEl.innerHTML = '';
            slides.forEach((_, index) => {
              const b = document.createElement('span');
              b.className = 'embla__dot';
              b.addEventListener('click', () => emblaRef.current.scrollTo(index), { passive: true });
              paginationEl.appendChild(b);
            });
            const updateActive = () => {
              const i = emblaRef.current.selectedScrollSnap();
              const bullets = paginationEl.querySelectorAll('.embla__dot');
              bullets.forEach((el, idx) => {
                if (idx === i) el.classList.add('is-active');
                else el.classList.remove('is-active');
              });
            };
            emblaRef.current.on('select', updateActive);
            emblaRef.current.on('reInit', updateActive);
            updateActive();
          }
        }
      }
    };

    const timeoutId = setTimeout(loadCarousel, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [slidesPerView, slidesPerViewTablet, slidesPerViewMobile, spaceBetween, loop, autoplay, autoplayDelay, speed, navigation, pagination, height, minHeight]);

  // Cleanup only on unmount
  useEffect(() => {
    return () => {
      if (emblaRef.current) {
        emblaRef.current.destroy();
        emblaRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            icon={gallery}
            title={__('Default', 'jankx')}
            onClick={() => updateStyleVariation('default')}
            isActive={styleVariation === 'default'}
          />
          <ToolbarButton
            icon={cover}
            title={__('Banner', 'jankx')}
            onClick={() => updateStyleVariation('banner')}
            isActive={styleVariation === 'banner'}
          />
          <ToolbarButton
            icon={layout}
            title={__('Carousel', 'jankx')}
            onClick={() => updateStyleVariation('carousel')}
            isActive={styleVariation === 'carousel'}
          />
          <ToolbarButton
            icon={quote}
            title={__('Testimonial', 'jankx')}
            onClick={() => updateStyleVariation('testimonial')}
            isActive={styleVariation === 'testimonial'}
          />
        </ToolbarGroup>
      </BlockControls>

      <div {...blockProps}>
        <InspectorControls>
          <TabPanel
            className="carousel-tabs"
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
            {(styleVariation === 'carousel' || styleVariation === 'testimonial') ? (
              <>
                <RangeControl
                  label={__('Slides Per View (Desktop)', 'jankx')}
                  value={slidesPerView}
                  onChange={(val: number) => setAttributes({ slidesPerView: val })}
                  min={1}
                  max={6}
                  step={1}
                  help={__('Number of slides visible on desktop screens (≥1024px)', 'jankx')}
                />

                <RangeControl
                  label={__('Slides Per View (Tablet)', 'jankx')}
                  value={slidesPerViewTablet}
                  onChange={(val: number) => setAttributes({ slidesPerViewTablet: val })}
                  min={1}
                  max={4}
                  step={1}
                  help={__('Number of slides visible on tablet screens (768px - 1023px)', 'jankx')}
                />

                <RangeControl
                  label={__('Slides Per View (Mobile)', 'jankx')}
                  value={slidesPerViewMobile}
                  onChange={(val: number) => setAttributes({ slidesPerViewMobile: val })}
                  min={1}
                  max={2}
                  step={1}
                  help={__('Number of slides visible on mobile screens (<768px)', 'jankx')}
                />
              </>
            ) : (
              <RangeControl
                label={__('Slides Per View', 'jankx')}
                value={slidesPerView}
                onChange={(val: number) => setAttributes({ slidesPerView: val })}
                min={1}
                max={4}
                step={1}
              />
            )}

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
              onChange={(val?: number) => setAttributes({ height: val || 400 })}
              min={50}
              max={1000}
              step={50}
              help={__('Height for desktop (max-height on mobile)', 'jankx')}
            />

            <RangeControl
              label={__('Min Height (px)', 'jankx')}
              value={minHeight}
              onChange={(val?: number) => setAttributes({ minHeight: val || 50 })}
              min={50}
              max={600}
              step={50}
              help={__('Minimum height on mobile devices', 'jankx')}
            />
            <ToggleControl
              label={__('Fit Viewport (Minus Header)', 'jankx')}
              checked={!!fitViewportMinusHeader}
              onChange={(val: boolean) => setAttributes({ fitViewportMinusHeader: val })}
              help={__('Khi bật, Carousel sẽ lấp đầy phần còn lại của viewport sau header.', 'jankx')}
            />

            <ToggleControl
              label={__('Full Viewport Height (100vh)', 'jankx')}
              checked={!!fullHeight}
              onChange={(val: boolean) => setAttributes({ fullHeight: val })}
              help={__('Bật để Carousel cao bằng toàn bộ màn hình (thường dùng cho Hero).', 'jankx')}
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
                color={bannerTextColor || '#ffffff'}
                onChange={(color: string) => setAttributes({ bannerTextColor: color })}
                enableAlpha={false}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                {__('Background Color', 'jankx')}
              </label>
              <ColorPicker
                color={bannerBackgroundColor || '#000000'}
                onChange={(color: string) => setAttributes({ bannerBackgroundColor: color })}
                enableAlpha={false}
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

          <PanelBody title={__('Gradient Overlay', 'jankx')} initialOpen={false}>
            <ToggleControl
              label={__('Enable Gradient Overlay', 'jankx')}
              checked={!!gradientOverlay}
              onChange={(val: boolean) => setAttributes({ gradientOverlay: val })}
              help={__('Add a gradient overlay from bottom to top with decreasing transparency', 'jankx')}
            />

            {gradientOverlay && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    {__('Gradient Color', 'jankx')}
                  </label>
                  <ColorPicker
                    color={gradientColor || '#000000'}
                    onChange={(color: string) => setAttributes({ gradientColor: color })}
                    enableAlpha={false}
                  />
                </div>

                <RangeControl
                  label={__('Gradient Opacity', 'jankx')}
                  value={gradientOpacity}
                  onChange={(val: number) => setAttributes({ gradientOpacity: val })}
                  min={0}
                  max={1}
                  step={0.1}
                  help={__('Transparency of the gradient (0 = fully transparent, 1 = fully opaque)', 'jankx')}
                />

                <RangeControl
                  label={__('Gradient Height (%)', 'jankx')}
                  value={gradientHeight}
                  onChange={(val: number) => setAttributes({ gradientHeight: val })}
                  min={10}
                  max={100}
                  step={5}
                  help={__('Height of the gradient overlay as percentage of slide height', 'jankx')}
                />
              </>
            )}
          </PanelBody>
        </InspectorControls>

        <div className="embla">
          <div {...innerBlocksProps} className={`${innerBlocksProps.className} embla__container`} />

          {navigation && (
            <>
              <div className="embla__button embla__button--prev"></div>
              <div className="embla__button embla__button--next"></div>
            </>
          )}

          {pagination && <div className="embla__dots"></div>}
        </div>
      </div>
    </>
  );
}
