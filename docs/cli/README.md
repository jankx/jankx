# Jankx CLI Documentation

> **Complete documentation cho Jankx WordPress CLI Commands**

Jankx framework cung cấp các WordPress CLI commands để quản lý và tương tác với framework một cách dễ dàng.

## 📚 Documentation Index

### 🚀 Getting Started
- **[Commands Reference](commands-reference.md)** - Complete reference cho tất cả commands
- **[Release Command](release-command.md)** - Chi tiết về `wp jankx release`

### 📋 Individual Commands
- **[Release Command](release-command.md)** - Chi tiết về `wp jankx release`
- **[Code Command](code-command.md)** - Chi tiết về `wp jankx code`
- **[Generate Block Command](generate-block-command.md)** - Chi tiết về `wp jankx generate-block`
- **[Create Bootstrapper Command](create-bootstrapper-command.md)** - Chi tiết về `wp jankx create-bootstrapper`

### 🔧 Development
- **[Development Guide](development.md)** - Hướng dẫn phát triển CLI commands
- **[Examples](examples.md)** - Ví dụ sử dụng các commands
- **[Troubleshooting](troubleshooting.md)** - Xử lý lỗi thường gặp

## 🚀 Quick Start

### Installation
```bash
# Đảm bảo WP-CLI đã được cài đặt
wp --version

# Kiểm tra Jankx CLI commands
wp jankx --help
```

### Basic Usage
```bash
# Check coding standards
wp jankx code

# Generate a new block
wp jankx generate-block hero-section

# Create a new bootstrapper
wp jankx create-bootstrapper CustomFeature

# Create release package
wp jankx release --dry-run
```

## 📋 **Requirements**

- WordPress CLI (WP-CLI) đã được cài đặt
- Jankx framework đã được kích hoạt
- PHP 7.4+ (theo yêu cầu của Jankx)

## 🚀 **Available Commands**

### 📋 **Table of Contents**

#### **Development Commands**
- [`wp jankx code`](#wp-jankx-code) - Check và fix WordPress Coding Standards
- [`wp jankx generate-block`](#wp-jankx-generate-block) - Tạo Gutenberg blocks mới
- [`wp jankx create-bootstrapper`](#wp-jankx-create-bootstrapper) - Tạo bootstrapper mới
- [`wp jankx release`](#wp-jankx-release) - Tạo release package cho framework

#### **Information Commands**
- [`wp jankx info`](#wp-jankx-info) - Hiển thị thông tin framework và môi trường
- [`wp jankx version`](#wp-jankx-version) - Hiển thị phiên bản framework

#### **Future Commands** (Sẽ được implement)
- [`wp jankx cache`](#wp-jankx-cache) - Quản lý cache
- [`wp jankx optimize`](#wp-jankx-optimize) - Tối ưu hóa performance
- [`wp jankx security`](#wp-jankx-security) - Kiểm tra bảo mật
- [`wp jankx debug`](#wp-jankx-debug) - Debug và troubleshooting

## 📋 Available Commands

| Command | Description | Status |
|---------|-------------|--------|
| `wp jankx code` | Check WordPress Coding Standards | ✅ Implemented |
| `wp jankx generate-block` | Tạo Gutenberg blocks | ✅ Implemented |
| `wp jankx create-bootstrapper` | Tạo bootstrappers | ✅ Implemented |
| `wp jankx release` | Tạo release package | ✅ Implemented |
| `wp jankx info` | Hiển thị thông tin framework | ✅ Implemented |
| `wp jankx version` | Hiển thị phiên bản | ✅ Implemented |

---

### **Development Commands**

#### `wp jankx code` {#wp-jankx-code}
Check và fix WordPress Coding Standards:

```bash
wp jankx code [--fix] [--path=<path>] [--exclude=<exclude>] [--verbose] [--format=<format>]
```

**Options:**
- `--fix` - Tự động fix các issues
- `--path=<path>` - Đường dẫn cụ thể để check
- `--exclude=<exclude>` - Loại trừ paths (default: vendor,tests,node_modules,coverage)
- `--verbose` - Hiển thị thông tin chi tiết
- `--format=<format>` - Output format (table, csv, json)

**Examples:**
```bash
# Check coding standards
wp jankx code

# Fix issues automatically
wp jankx code --fix

# Check specific directory
wp jankx code --path=includes/Jankx/Kernel

# Exclude specific paths
wp jankx code --exclude=vendor,tests --format=json
```

#### `wp jankx generate-block` {#wp-jankx-generate-block}
Tạo Gutenberg block mới:

```bash
wp jankx generate-block <block-name> [--title=<title>] [--description=<description>]
```

**Options:**
- `<block-name>` - Tên block (required)
- `--title=<title>` - Tiêu đề block
- `--description=<description>` - Mô tả block

**Examples:**
```bash
# Tạo block đơn giản
wp jankx generate-block hero-section

# Tạo block với options
wp jankx generate-block feature-grid --title="Feature Grid" --description="Display features in a grid layout"
```

#### `wp jankx create-bootstrapper` {#wp-jankx-create-bootstrapper}
Tạo bootstrapper mới:

```bash
wp jankx create-bootstrapper <bootstrapper-name> [--context=<context>] [--priority=<priority>] [--description=<description>]
```

**Options:**
- `<bootstrapper-name>` - Tên bootstrapper (required)
- `--context=<context>` - Context (global, frontend, admin, api, cli, gutenberg)
- `--priority=<priority>` - Priority (default: 10)
- `--description=<description>` - Mô tả bootstrapper

**Examples:**
```bash
# Tạo global bootstrapper
wp jankx create-bootstrapper CustomFeature

# Tạo frontend bootstrapper với priority
wp jankx create-bootstrapper ThirdPartyIntegration --context=frontend --priority=15
```

#### `wp jankx release` {#wp-jankx-release}
Tạo release package cho Jankx Framework:

```bash
wp jankx release [--version=<version>] [--output=<output>] [--force] [--dry-run] [--verbose]
```

**Options:**
- `--version=<version>` - Version number (auto-detect từ style.css)
- `--output=<output>` - Output directory (default: ./releases)
- `--force` - Force overwrite existing file
- `--dry-run` - Show files sẽ được include mà không tạo package
- `--verbose` - Show detailed information about exclude patterns and files

**Examples:**
```bash
# Tạo release với auto-detect version
wp jankx release

# Tạo release với version cụ thể
wp jankx release --version=2.0.0

# Dry run để xem files
wp jankx release --dry-run

# Tạo release với output tùy chỉnh
wp jankx release --output=/path/to/releases

# Show detailed information
wp jankx release --verbose
```

**Output (Default):**
```
🎯 Creating Jankx Framework Release Package
📦 Theme: bookix
🏷️  Version: 2.0.0
📁 Output: ./releases

Success: Release package created successfully!
📦 Package: ./releases/bookix-2.0.0.zip
📊 Size: 2.5 MB
📄 Files included: 156
```

**Output (with --verbose):**
```
🎯 Creating Jankx Framework Release Package
📦 Theme: bookix
🏷️  Version: 2.0.0
📁 Output: ./releases

📁 Theme path: /path/to/theme
📄 Files found: 156

📖 Reading exclude patterns from .gitattributes...
   - Excluding: /.circleci
   - Excluding: /.travis.yml
   - Excluding: /tests
   - Excluding: /examples
   - Excluding: /coverage-report
   - Excluding: /docs
   - Including: /vendor (vendor directory)
📋 Total exclude patterns loaded: 25

 - includes/Jankx/Kernel/CLIKernel.php
 - includes/Jankx/CLI/Commands/ReleaseCommand.php
 - style.css
 - functions.php
🗂️  Total files added to zip: 156

Success: Release package created successfully!
📦 Package: ./releases/bookix-2.0.0.zip
📊 Size: 2.5 MB
📄 Files included: 156
```

**Important Notes:**
- Command đọc `.gitattributes` để xác định files cần loại trừ từ `export-ignore` patterns
- **Vendor directory được include** (không loại trừ) để đảm bảo PHP dependencies hoạt động đúng
- Sử dụng `--dry-run` để preview files trước khi tạo package
- Sử dụng `--verbose` để xem thông tin chi tiết về exclude patterns và files được nén
- Mặc định chỉ hiển thị thông tin cơ bản, ẩn chi tiết để output gọn gàng

---

### **Framework Information**
Hiển thị thông tin chi tiết về framework và môi trường:

```bash
wp jankx info
```

**Output:**
```
🎯 Jankx Framework Information
================================

🖥️  System Information:
   • PHP Version: 8.1.30
   • WordPress Version: 6.4.3
   • Jankx Version: 2.0.0

⚡ Performance Settings:
   • Memory Limit: 256M
   • Max Execution Time: 30s
   • Upload Max Filesize: 64M
   • Post Max Size: 64M

🔌 Active Plugins (3):
   1. WooCommerce v8.5.2
      👤 Author: Automattic
      📝 Description: An eCommerce toolkit that helps you sell anything online.

   2. Yoast SEO v21.7
      👤 Author: Team Yoast
      📝 Description: Improve your WordPress SEO: Write better content and have a fully optimized website.

   3. Contact Form 7 v5.8.1
      👤 Author: Takayuki Miyoshi
      📝 Description: Just another contact form plugin. Simple but flexible.
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

#### **Development Commands**
- [`code`](#wp-jankx-code) - Check và fix WordPress Coding Standards
- [`generate-block`](#wp-jankx-generate-block) - Tạo Gutenberg blocks mới
- [`create-bootstrapper`](#wp-jankx-create-bootstrapper) - Tạo bootstrapper mới
- [`release`](#wp-jankx-release) - Tạo release package cho framework

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
add_action('jankx/wpcli/register_commands', function() {
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
    do_action('jankx/wpcli/register_commands');
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

### **Available Commands Implementation**

Tất cả commands hiện có được implement trong:

- **`includes/Jankx/CLI/Commands/CodingStandardCommand.php`** - Check coding standards
- **`includes/Jankx/CLI/Commands/GenerateBlockCommand.php`** - Generate Gutenberg blocks
- **`includes/Jankx/CLI/Commands/CreateBootstrapperCommand.php`** - Create bootstrappers
- **`includes/Jankx/CLI/Commands/ReleaseCommand.php`** - Create release packages

Commands được đăng ký trực tiếp trong **`includes/Jankx/Providers/CLIServiceProvider.php`** thông qua method `registerCLICommands()`.

```php
// CLIServiceProvider.php
private function registerCLICommands(): void
{
    if (!defined('WP_CLI') || !WP_CLI) {
        return;
    }

    // Register individual commands
    if ($this->container->has('cli.command.generate-block')) {
        WP_CLI::add_command('jankx generate-block', $this->container->make('cli.command.generate-block'));
    }

    // ... other commands
}
```

## 📊 Command Status

### ✅ Implemented Commands
- `wp jankx code` - Check coding standards
- `wp jankx generate-block` - Generate blocks
- `wp jankx create-bootstrapper` - Create bootstrappers
- `wp jankx release` - Create release packages
- `wp jankx info` - Framework information
- `wp jankx version` - Version display

### 🔄 Planned Commands
- `wp jankx cache` - Cache management
- `wp jankx optimize` - Performance optimization
- `wp jankx security` - Security scanning
- `wp jankx debug` - Debug information

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
- **Active Plugins:** Danh sách plugins đang active với version và author

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

- **[Framework Overview](../README.md)** - Tổng quan về Jankx Framework
- **[Development Best Practices](../development/best-practices.md)** - Best practices
- **[Performance Optimization](../performance/README.md)** - Performance guides
- **[Migration Guide](../migration-guide.md)** - Migration từ version cũ

## 🔗 **Integration Points**

### **WordPress Hooks**
- `jankx/wpcli/register_commands` - Để register custom commands
- `jankx_cli_initialized` - Khi CLI kernel được khởi tạo

### **Jankx Framework**
- `CLIKernel` - Kernel xử lý CLI commands
- `CLIBootstrapper` - Bootstrapper cho CLI context

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

# Check coding standards
wp jankx code

# Generate a new block
wp jankx generate-block hero-section

# Create a new bootstrapper
wp jankx create-bootstrapper CustomFeature

# Create release package
wp jankx release

# With debug mode
wp jankx info --debug
```

### **Integration with WordPress**
```bash
# Check WordPress and Jankx versions
wp core version && wp jankx version

# Get system information
wp jankx info | grep "PHP Version"

# Check coding standards for specific path
wp jankx code --path=includes/Jankx/Kernel

# Create release package with dry run
wp jankx release --dry-run
```

## 🤝 **Contributing**

Để đóng góp vào CLI documentation:

1. **Fork repository**
2. **Create feature branch**
3. **Update documentation**
4. **Submit pull request**

### **Documentation Guidelines**
- Sử dụng Markdown format
- Bao gồm examples và use cases
- Cung cấp troubleshooting guides
- Cập nhật khi có commands mới

### **Command Guidelines**
- Sử dụng namespace `jankx`
- Tuân thủ WordPress CLI conventions
- Cung cấp help text
- Handle errors gracefully
- Log important actions

---

**Jankx CLI Commands** - Quản lý framework một cách dễ dàng và hiệu quả! 🚀