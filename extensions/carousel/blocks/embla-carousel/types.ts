export type CarouselVariant = 'banner' | 'inner-blocks' | 'presentation';
export type TransitionType = 'slide' | 'fade' | 'crossfade';

export interface EmblaCarouselAttributes {
  variant: CarouselVariant;
  loop: boolean;
  align: 'start' | 'center' | 'end';
  dragFree: boolean;
  draggable: boolean;
  keyboardNavigation: boolean;
  parallaxDrag: boolean;
  transitionType: TransitionType;
  duration: number;
  autoplay: boolean;
  autoplayDelay: number;
  stopOnInteraction: boolean;
  stopOnMouseEnter: boolean;
  showArrows: boolean;
  arrowStyle: 'round' | 'square' | 'pill' | 'minimal';
  showDots: boolean;
  dotType: 'bullets' | 'bars' | 'numbers' | 'counter';
  showProgress: boolean;
  slidesPerView: number;
  gap: number;
  aspectRatio: '16:9' | '21:9' | '4:3' | 'auto';
  kenBurns: boolean;
  showShadow: boolean;
  shadowIntensity: number;
  borderRadius: number;
}

export interface EmblaCarouselEditProps {
  attributes: EmblaCarouselAttributes;
  setAttributes: (attrs: Partial<EmblaCarouselAttributes>) => void;
  clientId: string;
  isSelected: boolean;
}
