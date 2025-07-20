# Jankx Framework Security Guidelines

## Tổng quan

Jankx Framework đã được cải thiện với các biện pháp bảo mật mạnh mẽ để bảo vệ khỏi các lỗ hổng bảo mật phổ biến.

## Các cải tiến bảo mật đã thực hiện

### 1. Input Validation và Sanitization

- **Security Helper Class**: Tạo class `Jankx_Security_Helper` để xử lý tất cả user input
- **Sanitization Functions**: Sử dụng `sanitize_text_field()`, `esc_*()` functions
- **Integer Validation**: Sử dụng `absint()` cho tất cả integer inputs
- **Nonce Verification**: Tất cả form submissions đều có nonce verification

### 2. File Operations Security

- **Path Validation**: Kiểm tra `realpath()` để tránh directory traversal
- **File Permissions**: Kiểm tra quyền đọc/ghi trước khi thao tác
- **Error Handling**: Try-catch blocks cho tất cả file operations
- **SVG Sanitization**: Loại bỏ các elements và attributes nguy hiểm
- **Safe File Operations**: Thay thế `@` error suppression bằng proper error handling
- **Path Validator**: Class `Jankx_Path_Validator` để validate và normalize paths

### 3. Cache System Security

- **Safe Directory Creation**: `safe_mkdir()` với validation và error handling
- **Safe File Writing**: `safe_write_file()` với path validation
- **Safe File Deletion**: `safe_delete_file()` và `safe_delete_dir()` với proper checks
- **Cache Path Validation**: Sử dụng path validator cho tất cả cache operations

### 4. Configuration Management

- **Centralized Config**: Tất cả constants được quản lý trong `Jankx_Config`
- **Environment Checks**: Kiểm tra PHP và WordPress version requirements
- **Security Constants**: Nonce actions được định nghĩa rõ ràng

## Cách sử dụng Security Helper

### Lấy POST data an toàn:
```php
$value = Jankx_Security_Helper::get_post_data('field_name', 'default_value');
$int_value = Jankx_Security_Helper::get_post_int('field_name', 0);
```

### Lấy GET data an toàn:
```php
$value = Jankx_Security_Helper::get_get_data('field_name', 'default_value');
$int_value = Jankx_Security_Helper::get_get_int('field_name', 0);
```

### Verify nonce:
```php
if (!Jankx_Security_Helper::verify_nonce('nonce_field', 'action_name')) {
    wp_die('Security check failed');
}
```

### File operations an toàn:
```php
$content = Jankx_Security_Helper::safe_file_operation($file_path, 'read');
$result = Jankx_Security_Helper::safe_file_operation($file_path, 'write', $data);
```

## Cách sử dụng Path Validator

### Validate file path:
```php
$valid_path = jankx_validate_path($file_path, $base_directory);
if ($valid_path === false) {
    // Handle invalid path
}
```

### Normalize path:
```php
$normalized_path = jankx_normalize_path($path);
if ($normalized_path === false) {
    // Handle invalid path
}
```

### Join paths safely:
```php
$safe_path = jankx_join_paths($dir1, $dir2, $filename);
```

### Get cache path:
```php
$cache_path = jankx_get_cache_path('cache_name');
if ($cache_path === false) {
    // Handle invalid cache name
}
```

## Best Practices

### 1. Luôn sử dụng Security Helper
```php
// ❌ Không làm thế này
$value = $_POST['field'];

// ✅ Làm thế này
$value = Jankx_Security_Helper::get_post_data('field');
```

### 2. Luôn verify nonce
```php
// ❌ Không làm thế này
if (isset($_POST['submit'])) {
    // process form
}

// ✅ Làm thế này
if (Jankx_Security_Helper::verify_nonce('nonce_field', 'action')) {
    // process form
}
```

### 3. Sanitize output
```php
// ❌ Không làm thế này
echo $user_input;

// ✅ Làm thế này
echo esc_html($user_input);
echo wp_kses_post($html_content);
```

### 4. Validate file uploads
```php
// ✅ Sử dụng WordPress functions
$file = wp_handle_upload($_FILES['file'], ['test_form' => false]);
if (!isset($file['error'])) {
    // File uploaded successfully
}
```

### 5. Validate file paths
```php
// ❌ Không làm thế này
$file_path = $user_input . '/file.txt';

// ✅ Làm thế này
$valid_path = jankx_validate_path($user_input . '/file.txt', $base_dir);
if ($valid_path !== false) {
    // Use $valid_path
}
```

## Security Checklist

- [ ] Tất cả user input được sanitize
- [ ] Tất cả output được escape
- [ ] Nonce verification cho tất cả forms
- [ ] File operations có proper validation
- [ ] SQL queries sử dụng prepared statements
- [ ] Error messages không expose sensitive information
- [ ] File uploads được validate
- [ ] HTTPS được sử dụng cho sensitive data
- [ ] Path validation cho tất cả file operations
- [ ] Cache operations sử dụng safe methods

## Error Handling

Framework đã được cải thiện với proper error handling:

```php
try {
    $result = Jankx_Security_Helper::safe_file_operation($file_path, 'read');
    if ($result === false) {
        error_log('Jankx Security: File operation failed');
        return false;
    }
} catch (Exception $e) {
    error_log('Jankx Security: ' . $e->getMessage());
    return false;
}
```

## Cache Security

Cache system đã được cải thiện với:

```php
// Safe directory creation
if (!self::safe_mkdir($cache_dir)) {
    error_log('Jankx Cache: Failed to create cache directory');
    return;
}

// Safe file writing
if (!self::safe_write_file($cache_file, $content)) {
    error_log('Jankx Cache: Failed to write cache file');
    return;
}

// Safe file deletion
if (!self::safe_delete_file($file_path)) {
    error_log('Jankx Cache: Failed to delete file');
    return;
}
```

## Reporting Security Issues

Nếu bạn phát hiện lỗ hổng bảo mật, vui lòng:

1. **Không public issue** trên GitHub
2. **Email trực tiếp** đến: puleeno@gmail.com
3. **Mô tả chi tiết** lỗ hổng và cách reproduce
4. **Cung cấp proof of concept** nếu có thể

## Version History

### v1.0.2 (Latest)
- ✅ Thêm Path Validator class
- ✅ Cải thiện Cache system security
- ✅ Thay thế `@` error suppression
- ✅ Thêm safe file operations
- ✅ Cải thiện error handling

### v1.0.1
- ✅ Thêm Security Helper class
- ✅ Centralized configuration
- ✅ Input validation và sanitization
- ✅ Nonce verification
- ✅ SVG sanitization

### v1.0.0
- ✅ Basic security measures
- ✅ WordPress coding standards
- ✅ Error handling