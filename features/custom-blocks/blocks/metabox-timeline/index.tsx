import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  InnerBlocks,
  RichText,
  InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
// @ts-ignore
import blockJson from './block.json';

// Main metabox timeline block: provides editor template
registerBlockType(blockJson.name, {
  edit() {
    const blockProps = useBlockProps({
      className: 'jankx-metabox-timeline-editor',
    });
    // Template: header and items wrapper with default children
    const TEMPLATE: any[] = [
      ['jankx/timelime-header', {}],
      [
        'jankx/timelime-items',
        {},
        [
          ['jankx/timelime-time', { placeholder: __('Thời gian', 'jankx') }],
          ['jankx/timelime-title', { placeholder: __('Tiêu đề', 'jankx') }],
          [
            'jankx/timelime-description',
            { placeholder: __('Mô tả', 'jankx') },
          ],
        ],
      ],
    ];
    return (
      <div {...blockProps}>
        <InspectorControls>
          <PanelBody title={__('Cấu hình', 'jankx')} initialOpen={true} />
        </InspectorControls>
        <InnerBlocks
          allowedBlocks={['jankx/timelime-header', 'jankx/timelime-items']}
          template={TEMPLATE}
          templateLock={false}
        />
      </div>
    );
  },
  save() {
    return null;
  },
});

// Header block: allow heading, image, svg icon
registerBlockType('jankx/timelime-header', {
  title: __('Timeline Header', 'jankx'),
  category: 'jankx',
  icon: 'heading',
  supports: {
    html: false,
    color: { text: true, background: true, gradients: true },
    typography: {
      fontSize: true,
      lineHeight: true,
      fontStyle: true,
      fontWeight: true,
      textDecoration: true,
      textTransform: true,
      letterSpacing: true,
    },
    spacing: { margin: true, padding: true },
    border: { style: true, color: true, width: true, radius: true },
  },
  edit() {
    const blockProps = useBlockProps({
      className: 'jankx-timelime-header',
    });
    return (
      <div {...blockProps}>
        <InnerBlocks
          allowedBlocks={['core/heading', 'core/image', 'jankx/svg-icon']}
          templateLock={false}
        />
      </div>
    );
  },
  save() {
    return <InnerBlocks.Content />;
  },
});

// Items wrapper: allow time/title/description children
registerBlockType('jankx/timelime-items', {
  title: __('Timeline Items', 'jankx'),
  category: 'jankx',
  icon: 'list-view',
  supports: {
    html: false,
    spacing: { margin: true, padding: true },
    border: { style: true, color: true, width: true, radius: true },
    color: { background: true },
  },
  edit() {
    const blockProps = useBlockProps({
      className: 'jankx-timelime-items',
    });
    return (
      <div {...blockProps}>
        <InnerBlocks
          allowedBlocks={[
            'jankx/timelime-time',
            'jankx/timelime-title',
            'jankx/timelime-description',
          ]}
          renderAppender={InnerBlocks.ButtonBlockAppender}
          templateLock={false}
        />
      </div>
    );
  },
  save() {
    return <InnerBlocks.Content />;
  },
});

// Leaf: time
registerBlockType('jankx/timelime-time', {
  title: __('Timeline Time', 'jankx'),
  category: 'jankx',
  icon: 'clock',
  attributes: {
    content: { type: 'string', source: 'text', selector: 'p' },
    placeholder: { type: 'string', default: '' },
  },
  supports: {
    html: false,
    color: { text: true, background: true },
    typography: {
      fontSize: true,
      lineHeight: true,
      fontStyle: true,
      fontWeight: true,
      letterSpacing: true,
      textTransform: true,
    },
    spacing: { margin: true, padding: true },
    border: { style: true, color: true, width: true, radius: true },
  },
  edit({ attributes, setAttributes }: any) {
    const blockProps = useBlockProps({
      className: 'jankx-timelime-time',
    });
    return (
      <RichText
        {...blockProps}
        tagName="p"
        value={attributes.content}
        onChange={(val: string) => setAttributes({ content: val })}
        placeholder={attributes.placeholder || __('Thời gian', 'jankx')}
      />
    );
  },
  save({ attributes }: any) {
    const blockProps = useBlockProps.save({ className: 'jankx-timelime-time' });
    return (
      <RichText.Content
        {...blockProps}
        tagName="p"
        value={attributes.content}
      />
    );
  },
});

// Leaf: title
registerBlockType('jankx/timelime-title', {
  title: __('Timeline Title', 'jankx'),
  category: 'jankx',
  icon: 'text',
  attributes: {
    content: { type: 'string', source: 'text', selector: 'h4' },
    placeholder: { type: 'string', default: '' },
  },
  supports: {
    html: false,
    color: { text: true, background: true },
    typography: {
      fontSize: true,
      lineHeight: true,
      fontStyle: true,
      fontWeight: true,
      letterSpacing: true,
      textTransform: true,
    },
    spacing: { margin: true, padding: true },
    border: { style: true, color: true, width: true, radius: true },
  },
  edit({ attributes, setAttributes }: any) {
    const blockProps = useBlockProps({
      className: 'jankx-timelime-title',
    });
    return (
      <RichText
        {...blockProps}
        tagName="h4"
        value={attributes.content}
        onChange={(val: string) => setAttributes({ content: val })}
        placeholder={attributes.placeholder || __('Tiêu đề', 'jankx')}
      />
    );
  },
  save({ attributes }: any) {
    const blockProps = useBlockProps.save({
      className: 'jankx-timelime-title',
    });
    return (
      <RichText.Content
        {...blockProps}
        tagName="h4"
        value={attributes.content}
      />
    );
  },
});

// Leaf: description
registerBlockType('jankx/timelime-description', {
  title: __('Timeline Description', 'jankx'),
  category: 'jankx',
  icon: 'editor-paragraph',
  attributes: {
    content: { type: 'string', source: 'html', selector: 'p' },
    placeholder: { type: 'string', default: '' },
  },
  supports: {
    html: false,
    color: { text: true, background: true },
    typography: {
      fontSize: true,
      lineHeight: true,
      fontStyle: true,
      fontWeight: true,
      letterSpacing: true,
    },
    spacing: { margin: true, padding: true },
    border: { style: true, color: true, width: true, radius: true },
  },
  edit({ attributes, setAttributes }: any) {
    const blockProps = useBlockProps({
      className: 'jankx-timelime-description',
    });
    return (
      <RichText
        {...blockProps}
        tagName="p"
        value={attributes.content}
        onChange={(val: string) => setAttributes({ content: val })}
        placeholder={attributes.placeholder || __('Mô tả', 'jankx')}
      />
    );
  },
  save({ attributes }: any) {
    const blockProps = useBlockProps.save({
      className: 'jankx-timelime-description',
    });
    return (
      <RichText.Content
        {...blockProps}
        tagName="p"
        value={attributes.content}
      />
    );
  },
});

