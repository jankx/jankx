# 🖋️ Jankx Font Icon System Documentation

The Jankx Font Icon System is a high-performance, modular system for managing and rendering font icons in WordPress. It's built for scale, using a repository pattern with optimized storage and easy-to-use developer interfaces.

## 🏗️ Architecture

The system follows a tiered architecture for maximum flexibility and performance:

1.  **Storage Layer**: Handles data persistence (SQLite or JSON).
2.  **IconRepository**: Manages data logic and caching.
3.  **IconTransformer**: Converts raw CSS files into standardized icon data.
4.  **IconRenderer**: Handles the HTML generation for individual icons.
5.  **Manager**: Coordinates high-level registration and multi-set operations.
6.  **Facade/Helpers**: Provides the developer-facing API.

## 💾 Storage System

To maintain high performance, icon data (the list of icon names) is **moved out of the WordPress options table** to avoid bloating the autoloaded settings.

-   **SQLite (Preferred)**: If the `sqlite3` PHP extension is enabled, icon data is stored in `wp-content/uploads/jankx/icons.db`.
-   **JSON (Fallback)**: Otherwise, icons are saved in `wp-content/uploads/jankx/icons/*.json` using MD5-based filenames from the CSS URL.

## 🚀 Developer Usage

### 1. PHP Facade
The most robust way to interact with the system in modern PHP code.

```php
use Jankx\Facades\Icon;

// Rendering
echo Icon::render('fa-user'); // Default set (FontAwesome)
echo Icon::render('material-icons-settings', 'material'); 

// Management
Icon::fontAwesome('6.5.1', true); // Register with auto-load
Icon::materialIcons(true);
```

### 2. Global Helper Function
Perfect for simple template files where you don't want to use namespaces.

```php
// echo jankx_icon($name, $set, $attributes);
echo jankx_icon('fa-home');
echo jankx_icon('fa-search', 'fontawesome', ['class' => 'red-icon']);
```

### 3. Latte Template Engine
The system is deeply integrated into the Latte engine for first-class templating support.

**As a filter:**
```latte
<span class="btn-icon">{"fa-user"|icon}</span>
<span class="red">{"search"|icon:"material", ["class" => "large"]}</span>
```

**As a function:**
```latte
{icon 'fa-cog'}
{icon 'settings', 'material'}
```

## 🛠️ Management & Registration

Manage your icon collections at **Jankx Dashboard ➜ Icon Pack**.

### Registering Custom Icon Sets
You can register your own icon sets from absolute CSS URLs via the facade or manager:

```php
Icon::register(
    'https://cdn.example.com/icons.css', 
    'my-icons', 
    'My Custom Icons', 
    true // Auto-load CSS?
);
```

### Key Management Operations
-   **Refresh Cache**: Re-scan CSS files for new icons.
-   **Import New Set**: Add via the Admin UI form using a slug and CSS URL.
-   **Edit Config**: Toggle sets or update their names/load behavior.
-   **Switch Storage**: The system automatically adapts to SQLite if the extension is added.

## 📋 Best Practices
-   **Use SQLite**: Ensure the `sqlite3` extension is enabled on your server for the fastest icon lookup times.
-   **Set auto-load carefully**: Only auto-load sets you use globally to keep frontend assets small.
-   **Use the Helper in templates**: Stick to `jankx_icon()` in theme files for maximum readability.
