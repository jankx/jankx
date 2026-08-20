import React from 'react';
import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  MediaUpload,
  MediaUploadCheck,
  InspectorControls,
  RichText,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, RangeControl, SelectControl, Button } from '@wordpress/components';
import type { CarouselSlideAttributes, CarouselSlideEditProps } from './types';

const ALIGN_OPTIONS = [
  { label: __('Trái', 'jankx'), value: 'left' },
  { label: __('Giữa', 'jankx'), value: 'center' },
  { label: __('Phải', 'jankx'), value: 'right' },
];

export default function Edit({
  attributes,
  setAttributes,
  context,
}: CarouselSlideEditProps) {
  const blockProps = useBlockProps({
    className: `embla-carousel__slide embla-carousel__slide--banner embla-carousel__slide--align-${attributes.textAlignment}`,
  });

  const update = (updated: Partial<CarouselSlideAttributes>) => {
    setAttributes(updated);
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Hình ảnh', 'jankx')}>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media: any) =>
                update({ imageUrl: media.url, imageAlt: media.alt, imageId: media.id })
              }
              allowedTypes={['image']}
              value={attributes.imageId}
              render={({ open }) => (
                <Button
                  onClick={open}
                  variant="secondary"
                  style={{ width: '100%', marginBottom: 8 }}
                >
                  {attributes.imageUrl
                    ? __('Thay đổi hình ảnh', 'jankx')
                    : __('Chọn hình ảnh', 'jankx')}
                </Button>
              )}
            />
          </MediaUploadCheck>
          <TextControl
            label={__('Alt text', 'jankx')}
            value={attributes.imageAlt}
            onChange={(val) => update({ imageAlt: val })}
          />
        </PanelBody>

        <PanelBody title={__('Nội dung', 'jankx')}>
          <TextControl
            label={__('Badge', 'jankx')}
            value={attributes.badge}
            onChange={(val) => update({ badge: val })}
          />
          <TextControl
            label={__('Tiêu đề', 'jankx')}
            value={attributes.title}
            onChange={(val) => update({ title: val })}
          />
          <TextControl
            label={__('Mô tả', 'jankx')}
            value={attributes.subtitle}
            onChange={(val) => update({ subtitle: val })}
          />
        </PanelBody>

        <PanelBody title={__('CTA Button', 'jankx')}>
          <TextControl
            label={__('Text nút', 'jankx')}
            value={attributes.ctaText}
            onChange={(val) => update({ ctaText: val })}
          />
          <TextControl
            label={__('Link', 'jankx')}
            value={attributes.ctaLink}
            onChange={(val) => update({ ctaLink: val })}
          />
        </PanelBody>

        <PanelBody title={__('Hiệu ứng', 'jankx')}>
          <RangeControl
            label={__('Độ tối overlay (%)', 'jankx')}
            value={attributes.overlayOpacity}
            onChange={(val) => update({ overlayOpacity: val ?? 50 })}
            min={0}
            max={100}
          />
          <SelectControl
            label={__('Căn text', 'jankx')}
            value={attributes.textAlignment}
            options={ALIGN_OPTIONS}
            onChange={(val) => update({ textAlignment: val as any })}
          />
        </PanelBody>
      </InspectorControls>

      {/* Editor Preview */}
      <div className="embla-carousel__slide-editor">
        {attributes.imageUrl ? (
          <div className="embla-carousel__slide-bg">
            <img src={attributes.imageUrl} alt={attributes.imageAlt} />
          </div>
        ) : (
          <div className="embla-carousel__slide-placeholder">
            <span>{__('Chọn hình ảnh', 'jankx')}</span>
          </div>
        )}

        <div
          className="embla-carousel__slide-overlay"
          style={{ opacity: (attributes.overlayOpacity ?? 50) / 100 }}
        />

        <div className="embla-carousel__slide-content">
          {attributes.badge && (
            <span className="embla-carousel__slide-badge">{attributes.badge}</span>
          )}
          <RichText
            tagName="h3"
            className="embla-carousel__slide-title"
            value={attributes.title}
            onChange={(val) => update({ title: val })}
            placeholder={__('Tiêu đề slide...', 'jankx')}
          />
          <RichText
            tagName="p"
            className="embla-carousel__slide-subtitle"
            value={attributes.subtitle}
            onChange={(val) => update({ subtitle: val })}
            placeholder={__('Mô tả...', 'jankx')}
          />
          {attributes.ctaText && (
            <span className="embla-carousel__slide-cta">{attributes.ctaText}</span>
          )}
        </div>
      </div>
    </div>
  );
}
