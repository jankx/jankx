import React from 'react';
import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  InspectorControls,
  InnerBlocks,
} from '@wordpress/block-editor';
import {
  PanelBody,
  ToggleControl,
  RangeControl,
  SelectControl,
  Button,
  ButtonGroup,
} from '@wordpress/components';
import type { EmblaCarouselAttributes, EmblaCarouselEditProps } from './types';

const VARIANT_OPTIONS = [
  { label: __('Banner', 'jankx'), value: 'banner' },
  { label: __('InnerBlocks', 'jankx'), value: 'inner-blocks' },
  { label: __('Presentation', 'jankx'), value: 'presentation' },
];

const TRANSITION_OPTIONS = [
  { label: __('Slide', 'jankx'), value: 'slide' },
  { label: __('Fade', 'jankx'), value: 'fade' },
  { label: __('Crossfade', 'jankx'), value: 'crossfade' },
];

const ALIGN_OPTIONS = [
  { label: __('Start', 'jankx'), value: 'start' },
  { label: __('Center', 'jankx'), value: 'center' },
  { label: __('End', 'jankx'), value: 'end' },
];

const ARROW_STYLE_OPTIONS = ['round', 'square', 'pill', 'minimal'] as const;
const DOT_TYPE_OPTIONS = ['bullets', 'bars', 'numbers', 'counter'] as const;
const ASPECT_RATIO_OPTIONS = ['16:9', '21:9', '4:3', 'auto'] as const;

const defaultAttributes: EmblaCarouselAttributes = {
  variant: 'banner',
  loop: true,
  align: 'center',
  dragFree: false,
  draggable: true,
  keyboardNavigation: true,
  parallaxDrag: true,
  transitionType: 'slide',
  duration: 25,
  autoplay: true,
  autoplayDelay: 4500,
  stopOnInteraction: true,
  stopOnMouseEnter: true,
  showArrows: true,
  arrowStyle: 'round',
  showDots: true,
  dotType: 'bullets',
  showProgress: true,
  slidesPerView: 3,
  gap: 20,
  aspectRatio: '16:9',
  kenBurns: true,
  showShadow: true,
  shadowIntensity: 3,
  borderRadius: 16,
};

const INNERBLOCKS_TEMPLATE = [
  ['jankx/embla-carousel-slide', {}],
];

const INNERBLOCKS_ALLOWED_BLOCKS = ['jankx/embla-carousel-slide'];

const INNERBLOCKS_CARDS_TEMPLATE = [
  ['jankx/embla-carousel-card', {}],
];

const INNERBLOCKS_CARDS_ALLOWED = ['jankx/embla-carousel-card'];

const INNERBLOCKS_PRESENTATION_TEMPLATE = [
  ['jankx/embla-carousel-presentation-slide', {}],
];

const INNERBLOCKS_PRESENTATION_ALLOWED = ['jankx/embla-carousel-presentation-slide'];

export default function Edit({
  attributes,
  setAttributes,
  clientId,
}: EmblaCarouselEditProps) {
  const blockProps = useBlockProps({
    className: 'wp-block-jankx-embla-carousel-editor',
  });

  const update = (updated: Partial<EmblaCarouselAttributes>) => {
    setAttributes(updated);
  };

  const resetDefaults = () => {
    setAttributes(defaultAttributes);
  };

  const getTemplate = () => {
    switch (attributes.variant) {
      case 'inner-blocks':
        return INNERBLOCKS_CARDS_TEMPLATE;
      case 'presentation':
        return INNERBLOCKS_PRESENTATION_TEMPLATE;
      default:
        return INNERBLOCKS_TEMPLATE;
    }
  };

  const getAllowedBlocks = () => {
    switch (attributes.variant) {
      case 'inner-blocks':
        return INNERBLOCKS_CARDS_ALLOWED;
      case 'presentation':
        return INNERBLOCKS_PRESENTATION_ALLOWED;
      default:
        return INNERBLOCKS_ALLOWED_BLOCKS;
    }
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        {/* Variant Selector */}
        <PanelBody title={__('Loại Carousel', 'jankx')} initialOpen>
          <div className="jankx-carousel-variant-selector">
            {VARIANT_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={
                  attributes.variant === opt.value ? 'primary' : 'secondary'
                }
                onClick={() => update({ variant: opt.value as any })}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </PanelBody>

        {/* Embla Core Settings */}
        <PanelBody title={__('Cơ chế cuộn', 'jankx')} initialOpen={false}>
          <ToggleControl
            label={__('Lặp vô tận (Loop)', 'jankx')}
            checked={attributes.loop}
            onChange={(val) => update({ loop: val })}
          />
          <ToggleControl
            label={__('Kéo vuốt (Draggable)', 'jankx')}
            checked={attributes.draggable}
            onChange={(val) => update({ draggable: val })}
          />
          <ToggleControl
            label={__('Điều hướng bàn phím', 'jankx')}
            checked={attributes.keyboardNavigation}
            onChange={(val) => update({ keyboardNavigation: val })}
          />
          <ToggleControl
            label={__('Hiệu ứng Parallax', 'jankx')}
            checked={attributes.parallaxDrag}
            onChange={(val) => update({ parallaxDrag: val })}
          />
          <ToggleControl
            label={__('Kéo tự do (Drag Free)', 'jankx')}
            checked={attributes.dragFree}
            onChange={(val) => update({ dragFree: val })}
          />
          <SelectControl
            label={__('Hiệu ứng chuyển slide', 'jankx')}
            value={attributes.transitionType}
            options={TRANSITION_OPTIONS}
            onChange={(val) => update({ transitionType: val as any })}
          />
          <SelectControl
            label={__('Căn lề', 'jankx')}
            value={attributes.align}
            options={ALIGN_OPTIONS}
            onChange={(val) => update({ align: val as any })}
          />
        </PanelBody>

        {/* Autoplay */}
        <PanelBody title={__('Tự động cuộn', 'jankx')} initialOpen={false}>
          <ToggleControl
            label={__('Bật autoplay', 'jankx')}
            checked={attributes.autoplay}
            onChange={(val) => update({ autoplay: val })}
          />
          {attributes.autoplay && (
            <>
              <RangeControl
                label={__('Tốc độ chuyển slide (ms)', 'jankx')}
                value={attributes.autoplayDelay}
                onChange={(val) => update({ autoplayDelay: val ?? 4500 })}
                min={1000}
                max={10000}
                step={250}
              />
              <div className="jankx-carousel-presets">
                {[2000, 3500, 5000, 8000].map((ms) => (
                  <Button
                    key={ms}
                    variant={
                      attributes.autoplayDelay === ms ? 'primary' : 'secondary'
                    }
                    isSmall
                    onClick={() => update({ autoplayDelay: ms })}
                  >
                    {ms / 1000}s
                  </Button>
                ))}
              </div>
              <ToggleControl
                label={__('Tạm dừng khi rê chuột', 'jankx')}
                checked={attributes.stopOnMouseEnter}
                onChange={(val) => update({ stopOnMouseEnter: val })}
              />
              <ToggleControl
                label={__('Dừng khi tương tác', 'jankx')}
                checked={attributes.stopOnInteraction}
                onChange={(val) => update({ stopOnInteraction: val })}
              />
            </>
          )}
        </PanelBody>

        {/* Navigation */}
        <PanelBody title={__('Điều hướng', 'jankx')} initialOpen={false}>
          <ToggleControl
            label={__('Hiển thị mũi tên', 'jankx')}
            checked={attributes.showArrows}
            onChange={(val) => update({ showArrows: val })}
          />
          {attributes.showArrows && (
            <div className="jankx-carousel-btn-group">
              <span className="jankx-carousel-label">{__('Kiểu mũi tên:', 'jankx')}</span>
              <ButtonGroup>
                {ARROW_STYLE_OPTIONS.map((style) => (
                  <Button
                    key={style}
                    variant={
                      attributes.arrowStyle === style ? 'primary' : 'secondary'
                    }
                    isSmall
                    onClick={() => update({ arrowStyle: style })}
                  >
                    {style}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          )}
          <ToggleControl
            label={__('Chấm phân trang', 'jankx')}
            checked={attributes.showDots}
            onChange={(val) => update({ showDots: val })}
          />
          {attributes.showDots && (
            <div className="jankx-carousel-btn-group">
              <span className="jankx-carousel-label">{__('Kiểu chấm:', 'jankx')}</span>
              <ButtonGroup>
                {DOT_TYPE_OPTIONS.map((type) => (
                  <Button
                    key={type}
                    variant={
                      attributes.dotType === type ? 'primary' : 'secondary'
                    }
                    isSmall
                    onClick={() => update({ dotType: type })}
                  >
                    {type}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          )}
          <ToggleControl
            label={__('Thanh tiến trình', 'jankx')}
            checked={attributes.showProgress}
            onChange={(val) => update({ showProgress: val })}
          />
        </PanelBody>

        {/* Shadow & Radius */}
        <PanelBody title={__('Đổ bóng & Bo góc', 'jankx')} initialOpen={false}>
          <ToggleControl
            label={__('Đổ bóng', 'jankx')}
            checked={attributes.showShadow}
            onChange={(val) => update({ showShadow: val })}
          />
          {attributes.showShadow && (
            <RangeControl
              label={__('Độ đậm bóng (1-5)', 'jankx')}
              value={attributes.shadowIntensity}
              onChange={(val) => update({ shadowIntensity: val ?? 3 })}
              min={1}
              max={5}
            />
          )}
          <RangeControl
            label={__('Bo góc (px)', 'jankx')}
            value={attributes.borderRadius}
            onChange={(val) => update({ borderRadius: val ?? 16 })}
            min={0}
            max={40}
            step={2}
          />
        </PanelBody>

        {/* Variant-specific: Banner */}
        {attributes.variant === 'banner' && (
          <PanelBody title={__('Banner & Hiệu ứng', 'jankx')} initialOpen={false}>
            <div className="jankx-carousel-btn-group">
              <span className="jankx-carousel-label">{__('Tỷ lệ khung hình:', 'jankx')}</span>
              <ButtonGroup>
                {ASPECT_RATIO_OPTIONS.map((ratio) => (
                  <Button
                    key={ratio}
                    variant={
                      attributes.aspectRatio === ratio ? 'primary' : 'secondary'
                    }
                    isSmall
                    onClick={() => update({ aspectRatio: ratio })}
                  >
                    {ratio}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
            <ToggleControl
              label={__('Ken Burns effect', 'jankx')}
              checked={attributes.kenBurns}
              onChange={(val) => update({ kenBurns: val })}
            />
          </PanelBody>
        )}

        {/* Variant-specific: InnerBlocks */}
        {attributes.variant === 'inner-blocks' && (
          <PanelBody title={__('Cột & Khoảng cách', 'jankx')} initialOpen={false}>
            <RangeControl
              label={__('Số cột hiển thị', 'jankx')}
              value={attributes.slidesPerView}
              onChange={(val) => update({ slidesPerView: val ?? 3 })}
              min={1}
              max={4}
            />
            <RangeControl
              label={__('Khoảng cách (px)', 'jankx')}
              value={attributes.gap}
              onChange={(val) => update({ gap: val ?? 20 })}
              min={0}
              max={48}
              step={4}
            />
          </PanelBody>
        )}

        {/* Reset */}
        <PanelBody title={__('Khôi phục', 'jankx')} initialOpen={false}>
          <Button variant="secondary" onClick={resetDefaults}>
            {__('Khôi phục mặc định', 'jankx')}
          </Button>
        </PanelBody>
      </InspectorControls>

      {/* Editor Preview */}
      <div className="jankx-carousel-editor-preview">
        <div className="jankx-carousel-preview-header">
          <span className="jankx-carousel-badge">{attributes.variant}</span>
        </div>
        <InnerBlocks
          template={getTemplate()}
          allowedBlocks={getAllowedBlocks()}
          templateLock={false}
        />
      </div>
    </div>
  );
}
