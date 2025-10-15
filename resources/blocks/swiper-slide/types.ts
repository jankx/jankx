export interface SwiperSlideAttributes {
  slideId?: string;
}

export interface SwiperSlideProps {
  attributes: SwiperSlideAttributes;
  setAttributes: (attrs: Partial<SwiperSlideAttributes>) => void;
  clientId: string;
  context?: {
    'jankx/swiperId'?: string;
  };
}
