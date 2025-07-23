# Jankx 2.0 Architecture Overview

> **Modern WordPress Theme Framework Architecture**

## 🏗 System Architecture

Jankx 2.0 được xây dựng với kiến trúc layered architecture hiện đại, tối ưu cho performance và maintainability.

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Blocks    │  │   Layouts   │  │  Templates  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Services  │  │   Helpers   │  │   Managers  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │    Kernel   │  │   Container │  │  Bootstrap  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                     WordPress Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │    Hooks    │  │   Filters   │  │   Actions   │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Bootstrapping Flow

### 1. WordPress Initialization
```php
// functions.php
require_once get_template_directory() . '/includes/framework.php';
```

### 2. Framework Bootstrap
```php
// framework.php
Jankx::getInstance()->bootstrap();
```

### 3. Kernel Initialization
```php
// Jankx.php
class Jankx {
    private static $instance = null;
    private $kernel;
    private $container;

    public function bootstrap() {
        $this->kernel = new Kernel();
        $this->container = new ServiceContainer();
        $this->registerServices();
        $this->bootstrappers();
    }
}
```

### 4. Service Registration
```php
// Service registration flow
Kernel → ServiceContainer → ServiceProviders → Services
```

### 5. Bootstrappers Execution
```php
// Bootstrapper execution order
1. CoreBootstrapper
2. AdminBootstrapper (if admin)
3. FrontendBootstrapper (if frontend)
4. ThemeBootstrapper
5. WooCommerceBootstrapper (if WooCommerce)
```

## 🧩 Component Architecture

### Kernel System
- **Kernel**: Core framework initialization
- **ServiceContainer**: Dependency injection container
- **ServiceProviders**: Service registration and configuration
- **Bootstrappers**: Environment-specific initialization

### Gutenberg System
- **BlockRegistry**: Block registration and management
- **BlockRenderer**: Frontend block rendering
- **BlockEditor**: Editor-side functionality
- **LayoutManager**: Layout system management

### Performance System
- **AssetManager**: Asset loading and optimization
- **CacheManager**: Caching strategies
- **LazyLoader**: Lazy loading implementation
- **PerformanceMonitor**: Core Web Vitals monitoring

### Security System
- **SecurityManager**: Security policies
- **Sanitizer**: Input/output sanitization
- **NonceManager**: Nonce verification
- **SVGSanitizer**: SVG security

## 📊 Data Flow

```
User Request
    ↓
WordPress Hooks
    ↓
Jankx Bootstrap
    ↓
Kernel Initialization
    ↓
Service Container
    ↓
Bootstrappers
    ↓
Gutenberg Blocks
    ↓
Frontend Rendering
    ↓
Performance Optimization
    ↓
Security Validation
    ↓
Response
```

## 🔧 Service Container Pattern

### Service Registration
```php
// Service registration
$this->container->singleton('asset.manager', AssetManager::class);
$this->container->singleton('block.registry', BlockRegistry::class);
$this->container->singleton('security.manager', SecurityManager::class);
```

### Dependency Injection
```php
// Service resolution
$assetManager = $this->container->get('asset.manager');
$blockRegistry = $this->container->get('block.registry');
```

## 🎯 Design Principles

### 1. Separation of Concerns
- **Presentation**: Blocks, layouts, templates
- **Business Logic**: Services, helpers, managers
- **Infrastructure**: Kernel, container, bootstrappers

### 2. Dependency Injection
- Loose coupling between components
- Testable and maintainable code
- Service container pattern

### 3. Single Responsibility
- Each class has one reason to change
- Clear boundaries between components
- Focused functionality

### 4. Open/Closed Principle
- Open for extension
- Closed for modification
- Plugin-friendly architecture

## 🚀 Performance Architecture

### Lazy Loading Strategy
```php
// Deferred service loading
class DeferredServiceProvider {
    public function register() {
        // Register service but don't instantiate
        $this->container->bind('heavy.service', HeavyService::class);
    }

    public function boot() {
        // Instantiate when needed
        $this->container->make('heavy.service');
    }
}
```

### Asset Optimization
```php
// Selective asset loading
class AssetManager {
    public function loadBlockAssets($blockName) {
        if ($this->isBlockUsed($blockName)) {
            $this->enqueueBlockAssets($blockName);
        }
    }
}
```

## 🔒 Security Architecture

### Multi-Layer Security
```php
// Security layers
1. Input Sanitization
2. Nonce Verification
3. Capability Checks
4. Output Escaping
5. XSS Prevention
6. CSRF Protection
```

### Security Flow
```
User Input → Sanitization → Validation → Processing → Escaping → Output
```

## 📈 Monitoring & Analytics

### Performance Monitoring
- Core Web Vitals tracking
- Asset loading metrics
- Cache hit/miss ratios
- Error tracking

### Security Monitoring
- Failed authentication attempts
- XSS attack detection
- CSRF token validation
- Malicious input detection

## 🔄 Lifecycle Management

### Request Lifecycle
1. **Initialization**: WordPress loads theme
2. **Bootstrap**: Jankx framework starts
3. **Service Loading**: Dependencies resolved
4. **Request Processing**: User request handled
5. **Response Generation**: Output created
6. **Cleanup**: Resources released

### Block Lifecycle
1. **Registration**: Block registered with WordPress
2. **Editor Loading**: Block editor assets loaded
3. **User Interaction**: User creates/edits block
4. **Data Saving**: Block data saved to database
5. **Frontend Rendering**: Block rendered on frontend
6. **Asset Loading**: Block-specific assets loaded

## 🎨 Template System

### Template Hierarchy
```
templates/
├── layouts/
│   ├── blocks/
│   ├── sections/
│   └── pages/
├── components/
│   ├── blocks/
│   ├── forms/
│   └── navigation/
└── partials/
    ├── header/
    ├── footer/
    └── content/
```

### Rendering Flow
```
Template Request → Template Resolution → Data Binding → Rendering → Output
```

## 🔧 Configuration Management

### Environment Configuration
```php
// Configuration loading
class ConfigManager {
    public function load($environment = 'production') {
        $this->loadBaseConfig();
        $this->loadEnvironmentConfig($environment);
        $this->loadUserConfig();
    }
}
```

### Configuration Hierarchy
1. **Base Configuration**: Default settings
2. **Environment Configuration**: Environment-specific settings
3. **User Configuration**: User customizations
4. **Runtime Configuration**: Dynamic settings

---

**Next**: [Kernel System](./kernel-system.md) | [Service Container](./service-container.md) | [Bootstrapping Flow](./bootstrapping-flow.md)