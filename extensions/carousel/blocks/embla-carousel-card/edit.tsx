import React from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl, SelectControl } from '@wordpress/components';
import type { CarouselCardAttributes, CarouselCardEditProps } from './types';

const COLOR_OPTIONS = [
  { label: __('Slate', 'jankx'), value: 'slate' },
  { label: __('Indigo', 'jankx'), value: 'indigo' },
  { label: __('Emerald', 'jankx'), value: 'emerald' },
  { label: __('Amber', 'jankx'), value: 'amber' },
  { label: __('Rose', 'jankx'), value: 'rose' },
];

export default function Edit({
  attributes,
  setAttributes,
}: CarouselCardEditProps) {
  const blockProps = useBlockProps({
    className: `embla-carousel__slide embla-carousel__slide--card embla-carousel__card--${attributes.cardColor}`,
  });

  const update = (updated: Partial<CarouselCardAttributes>) => {
    setAttributes(updated);
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Card Settings', 'jankx')}>
          <TextControl
            label={__('Category', 'jankx')}
            value={attributes.category}
            onChange={(val) => update({ category: val })}
          />
          <TextControl
            label={__('Badge', 'jankx')}
            value={attributes.badgeText}
            onChange={(val) => update({ badgeText: val })}
          />
          <TextControl
            label={__('Metric Value', 'jankx')}
            value={attributes.metricValue}
            onChange={(val) => update({ metricValue: val })}
          />
          <TextControl
            label={__('Metric Label', 'jankx')}
            value={attributes.metricLabel}
            onChange={(val) => update({ metricLabel: val })}
          />
          <TextControl
            label={__('Action Text', 'jankx')}
            value={attributes.actionText}
            onChange={(val) => update({ actionText: val })}
          />
          <SelectControl
            label={__('Màu sắc', 'jankx')}
            value={attributes.cardColor}
            options={COLOR_OPTIONS}
            onChange={(val) => update({ cardColor: val as any })}
          />
        </PanelBody>

        <PanelBody title={__('Màu sắc tùy chỉnh', 'jankx')} initialOpen={false}>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Nền card:', 'jankx')}</span>
            <ColorPalette
              value={attributes.cardBgColor}
              onChange={(val) => update({ cardBgColor: val ?? '#ffffff' })}
              disableCustomColors={false}
            />
          </PanelRow>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Viền card:', 'jankx')}</span>
            <ColorPalette
              value={attributes.cardBorderColor}
              onChange={(val) => update({ cardBorderColor: val ?? '#e2e8f0' })}
              disableCustomColors={false}
            />
          </PanelRow>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Màu tiêu đề:', 'jankx')}</span>
            <ColorPalette
              value={attributes.cardTitleColor}
              onChange={(val) => update({ cardTitleColor: val ?? '#0f172a' })}
              disableCustomColors={false}
            />
          </PanelRow>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Màu mô tả:', 'jankx')}</span>
            <ColorPalette
              value={attributes.cardDescriptionColor}
              onChange={(val) => update({ cardDescriptionColor: val ?? '#475569' })}
              disableCustomColors={false}
            />
          </PanelRow>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Nền badge:', 'jankx')}</span>
            <ColorPalette
              value={attributes.cardBadgeBgColor}
              onChange={(val) => update({ cardBadgeBgColor: val ?? '#f1f5f9' })}
              disableCustomColors={false}
            />
          </PanelRow>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Màu badge:', 'jankx')}</span>
            <ColorPalette
              value={attributes.cardBadgeColor}
              onChange={(val) => update({ cardBadgeColor: val ?? '#475569' })}
              disableCustomColors={false}
            />
          </PanelRow>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Màu metric:', 'jankx')}</span>
            <ColorPalette
              value={attributes.cardMetricColor}
              onChange={(val) => update({ cardMetricColor: val ?? '#0f172a' })}
              disableCustomColors={false}
            />
          </PanelRow>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Viền footer:', 'jankx')}</span>
            <ColorPalette
              value={attributes.cardFooterBorderColor}
              onChange={(val) => update({ cardFooterBorderColor: val ?? '#f1f5f9' })}
              disableCustomColors={false}
            />
          </PanelRow>
          <PanelRow>
            <span className="jankx-carousel-label">{__('Viền hover:', 'jankx')}</span>
            <ColorPalette
              value={attributes.cardHoverBorderColor}
              onChange={(val) => update({ cardHoverBorderColor: val ?? '#94a3b8' })}
              disableCustomColors={false}
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>

      <div className="embla-carousel__card-editor">
        <div className="embla-carousel__card-header">
          <span className="embla-carousel__card-category">{attributes.category}</span>
          {attributes.badgeText && (
            <span className="embla-carousel__card-badge">{attributes.badgeText}</span>
          )}
        </div>

        <RichText
          tagName="h4"
          className="embla-carousel__card-title"
          value={attributes.title}
          onChange={(val) => update({ title: val })}
          placeholder={__('Tiêu đề card...', 'jankx')}
        />
        <RichText
          tagName="p"
          className="embla-carousel__card-description"
          value={attributes.description}
          onChange={(val) => update({ description: val })}
          placeholder={__('Mô tả...', 'jankx')}
        />

        <div className="embla-carousel__card-footer">
          {attributes.metricValue ? (
            <div className="embla-carousel__card-metric">
              <span className="embla-carousel__card-metric-value">{attributes.metricValue}</span>
              <span className="embla-carousel__card-metric-label">{attributes.metricLabel}</span>
            </div>
          ) : (
            <span className="embla-carousel__card-ready">Ready</span>
          )}
          <span className="embla-carousel__card-action">{attributes.actionText}</span>
        </div>
      </div>
    </div>
  );
}
