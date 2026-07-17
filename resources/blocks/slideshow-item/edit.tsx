import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor';
import { Button, Placeholder } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import type { SlideshowItemEditProps } from './types';

export default function Edit({ attributes, setAttributes }: SlideshowItemEditProps): JSX.Element {
  const { imageId, imageUrl, imageAlt, imageCaption, thumbnailUrl } = attributes;

  const blockProps = useBlockProps({
    className: 'slideshow-item-block'
  });

  // Generate slide ID if not exists
  useEffect(() => {
    if (!attributes.slideId) {
      setAttributes({ slideId: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` });
    }
  }, [attributes.slideId, setAttributes]);

  const onSelectImage = (media: any) => {
    if (media && media.type === 'image') {
      const thumbnailUrl = media.sizes?.thumbnail?.url || media.sizes?.medium?.url || media.url;

      setAttributes({
        imageId: media.id,
        imageUrl: media.url,
        imageAlt: media.alt || '',
        imageCaption: media.caption || '',
        thumbnailUrl: thumbnailUrl
      });
    }
  };

  const onRemoveImage = () => {
    setAttributes({
      imageId: 0,
      imageUrl: '',
      imageAlt: '',
      imageCaption: '',
      thumbnailUrl: ''
    });
  };

  if (!imageId || !imageUrl) {
    return (
      <div {...blockProps}>
        <Placeholder
          icon="format-gallery"
          label={__('Slideshow Item', 'jankx')}
          instructions={__('Select an image for this slideshow item.', 'jankx')}
        >
          <MediaUploadCheck>
            <MediaUpload
              onSelect={onSelectImage}
              allowedTypes={['image']}
              value={imageId}
              render={({ open }) => (
                <Button variant="primary" onClick={open}>
                  {__('Select Image', 'jankx')}
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
      <div className="slideshow-slide">
        <div className="slideshow-item-image">
          {imageUrl ? (
            <img src={imageUrl} alt={imageAlt} />
          ) : (
            <div className="slideshow-placeholder">
              <div className="placeholder-icon">📷</div>
              <div className="placeholder-text">No image selected</div>
            </div>
          )}
          <div className="slideshow-item-overlay">
            <MediaUploadCheck>
              <MediaUpload
                onSelect={onSelectImage}
                allowedTypes={['image']}
                value={imageId}
                render={({ open }) => (
                  <Button
                    variant="secondary"
                    onClick={open}
                    className="change-image-btn"
                  >
                    {__('Change Image', 'jankx')}
                  </Button>
                )}
              />
            </MediaUploadCheck>
            <Button
              variant="secondary"
              onClick={onRemoveImage}
              className="remove-image-btn"
            >
              {__('Remove', 'jankx')}
            </Button>
          </div>
        </div>

        <div className="slideshow-caption">
          <RichText
            tagName="div"
            value={imageCaption}
            onChange={(value) => setAttributes({ imageCaption: value })}
            placeholder={__('Enter caption for this image...', 'jankx')}
            allowedFormats={['core/bold', 'core/italic', 'core/link']}
          />
        </div>
      </div>
    </div>
  );
}