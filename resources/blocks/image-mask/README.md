# Image Mask Block

Một Gutenberg block mạnh mẽ để tạo hiệu ứng mask sáng tạo cho hình ảnh với các hiệu ứng như wave, corner blend, và các hình dạng tùy chỉnh.

## ✨ Tính năng

### 🎭 Các loại Mask có sẵn:

1. **Wave Mask** - Hiệu ứng sóng
   - Hướng: Top, Bottom, Left, Right
   - Điều chỉnh chiều cao sóng
   - Điều chỉnh tần số sóng

2. **Corner Blend** - Góc ảnh trùng với màu nền
   - Vị trí: Top-left, Top-right, Bottom-left, Bottom-right
   - Điều chỉnh kích thước góc
   - Màu nền tùy chỉnh

3. **Circle Mask** - Mask hình tròn
   - Hiệu ứng fade từ trong ra ngoài
   - Màu nền tùy chỉnh

4. **Triangle Mask** - Mask hình tam giác
   - Vị trí ở giữa dưới
   - Màu nền tùy chỉnh

5. **Custom SVG** - Mask tùy chỉnh
   - Nhập SVG path data
   - Tạo hình dạng độc đáo

### 🎨 Tùy chỉnh:

- **Màu nền**: Chọn màu và độ trong suốt
- **Kích thước**: Điều chỉnh các thông số mask
- **Responsive**: Tự động điều chỉnh trên mobile
- **Hover effects**: Hiệu ứng khi di chuột

## 🚀 Cách sử dụng

### 1. Thêm Block
- Trong Gutenberg editor, tìm "Image Mask"
- Hoặc gõ `/image-mask` trong block inserter

### 2. Chọn Hình ảnh
- Click "Choose Image" để upload hoặc chọn từ media library
- Hình ảnh sẽ hiển thị preview

### 3. Cấu hình Mask
- Mở **Block Settings** (sidebar bên phải)
- Chọn loại mask mong muốn
- Điều chỉnh các thông số
- Chọn màu nền phù hợp

### 4. Preview và Publish
- Xem preview trong editor
- Điều chỉnh cho đến khi hài lòng
- Publish hoặc Update

## 📱 Responsive

Block tự động điều chỉnh:
- **Desktop**: Hiển thị đầy đủ hiệu ứng
- **Tablet**: Giảm kích thước mask 10%
- **Mobile**: Giảm kích thước mask 20%

## 🎯 Ví dụ sử dụng

### Wave Effect cho Hero Section
```
Mask Type: Wave
Direction: Bottom
Height: 80px
Frequency: 4
Background: #f8f9fa
```

### Corner Blend cho Product Images
```
Mask Type: Corner
Position: Bottom-right
Size: 120px
Background: #ffffff
```

### Circle Mask cho Profile Photos
```
Mask Type: Circle
Background: rgba(0,0,0,0.8)
```

## 🔧 Technical Details

### CSS Variables
Block sử dụng CSS custom properties:
```css
--mask-type: wave|corner|circle|triangle|custom
--wave-direction: top|bottom|left|right
--wave-height: [number]px
--wave-frequency: [number]
--corner-position: top-left|top-right|bottom-left|bottom-right
--corner-size: [number]px
--background-color: [color]
```

### Browser Support
- **Modern browsers**: Full support với CSS masks và clip-path
- **Fallback**: Hiển thị hình ảnh bình thường nếu không hỗ trợ

## 🐛 Troubleshooting

### Mask không hiển thị
- Kiểm tra browser support
- Đảm bảo hình ảnh đã được chọn
- Kiểm tra CSS variables

### Hiệu ứng bị lỗi
- Refresh trang
- Kiểm tra console errors
- Đảm bảo block được đăng ký đúng

### Performance issues
- Giảm kích thước hình ảnh
- Sử dụng ít mask effects
- Tối ưu hóa hình ảnh

## 📁 File Structure

```
jankx/resources/blocks/image-mask/
├── block.json              # Block configuration
├── index.js                # React component
├── style.css               # Frontend styles
├── editor.css              # Editor styles
└── README.md               # This file
```

## 🔗 Dependencies

- WordPress 5.0+
- Gutenberg editor
- Modern browser với CSS mask support
- Jankx framework

## 📝 Changelog

### Version 1.0.0
- Initial release
- 5 mask types
- Responsive design
- Hover effects
- Color customization

## 🤝 Contributing

Để đóng góp:
1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

GPL v2 hoặc mới hơn
