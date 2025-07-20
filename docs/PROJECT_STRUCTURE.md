# Tài liệu Kỹ Thuật Dự Án Bookix

## 1. **Cấu trúc thư mục**

```
bookix/
├── assets/                  # Tài nguyên tĩnh (CSS, JS, hình ảnh, fonts)
│   ├── css/
│   ├── js/
│   ├── img/
│   └── fonts/
├── includes/               # Các file helper và cấu hình
│   ├── security.php        # Helper bảo mật
│   ├── svg-sanitizer.php   # Sanitizer cho SVG
│   ├── file-upload-security.php # Bảo mật upload file
│   ├── path-validator.php  # Validator cho đường dẫn
│   ├── config.php          # Cấu hình framework
│   ├── performance.php     # Helper tối ưu hiệu suất
│   └── performance-config.php # Cấu hình hiệu suất
├── vendor/                 # Thư viện bên thứ ba (autoload qua Composer)
├── functions.php           # File khởi tạo theme, load các helper
├── index.php               # File index chính của theme
├── style.css               # CSS chính của theme
└── templates/              # Các template cho theme
```

## 2. **Các thành phần chính**

### 2.1. **Assets**
- **CSS**: Chứa các file CSS cho theme và các thành phần.
- **JS**: Chứa các file JavaScript cho theme.
- **Images**: Chứa các hình ảnh sử dụng trong theme.
- **Fonts**: Chứa các font chữ sử dụng trong theme.

### 2.2. **Includes**
- **Security Helper**: `security.php` - Cung cấp các hàm bảo mật như lấy dữ liệu POST/GET an toàn, xác thực nonce.
- **SVG Sanitizer**: `svg-sanitizer.php` - Sanitizer cho nội dung SVG để ngăn chặn XSS.
- **File Upload Security**: `file-upload-security.php` - Bảo mật cho việc upload file, kiểm tra loại file, kích thước, MIME type.
- **Path Validator**: `path-validator.php` - Kiểm tra và xác thực đường dẫn file.
- **Config**: `config.php` - Cấu hình chung cho framework, bao gồm phiên bản, layout, và các cài đặt bảo mật.
- **Performance**: `performance.php` và `performance-config.php` - Tối ưu hiệu suất, bao gồm cache, tối ưu query, và tối ưu asset.

### 2.3. **Core**
- **Autoload**: Sử dụng Composer để autoload các thư viện bên thứ ba.
- **Khởi tạo**: `functions.php` - Khởi tạo theme, load các helper và cấu hình.

## 3. **Cách hoạt động**

- **Khởi tạo**: Theme được khởi tạo từ `functions.php`, nơi các helper và cấu hình được load.
- **Autoload**: Composer autoload các thư viện bên thứ ba từ `vendor/`.
- **Tối ưu hiệu suất**: Các helper và cấu hình trong `includes/performance.php` và `includes/performance-config.php` giúp tối ưu hiệu suất cho theme.
- **Bảo mật**: Các helper trong `includes/security.php` và `includes/file-upload-security.php` đảm bảo bảo mật cho dữ liệu và file upload.

## 4. **Hướng dẫn sử dụng**

- **Thêm tính năng mới**: Thêm các file helper mới vào `includes/` và require_once trong `functions.php`.
- **Tối ưu hiệu suất**: Sử dụng các hàm trong `performance.php` để tối ưu query và asset.
- **Bảo mật**: Sử dụng các hàm trong `security.php` để bảo vệ dữ liệu và xác thực nonce.
