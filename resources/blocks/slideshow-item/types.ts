export interface SlideshowItemAttributes {
  imageId: number;
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
  thumbnailUrl: string;
  slideId: string;
}

export interface SlideshowItemEditProps {
  attributes: SlideshowItemAttributes;
  setAttributes: (attributes: Partial<SlideshowItemAttributes>) => void;
  clientId: string;
}
