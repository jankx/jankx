# Post Layout Tests

## Overview

Tests được tạo để đảm bảo output HTML từ JavaScript renderer khớp với PHP renderer, và đảm bảo các layout classes định nghĩa structure đúng.

## Test Structure

### JavaScript Tests

**Location:** `resources/blocks/post-type-layout/__tests__/`

- `layout-renderer.test.ts` - Unit tests cho layout-renderer functions
- `layout-renderer.integration.test.ts` - Integration tests để đảm bảo JS output khớp với PHP

**Run tests:**
```bash
cd resources
npm run test:js
npm run test:js:watch
npm run test:js:coverage
```

### PHP Tests

**Location:** `tests/Support/Blocks/PostLayout/` và `tests/Integration/PostLayout/`

- `PostLayoutStructureTest.php` - Unit tests cho `getHtmlStructure()` methods
- `PostLayoutRenderIntegrationTest.php` - Integration tests để đảm bảo structure có thể được localize và sử dụng

**Run tests:**
```bash
vendor/bin/phpunit tests/Support/Blocks/PostLayout/
vendor/bin/phpunit tests/Integration/PostLayout/
```

## Test Coverage

### JavaScript Tests

1. **renderPostItem()**
   - Render với tất cả elements
   - Hide elements khi options là false
   - Wrap date và author trong post-meta
   - Handle thumbnail position correctly

2. **renderLayout()**
   - Render layout với posts
   - Render empty state khi không có posts
   - Replace post-id placeholder
   - Handle layouts không có itemWrapper

3. **getLayoutStructure() / getPostItemStructure()**
   - Return structure từ window object
   - Return null khi không tìm thấy

4. **Integration Tests**
   - Match PHP renderPostItem structure
   - Match PHP GridLayout structure
   - Match PHP ListLayout structure
   - Match empty state

### PHP Tests

1. **getHtmlStructure() Methods**
   - Container structure với đúng tag, classes, styles
   - Item wrapper structure với đúng attributes
   - Empty state structure
   - Pagination wrapper structure

2. **Structure Validation**
   - Structure matches PHP render output
   - Structure có thể encode/decode JSON
   - Tất cả layouts có structure
   - Structure consistent across multiple calls

3. **Integration Tests**
   - Structure có thể được localized
   - PostTypeLayoutBlock localizes structures correctly
   - Post item structure matches PHP renderPostItem
   - Different layouts have different structures

## Running All Tests

```bash
# PHP tests
vendor/bin/phpunit

# JavaScript tests
cd resources
npm run test:js

# Both
vendor/bin/phpunit && cd resources && npm run test:js
```

## Adding New Tests

Khi thêm layout mới:

1. **PHP:** Override `getHtmlStructure()` hoặc các protected methods
2. **Test PHP:** Thêm test case vào `PostLayoutStructureTest.php`
3. **Test JS:** Structure sẽ tự động được test qua integration tests
4. **Verify:** Chạy cả PHP và JS tests để đảm bảo output khớp

## Test Helpers

### PHP: `HtmlAssertions` trait

- `assertHtmlHasClass()` - Check CSS class
- `assertHtmlHasTag()` - Check HTML tag
- `assertHtmlHasAttribute()` - Check HTML attribute
- `assertHtmlStructure()` - Check full structure
- `assertHtmlEquivalent()` - Compare HTML ignoring whitespace

### JavaScript: Standard Jest assertions

Sử dụng Jest matchers:
- `toContain()` - Check string contains
- `toEqual()` - Deep equality
- `toBeNull()` - Null check
