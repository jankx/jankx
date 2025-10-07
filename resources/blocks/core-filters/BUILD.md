# Build Instructions - Core Filters

## Quick Start

### 1. Cài đặt dependencies (chỉ cần làm 1 lần)

```bash
cd C:/Users/puleeno/Projects/buocchandisan.vn/wp-content/themes/jankx/resources
npm install
```

### 2. Build core-filters

```bash
# Từ thư mục resources/
npx webpack

# Hoặc watch mode để auto-rebuild khi có thay đổi
npx webpack --watch
```

### 3. Verify build

Kiểm tra các files sau đã được tạo:

```
resources/blocks/core-filters/build/
├── index.js            ✓
├── index.asset.php     ✓
├── index.js.map        ✓
├── editor.css          ✓
└── editor.css.map      ✓
```

### 4. Test trong WordPress

1. Login vào WordPress Admin
2. Tạo/Edit một post hoặc page
3. Thêm một `Button` block
4. Mở Block Inspector (sidebar bên phải)
5. Scroll xuống tìm panel "Icon Settings"
6. Bật "Enable Icon" và test các tính năng

## Build Commands

### Development Build

```bash
npx webpack --mode=development
```

### Production Build

```bash
npx webpack --mode=production
```

### Watch Mode

```bash
npx webpack --watch
```

### Build specific entry

```bash
npx webpack --entry ./blocks/core-filters/index.tsx
```

## Troubleshooting

### Error: Cannot find module

```bash
cd resources/
rm -rf node_modules package-lock.json
npm install
```

### Build thành công nhưng không thấy trong editor

1. Clear browser cache (Ctrl+Shift+R)
2. Check WordPress admin -> Settings -> Permalinks -> Save (flush rewrite rules)
3. Deactivate/Reactivate theme
4. Check browser console cho JavaScript errors

### TypeScript errors

```bash
# Check TypeScript config
cat resources/tsconfig.json

# Verify all imports
grep -r "import.*from" resources/blocks/core-filters/
```

### SCSS compilation errors

```bash
# Install SCSS dependencies
npm install sass-loader sass --save-dev

# Rebuild
npx webpack
```

## File Watching

Để development hiệu quả, sử dụng watch mode:

```bash
# Terminal 1: Watch webpack
cd resources/
npx webpack --watch

# Terminal 2: Local WordPress server (nếu dùng)
# wp server --host=localhost --port=8080
```

## Production Deployment

Trước khi deploy lên production:

```bash
# 1. Clean build
rm -rf resources/blocks/core-filters/build

# 2. Production build
npx webpack --mode=production

# 3. Verify minification
ls -lh resources/blocks/core-filters/build/index.js

# 4. Test trên staging environment

# 5. Commit changes
git add resources/blocks/core-filters/
git commit -m "Build core-filters for production"
```

## Debugging

### Enable source maps

Source maps đã được enable mặc định trong `webpack.config.js`:

```javascript
devtool: 'source-map'
```

### Browser DevTools

1. Open Chrome DevTools
2. Go to Sources tab
3. Look for `webpack://` → `blocks/core-filters/`
4. Set breakpoints trong TypeScript source files

### Console logging

Thêm debug logs trong code:

```typescript
console.log('Icon attributes:', attributes);
```

## Common Issues

### Issue: "Module not found: Error: Can't resolve './components/IconControls'"

**Solution:** Check file path và tên file, đảm bảo case-sensitive đúng.

### Issue: Material Icons không hiển thị

**Solution:**
1. Check `editor.scss` có import Google Fonts
2. Verify CSS đã được compiled
3. Check browser Network tab xem font có load được không

### Issue: Changes không apply sau build

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear WordPress cache nếu dùng caching plugin
3. Check file timestamps: `ls -la resources/blocks/core-filters/build/`

## Performance Tips

1. **Use watch mode** khi development để auto-rebuild
2. **Production build** trước khi deploy để minify code
3. **Source maps** chỉ enable trong development
4. **Cache busting** - WordPress tự động handle qua version numbers

## Next Steps

Sau khi build thành công:

1. ✅ Test tất cả icon types (Material, Image, SVG)
2. ✅ Test trên các browsers khác nhau
3. ✅ Test responsive design
4. ✅ Kiểm tra performance với DevTools
5. ✅ Deploy lên staging environment
6. ✅ User acceptance testing
7. ✅ Deploy lên production

## Support

Nếu gặp vấn đề:

1. Check log files: `wp-content/debug.log`
2. Browser console errors
3. Network tab trong DevTools
4. Check GitHub issues: [jankx repository]

