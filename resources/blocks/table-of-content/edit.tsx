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
import { useState, useEffect } from '@wordpress/element';
import { list, formatListNumbered } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import type { TableOfContentProps, TOCItem, ExpandState } from './types';

/**
 * Mock data for template editing - Example structure to preview TOC layout
 */
const MOCK_TOC_DATA: TOCItem[] = [
    {
        id: 'example-heading-1',
        text: 'Example Heading 1',
        level: 2,
        isExpanded: true,
        children: [
            {
                id: 'example-heading-1-1',
                text: 'Example Subheading 1.1',
                level: 3,
                isExpanded: false,
                children: [
                    {
                        id: 'example-heading-1-1-1',
                        text: 'Example Subheading 1.1.1',
                        level: 4,
                        isExpanded: false,
                        children: []
                    },
                    {
                        id: 'example-heading-1-1-2',
                        text: 'Example Subheading 1.1.2',
                        level: 4,
                        isExpanded: false,
                        children: []
                    }
                ]
            },
            {
                id: 'example-heading-1-2',
                text: 'Example Subheading 1.2',
                level: 3,
                isExpanded: false,
                children: []
            }
        ]
    },
    {
        id: 'example-heading-2',
        text: 'Example Heading 2',
        level: 2,
        isExpanded: false,
        children: [
            {
                id: 'example-heading-2-1',
                text: 'Example Subheading 2.1',
                level: 3,
                isExpanded: false,
                children: []
            },
            {
                id: 'example-heading-2-2',
                text: 'Example Subheading 2.2',
                level: 3,
                isExpanded: false,
                children: []
            }
        ]
    },
    {
        id: 'example-heading-3',
        text: 'Example Heading 3',
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
 * Build hierarchical structure from flat headings array
 */
function buildHierarchy(headings: TOCItem[]): TOCItem[] {
    const hierarchy: TOCItem[] = [];
    const stack: TOCItem[] = [];

    headings.forEach((heading) => {
        const level = heading.level;

        // Pop stack until we find the correct parent level
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            stack.pop();
        }

        if (stack.length === 0) {
            // Top level item
            hierarchy.push(heading);
            stack.push(heading);
        } else {
            // Child item
            const parent = stack[stack.length - 1];
            parent.children.push(heading);
            stack.push(heading);
        }
    });

    return hierarchy;
}

/**
 * Render TOC item recursively
 */
function renderTOCItem(
    item: TOCItem,
    listingType: string,
    expandIconType: string,
    expandState: ExpandState,
    onToggle: (id: string) => void
): JSX.Element {
    const hasChildren = item.children.length > 0;
    // When expand icon type is 'none', always show all items expanded
    const isExpanded = expandIconType === 'none' ? true : (expandState[item.id] !== undefined ? expandState[item.id] : item.isExpanded);
    const ListTag = listingType === 'none' ? 'div' : (listingType === 'ol' ? 'ol' : 'ul');
    const ItemTag = listingType === 'none' ? 'div' : 'li';

    return (
        <ItemTag key={item.id} className={`toc-item toc-item--level-${item.level}`}>
            <div className="toc-item__wrapper">
                {hasChildren && expandIconType !== 'none' && (
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
                <span className="toc-item__link">
                    {item.text}
                </span>
            </div>
            {hasChildren && isExpanded && (
                <ListTag className={`toc-list toc-list--level-${item.level + 1}${listingType === 'none' ? ' toc-list--none' : ''}`}>
                    {item.children.map((child) =>
                        renderTOCItem(child, listingType, expandIconType, expandState, onToggle)
                    )}
                </ListTag>
            )}
        </ItemTag>
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
        showHeading,
        hideEmptyMessage,
        customHeadingText,
        headingStyle,
        minHeadingLevel,
        maxHeadingLevel,
    } = attributes;

    // Check if we're in template editor
    const isTemplateEditor = useSelect((select) => {
        const editor = select('core/block-editor') as any;
        if (!editor) return false;

        // Check if we're in template editor context
        const currentPost = select('core/editor')?.getCurrentPost?.();
        if (currentPost && (currentPost.type === 'wp_template' || currentPost.type === 'wp_template_part')) {
            return true;
        }

        // Alternative check via editor settings
        const settings = editor.getSettings?.();
        if (settings && (settings.__experimentalTemplateMode || settings.__experimentalBlockSettings)) {
            // Additional checks can be added here
        }

        return false;
    }, []);

    // Get headings from editor content (only if not in template editor)
    const editorHeadings = useSelect((select) => {
        // If in template editor, return empty to use mock data
        if (isTemplateEditor) {
            return [];
        }

        const editor = select('core/block-editor') as any;
        if (!editor) return [];

        const blocks = editor.getBlocks?.();
        if (!blocks) return [];

        const headings: TOCItem[] = [];

        const extractHeadings = (blocks: any[]) => {
            blocks.forEach((block: any) => {
                // Check if this is a heading block
                if (block.name === 'core/heading') {
                    const level = block.attributes?.level || 2;
                    const content = block.attributes?.content || '';

                    // Filter by min/max level
                    if (level >= minHeadingLevel && level <= maxHeadingLevel) {
                        const text = content.replace(/<[^>]+>/g, '').trim();
                        if (text) {
                            const id = block.attributes?.anchor || `heading-${headings.length}`;
                            headings.push({
                                id,
                                text,
                                level,
                                children: [],
                                isExpanded: false
                            });
                        }
                    }
                }

                // Process inner blocks
                if (block.innerBlocks && block.innerBlocks.length > 0) {
                    extractHeadings(block.innerBlocks);
                }
            });
        };

        extractHeadings(blocks);
        return headings;
    }, [minHeadingLevel, maxHeadingLevel, isTemplateEditor]);

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
        className: `jankx-table-of-content heading-style-${headingStyle}`,
        'data-expand-icon-type': expandIconType,
    });

    // Sync style variant with listingType attribute
    useEffect(() => {
        const className = blockProps.className || attributes.className || '';
        let newListingType: 'ul' | 'ol' | 'none' | null = null;

        if (className.includes('is-style-ul-list')) {
            newListingType = 'ul';
        } else if (className.includes('is-style-ol-list')) {
            newListingType = 'ol';
        } else if (className.includes('is-style-none-list')) {
            newListingType = 'none';
        }

        // Update attribute if style variant changed
        if (newListingType && newListingType !== listingType) {
            setAttributes({ listingType: newListingType });
        }
    }, [blockProps.className, attributes.className, listingType, setAttributes]);

    const ListTag = listingType === 'none' ? 'div' : (listingType === 'ol' ? 'ol' : 'ul');

    // Helper function to filter by level recursively
    const filterByLevel = (item: TOCItem): TOCItem | null => {
        if (item.level < minHeadingLevel || item.level > maxHeadingLevel) {
            return null;
        }
        const filtered: TOCItem = {
            ...item,
            children: item.children
                .map(child => filterByLevel(child))
                .filter((child): child is TOCItem => child !== null)
        };
        return filtered;
    };

    // Build hierarchy from editor headings or use mock data
    // In template editor, always use mock data filtered by min/max level
    const tocData = isTemplateEditor 
        ? MOCK_TOC_DATA.map(item => filterByLevel(item)).filter((item): item is TOCItem => item !== null)
        : (editorHeadings.length > 0 ? buildHierarchy(editorHeadings) : MOCK_TOC_DATA);

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
                    <ToolbarButton
                        icon={list}
                        title={__('No List', 'jankx')}
                        onClick={() => setAttributes({ listingType: 'none' })}
                        isActive={listingType === 'none'}
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

                    <ToggleControl
                        label={__('Hide empty message', 'jankx')}
                        checked={hideEmptyMessage}
                        onChange={(value) => setAttributes({ hideEmptyMessage: value })}
                        help={__('When enabled, the block renders nothing on the frontend if no headings are found.', 'jankx')}
                        __nextHasNoMarginBottom
                    />

                    {showHeading && (
                        <>
                            <TextControl
                                label={__('Custom Heading Text', 'jankx')}
                                value={customHeadingText}
                                onChange={(value) => setAttributes({ customHeadingText: value })}
                                placeholder={__('Table of Contents', 'jankx')}
                                help={__('Leave empty to use default heading text', 'jankx')}
                                __nextHasNoMarginBottom
                                __next40pxDefaultSize
                            />
                            <SelectControl
                                label={__('Heading Style', 'jankx')}
                                value={headingStyle}
                                options={[
                                    { label: __('Underline', 'jankx'), value: 'underline' },
                                    { label: __('Tabbed', 'jankx'), value: 'tabbed' },
                                    { label: __('Bordered', 'jankx'), value: 'bordered' },
                                ]}
                                onChange={(value) => setAttributes({ headingStyle: value as any })}
                                help={__('Choose heading style for table of contents', 'jankx')}
                                __nextHasNoMarginBottom
                                __next40pxDefaultSize
                            />
                        </>
                    )}

                    <RangeControl
                        label={__('Minimum Heading Level', 'jankx')}
                        value={minHeadingLevel}
                        onChange={(value) => {
                            const newMin = value || 1;
                            setAttributes({
                                minHeadingLevel: newMin,
                                maxHeadingLevel: Math.max(newMin, maxHeadingLevel)
                            });
                        }}
                        min={1}
                        max={6}
                        step={1}
                        help={__('Start building TOC from this heading level (H1-H6)', 'jankx')}
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
                        min={1}
                        max={6}
                        step={1}
                        help={__('Stop building TOC at this heading level (H1-H6)', 'jankx')}
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
                            { label: __('No List', 'jankx'), value: 'none' },
                        ]}
                        onChange={(value) => setAttributes({ listingType: value as 'ul' | 'ol' | 'none' })}
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
                            { label: __('None (Don\'t apply)', 'jankx'), value: 'none' },
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
                        <ListTag className={`toc-list toc-list--root${listingType === 'none' ? ' toc-list--none' : ''}`}>
                            {tocData.map((item) =>
                                renderTOCItem(item, listingType, expandIconType, expandState, handleToggle)
                            )}
                        </ListTag>
                    ) : (
                        <div className="toc-placeholder">
                            <p>{__('Table of content will be generated from headings in the post content.', 'jankx')}</p>
                            <p><em>{__('Add headings (H2, H3, H4, etc.) to your post to see the table of content.', 'jankx')}</em></p>
                        </div>
                    )}
                </nav>
            </div>
        </>
    );
}

