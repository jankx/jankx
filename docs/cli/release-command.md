# Release Command

> **Tạo release package cho Jankx Framework**

Command `wp jankx release` giúp tạo package ZIP để phân phối Jankx Framework, tự động loại trừ các file không cần thiết dựa trên `.gitattributes`.

## 🚀 Usage

### Basic Usage
```bash
# Tạo release với version tự động detect từ style.css
wp jankx release

# Tạo release với version cụ thể
wp jankx release --version=2.0.0

# Tạo release với output directory tùy chỉnh
wp jankx release --output=/path/to/releases

# Dry run để xem files sẽ được include
wp jankx release --dry-run

# Force overwrite file đã tồn tại
wp jankx release --force
```

## 📋 Options

| Option | Description | Default |
|--------|-------------|---------|
| `--version=<version>` | Version number cho release | Auto-detect từ style.css |
| `--output=<output>` | Output directory cho package | `./releases` |
| `--force` | Force overwrite file đã tồn tại | `false` |
| `--dry-run` | Show files sẽ được include mà không tạo package | `false` |

## 📁 Files Excluded

Command này tự động loại trừ các file dựa trên `.gitattributes`:

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

## 🎯 Examples

### 1. Tạo release cơ bản
```bash
wp jankx release
```
Output:
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

### 2. Dry run để xem files
```bash
wp jankx release --dry-run
```
Output:
```
🔍 DRY RUN - Files that would be included:
📄 Total files: 156

📁 root/ (45 files)
   - style.css
   - functions.php
   - index.php
   - header.php
   - footer.php
   ... and 40 more files

📁 includes/ (89 files)
   - includes/Jankx/Jankx.php
   - includes/Jankx/Kernel/Kernel.php
   - includes/Jankx/CLI/Commands/ReleaseCommand.php
   ... and 86 more files

📁 assets/ (22 files)
   - assets/css/admin.css
   - assets/js/admin.js
   ... and 19 more files

✅ Dry run completed. Use --force to create actual package.
```

### 3. Tạo release với version cụ thể
```bash
wp jankx release --version=2.1.0 --output=/var/www/releases
```

### 4. Force overwrite
```bash
wp jankx release --force
```

## 🔧 Integration với GitHub Releases

Command này tương thích với GitHub Releases:

1. **Tạo release package**:
   ```bash
   wp jankx release --version=2.0.0
   ```

2. **Upload lên GitHub**:
   - Vào GitHub repository
   - Tạo new release với tag `v2.0.0`
   - Upload file `bookix-2.0.0.zip`

3. **Package sẽ không chứa**:
   - Development files (tests, docs, examples)
   - Build artifacts (node_modules)
   - CI/CD files (.github, .circleci)
   - IDE files (.vscode, .idea)
   - **Note**: Vendor directory được include để đảm bảo dependencies

## 📊 Performance

- **Memory usage**: Tối ưu cho large codebases
- **Progress bar**: Hiển thị cho packages > 10 files
- **Error handling**: Graceful error handling
- **File validation**: Kiểm tra file existence trước khi add

## 🛠️ Troubleshooting

### Lỗi thường gặp

1. **"Theme directory not found"**
   ```bash
   # Đảm bảo đang chạy từ WordPress root
   cd /path/to/wordpress
   wp jankx release
   ```

2. **"Failed to create output directory"**
   ```bash
   # Kiểm tra permissions
   mkdir -p ./releases
   chmod 755 ./releases
   ```

3. **"Release package already exists"**
   ```bash
   # Sử dụng --force để overwrite
   wp jankx release --force
   ```

### Debug mode
```bash
# Enable WP-CLI debug
WP_CLI_DEBUG=1 wp jankx release --dry-run
```

## 🔗 Related Commands

- `wp jankx code` - Check coding standards
- `wp jankx generate-block` - Generate Gutenberg blocks
- `wp jankx create-bootstrapper` - Create bootstrappers

## 📝 Notes

- Command tự động detect version từ `style.css`
- Sử dụng `.gitattributes` để determine files to exclude
- Tạo ZIP package với proper file structure
- Progress bar cho large packages
- Dry run mode để preview files