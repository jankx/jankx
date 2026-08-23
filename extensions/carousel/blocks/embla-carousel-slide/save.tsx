import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }: any) {
  const {
    imageUrl,
    imageAlt,
    badge,
    title,
    subtitle,
    ctaText,
    ctaLink,
    overlayOpacity,
    textAlignment,
    badgeColor,
    badgeBgColor,
    titleColor,
    subtitleColor,
    ctaBgColor,
    ctaTextColor,
    contentMinHeight,
  } = attributes;

  const blockProps = useBlockProps.save({
    className: `embla-carousel__slide embla-carousel__slide--banner embla-carousel__slide--align-${textAlignment}`,
    style: {
      '--slide-badge-color': badgeColor || '#34d399',
      '--slide-badge-bg': badgeBgColor ? `${badgeBgColor}26` : 'rgba(255,255,255,0.15)',
      '--slide-title-color': titleColor || '#ffffff',
      '--slide-subtitle-color': subtitleColor ? `${subtitleColor}d9` : 'rgba(255,255,255,0.85)',
      '--slide-cta-bg': ctaBgColor || '#16a34a',
      '--slide-cta-color': ctaTextColor || '#ffffff',
      '--slide-cta-shadow': ctaBgColor ? `${ctaBgColor}4d` : 'rgba(22,163,74,0.3)',
      '--slide-content-min-height': `${contentMinHeight || 420}px`,
    } as any,
  });

  return (
    <div {...blockProps}>
      {imageUrl && (
        <div className="embla-carousel__slide-bg">
          <img src={imageUrl} alt={imageAlt} loading="lazy" />
        </div>
      )}

      <div
        className="embla-carousel__slide-overlay"
        style={{ opacity: (overlayOpacity ?? 50) / 100 }}
      />

      <div className="embla-carousel__slide-content">
        {badge && (
          <span className="embla-carousel__slide-badge">{badge}</span>
        )}
        {title && <h3 className="embla-carousel__slide-title">{title}</h3>}
        {subtitle && (
          <p className="embla-carousel__slide-subtitle">{subtitle}</p>
        )}
        {ctaText && (
          <a href={ctaLink || '#'} className="embla-carousel__slide-cta">
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );
}
