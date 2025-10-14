# Gallery Builder Block

Professional gallery viewer with slideshow, navigation controls, and rich content editing capabilities.

## Features

### 🖼️ **Professional Gallery Viewer**
- Responsive design that works on all devices
- Multiple transition effects (slide, fade, zoom)
- Customizable aspect ratios (16:9, 4:3, 1:1, 3:2, free)
- High-quality image display with lazy loading

### 🎮 **Interactive Controls**
- Navigation arrows (left/right)
- Thumbnail navigation (top/bottom positioning)
- Pagination dots with numbers
- Touch/swipe support for mobile devices
- Keyboard navigation (arrow keys, space, escape)

### ⚡ **Autoplay Features**
- Configurable autoplay with custom delay
- Play/pause toggle button
- Auto-pause on hover and when tab is not visible
- Smooth transitions between slides

### ✏️ **Rich Content Editing**
- Click-to-edit captions with rich text support
- Support for bold, italic, and links in captions
- Visual editor in the block editor
- Real-time preview of changes

### 🎨 **Customization Options**
- Show/hide thumbnails, navigation, pagination, captions
- Multiple thumbnail positions (top, bottom, left, right)
- Customizable transition effects and duration
- Responsive breakpoints for different screen sizes

## Usage

### Adding the Block

1. In the WordPress editor, click the "+" button to add a new block
2. Search for "Gallery Builder" or find it in the Media category
3. Click to add the block to your page

### Adding Images

1. Click "Add Gallery Images" to open the media library
2. Select multiple images (hold Ctrl/Cmd to select multiple)
3. Click "Select" to add them to the gallery

### Editing Captions

1. Click on any image in the gallery
2. Click the "Edit Caption" button (pencil icon)
3. Type your caption with rich text formatting
4. Click outside to save

### Customizing Settings

Use the block settings panel (right sidebar) to customize:

- **Gallery Settings**: Autoplay, transition effects, duration
- **Display Options**: Show/hide elements, thumbnail position
- **Image Settings**: Image size, aspect ratio

## Block Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `galleryId` | string | auto-generated | Unique identifier for the gallery |
| `items` | array | [] | Array of gallery items with images and captions |
| `autoplay` | boolean | false | Enable automatic slideshow |
| `autoplayDelay` | number | 5000 | Delay between slides in milliseconds |
| `showThumbnails` | boolean | true | Show thumbnail navigation |
| `showNavigation` | boolean | true | Show arrow navigation |
| `showPagination` | boolean | true | Show pagination dots |
| `showCaptions` | boolean | true | Show image captions |
| `thumbnailPosition` | string | 'top' | Position of thumbnails (top/bottom/left/right) |
| `imageSize` | string | 'large' | WordPress image size to use |
| `aspectRatio` | string | '16:9' | Aspect ratio for images |
| `transitionEffect` | string | 'slide' | Transition effect (slide/fade/zoom) |
| `transitionDuration` | number | 500 | Transition duration in milliseconds |

## Keyboard Shortcuts

- **Left Arrow**: Previous slide
- **Right Arrow**: Next slide
- **Space**: Toggle autoplay
- **Escape**: Pause autoplay

## Touch/Swipe Support

- **Swipe Left**: Next slide
- **Swipe Right**: Previous slide

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Building the Block

```bash
# Install dependencies
npm install

# Development build with watch
npm run dev

# Production build
npm run build
```

### File Structure

```
gallery-builder/
├── block.json          # Block configuration
├── index.tsx           # Block registration
├── edit.tsx            # Editor component
├── save.tsx            # Frontend component
├── view.js             # Frontend JavaScript
├── editor.scss         # Editor styles
├── style.scss          # Frontend styles
├── webpack.config.js   # Build configuration
├── package.json        # Dependencies
└── README.md           # Documentation
```

## Styling

The block includes comprehensive CSS classes for customization:

- `.wp-block-jankx-gallery-builder` - Main container
- `.gallery-builder-container` - Gallery wrapper
- `.gallery-main` - Main gallery area
- `.gallery-slides` - Slides container
- `.gallery-slide` - Individual slide
- `.gallery-thumbnails` - Thumbnail navigation
- `.gallery-pagination` - Pagination dots
- `.gallery-nav` - Navigation arrows

## Accessibility

- Full keyboard navigation support
- ARIA labels for screen readers
- Focus management
- High contrast support
- Semantic HTML structure

## Performance

- Lazy loading for images
- Optimized CSS and JavaScript
- Minimal DOM manipulation
- Efficient event handling
- Automatic cleanup on destroy

## License

GPL-2.0-or-later
