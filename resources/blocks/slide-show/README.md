# Slideshow Block

Advanced slideshow block with thumbnails, captions, and PhotoSwipe integration for WordPress Gutenberg.

## Features

### 🎯 **Core Features**
- **Image Gallery Selection**: Select multiple images from WordPress media library
- **Slideshow Item Blocks**: Each image creates a locked `slideshow-item` block
- **Rich Text Captions**: Editable captions for each image with rich text formatting
- **WYSIWYG Editor**: Editor and frontend display identical interface

### 🎨 **Visual Components**
- **Thumbnails**: Clickable thumbnail navigation at the top (for slide selection)
- **Main Slideshow**: Large image display with smooth transitions
- **Navigation Arrows**: Previous/Next buttons for navigation
- **Pagination**: Numbered pagination dots for direct slide access
- **Footer Controls**: Autoplay and fullscreen buttons

### ⚙️ **Settings & Options**
- **Autoplay**: Enable automatic slideshow progression
- **Autoplay Delay**: Customizable timing (1-10 seconds)
- **Fullscreen Mode**: PhotoSwipe integration for fullscreen viewing
- **Show/Hide Components**: Toggle thumbnails, navigation, pagination
- **Transition Effects**: Slide or fade transitions
- **Transition Speed**: Customizable animation duration
- **Thumbnail Size**: Small, medium, or large thumbnails
- **Main Image Height**: Adjustable slideshow height
- **Caption Position**: Top, bottom, overlay, or hidden captions

### 🎮 **User Interactions**
- **Click Navigation**: Click thumbnails (for slide selection), pagination dots, or arrows
- **Keyboard Support**: Arrow keys for navigation, Escape to stop autoplay
- **Touch/Swipe**: Mobile-friendly swipe gestures
- **Enhanced Lightbox**: Click images for fullscreen gallery with autoplay (starts automatically)
- **Autoplay Control**: Toggle autoplay on/off

## Block Structure

### Main Slideshow Block (`jankx/slide-show`)
- Container for the entire slideshow
- Manages settings and configuration
- Creates and manages slideshow-item blocks
- Handles navigation and controls

### Slideshow Item Block (`jankx/slide-show-item`)
- Individual slide content (locked block)
- Contains image and caption
- Automatically created when selecting images
- Editable image and caption content

## Usage

### 1. Adding the Block
1. In Gutenberg editor, click "+" to add a block
2. Search for "Slideshow" or find it in the Jankx category
3. Click to add the slideshow block

### 2. Selecting Images
1. Click "Select Images" button
2. Choose multiple images from the media library
3. Images will automatically create slideshow-item blocks

### 3. Customizing Settings
1. Open the block settings panel (sidebar)
2. Configure autoplay, navigation, transitions
3. Adjust thumbnail size and main image height
4. Toggle visibility of components

### 4. Editing Content
1. Click on any image to change it
2. Edit captions using the rich text editor
3. Remove images using the remove button
4. Rearrange slides by dragging slideshow-item blocks

## Technical Implementation

### Frontend Features
- **Enhanced Lightbox**: Professional gallery viewer with autoplay functionality (inspired by PhotoSwipe slideshow plugin)
- **Responsive Design**: Mobile-first approach
- **Performance Optimized**: Lazy loading and efficient rendering
- **Accessibility**: Keyboard navigation and ARIA labels

### Editor Features
- **WYSIWYG Experience**: Identical editor and frontend display
- **Real-time Preview**: See changes immediately
- **Block Management**: Easy image selection and management
- **Rich Text Editing**: Full formatting support for captions

## CSS Customization

The block uses CSS custom properties for easy theming:

```css
.slideshow-block {
  --slideshow-height: 400px;
  --slideshow-transition-speed: 300ms;
  --slideshow-thumbnail-size: 60px;
  --slideshow-border-radius: 8px;
}
```

## Browser Support

- Modern browsers with ES6 support
- PhotoSwipe compatibility
- Touch device support
- Responsive breakpoints

## Dependencies

- **Enhanced Lightbox**: Self-contained lightbox implementation with autoplay (inspired by [PhotoSwipe Slideshow plugin](https://github.com/junkfix/photoswipe-slideshow))
- **WordPress Core**: Uses WordPress media library and block system
- **Jankx Framework**: Integrates with Jankx theme system

## File Structure

```
blocks/slide-show/
├── block.json          # Block metadata and attributes
├── index.tsx           # Block registration
├── edit.tsx            # Editor component (WYSIWYG)
├── view.js             # Frontend JavaScript
├── style.scss          # Frontend styles
├── editor.scss         # Editor-specific styles
├── types.ts            # TypeScript interfaces
└── README.md           # This file

blocks/slide-show-item/
├── block.json          # Item block metadata
├── index.tsx           # Item block registration
├── edit.tsx            # Item editor component
├── style.scss          # Item styles
├── editor.scss         # Item editor styles
└── types.ts            # Item TypeScript interfaces
```

## Development

### Building
```bash
npm run build:webpack
```

### Development Mode
```bash
npm run dev:webpack
```

### TypeScript
- Strict mode enabled
- Full type safety
- Interface definitions for all props

### SCSS
- Modern CSS features
- CSS custom properties
- Responsive design
- Component-based architecture
