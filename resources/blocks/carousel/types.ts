export interface CarouselAttributes {
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
  fitViewportMinusHeader?: boolean;
  fullHeight?: boolean;
  contentMode: 'slides' | 'gallery';
  galleryImages: Array<{
    id: number;
    url: string;
    alt: string;
    caption?: string;
  }>;
  bannerStyle?: string;
  bannerTextColor?: string;
  bannerBackgroundColor?: string;
  bannerPadding?: number;
  bannerBorderRadius?: number;
  gradientOverlay?: boolean;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientHeight?: number;
  className?: string;
  anchor?: string;
}

export interface CarouselProps {
  attributes: CarouselAttributes;
  setAttributes: (attrs: Partial<CarouselAttributes>) => void;
  clientId: string;
}
