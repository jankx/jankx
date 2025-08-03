# Translation Guide

## Tổng quan

Jankx Framework hỗ trợ đa ngôn ngữ thông qua WordPress translation system và các file JSON từ cộng đồng translate.

## Cấu trúc thư mục

```
languages/
├── jankx.pot          # Template file cho translators
├── jankx-vi.po        # Vietnamese translation (source)
├── jankx-vi.mo        # Vietnamese translation (compiled)
└── jankx-vi.json      # JSON format cho cộng đồng
```

## 1. Tạo file POT template

### Sử dụng WP-CLI

```bash
# Tạo file POT từ source code
wp i18n make-pot . languages/jankx.pot --domain=jankx

# Hoặc tạo từ thư mục includes
wp i18n make-pot includes languages/jankx.pot --domain=jankx
```

### Sử dụng Poedit

1. Mở Poedit
2. File → New
3. Chọn "jankx" domain
4. Chọn thư mục `includes/` làm source
5. Lưu file `languages/jankx.pot`

## 2. Tạo file PO từ POT

```bash
# Copy POT thành PO cho ngôn ngữ cụ thể
cp languages/jankx.pot languages/jankx-vi.po
```

## 3. Translate với Poedit

1. Mở file `languages/jankx-vi.po` trong Poedit
2. Translate từng string
3. Lưu file (tự động tạo .mo)

## 4. Tạo file JSON cho cộng đồng

### Sử dụng WP-CLI

```bash
# Export PO sang JSON
wp i18n make-json languages/jankx-vi.po languages/ --no-purge

# Hoặc tạo JSON từ thư mục languages
wp i18n make-json languages/ languages/ --format=jed
```

### Sử dụng Poedit

1. File → Export to JSON
2. Chọn format: "Jed 1.x"
3. Lưu thành `languages/jankx-vi.json`

## 5. Cấu hình theme để load JSON

### Trong functions.php hoặc ThemeServiceProvider

```php
/**
 * Load theme textdomain và JSON translations
 */
public function loadTextDomain()
{
    // Load textdomain truyền thống
    load_theme_textdomain('jankx', get_template_directory() . '/languages');

    // Load JSON translations cho JavaScript
    add_action('wp_enqueue_scripts', [$this, 'loadJsonTranslations']);
    add_action('admin_enqueue_scripts', [$this, 'loadJsonTranslations']);
}

/**
 * Load JSON translations cho JavaScript
 */
public function loadJsonTranslations()
{
    $locale = get_locale();
    $json_file = get_template_directory() . '/languages/jankx-' . $locale . '.json';

    if (file_exists($json_file)) {
        wp_localize_script('jankx-theme', 'jankxTranslations', [
            'locale' => $locale,
            'translations' => json_decode(file_get_contents($json_file), true)
        ]);
    }
}
```

## 6. Sử dụng MultiLanguageServiceProvider với JSON

### Cấu hình Provider

```php
// Trong config/providers.php
'providers' => [
    // ... existing providers ...
    \Jankx\Support\Providers\MultiLanguageServiceProvider::class,
],
```

### Extend MultiLanguageServiceProvider

```php
<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;

class CustomMultiLanguageServiceProvider extends MultiLanguageServiceProvider
{
    public function register(Application $app)
    {
        parent::register($app);

        // Load JSON translations
        add_action('wp_enqueue_scripts', [$this, 'loadJsonTranslations']);
        add_action('admin_enqueue_scripts', [$this, 'loadJsonTranslations']);
        add_action('enqueue_block_editor_assets', [$this, 'loadJsonTranslations']);
    }

    /**
     * Load JSON translations cho JavaScript
     */
    public function loadJsonTranslations()
    {
        $locale = $this->getCurrentLanguage();
        $json_file = get_template_directory() . '/languages/jankx-' . $locale . '.json';

        if (file_exists($json_file)) {
            $translations = json_decode(file_get_contents($json_file), true);

            // Load cho frontend
            if (!is_admin()) {
                wp_localize_script('jankx-theme', 'jankxTranslations', [
                    'locale' => $locale,
                    'translations' => $translations,
                    'direction' => is_rtl() ? 'rtl' : 'ltr'
                ]);
            }

            // Load cho admin
            if (is_admin()) {
                wp_localize_script('jankx-admin', 'jankxTranslations', [
                    'locale' => $locale,
                    'translations' => $translations,
                    'direction' => is_rtl() ? 'rtl' : 'ltr'
                ]);
            }

            // Load cho Gutenberg editor
            if (function_exists('get_current_screen') && get_current_screen() && get_current_screen()->is_block_editor) {
                wp_localize_script('jankx-blocks', 'jankxTranslations', [
                    'locale' => $locale,
                    'translations' => $translations,
                    'direction' => is_rtl() ? 'rtl' : 'ltr'
                ]);
            }
        }
    }

    /**
     * Get translation helper cho view
     */
    public function getTranslationHelper()
    {
        return [
            'locale' => $this->getCurrentLanguage(),
            'direction' => is_rtl() ? 'rtl' : 'ltr',
            'languages' => $this->getLanguages(),
            'switcher' => $this->renderLanguageSwitcher()
        ];
    }
}
```

### Sử dụng trong View

```php
<?php
// Trong template file
$lang = \Jankx\Facades\App::make('multilang')->getTranslationHelper();
?>

<html lang="<?php echo esc_attr($lang['locale']); ?>" dir="<?php echo esc_attr($lang['direction']); ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php esc_html_e('Site Title', 'jankx'); ?></title>
</head>
<body class="<?php echo esc_attr($lang['direction']); ?>">
    <header>
        <?php echo $lang['switcher']; ?>
    </header>

    <main>
        <h1><?php esc_html_e('Welcome', 'jankx'); ?></h1>
    </main>
</body>
</html>
```

## 7. Sử dụng trong JavaScript

### Frontend JavaScript

```javascript
// Lấy translation từ JSON
function __(text, domain = 'jankx') {
    if (window.jankxTranslations && window.jankxTranslations.translations) {
        const translations = window.jankxTranslations.translations;
        return translations[text] || text;
    }
    return text;
}

// Sử dụng
const message = __('Hello World');
console.log(message); // "Xin chào" (nếu locale là vi)

// Lấy direction
const direction = window.jankxTranslations?.direction || 'ltr';
document.body.setAttribute('dir', direction);
```

### Gutenberg Blocks

```javascript
// Trong block editor
import { __ } from '@wordpress/i18n';

// WordPress sẽ tự động load JSON từ thư mục languages/
const title = __('Block Title', 'jankx');

// Custom translation function cho Jankx
function jankx__(text) {
    if (window.jankxTranslations && window.jankxTranslations.translations) {
        return window.jankxTranslations.translations[text] || text;
    }
    return text;
}

const customTitle = jankx__('Custom Block Title');
```

### React Components

```jsx
import React from 'react';

function MyComponent() {
    const { translations, direction } = window.jankxTranslations || {};

    return (
        <div dir={direction}>
            <h1>{translations?.['Welcome'] || 'Welcome'}</h1>
            <p>{translations?.['Description'] || 'Description'}</p>
        </div>
    );
}
```

## 8. Cập nhật từ cộng đồng

### Từ file JSON của cộng đồng

```bash
# Download JSON từ cộng đồng
wget https://translate.wordpress.org/projects/wp-themes/jankx/vi/default/export-translations/?format=json -O languages/jankx-vi-community.json

# Merge với file hiện tại
wp i18n make-json languages/jankx-vi-community.json languages/ --merge-with=languages/jankx-vi.json
```

### Từ WordPress.org

```bash
# Download từ WordPress.org
wp i18n download-translations jankx vi

# Hoặc từ GlotPress
wp i18n download-translations jankx vi --source=glotpress
```

## 9. Validation và Testing

### Kiểm tra syntax

```bash
# Validate PO file
wp i18n validate languages/jankx-vi.po

# Validate JSON file
wp i18n validate languages/jankx-vi.json
```

### Test translation

```bash
# Test với locale cụ thể
wp eval "switch_to_locale('vi'); echo __('Hello World', 'jankx'); restore_previous_locale();"
```

## 10. Automation

### Script tự động update

```bash
#!/bin/bash
# update-translations.sh

LOCALE="vi"
DOMAIN="jankx"

# 1. Update POT từ source
wp i18n make-pot . languages/${DOMAIN}.pot --domain=${DOMAIN}

# 2. Update PO từ POT
msgmerge --update languages/${DOMAIN}-${LOCALE}.po languages/${DOMAIN}.pot

# 3. Compile MO
msgfmt languages/${DOMAIN}-${LOCALE}.po -o languages/${DOMAIN}-${LOCALE}.mo

# 4. Generate JSON
wp i18n make-json languages/${DOMAIN}-${LOCALE}.po languages/ --no-purge

echo "Translations updated for ${LOCALE}"
```

### GitHub Actions

```yaml
# .github/workflows/translations.yml
name: Update Translations

on:
  push:
    paths:
      - 'includes/**'
      - 'patterns/**'
      - 'templates/**'

jobs:
  update-translations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup WordPress
        run: |
          wp core download
          wp config create --dbname=test --dbuser=root --dbpass=password
      - name: Update POT
        run: wp i18n make-pot . languages/jankx.pot --domain=jankx
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add languages/
          git commit -m "Update translation template" || exit 0
          git push
```

## 11. Best Practices

### Naming Convention

- File POT: `jankx.pot`
- File PO: `jankx-{locale}.po` (ví dụ: `jankx-vi.po`)
- File MO: `jankx-{locale}.mo`
- File JSON: `jankx-{locale}.json`

### Text Domain

- Luôn dùng `jankx` làm text domain
- Không dùng hardcoded strings
- Sử dụng `__()`, `_e()`, `esc_html__()`, `esc_attr__()`

### Context và Comments

```php
// translators: %s: user name
$message = sprintf(__('Hello %s', 'jankx'), $user_name);

// translators: 1: post count, 2: comment count
$message = sprintf(
    _n('%1$s post, %2$s comment', '%1$s posts, %2$s comments', $post_count, 'jankx'),
    $post_count,
    $comment_count
);
```

### Plural Forms

```php
// Vietnamese: 1 form
$message = _n('One comment', '%d comments', $count, 'jankx');

// English: 2 forms
$message = _n('One comment', '%d comments', $count, 'jankx');
```

## 12. Troubleshooting

### JSON không load

```php
// Debug JSON loading
add_action('wp_footer', function() {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        echo '<script>console.log("Translations:", window.jankxTranslations);</script>';
    }
});
```

### Cache issues

```bash
# Clear translation cache
wp cache flush

# Clear theme cache
wp jankx clear_cache
```

### Locale detection

```php
// Debug locale
add_action('init', function() {
    error_log('Current locale: ' . get_locale());
    error_log('Available translations: ' . print_r(get_available_languages(), true));
});
```

## 13. Community Integration

### WordPress.org

1. Tạo project trên translate.wordpress.org
2. Upload POT file
3. Cộng đồng translate online
4. Download JSON/PO files

### GitHub

1. Tạo repository riêng cho translations
2. Sử dụng GitHub Actions để sync
3. Accept pull requests từ cộng đồng

### Localization Platform

- **Poedit**: Desktop app
- **Loco Translate**: WordPress plugin
- **WPML String Translation**: Commercial plugin
- **Polylang**: Free plugin với string translation

## Kết luận

Với workflow này, bạn có thể:
- Tạo và maintain translations dễ dàng
- Tích hợp với cộng đồng translate
- Automate quá trình update
- Support cả PHP và JavaScript translations
- Test và validate translations trước khi release
- Sử dụng MultiLanguageServiceProvider để quản lý translations một cách thống nhất