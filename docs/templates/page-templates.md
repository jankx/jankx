# Page Templates Documentation

## Overview

Page templates trong Jankx 2.0 được viết bằng HTML với Gutenberg block markup. Templates này định nghĩa cấu trúc và layout cho các trang khác nhau của website.

## Template Structure

### File Locations
```
templates/
├── 404.html              # 404 error page
├── archive.html          # Archive pages
├── front-page.html       # Front page
├── home.html            # Blog home page
├── index.html           # Default template
├── page.html            # Static pages
├── search.html          # Search results
└── single.html          # Single post
```

## Single Post Template

### File Location
`templates/single.html`

### Template Structure

```html
<!-- wp:template-part {"slug":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
  <!-- wp:post-title /-->
  <!-- wp:post-content /-->
  <!-- wp:post-author /-->
  <!-- wp:post-date /-->
  <!-- wp:post-terms {"term":"category"} /-->
  <!-- wp:post-terms {"term":"post_tag"} /-->
  <!-- wp:comments /-->
</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer"} /-->
```

### Features

#### 1. Post Title
```html
<!-- wp:post-title /-->
```
- Hiển thị title của post
- Sử dụng heading level phù hợp
- Responsive design

#### 2. Post Content
```html
<!-- wp:post-content /-->
```
- Hiển thị nội dung chính của post
- Hỗ trợ Gutenberg blocks
- Responsive images và media

#### 3. Post Author
```html
<!-- wp:post-author /-->
```
- Hiển thị thông tin tác giả
- Avatar và bio (nếu có)
- Link đến author archive

#### 4. Post Date
```html
<!-- wp:post-date /-->
```
- Hiển thị ngày đăng bài
- Format theo WordPress settings
- Timezone support

#### 5. Post Terms
```html
<!-- wp:post-terms {"term":"category"} /-->
<!-- wp:post-terms {"term":"post_tag"} /-->
```
- Hiển thị categories và tags
- Link đến term archives
- Styling tùy chỉnh

#### 6. Comments
```html
<!-- wp:comments /-->
```
- Comment form và list
- Pagination cho comments
- Moderation features

### Customization

#### 1. Add Custom Blocks
```html
<!-- wp:group {"className":"custom-section"} -->
<div class="wp-block-group custom-section">
  <!-- wp:heading {"level":2} -->
  <h2>Related Posts</h2>
  <!-- /wp:heading -->

  <!-- wp:query {"queryId":1,"query":{"postType":"post","perPage":3}} -->
  <div class="wp-block-query">
    <!-- wp:post-template -->
      <!-- wp:post-title {"isLink":true} /-->
      <!-- wp:post-excerpt /-->
    <!-- /wp:post-template -->
  </div>
  <!-- /wp:query -->
</div>
<!-- /wp:group -->
```

#### 2. Custom Layout
```html
<!-- wp:columns {"style":{"spacing":{"padding":{"top":"2rem","bottom":"2rem"}}}} -->
<div class="wp-block-columns" style="padding-top:2rem;padding-bottom:2rem">
  <!-- wp:column {"width":"70%"} -->
  <div class="wp-block-column" style="flex-basis:70%">
    <!-- wp:post-content /-->
  </div>
  <!-- /wp:column -->

  <!-- wp:column {"width":"30%"} -->
  <div class="wp-block-column" style="flex-basis:30%">
    <!-- wp:post-author /-->
    <!-- wp:post-date /-->
  </div>
  <!-- /wp:column -->
</div>
<!-- /wp:columns -->
```

## Archive Template

### File Location
`templates/archive.html`

### Template Structure

```html
<!-- wp:template-part {"slug":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
  <!-- wp:archive-title /-->
  <!-- wp:query -->
    <!-- wp:post-template -->
      <!-- wp:post-title /-->
      <!-- wp:post-excerpt /-->
      <!-- wp:post-date /-->
    <!-- /wp:post-template -->
  <!-- /wp:query -->
</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer"} /-->
```

### Features

#### 1. Archive Title
```html
<!-- wp:archive-title /-->
```
- Hiển thị title của archive
- Category, tag, author, date archives
- Breadcrumb navigation

#### 2. Query Loop
```html
<!-- wp:query -->
  <!-- wp:post-template -->
    <!-- wp:post-title /-->
    <!-- wp:post-excerpt /-->
    <!-- wp:post-date /-->
  <!-- /wp:post-template -->
<!-- /wp:query -->
```
- Hiển thị danh sách posts
- Pagination support
- Custom query parameters

### Customization Examples

#### 1. Grid Layout
```html
<!-- wp:query {"queryId":1,"query":{"postType":"post","perPage":12}} -->
<div class="wp-block-query">
  <!-- wp:post-template {"className":"grid-layout"} -->
  <div class="wp-block-post-template grid-layout">
    <!-- wp:post-featured-image {"isLink":true} /-->
    <!-- wp:post-title {"isLink":true} /-->
    <!-- wp:post-excerpt {"moreText":"Read More"} /-->
  </div>
  <!-- /wp:post-template -->

  <!-- wp:query-pagination -->
  <div class="wp-block-query-pagination">
    <!-- wp:query-pagination-previous /-->
    <!-- wp:query-pagination-numbers /-->
    <!-- wp:query-pagination-next /-->
  </div>
  <!-- /wp:query-pagination -->
</div>
<!-- /wp:query -->
```

#### 2. Filterable Archive
```html
<!-- wp:group {"className":"archive-filters"} -->
<div class="wp-block-group archive-filters">
  <!-- wp:search {"label":"Search posts..."} /-->
  <!-- wp:categories {"showPostCounts":true} /-->
</div>
<!-- /wp:group -->

<!-- wp:query {"queryId":1} -->
<div class="wp-block-query">
  <!-- wp:post-template -->
    <!-- wp:post-title {"isLink":true} /-->
    <!-- wp:post-excerpt /-->
  <!-- /wp:post-template -->
</div>
<!-- /wp:query -->
```

## Front Page Template

### File Location
`templates/front-page.html`

### Template Structure

```html
<!-- wp:template-part {"slug":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
  <!-- wp:post-content /-->
</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer"} /-->
```

### Features

#### 1. Custom Content
```html
<!-- wp:post-content /-->
```
- Hiển thị nội dung tùy chỉnh
- Hỗ trợ tất cả Gutenberg blocks
- Full-width layout options

### Customization Examples

#### 1. Hero Section
```html
<!-- wp:group {"className":"hero-section","style":{"spacing":{"padding":{"top":"4rem","bottom":"4rem"}}}} -->
<div class="wp-block-group hero-section" style="padding-top:4rem;padding-bottom:4rem">
  <!-- wp:heading {"level":1,"align":"center"} -->
  <h1 class="wp-block-heading has-text-align-center">Welcome to Our Site</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center"} -->
  <p class="has-text-align-center">Discover amazing content and services.</p>
  <!-- /wp:paragraph -->

  <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
  <div class="wp-block-buttons">
    <!-- wp:button -->
    <div class="wp-block-button">
      <a class="wp-block-button__link wp-element-button">Get Started</a>
    </div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div>
<!-- /wp:group -->
```

#### 2. Feature Grid
```html
<!-- wp:columns {"className":"feature-grid"} -->
<div class="wp-block-columns feature-grid">
  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:heading {"level":3} -->
    <h3 class="wp-block-heading">Feature 1</h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph -->
    <p>Description of feature 1.</p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:heading {"level":3} -->
    <h3 class="wp-block-heading">Feature 2</h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph -->
    <p>Description of feature 2.</p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:heading {"level":3} -->
    <h3 class="wp-block-heading">Feature 3</h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph -->
    <p>Description of feature 3.</p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->
</div>
<!-- /wp:columns -->
```

## Page Template

### File Location
`templates/page.html`

### Template Structure

```html
<!-- wp:template-part {"slug":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
  <!-- wp:post-title /-->
  <!-- wp:post-content /-->
  <!-- wp:comments /-->
</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer"} /-->
```

### Features

#### 1. Page Title
```html
<!-- wp:post-title /-->
```
- Hiển thị title của page
- H1 heading level
- SEO optimized

#### 2. Page Content
```html
<!-- wp:post-content /-->
```
- Hiển thị nội dung page
- Full Gutenberg support
- Custom blocks

#### 3. Comments (Optional)
```html
<!-- wp:comments /-->
```
- Comment system cho pages
- Có thể disable per page

### Customization Examples

#### 1. Full-Width Page
```html
<!-- wp:template-part {"slug":"header"} /-->

<!-- wp:post-title {"align":"wide"} /-->
<!-- wp:post-content {"layout":{"inherit":true}} /-->

<!-- wp:template-part {"slug":"footer"} /-->
```

#### 2. Page with Sidebar
```html
<!-- wp:template-part {"slug":"header"} /-->

<!-- wp:columns {"style":{"spacing":{"padding":{"top":"2rem","bottom":"2rem"}}}} -->
<div class="wp-block-columns" style="padding-top:2rem;padding-bottom:2rem">
  <!-- wp:column {"width":"70%"} -->
  <div class="wp-block-column" style="flex-basis:70%">
    <!-- wp:post-title /-->
    <!-- wp:post-content /-->
  </div>
  <!-- /wp:column -->

  <!-- wp:column {"width":"30%"} -->
  <div class="wp-block-column" style="flex-basis:30%">
    <!-- wp:widget-area {"id":"sidebar-1"} /-->
  </div>
  <!-- /wp:column -->
</div>
<!-- /wp:columns -->

<!-- wp:template-part {"slug":"footer"} /-->
```

## 404 Template

### File Location
`templates/404.html`

### Template Structure

```html
<!-- wp:template-part {"slug":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
  <h1>404 - Not Found</h1>
  <p>The page you are looking for could not be found.</p>
  <!-- wp:search {"label":"Search..."} /-->
</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer"} /-->
```

### Features

#### 1. Error Message
```html
<h1>404 - Not Found</h1>
<p>The page you are looking for could not be found.</p>
```
- Clear error message
- User-friendly language
- Helpful suggestions

#### 2. Search Functionality
```html
<!-- wp:search {"label":"Search..."} /-->
```
- Search form
- Help users find content
- Site-wide search

### Customization Examples

#### 1. Enhanced 404 Page
```html
<!-- wp:template-part {"slug":"header"} /-->

<!-- wp:group {"className":"error-404","layout":{"type":"constrained"}} -->
<div class="wp-block-group error-404">
  <!-- wp:heading {"level":1,"align":"center"} -->
  <h1 class="wp-block-heading has-text-align-center">404 - Page Not Found</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center"} -->
  <p class="has-text-align-center">Sorry, the page you're looking for doesn't exist.</p>
  <!-- /wp:paragraph -->

  <!-- wp:search {"label":"Search our site...","buttonText":"Search","align":"center"} /-->

  <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
  <div class="wp-block-buttons">
    <!-- wp:button -->
    <div class="wp-block-button">
      <a class="wp-block-button__link wp-element-button" href="/">Go Home</a>
    </div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer"} /-->
```

## Search Template

### File Location
`templates/search.html`

### Template Structure

```html
<!-- wp:template-part {"slug":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
  <!-- wp:search {"label":"Search..."} /-->
  <!-- wp:query -->
    <!-- wp:post-template -->
      <!-- wp:post-title /-->
      <!-- wp:post-excerpt /-->
      <!-- wp:post-date /-->
    <!-- /wp:post-template -->
  <!-- /wp:query -->
</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer"} /-->
```

### Features

#### 1. Search Form
```html
<!-- wp:search {"label":"Search..."} /-->
```
- Search input field
- Search button
- Placeholder text

#### 2. Search Results
```html
<!-- wp:query -->
  <!-- wp:post-template -->
    <!-- wp:post-title /-->
    <!-- wp:post-excerpt /-->
    <!-- wp:post-date /-->
  <!-- /wp:post-template -->
<!-- /wp:query -->
```
- Hiển thị kết quả tìm kiếm
- Post excerpts
- Pagination

### Customization Examples

#### 1. Advanced Search
```html
<!-- wp:group {"className":"search-page","layout":{"type":"constrained"}} -->
<div class="wp-block-group search-page">
  <!-- wp:heading {"level":1,"align":"center"} -->
  <h1 class="wp-block-heading has-text-align-center">Search Results</h1>
  <!-- /wp:heading -->

  <!-- wp:search {"label":"Search our site...","buttonText":"Search","align":"center"} /-->

  <!-- wp:query {"queryId":1,"query":{"search":"","perPage":10}} -->
  <div class="wp-block-query">
    <!-- wp:post-template -->
    <div class="wp-block-post-template">
      <!-- wp:post-title {"isLink":true} /-->
      <!-- wp:post-excerpt {"moreText":"Read More"} /-->
      <!-- wp:post-date /-->
    </div>
    <!-- /wp:post-template -->

    <!-- wp:query-pagination -->
    <div class="wp-block-query-pagination">
      <!-- wp:query-pagination-previous /-->
      <!-- wp:query-pagination-numbers /-->
      <!-- wp:query-pagination-next /-->
    </div>
    <!-- /wp:query-pagination -->
  </div>
  <!-- /wp:query -->
</div>
<!-- /wp:group -->
```

## Home Template

### File Location
`templates/home.html`

### Template Structure

```html
<!-- wp:template-part {"slug":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
  <!-- wp:query {"query":{"postType":"post"}} -->
    <!-- wp:post-template -->
      <!-- wp:post-title /-->
      <!-- wp:post-excerpt /-->
      <!-- wp:post-date /-->
    <!-- /wp:post-template -->
  <!-- /wp:query -->
</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer"} /-->
```

### Features

#### 1. Blog Posts Query
```html
<!-- wp:query {"query":{"postType":"post"}} -->
  <!-- wp:post-template -->
    <!-- wp:post-title /-->
    <!-- wp:post-excerpt /-->
    <!-- wp:post-date /-->
  <!-- /wp:post-template -->
<!-- /wp:query -->
```
- Hiển thị blog posts
- Post excerpts
- Pagination

### Customization Examples

#### 1. Featured Posts
```html
<!-- wp:group {"className":"home-page","layout":{"type":"constrained"}} -->
<div class="wp-block-group home-page">
  <!-- wp:heading {"level":1,"align":"center"} -->
  <h1 class="wp-block-heading has-text-align-center">Latest Posts</h1>
  <!-- /wp:heading -->

  <!-- wp:query {"queryId":1,"query":{"postType":"post","perPage":6}} -->
  <div class="wp-block-query">
    <!-- wp:post-template {"className":"post-grid"} -->
    <div class="wp-block-post-template post-grid">
      <!-- wp:post-featured-image {"isLink":true} /-->
      <!-- wp:post-title {"isLink":true} /-->
      <!-- wp:post-excerpt {"moreText":"Read More"} /-->
      <!-- wp:post-date /-->
    </div>
    <!-- /wp:post-template -->
  </div>
  <!-- /wp:query -->

  <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
  <div class="wp-block-buttons">
    <!-- wp:button -->
    <div class="wp-block-button">
      <a class="wp-block-button__link wp-element-button" href="/blog">View All Posts</a>
    </div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div>
<!-- /wp:group -->
```

## Index Template

### File Location
`templates/index.html`

### Template Structure

```html
<!-- wp:template-part {"slug":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
  <!-- wp:query -->
    <!-- wp:post-template -->
      <!-- wp:post-title /-->
      <!-- wp:post-excerpt /-->
      <!-- wp:post-date /-->
    <!-- /wp:post-template -->
  <!-- /wp:query -->
</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer"} /-->
```

### Features

#### 1. Default Query
```html
<!-- wp:query -->
  <!-- wp:post-template -->
    <!-- wp:post-title /-->
    <!-- wp:post-excerpt /-->
    <!-- wp:post-date /-->
  <!-- /wp:post-template -->
<!-- /wp:query -->
```
- Fallback template
- Default post query
- Basic layout

## Template Customization

### 1. Adding Custom Blocks

```html
<!-- wp:group {"className":"custom-section"} -->
<div class="wp-block-group custom-section">
  <!-- wp:heading {"level":2} -->
  <h2>Custom Section</h2>
  <!-- /wp:heading -->

  <!-- wp:paragraph -->
  <p>Custom content goes here.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
```

### 2. Conditional Blocks

```html
<!-- wp:group {"className":"conditional-section"} -->
<div class="wp-block-group conditional-section">
  <!-- wp:conditional {"condition":"is_single"} -->
  <div class="wp-block-conditional">
    <!-- wp:post-author /-->
  </div>
  <!-- /wp:conditional -->
</div>
<!-- /wp:group -->
```

### 3. Custom Layouts

```html
<!-- wp:columns {"style":{"spacing":{"padding":{"top":"2rem","bottom":"2rem"}}}} -->
<div class="wp-block-columns" style="padding-top:2rem;padding-bottom:2rem">
  <!-- wp:column {"width":"60%"} -->
  <div class="wp-block-column" style="flex-basis:60%">
    <!-- wp:post-content /-->
  </div>
  <!-- /wp:column -->

  <!-- wp:column {"width":"40%"} -->
  <div class="wp-block-column" style="flex-basis:40%">
    <!-- wp:widget-area {"id":"sidebar-1"} /-->
  </div>
  <!-- /wp:column -->
</div>
<!-- /wp:columns -->
```

## Next Steps

1. **Create custom page templates** for specific use cases
2. **Add more interactive elements** to templates
3. **Implement responsive design** improvements
4. **Add accessibility features** to all templates
5. **Create template testing** framework