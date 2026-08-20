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
  } = attributes;

  const blockProps = useBlockProps.save({
    className: `embla-carousel__slide embla-carousel__slide--banner embla-carousel__slide--align-${textAlignment}`,
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
