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
    'data-arrow-size': String(attributes.arrowSize ?? 44),
    'data-arrow-bg-color': attributes.arrowBgColor ?? '#000000',
    'data-arrow-bg-opacity': String(attributes.arrowBgOpacity ?? 40),
    'data-arrow-color': attributes.arrowColor ?? '#ffffff',
    'data-arrow-border-color': attributes.arrowBorderColor ?? '#ffffff',
    'data-arrow-border-opacity': String(attributes.arrowBorderOpacity ?? 20),
    'data-show-dots': String(attributes.showDots ?? true),
    'data-dot-type': attributes.dotType ?? 'bullets',
    'data-dot-size': String(attributes.dotSize ?? 8),
    'data-dot-color': attributes.dotColor ?? '#000000',
    'data-dot-color-opacity': String(attributes.dotColorOpacity ?? 20),
    'data-dot-active-color': attributes.dotActiveColor ?? '#1e293b',
    'data-dot-active-width': String(attributes.dotActiveWidth ?? 24),
    'data-show-progress': String(attributes.showProgress ?? true),
    'data-progress-height': String(attributes.progressHeight ?? 4),
    'data-progress-track-color': attributes.progressTrackColor ?? '#ffffff',
    'data-progress-track-opacity': String(attributes.progressTrackOpacity ?? 20),
    'data-progress-bar-color': attributes.progressBarColor ?? '#16a34a',
    'data-slides-per-view': String(attributes.slidesPerView ?? 3),
    'data-gap': String(attributes.gap ?? 20),
    'data-border-radius': String(attributes.borderRadius ?? 16),
    'data-shadow-color': attributes.shadowColor ?? '#0f172a',
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
