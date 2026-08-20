import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }: any) {
  const {
    layout,
    title,
    subtitle,
    bodyText,
    bullets,
    statsNumber,
    statsLabel,
    quoteText,
    quoteAuthor,
    quoteRole,
    theme,
  } = attributes;

  const blockProps = useBlockProps.save({
    className: `embla-carousel__slide embla-carousel__slide--presentation embla-carousel__slide--layout-${layout} embla-carousel__slide--theme-${theme}`,
  });

  return (
    <div {...blockProps}>
      <div className="embla-carousel__presentation-header">
        <span className="embla-carousel__presentation-layout">{layout}</span>
      </div>

      <div className="embla-carousel__presentation-body">
        {layout === 'title' && (
          <div className="embla-carousel__presentation-title-layout">
            {title && <h2 className="embla-carousel__presentation-title">{title}</h2>}
            {subtitle && <p className="embla-carousel__presentation-subtitle">{subtitle}</p>}
          </div>
        )}

        {layout === 'stats' && (
          <div className="embla-carousel__presentation-stats-layout">
            <div className="embla-carousel__presentation-stat">
              <span className="embla-carousel__presentation-stat-number">{statsNumber}</span>
              <span className="embla-carousel__presentation-stat-label">{statsLabel}</span>
            </div>
            <div className="embla-carousel__presentation-stat-content">
              {title && <h2 className="embla-carousel__presentation-title">{title}</h2>}
              {bodyText && <p className="embla-carousel__presentation-body-text">{bodyText}</p>}
            </div>
          </div>
        )}

        {layout === 'bullets' && (
          <div className="embla-carousel__presentation-bullets-layout">
            {title && <h2 className="embla-carousel__presentation-title">{title}</h2>}
            {subtitle && <p className="embla-carousel__presentation-subtitle">{subtitle}</p>}
            <ul className="embla-carousel__presentation-bullets">
              {bullets?.map((item: string, i: number) => (
                <li key={i} className="embla-carousel__presentation-bullet">
                  <span className="embla-carousel__presentation-bullet-number">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {layout === 'quote' && (
          <div className="embla-carousel__presentation-quote-layout">
            <blockquote className="embla-carousel__presentation-quote">
              &ldquo;{quoteText}&rdquo;
            </blockquote>
            <div className="embla-carousel__presentation-quote-author">{quoteAuthor}</div>
            <div className="embla-carousel__presentation-quote-role">{quoteRole}</div>
          </div>
        )}

        {layout === 'split' && (
          <div className="embla-carousel__presentation-split-layout">
            <div className="embla-carousel__presentation-split-left">
              {title && <h2 className="embla-carousel__presentation-title">{title}</h2>}
              {subtitle && <div className="embla-carousel__presentation-subtitle-accent">{subtitle}</div>}
              {bodyText && <p className="embla-carousel__presentation-body-text">{bodyText}</p>}
            </div>
            <div className="embla-carousel__presentation-split-right">
              {bullets?.map((item: string, i: number) => (
                <div key={i} className="embla-carousel__presentation-split-item">{item}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="embla-carousel__presentation-footer">
        <span>WordPress Gutenberg Block</span>
        <span>Embla Carousel</span>
      </div>
    </div>
  );
}
