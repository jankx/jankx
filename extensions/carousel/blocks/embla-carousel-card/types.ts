export interface CarouselCardAttributes {
  category: string;
  title: string;
  description: string;
  badgeText: string;
  metricValue: string;
  metricLabel: string;
  actionText: string;
  cardColor: 'slate' | 'indigo' | 'emerald' | 'amber' | 'rose';
}

export interface CarouselCardEditProps {
  attributes: CarouselCardAttributes;
  setAttributes: (attrs: Partial<CarouselCardAttributes>) => void;
  context: string[];
  isSelected: boolean;
}
