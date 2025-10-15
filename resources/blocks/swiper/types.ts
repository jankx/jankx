export interface SwiperAttributes {
  slidesPerView: number;
  spaceBetween: number;
  loop: boolean;
  autoplay: boolean;
  autoplayDelay: number;
  speed: number;
  navigation: boolean;
  pagination: boolean;
  effect: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip' | 'cards';
  height: number;
  minHeight: number;
  className?: string;
  anchor?: string;
}

export interface SwiperProps {
  attributes: SwiperAttributes;
  setAttributes: (attrs: Partial<SwiperAttributes>) => void;
  clientId: string;
}
