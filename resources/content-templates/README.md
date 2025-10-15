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

### 3. Priority Order

The system will search for templates in the following order:

1. **Child Theme** (Highest priority): `wp-content/themes/buocchandisan/resources/content-templates/<post-type>.html`
2. **Parent Theme**: `wp-content/themes/jankx/resources/content-templates/<post-type>.html`

### 4. How It Works

- Template is loaded **only once** when opening the new post creation page (auto-draft status)
- If the post already has content, the template will not override it
- The system uses:
  - **Block Editor (Gutenberg)**: `wp_insert_post` action hook
  - **Classic Editor**: `default_content` filter
- Template does not automatically save, it only displays in the editor for user editing

## Real-World Example

### File: `tour.html`

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

## Notes

- Templates must be valid HTML according to Block Editor standards
- Use built-in WordPress blocks or registered custom blocks
- Child theme has the right to override templates from the parent theme
- Template files are not required to exist for all post types

## Technical Support

This feature is managed by `ContentTemplateServiceProvider` in `features/content-templates/`

Service class: `Jankx\Features\ContentTemplates\Services\ContentTemplateService`
