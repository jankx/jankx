import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, RangeControl, ToggleControl } from '@wordpress/components';
import { InspectorGroups, InspectorToolsPanelItem, CommonPanels } from '../../shared/components';
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

  const resetAll = () => {
    setAttributes({
      postType: 'post',
      postsToShow: 5,
      offset: 0,
      order: 'desc',
      orderBy: 'date',
      ignoreStickyPosts: true,
      showAllPosts: false
    });
  };

  return (
    <div {...blockProps}>
      <InspectorGroups.Settings useToolsPanel={true} resetAll={resetAll}>
        <InspectorToolsPanelItem
          label={__('Post Type', 'jankx')}
          isShownByDefault={true}
          hasValue={() => postType !== 'post'}
          onDeselect={() => setAttributes({ postType: 'post' })}
        >
          <SelectControl
            label={__('Post Type', 'jankx')}
            value={postType}
            options={[
              { label: __('Posts', 'jankx'), value: 'post' },
              { label: __('Pages', 'jankx'), value: 'page' },
            ]}
            onChange={(value) => setAttributes({ postType: value })}
          />
        </InspectorToolsPanelItem>

        <InspectorToolsPanelItem
          label={__('Posts to show', 'jankx')}
          isShownByDefault={true}
          hasValue={() => postsToShow !== 5}
          onDeselect={() => setAttributes({ postsToShow: 5 })}
        >
          <RangeControl
            label={__('Posts to show', 'jankx')}
            min={1}
            max={24}
            value={postsToShow}
            onChange={(value?: number) => setAttributes({ postsToShow: value || 1 })}
          />
        </InspectorToolsPanelItem>

        <InspectorToolsPanelItem
          label={__('Offset', 'jankx')}
          isShownByDefault={false}
          hasValue={() => offset !== 0}
          onDeselect={() => setAttributes({ offset: 0 })}
        >
          <RangeControl
            label={__('Offset', 'jankx')}
            min={0}
            max={100}
            value={offset}
            onChange={(value?: number) => setAttributes({ offset: value || 0 })}
          />
        </InspectorToolsPanelItem>

        <InspectorToolsPanelItem
          label={__('Order', 'jankx')}
          isShownByDefault={false}
          hasValue={() => order !== 'desc'}
          onDeselect={() => setAttributes({ order: 'desc' })}
        >
          <SelectControl
            label={__('Order', 'jankx')}
            value={order}
            options={[
              { label: __('Descending', 'jankx'), value: 'desc' },
              { label: __('Ascending', 'jankx'), value: 'asc' },
            ]}
            onChange={(value) => setAttributes({ order: value as Attributes['order'] })}
          />
        </InspectorToolsPanelItem>

        <InspectorToolsPanelItem
          label={__('Order by', 'jankx')}
          isShownByDefault={false}
          hasValue={() => orderBy !== 'date'}
          onDeselect={() => setAttributes({ orderBy: 'date' })}
        >
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
        </InspectorToolsPanelItem>

        <InspectorToolsPanelItem
          label={__('Ignore sticky posts', 'jankx')}
          isShownByDefault={false}
          hasValue={() => !ignoreStickyPosts}
          onDeselect={() => setAttributes({ ignoreStickyPosts: true })}
        >
          <ToggleControl
            label={__('Ignore sticky posts', 'jankx')}
            checked={ignoreStickyPosts}
            onChange={(value) => setAttributes({ ignoreStickyPosts: value })}
          />
        </InspectorToolsPanelItem>

        <InspectorToolsPanelItem
          label={__('Show all posts', 'jankx')}
          isShownByDefault={false}
          hasValue={() => showAllPosts}
          onDeselect={() => setAttributes({ showAllPosts: false })}
        >
          <ToggleControl
            label={__('Show all posts (disable pagination)', 'jankx')}
            checked={showAllPosts}
            onChange={(value) => setAttributes({ showAllPosts: value })}
          />
        </InspectorToolsPanelItem>
      </InspectorGroups.Settings>

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
