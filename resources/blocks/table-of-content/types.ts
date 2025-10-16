/**
 * TypeScript type definitions for Table of Content block
 * Strict mode - no null or any types
 */

export type ListingType = 'ul' | 'ol';
export type ExpandIconType = 'plus-minus' | 'chevron' | 'arrow' | 'caret';

export interface TOCItem {
    id: string;
    text: string;
    level: number;
    children: TOCItem[];
    isExpanded: boolean;
}

export interface TableOfContentAttributes {
    listingType: ListingType;
    expandIconType: ExpandIconType;
    defaultExpanded: boolean;
    expandFirstItem: boolean;
    showNumbers: boolean;
    showHeading: boolean;
    customHeadingText: string;
    minHeadingLevel: number;
    maxHeadingLevel: number;
    className: string;
    anchor: string;
}

export interface TableOfContentProps {
    attributes: TableOfContentAttributes;
    setAttributes: (attrs: Partial<TableOfContentAttributes>) => void;
    clientId: string;
}

export interface ExpandState {
    [key: string]: boolean;
}

