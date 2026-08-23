export interface CarouselCardAttributes {
  category: string;
  title: string;
  description: string;
  badgeText: string;
  metricValue: string;
  metricLabel: string;
  actionText: string;
  cardColor: 'slate' | 'indigo' | 'emerald' | 'amber' | 'rose';
  cardBgColor: string;
  cardBorderColor: string;
  cardTitleColor: string;
  cardDescriptionColor: string;
  cardBadgeBgColor: string;
  cardBadgeColor: string;
  cardMetricColor: string;
  cardFooterBorderColor: string;
  cardHoverBorderColor: string;
}

export interface CarouselCardEditProps {
  attributes: CarouselCardAttributes;
  setAttributes: (attrs: Partial<CarouselCardAttributes>) => void;
  context: string[];
  isSelected: boolean;
}
