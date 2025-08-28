import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { ReactNode } from 'react';

interface InspectorTabsProps {
  children: ReactNode;
  showSettings?: boolean;
  showColor?: boolean;
  showAdvanced?: boolean;
  showTypography?: boolean;
  showLayout?: boolean;
  showSpacing?: boolean;
  showBorder?: boolean;
  showEffects?: boolean;
  showCustomCSS?: boolean;
}

/**
 * Shared InspectorTabs component để chuẩn hóa cấu trúc tabs
 * Giống như core blocks và svg-icon block
 */
export default function InspectorTabs({
  children,
  showSettings = true,
  showColor = true,
  showAdvanced = true,
  showTypography = false,
  showLayout = false,
  showSpacing = false,
  showBorder = false,
  showEffects = false,
  showCustomCSS = false
}: InspectorTabsProps) {
  return (
    <>
      {showSettings && (
        <InspectorControls group="settings">
          {children}
        </InspectorControls>
      )}

      {showColor && (
        <InspectorControls group="color">
          {/* Color controls sẽ được truyền qua children */}
        </InspectorControls>
      )}

      {showTypography && (
        <InspectorControls group="typography">
          {/* Typography controls */}
        </InspectorControls>
      )}

      {showLayout && (
        <InspectorControls group="layout">
          {/* Layout controls */}
        </InspectorControls>
      )}

      {showSpacing && (
        <InspectorControls group="spacing">
          {/* Spacing controls */}
        </InspectorControls>
      )}

      {showBorder && (
        <InspectorControls group="border">
          {/* Border controls */}
        </InspectorControls>
      )}

      {showEffects && (
        <InspectorControls group="effects">
          {/* Effects controls */}
        </InspectorControls>
      )}

      {showAdvanced && (
        <InspectorControls group="advanced">
          {/* Advanced controls */}
        </InspectorControls>
      )}

      {showCustomCSS && (
        <InspectorControls group="custom-css">
          {/* Custom CSS controls */}
        </InspectorControls>
      )}
    </>
  );
}
