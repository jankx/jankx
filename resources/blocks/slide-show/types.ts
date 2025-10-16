export interface SlideImage {
  id: number;
  url: string;
  alt: string;
  caption?: string;
  thumbnailUrl?: string;
  sizes?: {
    thumbnail?: {
      url: string;
      width: number;
      height: number;
    };
    medium?: {
      url: string;
      width: number;
      height: number;
    };
    large?: {
      url: string;
      width: number;
      height: number;
    };
    full?: {
      url: string;
      width: number;
      height: number;
    };
  };
}

export interface SlideshowAttributes {
  images: SlideImage[];
  autoplay: boolean;
  autoplayDelay: number;
  fullscreen: boolean;
  showThumbnails: boolean;
  showNavigation: boolean;
  showPagination: boolean;
  transitionEffect: 'slide' | 'fade';
  transitionSpeed: number;
  thumbnailSize: 'small' | 'medium' | 'large';
  mainImageHeight: number;
  captionPosition: 'top' | 'bottom' | 'overlay' | 'hidden';
  className?: string;
  anchor?: string;
}

export interface SlideshowItemAttributes {
  imageId: number;
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
  thumbnailUrl: string;
  slideId: string;
}

export interface SlideshowEditProps {
  attributes: SlideshowAttributes;
  setAttributes: (attributes: Partial<SlideshowAttributes>) => void;
  clientId: string;
}

export interface SlideshowItemEditProps {
  attributes: SlideshowItemAttributes;
  setAttributes: (attributes: Partial<SlideshowItemAttributes>) => void;
  clientId: string;
}

export interface PhotoSwipeOptions {
  bgOpacity: number;
  spacing: number;
  loop: boolean;
  zoom: boolean;
  close: boolean;
  arrowPrev: boolean;
  arrowNext: boolean;
  counter: boolean;
  fullscreen: boolean;
  share: boolean;
  autoplay?: {
    delay: number;
    disableOnInteraction: boolean;
  };
}

export interface SlideshowSettings {
  autoplay: boolean;
  autoplayDelay: number;
  fullscreen: boolean;
  showThumbnails: boolean;
  showNavigation: boolean;
  showPagination: boolean;
  transitionEffect: 'slide' | 'fade';
  transitionSpeed: number;
  thumbnailSize: 'small' | 'medium' | 'large';
  mainImageHeight: number;
}

declare global {
  interface Window {
    PhotoSwipe: any;
    PhotoSwipeUI_Default: any;
  }
}
