# Shared Components cho InspectorControls

Bộ shared components này được thiết kế để chuẩn hóa cấu trúc InspectorControls trong các blocks, giống như core blocks và svg-icon block.

## Các Components Chính

### 1. InspectorControls
Wrapper cho WordPress InspectorControls với support ToolsPanel.

```tsx
import { InspectorGroups } from '../../shared/components';

// Sử dụng ToolsPanel (giống svg-icon block)
<InspectorGroups.Settings useToolsPanel={true} resetAll={resetAll}>
  <InspectorToolsPanelItem
    label="Setting Name"
    isShownByDefault={true}
    hasValue={() => hasCustomValue}
    onDeselect={() => resetToDefault()}
  >
    <YourControl />
  </InspectorToolsPanelItem>
</InspectorGroups.Settings>

// Sử dụng PanelBody thông thường
<InspectorGroups.Settings>
  <PanelBody title="Settings">
    <YourControl />
  </PanelBody>
</InspectorGroups.Settings>
```

### 2. InspectorPanel
Wrapper cho PanelBody với các predefined panels.

```tsx
import { CommonPanels } from '../../shared/components';

<CommonPanels.Settings initialOpen={true}>
  <YourControls />
</CommonPanels.Settings>

<CommonPanels.Typography initialOpen={false}>
  <TypographyControls />
</CommonPanels.Typography>

<CommonPanels.Colors initialOpen={false}>
  <ColorControls />
</CommonPanels.Colors>
```

### 3. InspectorTabs
Component để tạo cấu trúc tabs giống core blocks.

```tsx
import { InspectorTabs } from '../../shared/components';

<InspectorTabs
  showSettings={true}
  showColor={true}
  showTypography={true}
  showAdvanced={true}
>
  {/* Settings content */}
</InspectorTabs>
```

## Cấu trúc Groups

Các groups được hỗ trợ:
- `settings` - Cài đặt cơ bản
- `color` - Màu sắc
- `typography` - Typography
- `layout` - Layout
- `spacing` - Spacing
- `border` - Border
- `effects` - Effects
- `advanced` - Advanced
- `custom-css` - Custom CSS

## Ví dụ Sử Dụng

### Block đơn giản
```tsx
import { InspectorGroups, InspectorToolsPanelItem } from '../../shared/components';

const Edit = ({ attributes, setAttributes }) => {
  const resetAll = () => {
    setAttributes({
      // Reset về giá trị mặc định
    });
  };

  return (
    <div {...blockProps}>
      <InspectorGroups.Settings useToolsPanel={true} resetAll={resetAll}>
        <InspectorToolsPanelItem
          label="Setting Name"
          isShownByDefault={true}
          hasValue={() => attributes.setting !== 'default'}
          onDeselect={() => setAttributes({ setting: 'default' })}
        >
          <SelectControl
            label="Setting"
            value={attributes.setting}
            onChange={(value) => setAttributes({ setting: value })}
            options={[...]}
          />
        </InspectorToolsPanelItem>
      </InspectorGroups.Settings>
    </div>
  );
};
```

### Block phức tạp với nhiều tabs
```tsx
import { InspectorGroups, CommonPanels } from '../../shared/components';

const Edit = ({ attributes, setAttributes }) => {
  return (
    <div {...blockProps}>
      {/* Settings Tab */}
      <InspectorGroups.Settings>
        <CommonPanels.Settings>
          <BasicSettings />
        </CommonPanels.Settings>
      </InspectorGroups.Settings>

      {/* Color Tab */}
      <InspectorGroups.Color>
        <CommonPanels.Colors>
          <ColorControls />
        </CommonPanels.Colors>
      </InspectorGroups.Color>

      {/* Typography Tab */}
      <InspectorGroups.Typography>
        <CommonPanels.Typography>
          <TypographyControls />
        </CommonPanels.Typography>
      </InspectorGroups.Typography>

      {/* Advanced Tab */}
      <InspectorGroups.Advanced>
        <CommonPanels.Advanced>
          <AdvancedControls />
        </CommonPanels.Advanced>
      </InspectorGroups.Advanced>
    </div>
  );
};
```

## Lợi ích

1. **Chuẩn hóa**: Tất cả blocks có cấu trúc InspectorControls giống nhau
2. **DRY**: Tránh lặp lại code
3. **Consistency**: UI/UX nhất quán với core blocks
4. **Maintainability**: Dễ bảo trì và cập nhật
5. **TypeScript**: Hỗ trợ TypeScript đầy đủ

## Migration Guide

Để migrate từ InspectorControls cũ:

1. Thay `InspectorControls` bằng `InspectorGroups.Settings`
2. Thay `PanelBody` bằng `CommonPanels.Settings`
3. Wrap controls trong `InspectorToolsPanelItem` nếu sử dụng ToolsPanel
4. Thêm `resetAll` function và `hasValue`/`onDeselect` cho ToolsPanel
