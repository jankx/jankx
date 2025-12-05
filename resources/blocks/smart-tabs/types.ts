/**
 * TypeScript type definitions for Smart Tabs block
 */

export type TabType = 'horizontal' | 'vertical';
export type StyleType = 'default' | 'minimal' | 'modern' | 'boxed' | 'bordered';
export type TabAlignment = 'left' | 'center' | 'right' | 'justify';

export interface SmartTabsAttributes {
    tabType: TabType;
    styleType: StyleType;
    activeTab: number;
    tabAlignment: TabAlignment;
    tabItemTextColor?: string;
    tabItemBackgroundColor?: string;
    tabItemGradient?: string;
    activeTabTextColor?: string;
    activeTabBackgroundColor?: string;
    activeTabGradient?: string;
    hideTabsNavigation?: boolean;
    label?: string;
    showLabel?: boolean;
    className?: string;
    anchor?: string;
}

export interface SmartTabsProps {
    attributes: SmartTabsAttributes;
    setAttributes: (attrs: Partial<SmartTabsAttributes>) => void;
    clientId: string;
}

export interface TabItem {
    clientId: string;
    title: string;
    trigger?: string;
    previewTitle?: string;
    icon?: string;
    iconType?: string;
    normalTabTextColor?: string;
    normalTabBackgroundColor?: string;
    normalTabGradient?: string;
    activeTabTextColor?: string;
    activeTabBackgroundColor?: string;
    activeTabGradient?: string;
    contentTextColor?: string;
    contentBackgroundColor?: string;
    contentGradient?: string;
}

