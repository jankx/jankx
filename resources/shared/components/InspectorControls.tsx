import { __ } from '@wordpress/i18n';
import { InspectorControls as WPInspectorControls } from '@wordpress/block-editor';
import {
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from '@wordpress/components';
import { ReactNode } from 'react';

interface InspectorControlsProps {
  group?: 'settings' | 'color' | 'typography' | 'layout' | 'spacing' | 'border' | 'effects' | 'advanced' | 'custom-css';
  children: ReactNode;
  useToolsPanel?: boolean;
  toolsPanelLabel?: string;
  resetAll?: () => void;
  dropdownMenuProps?: any;
}

/**
 * Shared InspectorControls component với ToolsPanel support
 * Giống như svg-icon block và core blocks
 */
export default function InspectorControls({
  group = 'settings',
  children,
  useToolsPanel = false,
  toolsPanelLabel,
  resetAll,
  dropdownMenuProps
}: InspectorControlsProps) {
  if (useToolsPanel) {
    return (
      <WPInspectorControls group={group}>
        <ToolsPanel
          label={toolsPanelLabel || __('Settings', 'jankx')}
          resetAll={resetAll}
          dropdownMenuProps={dropdownMenuProps}
        >
          {children}
        </ToolsPanel>
      </WPInspectorControls>
    );
  }

  return (
    <WPInspectorControls group={group}>
      {children}
    </WPInspectorControls>
  );
}

/**
 * Shared ToolsPanelItem component để wrap các controls
 */
export function InspectorToolsPanelItem({
  label,
  children,
  isShownByDefault = true,
  hasValue,
  onDeselect
}: {
  label: string;
  children: ReactNode;
  isShownByDefault?: boolean;
  hasValue?: () => boolean;
  onDeselect?: () => void;
}) {
  return (
    <ToolsPanelItem
      label={label}
      isShownByDefault={isShownByDefault}
      hasValue={hasValue}
      onDeselect={onDeselect}
    >
      {children}
    </ToolsPanelItem>
  );
}

/**
 * Predefined InspectorControls cho các groups phổ biến
 */
export const InspectorGroups = {
  Settings: ({ children, useToolsPanel = false, ...props }: InspectorControlsProps) => (
    <InspectorControls group="settings" useToolsPanel={useToolsPanel} {...props}>
      {children}
    </InspectorControls>
  ),

  Color: ({ children }: { children: ReactNode }) => (
    <InspectorControls group="color">
      {children}
    </InspectorControls>
  ),

  Typography: ({ children }: { children: ReactNode }) => (
    <InspectorControls group="typography">
      {children}
    </InspectorControls>
  ),

  Layout: ({ children }: { children: ReactNode }) => (
    <InspectorControls group="layout">
      {children}
    </InspectorControls>
  ),

  Spacing: ({ children }: { children: ReactNode }) => (
    <InspectorControls group="spacing">
      {children}
    </InspectorControls>
  ),

  Border: ({ children }: { children: ReactNode }) => (
    <InspectorControls group="border">
      {children}
    </InspectorControls>
  ),

  Effects: ({ children }: { children: ReactNode }) => (
    <InspectorControls group="effects">
      {children}
    </InspectorControls>
  ),

  Advanced: ({ children }: { children: ReactNode }) => (
    <InspectorControls group="advanced">
      {children}
    </InspectorControls>
  )
};
