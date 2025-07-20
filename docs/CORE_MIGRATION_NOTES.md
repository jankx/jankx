# Jankx Core Migration Notes

## Mục tiêu chính
- **Tạo cấu trúc theme minh bạch, dễ tiếp cận** cho mọi người
- **Jankx/core** sẽ được tách ra và có thể **nhúng vào theme khác** một cách dễ dàng
- Theme sẽ vẫn hoạt động bình thường sau khi tách biệt
- Jankx/core có thể được sử dụng bởi nhiều theme khác nhau

## Cấu trúc hiện tại
```
bookix/
├── core/                    # Jankx core (sẽ được tách ra)
│   └── src/
│       └── Jankx/
│           ├── Kernel/
│           ├── Asset/
│           ├── Command/
│           └── SiteLayout/
├── includes/
├── templates/
└── ... (các file theme khác)
```

## Kế hoạch Migration

### Bước 1: Chuẩn bị Jankx Core
- [x] Tạo cấu trúc kernel system với 4 loại kernel
- [x] Implement abstract classes và interfaces
- [x] Tạo bootstrappers cho các tính năng khác nhau
- [x] Đảm bảo Jankx class chỉ là service, không gọi kernel

### Bước 2: Tách Jankx Core thành package độc lập
- [ ] Tạo repository riêng cho Jankx Core
- [ ] Cấu hình composer.json cho Jankx Core
- [ ] Tạo autoloader cho Jankx Core
- [ ] Viết documentation cho Jankx Core

### Bước 3: Cập nhật Theme để sử dụng Jankx Core từ package
- [ ] Thêm Jankx Core vào composer dependencies
- [ ] Cập nhật autoloader trong theme
- [ ] Kiểm tra tất cả imports và requires
- [ ] Test theme với Jankx Core từ package

### Bước 4: Xóa Jankx Core khỏi theme
- [ ] Xóa thư mục `core/` khỏi theme
- [ ] Kiểm tra theme vẫn hoạt động bình thường
- [ ] Test tất cả tính năng

## Lợi ích của việc tách biệt

### 1. Tái sử dụng
- Jankx Core có thể được sử dụng bởi nhiều theme khác nhau
- Không cần duplicate code cho mỗi theme

### 2. Bảo trì dễ dàng
- Cập nhật Jankx Core một lần, áp dụng cho tất cả theme
- Bug fixes và security patches được áp dụng đồng loạt

### 3. Phát triển độc lập
- Team có thể phát triển Jankx Core và theme song song
- Version control riêng biệt cho core và theme

### 4. Performance
- Jankx Core có thể được optimize riêng biệt
- Lazy loading và caching được quản lý tập trung

## Cấu trúc sau khi tách biệt

### Jankx Core Package
```
jankx-core/
├── src/
│   └── Jankx/
│       ├── Kernel/
│       ├── Asset/
│       ├── Command/
│       └── SiteLayout/
├── composer.json
├── README.md
└── docs/
```

### Theme (sau khi tách biệt)
```
bookix/
├── includes/
├── templates/
├── composer.json          # Dependency: jankx/core
└── ... (các file theme khác)
```

## Checklist Migration

### Trước khi tách biệt
- [ ] Tất cả kernel types hoạt động đúng
- [ ] Bootstrappers được implement đầy đủ
- [ ] Jankx class chỉ là service, không gọi kernel
- [ ] Tất cả dependencies được resolve đúng
- [ ] Autoloader hoạt động bình thường

### Sau khi tách biệt
- [ ] Theme vẫn boot được với Jankx Core từ package
- [ ] Tất cả tính năng hoạt động bình thường
- [ ] Performance không bị ảnh hưởng
- [ ] Child themes vẫn hoạt động
- [ ] WooCommerce integration vẫn hoạt động

## Lưu ý quan trọng

1. **Backward Compatibility**: Đảm bảo theme cũ vẫn hoạt động với Jankx Core mới
2. **Version Management**: Quản lý version của Jankx Core và theme riêng biệt
3. **Documentation**: Cập nhật documentation cho cả Jankx Core và theme
4. **Testing**: Test kỹ lưỡng trước khi release

## Timeline dự kiến
- **Phase 1**: Hoàn thiện Jankx Core trong theme (Đã xong)
- **Phase 2**: Tách Jankx Core thành package độc lập
- **Phase 3**: Cập nhật theme sử dụng package
- **Phase 4**: Xóa Jankx Core khỏi theme và test

## Contact
- Developer: [Tên developer]
- Repository: [Link repository Jankx Core]
- Documentation: [Link documentation]