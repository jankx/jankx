import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const TEMPLATE: [string, Record<string, unknown>][] = [
    ['jankx/master-data-template', {}]
];

const ALLOWED_BLOCKS: string[] = ['jankx/master-data-template'];

interface MasterDataLayoutAttributes {
    layout: string;
    columns: number;
    postType: string;
    postsPerPage: number;
    showTitle: boolean;
    showExcerpt: boolean;
    showDate: boolean;
    showFeaturedImage: boolean;
}

interface MasterDataLayoutEditProps {
    attributes: MasterDataLayoutAttributes;
    setAttributes: (attributes: Partial<MasterDataLayoutAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: MasterDataLayoutEditProps): JSX.Element {
    const { 
        layout, 
        columns, 
        postType, 
        postsPerPage,
        showTitle,
        showExcerpt,
        showDate,
        showFeaturedImage 
    } = attributes;
    
    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Layout Settings', 'jankx')}>
                    <SelectControl
                        label={__('Layout', 'jankx')}
                        value={layout}
                        options={[
                            { label: 'Grid', value: 'grid' },
                            { label: 'List', value: 'list' },
                            { label: 'Card', value: 'card' },
                            { label: 'Carousel', value: 'carousel' },
                        ]}
                        onChange={(value: string): void => setAttributes({ layout: value })}
                    />
                    {(layout === 'grid' || layout === 'card' || layout === 'carousel') && (
                        <RangeControl
                            label={__('Columns', 'jankx')}
                            value={columns}
                            onChange={(value: number | undefined): void => setAttributes({ columns: value || 1 })}
                            min={1}
                            max={6}
                        />
                    )}
                    <RangeControl
                        label={__('Posts Per Page', 'jankx')}
                        value={postsPerPage}
                        onChange={(value: number | undefined): void => setAttributes({ postsPerPage: value || 10 })}
                        min={1}
                        max={100}
                    />
                </PanelBody>
                <PanelBody title={__('Query Settings', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Post Type', 'jankx')}
                        value={postType}
                        options={[
                            { label: 'Post', value: 'post' },
                            { label: 'Page', value: 'page' },
                            // Should fetch available post types dynamically
                        ]}
                        onChange={(value: string): void => setAttributes({ postType: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <InnerBlocks 
                    template={TEMPLATE}
                    allowedBlocks={ALLOWED_BLOCKS}
                    templateLock="all"
                />
            </div>
        </>
    );
}
