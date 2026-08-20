import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }: any) {
  const blockProps = useBlockProps.save({
    className: 'wp-block-jankx-embla-carousel',
    'data-variant': attributes.variant,
    'data-loop': String(attributes.loop ?? true),
    'data-align': attributes.align ?? 'center',
    'data-drag-free': String(attributes.dragFree ?? false),
    'data-draggable': String(attributes.draggable ?? true),
    'data-keyboard': String(attributes.keyboardNavigation ?? true),
    'data-parallax': String(attributes.parallaxDrag ?? true),
    'data-transition': attributes.transitionType ?? 'slide',
    'data-duration': String(attributes.duration ?? 25),
    'data-autoplay': String(attributes.autoplay ?? true),
    'data-autoplay-delay': String(attributes.autoplayDelay ?? 4500),
    'data-stop-on-interaction': String(attributes.stopOnInteraction ?? true),
    'data-stop-on-hover': String(attributes.stopOnMouseEnter ?? true),
    'data-show-arrows': String(attributes.showArrows ?? true),
    'data-arrow-style': attributes.arrowStyle ?? 'round',
    'data-show-dots': String(attributes.showDots ?? true),
    'data-dot-type': attributes.dotType ?? 'bullets',
    'data-show-progress': String(attributes.showProgress ?? true),
    'data-slides-per-view': String(attributes.slidesPerView ?? 3),
    'data-gap': String(attributes.gap ?? 20),
    'data-border-radius': String(attributes.borderRadius ?? 16),
  });

  return (
    <div {...blockProps}>
      <div className="embla-carousel__viewport">
        <div className="embla-carousel__container">
          <InnerBlocks.Content />
        </div>
      </div>
    </div>
  );
}
