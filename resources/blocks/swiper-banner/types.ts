export interface SwiperBannerAttributes {
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

export interface SwiperBannerProps {
  attributes: SwiperBannerAttributes;
  setAttributes: (attrs: Partial<SwiperBannerAttributes>) => void;
  clientId: string;
}
