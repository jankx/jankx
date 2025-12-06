# Quick Start: Block Tests trong Theme

## Chạy Tests

```bash
# Từ theme directory
cd public/wp-content/themes/cheephub

# Tất cả block tests
vendor/bin/phpunit tests/Gutenberg/Blocks

# Một test cụ thể
vendor/bin/phpunit tests/Gutenberg/Blocks/LanguageSwitcherBlockTest.php

# Với filter
vendor/bin/phpunit --filter LanguageSwitcherBlockTest
```

## Tạo Test Mới

1. Copy từ test file có sẵn
2. Thay đổi namespace từ `Tests\Unit\Gutenberg\Blocks` sang `Tests\Gutenberg\Blocks`
3. Thay đổi class name và block ID
4. Cập nhật default attributes

## Structure

```
tests/Gutenberg/Blocks/
├── BlockTestCase.php (Base class - extends Tests\Helpers\TestCase)
├── LanguageSwitcherBlockTest.php (Example)
└── ... (các blocks khác)
```

## Namespace

- Base class: `Tests\Gutenberg\Blocks\BlockTestCase`
- Test classes: `Tests\Gutenberg\Blocks\YourBlockBlockTest`
