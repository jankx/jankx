# Gutenberg Blocks Tests

## Tổng quan

Tests cho Gutenberg blocks được implement trong theme directory này.

## Location

```
public/wp-content/themes/cheephub/tests/Gutenberg/
```

## Cấu trúc

```
tests/Gutenberg/
├── BlockIntegrationTestCase.php (Base class cho integration tests)
└── Blocks/
    ├── BlockTestCase.php (Base class cho unit tests)
    ├── LanguageSwitcherBlockTest.php
    ├── AdvancedButtonBlockTest.php
    ├── AdvancedFiltersBlockTest.php
    ├── AuthorBoxBlockTest.php
    ├── AdvancedImageBoxBlockTest.php
    ├── LanguageSwitcherBlockIntegrationTest.php
    ├── BlockTestGenerator.php
    └── README.md
```

## Namespace

### Unit Tests
- **Base class**: `Tests\Gutenberg\Blocks\BlockTestCase`
- **Test classes**: `Tests\Gutenberg\Blocks\*BlockTest`

### Integration Tests
- **Base class**: `Tests\Gutenberg\BlockIntegrationTestCase`
- **Test classes**: `Tests\Gutenberg\Blocks\*BlockIntegrationTest`

Base classes extend từ: `Tests\Helpers\TestCase`

## Chạy Tests

```bash
# Từ theme directory
cd public/wp-content/themes/cheephub

# Tất cả Gutenberg tests
vendor/bin/phpunit tests/Gutenberg

# Chỉ block unit tests
vendor/bin/phpunit tests/Gutenberg/Blocks

# Một test cụ thể
vendor/bin/phpunit tests/Gutenberg/Blocks/LanguageSwitcherBlockTest.php

# Integration tests
vendor/bin/phpunit tests/Gutenberg/Blocks/LanguageSwitcherBlockIntegrationTest.php
```

## phpunit.xml

File `phpunit.xml` trong theme đã được cập nhật để include:

```xml
<testsuite name="Gutenberg">
    <directory>tests/Gutenberg</directory>
</testsuite>

<testsuite name="GutenbergBlocks">
    <directory>tests/Gutenberg/Blocks</directory>
</testsuite>
```

## Xem thêm

- `tests/Gutenberg/Blocks/README.md` - Chi tiết về block tests
- `docs/BLOCK_TESTS_THEME.md` - Hướng dẫn đầy đủ
- `tests/Gutenberg/MOVED_FROM_ROOT.md` - Info về việc di chuyển từ root
