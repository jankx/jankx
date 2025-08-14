# Swiper Slider Block

Advanced Swiper slider block for Jankx WordPress theme with full customization options.

## Features

- **Multiple Slider Types**: Slider, Carousel, Banner
- **Preset Configurations**: Default, Carousel, Banner
- **Rich Effects**: Slide, Fade, Cube, Coverflow, Flip, Cards, Creative
- **Full Customization**: All Swiper options available
- **Responsive Design**: Mobile-first approach with breakpoints
- **Drag & Drop**: Easy slide composition in editor
- **Real-time Preview**: See changes instantly in editor

## Installation

1. Navigate to the block directory:
```bash
cd resources/blocks/swiper-slider
```

2. Install dependencies:
```bash
npm install
```

3. Build the block:
```bash
npm run build
```

## Development

- **Start development mode**: `npm start`
- **Build for production**: `npm run build`
- **Format code**: `npm run format`
- **Lint CSS**: `npm run lint:css`
- **Lint JavaScript**: `npm run lint:js`

## Usage

### In Gutenberg Editor

1. Add the "Swiper Slider" block to your page/post
2. Choose slider type: Slider, Carousel, or Banner
3. Select a preset or customize manually
4. Add slides using the block inserter
5. Configure advanced options in the sidebar

### Block Attributes

- **sliderType**: Type of slider (slider, carousel, banner)
- **preset**: Preset configuration to apply
- **slidesPerView**: Number of slides visible at once
- **spaceBetween**: Space between slides in pixels
- **effect**: Transition effect (slide, fade, cube, etc.)
- **direction**: Slide direction (horizontal, vertical)
- **loop**: Enable infinite loop
- **autoplay**: Enable autoplay
- **navigation**: Show navigation arrows
- **pagination**: Show pagination dots
- **scrollbar**: Show scrollbar
- **centeredSlides**: Center active slide
- **grabCursor**: Show grab cursor on hover
- **speed**: Transition speed in milliseconds

### Presets

#### Default Slider
- Single slide view
- Navigation arrows
- Pagination dots
- No autoplay

#### Carousel
- Multiple slides view (3)
- Navigation arrows
- Pagination dots
- Autoplay enabled
- Centered slides
- Loop enabled

#### Banner
- Single slide view
- Fade effect
- Pagination dots
- Autoplay enabled
- Loop enabled
- No navigation

## Customization

### Adding New Presets

Edit the `PRESETS` object in `index.js`:

```javascript
const PRESETS = {
    custom: {
        name: 'Custom Preset',
        config: {
            slidesPerView: 2,
            spaceBetween: 40,
            effect: 'coverflow',
            navigation: true,
            pagination: true,
            autoplay: true,
            loop: true
        }
    }
};
```

### Custom Effects

Add new effects in the `jankx_build_swiper_config` function in `render.php`:

```php
case 'custom':
    $config['customEffect'] = [
        'parameter1' => 'value1',
        'parameter2' => 'value2',
    ];
    break;
```

## File Structure

```
swiper-slider/
├── build/                   # Built files (generated)
├── index.js                 # Main block JavaScript
├── index.css                # Editor styles
├── style.css                # Frontend styles
├── render.php               # PHP render logic
├── block.json               # Block configuration
├── package.json             # NPM configuration
└── README.md               # This file
```

## Dependencies

- **Swiper**: Modern mobile touch slider
- **WordPress Scripts**: Build tools for WordPress blocks
- **React**: JavaScript library for building user interfaces

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

GPL-2.0-or-later

## Support

For support and questions, please refer to the Jankx theme documentation or create an issue in the theme repository.
