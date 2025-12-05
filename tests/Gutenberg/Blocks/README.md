# Gutenberg Blocks Unit Tests

## Tổng quan

Thư mục này chứa unit tests cho tất cả Gutenberg blocks của theme.

## Cấu trúc

```
tests/Gutenberg/Blocks/
├── BlockTestCase.php (Base test case)
├── LanguageSwitcherBlockTest.php
├── AdvancedButtonBlockTest.php
├── AdvancedFiltersBlockTest.php
├── AuthorBoxBlockTest.php
├── AdvancedImageBoxBlockTest.php
└── ... (các blocks khác)
```

## Namespace

Tất cả tests sử dụng namespace: `Tests\Gutenberg\Blocks`

## Base Class

Tất cả block tests extends từ `BlockTestCase`:

```php
namespace Tests\Gutenberg\Blocks;

use Tests\Gutenberg\Blocks\BlockTestCase;
use Jankx\Gutenberg\Blocks\YourBlockBlock;

class YourBlockBlockTest extends BlockTestCase
{
    // ...
}
```

## Chạy Tests

```bash
# Từ theme directory
cd public/wp-content/themes/cheephub
vendor/bin/phpunit tests/Gutenberg/Blocks

# Hoặc từ root
cd public/wp-content/themes/cheephub
php vendor/bin/phpunit tests/Gutenberg/Blocks

# Một block cụ thể
php vendor/bin/phpunit tests/Gutenberg/Blocks/LanguageSwitcherBlockTest.php
```

## Xem thêm

- Xem `docs/BLOCK_TESTS_README.md` ở root project để biết cách generate tests
- Xem các test examples có sẵn
