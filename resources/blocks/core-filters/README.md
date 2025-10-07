# Core Filters - WordPress Block Extensions

Hệ thống filter cho WordPress core blocks để thêm khả năng chèn icons từ Jankx blocks.

## Tính năng

- ✅ Extend `core/button` block với icon support
- ✅ Extend `core/read-more` block với icon support
- ✅ Material Icons integration
- ✅ Image Icons support
- ✅ SVG Icons support
- ✅ Icon position control (before/after)
- ✅ Full customization (size, color, style)

## Cấu trúc thư mục

```
core-filters/
├── index.tsx                      # Main entry point
├── filters/
│   ├── button-filter.tsx         # Filter cho core/button
│   └── read-more-filter.tsx      # Filter cho core/read-more
├── components/
│   ├── IconControls.tsx          # Main icon controls UI
│   ├── MaterialIconPicker.tsx    # Material icon picker
│   └── SvgIconInput.tsx          # SVG input component
├── editor.scss                    # Editor styles
├── build/                         # Compiled files (auto-generated)
│   ├── index.js
│   ├── index.asset.php
│   └── editor.css
└── README.md
```

## Build

### Prerequisites

```bash
cd wp-content/themes/jankx/resources
npm install
```

### Development

```bash
npm run build
# hoặc
npx webpack --watch
```

### Production

```bash
npx webpack --mode=production
```

## Sử dụng

### 1. Build JavaScript

Chạy webpack để compile TypeScript files:

```bash
cd wp-content/themes/jankx/resources
npx webpack
```

### 2. Trong Gutenberg Editor

1. Tạo hoặc edit một `core/button` hoặc `core/read-more` block
2. Mở Block Inspector (sidebar bên phải)
3. Tìm panel "Icon Settings"
4. Bật "Enable Icon"
5. Chọn loại icon (Material Icon, Image Icon, hoặc SVG Icon)
6. Cấu hình icon theo ý muốn

### 3. Material Icons

```
1. Enable Icon: ON
2. Icon Type: Material Icon
3. Icon Name: arrow_forward (hoặc click "choose from popular icons")
4. Icon Style: Filled / Outlined / Rounded / Sharp / Two Tone
5. Icon Size: 18px
6. Icon Color: #ffffff
7. Icon Position: Before Text / After Text
```

### 4. Image Icons

```
1. Enable Icon: ON
2. Icon Type: Image Icon
3. Click "Select Image" để chọn ảnh từ Media Library
4. Image Height: 20px
5. Image Margin Right: 5px
6. Icon Position: Before Text / After Text
```

### 5. SVG Icons

```
1. Enable Icon: ON
2. Icon Type: SVG Icon
3. Paste SVG code vào textarea
4. Icon Width: 20px
5. Icon Color: #000000
6. Icon Position: Before Text / After Text
```

## Technical Details

### WordPress Hooks

Filter này sử dụng các WordPress hooks:

- `blocks.registerBlockType` - Thêm attributes vào blocks
- `editor.BlockEdit` - Thêm UI controls
- `editor.BlockListBlock` - Thêm preview trong editor

### Supported Icon Types

1. **Material Icons** (`jankx/icon-button`)
   - Google Material Icons
   - Multiple styles: Filled, Outlined, Rounded, Sharp, Two Tone
   - Customizable size và color

2. **Image Icons** (`jankx/image-button`)
   - Upload từ Media Library
   - Customizable height và margin
   - Alt text support

3. **SVG Icons** (`jankx/svg-icon`)
   - Paste SVG code trực tiếp
   - Customizable size và color
   - Preview trong editor

### Attributes Added

Các attributes được thêm vào core blocks:

```typescript
{
  hasIcon: boolean,
  iconType: 'jankx/icon-button' | 'jankx/image-button' | 'jankx/svg-icon',
  iconPosition: 'before' | 'after',

  // Material Icon
  iconName: string,
  iconStyle: 'filled' | 'outlined' | 'rounded' | 'sharp' | 'two-tone',
  iconSize: string,
  iconColor: string,

  // Image Icon
  imageUrl: string,
  imageAlt: string,
  imageSize: string,
  imageMarginRight: string,

  // SVG Icon
  icon: string,
  width: string,
}
```

## Frontend Rendering

Frontend rendering được xử lý bởi PHP filter trong `WordPressCoreFilterBlock.php`:

- Filter `render_block_core_button` cho button blocks
- Filter `render_block_core_read_more` cho read-more blocks

## Customization

### Thêm Icon Types

Edit `components/IconControls.tsx`:

```typescript
<SelectControl
  options={[
    // ... existing options
    { label: __('My Custom Icon', 'jankx'), value: 'custom/my-icon' },
  ]}
/>
```

### Custom Styling

Edit `editor.scss` để thêm custom styles cho editor.

### PHP Filters

Sử dụng WordPress filters để customize:

```php
// Custom icon rendering
add_filter('jankx/gutenberg/core-filter/icon-html', function($iconHtml, $iconType, $attrs) {
    // Your custom logic
    return $iconHtml;
}, 10, 3);

// Custom supported blocks
add_filter('jankx/gutenberg/core-filter/supported-blocks', function($blocks) {
    $blocks['custom/my-icon'] = [
        'path' => '/path/to/block',
        'priority' => 10,
    ];
    return $blocks;
});
```

## Troubleshooting

### Icons không hiển thị trong editor

1. Check console cho JavaScript errors
2. Đảm bảo đã build webpack
3. Verify file `build/index.js` tồn tại
4. Clear browser cache

### Material Icons không load

Đảm bảo Google Fonts được load. Check `editor.scss`:

```scss
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
```

### Build errors

```bash
# Clear node_modules và reinstall
rm -rf node_modules
npm install

# Clear webpack cache
rm -rf resources/blocks/core-filters/build
npx webpack
```

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- IE11: ❌ (Not supported)

## Dependencies

- `@wordpress/blocks`
- `@wordpress/element`
- `@wordpress/i18n`
- `@wordpress/block-editor`
- `@wordpress/components`
- `@wordpress/compose`
- `@wordpress/hooks`

## License

GPL v2 or later

## Author

Puleeno Nguyen - Jankx Framework

