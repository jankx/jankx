# Jankx AI Theme Generation Workflow

This folder contains the metadata and tools necessary for an AI model to autonomously generate WordPress themes using the Jankx Framework.

## 🛠 Tools for AI

### 1. Block Manifest (`manifest.json`)
**Path**: `tests/Gutenberg/fixtures/blocks/manifest.json`
**Use case**: Consult this file to see which blocks are available, their attributes, and their PHP class names.

### 2. Design Tokens (`design-tokens.json`)
**Path**: `tests/Gutenberg/fixtures/blocks/design-tokens.json`
**Use case**: Use these CSS variables for styling. Avoid hardcoding hex colors. Use `var(--wp--preset--color--primary)`, etc.

### 3. Output References (HTML Scenarios)
**Path**: `tests/Gutenberg/fixtures/blocks/output-references/`
**Use case**: Look at these files to see the expected HTML output for different block configurations. This helps in writing CSS selectors that match the framework's output.

### 4. Visual Preview Tool
**Command**: `php scripts/generate-visual-preview.php <block-name> <json-attributes>`
**Use case**: Generates a full HTML page with CSS variables to compare against a design image.

## 🎨 Visual Matching Protocol (From Image to Code)

When you receive a design image, follow these steps:

1. **Color Extraction**: Identify hex codes in the image. Map them to the closest token in `design-tokens.json`.
   - *Example*: Design has a dark purple button -> Found `#503AA8` in `design-tokens.json` as `primary` -> Use `var(--wp--preset--color--primary)`.

2. **Block Selection**:
   - Background Image with Text? -> Use `jankx/swiper-banner`.
   - Grid of features? -> Use `jankx/dynamic-data-layout` with `grid` layout.
   - Fancy Button? -> Use `jankx/advanced-button`.

3. **Attribute Calibration**:
   - Adjust spacing (padding/margin) using the `spacing` tokens.
   - Set alignment and typography based on the visual hierarchy in the image.

4. **Self-Verification**:
   - Run `generate-visual-preview.php`.
   - Compare the output HTML structure/classes against the `output-references`.

## 🚀 Generating a Theme

1. **Analyze Design**: Read the `theme.json` to understand the color palette.
2. **Build Patterns**: Combine core blocks with Jankx blocks in the `patterns/` directory.
3. **Verify**: Use the `render-sandbox.php` to ensure the HTML structure is correct.
4. **Style**: Use the Design Tokens for all spacing, colors, and typography.
5. **Test**: Run `vendor/bin/phpunit` to ensure your changes didn't break existing blocks.

## 📝 Rules of the House
- Always use **Semantic HTML**.
- Prefix custom blocks with `jankx/`.
- Use **BEM methodology** for custom CSS classes.
- Never use `important!` in CSS if there's a design token available.
