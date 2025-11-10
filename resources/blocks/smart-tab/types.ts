/**
 * TypeScript type definitions for Smart Tab block
 */

export type IconType = 'none' | 'svg' | 'picker';
export type IconPosition = 'before' | 'after';

export interface SmartTabAttributes {
    title: string;
    trigger: string;
    triggerSettings?: Record<string, unknown>;
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

declare global {
    interface Window {
        JankxSmartTabTriggers?: {
            items: Record<string, SmartTabTriggerConfig>;
        };
    }
}


