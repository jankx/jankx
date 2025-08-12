# Jankx Framework WP CLI Commands

## Tổng Quan

Jankx Framework cung cấp nhiều WP CLI commands để quản lý và tương tác với framework. Các commands này giúp developers và administrators dễ dàng quản lý Jankx Framework thông qua command line.

## 🚀 **Icon Management Commands**

### **1. Transform CSS to JSON**
Transform CSS files thành JSON metadata cho icons:

```bash
# Transform Material Icons CSS to JSON
wp jankx icons transform --type=material --css-url="https://fonts.googleapis.com/icon?family=Material+Icons" --output="resources/icons/material/icons.json"

# Transform FontAwesome CSS to JSON
wp jankx icons transform --type=fontawesome --css-url="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" --output="resources/icons/fontawesome/icons.json"

# Transform with force overwrite
wp jankx icons transform --type=custom --css-url="https://example.com/icons.css" --output="resources/icons/custom/icons.json" --force
```

**Options:**
- `--type=<type>`: Icon type (fontawesome, material, custom, svg)
- `--css-url=<url>`: CSS URL to transform
- `--output=<path>`: Output JSON file path
- `--force`: Force overwrite existing file

### **2. List Icon Types**
Liệt kê tất cả các icon types có sẵn:

```bash
wp jankx icons list
```

### **3. Activate Icon Type**
Kích hoạt một icon type:

```bash
# Activate FontAwesome
wp jankx icons activate fontawesome

# Activate Material Icons
wp jankx icons activate material
```

### **4. Deactivate Icon Type**
Hủy kích hoạt một icon type:

```bash
wp jankx icons deactivate fontawesome
```

### **5. Clear Icon Cache**
Xóa cache của icons:

```bash
wp jankx icons clear-cache
```

### **6. Refresh Icon Data**
Làm mới dữ liệu icons từ CSS sources:

```bash
# Refresh all icon types
wp jankx icons refresh

# Refresh specific icon type
wp jankx icons refresh --type=material
```

**Options:**
- `--type=<type>`: Specific icon type to refresh (optional)

## 🔧 **Framework Management Commands**

### **1. Clear Framework Cache**
Xóa tất cả cache của Jankx Framework:

```bash
wp jankx cache clear
```

### **2. Rebuild Framework Cache**
Xây dựng lại cache của framework:

```bash
wp jankx cache rebuild
```

### **3. List Active Services**
Liệt kê các services đang hoạt động:

```bash
wp jankx services list
```

### **4. Service Status**
Kiểm tra trạng thái của một service:

```bash
wp jankx services status <service-name>
```

## 📊 **Development Commands**

### **1. Generate Component**
Tạo component mới:

```bash
wp jankx make component <component-name>
```

### **2. Generate Service**
Tạo service mới:

```bash
wp jankx make service <service-name>
```

### **3. Generate Provider**
Tạo service provider mới:

```bash
wp jankx make provider <provider-name>
```

## 🎨 **Theme Management Commands**

### **1. List Child Themes**
Liệt kê tất cả child themes:

```bash
wp jankx themes list
```

### **2. Activate Child Theme**
Kích hoạt một child theme:

```bash
wp jankx themes activate <theme-name>
```

### **3. Deactivate Child Theme**
Hủy kích hoạt một child theme:

```bash
wp jankx themes deactivate <theme-name>
```

## 🔍 **Debug Commands**

### **1. Debug Configuration**
Debug configuration của framework:

```bash
wp jankx debug config
```

### **2. Debug Services**
Debug services đang chạy:

```bash
wp jankx debug services
```

### **3. Debug Routes**
Debug routes đã đăng ký:

```bash
wp jankx debug routes
```

## 📝 **Usage Examples**

### **1. Setup Icon System**
```bash
# Transform Material Icons CSS to JSON
wp jankx icons transform --type=material --css-url="https://fonts.googleapis.com/icon?family=Material+Icons" --output="resources/icons/material/icons.json"

# Activate Material Icons
wp jankx icons activate material

# List all icon types
wp jankx icons list
```

### **2. Manage Framework Cache**
```bash
# Clear all cache
wp jankx cache clear

# Rebuild cache
wp jankx cache rebuild
```

### **3. Development Workflow**
```bash
# Generate new service
wp jankx make service UserService

# Generate new component
wp jankx make component UserCard

# Debug configuration
wp jankx debug config
```

## 🎯 **Benefits của WP CLI Commands**

1. **Automation**: Tự động hóa các tác vụ quản lý
2. **Development**: Hỗ trợ development workflow
3. **Management**: Dễ dàng quản lý framework từ command line
4. **CI/CD**: Tích hợp vào CI/CD pipelines
5. **Server Management**: Quản lý server không có GUI
6. **Bulk Operations**: Thực hiện operations hàng loạt

## 🔧 **Installation & Setup**

WP CLI commands được tự động load khi Jankx Framework được khởi tạo. Không cần cài đặt thêm.

## 📚 **Tài liệu tham khảo**

- [WP-CLI Documentation](https://wp-cli.org/)
- [Jankx Framework Documentation](./README.md)
- [Font Icons System Documentation](./FONT_ICONS_SYSTEM.md)

## 🆘 **Hỗ trợ**

Để được hỗ trợ hoặc báo cáo vấn đề với WP CLI commands, vui lòng liên hệ team phát triển hoặc tạo issue trong repository.

---

**Jankx Framework WP CLI Commands** - Powerful command line tools for Jankx Framework management.