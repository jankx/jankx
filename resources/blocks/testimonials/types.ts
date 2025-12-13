export type LayoutType = 'default' | 'grid' | 'list' | 'carousel' | 'banner';

export interface TestimonialsAttributes {
  asSlide: boolean;
  layout: LayoutType;
  slidesPerView: number;
  spaceBetween: number;
  loop: boolean;
  autoplay: boolean;
  autoplayDelay: number;
  navigation: boolean;
  pagination: boolean;
  height: number;
  minHeight: number;
  className?: string;
  anchor?: string;
}

export interface TestimonialsProps {
  attributes: TestimonialsAttributes;
  setAttributes: (attrs: Partial<TestimonialsAttributes>) => void;
  clientId: string;
}

