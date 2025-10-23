import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck, InnerBlocks } from '@wordpress/block-editor';
import { Button, Placeholder } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { SlideImage, SlideshowContainerAttributes } from './types';

export default function Edit({ 
  attributes, 
  setAttributes, 
  clientId,
  context
}: { 
  attributes: SlideshowContainerAttributes;
  setAttributes: (attrs: Partial<SlideshowContainerAttributes>) => void;
  clientId: string;
  context: {
    'jankx/showThumbnails'?: boolean;
    'jankx/showNavigation'?: boolean;
    'jankx/transitionEffect'?: string;
    'jankx/captionPosition'?: string;
  };
}) {
  const { images } = attributes;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { replaceInnerBlocks, selectBlock } = useDispatch('core/block-editor');
  
  // Get parent block ID
  const parentClientId = useSelect((select) => {
    const { getBlock } = select('core/block-editor');
    const block = getBlock(clientId);
    return block?.parentClientId;
  }, [clientId]);

  // Get settings from parent slideshow
  const showThumbnails = context['jankx/showThumbnails'] ?? true;
  const showNavigation = context['jankx/showNavigation'] ?? true;
  const transitionEffect = context['jankx/transitionEffect'] ?? 'slide';

  const blockProps = useBlockProps({
    className: 'slideshow-container-block'
  });

  // Load images from gallery and create slideshow-item blocks
  const onSelectImages = async (mediaList: any[]) => {
    setIsLoading(true);

    // Create slideshow-item blocks for each selected image
    const slideshowItems = mediaList.map(media => {
      const thumbnailUrl = media.sizes?.thumbnail?.url || media.sizes?.medium?.url || media.url;

      return createBlock('jankx/slideshow-item', {
        imageId: media.id,
        imageUrl: media.url,
        imageAlt: media.alt || '',
        imageCaption: media.caption || '',
        thumbnailUrl: thumbnailUrl,
        slideId: `slide-${media.id}-${Date.now()}`
      });
    });

    // Replace existing inner blocks with new slideshow-items
    replaceInnerBlocks(clientId, slideshowItems, false);

    // Also save images to attributes
    const newImages: SlideImage[] = mediaList.map(media => ({
      id: media.id,
      url: media.url,
      alt: media.alt || '',
      caption: media.caption || '',
      thumbnailUrl: media.sizes?.thumbnail?.url || media.sizes?.medium?.url || media.url,
      sizes: media.sizes
    }));

    setAttributes({ images: newImages });
    setIsLoading(false);
    
    // Focus back to parent slideshow block after a short delay
    if (parentClientId) {
      setTimeout(() => {
        selectBlock(parentClientId);
      }, 100);
    }
  };

  const onRemoveAllImages = () => {
    replaceInnerBlocks(clientId, [], false);
    setAttributes({ images: [] });
    setCurrentSlide(0);
    
    // Focus back to parent slideshow block after a short delay
    if (parentClientId) {
      setTimeout(() => {
        selectBlock(parentClientId);
      }, 100);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  if (images.length === 0) {
    return (
      <div {...blockProps}>
        <Placeholder
          icon="format-gallery"
          label={__('Slideshow Container', 'jankx')}
          instructions={__('Select images from your media library to create a slideshow.', 'jankx')}
        >
          <MediaUploadCheck>
            <MediaUpload
              onSelect={onSelectImages}
              allowedTypes={['image']}
              multiple
              gallery
              render={({ open }) => (
                <Button variant="primary" onClick={open} isBusy={isLoading}>
                  {isLoading ? __('Loading...', 'jankx') : __('Select Images', 'jankx')}
                </Button>
              )}
            />
          </MediaUploadCheck>
        </Placeholder>
      </div>
    );
  }

  return (
    <div {...blockProps}>
      {/* Toolbar for changing images */}
      <div className="slideshow-container-toolbar">
        <MediaUploadCheck>
          <MediaUpload
            onSelect={onSelectImages}
            allowedTypes={['image']}
            multiple
            gallery
            value={images.map(img => img.id)}
            render={({ open }) => (
              <Button variant="secondary" onClick={open}>
                {__('Change Images', 'jankx')}
              </Button>
            )}
          />
        </MediaUploadCheck>
        <Button variant="secondary" onClick={onRemoveAllImages} isDestructive>
          {__('Remove All Images', 'jankx')}
        </Button>
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="slideshow-thumbnails">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`slideshow-thumbnail ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              style={{ width: '60px', height: '60px' }}
            >
              <img src={image.thumbnailUrl} alt={image.alt} />
            </button>
          ))}
        </div>
      )}

      {/* Main Slideshow Preview */}
      <div className="slideshow-main">
        <div className="slideshow-container">
          <div className="slideshow-track">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`slideshow-slide ${index === currentSlide ? 'active' : ''}`}
                style={{
                  transform: transitionEffect === 'slide'
                    ? `translateX(${(index - currentSlide) * 100}%)`
                    : 'translateX(0)',
                  opacity: transitionEffect === 'fade'
                    ? (index === currentSlide ? 1 : 0)
                    : 1
                }}
              >
                <img src={image.url} alt={image.alt} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        {showNavigation && images.length > 1 && (
          <>
            <button
              className="slideshow-nav slideshow-nav-prev"
              onClick={goToPrevious}
              aria-label={__('Previous slide', 'jankx')}
            >
              ←
            </button>
            <button
              className="slideshow-nav slideshow-nav-next"
              onClick={goToNext}
              aria-label={__('Next slide', 'jankx')}
            >
              →
            </button>
          </>
        )}
      </div>

      {/* InnerBlocks for slideshow-items (hidden, for data structure) */}
      <div style={{ display: 'none' }}>
        <InnerBlocks
          allowedBlocks={['jankx/slideshow-item']}
          template={[]}
          templateLock={false}
        />
      </div>
    </div>
  );
}
