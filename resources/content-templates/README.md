# Content Templates

This directory contains default HTML templates for post types. When creating a new post of a specific post type, the system will automatically load content from the corresponding template file.

## Usage

### 1. Create Template File

Create an HTML file with the naming format: `<post-type-name>.html`

**Examples:**
- `tour.html` - Template for "tour" post type
- `product.html` - Template for "product" post type
- `event.html` - Template for "event" post type

### 2. Template Content

Template files use WordPress **Block Editor (Gutenberg)** syntax:

```html
<!-- wp:paragraph -->
<p>Your sample content</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Heading</h2>
<!-- /wp:heading -->
```

### 3. Multilingual Support

The system supports **multilingual templates** when using Polylang or other multilingual plugins:

**Naming format:** `<post-type>-<language-code>.html`

**Examples:**
- `tour-vi.html` - Template for Vietnamese tour posts
- `tour-en.html` - Template for English tour posts
- `tour.html` - Default template (fallback)

**How it works:**
- System detects current language from multilingual plugin
- Searches for language-specific template first: `tour-vi.html`
- Falls back to default template if language-specific not found: `tour.html`

### 4. Priority Order

The system will search for templates in the following order:

1. **Child Theme + Language** (Highest priority): `buocchandisan/resources/content-templates/tour-vi.html`
2. **Child Theme + Default**: `buocchandisan/resources/content-templates/tour.html`
3. **Parent Theme + Language**: `jankx/resources/content-templates/tour-vi.html`
4. **Parent Theme + Default**: `jankx/resources/content-templates/tour.html`

### 5. How It Works

- Template is loaded **only once** when opening the new post creation page (auto-draft status)
- If the post already has content, the template will not override it
- The system uses:
  - **Block Editor (Gutenberg)**: `wp_insert_post` action hook
  - **Classic Editor**: `default_content` filter
- Template does not automatically save, it only displays in the editor for user editing

## Real-World Examples

### Example 1: Single Language Template

**File: `tour.html`**

```html
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
    <!-- wp:heading -->
    <h2 class="wp-block-heading">Tour Introduction</h2>
    <!-- /wp:heading -->

    <!-- wp:paragraph -->
    <p>Describe your tour...</p>
    <!-- /wp:paragraph -->

    <!-- wp:columns -->
    <div class="wp-block-columns">
        <!-- wp:column -->
        <div class="wp-block-column">
            <!-- wp:post-featured-image /-->
        </div>
        <!-- /wp:column -->
    </div>
    <!-- /wp:columns -->
</div>
<!-- /wp:group -->
```

### Example 2: Multilingual Templates

**File: `tour-vi.html` (Vietnamese)**

```html
<!-- wp:heading -->
<h2 class="wp-block-heading">Giới thiệu tour</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Mô tả tour của bạn bằng tiếng Việt...</p>
<!-- /wp:paragraph -->
```

**File: `tour-en.html` (English)**

```html
<!-- wp:heading -->
<h2 class="wp-block-heading">Tour Introduction</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Describe your tour in English...</p>
<!-- /wp:paragraph -->
```

**Result:**
- Creating new Vietnamese tour → Loads `tour-vi.html`
- Creating new English tour → Loads `tour-en.html`
- If language-specific template not found → Loads `tour.html` (fallback)

## Notes

- Templates must be valid HTML according to Block Editor standards
- Use built-in WordPress blocks or registered custom blocks
- Child theme has the right to override templates from the parent theme
- Template files are not required to exist for all post types

## Technical Support

This feature is managed by `ContentTemplateServiceProvider` in `features/content-templates/`

Service class: `Jankx\Features\ContentTemplates\Services\ContentTemplateService`
