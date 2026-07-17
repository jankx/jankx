# Tests trong Theme

## Tổng quan

Tests cho theme components được đặt trong thư mục này.

## Cấu trúc

```
tests/
├── Gutenberg/
│   ├── BlockIntegrationTestCase.php
│   └── Blocks/
│       ├── BlockTestCase.php
│       ├── *BlockTest.php (Unit tests)
│       └── *BlockIntegrationTest.php (Integration tests)
├── App/
├── Foundation/
├── Managers/
└── Support/
```

## Gutenberg Blocks Tests

Xem chi tiết tại: `tests/Gutenberg/README.md`

## Chạy Tests

```bash
# Từ theme directory
cd public/wp-content/themes/cheephub

# Tất cả tests
vendor/bin/phpunit

# Chỉ Gutenberg tests
vendor/bin/phpunit tests/Gutenberg

# Chỉ block tests
vendor/bin/phpunit tests/Gutenberg/Blocks
```

## phpunit.xml

File `phpunit.xml` trong theme directory đã được cấu hình để chạy tất cả tests.
