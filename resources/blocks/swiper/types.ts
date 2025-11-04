export interface SwiperAttributes {
  slidesPerView: number;
  slidesPerViewTablet: number;
  slidesPerViewMobile: number;
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
  contentMode: 'slides' | 'gallery';
  galleryImages: Array<{
    id: number;
    url: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
  anchor?: string;
}

export interface SwiperProps {
  attributes: SwiperAttributes;
  setAttributes: (attrs: Partial<SwiperAttributes>) => void;
  clientId: string;
}
