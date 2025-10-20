import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    InspectorAdvancedControls,
    BlockControls,
    store as blockEditorStore,
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
    Spinner,
    Placeholder,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useState, useCallback, useMemo } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';
import { debounce } from '@wordpress/compose';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

interface PostTypeLayoutAttributes {
    postType: string;
    postsPerPage: number;
    layout: string;
    columns: number;
    showTitle: boolean;
    showExcerpt: boolean;
    showFeaturedImage: boolean;
    showDate: boolean;
    showAuthor: boolean;
    excerptLength: number;
    orderBy: string;
    order: string;
    queryId?: number;
    enablePagination: boolean;
    offset: number;
}

interface EditProps {
    attributes: PostTypeLayoutAttributes;
    setAttributes: (attrs: Partial<PostTypeLayoutAttributes>) => void;
    clientId: string;
}

function Edit({ attributes, setAttributes, clientId }: EditProps) {
    const {
        postType,
        postsPerPage,
        layout,
        columns,
        showTitle,
        showExcerpt,
        showFeaturedImage,
        showDate,
        showAuthor,
        excerptLength,
        orderBy,
        order,
        queryId,
        enablePagination,
        offset,
    } = attributes;

    // Debounced attributes for ServerSideRender
    const [debouncedAttributes, setDebouncedAttributes] = useState(attributes);
    const [cachedHtml, setCachedHtml] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    // Debounce attributes update để giảm số lần re-render
    const updateDebouncedAttributes = useCallback(
        debounce((newAttributes: PostTypeLayoutAttributes) => {
            setDebouncedAttributes(newAttributes);
            setIsLoading(true);
        }, 800),
        []
    );

    useEffect(() => {
        updateDebouncedAttributes(attributes);
    }, [attributes, updateDebouncedAttributes]);

    // Generate unique queryId if not set
    useEffect(() => {
        if (!queryId) {
            // Generate numeric ID from clientId hash
            const hash = clientId.split('').reduce((acc, char) => {
                return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0);
            setAttributes({ queryId: Math.abs(hash) });
        }
    }, [queryId, clientId, setAttributes]);



    const blockProps = useBlockProps({
        className: `post-type-layout layout-${layout} columns-${columns}`,
    });

    // Get available post types
    const postTypes = useSelect((select: any) => {
        const { getPostTypes } = select('core');
        return getPostTypes({ per_page: -1 }) || [];
    }, []);

    const postTypeOptions = postTypes
        .filter((type: any) => type.viewable && type.slug !== 'attachment')
        .map((type: any) => ({
            label: type.name,
            value: type.slug,
        }));

    // Get current layout's supported options
    const supportedLayouts = (window as any).jankxSupportedPostTypeLayouts || [];
    const currentLayout = supportedLayouts.find((l: any) => l.name === layout);
    const supportedOptions = currentLayout?.supportedOptions || [];
    const readOnlyOptions = currentLayout?.readOnlyOptions || [];

    // Create stable key based on actual query attributes only
    // Chỉ re-render khi các attributes này thay đổi
    const renderKey = useMemo(() => {
        const keyAttributes = {
            postType: debouncedAttributes.postType,
            postsPerPage: debouncedAttributes.postsPerPage,
            layout: debouncedAttributes.layout,
            columns: debouncedAttributes.columns,
            showTitle: debouncedAttributes.showTitle,
            showExcerpt: debouncedAttributes.showExcerpt,
            showFeaturedImage: debouncedAttributes.showFeaturedImage,
            showDate: debouncedAttributes.showDate,
            showAuthor: debouncedAttributes.showAuthor,
            excerptLength: debouncedAttributes.excerptLength,
            orderBy: debouncedAttributes.orderBy,
            order: debouncedAttributes.order,
            enablePagination: debouncedAttributes.enablePagination,
            offset: debouncedAttributes.offset,
        };
        return JSON.stringify(keyAttributes);
    }, [debouncedAttributes]);

    // Fetch posts từ REST API thay vì dùng ServerSideRender
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);

                // Use wp.apiFetch để tự động handle authentication
                const data = await (window as any).wp.apiFetch({
                    path: `/wp/v2/block-renderer/jankx/post-type-layout?context=edit`,
                    method: 'POST',
                    data: {
                        attributes: debouncedAttributes,
                    },
                });

                if (data.rendered) {
                    setCachedHtml(data.rendered);
                } else {
                    setCachedHtml('<div class="placeholder">No content</div>');
                }

                setIsLoading(false);
            } catch (error: any) {
                console.error('Error fetching posts:', error);
                setCachedHtml(`<div class="error">${error?.message || 'Error rendering block'}</div>`);
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [renderKey, debouncedAttributes]);


    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={__('Query Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Post Type', 'jankx')}
                        value={postType}
                        options={postTypeOptions}
                        onChange={(value) => setAttributes({ postType: value })}
                    />
                    <RangeControl
                        label={__('Posts Per Page', 'jankx')}
                        value={postsPerPage}
                        onChange={(value) => setAttributes({ postsPerPage: value || 10 })}
                        min={1}
                        max={50}
                    />
                    <RangeControl
                        label={__('Offset', 'jankx')}
                        value={offset}
                        onChange={(value) => setAttributes({ offset: value || 0 })}
                        min={0}
                        max={50}
                        help={__('Bỏ qua N bài viết đầu tiên', 'jankx')}
                    />
                    <SelectControl
                        label={__('Order By', 'jankx')}
                        value={orderBy}
                        options={[
                            { label: __('Date', 'jankx'), value: 'date' },
                            { label: __('Title', 'jankx'), value: 'title' },
                            { label: __('Random', 'jankx'), value: 'rand' },
                            { label: __('Menu Order', 'jankx'), value: 'menu_order' },
                        ]}
                        onChange={(value) => setAttributes({ orderBy: value })}
                    />
                    <SelectControl
                        label={__('Order', 'jankx')}
                        value={order}
                        options={[
                            { label: __('Descending', 'jankx'), value: 'DESC' },
                            { label: __('Ascending', 'jankx'), value: 'ASC' },
                        ]}
                        onChange={(value) => setAttributes({ order: value })}
                    />
                    <ToggleControl
                        label={__('Bật phân trang', 'jankx')}
                        checked={enablePagination}
                        onChange={(value) => setAttributes({ enablePagination: value })}
                        help={__('Hiển thị pagination để phân trang posts', 'jankx')}
                    />
                </PanelBody>
            </InspectorControls>

            <InspectorControls>
                <PanelBody title={__('Layout', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Layout Type', 'jankx')}
                        value={layout}
                        options={
                            (window as any).jankxSupportedPostTypeLayouts?.map((layout: any) => ({
                                label: layout.title,
                                value: layout.name,
                            })) || [
                                { label: __('Grid', 'jankx'), value: 'grid' },
                                { label: __('List', 'jankx'), value: 'list' },
                                { label: __('Masonry', 'jankx'), value: 'masonry' },
                                { label: __('Card', 'jankx'), value: 'card' },
                            ]
                        }
                        onChange={(value) => setAttributes({ layout: value })}
                    />
                    {supportedOptions.includes('columns') && (
                        <RangeControl
                            label={__('Columns', 'jankx')}
                            value={columns}
                            onChange={(value) => setAttributes({ columns: value || 3 })}
                            min={1}
                            max={6}
                        />
                    )}
                </PanelBody>

                <PanelBody title={__('Display Settings', 'jankx')} initialOpen={false}>
                    {supportedOptions.includes('showFeaturedImage') && (
                        <ToggleControl
                            label={__('Show Featured Image', 'jankx')}
                            checked={showFeaturedImage}
                            onChange={(value) => setAttributes({ showFeaturedImage: value })}
                            disabled={readOnlyOptions.includes('showFeaturedImage')}
                        />
                    )}
                    {supportedOptions.includes('showTitle') && (
                        <ToggleControl
                            label={__('Show Title', 'jankx')}
                            checked={showTitle}
                            onChange={(value) => setAttributes({ showTitle: value })}
                            disabled={readOnlyOptions.includes('showTitle')}
                        />
                    )}
                    {supportedOptions.includes('showExcerpt') && (
                        <>
                            <ToggleControl
                                label={__('Show Excerpt', 'jankx')}
                                checked={showExcerpt}
                                onChange={(value) => setAttributes({ showExcerpt: value })}
                                disabled={readOnlyOptions.includes('showExcerpt')}
                            />
                            {showExcerpt && (
                                <RangeControl
                                    label={__('Excerpt Length', 'jankx')}
                                    value={excerptLength}
                                    onChange={(value) => setAttributes({ excerptLength: value || 55 })}
                                    min={10}
                                    max={200}
                                    help={__('Số ký tự hiển thị trong excerpt', 'jankx')}
                                />
                            )}
                        </>
                    )}
                    {supportedOptions.includes('showDate') && (
                        <ToggleControl
                            label={__('Show Date', 'jankx')}
                            checked={showDate}
                            onChange={(value) => setAttributes({ showDate: value })}
                            disabled={readOnlyOptions.includes('showDate')}
                        />
                    )}
                    {supportedOptions.includes('showAuthor') && (
                        <ToggleControl
                            label={__('Show Author', 'jankx')}
                            checked={showAuthor}
                            onChange={(value) => setAttributes({ showAuthor: value })}
                            disabled={readOnlyOptions.includes('showAuthor')}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {isLoading ? (
                    <Placeholder>
                        <Spinner />
                        <p>{__('Đang tải posts...', 'jankx')}</p>
                    </Placeholder>
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: cachedHtml }} />
                )}

            </div>
        </>
    );
}

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: () => null, // Server-side rendering
} as any);
