/**
 * TypeScript type definitions for Smart Tab block
 */

export type IconType = 'none' | 'svg' | 'picker';
export type IconPosition = 'before' | 'after';

export interface SmartTabAttributes {
    title: string;
    trigger: string;
    triggerSettings?: Record<string, unknown>;
    postsCount?: number;
    iconType: IconType;
    icon: string;
    iconName: string;
    iconSet: string;
    iconPosition: IconPosition;
    iconSize: string;
    iconColor: string;
    tabId?: string;
    // Normal Tab Style
    normalTabTextColor?: string;
    normalTabBackgroundColor?: string;
    normalTabGradient?: string;
    // Active Tab Style
    activeTabTextColor?: string;
    activeTabBackgroundColor?: string;
    activeTabGradient?: string;
    // Tab Content Style
    contentTextColor?: string;
    contentBackgroundColor?: string;
    contentGradient?: string;
    style?: any;
}

export interface SmartTabProps {
    attributes: SmartTabAttributes;
    setAttributes: (attrs: Partial<SmartTabAttributes>) => void;
    clientId: string;
    context?: {
        'jankx/smartTabsId'?: string;
        'jankx/activeTab'?: number;
    };
}

export interface SmartTabTriggerConfig {
    key: string;
    label: string;
    description: string;
    previewTitle: string;
    supports?: {
        customTitle?: boolean;
        customContent?: boolean;
        icon?: boolean;
    };
    settingsSchema?: Array<Record<string, unknown>>;
}

export interface AdvancedFilterBlock {
    id: string;
    clientId: string;
    attributes: Record<string, unknown>;
}

export interface AdvancedFilter {
    filterType: 'taxonomy' | 'meta' | 'price' | 'date' | 'author' | 'keyword';
    filterIndex: number;
    filterId: string;
    label: string;
    enabled?: boolean;
    taxonomy?: string;
    metaKey?: string;
    placeholder?: string;
    minPrice?: string;
    maxPrice?: string;
    currency?: string;
    dateField?: string;
    dateRange?: boolean;
    showCount?: boolean;
    listingType?: 'ul' | 'ol' | 'none';
    postsCount?: number;
    [key: string]: unknown;
}

export interface Term {
    id: number;
    name: string;
    count?: number;
    slug: string;
}

export interface Author {
    id: number;
    name: string;
    slug: string;
}

declare global {
    interface Window {
        JankxSmartTabTriggers?: {
            items: Record<string, SmartTabTriggerConfig>;
        };
        jankx?: {
            nonce?: string;
        };
        wp?: {
            data?: {
                select: (store: string) => {
                    getBlocks: () => Block[];
                    getBlockIndex: (clientId: string) => number;
                };
                subscribe: (callback: () => void) => () => void;
            };
            apiFetch?: (options: { path: string }) => Promise<unknown[]>;
        };
    }
}

interface Block {
    name: string;
    clientId: string;
    attributes?: Record<string, unknown>;
    innerBlocks?: Block[];
}


