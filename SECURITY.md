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

### 3. Configuration Management

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

## Security Checklist

- [ ] Tất cả user input được sanitize
- [ ] Tất cả output được escape
- [ ] Nonce verification cho tất cả forms
- [ ] File operations có proper validation
- [ ] SQL queries sử dụng prepared statements
- [ ] Error messages không expose sensitive information
- [ ] File uploads được validate
- [ ] HTTPS được sử dụng cho sensitive data

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

## Reporting Security Issues

Nếu bạn phát hiện lỗ hổng bảo mật, vui lòng:

1. **Không public issue** trên GitHub
2. **Email trực tiếp** đến: puleeno@gmail.com
3. **Mô tả chi tiết** về lỗ hổng
4. **Cung cấp steps** để reproduce

## Updates

Framework sẽ được cập nhật thường xuyên với các biện pháp bảo mật mới. Hãy đảm bảo bạn luôn sử dụng phiên bản mới nhất.

---

**Lưu ý**: Bảo mật là trách nhiệm của tất cả developers. Hãy luôn tuân thủ các guidelines này và cập nhật kiến thức bảo mật thường xuyên.