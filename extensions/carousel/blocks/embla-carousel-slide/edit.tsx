import React from 'react';
import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  MediaUpload,
  MediaUploadCheck,
  InspectorControls,
  RichText,
  ColorPalette,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl, RangeControl, SelectControl, Button } from '@wordpress/components';
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
          <RangeControl
            label={__('Chiều cao nội dung (px)', 'jankx')}
            value={attributes.contentMinHeight}
            onChange={(val) => update({ contentMinHeight: val ?? 420 })}
            min={200}
            max={800}
            step={10}
          />
        </PanelBody>

        <PanelBody title={__('Màu sắc', 'jankx')} initialOpen={false}>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Màu badge:', 'jankx')}</span>
            <ColorPalette
              value={attributes.badgeColor}
              onChange={(val) => update({ badgeColor: val ?? '#34d399' })}
              disableCustomColors={false}
            />
          </PanelRow>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Nền badge:', 'jankx')}</span>
            <ColorPalette
              value={attributes.badgeBgColor}
              onChange={(val) => update({ badgeBgColor: val ?? '#ffffff' })}
              disableCustomColors={false}
            />
          </PanelRow>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Màu tiêu đề:', 'jankx')}</span>
            <ColorPalette
              value={attributes.titleColor}
              onChange={(val) => update({ titleColor: val ?? '#ffffff' })}
              disableCustomColors={false}
            />
          </PanelRow>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Màu mô tả:', 'jankx')}</span>
            <ColorPalette
              value={attributes.subtitleColor}
              onChange={(val) => update({ subtitleColor: val ?? '#ffffff' })}
              disableCustomColors={false}
            />
          </PanelRow>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Màu nút CTA:', 'jankx')}</span>
            <ColorPalette
              value={attributes.ctaBgColor}
              onChange={(val) => update({ ctaBgColor: val ?? '#16a34a' })}
              disableCustomColors={false}
            />
          </PanelRow>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Màu text nút:', 'jankx')}</span>
            <ColorPalette
              value={attributes.ctaTextColor}
              onChange={(val) => update({ ctaTextColor: val ?? '#ffffff' })}
              disableCustomColors={false}
            />
          </PanelRow>
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
