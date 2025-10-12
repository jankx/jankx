/**
 * TypeScript type definitions for Smart Tab block
 */

export type IconType = 'none' | 'svg' | 'picker';
export type IconPosition = 'before' | 'after';

export interface SmartTabAttributes {
    title: string;
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

