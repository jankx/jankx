import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl } from '@wordpress/components';
import metadata from './block.json';

interface Attributes {
  align?: 'center' | 'wide' | 'full';
  postType: string;
  postsToShow: number;
  offset: number;
  order: 'asc' | 'desc';
  orderBy: string;
  ignoreStickyPosts: boolean;
  showAllPosts: boolean;
}

const Edit = ({ attributes, setAttributes }: { attributes: Attributes; setAttributes: (a: Partial<Attributes>) => void; }) => {
  const { postType = 'post', postsToShow = 5, offset = 0, order = 'desc', orderBy = 'date', ignoreStickyPosts = true, showAllPosts = false } = attributes;
  const blockProps = useBlockProps({ className: 'jankx-advanced-posts' });

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Query', 'jankx')}>
          <SelectControl
            label={__('Post Type', 'jankx')}
            value={postType}
            options={[
              { label: __('Posts', 'jankx'), value: 'post' },
              { label: __('Pages', 'jankx'), value: 'page' },
            ]}
            onChange={(value) => setAttributes({ postType: value })}
          />
          <RangeControl
            label={__('Posts to show', 'jankx')}
            min={1}
            max={24}
            value={postsToShow}
            onChange={(value?: number) => setAttributes({ postsToShow: value || 1 })}
          />
          <RangeControl
            label={__('Offset', 'jankx')}
            min={0}
            max={100}
            value={offset}
            onChange={(value?: number) => setAttributes({ offset: value || 0 })}
          />
          <SelectControl
            label={__('Order', 'jankx')}
            value={order}
            options={[
              { label: __('Descending', 'jankx'), value: 'desc' },
              { label: __('Ascending', 'jankx'), value: 'asc' },
            ]}
            onChange={(value) => setAttributes({ order: value as Attributes['order'] })}
          />
          <SelectControl
            label={__('Order by', 'jankx')}
            value={orderBy}
            options={[
              { label: __('Date', 'jankx'), value: 'date' },
              { label: __('Title', 'jankx'), value: 'title' },
              { label: __('Menu order', 'jankx'), value: 'menu_order' },
            ]}
            onChange={(value) => setAttributes({ orderBy: value })}
          />
          <ToggleControl
            label={__('Ignore sticky posts', 'jankx')}
            checked={ignoreStickyPosts}
            onChange={(value) => setAttributes({ ignoreStickyPosts: value })}
          />
          <ToggleControl
            label={__('Show all posts (disable pagination)', 'jankx')}
            checked={showAllPosts}
            onChange={(value) => setAttributes({ showAllPosts: value })}
          />
        </PanelBody>
      </InspectorControls>
      <div className="jankx-advanced-posts__placeholder">
        {__('Posts will render on the frontend.', 'jankx')}
      </div>
    </div>
  );
};

const Save = () => null;

registerBlockType(metadata as any, {
  edit: Edit as any,
  save: Save as any,
});
