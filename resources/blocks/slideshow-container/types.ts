export interface SlideImage {
  id: number;
  url: string;
  alt: string;
  caption?: string;
  thumbnailUrl?: string;
  sizes?: any;
}

export interface SlideshowContainerAttributes {
  containerId?: string;
  images: SlideImage[];
}

