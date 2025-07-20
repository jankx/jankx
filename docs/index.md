# Hệ thống Jankx Framework

## Tổng quan
Jankx Framework là một hệ thống mô-đun được thiết kế để xây dựng các theme WordPress với hiệu suất cao và khả năng mở rộng. Hệ thống sử dụng kiến trúc dựa trên `Bootstrapper`, `Service Provider`, và `Kernel` để quản lý các tính năng và dịch vụ theo context.

## Cấu trúc hệ thống

### 1. Bootstrapper
- **Vai trò**: Khởi tạo các thành phần cốt lõi của hệ thống trước khi xác định context.
- **Nhiệm vụ**:
  - Thiết lập các hằng số cơ bản (như `JANKX_ABSPATH`).
  - Load các helper cơ bản không phụ thuộc vào context.
  - Đăng ký các binding cơ bản vào container.
- **Ví dụ**: `CoreBootstrapper` khởi tạo hệ thống bằng cách định nghĩa các hằng số và binding container.

### 2. Service Provider
- **Vai trò**: Đăng ký và khởi động các dịch vụ hoặc tính năng cụ thể theo context.
- **Nhiệm vụ**:
  - Đăng ký các dịch vụ vào container (ví dụ: `Jankx\UX\UserExperience`, `Jankx\Gutenberg\BlockManager`).
  - Load các helper hoặc tài nguyên theo context (ví dụ: `Mobile_Detect.php` chỉ load ở frontend và admin).
  - Tối ưu hóa hiệu suất bằng cách chỉ load khi cần thiết (lazy loading, conditional loading).
- **Ví dụ**:
  - `FrontendServiceProvider`: Quản lý các dịch vụ cho frontend.
  - `GutenbergServiceProvider`: Quản lý các tính năng Gutenberg, chỉ load tài nguyên khi editor được sử dụng.
  - `PlatesTemplateServiceProvider`: Quản lý Plates templates, chỉ load ở frontend context.

### 3. Kernel
- **Vai trò**: Quản lý context và khởi động các `Service Provider` tương ứng.
- **Nhiệm vụ**:
  - Xác định context hiện tại (frontend, admin, API, CLI, v.v.).
  - Load các `Service Provider` phù hợp với context.
  - Đăng ký các hook và filter theo context.
- **Ví dụ**:
  - `FrontendKernel`: Load các dịch vụ và tính năng cho frontend.
  - `AdminKernel`: Load các dịch vụ và tính năng cho admin, bao gồm Gutenberg.

## Tối ưu hóa hiệu suất

### Gutenberg
- **Lazy Loading**: Chỉ load tài nguyên Gutenberg khi block editor được sử dụng (thông qua hook `enqueue_block_editor_assets`).
- **Context Awareness**: Load trong cả frontend và admin context, nhưng chỉ khi cần thiết.

### Plates Templates
- **Conditional Loading**: Chỉ load Plates templates trong frontend context, tránh load ở admin, API, AJAX, hoặc CLI.
- **Caching**: Sử dụng caching để lưu trữ các template đã được render (sẽ được triển khai trong tương lai).

## Cách sử dụng
1. **Thêm tính năng mới**:
   - Tạo một `Service Provider` cho tính năng đó.
   - Đăng ký `Service Provider` trong `Kernel` tương ứng với context mà tính năng được sử dụng.
2. **Tối ưu hóa hiệu suất**:
   - Sử dụng các kỹ thuật như lazy loading, conditional loading, và caching.
   - Đảm bảo rằng các tài nguyên chỉ được load trong context cần thiết.

## Kết luận
Hệ thống Jankx Framework cung cấp một cách tiếp cận có tổ chức để xây dựng theme WordPress, với sự tách biệt rõ ràng giữa khởi tạo cốt lõi (`Bootstrapper`), quản lý dịch vụ (`Service Provider`), và quản lý context (`Kernel`). Điều này giúp tăng tính mô-đun, dễ bảo trì, và tối ưu hóa hiệu suất.
