# Smart Tabs Block

Block tạo tabs tương tác với layout và style có thể tùy chỉnh cho WordPress Gutenberg.

## Tính năng

### ✨ Tính năng chính

- **Layout linh hoạt**: Hỗ trợ hiển thị tabs theo chiều ngang (horizontal) hoặc chiều dọc (vertical)
- **Style đa dạng**: 4 kiểu style khác nhau (Default, Minimal, Modern, Boxed)
- **Quản lý tabs dễ dàng**: Thêm/xóa tabs trực tiếp từ editor
- **Icon support**: Hỗ trợ icon cho mỗi tab với nhiều tùy chọn
- **Click-to-edit**: Click vào tab trong editor để chỉnh sửa nội dung
- **Nested blocks**: Mỗi tab có thể chứa bất kỳ block nào

### 🎨 Style Types

1. **Default**: Style mặc định với border bottom
2. **Minimal**: Style tối giản
3. **Modern**: Style hiện đại với background và bo tròn
4. **Boxed**: Style dạng box với border

## Cách sử dụng

### 1. Thêm block

Trong editor, tìm kiếm "Smart Tabs" và thêm vào bài viết.

### 2. Cấu hình tabs

#### Trong Inspector Controls (Sidebar):

**Tab Settings:**
- **Tab Type**: Chọn hiển thị ngang (horizontal) hoặc dọc (vertical)
- **Style Type**: Chọn một trong 4 style (default, minimal, modern, boxed)

#### Trong Block Toolbar:

- Click nút **"Add Tab"** để thêm tab mới

### 3. Chỉnh sửa nội dung tab

1. Click vào tab header trong editor
2. Nội dung của tab sẽ được hiển thị
3. Thêm bất kỳ block nào bạn muốn vào trong tab

## Smart Tab (Individual Tab)

### Icon Settings

Mỗi tab có thể có icon với các tùy chọn:

1. **Icon Type**:
   - None: Không có icon
   - SVG Code: Paste SVG code trực tiếp
   - Icon Picker: Chọn từ thư viện icon

2. **Icon Position**: Before (trước) hoặc After (sau) text

3. **Icon Size**: Kích thước icon (mặc định 16px)

4. **Icon Color**: Màu của icon

### Tab Title

- Nhập tiêu đề tab trong field "Tab Title" ở Inspector Controls
- Hoặc chỉnh sửa trực tiếp trong editor

## Ví dụ sử dụng

### Ví dụ 1: Tabs ngang cơ bản

```
Smart Tabs (Tab Type: Horizontal, Style: Default)
├─ Smart Tab: "Giới thiệu"
│  ├─ Paragraph: "Nội dung giới thiệu..."
│  └─ Image
├─ Smart Tab: "Tính năng"
│  ├─ Heading: "Tính năng nổi bật"
│  └─ List
└─ Smart Tab: "Liên hệ"
   └─ Contact Form
```

### Ví dụ 2: Tabs dọc với icons

```
Smart Tabs (Tab Type: Vertical, Style: Modern)
├─ Smart Tab: "Dashboard" (Icon: dashboard icon)
│  └─ Dashboard content
├─ Smart Tab: "Settings" (Icon: settings icon)
│  └─ Settings panels
└─ Smart Tab: "Profile" (Icon: user icon)
   └─ Profile form
```

## Technical Details

### Block Attributes

**Smart Tabs:**
- `tabType`: 'horizontal' | 'vertical'
- `styleType`: 'default' | 'minimal' | 'modern' | 'boxed'
- `activeTab`: number (tab index hiện tại)

**Smart Tab:**
- `title`: string (tiêu đề tab)
- `iconType`: 'none' | 'svg' | 'picker'
- `icon`: string (SVG code)
- `iconPosition`: 'before' | 'after'
- `iconSize`: string (e.g., '16px')
- `iconColor`: string (hex color)

### Frontend Behavior

- Tabs sẽ tự động active khi click
- Hỗ trợ keyboard navigation (Arrow keys)
- Smooth animation khi chuyển tab
- ARIA attributes cho accessibility

## Customization

### CSS Classes

Các class có thể override để tùy chỉnh style:

```scss
.smart-tabs { /* Container */ }
.smart-tabs--horizontal { /* Horizontal layout */ }
.smart-tabs--vertical { /* Vertical layout */ }
.smart-tabs--style-minimal { /* Minimal style */ }
.smart-tabs--style-modern { /* Modern style */ }
.smart-tabs--style-boxed { /* Boxed style */ }
.smart-tabs__navigation { /* Navigation wrapper */ }
.smart-tabs__nav-list { /* Nav list */ }
.smart-tabs__nav-item { /* Individual nav item */ }
.smart-tabs__nav-item.is-active { /* Active nav item */ }
.smart-tabs__content { /* Content wrapper */ }
.smart-tab { /* Individual tab panel */ }
.smart-tab.is-active { /* Active tab panel */ }
```

## Browser Support

- Chrome/Edge: ✅ Latest
- Firefox: ✅ Latest
- Safari: ✅ Latest
- IE11: ❌ Not supported

## Version

- **Version**: 1.0.0
- **Required WordPress**: 6.0+
- **Required PHP**: 7.4+

