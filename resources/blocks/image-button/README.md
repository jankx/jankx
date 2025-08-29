# Image Button Block

A comprehensive button block for the Jankx theme, cloned from WordPress core button block with full functionality.

## Features

### Core Functionality
- **Rich Text Editing**: Full rich text editing capabilities with formatting options
- **Link Management**: Add, edit, and remove links with advanced options
- **HTML Element Control**: Switch between `<a>` and `<button>` elements
- **Width Control**: Set button width to 25%, 50%, 75%, or 100%
- **Alignment**: Text alignment controls (left, center, right)

### Styling Options
- **Color Support**: Background and text color controls
- **Gradient Support**: Apply gradient backgrounds
- **Typography**: Full typography controls including font family, size, weight, style, etc.
- **Border Controls**: Border color, radius, style, and width
- **Spacing**: Padding controls for horizontal and vertical spacing
- **Shadow**: Box shadow controls
- **Block Styles**: Fill and outline style variations

### Advanced Features
- **Accessibility**: Full accessibility support with proper ARIA attributes
- **Keyboard Navigation**: Support for keyboard shortcuts (Ctrl+K for link editing)
- **Responsive Design**: Responsive behavior across different screen sizes
- **Block Bindings**: Support for dynamic content binding
- **Interactivity**: Client-side navigation support

## File Structure

```
resources/blocks/image-button/
├── block.json              # Block metadata and configuration
├── index.tsx               # Block registration and settings
├── edit.tsx                # Editor component (489 lines)
├── save.tsx                # Save component
├── constants.ts            # Constants for link attributes
├── get-updated-link-attributes.ts  # Link attribute utilities
├── deprecated.ts           # Deprecated versions for backward compatibility
├── style.scss              # Frontend styles
├── editor.scss             # Editor-specific styles
├── jankx-image-button.css  # Compiled frontend CSS
└── README.md               # This file
```

## Usage

### In Gutenberg Editor
1. Add the "Image Button" block from the Jankx blocks category
2. Edit the button text using the rich text editor
3. Use the toolbar to add/edit links (Ctrl+K shortcut)
4. Configure styling options in the sidebar
5. Set width and alignment as needed

### Block Attributes

```typescript
interface ImageButtonAttributes {
  tagName?: 'a' | 'button';           // HTML element type
  type?: string;                      // Button type (for button elements)
  textAlign?: string;                 // Text alignment
  url?: string;                       // Link URL
  title?: string;                     // Link title attribute
  text?: string;                      // Button text content
  linkTarget?: string;                // Link target (_blank, etc.)
  rel?: string;                       // Link rel attribute
  placeholder?: string;               // Placeholder text
  backgroundColor?: string;           // Background color
  textColor?: string;                 // Text color
  gradient?: string;                  // Gradient background
  width?: number;                     // Button width (25, 50, 75, 100)
}
```

### CSS Classes

The block uses the following CSS classes:
- `.wp-block-jankx-image-button` - Main block wrapper
- `.wp-block-jankx-image-button__link` - Button/link element
- `.wp-block-jankx-image-button__width-{25|50|75|100}` - Width classes
- `.is-style-fill` - Fill style variation
- `.is-style-outline` - Outline style variation

## Technical Details

### Dependencies
- **WordPress Core**: Uses WordPress block editor APIs
- **React**: Built with React and TypeScript
- **SCSS**: Styling with SCSS preprocessing
- **Webpack**: Bundled with webpack for development

### Build Process
The block is built using the project's webpack configuration:
- TypeScript compilation
- SCSS compilation
- Asset optimization
- Development and production builds

### Integration
- Registered in `GutenbergService.php`
- PHP class: `ImageButtonBlock`
- Automatic discovery and registration
- CSS enqueuing handled by the framework

## Browser Support
- Modern browsers with ES6+ support
- WordPress 6.0+ compatibility
- Responsive design for mobile devices

## Performance
- Optimized bundle size
- Lazy loading support
- Efficient re-rendering
- Minimal DOM manipulation

## Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus management

## Development

### Local Development
1. Make changes to TypeScript/SCSS files
2. Run `npm run development` for development build
3. Run `npm run production` for production build
4. Test in WordPress admin

### Adding Features
1. Update `block.json` for new attributes
2. Modify `edit.tsx` for new UI controls
3. Update `save.tsx` for new rendering logic
4. Add styles to SCSS files
5. Test thoroughly across different scenarios

## License
This block is part of the Jankx theme and follows the same licensing terms.
