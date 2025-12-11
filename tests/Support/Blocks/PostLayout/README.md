# Post Layout Tests

## Chạy Tests

### PHP Tests

```bash
# Chạy tất cả PostLayout tests
vendor/bin/phpunit tests/Support/Blocks/PostLayout/

# Chạy integration tests
vendor/bin/phpunit tests/Integration/PostLayout/

# Chạy với coverage
vendor/bin/phpunit tests/Support/Blocks/PostLayout/ --coverage-html coverage/html
```

### JavaScript Tests

```bash
cd resources
npm run test:js
npm run test:js:watch
npm run test:js:coverage
```

## Test Coverage

### PHP Tests
- ✅ PostLayoutStructureTest: 12 tests, 71 assertions
  - Tests for getHtmlStructure method
  - Tests for container and item wrapper structures
  - Tests for dynamic columns update
  - Tests for CSS variables format (no units)
- ✅ PostLayoutRenderIntegrationTest: 8 tests, 54 assertions
  - Tests for structure localization
  - Tests for PHP render matching
- ✅ PostLayoutPhpJsComparisonTest: 9 tests, 86 assertions
  - Tests for PHP-JS structure compatibility
- ✅ PostLayoutColumnsUpdateTest: 6 tests, 56 assertions
  - Tests for dynamic columns update in container structure
  - Tests for CSS variables format (strings without units)
  - Tests for class preservation when columns change
  - Tests for JSON serializability with different columns
- ✅ PostLayoutSaveFunctionTest: 5 tests, 14 assertions
  - Tests for render_callback registration
  - Tests for InnerBlocks extraction from parsed_block
  - Tests for structure localization

**Total PHP Tests: 40 tests, 281 assertions**

**Breakdown:**
- PostLayoutStructureTest: 12 tests, 71 assertions
- PostLayoutRenderIntegrationTest: 8 tests, 54 assertions
- PostLayoutPhpJsComparisonTest: 9 tests, 86 assertions
- PostLayoutColumnsUpdateTest: 6 tests, 56 assertions
- PostLayoutSaveFunctionTest: 5 tests, 14 assertions

### JavaScript Tests
- ✅ layout-renderer.test.ts: Unit tests cho layout-renderer functions
- ✅ layout-renderer.integration.test.ts: Integration tests để đảm bảo JS output khớp với PHP
- ✅ layout-renderer.columns.test.ts: Tests cho dynamic columns update

## Test Results

Tất cả PHP tests đã pass thành công! ✅

## Test Cases Covered

### Dynamic Columns Update
- ✅ Container structure updates with different columns values
- ✅ CSS variables are strings without units (no 'px')
- ✅ Other container classes are preserved when columns change
- ✅ Different column values produce different structures
- ✅ Structure is JSON serializable with different columns

### Save Function
- ✅ Save function returns null for dynamic blocks with render_callback
- ✅ InnerBlocks are accessible via $block->parsed_block in PHP
- ✅ Attributes are saved automatically via block.json

### Preview Generation
- ✅ Preview updates when columns change
- ✅ Preview uses updated structure with new columns
- ✅ Preview preserves other container classes
