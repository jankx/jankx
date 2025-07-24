# Jankx WordPress CLI Commands

Jankx framework cung cấp các WordPress CLI commands để quản lý và tương tác với framework một cách dễ dàng.

## 📋 **Requirements**

- WordPress CLI (WP-CLI) đã được cài đặt
- Jankx framework đã được kích hoạt
- PHP 7.4+ (theo yêu cầu của Jankx)

## 🚀 **Available Commands**

### 📋 **Table of Contents**

#### **Information Commands**
- [`wp jankx info`](#wp-jankx-info) - Hiển thị thông tin framework và môi trường
- [`wp jankx version`](#wp-jankx-version) - Hiển thị phiên bản framework

#### **Future Commands** (Sẽ được implement)
- [`wp jankx cache`](#wp-jankx-cache) - Quản lý cache
- [`wp jankx optimize`](#wp-jankx-optimize) - Tối ưu hóa performance
- [`wp jankx security`](#wp-jankx-security) - Kiểm tra bảo mật
- [`wp jankx debug`](#wp-jankx-debug) - Debug và troubleshooting

---

### **Framework Information**

#### `wp jankx info` {#wp-jankx-info}
Hiển thị thông tin chi tiết về framework và môi trường:

```bash
wp jankx info
```

**Output:**
```
Jankx Framework Information:
PHP Version: 8.1.30
WordPress Version: 6.4.3
Jankx Version: 2.0.0
Memory Limit: 256M
Max Execution Time: 30s
```

#### `wp jankx version` {#wp-jankx-version}
Hiển thị phiên bản hiện tại của Jankx framework:

```bash
wp jankx version
```

**Output:**
```
Jankx Framework Version: 2.0.0
```

## 🔧 **Command Structure**

### **Namespace: `jankx`**
Tất cả commands của Jankx đều sử dụng namespace `jankx`:

```bash
wp jankx <command> [options]
```

### **Command Categories**

#### **Information Commands**
- [`info`](#wp-jankx-info) - Hiển thị thông tin framework và môi trường
- [`version`](#wp-jankx-version) - Hiển thị phiên bản framework

#### **Future Commands** (Sẽ được implement)
- [`cache`](#wp-jankx-cache) - Quản lý cache
- [`optimize`](#wp-jankx-optimize) - Tối ưu hóa performance
- [`security`](#wp-jankx-security) - Kiểm tra bảo mật
- [`debug`](#wp-jankx-debug) - Debug và troubleshooting

## 🛠️ **Development**

### **Adding New Commands**

Để thêm command mới, bạn có thể:

1. **Hook vào WordPress CLI:**
```php
add_action('jankx_wpcli_register_commands', function() {
    // Register your custom commands here
});
```

2. **Sử dụng Jankx CLI hooks:**
```php
// Trong CLIKernel.php
public function registerWPCLICommands(): void
{
    if (!class_exists('WP_CLI')) {
        return;
    }

    // Basic Jankx commands
    \WP_CLI::add_command('jankx info', [$this, 'showFrameworkInfo']);
    \WP_CLI::add_command('jankx version', [$this, 'showVersion']);

    // Allow child themes to register custom WP-CLI commands
    do_action('jankx_wpcli_register_commands');
}
```

### **Command Implementation Example**

```php
class CustomJankxCommand
{
    public function __invoke($args, $assoc_args)
    {
        // Your command logic here
        \WP_CLI::line('Custom command executed!');
    }
}

// Register the command
\WP_CLI::add_command('jankx custom', 'CustomJankxCommand');
```

## 📊 **Environment Information**

### **Framework Details**
- **Framework Name:** Jankx
- **Current Version:** 2.0.0
- **PHP Requirement:** 7.4+
- **WordPress Requirement:** 6.0+

### **System Information**
Commands sẽ hiển thị:
- **PHP Version:** Phiên bản PHP hiện tại
- **WordPress Version:** Phiên bản WordPress
- **Memory Limit:** Giới hạn memory
- **Max Execution Time:** Thời gian thực thi tối đa
- **Upload Max Filesize:** Kích thước upload tối đa
- **Post Max Size:** Kích thước POST tối đa

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Command not found**
```bash
Error: 'jankx' is not a registered wp command.
```

**Solution:** Đảm bảo Jankx framework đã được kích hoạt và CLI kernel đã được load.

#### **Permission denied**
```bash
Error: You don't have permission to do that.
```

**Solution:** Chạy với quyền admin hoặc sử dụng `--allow-root` flag.

### **Debug Mode**

Để debug CLI commands:

```bash
wp jankx info --debug
```

## 📚 **Related Documentation**

- [Jankx Framework Documentation](../README.md)
- [Migration Guide](../migration-guide.md)
- [Development Best Practices](../development/best-practices.md)
- [Performance Optimization](../performance/README.md)

## 🔗 **Integration Points**

### **WordPress Hooks**
- `jankx_wpcli_register_commands` - Để register custom commands
- `jankx_cli_initialized` - Khi CLI kernel được khởi tạo

### **Jankx Framework**
- `CLIKernel` - Kernel xử lý CLI commands
- `CLIBootstrapper` - Bootstrapper cho CLI context
- `ContextualServiceProvider` - Service provider cho CLI

## 🚀 **Future Roadmap**

### **Planned Commands**
- `wp jankx cache:clear` - Xóa cache
- `wp jankx optimize:assets` - Tối ưu assets
- `wp jankx security:scan` - Quét bảo mật
- `wp jankx debug:info` - Thông tin debug
- `wp jankx migrate:run` - Chạy migration

### **Advanced Features**
- **Interactive Commands** - Commands với user interaction
- **Batch Processing** - Xử lý hàng loạt
- **Progress Indicators** - Hiển thị tiến trình
- **Export/Import** - Xuất/nhập dữ liệu

## 📝 **Examples**

### **Basic Usage**
```bash
# Check framework version
wp jankx version

# Get detailed information
wp jankx info

# With debug mode
wp jankx info --debug
```

### **Integration with WordPress**
```bash
# Check WordPress and Jankx versions
wp core version && wp jankx version

# Get system information
wp jankx info | grep "PHP Version"
```

## 🤝 **Contributing**

Để đóng góp vào CLI commands:

1. **Fork repository**
2. **Create feature branch**
3. **Implement command**
4. **Add tests**
5. **Submit pull request**

### **Command Guidelines**
- Sử dụng namespace `jankx`
- Tuân thủ WordPress CLI conventions
- Cung cấp help text
- Handle errors gracefully
- Log important actions

---

**Jankx CLI Commands** - Quản lý framework một cách dễ dàng và hiệu quả! 🚀