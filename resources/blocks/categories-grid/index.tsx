import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    TextControl,
    SelectControl,
    ToggleControl,
    Button,
    RangeControl,
    SVG,
    Path,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

interface CategoriesGridAttributes {
    categoryIDs: string;
    queryCategories: string;
    queryCategoriesLast: string;
    queryDisplayType: string;
    isLoading: boolean;
    querySearchString: string;
    querySearchResults: any[];
    querySearchNoResults: boolean;
    querySearchSelected: any[];
    queryOrder: string;
    parentOnly: boolean;
    hideEmpty: boolean;
    orderby: string;
    limit: number;
    columns: string;
    productCount: boolean;
    align: string;
    className: string;
}

interface EditProps {
    attributes: CategoriesGridAttributes;
    setAttributes: (attributes: Partial<CategoriesGridAttributes>) => void;
}

const Edit: React.FC<EditProps> = ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps();
    const {
        categoryIDs,
        queryDisplayType,
        limit,
        columns,
        hideEmpty,
        productCount,
        parentOnly,
        orderby,
        className
    } = attributes;

    const searchCategories = async (searchString: string) => {
        if (searchString.length < 3) return;

        setAttributes({ isLoading: true });

        try {
            const response = await apiFetch({
                path: `/wp/v2/product_cat?search=${encodeURIComponent(searchString)}&per_page=20`
            });

            setAttributes({
                querySearchResults: response,
                querySearchNoResults: response.length === 0,
                isLoading: false
            });
        } catch (error) {
            setAttributes({ isLoading: false });
        }
    };

    const addCategory = (category: any) => {
        const currentIDs = categoryIDs ? categoryIDs.split(',').map(id => id.trim()) : [];
        if (!currentIDs.includes(category.id.toString())) {
            const newIDs = [...currentIDs, category.id.toString()];
            setAttributes({
                categoryIDs: newIDs.join(','),
                querySearchString: '',
                querySearchResults: []
            });
        }
    };

    const removeCategory = (categoryId: string) => {
        const currentIDs = categoryIDs ? categoryIDs.split(',').map(id => id.trim()) : [];
        const newIDs = currentIDs.filter(id => id !== categoryId);
        setAttributes({ categoryIDs: newIDs.join(',') });
    };

    const getSelectedCategories = () => {
        if (!categoryIDs) return [];
        const ids = categoryIDs.split(',').map(id => id.trim());
        return ids.map(id => ({ id, name: `Category ${id}` }));
    };

    return (
        <div {...blockProps}>
            <InspectorControls>
                <div className="components-panel__body is-opened">
                    <h3>{__('Categories Selection', 'jankx')}</h3>

                    <SelectControl
                        label={__('Display Type', 'jankx')}
                        value={queryDisplayType}
                        options={[
                            { label: __('All Categories', 'jankx'), value: 'all_categories' },
                            { label: __('Specific Categories', 'jankx'), value: 'specific' }
                        ]}
                        onChange={(value) => setAttributes({ queryDisplayType: value })}
                    />

                    {queryDisplayType === 'specific' && (
                        <>
                            <TextControl
                                label={__('Search Categories', 'jankx')}
                                value={attributes.querySearchString}
                                onChange={(value) => {
                                    setAttributes({ querySearchString: value });
                                    if (value.length >= 3) {
                                        searchCategories(value);
                                    }
                                }}
                                placeholder={__('Type to search categories...', 'jankx')}
                            />

                            {attributes.isLoading && (
                                <p>{__('Loading...', 'jankx')}</p>
                            )}

                            {attributes.querySearchResults.length > 0 && (
                                <div className="search-results">
                                    {attributes.querySearchResults.map((category: any) => (
                                        <Button
                                            key={category.id}
                                            isSmall
                                            onClick={() => addCategory(category)}
                                        >
                                            {category.name}
                                        </Button>
                                    ))}
                                </div>
                            )}

                            {attributes.querySearchNoResults && (
                                <p>{__('No categories found.', 'jankx')}</p>
                            )}

                            {getSelectedCategories().length > 0 && (
                                <div className="selected-categories">
                                    <h4>{__('Selected Categories:', 'jankx')}</h4>
                                    {getSelectedCategories().map((category: any) => (
                                        <div key={category.id} className="selected-category">
                                            <span>{category.name}</span>
                                            <Button
                                                isSmall
                                                isDestructive
                                                onClick={() => removeCategory(category.id)}
                                            >
                                                {__('Remove', 'jankx')}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    <RangeControl
                        label={__('Number of Categories', 'jankx')}
                        value={limit}
                        onChange={(value) => setAttributes({ limit: value })}
                        min={1}
                        max={50}
                    />

                    <SelectControl
                        label={__('Columns', 'jankx')}
                        value={columns}
                        options={[
                            { label: '2', value: '2' },
                            { label: '3', value: '3' },
                            { label: '4', value: '4' },
                            { label: '5', value: '5' }
                        ]}
                        onChange={(value) => setAttributes({ columns: value })}
                    />

                    <ToggleControl
                        label={__('Hide Empty Categories', 'jankx')}
                        checked={hideEmpty}
                        onChange={(value) => setAttributes({ hideEmpty: value })}
                    />

                    <ToggleControl
                        label={__('Show Product Count', 'jankx')}
                        checked={productCount}
                        onChange={(value) => setAttributes({ productCount: value })}
                    />

                    <ToggleControl
                        label={__('Parent Categories Only', 'jankx')}
                        checked={parentOnly}
                        onChange={(value) => setAttributes({ parentOnly: value })}
                    />

                    <SelectControl
                        label={__('Order By', 'jankx')}
                        value={orderby}
                        options={[
                            { label: __('Menu Order', 'jankx'), value: 'menu_order' },
                            { label: __('Title (A-Z)', 'jankx'), value: 'title_asc' },
                            { label: __('Title (Z-A)', 'jankx'), value: 'title_desc' }
                        ]}
                        onChange={(value) => setAttributes({ orderby: value })}
                    />
                </div>
            </InspectorControls>

            <div className={`wp-block-jankx-categories-grid ${className} align${align}`}>
                <div className="jankx-categories-grid columns-{columns}">
                    <div className="jankx-category-grid-item">
                        <div className="jankx-category-grid-item-img">
                            <div className="placeholder-image">
                                {__('Category Image', 'jankx')}
                            </div>
                        </div>
                        <h4 className="jankx-category-grid-item-title">
                            {__('Sample Category', 'jankx')}
                            {productCount && (
                                <span className="jankx-category-grid-item-count">(12)</span>
                            )}
                        </h4>
                    </div>

                    <div className="jankx-category-grid-item">
                        <div className="jankx-category-grid-item-img">
                            <div className="placeholder-image">
                                {__('Category Image', 'jankx')}
                            </div>
                        </div>
                        <h4 className="jankx-category-grid-item-title">
                            {__('Sample Category', 'jankx')}
                            {productCount && (
                                <span className="jankx-category-grid-item-count">(8)</span>
                            )}
                        </h4>
                    </div>

                    <div className="jankx-category-grid-item">
                        <div className="jankx-category-grid-item-img">
                            <div className="placeholder-image">
                                {__('Category Image', 'jankx')}
                            </div>
                        </div>
                        <h4 className="jankx-category-grid-item-title">
                            {__('Sample Category', 'jankx')}
                            {productCount && (
                                <span className="jankx-category-grid-item-count">(15)</span>
                            )}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Save: React.FC = () => {
    return null; // Server-side rendering
};

registerBlockType('jankx/categories-grid', {
    title: __('Product Categories Grid', 'jankx'),
    icon: 'grid-view',
    category: 'widgets',
    description: __('Display a grid of products from your selected categories.', 'jankx'),
    keywords: [__('product categories', 'jankx'), __('grid', 'jankx'), __('thumbs', 'jankx')],
    supports: {
        align: ['center', 'wide', 'full'],
        html: false
    },
    attributes: {
        categoryIDs: {
            type: 'string',
            default: ''
        },
        queryCategories: {
            type: 'string',
            default: ''
        },
        queryCategoriesLast: {
            type: 'string',
            default: ''
        },
        queryDisplayType: {
            type: 'string',
            default: 'all_categories'
        },
        isLoading: {
            type: 'boolean',
            default: false
        },
        querySearchString: {
            type: 'string',
            default: ''
        },
        querySearchResults: {
            type: 'array',
            default: []
        },
        querySearchNoResults: {
            type: 'boolean',
            default: false
        },
        querySearchSelected: {
            type: 'array',
            default: []
        },
        queryOrder: {
            type: 'string',
            default: ''
        },
        parentOnly: {
            type: 'boolean',
            default: false
        },
        hideEmpty: {
            type: 'boolean',
            default: false
        },
        orderby: {
            type: 'string',
            default: 'menu_order'
        },
        limit: {
            type: 'number',
            default: 8
        },
        columns: {
            type: 'string',
            default: '3'
        },
        productCount: {
            type: 'boolean',
            default: true
        },
        align: {
            type: 'string',
            default: 'center'
        },
        className: {
            type: 'string',
            default: 'is-style-layout-2'
        }
    },
    styles: [
        {
            name: 'layout-1',
            label: __('Layout 1', 'jankx')
        },
        {
            name: 'layout-2',
            label: __('Layout 2', 'jankx'),
            isDefault: true
        },
        {
            name: 'layout-3',
            label: __('Layout 3', 'jankx')
        }
    ],
    edit: Edit,
    save: Save
});
