# Shared Components

Thư viện các component dùng chung cho Gutenberg blocks trong Jankx theme.

## ResponsiveControl

Component để tạo responsive controls cho các thuộc tính có giá trị khác nhau trên Desktop, Tablet và Mobile.

### Usage

```tsx
import { ResponsiveControl, ResponsiveValue } from '../../shared/components';

function MyBlockEdit({ attributes, setAttributes }) {
    const { columns, columnsTablet, columnsMobile } = attributes;

    return (
        <ResponsiveControl
            label={__('Columns', 'jankx')}
            values={{
                desktop: columns,
                tablet: columnsTablet,
                mobile: columnsMobile
            }}
            onChange={(values) => setAttributes({
                columns: values.desktop,
                columnsTablet: values.tablet,
                columnsMobile: values.mobile
            })}
            min={1}
            max={6}
            help={{
                desktop: __('Số cột trên màn hình lớn (>1024px)', 'jankx'),
                tablet: __('Số cột trên tablet (768px - 1024px)', 'jankx'),
                mobile: __('Số cột trên mobile (<768px)', 'jankx')
            }}
        />
    );
}
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | Nhãn hiển thị cho control |
| `values` | `ResponsiveValue` | Yes | - | Object chứa giá trị cho desktop, tablet, mobile |
| `onChange` | `(values: ResponsiveValue) => void` | Yes | - | Callback khi giá trị thay đổi |
| `min` | `number` | No | `1` | Giá trị tối thiểu |
| `max` | `number` | No | `6` | Giá trị tối đa |
| `step` | `number` | No | `1` | Bước nhảy |
| `help` | `object` | No | `{}` | Object chứa help text cho mỗi device |
| `className` | `string` | No | `''` | CSS class tùy chỉnh |

### Types

```typescript
export interface ResponsiveValue {
    desktop: number;
    tablet: number;
    mobile: number;
}

export interface ResponsiveControlProps {
    label: string;
    values: ResponsiveValue;
    onChange: (values: ResponsiveValue) => void;
    min?: number;
    max?: number;
    step?: number;
    help?: {
        desktop?: string;
        tablet?: string;
        mobile?: string;
    };
    className?: string;
}
```

### Features

- ✅ UI toggle giữa Desktop (🖥️), Tablet (📱), Mobile (📱)
- ✅ RangeControl riêng cho mỗi device
- ✅ Help text riêng cho mỗi device
- ✅ Tùy chỉnh min, max, step
- ✅ TypeScript support
- ✅ Reusable cho bất kỳ block nào

### Example với block.json

```json
{
    "attributes": {
        "columns": {
            "type": "number",
            "default": 3
        },
        "columnsTablet": {
            "type": "number",
            "default": 2
        },
        "columnsMobile": {
            "type": "number",
            "default": 1
        }
    }
}
```

### Example CSS variables

```scss
.my-block {
    --columns-desktop: 3;
    --columns-tablet: 2;
    --columns-mobile: 1;

    display: grid;
    grid-template-columns: repeat(var(--columns-desktop), 1fr);

    @media (max-width: 1024px) {
        grid-template-columns: repeat(var(--columns-tablet), 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: repeat(var(--columns-mobile), 1fr);
    }
}
```

### PHP Side - Inline Styles

```php
// Build inline styles for responsive columns
$inline_styles = [];
if (!empty($attributes['columns'])) {
    $inline_styles[] = '--columns-desktop: ' . intval($attributes['columns']);
}
if (!empty($attributes['columnsTablet'])) {
    $inline_styles[] = '--columns-tablet: ' . intval($attributes['columnsTablet']);
}
if (!empty($attributes['columnsMobile'])) {
    $inline_styles[] = '--columns-mobile: ' . intval($attributes['columnsMobile']);
}

$wrapper_attributes = get_block_wrapper_attributes([
    'style' => !empty($inline_styles) ? implode('; ', $inline_styles) : '',
]);
```

## useResponsiveValue (Hook)

Custom hook để quản lý responsive values (dành cho future use).

### Usage

```tsx
import { useResponsiveValue } from '../../shared/components';

function MyComponent() {
    const { values, updateValue, updateValues, resetToDefaults } = useResponsiveValue({
        desktop: 3,
        tablet: 2,
        mobile: 1
    });

    return (
        <div>
            <button onClick={() => updateValue('desktop', 4)}>
                Set Desktop to 4
            </button>
            <button onClick={() => updateValues({ desktop: 5, tablet: 3 })}>
                Update Multiple
            </button>
            <button onClick={() => resetToDefaults({ desktop: 3, tablet: 2, mobile: 1 })}>
                Reset
            </button>
        </div>
    );
}
```

---

## Contributing

Khi tạo component mới, đảm bảo:
1. ✅ TypeScript types đầy đủ
2. ✅ Props documentation
3. ✅ Usage examples
4. ✅ Reusable và không phụ thuộc vào business logic cụ thể
5. ✅ Export đúng cách trong `index.ts`