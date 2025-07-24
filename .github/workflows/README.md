# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated testing and deployment.

## Workflows

### 1. PHPUnit Tests (`phpunit.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Features:**
- Tests across PHP versions: 7.4, 8.0, 8.1, 8.2
- Coverage reporting with Codecov integration
- HTML coverage reports as artifacts
- Automatic PR comments with coverage changes
- Caching for faster builds

**Outputs:**
- Test results for each PHP version
- Coverage reports uploaded as artifacts
- Codecov integration for coverage tracking

### 2. Update Coverage Badge (`update-coverage-badge.yml`)

**Triggers:**
- After successful completion of PHPUnit Tests workflow on `main` branch

**Features:**
- Calculates current coverage percentage
- Updates coverage badge in README.md
- Automatically commits and pushes changes

## Usage

### Local Testing

Before pushing, run tests locally:

```bash
# Install dependencies
composer install

# Run tests
composer test

# Run tests with coverage
composer test-coverage
```

### Coverage Reports

- **HTML Report**: Available as artifacts in GitHub Actions
- **Codecov**: Integrated for historical coverage tracking
- **Badge**: Automatically updated in README.md

### Adding New Tests

1. Create test files in the `tests/` directory
2. Follow the existing naming convention: `*Test.php`
3. Extend `PHPUnit\Framework\TestCase`
4. Use the `Tests\` namespace

Example:
```php
<?php

namespace Tests\YourComponent;

use PHPUnit\Framework\TestCase;

class YourComponentTest extends TestCase
{
    public function testYourMethod()
    {
        // Your test code here
    }
}
```

## Configuration

### PHPUnit Configuration

The main configuration is in `phpunit.xml`:
- Bootstrap file: `tests/bootstrap.php`
- Coverage includes: `includes/Jankx/`
- Coverage excludes: `tests/`
- Output formats: HTML and Clover XML

### GitHub Actions Secrets

No additional secrets required for basic testing. For enhanced features:

- `CODECOV_TOKEN`: For Codecov integration (optional)
- `GITHUB_TOKEN`: Automatically provided by GitHub

## Troubleshooting

### Common Issues

1. **Tests failing on GitHub but passing locally**
   - Check PHP version differences
   - Verify all dependencies are installed
   - Check for environment-specific code

2. **Coverage not updating**
   - Ensure tests are actually running
   - Check that coverage files are being generated
   - Verify Codecov integration is working

3. **Badge not updating**
   - Check if the workflow has proper permissions
   - Verify the regex pattern in the update script
   - Ensure the main branch is being used

### Debugging

To debug workflow issues:

1. Check the Actions tab in GitHub
2. Review the logs for each step
3. Download artifacts to inspect coverage reports
4. Use the "Re-run jobs" feature to test fixes