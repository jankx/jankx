export interface CarouselSlideAttributes {
  slideId?: string;
  imageSize?: 'contain' | 'cover' | 'fullwidth';
}

export interface CarouselSlideProps {
  attributes: CarouselSlideAttributes;
  setAttributes: (attrs: Partial<CarouselSlideAttributes>) => void;
  clientId: string;
  context?: {
    'jankx/carouselId'?: string;
  };
}
