# Tests Đã Di Chuyển từ Root Project

## Tổng quan

Tất cả test files đã được di chuyển từ root project vào theme directory.

## Cấu trúc Cũ (Root)

```
C:/Users/puleeno/Projects/CheepHub/tests/
├── Unit/Gutenberg/
│   ├── BlockTestCase.php
│   └── Blocks/
│       ├── AdvancedButtonBlockTest.php
│       ├── AdvancedFiltersBlockTest.php
│       ├── AdvancedImageBoxBlockTest.php
│       ├── AuthorBoxBlockTest.php
│       ├── LanguageSwitcherBlockTest.php
│       └── BlockTestGenerator.php
├── Integration/Gutenberg/
│   └── BlockIntegrationTestCase.php
└── Feature/Gutenberg/
    └── Blocks/
        └── LanguageSwitcherBlockIntegrationTest.php
```

## Cấu trúc Mới (Theme)

```
public/wp-content/themes/cheephub/tests/
└── Gutenberg/
    ├── BlockIntegrationTestCase.php
    └── Blocks/
        ├── BlockTestCase.php
        ├── AdvancedButtonBlockTest.php
        ├── AdvancedFiltersBlockTest.php
        ├── AdvancedImageBoxBlockTest.php
        ├── AuthorBoxBlockTest.php
        ├── LanguageSwitcherBlockTest.php
        ├── LanguageSwitcherBlockIntegrationTest.php
        ├── BlockTestGenerator.php
        └── README.md
```

## Thay đổi Namespace

### Unit Tests
- **Cũ**: `Tests\Unit\Gutenberg\Blocks`
- **Mới**: `Tests\Gutenberg\Blocks`

### Integration Tests
- **Cũ**: `Tests\Integration\Gutenberg`
- **Mới**: `Tests\Gutenberg`

### Base Classes
- **BlockTestCase**: `Tests\Gutenberg\Blocks\BlockTestCase` (extends `Tests\Helpers\TestCase`)
- **BlockIntegrationTestCase**: `Tests\Gutenberg\BlockIntegrationTestCase` (extends `Tests\Helpers\TestCase`)

## Files Đã Di Chuyển

1. ✅ `tests/Unit/Gutenberg/BlockTestCase.php` → `tests/Gutenberg/Blocks/BlockTestCase.php`
2. ✅ `tests/Unit/Gutenberg/Blocks/LanguageSwitcherBlockTest.php` → `tests/Gutenberg/Blocks/LanguageSwitcherBlockTest.php`
3. ✅ `tests/Unit/Gutenberg/Blocks/AdvancedButtonBlockTest.php` → `tests/Gutenberg/Blocks/AdvancedButtonBlockTest.php`
4. ✅ `tests/Unit/Gutenberg/Blocks/AdvancedFiltersBlockTest.php` → `tests/Gutenberg/Blocks/AdvancedFiltersBlockTest.php`
5. ✅ `tests/Unit/Gutenberg/Blocks/AdvancedImageBoxBlockTest.php` → `tests/Gutenberg/Blocks/AdvancedImageBoxBlockTest.php`
6. ✅ `tests/Unit/Gutenberg/Blocks/AuthorBoxBlockTest.php` → `tests/Gutenberg/Blocks/AuthorBoxBlockTest.php`
7. ✅ `tests/Unit/Gutenberg/Blocks/BlockTestGenerator.php` → `tests/Gutenberg/Blocks/BlockTestGenerator.php`
8. ✅ `tests/Integration/Gutenberg/BlockIntegrationTestCase.php` → `tests/Gutenberg/BlockIntegrationTestCase.php`
9. ✅ `tests/Feature/Gutenberg/Blocks/LanguageSwitcherBlockIntegrationTest.php` → `tests/Gutenberg/Blocks/LanguageSwitcherBlockIntegrationTest.php`

## Chạy Tests

```bash
# Từ theme directory
cd public/wp-content/themes/cheephub

# Tất cả block tests
vendor/bin/phpunit tests/Gutenberg/Blocks

# Integration tests
vendor/bin/phpunit tests/Gutenberg

# Một test cụ thể
vendor/bin/phpunit tests/Gutenberg/Blocks/LanguageSwitcherBlockTest.php
```

## Xem thêm

- `tests/Gutenberg/Blocks/README.md` - Chi tiết về block tests
- `docs/BLOCK_TESTS_THEME.md` - Hướng dẫn đầy đủ
