import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import type { TestimonialProps } from './types';

export default function Edit({ attributes, setAttributes, context }: TestimonialProps): JSX.Element {
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

  const media = useSelect(
    (select: any) => (avatarId ? select('core').getMedia(avatarId) : null),
    [avatarId]
  );

  const asSlide = !!(context && context.asSlide);
  const itemClasses = `testimonial-item${asSlide ? ' swiper-slide' : ''}`;

  const stars = '★'.repeat(Math.min(rating || 0, 5)) + '☆'.repeat(Math.max(0, 5 - Math.min(rating || 0, 5)));
  const metaParts = [role || '', company || ''].filter(Boolean);
  const meta = metaParts.length ? metaParts.join(' • ') : '';

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
      <div className={itemClasses}>
        <div className="testimonial-header">
            {avatarId && media?.source_url ? (
            <div className="testimonial-avatar">
                <img className="avatar" src={media.source_url} alt={media.alt_text || ''} />
            </div>
            ) : null}
            <div className="testimonial-info">
                {author ? (
                    link ? (
                    <a className="testimonial-link" href={link}>
                        <div className="testimonial-author">{author}</div>
                    </a>
                    ) : (
                    <div className="testimonial-author">{author}</div>
                    )
                ) : null}
                {rating ? <div className="testimonial-rating" aria-label={`${rating}/5`}>{stars}</div> : null}
            </div>
        </div>

        <div className="testimonial-body">
          <div className="testimonial-quote-icon">“</div>
          <RichText
            tagName="div"
            className="testimonial-content"
            value={excerpt || ''}
            placeholder={__('Nội dung testimonial...', 'jankx')}
            onChange={(v) => setAttributes({ excerpt: v })}
          />
        </div>

        <div className="testimonial-footer">
            {meta ? <div className="testimonial-meta">{meta}</div> : null}
            {date ? <div className="testimonial-date">{date}</div> : null}
        </div>
      </div>
    </div>
  );
}
