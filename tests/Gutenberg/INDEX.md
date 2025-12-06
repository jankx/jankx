# Gutenberg Blocks Tests - Index

## 📍 Location

Tất cả tests được đặt trong theme directory:
```
public/wp-content/themes/cheephub/tests/Gutenberg/
```

## 📁 Cấu trúc Files

### Base Classes
- `BlockTestCase.php` - Base class cho unit tests
- `BlockIntegrationTestCase.php` - Base class cho integration tests

### Unit Tests (6 blocks)
1. `Blocks/LanguageSwitcherBlockTest.php`
2. `Blocks/AdvancedButtonBlockTest.php`
3. `Blocks/AdvancedFiltersBlockTest.php`
4. `Blocks/AuthorBoxBlockTest.php`
5. `Blocks/AdvancedImageBoxBlockTest.php`

### Integration Tests
1. `Blocks/LanguageSwitcherBlockIntegrationTest.php`

### Utilities
- `Blocks/BlockTestGenerator.php` - Test generator utility

### Documentation
- `README.md` - Overview
- `Blocks/README.md` - Block tests details
- `Blocks/QUICK_START.md` - Quick start guide
- `MOVED_FROM_ROOT.md` - Migration info
- `MIGRATION_SUMMARY.md` - Migration summary
- `TESTS_COMPLETE.md` - Complete status

## 🎯 Quick Start

```bash
cd public/wp-content/themes/cheephub
vendor/bin/phpunit tests/Gutenberg/Blocks
```

## 📚 Documentation

- Chi tiết: `tests/Gutenberg/Blocks/README.md`
- Quick start: `tests/Gutenberg/Blocks/QUICK_START.md`
- Hướng dẫn đầy đủ: `docs/BLOCK_TESTS_THEME.md`
