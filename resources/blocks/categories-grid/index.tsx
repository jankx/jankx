import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { RangeControl, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { InspectorGroups, InspectorToolsPanelItem, CommonPanels } from '../../shared/components';
import metadata from './block.json';

interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

interface Attributes {
  catsPerRow: number;
  productCategories: Category[];
}

const Edit = ({ attributes, setAttributes }: { attributes: Attributes; setAttributes: (a: Partial<Attributes>) => void; }) => {
  const { catsPerRow = 3, productCategories = [] } = attributes;

  const blockProps = useBlockProps({
    style: {
      '--categories-per-row': catsPerRow,
    },
  });

  const categories = useSelect((select) => {
    const { getEntityRecords } = select('core');
    return getEntityRecords('taxonomy', 'product_cat', {
      per_page: 99,
      hide_empty: true,
      fields: 'id=>name',
    });
  }, []);

  const selectedIds = (productCategories || []).map((cat) => cat.id);

  const categoryOptions = categories
    ? categories.map((cat) => ({
      label: cat.name,
      value: String(cat.id),
    }))
    : [];

  const handleChange = (selected: string[]) => {
    const selectedArray = selected.map((id) => {
      const name =
        categoryOptions.find((opt) => {
          return parseInt(opt.value) === parseInt(id);
        })?.label || '';

      return { id, name };
    });

    setAttributes({ productCategories: selectedArray });
  };

  const resetAll = () => {
    setAttributes({
      catsPerRow: 3,
      productCategories: []
    });
  };

  return (
    <div {...blockProps}>
      <InspectorGroups.Settings useToolsPanel={true} resetAll={resetAll}>
        <InspectorToolsPanelItem
          label={__('Categories per row', 'jankx')}
          isShownByDefault={true}
          hasValue={() => catsPerRow !== 3}
          onDeselect={() => setAttributes({ catsPerRow: 3 })}
        >
          <RangeControl
            label={__('Categories per row', 'jankx')}
            value={catsPerRow}
            onChange={(value) => setAttributes({ catsPerRow: value || 3 })}
            min={1}
            max={6}
          />
        </InspectorToolsPanelItem>
      </InspectorGroups.Settings>

      <CommonPanels.Settings initialOpen={false}>
        {categories ? (
          <SelectControl
            multiple
            label={__('Choose categories', 'jankx')}
            value={selectedIds}
            options={categoryOptions}
            onChange={(selected) => {
              handleChange(
                Array.isArray(selected)
                  ? selected.map(Number).map(String)
                  : [String(selected)]
              );
            }}
          />
        ) : (
          <p>
            {__('Loading categories…', 'jankx')}
          </p>
        )}
      </CommonPanels.Settings>

      <div className="jankx-categories-wrapper">
        {productCategories.length ? (
          productCategories.map((cat) => (
            <div key={cat.id} className="jankx-category-item">
              <div className="jankx-category-image">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} />
                ) : (
                  <div className="jankx-category-placeholder">
                    {__('No Image', 'jankx')}
                  </div>
                )}
              </div>
              <h4>{cat.name}</h4>
            </div>
          ))
        ) : (
          <p>
            {__('Please select categories…', 'jankx')}
          </p>
        )}
      </div>
    </div>
  );
};

const Save = () => null;

registerBlockType(metadata as any, {
  edit: Edit as any,
  save: Save as any,
});
