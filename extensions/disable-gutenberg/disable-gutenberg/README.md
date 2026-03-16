# Disable Gutenberg Extension for Jankx

A lightweight extension for the Jankx Theme Framework that completely disables the Gutenberg block editor and all associated block-related features.

## Description

While Jankx is built with a "Gutenberg-first" approach, there are scenarios where a traditional classic editor experience is preferred or where block features are not required. This extension provides a clean way to toggle off all Gutenberg functionality through the Jankx Extension system.

## Features

- **Disables Block Editor**: Replaces the Gutenberg editor with the Classic Editor for all post types.
- **Removes Theme Support**: Automatically removes support for `block-templates`, `block-template-parts`, and `core-block-patterns`.
- **Hides Widgets Block Editor**: Reverts the widgets management screen to the classic interface.
- **Framework Integration**: Prevents the Jankx Framework from registering its custom blocks, saving server resources and improving performance.

## Installation

### Via Jankx Marketplace
1. Navigate to **Jankx Dashboard > Marketplace**.
2. Search for "Disable Gutenberg".
3. Click **Install Now**.
4. Go to **Jankx Dashboard > Extensions** and click **Activate**.

### Manual Installation
1. Download the extension folder.
2. Upload it to your theme's `extensions/` directory (located at `wp-content/themes/your-theme/extensions/disable-gutenberg`).
3. The extension will appear in your **Jankx Extensions** manager.
4. Click **Activate**.

## How It Works

This extension leverages the `jankx/gutenberg/enabled` filter introduced in Jankx Core. When activated, it returns `false` to this filter, which triggers a cascading disablement of Gutenberg features in both the framework and the application layers.

```php
add_filter('jankx/gutenberg/enabled', '__return_false');
```

## Requirements

- **Jankx Framework**: v2.0.0 or higher.
- **PHP**: v7.4 or higher.

## License

GPL-2.0-or-later
