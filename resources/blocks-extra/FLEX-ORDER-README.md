# Jankx Advanced Settings - Flex Order

## Tổng quan

Tính năng **Flex Order** đã được thêm vào **Jankx Advanced Settings**, cho phép bạn sắp xếp thứ tự hiển thị của các block trong flex/grid container trên các thiết bị khác nhau.

## Tính năng

- ✅ Hỗ trợ responsive với 3 breakpoints:
  - **Desktop** (> 1024px)
  - **Tablet** (768px - 1024px)
  - **Mobile** (< 768px)
- ✅ Giá trị từ -10 đến 20
- ✅ Tự động áp dụng CSS `order` property
- ✅ Chỉ hoạt động khi parent block có `display: flex` hoặc `display: grid`

## Cách sử dụng

### 1. Mở Jankx Advanced Settings

1. Chọn bất kỳ block nào trong Gutenberg Editor
2. Mở sidebar bên phải (Block Settings)
3. Tìm panel **"Jankx Advanced Settings"**
4. Click để mở rộng panel

### 2. Thiết lập Flex Order

1. Trong panel **Dimensions**, tìm option **"Flex Order (Responsive)"**
2. Click vào option để kích hoạt
3. Chọn thiết bị muốn thiết lập (Desktop 🖥️ / Tablet 📱 / Mobile 📱)
4. Kéo thanh trượt để chọn giá trị order (-10 đến 20)

### 3. Ví dụ sử dụng

#### Ví dụ 1: Đảo ngược thứ tự 2 cột trên mobile

```
Desktop: [Cột A] [Cột B]
Mobile:  [Cột B] [Cột A]
```

**Thiết lập:**
- Cột A: Flex Order Desktop = 1, Mobile = 2
- Cột B: Flex Order Desktop = 2, Mobile = 1

#### Ví dụ 2: Đưa sidebar lên đầu trên mobile

```
Desktop: [Content] [Sidebar]
Mobile:  [Sidebar] [Content]
```

**Thiết lập:**
- Content: Flex Order Desktop = 1, Mobile = 2
- Sidebar: Flex Order Desktop = 2, Mobile = 1

## Breakpoints chuẩn Jankx

Tính năng này sử dụng breakpoints chuẩn của Jankx:

- **Desktop**: `@media (min-width: 1025px)` - Giá trị mặc định
- **Tablet**: `@media (max-width: 1024px)` - Fallback về Desktop nếu không set
- **Mobile**: `@media (max-width: 768px)` - Fallback về Tablet → Desktop

## CSS Variables

Khi sử dụng Flex Order, các CSS variables sau sẽ được tạo:

```css
--jankx-flex-order-desktop: <value>;
--jankx-flex-order-tablet: <value>;
--jankx-flex-order-mobile: <value>;
```

## CSS Classes

Block sẽ tự động nhận các classes:

```css
.has-jankx-responsive-dimensions
.has-jankx-flex-order
```

## Lưu ý quan trọng

⚠️ **Flex Order chỉ hoạt động khi:**
- Parent block có `display: flex` hoặc `display: grid`
- Nếu parent không phải flex/grid container, giá trị order sẽ không có tác dụng

💡 **Tips:**
- Giá trị càng nhỏ, block sẽ hiển thị càng sớm
- Giá trị mặc định là `0` nếu không set
- Có thể dùng giá trị âm để đưa block lên đầu

## Attributes

Các attributes được thêm vào block:

```typescript
{
  jankxFlexOrderDesktop: number,  // -10 to 20
  jankxFlexOrderTablet: number,   // -10 to 20
  jankxFlexOrderMobile: number    // -10 to 20
}
```

## Tích hợp với các tính năng khác

Flex Order hoạt động cùng với các tính năng responsive khác trong Jankx Advanced Settings:

- ✅ Padding (Responsive)
- ✅ Margin (Responsive)
- ✅ Flex Order (Responsive) ← **MỚI**

## Changelog

### Version 2.0.0
- ✨ Thêm Flex Order (Responsive) vào Jankx Advanced Settings
- 🎨 Hỗ trợ 3 breakpoints: Desktop, Tablet, Mobile
- 📱 Tích hợp với hệ thống responsive dimensions hiện có
