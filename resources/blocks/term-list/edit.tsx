import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useMemo } from '@wordpress/element';
import type { CSSProperties } from 'react';
import './editor.scss';

export interface TermListAttributes {
    taxonomy: string;
    postsPerPage: number;
    orderBy: string;
    order: string;
    hideEmpty: boolean;
    showOnlyTopLevel: boolean;
    showTermCount: boolean;
    layout: 'list' | 'grid' | 'flex';
    columns: number;
}

interface EditProps {
    attributes: TermListAttributes;
    setAttributes: (attrs: Partial<TermListAttributes>) => void;
}

const ORDER_BY_OPTIONS = [
    { label: __('Name', 'jankx'), value: 'name' },
    { label: __('Slug', 'jankx'), value: 'slug' },
    { label: __('Count', 'jankx'), value: 'count' },
    { label: __('Term order', 'jankx'), value: 'term_order' },
    { label: __('Description', 'jankx'), value: 'description' },
];

const ORDER_OPTIONS = [
    { label: __('A → Z', 'jankx'), value: 'ASC' },
    { label: __('Z → A', 'jankx'), value: 'DESC' },
];

const LAYOUT_OPTIONS = [
    { label: __('List', 'jankx'), value: 'list' },
    { label: __('Grid', 'jankx'), value: 'grid' },
    { label: __('Flex wrap', 'jankx'), value: 'flex' },
];

export default function Edit({ attributes, setAttributes }: EditProps) {
    const {
        taxonomy,
        postsPerPage,
        orderBy,
        order,
        hideEmpty,
        showOnlyTopLevel,
        showTermCount,
        layout,
        columns,
    } = attributes;

    const setAttr = <K extends keyof TermListAttributes>(
        key: K,
        value: TermListAttributes[K],
    ) => setAttributes({ [key]: value } as Partial<TermListAttributes>);

    const taxonomies = useSelect(
        (select: any) => select(coreStore).getTaxonomies({ per_page: -1 }),
        [],
    ) as Array<{
        slug: string;
        name: string;
        hierarchical?: boolean;
        visibility?: { public?: boolean };
    }> | null;

    const taxonomyOptions = useMemo(
        () =>
            (taxonomies || [])
                .filter((t) => t.visibility?.public !== false)
                .map((t) => ({ label: t.name, value: t.slug })),
        [taxonomies],
    );

    const currentTaxonomy = useMemo(
        () => (taxonomies || []).find((t) => t.slug === taxonomy),
        [taxonomies, taxonomy],
    );

    const isHierarchical = !!currentTaxonomy?.hierarchical;

    const blockProps = useBlockProps({
        className: [
            'jankx-term-list',
            `jankx-term-list--${layout}`,
            !postsPerPage ? 'jankx-term-list--all' : '',
        ]
            .filter(Boolean)
            .join(' '),
        style: {
            '--columns-desktop': columns,
            '--jankx-term-columns': columns,
        } as CSSProperties,
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Term Query', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Taxonomy', 'jankx')}
                        value={taxonomy}
                        options={
                            taxonomyOptions.length
                                ? taxonomyOptions
                                : [{ label: __('Loading…', 'jankx'), value: taxonomy }]
                        }
                        onChange={(value) => setAttr('taxonomy', value)}
                        help={__('Select a taxonomy to display its terms.', 'jankx')}
                    />

                    <RangeControl
                        label={__('Number of terms', 'jankx')}
                        value={postsPerPage}
                        onChange={(value) => setAttr('postsPerPage', value || 0)}
                        min={0}
                        max={100}
                        step={1}
                        help={__('0 = show all terms.', 'jankx')}
                    />

                    <SelectControl
                        label={__('Order by', 'jankx')}
                        value={orderBy}
                        options={ORDER_BY_OPTIONS}
                        onChange={(value) => setAttr('orderBy', value)}
                    />

                    <SelectControl
                        label={__('Order', 'jankx')}
                        value={order}
                        options={ORDER_OPTIONS}
                        onChange={(value) => setAttr('order', value)}
                    />

                    <ToggleControl
                        label={__('Hide empty terms', 'jankx')}
                        checked={hideEmpty}
                        onChange={(value) => setAttr('hideEmpty', value)}
                    />

                    {isHierarchical && (
                        <ToggleControl
                            label={__('Show only top level terms', 'jankx')}
                            checked={showOnlyTopLevel}
                            onChange={(value) => setAttr('showOnlyTopLevel', value)}
                        />
                    )}

                    <ToggleControl
                        label={__('Show term count', 'jankx')}
                        checked={showTermCount}
                        onChange={(value) => setAttr('showTermCount', value)}
                        help={__(
                            'Only applies to the default item markup. With a term template, add a Count block instead.',
                            'jankx',
                        )}
                    />
                </PanelBody>

                <PanelBody title={__('Layout', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Items layout', 'jankx')}
                        value={layout}
                        options={LAYOUT_OPTIONS}
                        onChange={(value) =>
                            setAttr('layout', value as TermListAttributes['layout'])
                        }
                    />

                    {layout !== 'list' && (
                        <RangeControl
                            label={__('Columns', 'jankx')}
                            value={columns}
                            onChange={(value) => setAttr('columns', value || 3)}
                            min={1}
                            max={12}
                            step={1}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={['jankx/dynamic-term-template']}
                    template={[['jankx/dynamic-term-template', {}]]}
                    templateLock={false}
                    renderAppender={InnerBlocks.ButtonBlockAppender}
                />
            </div>
        </>
    );
}
