# Code Review Guidelines

> **Jankx 2.0 Code Review Standards**

Tài liệu này định nghĩa quy trình và tiêu chuẩn code review cho Jankx 2.0 framework.

## 🎯 Review Principles

### **1. Architecture Consistency**
- Tuân thủ layered architecture
- Sử dụng đúng patterns (DI, Facade, Repository)
- Không vi phạm separation of concerns

### **2. Code Quality**
- Tuân thủ coding rules và standards
- Sử dụng type declarations
- Implement proper error handling

### **3. Performance & Security**
- Không có memory leaks
- Sử dụng lazy loading khi cần
- Validate và sanitize input

## 📋 Review Checklist

### **🏗 Architecture Review**

#### **✅ Service Container Usage**
```php
// ✅ GOOD - Proper DI
class UserService
{
    private $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    public function getUser(int $userId): ?User
    {
        return $this->container->make(UserRepository::class)->find($userId);
    }
}

// ❌ BAD - Direct instantiation
class UserService
{
    public function getUser(int $userId): ?User
    {
        return new UserRepository()->find($userId);
    }
}
```

#### **✅ Configuration Management**
```php
// ✅ GOOD - Config Facade usage
$providers = \Jankx\Facades\Config::get('app.providers.frontend', []);
$debugMode = \Jankx\Facades\Config::get('app.debug', false);

// ❌ BAD - Direct config access
$providers = $this->config['app']['providers']['frontend'] ?? [];
```

#### **✅ WordPress Integration**
```php
// ✅ GOOD - Direct WordPress function calls
$content = \get_the_content() ?: '';
$excerpt = \get_the_excerpt() ?: '';
$hasBlocks = \has_blocks($content);
$isAdmin = \is_admin();

// WordPress hooks
\add_action('init', [$this, 'initialize']);
\add_filter('the_content', [$this, 'processContent']);

// ❌ BAD - WordPressAdapter usage (removed)
$content = $this->wordPressAdapter->getCurrentContent();
$hasBlocks = $this->wordPressAdapter->hasBlocks($content);
```

#### **✅ Context Detection**
```php
// ✅ GOOD - Kernel Facade usage
$context = \Jankx\Facades\Kernel::getCurrentContext();

switch ($context) {
    case 'frontend':
        // Frontend logic
        break;
    case 'admin':
        // Admin logic
        break;
}

// ❌ BAD - Manual context detection
private function getCurrentContext(): string
{
    if (defined('WP_CLI') && WP_CLI) return 'cli';
    if (wp_doing_ajax()) return 'ajax';
    if (is_admin()) return 'admin';
    return 'frontend';
}
```

### **🔧 Service Provider Review**

#### **✅ Service Provider Structure**
```php
// ✅ GOOD - Proper Service Provider
class MyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->singleton(MyService::class);
        $this->singleton(MyRepository::class);
    }

    public function boot(): void
    {
        // Boot logic here
    }
}

// ❌ BAD - Direct service registration
class MyBootstrapper extends AbstractBootstrapper
{
    public function bootstrap(Container $container): void
    {
        $container->singleton(MyService::class); // ❌ Should be in Service Provider
    }
}
```

### **📝 Code Quality Review**

#### **✅ Type Declarations**
```php
// ✅ GOOD - Full type declarations
public function getUser(int $userId): ?User
{
    return $this->repository->find($userId);
}

// ❌ BAD - Missing type declarations
public function getUser($userId)
{
    return $this->repository->find($userId);
}
```

#### **✅ Error Handling**
```php
// ✅ GOOD - Proper exception handling
try {
    $service = $container->make(MyService::class);
    $result = $service->doSomething();
} catch (BindingResolutionException $e) {
    Logger::error('Service not found: ' . $e->getMessage());
} catch (Exception $e) {
    Logger::error('Unexpected error: ' . $e->getMessage());
}

// ❌ BAD - No error handling
$service = $container->make(MyService::class);
$result = $service->doSomething();
```

#### **✅ Logging**
```php
// ✅ GOOD - Structured logging
Logger::debug('Service registered', [
    'service' => MyService::class,
    'context' => Kernel::getCurrentContext()
]);

Logger::error('Service failed', [
    'service' => MyService::class,
    'error' => $e->getMessage(),
    'trace' => $e->getTraceAsString()
]);

// ❌ BAD - Echo or error_log
echo "Service registered";
error_log("Service failed");
```

### **🏗 Bootstrapper Review**

#### **✅ Bootstrapper Structure**
```php
// ✅ GOOD - Proper Bootstrapper
class MyBootstrapper extends AbstractBootstrapper
{
    public function bootstrap(Container $container): void
    {
        // Register services via Service Provider
        // Setup hooks
        add_action('init', [$this, 'initialize']);
    }

    public function getPriority(): int
    {
        return 10; // Lower = higher priority
    }

    public function shouldRun(): bool
    {
        return !is_admin(); // Only in frontend
    }
}

// ❌ BAD - Missing required methods
class MyBootstrapper extends AbstractBootstrapper
{
    public function bootstrap(Container $container): void
    {
        // Missing getPriority() and shouldRun()
    }
}
```

### **🎭 Facade Usage Review**

#### **✅ Allowed Facades**
```php
// ✅ GOOD - Config Facade
$value = \Jankx\Facades\Config::get('app.providers.frontend');
$allConfig = \Jankx\Facades\Config::all();

// ✅ GOOD - Logger Facade
\Jankx\Facades\Logger::debug('message', ['data' => $data]);
\Jankx\Facades\Logger::error('error message');

// ✅ GOOD - Kernel Facade
$context = \Jankx\Facades\Kernel::getCurrentContext();
```

#### **❌ Forbidden Facades**
```php
// ❌ BAD - Options Facade (removed)
$option = \Jankx\Facades\Options::get('option_name');
```

### **🧪 Testing Review**

#### **✅ Test Structure**
```php
// ✅ GOOD - Proper test structure
class MyServiceTest extends TestCase
{
    private $container;
    private $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->container = new Container();
        $this->service = new MyService($this->container);
    }

    public function testServiceMethod(): void
    {
        $result = $this->service->doSomething();
        $this->assertNotNull($result);
    }
}

// ❌ BAD - Missing setup or assertions
class MyServiceTest extends TestCase
{
    public function testServiceMethod(): void
    {
        $service = new MyService();
        $service->doSomething();
        // No assertions
    }
}
```

## 🚫 Common Anti-Patterns

### **1. ❌ Global State Usage**
```php
// ❌ BAD - Global variables
global $myService;
$myService = new MyService();

// ✅ GOOD - Use container
$container->singleton(MyService::class);
$service = $container->make(MyService::class);
```

### **2. ❌ Direct WordPress Calls in Business Logic**
```php
// ❌ BAD - WordPress calls in business logic
class UserService
{
    public function getCurrentUser()
    {
        return wp_get_current_user(); // ❌ Direct call
    }
}

// ✅ GOOD - Direct WordPress calls when needed
class UserService
{
    public function getCurrentUser()
    {
        return \wp_get_current_user(); // ✅ Direct call with namespace
    }
}
```

### **3. ❌ Complex Dependencies**
```php
// ❌ BAD - Too many dependencies
class ComplexService
{
    public function __construct(
        UserService $userService,
        ConfigService $configService,
        LoggerService $loggerService,
        CacheService $cacheService,
        DatabaseService $databaseService
    ) {
        // Too complex
    }
}

// ✅ GOOD - Break into smaller services
class SimpleService
{
    public function __construct(Container $container)
    {
        $this->container = $container;
    }
}
```

### **4. ❌ Missing Error Handling**
```php
// ❌ BAD - No error handling
public function loadService(string $serviceClass): void
{
    $service = new $serviceClass($this->container);
    $service->register();
}

// ✅ GOOD - Proper error handling
public function loadService(string $serviceClass): void
{
    try {
        if (!class_exists($serviceClass)) {
            throw new \InvalidArgumentException("Service {$serviceClass} does not exist");
        }

        $service = new $serviceClass($this->container);
        $service->register();
    } catch (\Exception $e) {
        Logger::error("Failed to load service {$serviceClass}: " . $e->getMessage());
    }
}
```

## 📋 Review Process

### **1. Pre-Review Checklist**
- [ ] Code follows naming conventions
- [ ] Type declarations are used
- [ ] Error handling is implemented
- [ ] Logging is structured
- [ ] Tests are included
- [ ] Documentation is updated

### **2. Architecture Review**
- [ ] Uses proper DI pattern
- [ ] Follows layered architecture
- [ ] Uses Config Facade for configuration
- [ ] Uses Kernel Facade for context detection
- [ ] Uses direct WordPress function calls
- [ ] No WordPressAdapter usage

### **3. Code Quality Review**
- [ ] SOLID principles followed
- [ ] KISS principle applied
- [ ] No anti-patterns
- [ ] Performance considerations
- [ ] Security best practices

### **4. Testing Review**
- [ ] Unit tests included
- [ ] Integration tests if needed
- [ ] Mocking used appropriately
- [ ] Test coverage adequate

## 🎯 Review Guidelines

### **✅ Approve When:**
- Code follows all standards
- Architecture is consistent
- Tests are comprehensive
- Documentation is updated
- No anti-patterns detected

### **❌ Request Changes When:**
- Missing type declarations
- No error handling
- Uses forbidden patterns
- Missing tests
- Poor documentation
- Performance issues
- Security concerns

### **🔄 Request Discussion When:**
- Architecture decisions unclear
- Performance impact uncertain
- Security implications unclear
- Testing strategy unclear

## 📝 Review Comments

### **✅ Good Comment Examples**
```php
// ✅ GOOD - Specific and actionable
"Please add type declaration for $userId parameter"
"Consider using Config Facade instead of direct array access"
"Add error handling for the service registration"
"Missing test for the error case"
```

### **❌ Bad Comment Examples**
```php
// ❌ BAD - Vague and unhelpful
"Fix this"
"Not good"
"Should be better"
"Add tests"
```

## 🎯 Review Metrics

### **Quality Metrics**
- **Type Declaration Coverage**: 100%
- **Error Handling Coverage**: 100%
- **Test Coverage**: >80%
- **Documentation Coverage**: 100%

### **Performance Metrics**
- **Memory Usage**: No leaks
- **Execution Time**: Within acceptable limits
- **Database Queries**: Optimized

### **Security Metrics**
- **Input Validation**: 100%
- **Permission Checks**: Implemented
- **Data Sanitization**: Applied

---

**Jankx 2.0 Code Review Guidelines** - Modern WordPress Theme Framework Standards 🚀

*Last updated: Development Phase*
*Framework version: 2.0.0-dev*