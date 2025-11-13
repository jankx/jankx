# Query Module

Query module for building WordPress queries following SOLID principles and design patterns.

## Structure

```
Query/
├── README.md                        # This file
├── PostTypeQueryBuilder.php        # Main query builder implementation
└── AdvancedFiltersQueryBuilder.php # Specialized builder for filters

Contracts/Query/
├── QueryBuilderInterface.php       # Main contract
├── PostTypeQueryInterface.php      # Post type specific methods
├── TaxonomyQueryInterface.php      # Taxonomy query methods
├── MetaQueryInterface.php          # Meta field query methods
└── DateQueryInterface.php          # Date query methods
```

## Design Patterns

### 1. Builder Pattern
- `PostTypeQueryBuilder` - Main builder
- `AdvancedFiltersQueryBuilder` - Specialized builder
- Fluent interface for method chaining

### 2. Strategy Pattern
- Different builders for different query types
- Interface-based implementations

### 3. Composition Pattern
- `AdvancedFiltersQueryBuilder` composes `PostTypeQueryBuilder`
- Reuse without inheritance

### 4. Dependency Inversion Principle
- Depend on interfaces, not concrete classes
- Easy to swap implementations

## Usage Examples

### Basic Query

```php
use Jankx\Query\PostTypeQueryBuilder;

$builder = new PostTypeQueryBuilder();
$query = $builder
    ->setPostType('post')
    ->setPerPage(10)
    ->setOrderBy('date')
    ->setOrder('DESC')
    ->query();

while ($query->have_posts()) {
    $query->the_post();
    // Render post
}
wp_reset_postdata();
```

### With Taxonomy

```php
$query = $builder
    ->setPostType('post')
    ->addTaxonomy('category', 'term_id', [1, 2, 3], 'IN')
    ->addTaxonomy('post_tag', 'term_id', [5, 6], 'IN')
    ->query();
```

### Advanced Filters

```php
use Jankx\Query\AdvancedFiltersQueryBuilder;

$builder = new AdvancedFiltersQueryBuilder();
$args = $builder->buildFromFilters($block_attrs, $filters);
$query = new WP_Query($args);
```

## Principles Applied

- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Extensible without modification
- **Liskov Substitution**: Interfaces guarantee contracts
- **Interface Segregation**: Clients only depend on methods they use
- **Dependency Inversion**: Depend on abstractions

## Extension Points

All builders support WordPress filters:

```php
// Before building
$args = apply_filters('jankx/query/post-type/before_build', $args);

// After query
do_action('jankx/query/post-type/after_query', $query, $args);

// Advanced filters
$args = apply_filters('jankx_advanced_filter_query_args', $args, $filters, $block_attrs);
```

## Testing

Query builders are easily testable:
- No global state
- Pure functions where possible
- Easy to mock interfaces

