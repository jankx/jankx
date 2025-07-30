# Designer Documentation

> **Hướng dẫn dành cho Designer: Từ thiết kế đến WordPress Theme với Jankx 2.0 (Development)**

Thư mục này cung cấp tài liệu cho designer về quy trình chuyển đổi thiết kế (Figma/HTML) thành theme WordPress, sử dụng hệ thống Jankx 2.0 đang trong giai đoạn phát triển.

## 🚧 Development Status

**⚠️ Lưu ý:** Các designer tools trong Jankx 2.0 hiện đang trong giai đoạn **phát triển** (Development). Một số tính năng có thể chưa hoàn thiện.

### Current Status:
- 🔄 **Figma Integration**: Đang phát triển
- 🔄 **Design Token Generator**: Đang phát triển  
- 🔄 **Component Library**: Đang phát triển
- 🔄 **Visual Page Builder**: Đang phát triển
- 🔄 **CLI Tools**: Đang phát triển

## 📚 Nội dung chính

### ✅ Ready (Hoàn thành)
- [Design System](./design-system.md): Hệ thống thiết kế, design tokens, component library
- [Quick Start](./quick-start.md): Hướng dẫn nhanh cho designer bắt đầu với Jankx 2.0

### 🔄 In Development (Đang phát triển)
- [Advanced Workflow](./advanced-workflow.md): Quy trình nâng cao, tối ưu hóa chuyển đổi thiết kế
- [Speed Optimization](./speed-optimization.md): Tối ưu tốc độ và hiệu suất khi chuyển đổi thiết kế
- [Designer Workflow](./workflow.md): Quy trình làm việc chi tiết từ Figma/HTML sang theme

## 🎯 Mục tiêu
- Hỗ trợ designer chuyển đổi thiết kế thành theme WordPress một cách nhanh chóng, chính xác
- Đảm bảo tính nhất quán, dễ bảo trì và tối ưu hiệu suất
- Tận dụng tối đa các công cụ tự động hóa và hệ sinh thái Gutenberg

## 🔧 Current Workarounds

### Manual Design Conversion
```bash
# Hiện tại cần thực hiện thủ công
# 1. Export design từ Figma
# 2. Convert thành HTML/CSS
# 3. Integrate với Jankx 2.0 framework
# 4. Test và optimize
```

### Design Token Management
```scss
// Manual design tokens (hiện tại)
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --font-family: 'Inter', sans-serif;
  --spacing-base: 1rem;
}
```

## 🚀 Roadmap

### Phase 1: Core Design System ✅
- [x] Design token structure
- [x] Component library foundation
- [x] Basic design system documentation

### Phase 2: Automation Tools 🔄
- [ ] Figma plugin development
- [ ] Design token generator
- [ ] Component code generation
- [ ] CLI tools for designers

### Phase 3: Advanced Features 📋
- [ ] Visual page builder
- [ ] Real-time design sync
- [ ] Advanced component library
- [ ] Performance optimization tools

## 📞 Support

### Development Support
- **GitHub Issues**: [Report bugs](https://github.com/jankx/jankx-2.0/issues)
- **Discord**: [Designer community](https://discord.gg/jankx)
- **Documentation**: [Development docs](../development/README.md)

### Production Use
⚠️ **Không khuyến nghị sử dụng designer tools trong production** cho đến khi release chính thức.

---

**Xem chi tiết từng chủ đề trong các file tương ứng.**
