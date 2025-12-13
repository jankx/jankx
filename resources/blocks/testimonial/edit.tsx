import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl, Button } from '@wordpress/components';
import type { TestimonialProps } from './types';

export default function Edit({ attributes, setAttributes }: TestimonialProps): JSX.Element {
  const {
    author,
    role,
    company,
    date,
    rating,
    excerpt,
    avatarId,
    link,
    className,
  } = attributes;

  const blockProps = useBlockProps({
    className: `jankx-testimonial-editor ${className || ''}`.trim(),
  });

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Testimonial', 'jankx')} initialOpen={true}>
          <TextControl label={__('Author', 'jankx')} value={author || ''} onChange={(v) => setAttributes({ author: v })} />
          <TextControl label={__('Role', 'jankx')} value={role || ''} onChange={(v) => setAttributes({ role: v })} />
          <TextControl label={__('Company', 'jankx')} value={company || ''} onChange={(v) => setAttributes({ company: v })} />
          <TextControl label={__('Date', 'jankx')} value={date || ''} onChange={(v) => setAttributes({ date: v })} />
          <RangeControl label={__('Rating', 'jankx')} value={rating || 0} min={0} max={5} onChange={(v) => setAttributes({ rating: v })} />
          <TextControl label={__('Link', 'jankx')} value={link || ''} onChange={(v) => setAttributes({ link: v })} />
          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media: any) => setAttributes({ avatarId: media?.id || 0 })}
              allowedTypes={['image']}
              value={avatarId || 0}
              render={({ open }) => (
                <Button variant="primary" onClick={open}>
                  {avatarId ? __('Change Avatar', 'jankx') : __('Select Avatar', 'jankx')}
                </Button>
              )}
            />
          </MediaUploadCheck>
        </PanelBody>
      </InspectorControls>

      <div className="testimonial-item">
        <div className="testimonial-body">
          <RichText
            tagName="div"
            className="testimonial-content"
            value={excerpt || ''}
            placeholder={__('Nội dung testimonial...', 'jankx')}
            onChange={(v) => setAttributes({ excerpt: v })}
          />
        </div>
      </div>
    </div>
  );
}

