# Jankx Hooks Migration Summary

## Overview

Đã thay thế tất cả action & filter hooks của Jankx từ format `jankx_group_name` sang format `jankx/group/name` để đồng nhất với package naming convention.

## Migration Changes

### 1. CLI Hooks

| Old Hook | New Hook |
|----------|----------|
| `jankx_cli_output` | `jankx/cli/output` |
| `jankx_cli_initialized` | `jankx/cli/initialized` |
| `jankx_wpcli_register_commands` | `jankx/wpcli/register_commands` |

### 2. API Hooks

| Old Hook | New Hook |
|----------|----------|
| `jankx_api_register_endpoints` | `jankx/api/register_endpoints` |
| `jankx_api_public_endpoints` | `jankx/api/public_endpoints` |
| `jankx_api_response_formatted` | `jankx/api/response_formatted` |
| `jankx_api_error_formatted` | `jankx/api/error_formatted` |
| `jankx_api_valid_keys` | `jankx/api/valid_keys` |
| `jankx_api_rate_limit_max` | `jankx/api/rate_limit_max` |
| `jankx_api_rate_limit_window` | `jankx/api/rate_limit_window` |

### 3. Cron Hooks

| Old Hook | New Hook |
|----------|----------|
| `jankx_cron_optimize` | `jankx/cron/optimize` |
| `jankx_cron_security_scan` | `jankx/cron/security_scan` |
| `jankx_cron_cache_cleanup` | `jankx/cron/cache_cleanup` |
| `jankx_cron_output` | `jankx/cron/output` |

### 4. Gutenberg Hooks

| Old Hook | New Hook |
|----------|----------|
| `jankx_gutenberg_nonce` | `jankx/gutenberg/nonce` |
| `jankx_partial_hydration` | `jankx/partial_hydration` |
| `jankx_layout_options` | `jankx/layout_options` |

### 5. Admin Hooks

| Old Hook | New Hook |
|----------|----------|
| `jankx_dashboard_widget` | `jankx/dashboard/widget` |

### 6. Context Detection

| Old Hook | New Hook |
|----------|----------|
| `jankx_gutenberg` | `jankx/gutenberg` (in strategy patterns) |

### 7. Database Options

| Old Option | New Option |
|------------|------------|
| `jankx_api_logs` | `jankx/api/logs` |
| `jankx_api_rate_limit_*` | `jankx/api/rate_limit_*` |

## Files Modified

### Core Framework Files

- `includes/Jankx/Kernel/CLIKernel.php`
- `includes/Jankx/Kernel/APIKernel.php`
- `includes/Jankx/Kernel/CronKernel.php`
- `includes/Jankx/Gutenberg/BlockRegistry.php`
- `includes/Jankx/Bootstrappers/Gutenberg/GutenbergFrontendBootstrapper.php`
- `includes/Jankx/Admin/Dashboard.php`
- `includes/Jankx/Kernel/Strategies/GutenbergAjaxKernelStrategy.php`
- `includes/Jankx/Context/ContextualServiceRegistry.php`

### Documentation Files

- `docs/cli/development.md`
- `docs/cli/examples.md`
- `docs/post-layout/troubleshooting.md`
- `docs/post-layout/pattern-library.md`
- `docs/post-layout/migration-guide.md`

## Benefits

### 1. Consistency
Tất cả hooks giờ đây follow package naming convention

### 2. Namespace Organization
Hooks được organize theo groups rõ ràng

### 3. Maintainability
Dễ dàng tìm và quản lý hooks

### 4. Scalability
Format mới hỗ trợ tốt hơn cho việc mở rộng

## Migration Notes

- ✅ Tất cả hooks đã được thay thế đồng nhất
- ✅ Documentation examples đã được cập nhật
- ✅ Code examples trong docs đã được sync
- ✅ Database options và transients đã được cập nhật
- ✅ Context detection patterns đã được cập nhật

## Next Steps

1. **Test tất cả hooks** để đảm bảo hoạt động đúng
2. **Update any external plugins/themes** sử dụng old hooks
3. **Create migration guide** cho developers
4. **Update API documentation**