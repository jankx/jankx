# Jankx CLI Commands Reference

> **Complete reference cho tất cả Jankx CLI commands**

## 📋 Quick Reference

| Command | Description | Usage |
|---------|-------------|-------|
| `wp jankx code` | Check WordPress Coding Standards | `wp jankx code [--fix] [--path=<path>]` |
| `wp jankx generate-block` | Tạo Gutenberg block | `wp jankx generate-block <name> [--title=<title>]` |
| `wp jankx create-bootstrapper` | Tạo bootstrapper | `wp jankx create-bootstrapper <name> [--context=<context>]` |
| `wp jankx release` | Tạo release package | `wp jankx release [--version=<version>] [--dry-run]` |

## 🚀 Development Commands

### `wp jankx code`

Check và fix WordPress Coding Standards.

**Syntax:**
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

# Verbose output
wp jankx code --verbose
```

**Output:**
```
🎯 Checking WordPress Coding Standards
📁 Path: includes/Jankx/
🔍 Scanning files...

Found 3 issues:
1. Missing @since tag in class Jankx\Kernel\Kernel
2. Improper exit usage in includes/Jankx/CLI/Commands/CodingStandardCommand.php
3. Unsanitized input in includes/Jankx/Providers/CLIServiceProvider.php

✅ Check completed. Use --fix to automatically fix issues.
```

### `wp jankx generate-block`

Tạo Gutenberg block mới.

**Syntax:**
```bash
wp jankx generate-block <block-name> [--title=<title>] [--description=<description>]
```

**Arguments:**
- `<block-name>` - Tên block (required)

**Options:**
- `--title=<title>` - Tiêu đề block
- `--description=<description>` - Mô tả block

**Examples:**
```bash
# Tạo block đơn giản
wp jankx generate-block hero-section

# Tạo block với options
wp jankx generate-block feature-grid --title="Feature Grid" --description="Display features in a grid layout"

# Tạo block với custom attributes
wp jankx generate-block testimonial --title="Testimonial" --description="Display customer testimonials"
```

**Output:**
```
🎨 Generating Gutenberg block: hero-section
📝 Title: Hero Section
📄 Description: Display hero section with title and description

✅ Block 'hero-section' generated successfully!
📁 Files created:
   - assets/gutenberg/js/blocks/hero-section.js
   - assets/gutenberg/css/blocks/hero-section.css
   - templates/blocks/hero-section.html
   - includes/Jankx/Gutenberg/Blocks/hero-section.php
```

### `wp jankx create-bootstrapper`

Tạo bootstrapper mới.

**Syntax:**
```bash
wp jankx create-bootstrapper <bootstrapper-name> [--context=<context>] [--priority=<priority>] [--description=<description>]
```

**Arguments:**
- `<bootstrapper-name>` - Tên bootstrapper (required)

**Options:**
- `--context=<context>` - Context (global, frontend, admin, api, cli, gutenberg)
- `--priority=<priority>` - Priority (default: 10)
- `--description=<description>` - Mô tả bootstrapper

**Examples:**
```bash
# Tạo global bootstrapper
wp jankx create-bootstrapper CustomFeature

# Tạo frontend bootstrapper với priority
wp jankx create-bootstrapper ThirdPartyIntegration --context=frontend --priority=15

# Tạo admin bootstrapper với description
wp jankx create-bootstrapper AdminPanel --context=admin --description="Custom admin panel integration"
```

**Output:**
```
🔧 Creating bootstrapper: CustomFeature
📁 Context: global
⚡ Priority: 10
📄 Description: Custom feature integration

✅ Bootstrapper 'CustomFeature' created successfully!
📁 Files created:
   - includes/Jankx/Bootstrappers/Global/CustomFeatureBootstrapper.php
```

### `wp jankx release`

Tạo release package cho Jankx Framework.

**Syntax:**
```bash
wp jankx release [--version=<version>] [--output=<output>] [--force] [--dry-run]
```

**Options:**
- `--version=<version>` - Version number (auto-detect từ style.css)
- `--output=<output>` - Output directory (default: ./releases)
- `--force` - Force overwrite existing file
- `--dry-run` - Show files sẽ được include mà không tạo package

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

# Force overwrite existing file
wp jankx release --force
```

**Output:**
```
🎯 Creating Jankx Framework Release Package
📦 Theme: bookix
🏷️  Version: 2.0.0
📁 Output: ./releases

📖 Reading exclude patterns from .gitattributes...
   - Excluding: /.circleci
   - Excluding: /.travis.yml
   - Excluding: /tests
   - Excluding: /examples
   - Excluding: /coverage-report
   - Excluding: /docs
   - Including: /vendor (vendor directory)
📋 Total exclude patterns loaded: 25

Success: Release package created successfully!
📦 Package: ./releases/bookix-2.0.0.zip
📊 Size: 2.5 MB
📄 Files included: 156
```

**Important Notes:**
- Command đọc `.gitattributes` để xác định files cần loại trừ từ `export-ignore` patterns
- **Vendor directory được include** (không loại trừ) để đảm bảo PHP dependencies hoạt động đúng
- Sử dụng `--dry-run` để preview files trước khi tạo package
- Command hiển thị chi tiết các patterns được load từ `.gitattributes`

## 📁 Files Excluded in Release

Command `wp jankx release` tự động loại trừ các file dựa trên `.gitattributes`:

### Development Files
- `/tests` - Unit tests
- `/examples` - Ví dụ code
- `/coverage-report` - Báo cáo coverage
- `/docs` - Tài liệu
- `/TESTING.md` - Tài liệu testing
- `/phpunit.xml` - Cấu hình PHPUnit

### Build & Dependencies
- `/node_modules` - Node.js dependencies
- `/package-lock.json` - Node.js lock file
- `/composer.lock` - PHP lock file
- **Note**: `/vendor` được include để đảm bảo PHP dependencies

### Git & CI/CD
- `/.git` - Git repository
- `/.github` - GitHub settings
- `/.gitignore` - Git ignore file
- `/.gitattributes` - Git attributes file
- `/.circleci` - CircleCI config
- `/.travis.yml` - Travis CI config

### IDE & Editor
- `/.vscode` - VS Code settings
- `/.idea` - IntelliJ settings
- `*.swp`, `*.swo`, `*~` - Editor temporary files

### OS Files
- `/.DS_Store` - macOS system files
- `/Thumbs.db` - Windows system files
- `/Desktop.ini` - Windows system files

### Logs & Cache
- `*.log` - Log files
- `/logs` - Log directory
- `*.tmp`, `*.temp` - Temporary files
- `/.sass-cache` - Sass cache
- `/.phpunit.cache` - PHPUnit cache

## 🔧 Integration Examples

### Workflow Development

```bash
# 1. Check coding standards
wp jankx code --fix

# 2. Generate new block
wp jankx generate-block hero-section --title="Hero Section"

# 3. Create bootstrapper for new feature
wp jankx create-bootstrapper HeroIntegration --context=frontend

# 4. Create release package
wp jankx release --dry-run
wp jankx release --version=2.1.0
```

### CI/CD Integration

```bash
# In your CI pipeline
wp jankx code --format=json > coding-standards-report.json
wp jankx release --version=$CI_COMMIT_TAG --output=/artifacts
```

### Development Workflow

```bash
# Daily development workflow
wp jankx code --path=includes/Jankx/Kernel
wp jankx generate-block feature-grid --title="Feature Grid"
wp jankx create-bootstrapper FeatureIntegration --context=frontend
wp jankx release --dry-run
```

## 🛠️ Troubleshooting

### Common Issues

#### Command not found
```bash
Error: 'jankx' is not a registered wp command.
```
**Solution:** Đảm bảo Jankx framework đã được kích hoạt và CLI kernel đã được load.

#### Permission denied
```bash
Error: You don't have permission to do that.
```
**Solution:** Chạy với quyền admin hoặc sử dụng `--allow-root` flag.

#### Release package already exists
```bash
Error: Release package already exists: ./releases/bookix-2.0.0.zip
```
**Solution:** Sử dụng `--force` để overwrite.

### Debug Mode

```bash
# Enable WP-CLI debug
WP_CLI_DEBUG=1 wp jankx code --verbose
WP_CLI_DEBUG=1 wp jankx release --dry-run
```

## 📚 Related Documentation

- [CLI Overview](README.md) - Tổng quan về CLI commands
- [Release Command](release-command.md) - Chi tiết về release command
- [Development Best Practices](../development/best-practices.md) - Best practices cho development
- [Performance Optimization](../performance/README.md) - Tối ưu hóa performance

## 🔗 Related Commands

- `wp core version` - WordPress version
- `wp theme list` - List themes
- `wp plugin list` - List plugins
- `wp db export` - Export database

---

**Jankx CLI Commands Reference** - Complete guide cho tất cả commands! 🚀