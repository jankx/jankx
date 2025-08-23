import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl, ButtonGroup, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';

import QueryControls from './components/QueryControls';
import FilterBuilder from './components/FilterBuilder';
import DisplayOptions from './components/DisplayOptions';
import StylingControls from './components/StylingControls';

const ALLOWED_BLOCKS = [
    'core/post-template',
    'core/query-pagination',
    'core/query-no-results',
    'core/post-title',
    'core/post-excerpt',
    'core/post-featured-image',
    'core/post-date',
    'core/post-author',
    'core/post-terms',
    'core/read-more',
    'jankx/icon-picker',
    'jankx/icon-button'
];

const TEMPLATE = [
    ['core/post-template', {}, [
        ['core/post-featured-image', {}],
        ['core/post-title', { level: 2 }],
        ['core/post-excerpt', {}],
        ['core/post-meta', {}],
        ['core/read-more', {}]
    ]],
    ['core/query-pagination', {}],
    ['core/query-no-results', {}]
];

export default function Edit({ attributes, setAttributes, clientId }) {
    const {
        postType,
        postsPerPage,
        orderBy,
        order,
        offset,
        exclude,
        include,
        taxonomyFilters,
        metaFilters,
        presetFilters,
        customFilters,
        displayOptions,
        styling,
        responsive
    } = attributes;

    const [activeTab, setActiveTab] = useState('query');

    const { postTypes, taxonomies } = useSelect((select) => {
        const { getPostTypes, getTaxonomies } = select(coreDataStore);
        return {
            postTypes: getPostTypes({ per_page: -1 }),
            taxonomies: getTaxonomies({ per_page: -1 })
        };
    }, []);

    const blockProps = useBlockProps({
        className: 'jankx-dynamic-collection'
    });

    // Note: InnerBlocks will handle the inner blocks automatically
    // The template and allowed blocks are defined in the block registration

    const updateAttribute = (key, value) => {
        setAttributes({ [key]: value });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'query':
                return (
                    <QueryControls
                        attributes={{
                            postType,
                            postsPerPage,
                            orderBy,
                            order,
                            offset,
                            exclude,
                            include
                        }}
                        postTypes={postTypes}
                        onUpdate={updateAttribute}
                    />
                );
            case 'filters':
                return (
                    <FilterBuilder
                        attributes={{
                            taxonomyFilters,
                            metaFilters,
                            presetFilters,
                            customFilters
                        }}
                        postType={postType}
                        taxonomies={taxonomies}
                        onUpdate={updateAttribute}
                    />
                );
            case 'display':
                return (
                    <DisplayOptions
                        displayOptions={displayOptions}
                        onUpdate={updateAttribute}
                    />
                );
            case 'styling':
                return (
                    <StylingControls
                        styling={styling}
                        responsive={responsive}
                        onUpdate={updateAttribute}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div {...blockProps}>
                <div className="jankx-dynamic-collection__header">
                    <h3 className="jankx-dynamic-collection__title">
                        {__('Dynamic Collection', 'jankx')}
                    </h3>
                    <div className="jankx-dynamic-collection__info">
                        <span className="jankx-dynamic-collection__post-type">
                            {postType}
                        </span>
                        <span className="jankx-dynamic-collection__count">
                            {postsPerPage} {__('posts', 'jankx')}
                        </span>
                    </div>
                </div>

                <div className="jankx-dynamic-collection__content">
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        template={TEMPLATE}
                        templateLock={false}
                    />
                </div>
            </div>

            <InspectorControls>
                <div className="jankx-dynamic-collection__inspector">
                    <div className="jankx-dynamic-collection__tabs">
                        <ButtonGroup className="jankx-dynamic-collection__tab-buttons">
                            {[
                                { key: 'query', label: __('Query', 'jankx'), icon: 'search' },
                                { key: 'filters', label: __('Filters', 'jankx'), icon: 'filter' },
                                { key: 'display', label: __('Display', 'jankx'), icon: 'visibility' },
                                { key: 'styling', label: __('Styling', 'jankx'), icon: 'admin-appearance' }
                            ].map(({ key, label, icon }) => (
                                <Button
                                    key={key}
                                    isPrimary={activeTab === key}
                                    onClick={() => setActiveTab(key)}
                                    icon={icon}
                                    label={label}
                                >
                                    {label}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>

                    <div className="jankx-dynamic-collection__tab-content">
                        {renderTabContent()}
                    </div>
                </div>
            </InspectorControls>
        </>
    );
}



// Register the block
registerBlockType('jankx/dynamic-collection', {
    title: __('Dynamic Collection', 'jankx'),
    description: __('A dynamic collection block for displaying posts with advanced filtering and layout options', 'jankx'),
    category: 'jankx',
    icon: 'grid-view',
    keywords: [
        __('collection', 'jankx'),
        __('posts', 'jankx'),
        __('query', 'jankx'),
        __('filter', 'jankx'),
        __('layout', 'jankx')
    ],
    supports: {
        html: false,
        align: ['wide', 'full'],
        customClassName: true,
        reusable: true
    },
    attributes: {
        postType: {
            type: 'string',
            default: 'post'
        },
        postsPerPage: {
            type: 'number',
            default: 6
        },
        orderBy: {
            type: 'string',
            default: 'date'
        },
        order: {
            type: 'string',
            default: 'DESC'
        },
        offset: {
            type: 'number',
            default: 0
        },
        exclude: {
            type: 'array',
            default: []
        },
        include: {
            type: 'array',
            default: []
        },
        taxonomyFilters: {
            type: 'object',
            default: {}
        },
        metaFilters: {
            type: 'object',
            default: {}
        },
        presetFilters: {
            type: 'array',
            default: []
        },
        customFilters: {
            type: 'array',
            default: []
        },

        displayOptions: {
            type: 'object',
            default: { showImage: true, showTitle: true, showExcerpt: true, showMeta: true }
        },
        styling: {
            type: 'object',
            default: { backgroundColor: '', textColor: '', borderColor: '' }
        },
        responsive: {
            type: 'object',
            default: { mobile: true, tablet: true, desktop: true }
        }
    },
    edit: Edit,
    save: () => null // Using PHP render
});
