/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
    BlockControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    ToggleControl,
    ToolbarGroup,
    ToolbarButton,
    TextControl,
    RangeControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { list, formatListNumbered } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import type { TableOfContentProps, TOCItem, ExpandState } from './types';

/**
 * Mock data for template editing
 */
const MOCK_TOC_DATA: TOCItem[] = [
    {
        id: 'heading-1',
        text: 'Giới Thiệu Chung',
        level: 2,
        isExpanded: true,
        children: [
            {
                id: 'heading-1-1',
                text: 'Lịch Sử Hình Thành',
                level: 3,
                isExpanded: false,
                children: [
                    {
                        id: 'heading-1-1-1',
                        text: 'Giai Đoạn Đầu',
                        level: 4,
                        isExpanded: false,
                        children: []
                    },
                    {
                        id: 'heading-1-1-2',
                        text: 'Giai Đoạn Phát Triển',
                        level: 4,
                        isExpanded: false,
                        children: []
                    }
                ]
            },
            {
                id: 'heading-1-2',
                text: 'Đặc Điểm Nổi Bật',
                level: 3,
                isExpanded: false,
                children: []
            }
        ]
    },
    {
        id: 'heading-2',
        text: 'Nội Dung Chi Tiết',
        level: 2,
        isExpanded: false,
        children: [
            {
                id: 'heading-2-1',
                text: 'Phần Thứ Nhất',
                level: 3,
                isExpanded: false,
                children: []
            },
            {
                id: 'heading-2-2',
                text: 'Phần Thứ Hai',
                level: 3,
                isExpanded: false,
                children: []
            }
        ]
    },
    {
        id: 'heading-3',
        text: 'Kết Luận',
        level: 2,
        isExpanded: false,
        children: []
    }
];

/**
 * Get expand/collapse icon based on type
 */
function getExpandIcon(type: string, isExpanded: boolean): string {
    switch (type) {
        case 'chevron':
            return isExpanded ? '▼' : '▶';
        case 'arrow':
            return isExpanded ? '↓' : '→';
        case 'caret':
            return isExpanded ? '▾' : '▸';
        case 'plus-minus':
        default:
            return isExpanded ? '−' : '+';
    }
}

/**
 * Render TOC item recursively
 */
function renderTOCItem(
    item: TOCItem,
    listingType: string,
    expandIconType: string,
    expandState: ExpandState,
    onToggle: (id: string) => void,
    showNumbers: boolean
): JSX.Element {
    const hasChildren = item.children.length > 0;
    const isExpanded = expandState[item.id] !== undefined ? expandState[item.id] : item.isExpanded;
    const ListTag = listingType === 'ol' ? 'ol' : 'ul';

    return (
        <li key={item.id} className={`toc-item toc-item--level-${item.level}`}>
            <div className="toc-item__wrapper">
                {hasChildren && (
                    <button
                        className={`toc-item__toggle ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
                        onClick={() => onToggle(item.id)}
                        type="button"
                        aria-expanded={isExpanded}
                    >
                        <span className="toc-item__icon">
                            {getExpandIcon(expandIconType, isExpanded)}
                        </span>
                    </button>
                )}
                <a
                    href={`#${item.id}`}
                    className="toc-item__link"
                    onClick={(e) => e.preventDefault()}
                >
                    {item.text}
                </a>
            </div>
            {hasChildren && isExpanded && (
                <ListTag className={`toc-list toc-list--level-${item.level + 1}`}>
                    {item.children.map((child) =>
                        renderTOCItem(child, listingType, expandIconType, expandState, onToggle, showNumbers)
                    )}
                </ListTag>
            )}
        </li>
    );
}

/**
 * Edit component for Table of Content block
 */
export default function Edit({ attributes, setAttributes, clientId }: TableOfContentProps): JSX.Element {
    const {
        listingType,
        expandIconType,
        defaultExpanded,
        expandFirstItem,
        showNumbers,
        showHeading,
        customHeadingText,
        minHeadingLevel,
        maxHeadingLevel,
    } = attributes;

    // Check if we're editing a template (no post content)
    const isTemplate = useSelect((select) => {
        const editor = select('core/editor') as any;
        if (!editor) return true;
        const postType = editor.getCurrentPostType?.();
        return postType === 'wp_template' || postType === 'wp_template_part';
    }, []);

    // Manage expand/collapse state
    const [expandState, setExpandState] = useState<ExpandState>(() => {
        const initialState: ExpandState = {};
        if (expandFirstItem && MOCK_TOC_DATA.length > 0) {
            initialState[MOCK_TOC_DATA[0].id] = true;
        }
        return initialState;
    });

    const handleToggle = (id: string): void => {
        setExpandState((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const blockProps = useBlockProps({
        className: 'jankx-table-of-content',
        'data-expand-icon-type': expandIconType,
    });

    const ListTag = listingType === 'ol' ? 'ol' : 'ul';

    // Use mock data for template editing, real data will be rendered by PHP
    const tocData = isTemplate ? MOCK_TOC_DATA : [];

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon={list}
                        title={__('Unordered List', 'jankx')}
                        onClick={() => setAttributes({ listingType: 'ul' })}
                        isActive={listingType === 'ul'}
                    />
                    <ToolbarButton
                        icon={formatListNumbered}
                        title={__('Ordered List', 'jankx')}
                        onClick={() => setAttributes({ listingType: 'ol' })}
                        isActive={listingType === 'ol'}
                    />
                </ToolbarGroup>
            </BlockControls>

            <InspectorControls>
                <PanelBody title={__('Display Settings', 'jankx')} initialOpen={true}>
                    <ToggleControl
                        label={__('Show Heading', 'jankx')}
                        checked={showHeading}
                        onChange={(value) => setAttributes({ showHeading: value })}
                        help={__('Show or hide the table of content heading', 'jankx')}
                        __nextHasNoMarginBottom
                    />

                    {showHeading && (
                        <TextControl
                            label={__('Custom Heading Text', 'jankx')}
                            value={customHeadingText}
                            onChange={(value) => setAttributes({ customHeadingText: value })}
                            placeholder={__('Table of Contents', 'jankx')}
                            help={__('Leave empty to use default heading text', 'jankx')}
                            __nextHasNoMarginBottom
                            __next40pxDefaultSize
                        />
                    )}

                    <RangeControl
                        label={__('Minimum Heading Level', 'jankx')}
                        value={minHeadingLevel}
                        onChange={(value) => {
                            const newMin = value || 2;
                            setAttributes({
                                minHeadingLevel: newMin,
                                maxHeadingLevel: Math.max(newMin, maxHeadingLevel)
                            });
                        }}
                        min={2}
                        max={6}
                        step={1}
                        help={__('Start building TOC from this heading level (H2-H6)', 'jankx')}
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                    />

                    <RangeControl
                        label={__('Maximum Heading Level', 'jankx')}
                        value={maxHeadingLevel}
                        onChange={(value) => {
                            const newMax = value || 6;
                            setAttributes({
                                maxHeadingLevel: newMax,
                                minHeadingLevel: Math.min(minHeadingLevel, newMax)
                            });
                        }}
                        min={2}
                        max={6}
                        step={1}
                        help={__('Stop building TOC at this heading level (H2-H6)', 'jankx')}
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                    />
                </PanelBody>

                <PanelBody title={__('List Settings', 'jankx')} initialOpen={false}>
                    <SelectControl
                        label={__('Listing Type', 'jankx')}
                        value={listingType}
                        options={[
                            { label: __('Unordered List (•)', 'jankx'), value: 'ul' },
                            { label: __('Ordered List (1, 2, 3)', 'jankx'), value: 'ol' },
                        ]}
                        onChange={(value) => setAttributes({ listingType: value as 'ul' | 'ol' })}
                        help={__('Choose how to display the table of content list', 'jankx')}
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                    />

                    <SelectControl
                        label={__('Expand/Collapse Icon', 'jankx')}
                        value={expandIconType}
                        options={[
                            { label: __('Plus/Minus (+/−)', 'jankx'), value: 'plus-minus' },
                            { label: __('Chevron (▶/▼)', 'jankx'), value: 'chevron' },
                            { label: __('Arrow (→/↓)', 'jankx'), value: 'arrow' },
                            { label: __('Caret (▸/▾)', 'jankx'), value: 'caret' },
                        ]}
                        onChange={(value) => setAttributes({ expandIconType: value as any })}
                        help={__('Choose icon style for expand/collapse buttons', 'jankx')}
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                    />

                    <ToggleControl
                        label={__('Expand All by Default', 'jankx')}
                        checked={defaultExpanded}
                        onChange={(value) => setAttributes({ defaultExpanded: value })}
                        help={__('Show all nested items by default', 'jankx')}
                        __nextHasNoMarginBottom
                    />

                    {!defaultExpanded && (
                        <ToggleControl
                            label={__('Expand First Item', 'jankx')}
                            checked={expandFirstItem}
                            onChange={(value) => setAttributes({ expandFirstItem: value })}
                            help={__('Expand the first item by default', 'jankx')}
                            __nextHasNoMarginBottom
                        />
                    )}

                    <ToggleControl
                        label={__('Show Numbers', 'jankx')}
                        checked={showNumbers}
                        onChange={(value) => setAttributes({ showNumbers: value })}
                        help={__('Show hierarchical numbers (1.1, 1.2, etc.)', 'jankx')}
                        __nextHasNoMarginBottom
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <nav className="toc-wrapper" aria-label={customHeadingText || __('Table of Contents', 'jankx')}>
                    {showHeading && (
                        <div className="toc-header">
                            <h2 className="toc-title">{customHeadingText || __('Table of Contents', 'jankx')}</h2>
                        </div>
                    )}
                    {tocData.length > 0 ? (
                        <ListTag className={`toc-list toc-list--root ${showNumbers ? 'toc-list--numbered' : ''}`}>
                            {tocData.map((item) =>
                                renderTOCItem(item, listingType, expandIconType, expandState, handleToggle, showNumbers)
                            )}
                        </ListTag>
                    ) : (
                        <div className="toc-placeholder">
                            <p>{__('Table of content will be generated from headings in the post content.', 'jankx')}</p>
                            {!isTemplate && (
                                <p><em>{__('Add headings (H2, H3, H4, etc.) to your post to see the table of content.', 'jankx')}</em></p>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </>
    );
}

