export interface CarouselSlideAttributes {
  imageUrl: string;
  imageAlt: string;
  imageId?: number;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  overlayOpacity: number;
  textAlignment: 'left' | 'center' | 'right';
  badgeColor: string;
  badgeBgColor: string;
  titleColor: string;
  subtitleColor: string;
  ctaBgColor: string;
  ctaTextColor: string;
  contentMinHeight: number;
}

export interface CarouselSlideEditProps {
  attributes: CarouselSlideAttributes;
  setAttributes: (attrs: Partial<CarouselSlideAttributes>) => void;
  context: string[];
  isSelected: boolean;
}
