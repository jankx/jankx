import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }: any) {
  const {
    category,
    title,
    description,
    badgeText,
    metricValue,
    metricLabel,
    actionText,
    cardColor,
  } = attributes;

  const blockProps = useBlockProps.save({
    className: `embla-carousel__slide embla-carousel__slide--card embla-carousel__card--${cardColor}`,
  });

  return (
    <div {...blockProps}>
      <div className="embla-carousel__card-inner">
        <div className="embla-carousel__card-header">
          <span className="embla-carousel__card-category">{category}</span>
          {badgeText && (
            <span className="embla-carousel__card-badge">{badgeText}</span>
          )}
        </div>

        <h4 className="embla-carousel__card-title">{title}</h4>
        <p className="embla-carousel__card-description">{description}</p>

        <div className="embla-carousel__card-footer">
          {metricValue ? (
            <div className="embla-carousel__card-metric">
              <span className="embla-carousel__card-metric-value">{metricValue}</span>
              <span className="embla-carousel__card-metric-label">{metricLabel}</span>
            </div>
          ) : (
            <span className="embla-carousel__card-ready">Ready</span>
          )}
          {actionText && (
            <span className="embla-carousel__card-action">{actionText}</span>
          )}
        </div>
      </div>
    </div>
  );
}
