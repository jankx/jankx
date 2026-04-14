# Jankx AI Generation Specification

This document provides technical mapping rules for AI models to generate Jankx-compliant components and themes from visual designs (Figma/Images).

## 1. CSS Level Mapping Rules

When generating CSS, categorize rules into the following levels:

### CORE_LAYOUT (Level 1)
- **What to include**: Base layout tokens, utility classes, and fundamental design rules.
- **Examples**: 
    - Flexbox containers (`.is-flex-container`)
    - Image Aspect Ratio foundations (`.has-image-ratio`)
    - Generic Grid Column systems (`.columns-3`)
- **Action**: Add to `ContentLayoutServiceProvider::boot()` via `AssetResolver::CORE_LAYOUT`.

### LAYOUT_TYPE (Level 2)
- **What to include**: Styles shared by multiple instances of the same component type.
- **Examples**:
    - Carousel navigation arrows and dots.
    - Post card skins (e.g. "Card Overlay", "Simple Card").
    - Taxonomy badge styles.
- **Action**: Add to the `Parser` class of the layout via `AssetResolver::LAYOUT_TYPE`.

### INSTANCE (Level 3)
- **What to include**: Styles unique to a specific block instance, often involving instance-specific IDs.
- **Examples**:
    - Specific image ratio for a single block (`#jkx-layout-123 { --jankx-image-ratio: 75%; }`).
    - Custom colors/margins applied only to one block instance.
- **Action**: Add to the `generateDynamicCss()` method in the `Parser` class.

## 2. Component Logic Mapping

Each UI component in a design should map to:
1. **PHP Block Class**: `includes/framework/Gutenberg/Blocks/{Name}Block.php`
2. **Data Parser**: `includes/framework/Layouts/DynamicDataLayout/Parsers/{Name}LayoutDataParser.php`
3. **Template**: `includes/framework/Layouts/templates/post-layout/{name}.php`

### AI Instruction for Templates:
Always use Semantic HTML. Use classes defined in `CORE_LAYOUT` or `LAYOUT_TYPE` instead of inline styles.

- **Bad**: `<div style="display: flex; gap: 10px;">`
- **Good**: `<div class="is-flex-container">`

## 3. SEO & Performance Requirements

1. **Anti-CLS**: Always provide aspect ratio CSS using the `--jankx-image-ratio` variable.
2. **Deduplication**: Never repeat the same CSS block. If multiple components share code, move it to `LAYOUT_TYPE`.
3. **Lazy Loading**: If a component requires a library (like Swiper or Embla), only load it when the component is active.
4. **Unique IDs**: Use `AssetResolver::generateUniqueId()` for elements needing specific scoping.

## 4. Ground Truth Examples

Refer to:
- `Jankx\Services\AssetResolver` for CSS management logic.
- `Jankx\Layouts\DynamicDataLayout\Parsers\CarouselLayoutDataParser` for level 2 CSS usage.
- `Jankx\Layouts\templates\post-layout\carousel.php` for clean template implementation.
