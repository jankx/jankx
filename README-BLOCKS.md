# Gutenberg Blocks Development Guide

## 🚀 Quick Start

### 1. Cài đặt Node.js và npm
Tải và cài đặt Node.js từ: https://nodejs.org/

### 2. Build blocks
```bash
# Chạy script build tự động
./build-blocks.sh

# Hoặc chạy thủ công
npm install
npm run build:widget-renderer
```

### 3. Sử dụng trong WordPress
- Block sẽ tự động được register khi theme được load
- Tìm block "Widget Renderer" trong Gutenberg editor

## 📁 Cấu trúc thư mục

```
resources/blocks/
├── widget-renderer/
│   ├── index.js          # Source code (React/JSX)
│   ├── style.css         # Block styles
│   ├── block.json        # Block configuration
│   └── build/            # Built files (sau khi build)
│       ├── index.js      # Compiled JavaScript
│       └── index.css     # Compiled CSS
```

## 🔧 Development

### Build cho production
```bash
npm run build:widget-renderer
```

### Development mode (watch files)
```bash
npm run dev:widget-renderer
```

### Build tất cả blocks
```bash
npm run build:blocks
```

## 📦 Package Scripts

- `build:widget-renderer`: Build widget-renderer block
- `build:blocks`: Build tất cả blocks
- `dev:widget-renderer`: Development mode cho widget-renderer
- `dev:blocks`: Development mode cho tất cả blocks

## 🎯 Block Features

### Widget Renderer Block
- **Chức năng**: Render WordPress widgets trong Gutenberg blocks
- **Attributes**:
  - `widgetType`: Loại widget (text, search, recent-posts, ...)
  - `widgetId`: ID cụ thể của widget instance
  - `title`: Tiêu đề widget
  - `showTitle`: Hiển thị tiêu đề hay không
  - `className`: CSS class tùy chỉnh

### API Endpoints
- `GET /wp-json/jankx/v1/widgets/available`: Lấy danh sách widgets
- `POST /wp-json/jankx/v1/widgets/preview`: Lấy preview widget

## 🔄 Workflow

1. **Viết code**: Chỉnh sửa `resources/blocks/[block-name]/index.js`
2. **Build**: Chạy `npm run build:[block-name]` hoặc `./build-blocks.sh`
3. **Test**: Vào WordPress editor và test block
4. **Deploy**: Upload theme lên server

## 🛠️ Troubleshooting

### Lỗi "Node.js not found"
- Cài đặt Node.js từ https://nodejs.org/
- Restart terminal sau khi cài

### Lỗi "npm not found"
- Node.js chưa được cài đúng cách
- Kiểm tra PATH environment variable

### Block không hiển thị trong editor
- Kiểm tra file build có được tạo không: `resources/blocks/[block-name]/build/index.js`
- Kiểm tra console browser có lỗi JavaScript không
- Kiểm tra block.json có đúng cấu hình không

### API endpoints không hoạt động
- Kiểm tra WordPress REST API có được enable không
- Kiểm tra user có quyền `edit_posts` không
- Kiểm tra console browser có lỗi network không

## 📚 Tài liệu tham khảo

- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [@wordpress/scripts Documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [Block Development Tutorial](https://developer.wordpress.org/block-editor/getting-started/create-block/)