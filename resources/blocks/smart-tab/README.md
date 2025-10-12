# Smart Tab Block

Block đại diện cho một tab đơn lẻ trong Smart Tabs container. Block này **chỉ có thể được sử dụng bên trong Smart Tabs block**.

## Tính năng

- ✅ Hỗ trợ icon với nhiều tùy chọn (SVG, Icon Picker)
- ✅ Chấp nhận mọi loại inner blocks
- ✅ Tùy chỉnh icon position, size, color
- ✅ Tích hợp với Smart Tabs parent block
- ✅ Click-to-edit trong editor

## Không thể sử dụng độc lập

Smart Tab block **phải** nằm bên trong Smart Tabs block. Nếu cố gắng thêm Smart Tab ở nơi khác, block sẽ không hoạt động đúng.

## Cấu hình

### Tab Settings

- **Tab Title**: Tiêu đề hiển thị trên tab header

### Icon Settings

1. **Icon Type**:
   - **None**: Không hiển thị icon
   - **SVG Code**: Dán mã SVG trực tiếp
   - **Icon Picker**: Chọn từ thư viện icon có sẵn

2. **Icon Position**:
   - **Before**: Icon hiển thị trước text
   - **After**: Icon hiển thị sau text

3. **Icon Size**: Kích thước icon (mặc định: 16px)

4. **Icon Color**: Màu sắc icon

## Content

Mỗi Smart Tab có thể chứa:
- Paragraphs
- Headings
- Images
- Lists
- Tables
- Groups
- Columns
- Bất kỳ block nào khác

## Attributes

```typescript
{
  title: string;          // Tiêu đề tab
  iconType: 'none' | 'svg' | 'picker';
  icon: string;           // SVG code
  iconName: string;       // Tên icon (khi dùng picker)
  iconSet: string;        // Icon set (material, etc.)
  iconPosition: 'before' | 'after';
  iconSize: string;       // e.g., '16px', '20px'
  iconColor: string;      // Hex color
  tabId: string;          // Internal ID
}
```

## Ví dụ

```
Smart Tabs
├─ Smart Tab: "Overview" (icon: dashboard)
│  ├─ Heading: "Welcome"
│  ├─ Paragraph: "Description..."
│  └─ Image
└─ Smart Tab: "Details" (icon: info)
   ├─ Columns
   │  ├─ Column: Content 1
   │  └─ Column: Content 2
   └─ Button
```

## Parent Context

Smart Tab nhận context từ Smart Tabs:
- `jankx/smartTabsId`: ID của parent tabs
- `jankx/activeTab`: Index của tab đang active

## Frontend Behavior

- Tab content chỉ hiển thị khi tab active
- Smooth animation khi switch tabs
- Hidden tabs không render (display: none)

## See Also

- [Smart Tabs README](../smart-tabs/README.md)

