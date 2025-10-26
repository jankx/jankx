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
    TextControl,
    FormTokenField,
    Button,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useState, useCallback, useMemo } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';
import { debounce } from '@wordpress/compose';
import { ResponsiveControl, ResponsiveValue } from '../../shared/components';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

interface TaxQueryItem {
    taxonomy: string;
    terms: number[];
    operator: 'IN' | 'NOT IN' | 'AND' | 'EXISTS' | 'NOT EXISTS';
}

interface MetaQueryItem {
    key: string;
    value: string;
    compare: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN' | 'EXISTS' | 'NOT EXISTS';
    type?: 'NUMERIC' | 'BINARY' | 'CHAR' | 'DATE' | 'DATETIME' | 'DECIMAL' | 'SIGNED' | 'TIME' | 'UNSIGNED';
}

interface PostTypeLayoutAttributes {
    queryPreset: 'default' | 'related' | 'custom';
    postType: string;
    postsPerPage: number;
    layout: string;
    columns: number;
    columnsTablet: number;
    columnsMobile: number;
    // For future use with ResponsiveValue
    responsiveColumns?: ResponsiveValue;
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
    paginationStyle: 'numbers' | 'simple' | 'arrows' | 'load-more';
    paginationAlignment: 'left' | 'center' | 'right';
    showPaginationNumbers: boolean;
    paginationPrevText: string;
    paginationNextText: string;
    offset: number;
    taxQuery: TaxQueryItem[];
    metaQuery: MetaQueryItem[];
    keyword: string;
    authorIn: number[];
    authorNotIn: number[];
    postIn: number[];
    postNotIn: number[];
    metaKey: string;
    metaType: string;
    postStatus: string[];
    postParent: number;
    postParentIn: number[];
    postParentNotIn: number[];
    customQueryId: string;
}

interface EditProps {
    attributes: PostTypeLayoutAttributes;
    setAttributes: (attrs: Partial<PostTypeLayoutAttributes>) => void;
    clientId: string;
}

function Edit({ attributes, setAttributes, clientId }: EditProps) {
    const {
        queryPreset,
        postType,
        postsPerPage,
        layout,
        columns,
        columnsTablet,
        columnsMobile,
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
        paginationStyle,
        paginationAlignment,
        showPaginationNumbers,
        paginationPrevText,
        paginationNextText,
        offset,
        taxQuery,
        metaQuery,
        keyword,
        authorIn,
        authorNotIn,
        postIn,
        postNotIn,
        metaKey,
        metaType,
        postStatus,
        postParent,
        postParentIn,
        postParentNotIn,
        customQueryId,
    } = attributes;

    // Debounced attributes for ServerSideRender
    const [debouncedAttributes, setDebouncedAttributes] = useState(attributes);
    const [cachedHtml, setCachedHtml] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    // States for taxonomies and authors
    const [taxonomies, setTaxonomies] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [loadingTaxonomies, setLoadingTaxonomies] = useState(false);
    const [taxonomyTerms, setTaxonomyTerms] = useState<{[key: string]: any[]}>({});

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

    // Fetch taxonomies and authors when postType changes
    useEffect(() => {
        const fetchTaxonomiesAndAuthors = async () => {
            setLoadingTaxonomies(true);

            try {
                // Fetch taxonomies for this post type
                const taxonomiesData = await (window as any).wp.apiFetch({
                    path: `/wp/v2/taxonomies?type=${postType}`,
                });

                // Convert object to array
                const taxArray = Object.values(taxonomiesData || {});
                setTaxonomies(taxArray);

                // Fetch authors
                const authorsData = await (window as any).wp.apiFetch({
                    path: '/wp/v2/users?who=authors&per_page=100',
                });
                setAuthors(authorsData || []);
            } catch (error) {
                console.error('Error fetching taxonomies/authors:', error);
                setTaxonomies([]);
                setAuthors([]);
            } finally {
                setLoadingTaxonomies(false);
            }
        };

        fetchTaxonomiesAndAuthors();
    }, [postType]);

    // Function to fetch terms for a specific taxonomy
    const fetchTermsForTaxonomy = useCallback(async (taxonomy: string) => {
        if (taxonomyTerms[taxonomy]) {
            return; // Already loaded
        }

        try {
            const terms = await (window as any).wp.apiFetch({
                path: `/wp/v2/${taxonomy}?per_page=100&orderby=name&order=asc`,
            });

            setTaxonomyTerms(prev => ({
                ...prev,
                [taxonomy]: terms || []
            }));
        } catch (error) {
            console.error(`Error fetching terms for ${taxonomy}:`, error);
            setTaxonomyTerms(prev => ({
                ...prev,
                [taxonomy]: []
            }));
        }
    }, [taxonomyTerms]);

    const blockProps = useBlockProps({
        className: `post-type-layout layout-${layout} columns-${columns} columns-tablet-${columnsTablet} columns-mobile-${columnsMobile}`,
        style: {
            '--columns-desktop': columns,
            '--columns-tablet': columnsTablet,
            '--columns-mobile': columnsMobile,
        } as React.CSSProperties,
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
            paginationStyle: debouncedAttributes.paginationStyle,
            paginationAlignment: debouncedAttributes.paginationAlignment,
            showPaginationNumbers: debouncedAttributes.showPaginationNumbers,
            paginationPrevText: debouncedAttributes.paginationPrevText,
            paginationNextText: debouncedAttributes.paginationNextText,
            offset: debouncedAttributes.offset,
            taxQuery: debouncedAttributes.taxQuery,
            metaQuery: debouncedAttributes.metaQuery,
            keyword: debouncedAttributes.keyword,
            authorIn: debouncedAttributes.authorIn,
            authorNotIn: debouncedAttributes.authorNotIn,
            postIn: debouncedAttributes.postIn,
            postNotIn: debouncedAttributes.postNotIn,
            metaKey: debouncedAttributes.metaKey,
            metaType: debouncedAttributes.metaType,
            postStatus: debouncedAttributes.postStatus,
            postParent: debouncedAttributes.postParent,
            postParentIn: debouncedAttributes.postParentIn,
            postParentNotIn: debouncedAttributes.postParentNotIn,
            customQueryId: debouncedAttributes.customQueryId,
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
    }, [renderKey]); // Only depend on renderKey since it already includes debouncedAttributes


    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={__('Query Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Query Preset', 'jankx')}
                        value={queryPreset}
                        options={[
                            { label: __('Default (Main Query)', 'jankx'), value: 'default' },
                            { label: __('Related Posts (Same Taxonomy)', 'jankx'), value: 'related' },
                            { label: __('Custom Query', 'jankx'), value: 'custom' },
                        ]}
                        onChange={(value) => setAttributes({ queryPreset: value as 'default' | 'related' | 'custom' })}
                        help={
                            queryPreset === 'default'
                                ? __('Sử dụng main query của WordPress. Các query parameters sẽ bị ẩn.', 'jankx')
                                : queryPreset === 'related'
                                ? __('Hiển thị posts liên quan (cùng taxonomy với post hiện tại).', 'jankx')
                                : __('Tùy chỉnh query parameters theo ý bạn.', 'jankx')
                        }
                    />

                    {queryPreset !== 'default' && (
                        <SelectControl
                            label={__('Post Type', 'jankx')}
                            value={postType}
                            options={postTypeOptions}
                            onChange={(value) => setAttributes({ postType: value })}
                        />
                    )}

                    {/* Posts Per Page - Show for all presets */}
                    <RangeControl
                        label={__('Posts Per Page', 'jankx')}
                        value={postsPerPage}
                        onChange={(value) => setAttributes({ postsPerPage: value || 10 })}
                        min={1}
                        max={50}
                        help={__('Số lượng posts hiển thị', 'jankx')}
                    />
                </PanelBody>

                {/* Layout Settings */}
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
                        <ResponsiveControl
                            label={__('Columns', 'jankx')}
                            values={{
                                desktop: columns,
                                tablet: columnsTablet,
                                mobile: columnsMobile
                            }}
                            onChange={(values) => setAttributes({
                                columns: values.desktop,
                                columnsTablet: values.tablet,
                                columnsMobile: values.mobile
                            })}
                            min={1}
                            max={6}
                            help={{
                                desktop: __('Số cột trên màn hình lớn (>1024px)', 'jankx'),
                                tablet: __('Số cột trên tablet (768px - 1024px)', 'jankx'),
                                mobile: __('Số cột trên mobile (<768px)', 'jankx')
                            }}
                        />
                    )}
                </PanelBody>

                {/* Display Settings */}
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

                {/* Query Parameters - Only show for custom preset */}
                {queryPreset === 'custom' && (
                    <PanelBody title={__('Query Parameters', 'jankx')} initialOpen={false}>
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
                        options={(window as any).jankxQueryOptions?.orderBy || [
                            { label: __('Date (Ngày đăng)', 'jankx'), value: 'date' },
                            { label: __('Modified (Ngày sửa)', 'jankx'), value: 'modified' },
                            { label: __('Title (Tiêu đề)', 'jankx'), value: 'title' },
                        ]}
                        onChange={(value) => setAttributes({ orderBy: value })}
                        help={__('Sắp xếp posts theo tiêu chí nào', 'jankx')}
                    />
                    <SelectControl
                        label={__('Order', 'jankx')}
                        value={order}
                        options={(window as any).jankxQueryOptions?.order || [
                            { label: __('Descending (Giảm dần)', 'jankx'), value: 'DESC' },
                            { label: __('Ascending (Tăng dần)', 'jankx'), value: 'ASC' },
                        ]}
                        onChange={(value) => setAttributes({ order: value })}
                    />

                    {/* Meta Key for meta_value ordering */}
                    {(orderBy === 'meta_value' || orderBy === 'meta_value_num') && (
                        <>
                            <TextControl
                                label={__('Meta Key', 'jankx')}
                                value={metaKey}
                                onChange={(value) => setAttributes({ metaKey: value })}
                                help={__('Meta key để sắp xếp (bắt buộc khi dùng meta_value)', 'jankx')}
                                placeholder={__('Ví dụ: price, views, rating', 'jankx')}
                            />
                            {orderBy === 'meta_value' && (
                                <SelectControl
                                    label={__('Meta Type', 'jankx')}
                                    value={metaType}
                                    options={(window as any).jankxQueryOptions?.metaTypes || [
                                        { label: __('-- Auto --', 'jankx'), value: '' },
                                        { label: 'NUMERIC', value: 'NUMERIC' },
                                    ]}
                                    onChange={(value) => setAttributes({ metaType: value })}
                                    help={__('Xác định kiểu dữ liệu để sắp xếp chính xác', 'jankx')}
                                />
                            )}
                        </>
                    )}

                    <ToggleControl
                        label={__('Bật phân trang', 'jankx')}
                        checked={enablePagination}
                        onChange={(value) => setAttributes({ enablePagination: value })}
                        help={__('Hiển thị pagination để phân trang posts', 'jankx')}
                    />

                    {enablePagination ? (
                        <>
                            <SelectControl
                                label={__('Pagination Style', 'jankx')}
                                value={paginationStyle}
                                options={[
                                    { label: __('Numbers (Số trang)', 'jankx'), value: 'numbers' },
                                    { label: __('Simple (Trước/Sau)', 'jankx'), value: 'simple' },
                                    { label: __('Arrows (Mũi tên)', 'jankx'), value: 'arrows' },
                                    { label: __('Load More (Tải thêm)', 'jankx'), value: 'load-more' },
                                ]}
                                onChange={(value) => setAttributes({ paginationStyle: value as 'numbers' | 'simple' | 'arrows' | 'load-more' })}
                                help={__('Chọn kiểu hiển thị pagination', 'jankx')}
                            />

                            <SelectControl
                                label={__('Pagination Alignment', 'jankx')}
                                value={paginationAlignment}
                                options={[
                                    { label: __('Left (Trái)', 'jankx'), value: 'left' },
                                    { label: __('Center (Giữa)', 'jankx'), value: 'center' },
                                    { label: __('Right (Phải)', 'jankx'), value: 'right' },
                                ]}
                                onChange={(value) => setAttributes({ paginationAlignment: value as 'left' | 'center' | 'right' })}
                                help={__('Căn chỉnh vị trí pagination', 'jankx')}
                            />

                            {paginationStyle === 'numbers' && (
                                <ToggleControl
                                    label={__('Hiển thị tất cả số trang', 'jankx')}
                                    checked={showPaginationNumbers}
                                    onChange={(value) => setAttributes({ showPaginationNumbers: value })}
                                    help={__('Hiển thị tất cả số trang thay vì rút gọn', 'jankx')}
                                />
                            )}

                            <TextControl
                                label={__('Text nút "Trước"', 'jankx')}
                                value={paginationPrevText}
                                onChange={(value) => setAttributes({ paginationPrevText: value })}
                                help={__('Để trống sẽ dùng text mặc định. Có thể dùng HTML/SVG.', 'jankx')}
                                placeholder={__('Ví dụ: « Previous hoặc <svg>...</svg>', 'jankx')}
                            />

                            <TextControl
                                label={__('Text nút "Sau"', 'jankx')}
                                value={paginationNextText}
                                onChange={(value) => setAttributes({ paginationNextText: value })}
                                help={__('Để trống sẽ dùng text mặc định. Có thể dùng HTML/SVG.', 'jankx')}
                                placeholder={__('Ví dụ: Next » hoặc <svg>...</svg>', 'jankx')}
                            />
                        </>
                    ) : null}
                </PanelBody>
                )}

                {/* Advanced Query Parameters - Only show for custom preset */}
                {queryPreset === 'custom' && (
                <PanelBody title={__('🔧 Advanced Query Parameters', 'jankx')} initialOpen={false}>
                    <TextControl
                        label={__('Query ID', 'jankx')}
                        value={customQueryId}
                        onChange={(value) => setAttributes({ customQueryId: value })}
                        help={__('Đặt tên cho query này để apply filters cuối cùng: jankx/post-layout/query-args/{query_id}', 'jankx')}
                        placeholder={__('Ví dụ: featured-posts, sidebar-posts', 'jankx')}
                    />

                    <FormTokenField
                        label={__('Post Status', 'jankx')}
                        value={postStatus}
                        suggestions={['publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash', 'any']}
                        onChange={(tokens) => setAttributes({ postStatus: tokens })}
                        help={__('Trạng thái bài viết cần lấy (mặc định: publish)', 'jankx')}
                    />

                    <TextControl
                        label={__('Post Parent ID', 'jankx')}
                        type="number"
                        value={postParent}
                        onChange={(value) => setAttributes({ postParent: parseInt(value) || 0 })}
                        help={__('Lọc posts theo parent ID (0 = tất cả)', 'jankx')}
                    />

                    <TextControl
                        label={__('Post Parent IDs (Include)', 'jankx')}
                        value={postParentIn.join(', ')}
                        onChange={(value) => {
                            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                            setAttributes({ postParentIn: ids });
                        }}
                        help={__('Chỉ lấy posts có parent trong danh sách này', 'jankx')}
                        placeholder={__('Ví dụ: 1, 2, 3', 'jankx')}
                    />

                    <TextControl
                        label={__('Post Parent IDs (Exclude)', 'jankx')}
                        value={postParentNotIn.join(', ')}
                        onChange={(value) => {
                            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                            setAttributes({ postParentNotIn: ids });
                        }}
                        help={__('Loại trừ posts có parent trong danh sách này', 'jankx')}
                        placeholder={__('Ví dụ: 4, 5, 6', 'jankx')}
                    />
                </PanelBody>
                )}

                {/* Keyword Search Filter - Only show for custom preset */}
                {queryPreset === 'custom' && (
                <PanelBody title={__('🔍 Keyword Search', 'jankx')} initialOpen={false}>
                    <TextControl
                        label={__('Từ khóa tìm kiếm', 'jankx')}
                        value={keyword}
                        onChange={(value) => setAttributes({ keyword: value })}
                        help={__('Tìm kiếm theo title, content, excerpt', 'jankx')}
                        placeholder={__('Nhập từ khóa...', 'jankx')}
                    />
                </PanelBody>
                )}

                {/* Author Filters - Only show for custom preset */}
                {queryPreset === 'custom' && authors.length > 0 && (
                    <PanelBody title={__('👤 Author Filters', 'jankx')} initialOpen={false}>
                        <FormTokenField
                            label={__('Authors (Include)', 'jankx')}
                            value={authors.filter((a: any) => authorIn.includes(a.id)).map((a: any) => a.name)}
                            suggestions={authors.map((a: any) => a.name)}
                            onChange={(tokens) => {
                                const selectedIds = tokens.map((token) => {
                                    const author = authors.find((a: any) => a.name === token);
                                    return author?.id || 0;
                                }).filter(id => id > 0);
                                setAttributes({ authorIn: selectedIds });
                            }}
                            help={__('Chỉ hiển thị bài viết của các tác giả này', 'jankx')}
                        />
                        <FormTokenField
                            label={__('Authors (Exclude)', 'jankx')}
                            value={authors.filter((a: any) => authorNotIn.includes(a.id)).map((a: any) => a.name)}
                            suggestions={authors.map((a: any) => a.name)}
                            onChange={(tokens) => {
                                const selectedIds = tokens.map((token) => {
                                    const author = authors.find((a: any) => a.name === token);
                                    return author?.id || 0;
                                }).filter(id => id > 0);
                                setAttributes({ authorNotIn: selectedIds });
                            }}
                            help={__('Loại trừ bài viết của các tác giả này', 'jankx')}
                        />
                    </PanelBody>
                )}

                {/* Post ID Filters - Only show for custom preset */}
                {queryPreset === 'custom' && (
                <PanelBody title={__('🔢 Post ID Filters', 'jankx')} initialOpen={false}>
                    <TextControl
                        label={__('Post IDs (Include)', 'jankx')}
                        value={postIn.join(', ')}
                        onChange={(value) => {
                            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                            setAttributes({ postIn: ids });
                        }}
                        help={__('Chỉ hiển thị các bài viết có ID này (phân cách bằng dấu phẩy)', 'jankx')}
                        placeholder={__('Ví dụ: 1, 2, 3', 'jankx')}
                    />
                    <TextControl
                        label={__('Post IDs (Exclude)', 'jankx')}
                        value={postNotIn.join(', ')}
                        onChange={(value) => {
                            const ids = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                            setAttributes({ postNotIn: ids });
                        }}
                        help={__('Loại trừ các bài viết có ID này (phân cách bằng dấu phẩy)', 'jankx')}
                        placeholder={__('Ví dụ: 4, 5, 6', 'jankx')}
                    />
                </PanelBody>
                )}

                {/* Meta Query Filters - Only show for custom preset */}
                {queryPreset === 'custom' && (
                <PanelBody title={__('⚙️ Meta Query Filters', 'jankx')} initialOpen={false}>
                    <Button
                        variant="primary"
                        onClick={() => {
                            const newMetaQuery = [...metaQuery];
                            newMetaQuery.push({
                                key: '',
                                value: '',
                                compare: '=',
                            });
                            setAttributes({ metaQuery: newMetaQuery });
                        }}
                    >
                        {__('+ Thêm Meta Query', 'jankx')}
                    </Button>

                    {metaQuery.map((mq, index) => (
                        <div key={index} style={{ marginTop: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <strong>{__('Meta Query', 'jankx')} #{index + 1}</strong>
                                <Button
                                    isDestructive
                                    isSmall
                                    onClick={() => {
                                        const newMetaQuery = metaQuery.filter((_, i) => i !== index);
                                        setAttributes({ metaQuery: newMetaQuery });
                                    }}
                                >
                                    {__('Xóa', 'jankx')}
                                </Button>
                            </div>

                            <TextControl
                                label={__('Meta Key', 'jankx')}
                                value={mq.key}
                                onChange={(value) => {
                                    const newMetaQuery = [...metaQuery];
                                    newMetaQuery[index].key = value;
                                    setAttributes({ metaQuery: newMetaQuery });
                                }}
                                placeholder={__('Ví dụ: price, rating, views', 'jankx')}
                            />

                            <SelectControl
                                label={__('Compare', 'jankx')}
                                value={mq.compare}
                                options={[
                                    { label: '= (Bằng)', value: '=' },
                                    { label: '!= (Khác)', value: '!=' },
                                    { label: '> (Lớn hơn)', value: '>' },
                                    { label: '>= (Lớn hơn hoặc bằng)', value: '>=' },
                                    { label: '< (Nhỏ hơn)', value: '<' },
                                    { label: '<= (Nhỏ hơn hoặc bằng)', value: '<=' },
                                    { label: 'LIKE (Chứa)', value: 'LIKE' },
                                    { label: 'NOT LIKE (Không chứa)', value: 'NOT LIKE' },
                                    { label: 'IN (Trong danh sách)', value: 'IN' },
                                    { label: 'NOT IN (Không trong danh sách)', value: 'NOT IN' },
                                    { label: 'EXISTS (Tồn tại)', value: 'EXISTS' },
                                    { label: 'NOT EXISTS (Không tồn tại)', value: 'NOT EXISTS' },
                                ]}
                                onChange={(value) => {
                                    const newMetaQuery = [...metaQuery];
                                    newMetaQuery[index].compare = value as any;
                                    setAttributes({ metaQuery: newMetaQuery });
                                }}
                            />

                            {!['EXISTS', 'NOT EXISTS'].includes(mq.compare) && (
                                <TextControl
                                    label={__('Value', 'jankx')}
                                    value={mq.value}
                                    onChange={(value) => {
                                        const newMetaQuery = [...metaQuery];
                                        newMetaQuery[index].value = value;
                                        setAttributes({ metaQuery: newMetaQuery });
                                    }}
                                    placeholder={__('Nhập giá trị...', 'jankx')}
                                />
                            )}

                            <SelectControl
                                label={__('Type (Optional)', 'jankx')}
                                value={mq.type || ''}
                                options={[
                                    { label: __('-- Auto --', 'jankx'), value: '' },
                                    { label: 'NUMERIC', value: 'NUMERIC' },
                                    { label: 'CHAR', value: 'CHAR' },
                                    { label: 'DATE', value: 'DATE' },
                                    { label: 'DATETIME', value: 'DATETIME' },
                                    { label: 'DECIMAL', value: 'DECIMAL' },
                                    { label: 'SIGNED', value: 'SIGNED' },
                                    { label: 'UNSIGNED', value: 'UNSIGNED' },
                                ]}
                                onChange={(value) => {
                                    const newMetaQuery = [...metaQuery];
                                    newMetaQuery[index].type = value as any;
                                    setAttributes({ metaQuery: newMetaQuery });
                                }}
                                help={__('Xác định kiểu dữ liệu để so sánh chính xác', 'jankx')}
                            />
                        </div>
                    ))}
                </PanelBody>
                )}

                {/* Taxonomy Filters - Only show for custom preset */}
                {queryPreset === 'custom' && taxonomies.length > 0 && taxonomies.map((taxonomy: any) => {
                    // Find existing query for this taxonomy
                    const existingQueryIndex = taxQuery.findIndex(tq => tq.taxonomy === taxonomy.slug);
                    const hasQuery = existingQueryIndex >= 0;
                    const currentQuery = hasQuery ? taxQuery[existingQueryIndex] : null;

                    return (
                        <PanelBody
                            key={taxonomy.slug}
                            title={`🏷️ ${taxonomy.name}`}
                            initialOpen={hasQuery}
                            onToggle={(isOpen) => {
                                if (isOpen) {
                                    // Fetch terms when panel opens
                                    fetchTermsForTaxonomy(taxonomy.slug);
                                }
                            }}
                        >
                            {!hasQuery ? (
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        const newTaxQuery = [...taxQuery];
                                        newTaxQuery.push({
                                            taxonomy: taxonomy.slug,
                                            terms: [],
                                            operator: 'IN'
                                        });
                                        setAttributes({ taxQuery: newTaxQuery });
                                        fetchTermsForTaxonomy(taxonomy.slug);
                                    }}
                                >
                                    {__('Thêm bộ lọc', 'jankx')} {taxonomy.name}
                                </Button>
                            ) : (
                                <>
                                    <SelectControl
                                        label={__('Operator', 'jankx')}
                                        value={currentQuery.operator}
                                        options={[
                                            { label: __('IN (Bao gồm)', 'jankx'), value: 'IN' },
                                            { label: __('NOT IN (Loại trừ)', 'jankx'), value: 'NOT IN' },
                                            { label: __('AND (Phải có tất cả)', 'jankx'), value: 'AND' },
                                            { label: __('EXISTS (Tồn tại)', 'jankx'), value: 'EXISTS' },
                                            { label: __('NOT EXISTS (Không tồn tại)', 'jankx'), value: 'NOT EXISTS' },
                                        ]}
                                        onChange={(value) => {
                                            const newTaxQuery = [...taxQuery];
                                            newTaxQuery[existingQueryIndex].operator = value as any;
                                            setAttributes({ taxQuery: newTaxQuery });
                                        }}
                                        help={__('EXISTS/NOT EXISTS kiểm tra taxonomy có term nào không', 'jankx')}
                                    />

                                    {/* Only show term selection if operator is not EXISTS/NOT EXISTS */}
                                    {!['EXISTS', 'NOT EXISTS'].includes(currentQuery.operator) && (
                                        <>
                                            {taxonomyTerms[taxonomy.slug] ? (
                                                <FormTokenField
                                                    label={__('Select Terms', 'jankx')}
                                                    value={taxonomyTerms[taxonomy.slug]
                                                        .filter((term: any) => currentQuery.terms.includes(term.id))
                                                        .map((term: any) => term.name)
                                                    }
                                                    suggestions={taxonomyTerms[taxonomy.slug].map((term: any) => term.name)}
                                                    onChange={(tokens) => {
                                                        const selectedIds = tokens.map((token) => {
                                                            const term = taxonomyTerms[taxonomy.slug].find((t: any) => t.name === token);
                                                            return term?.id || 0;
                                                        }).filter(id => id > 0);

                                                        const newTaxQuery = [...taxQuery];
                                                        newTaxQuery[existingQueryIndex].terms = selectedIds;
                                                        setAttributes({ taxQuery: newTaxQuery });
                                                    }}
                                                    help={__('Chọn các terms từ dropdown', 'jankx')}
                                                />
                                            ) : (
                                                <Spinner />
                                            )}
                                        </>
                                    )}

                                    <Button
                                        isDestructive
                                        variant="secondary"
                                        onClick={() => {
                                            const newTaxQuery = taxQuery.filter((_, i) => i !== existingQueryIndex);
                                            setAttributes({ taxQuery: newTaxQuery });
                                        }}
                                        style={{ marginTop: '10px' }}
                                    >
                                        {__('Xóa bộ lọc', 'jankx')}
                                    </Button>
                                </>
                            )}
                        </PanelBody>
                    );
                })}
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
