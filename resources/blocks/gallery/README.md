# Image Masonry Gallery Block

A responsive masonry gallery block for the Jankx theme that displays images in a Pinterest-style layout with lightbox support.

## Features

- **Responsive Design**: Different column counts for desktop, tablet, and mobile
- **Lightbox Support**: Click images to view in a lightbox gallery
- **Hover Effects**: Multiple hover effects including zoom and grayscale
- **Customizable Gaps**: Adjustable spacing between images for each device
- **Media Library Integration**: Easy image selection from WordPress media library

## Usage

1. Add the "Image Masonry Gallery" block to your page or post
2. Click "Add Gallery Images" to select images from your media library
3. Configure the gallery settings in the block sidebar:
   - **Number of Columns**: Set different column counts for desktop, tablet, and mobile
   - **Items Gutter**: Adjust spacing between images
   - **Gallery Image Settings**: Enable/disable lightbox and choose hover effects

## Block Attributes

- `galleryId`: Unique identifier for the gallery
- `images`: Array of image objects with id, url, and alt text
- `colDevice`: Current device for column settings
- `deskCol`: Number of columns on desktop (1-5)
- `tabCol`: Number of columns on tablet (1-5)
- `phoneCol`: Number of columns on mobile (1-5)
- `gapDevice`: Current device for gap settings
- `deskGap`: Gap between images on desktop (0-100px)
- `tabGap`: Gap between images on tablet (0-100px)
- `phoneGap`: Gap between images on mobile (0-100px)
- `enableLightbox`: Whether to enable lightbox functionality
- `imageHoverEffect`: Hover effect type (none, zoom__in, zoom__out, gray__scale)

## Dependencies

- jQuery
- Magnific Popup library
- Custom lightbox script

## Styling

The block uses CSS classes for styling:
- `.wp-block-jankx-image-masonry-gallery`: Main container
- `.single-gallery-image`: Individual image container
- Responsive classes: `dc__{desktopCol}`, `tc__{tabletCol}`, `pc__{phoneCol}`
- Gap classes: `dg__{desktopGap}`, `tg__{tabletGap}`, `pg__{phoneGap}`
- Hover effect classes: `zoom__in`, `zoom__out`, `gray__scale`

## Development

To build the block:

```bash
npm run build
```

To watch for changes during development:

```bash
npm run start
```
