# Jankx Framework Architecture

## Overview

Jankx Framework là một framework PHP hiện đại được thiết kế cho WordPress themes, cung cấp cấu trúc modular và các tính năng mạnh mẽ cho việc phát triển theme.

## Triết lý phát triển

### Nguyên tắc cốt lõi

**"Tất cả tính năng đều load qua Service Provider"**

Đây là triết lý phát triển cốt lõi của Jankx Framework, đảm bảo tính nhất quán và modularity trong toàn bộ hệ thống:

#### 1. **Modularity**
- Mọi tính năng được đóng gói trong Service Provider riêng biệt
- Mỗi provider có trách nhiệm rõ ràng và độc lập
- Dễ dàng thêm/xóa tính năng mà không ảnh hưởng đến các phần khác

#### 2. **Lazy Loading**
- Services chỉ được load khi cần thiết
- Tối ưu performance và memory usage
- Bootstrap theo thứ tự logic và dependency

#### 3. **Dependency Injection**
- Tất cả dependencies được inject qua Application Container
- Loại bỏ tight coupling giữa các components
- Dễ dàng test và mock services

#### 4. **Testability**
- Mỗi service có thể được test độc lập
- Dễ dàng mock dependencies cho unit testing
- Clear separation of concerns

#### 5. **Extensibility**
- Dễ dàng thêm/xóa tính năng bằng cách đăng ký/hủy Service Provider
- Child themes có thể override hoặc extend providers
- Plugin developers có thể hook vào framework

#### 6. **Consistency**
- Tất cả features follow cùng một pattern
- Uniform API và coding standards
- Predictable behavior và structure

## Core Components

### 1. Foundation Layer

#### Application Container
- **Location**: `includes/Jankx/Foundation/Application.php`
- **Purpose**: Dependency injection container và service locator
- **Features**:
  - Service registration và resolution
  - Singleton management
  - Configuration management

#### Bootstrap System
- **Location**: `includes/Jankx/Foundation/Bootstrap/`
- **Components**:
  - `LoadConfiguration.php`: Load và cache configuration
  - `RegisterFacades.php`: Đăng ký Facades
  - `RegisterProviders.php`: Đăng ký Service Providers
  - `BootProviders.php`: Khởi động Service Providers
  - `HandleExceptions.php`: Xử lý exceptions
  - `RegisterLogger.php`: Đăng ký logging system

#### Kernel System
- **HTTP Kernels**: `app/Http/`
  - `FrontendKernel.php`: Frontend requests
  - `DashboardKernel.php`: Admin dashboard
  - `AdminAjaxKernel.php`: AJAX requests
  - `RestApiKernel.php`: REST API requests
- **Console Kernels**: `app/Console/`
  - `WpCliKernel.php`: WP CLI commands
  - `WpCronKernel.php`: WordPress cron jobs

### 2. Service Providers

#### Core Providers
- **AppServiceProvider**: Đăng ký core services (UrlManager, AssetService)
- **SystemServiceProvider**: Xử lý system services và class aliases
- **ErrorSuppressionServiceProvider**: Quản lý error suppression
- **TranslationServiceProvider**: Multi-language support

#### Feature Providers
- **LayoutServiceProvider**: Layout management
- **GutenbergServiceProvider**: Gutenberg blocks
- **WordPressCliServiceProvider**: WP CLI commands

### 3. Facades

#### Core Facades
- **App**: Access to Application container
- **Config**: Configuration management
- **Log**: Logging system
- **Url**: URL generation (new)
- **Asset**: Asset management

### 4. Services & Managers

#### URL Management
- **UrlManager**: Centralized URL generation
  - Theme URLs
  - Asset URLs
  - Block URLs
  - WordPress URLs

#### Asset Management
- **AssetService**: Theme asset management
  - Stylesheet enqueuing
  - Script enqueuing
  - Asset URL generation (delegated to UrlManager)

#### Configuration Management
- **Repository**: Configuration storage và access
- **Deep Merge**: Child theme configuration override
- **Caching**: CRC32-based config caching

### 5. Gutenberg Integration

#### Block System
- **Location**: `resources/blocks/`
- **Structure**:
  - `{block-name}/index.js`: Editor logic
  - `{block-name}/block.json`: Block configuration
  - `{block-name}/style.css`: Block styles
  - `{block-name}/build/`: Built assets

#### Block Classes
- **Block**: Base class cho tất cả blocks
- **WidgetRendererBlock**: Widget rendering block
- **GutenbergRepository**: Block discovery và registration

### 6. Multi-Language Support

#### TranslationServiceProvider
- **Text Domain Loading**: Automatic text domain loading
- **RTL/LTR Support**: Direction detection và support
- **Language Detection**: Polylang/WPML integration
- **Language Switcher**: Automatic language switcher
- **Direction Classes**: Body classes cho direction

#### Supported Languages
- **RTL Languages**: Arabic, Hebrew, Persian, Urdu, Pashto, Sindhi, Kurdish, Yiddish
- **LTR Languages**: English, Vietnamese, và others
- **Plugin Integration**: Polylang, WPML

### 7. Error Management

#### Error Suppression System
- **Configuration-based**: Suppression rules từ config
- **Types**:
  - `doing_it_wrong` notices
  - PHP errors
  - Admin notices
- **Granular Control**: Per-function và pattern-based suppression

## Configuration System

### File Structure
```
config/
├── app.php          # Application settings
├── providers.php    # Service provider registration
├── error.php        # Error suppression rules
└── layout.php       # Layout configuration
```

### Child Theme Override
- **Deep Merge**: Child theme configs override parent
- **Selective Override**: Chỉ override declared keys
- **Caching**: CRC32-based caching cho performance

## Development Workflow

### 1. Service Provider Development
```php
class CustomServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // Register services
    }

    public function boot(Application $app)
    {
        // Bootstrap services
    }
}
```

### 2. Gutenberg Block Development
```bash
# Create block structure
resources/blocks/my-block/
├── index.js
├── block.json
└── style.css

# Build block
npm run build:my-block
```

### 3. Multi-Language Development
```php
// Automatic language detection
$language = TranslationServiceProvider::getCurrentLanguage();
$direction = TranslationServiceProvider::getCurrentDirection();

// Language switcher automatically rendered
```

## Best Practices

### 1. Service Registration
- Use Service Providers cho feature registration
- Register services trong `register()` method
- Bootstrap trong `boot()` method

### 2. URL Generation
- Always use `Url` Facade cho URL generation
- Never hardcode URLs
- Use appropriate methods: `Url::asset()`, `Url::blockAsset()`, etc.

### 3. Configuration
- Use `Config` Facade cho configuration access
- Cache configurations khi có thể
- Use child theme overrides cho customization

### 4. Error Handling
- Use `Log` Facade cho logging
- Configure error suppression trong `config/error.php`
- Follow WordPress coding standards

### 5. Multi-Language
- Use `TranslationServiceProvider` cho language support
- Support RTL/LTR languages
- Integrate với Polylang/WPML

## Testing

### Test Structure
```
tests/
├── Foundation/     # Core framework tests
├── Support/        # Service provider tests
├── Managers/       # Manager class tests
└── bootstrap.php   # Test bootstrap
```

### Running Tests
```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test
./vendor/bin/phpunit tests/Support/Providers/TranslationServiceProviderTest.php
```

## Performance Considerations

### 1. Configuration Caching
- CRC32-based caching
- Automatic cache invalidation
- Child theme override support

### 2. Asset Management
- Centralized URL generation
- Proper asset enqueuing
- Build system integration

### 3. Service Provider Optimization
- Lazy loading khi có thể
- Proper hook timing
- Minimal memory footprint

## Security

### 1. Input Sanitization
- Always sanitize inputs
- Use WordPress sanitization functions
- Validate configuration data

### 2. Output Escaping
- Escape all output
- Use appropriate escaping functions
- Follow WordPress security guidelines

### 3. Error Handling
- Don't expose sensitive information
- Log errors appropriately
- Handle exceptions gracefully
