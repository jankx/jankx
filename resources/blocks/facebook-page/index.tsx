import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';
import './style.scss';

type Attributes = {
  href: string;
  tabs: string;
  width: number;
  hideCover: boolean;
  showFacepile: boolean;
  smallHeader: boolean;
  adaptContainerWidth: boolean;
  locale: string;
  className?: string;
};

const locales = [
  { label: 'Tiếng Việt (vi_VN)', value: 'vi_VN' },
  { label: 'English (en_US)', value: 'en_US' },
  { label: '日本語 (ja_JP)', value: 'ja_JP' },
  { label: '한국어 (ko_KR)', value: 'ko_KR' },
];

registerBlockType<Attributes>('jankx/facebook-page', {
  title: __('Facebook Page', 'jankx'),
  icon: 'share',
  category: 'jankx',
  attributes: {
    href: { type: 'string', default: '' },
    tabs: { type: 'string', default: 'timeline,events,messages' },
    width: { type: 'number', default: 380 },
    hideCover: { type: 'boolean', default: false },
    showFacepile: { type: 'boolean', default: true },
    smallHeader: { type: 'boolean', default: false },
    adaptContainerWidth: { type: 'boolean', default: true },
    locale: { type: 'string', default: 'vi_VN' },
    className: { type: 'string' },
  },
  edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'jankx-facebook-page' });
    const { href, tabs, width, hideCover, showFacepile, smallHeader, adaptContainerWidth, locale } = attributes;

    return (
      <div {...blockProps}>
        <InspectorControls>
          <PanelBody title={__('Cấu hình Page Plugin', 'jankx')} initialOpen={true}>
            <TextControl
              label={__('Facebook Page URL', 'jankx')}
              value={href}
              onChange={(v) => setAttributes({ href: v })}
              placeholder="https://www.facebook.com/YourPage"
            />
            <TextControl
              label={__('Tabs (CSV)', 'jankx')}
              help={__('Ví dụ: timeline,events,messages', 'jankx')}
              value={tabs}
              onChange={(v) => setAttributes({ tabs: v })}
            />
            <NumberControl
              label={__('Chiều rộng (px)', 'jankx')}
              value={width}
              onChange={(v: number | undefined) => setAttributes({ width: typeof v === 'number' ? v : 380 })}
              min={180}
              max={1200}
            />
            <SelectControl
              label={__('Ngôn ngữ SDK', 'jankx')}
              value={locale}
              options={locales}
              onChange={(v) => setAttributes({ locale: v })}
            />
            <ToggleControl
              label={__('Ẩn cover', 'jankx')}
              checked={hideCover}
              onChange={(v) => setAttributes({ hideCover: v })}
            />
            <ToggleControl
              label={__('Hiển thị bạn bè', 'jankx')}
              checked={showFacepile}
              onChange={(v) => setAttributes({ showFacepile: v })}
            />
            <ToggleControl
              label={__('Header nhỏ', 'jankx')}
              checked={smallHeader}
              onChange={(v) => setAttributes({ smallHeader: v })}
            />
            <ToggleControl
              label={__('Tự co theo container', 'jankx')}
              checked={adaptContainerWidth}
              onChange={(v) => setAttributes({ adaptContainerWidth: v })}
            />
          </PanelBody>
        </InspectorControls>

        <div className="fb-page-preview">
          <div
            className="fb-page"
            data-href={href || 'https://www.facebook.com/facebookapp'}
            data-tabs={tabs}
            data-width={String(width)}
            data-hide-cover={String(hideCover)}
            data-show-facepile={String(showFacepile)}
            data-small-header={String(smallHeader)}
            data-adapt-container-width={String(adaptContainerWidth)}
            data-locale={locale}
          />
        </div>
      </div>
    );
  },
  save({ attributes }) {
    const { href, tabs, width, hideCover, showFacepile, smallHeader, adaptContainerWidth, locale } = attributes;
    const blockProps = useBlockProps.save({ className: 'jankx-facebook-page' });

    return (
      <div {...blockProps}>
        <div
          className="fb-page"
          data-href={href}
          data-tabs={tabs}
          data-width={String(width)}
          data-hide-cover={String(hideCover)}
          data-show-facepile={String(showFacepile)}
          data-small-header={String(smallHeader)}
          data-adapt-container-width={String(adaptContainerWidth)}
          data-locale={locale}
        />
      </div>
    );
  },
});

