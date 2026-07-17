import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, useInnerBlocksProps, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, SelectControl } from '@wordpress/components';
import type { TestimonialsProps, LayoutType } from './types';

export default function Edit({ attributes, setAttributes }: TestimonialsProps): JSX.Element {
  const {
    asSlide,
    layout,
    slidesPerView,
    spaceBetween,
    loop,
    autoplay,
    autoplayDelay,
    navigation,
    pagination,
    height,
    minHeight,
    className,
  } = attributes;

  const updateLayout = (val: LayoutType) => {
    setAttributes({
      layout: val,
      asSlide: val === 'carousel' || val === 'banner',
    });
  };

  const blockProps = useBlockProps({
    className: `jankx-testimonials-editor ${className || ''}`.trim(),
    style: {
      '--swiper-height': `${height}px`,
      '--swiper-min-height': `${minHeight}px`,
    } as React.CSSProperties,
  });

  const innerBlocksProps = useInnerBlocksProps(
    { className: layout === 'carousel' || layout === 'banner' ? 'swiper-wrapper' : 'testimonials-wrapper' },
    {
      allowedBlocks: ['jankx/testimonial'],
      templateLock: false,
      orientation: 'horizontal',
      renderAppender: () => <InnerBlocks.ButtonBlockAppender />
    }
  );

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Testimonials Container', 'jankx')} initialOpen={true}>
          <SelectControl
            label={__('Layout', 'jankx')}
            value={layout || 'default'}
            options={[
              { label: 'Default', value: 'default' },
              { label: 'Grid', value: 'grid' },
              { label: 'List', value: 'list' },
              { label: 'Carousel', value: 'carousel' },
              { label: 'Banner', value: 'banner' },
            ]}
            onChange={(v: LayoutType) => updateLayout(v)}
          />
          {(layout === 'carousel' || layout === 'banner') && (
            <>
              <RangeControl
                label={__('Slides per view', 'jankx')}
                value={slidesPerView || 1}
                min={1}
                max={6}
                onChange={(v: number) => setAttributes({ slidesPerView: v })}
              />
              <RangeControl
                label={__('Space between', 'jankx')}
                value={spaceBetween || 30}
                min={0}
                max={100}
                onChange={(v: number) => setAttributes({ spaceBetween: v })}
              />
              <ToggleControl
                label={__('Loop', 'jankx')}
                checked={!!loop}
                onChange={(v: boolean) => setAttributes({ loop: v })}
              />
              <ToggleControl
                label={__('Autoplay', 'jankx')}
                checked={!!autoplay}
                onChange={(v: boolean) => setAttributes({ autoplay: v })}
              />
              {autoplay && (
                <RangeControl
                  label={__('Autoplay Delay (ms)', 'jankx')}
                  value={autoplayDelay || 3000}
                  min={1000}
                  max={10000}
                  step={500}
                  onChange={(v: number) => setAttributes({ autoplayDelay: v })}
                />
              )}
              <ToggleControl
                label={__('Navigation', 'jankx')}
                checked={navigation !== false}
                onChange={(v: boolean) => setAttributes({ navigation: v })}
              />
              <ToggleControl
                label={__('Pagination', 'jankx')}
                checked={pagination !== false}
                onChange={(v: boolean) => setAttributes({ pagination: v })}
              />
            </>
          )}
          <RangeControl
            label={__('Height (px)', 'jankx')}
            value={height || 50}
            min={50}
            max={1000}
            step={50}
            onChange={(v: number) => setAttributes({ height: v })}
          />
          <RangeControl
            label={__('Min Height (px)', 'jankx')}
            value={minHeight || 50}
            min={50}
            max={600}
            step={50}
            onChange={(v: number) => setAttributes({ minHeight: v })}
          />
        </PanelBody>
      </InspectorControls>

      {(layout === 'carousel' || layout === 'banner') ? (
        <div className="swiper">
          <div {...innerBlocksProps} />
          {navigation && (
            <>
              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
            </>
          )}
          {pagination && <div className="swiper-pagination"></div>}
        </div>
      ) : (
        <div {...innerBlocksProps} />
      )}
    </div>
  );
}
