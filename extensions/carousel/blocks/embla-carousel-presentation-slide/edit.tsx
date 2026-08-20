import React from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import {
  PanelBody,
  TextControl,
  TextareaControl,
  SelectControl,
  Button,
} from '@wordpress/components';
import type { PresentationSlideAttributes, PresentationSlideEditProps } from './types';

const LAYOUT_OPTIONS = [
  { label: __('Title', 'jankx'), value: 'title' },
  { label: __('Split', 'jankx'), value: 'split' },
  { label: __('Stats', 'jankx'), value: 'stats' },
  { label: __('Quote', 'jankx'), value: 'quote' },
  { label: __('Bullets', 'jankx'), value: 'bullets' },
];

const THEME_OPTIONS = [
  { label: __('Dark', 'jankx'), value: 'dark' },
  { label: __('Light', 'jankx'), value: 'light' },
  { label: __('Indigo', 'jankx'), value: 'indigo' },
  { label: __('Slate', 'jankx'), value: 'slate' },
  { label: __('Forest', 'jankx'), value: 'forest' },
];

export default function Edit({
  attributes,
  setAttributes,
}: PresentationSlideEditProps) {
  const blockProps = useBlockProps({
    className: `embla-carousel__slide embla-carousel__slide--presentation embla-carousel__slide--layout-${attributes.layout} embla-carousel__slide--theme-${attributes.theme}`,
  });

  const update = (updated: Partial<PresentationSlideAttributes>) => {
    setAttributes(updated);
  };

  const addBullet = () => {
    update({ bullets: [...(attributes.bullets || []), ''] });
  };

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...(attributes.bullets || [])];
    newBullets[index] = value;
    update({ bullets: newBullets });
  };

  const removeBullet = (index: number) => {
    const newBullets = (attributes.bullets || []).filter((_, i) => i !== index);
    update({ bullets: newBullets });
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Layout & Theme', 'jankx')}>
          <SelectControl
            label={__('Layout', 'jankx')}
            value={attributes.layout}
            options={LAYOUT_OPTIONS}
            onChange={(val) => update({ layout: val as any })}
          />
          <SelectControl
            label={__('Theme', 'jankx')}
            value={attributes.theme}
            options={THEME_OPTIONS}
            onChange={(val) => update({ theme: val as any })}
          />
        </PanelBody>

        <PanelBody title={__('Nội dung', 'jankx')} initialOpen={false}>
          <TextControl
            label={__('Presenter Notes', 'jankx')}
            value={attributes.presenterNotes}
            onChange={(val) => update({ presenterNotes: val })}
          />
        </PanelBody>
      </InspectorControls>

      {/* Editor Preview */}
      <div className="embla-carousel__presentation-editor">
        <div className="embla-carousel__presentation-header">
          <span className="embla-carousel__presentation-layout">{attributes.layout}</span>
        </div>

        <div className="embla-carousel__presentation-body">
          {attributes.layout === 'title' && (
            <div className="embla-carousel__presentation-title-layout">
              <RichText
                tagName="h2"
                className="embla-carousel__presentation-title"
                value={attributes.title}
                onChange={(val) => update({ title: val })}
                placeholder={__('Tiêu đề slide...', 'jankx')}
              />
              <RichText
                tagName="p"
                className="embla-carousel__presentation-subtitle"
                value={attributes.subtitle}
                onChange={(val) => update({ subtitle: val })}
                placeholder={__('Subtitle...', 'jankx')}
              />
            </div>
          )}

          {attributes.layout === 'stats' && (
            <div className="embla-carousel__presentation-stats-layout">
              <div className="embla-carousel__presentation-stat">
                <TextControl
                  value={attributes.statsNumber}
                  onChange={(val) => update({ statsNumber: val })}
                  placeholder="3.5x"
                />
                <TextControl
                  value={attributes.statsLabel}
                  onChange={(val) => update({ statsLabel: val })}
                  placeholder={__('Label', 'jankx')}
                />
              </div>
              <div className="embla-carousel__presentation-stat-content">
                <RichText
                  tagName="h2"
                  className="embla-carousel__presentation-title"
                  value={attributes.title}
                  onChange={(val) => update({ title: val })}
                  placeholder={__('Title...', 'jankx')}
                />
                <RichText
                  tagName="p"
                  className="embla-carousel__presentation-body-text"
                  value={attributes.bodyText}
                  onChange={(val) => update({ bodyText: val })}
                  placeholder={__('Body text...', 'jankx')}
                />
              </div>
            </div>
          )}

          {attributes.layout === 'bullets' && (
            <div className="embla-carousel__presentation-bullets-layout">
              <RichText
                tagName="h2"
                className="embla-carousel__presentation-title"
                value={attributes.title}
                onChange={(val) => update({ title: val })}
                placeholder={__('Title...', 'jankx')}
              />
              <ul className="embla-carousel__presentation-bullets-editor">
                {attributes.bullets?.map((item, i) => (
                  <li key={i} className="embla-carousel__presentation-bullet-editor">
                    <span className="embla-carousel__presentation-bullet-number">{i + 1}</span>
                    <TextControl
                      value={item}
                      onChange={(val) => updateBullet(i, val)}
                      placeholder={__('Bullet point...', 'jankx')}
                    />
                    <Button
                      isDestructive
                      isSmall
                      onClick={() => removeBullet(i)}
                    >
                      ×
                    </Button>
                  </li>
                ))}
              </ul>
              <Button variant="secondary" isSmall onClick={addBullet}>
                {__('+ Thêm bullet', 'jankx')}
              </Button>
            </div>
          )}

          {attributes.layout === 'quote' && (
            <div className="embla-carousel__presentation-quote-layout">
              <div className="embla-carousel__presentation-quote-icon">&ldquo;</div>
              <RichText
                tagName="blockquote"
                className="embla-carousel__presentation-quote"
                value={attributes.quoteText}
                onChange={(val) => update({ quoteText: val })}
                placeholder={__('Quote text...', 'jankx')}
              />
              <TextControl
                value={attributes.quoteAuthor}
                onChange={(val) => update({ quoteAuthor: val })}
                placeholder={__('Author', 'jankx')}
              />
              <TextControl
                value={attributes.quoteRole}
                onChange={(val) => update({ quoteRole: val })}
                placeholder={__('Role', 'jankx')}
              />
            </div>
          )}

          {attributes.layout === 'split' && (
            <div className="embla-carousel__presentation-split-layout">
              <div className="embla-carousel__presentation-split-left">
                <RichText
                  tagName="h2"
                  className="embla-carousel__presentation-title"
                  value={attributes.title}
                  onChange={(val) => update({ title: val })}
                  placeholder={__('Title...', 'jankx')}
                />
                <RichText
                  tagName="p"
                  className="embla-carousel__presentation-body-text"
                  value={attributes.bodyText}
                  onChange={(val) => update({ bodyText: val })}
                  placeholder={__('Body...', 'jankx')}
                />
              </div>
              <div className="embla-carousel__presentation-split-right">
                {attributes.bullets?.map((item, i) => (
                  <div key={i} className="embla-carousel__presentation-split-item-editor">
                    <TextControl
                      value={item}
                      onChange={(val) => updateBullet(i, val)}
                      placeholder={`Item ${i + 1}`}
                    />
                  </div>
                ))}
                <Button variant="secondary" isSmall onClick={addBullet}>
                  {__('+ Thêm item', 'jankx')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
