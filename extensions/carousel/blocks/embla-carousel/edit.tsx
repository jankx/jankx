import React, { useCallback } from 'react';
import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  InspectorControls,
  InnerBlocks,
  ColorPalette,
} from '@wordpress/block-editor';
import { useDispatch, select as wpSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {
  PanelBody,
  PanelRow,
  ToggleControl,
  RangeControl,
  SelectControl,
  Button,
  ButtonGroup,
} from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import type { EmblaCarouselAttributes, EmblaCarouselEditProps } from './types';

type CarouselVariant = 'banner' | 'inner-blocks' | 'presentation';

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

const VARIANT_CHILD_BLOCK: Record<CarouselVariant, string> = {
  banner: 'jankx/embla-carousel-slide',
  'inner-blocks': 'jankx/embla-carousel-card',
  presentation: 'jankx/embla-carousel-presentation-slide',
};

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
  arrowSize: 44,
  arrowBgColor: '#000000',
  arrowBgOpacity: 40,
  arrowColor: '#ffffff',
  arrowBorderColor: '#ffffff',
  arrowBorderOpacity: 20,
  showDots: true,
  dotType: 'bullets',
  dotSize: 8,
  dotColor: '#000000',
  dotColorOpacity: 20,
  dotActiveColor: '#1e293b',
  dotActiveWidth: 24,
  showProgress: true,
  progressHeight: 4,
  progressTrackColor: '#ffffff',
  progressTrackOpacity: 20,
  progressBarColor: '#16a34a',
  slidesPerView: 3,
  gap: 20,
  aspectRatio: '16:9',
  kenBurns: true,
  showShadow: true,
  shadowIntensity: 3,
  shadowColor: '#0f172a',
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

function mapAttributes(
  fromType: string,
  toType: string,
  attrs: Record<string, any>
): Record<string, any> {
  // Banner → Card
  if (fromType === 'jankx/embla-carousel-slide' && toType === 'jankx/embla-carousel-card') {
    return {
      category: 'KHỐI',
      title: attrs.title || '',
      description: attrs.subtitle || '',
      badgeText: attrs.badge || '',
      metricValue: '',
      metricLabel: '',
      actionText: attrs.ctaText || 'Chi tiết',
      cardColor: 'slate',
    };
  }
  // Banner → Presentation
  if (fromType === 'jankx/embla-carousel-slide' && toType === 'jankx/embla-carousel-presentation-slide') {
    return {
      layout: 'title',
      title: attrs.title || '',
      subtitle: attrs.subtitle || '',
      bodyText: '',
      bullets: [],
      statsNumber: '',
      statsLabel: '',
      quoteText: '',
      quoteAuthor: '',
      quoteRole: '',
      theme: 'dark',
      presenterNotes: '',
    };
  }
  // Card → Banner
  if (fromType === 'jankx/embla-carousel-card' && toType === 'jankx/embla-carousel-slide') {
    return {
      imageUrl: '',
      imageAlt: '',
      badge: attrs.badgeText || '',
      title: attrs.title || '',
      subtitle: attrs.description || '',
      ctaText: attrs.actionText || '',
      ctaLink: '#',
      overlayOpacity: 50,
      textAlignment: 'left',
    };
  }
  // Card → Presentation
  if (fromType === 'jankx/embla-carousel-card' && toType === 'jankx/embla-carousel-presentation-slide') {
    return {
      layout: 'title',
      title: attrs.title || '',
      subtitle: '',
      bodyText: attrs.description || '',
      bullets: [],
      statsNumber: attrs.metricValue || '',
      statsLabel: attrs.metricLabel || '',
      quoteText: '',
      quoteAuthor: '',
      quoteRole: '',
      theme: 'dark',
      presenterNotes: '',
    };
  }
  // Presentation → Banner
  if (fromType === 'jankx/embla-carousel-presentation-slide' && toType === 'jankx/embla-carousel-slide') {
    return {
      imageUrl: '',
      imageAlt: '',
      badge: '',
      title: attrs.title || '',
      subtitle: attrs.subtitle || '',
      ctaText: '',
      ctaLink: '#',
      overlayOpacity: 50,
      textAlignment: 'left',
    };
  }
  // Presentation → Card
  if (fromType === 'jankx/embla-carousel-presentation-slide' && toType === 'jankx/embla-carousel-card') {
    return {
      category: 'KHỐI',
      title: attrs.title || '',
      description: attrs.bodyText || attrs.subtitle || '',
      badgeText: '',
      metricValue: attrs.statsNumber || '',
      metricLabel: attrs.statsLabel || '',
      actionText: 'Chi tiết',
      cardColor: 'slate',
    };
  }
  return attrs;
}

export default function Edit({
  attributes,
  setAttributes,
  clientId,
}: EmblaCarouselEditProps) {
  const blockProps = useBlockProps({
    className: 'wp-block-jankx-embla-carousel-editor',
  });

  const { replaceBlock } = useDispatch(blockEditorStore);

  const update = (updated: Partial<EmblaCarouselAttributes>) => {
    setAttributes(updated);
  };

  const handleVariantChange = useCallback(
    (newVariant: CarouselVariant) => {
      const oldVariant = attributes.variant;
      if (oldVariant === newVariant) return;

      const newChildType = VARIANT_CHILD_BLOCK[newVariant];

      // Get inner blocks directly from store (avoids useSelect re-render issues)
      const store = wpSelect(blockEditorStore);
      const block = store.getBlock(clientId);
      const innerBlocks = block?.innerBlocks || [];

      // Transform each inner block
      innerBlocks.forEach((childBlock: any) => {
        if (!childBlock || !childBlock.name || !childBlock.clientId) return;
        const oldType = childBlock.name;
        if (oldType === newChildType) return;

        const mappedAttrs = mapAttributes(oldType, newChildType, childBlock.attributes || {});
        const newBlock = createBlock(newChildType, mappedAttrs);
        replaceBlock(childBlock.clientId, newBlock);
      });

      update({ variant: newVariant });
    },
    [attributes.variant, clientId, replaceBlock]
  );

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
                onClick={() => handleVariantChange(opt.value as CarouselVariant)}
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

        {/* Arrow Styles */}
        <PanelBody title={__('Mũi tên', 'jankx')} initialOpen={false}>
          <ToggleControl
            label={__('Hiển thị mũi tên', 'jankx')}
            checked={attributes.showArrows}
            onChange={(val) => update({ showArrows: val })}
          />
          {attributes.showArrows && (
            <>
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
              <RangeControl
                label={__('Kích thước (px)', 'jankx')}
                value={attributes.arrowSize}
                onChange={(val) => update({ arrowSize: val ?? 44 })}
                min={28}
                max={72}
                step={2}
              />
              <PanelRow>
                <span className="jankx-carousel-label">{__('Màu nền:', 'jankx')}</span>
                <ColorPalette
                  value={attributes.arrowBgColor}
                  onChange={(val) => update({ arrowBgColor: val ?? '#000000' })}
                  disableCustomColors={false}
                />
              </PanelRow>
              <RangeControl
                label={__('Độ trong suốt nền (%)', 'jankx')}
                value={attributes.arrowBgOpacity}
                onChange={(val) => update({ arrowBgOpacity: val ?? 40 })}
                min={0}
                max={100}
              />
              <PanelRow>
                <span className="jankx-carousel-label">{__('Màu biểu tượng:', 'jankx')}</span>
                <ColorPalette
                  value={attributes.arrowColor}
                  onChange={(val) => update({ arrowColor: val ?? '#ffffff' })}
                  disableCustomColors={false}
                />
              </PanelRow>
              <PanelRow>
                <span className="jankx-carousel-label">{__('Màu viền:', 'jankx')}</span>
                <ColorPalette
                  value={attributes.arrowBorderColor}
                  onChange={(val) => update({ arrowBorderColor: val ?? '#ffffff' })}
                  disableCustomColors={false}
                />
              </PanelRow>
              <RangeControl
                label={__('Độ trong suốt viền (%)', 'jankx')}
                value={attributes.arrowBorderOpacity}
                onChange={(val) => update({ arrowBorderOpacity: val ?? 20 })}
                min={0}
                max={100}
              />
            </>
          )}
        </PanelBody>

        {/* Dot Styles */}
        <PanelBody title={__('Chấm phân trang', 'jankx')} initialOpen={false}>
          <ToggleControl
            label={__('Chấm phân trang', 'jankx')}
            checked={attributes.showDots}
            onChange={(val) => update({ showDots: val })}
          />
          {attributes.showDots && (
            <>
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
              {attributes.dotType !== 'counter' && (
                <>
                  <RangeControl
                    label={__('Kích thước (px)', 'jankx')}
                    value={attributes.dotSize}
                    onChange={(val) => update({ dotSize: val ?? 8 })}
                    min={4}
                    max={16}
                  />
                  <PanelRow>
                    <span className="jankx-carousel-label">{__('Màuinactive:', 'jankx')}</span>
                    <ColorPalette
                      value={attributes.dotColor}
                      onChange={(val) => update({ dotColor: val ?? '#000000' })}
                      disableCustomColors={false}
                    />
                  </PanelRow>
                  <RangeControl
                    label={__('Độ trong suốt inactive (%)', 'jankx')}
                    value={attributes.dotColorOpacity}
                    onChange={(val) => update({ dotColorOpacity: val ?? 20 })}
                    min={0}
                    max={100}
                  />
                  <PanelRow>
                    <span className="jankx-carousel-label">{__('Màu active:', 'jankx')}</span>
                    <ColorPalette
                      value={attributes.dotActiveColor}
                      onChange={(val) => update({ dotActiveColor: val ?? '#1e293b' })}
                      disableCustomColors={false}
                    />
                  </PanelRow>
                  {(attributes.dotType === 'bullets' || attributes.dotType === 'bars') && (
                    <RangeControl
                      label={__('Độ rộng active (px)', 'jankx')}
                      value={attributes.dotActiveWidth}
                      onChange={(val) => update({ dotActiveWidth: val ?? 24 })}
                      min={12}
                      max={48}
                    />
                  )}
                </>
              )}
            </>
          )}
        </PanelBody>

        {/* Progress Bar */}
        <PanelBody title={__('Thanh tiến trình', 'jankx')} initialOpen={false}>
          <ToggleControl
            label={__('Thanh tiến trình', 'jankx')}
            checked={attributes.showProgress}
            onChange={(val) => update({ showProgress: val })}
          />
          {attributes.showProgress && (
            <>
              <RangeControl
                label={__('Chiều cao (px)', 'jankx')}
                value={attributes.progressHeight}
                onChange={(val) => update({ progressHeight: val ?? 4 })}
                min={2}
                max={12}
              />
              <PanelRow>
                <span className="jankx-carousel-label">{__('Màu track:', 'jankx')}</span>
                <ColorPalette
                  value={attributes.progressTrackColor}
                  onChange={(val) => update({ progressTrackColor: val ?? '#ffffff' })}
                  disableCustomColors={false}
                />
              </PanelRow>
              <RangeControl
                label={__('Độ trong suốt track (%)', 'jankx')}
                value={attributes.progressTrackOpacity}
                onChange={(val) => update({ progressTrackOpacity: val ?? 20 })}
                min={0}
                max={100}
              />
              <PanelRow>
                <span className="jankx-carousel-label">{__('Màu progress:', 'jankx')}</span>
                <ColorPalette
                  value={attributes.progressBarColor}
                  onChange={(val) => update({ progressBarColor: val ?? '#16a34a' })}
                  disableCustomColors={false}
                />
              </PanelRow>
            </>
          )}
        </PanelBody>

        {/* Shadow & Radius */}
        <PanelBody title={__('Đổ bóng & Bo góc', 'jankx')} initialOpen={false}>
          <ToggleControl
            label={__('Đổ bóng', 'jankx')}
            checked={attributes.showShadow}
            onChange={(val) => update({ showShadow: val })}
          />
          {attributes.showShadow && (
            <>
              <RangeControl
                label={__('Độ đậm bóng (1-5)', 'jankx')}
                value={attributes.shadowIntensity}
                onChange={(val) => update({ shadowIntensity: val ?? 3 })}
                min={1}
                max={5}
              />
              <PanelRow>
                <span className="jankx-carousel-label">{__('Màu bóng:', 'jankx')}</span>
                <ColorPalette
                  value={attributes.shadowColor}
                  onChange={(val) => update({ shadowColor: val ?? '#0f172a' })}
                  disableCustomColors={false}
                />
              </PanelRow>
            </>
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
