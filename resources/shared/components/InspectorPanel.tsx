import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow } from '@wordpress/components';
import { ReactNode } from 'react';

interface InspectorPanelProps {
  title: string;
  children: ReactNode;
  initialOpen?: boolean;
  icon?: ReactNode;
  className?: string;
}

/**
 * Shared InspectorPanel component để chuẩn hóa các panel
 * Giống như core blocks và svg-icon block
 */
export default function InspectorPanel({
  title,
  children,
  initialOpen = true,
  icon,
  className
}: InspectorPanelProps) {
  return (
    <PanelBody
      title={title}
      icon={icon}
      initialOpen={initialOpen}
      className={className}
    >
      {children}
    </PanelBody>
  );
}

/**
 * Shared InspectorPanelRow component để wrap các controls trong panel
 */
export function InspectorPanelRow({ children }: { children: ReactNode }) {
  return <PanelRow>{children}</PanelRow>;
}

/**
 * Predefined panels cho các use cases phổ biến
 */
export const CommonPanels = {
  Settings: ({ children, initialOpen = true }: { children: ReactNode; initialOpen?: boolean }) => (
    <InspectorPanel
      title={__('Settings', 'jankx')}
      initialOpen={initialOpen}
    >
      {children}
    </InspectorPanel>
  ),

  Typography: ({ children, initialOpen = false }: { children: ReactNode; initialOpen?: boolean }) => (
    <InspectorPanel
      title={__('Typography', 'jankx')}
      initialOpen={initialOpen}
    >
      {children}
    </InspectorPanel>
  ),

  Colors: ({ children, initialOpen = false }: { children: ReactNode; initialOpen?: boolean }) => (
    <InspectorPanel
      title={__('Colors', 'jankx')}
      initialOpen={initialOpen}
    >
      {children}
    </InspectorPanel>
  ),

  Layout: ({ children, initialOpen = false }: { children: ReactNode; initialOpen?: boolean }) => (
    <InspectorPanel
      title={__('Layout', 'jankx')}
      initialOpen={initialOpen}
    >
      {children}
    </InspectorPanel>
  ),

  Spacing: ({ children, initialOpen = false }: { children: ReactNode; initialOpen?: boolean }) => (
    <InspectorPanel
      title={__('Spacing', 'jankx')}
      initialOpen={initialOpen}
    >
      {children}
    </InspectorPanel>
  ),

  Border: ({ children, initialOpen = false }: { children: ReactNode; initialOpen?: boolean }) => (
    <InspectorPanel
      title={__('Border', 'jankx')}
      initialOpen={initialOpen}
    >
      {children}
    </InspectorPanel>
  ),

  Effects: ({ children, initialOpen = false }: { children: ReactNode; initialOpen?: boolean }) => (
    <InspectorPanel
      title={__('Effects', 'jankx')}
      initialOpen={initialOpen}
    >
      {children}
    </InspectorPanel>
  ),

  Advanced: ({ children, initialOpen = false }: { children: ReactNode; initialOpen?: boolean }) => (
    <InspectorPanel
      title={__('Advanced', 'jankx')}
      initialOpen={initialOpen}
    >
      {children}
    </InspectorPanel>
  )
};
