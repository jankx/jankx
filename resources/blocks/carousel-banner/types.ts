export interface CarouselBannerAttributes {
  imageId: number;
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
  linkUrl: string;
  linkTarget: '_self' | '_blank';
  bannerStyle: 'banner' | 'circles' | 'square';
  overlayOpacity: number;
  overlayColor: string;
  textAlign: 'left' | 'center' | 'right';
  textPosition: 'top' | 'middle' | 'bottom';
  showCaption: boolean;
  height?: number;
  imageSize?: 'contain' | 'cover' | 'fullwidth';
  className?: string;
}

export interface CarouselBannerProps {
  attributes: CarouselBannerAttributes;
  setAttributes: (attrs: Partial<CarouselBannerAttributes>) => void;
  clientId: string;
}
