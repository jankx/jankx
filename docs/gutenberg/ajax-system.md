# AJAX Deferred HTML System

> **Dynamic Content Loading with Placeholder Replacement**

Jankx 2.0 sử dụng hệ thống AJAX deferred HTML để tải dynamic content với placeholders, tránh vấn đề cache và tối ưu performance.

## 🏗 AJAX System Architecture

### System Flow
```
┌─────────────────────────────────────┐
│         Initial Render              │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Static    │  │  Placeholder│  │
│  │  Content    │  │   Content   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         AJAX Request                │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Client    │  │   Server    │  │
│  │   Request   │  │  Processing │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Content Replacement         │
│  ┌─────────────┐  ┌─────────────┐  │
│  │  Placeholder│  │  Dynamic    │  │
│  │ Replacement │  │  Content    │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

## 🔧 Placeholder System

### Placeholder Generation
```php
<?php
namespace Jankx\Gutenberg\AJAX;

class PlaceholderGenerator
{
    private $placeholderId = 0;

    public function generatePlaceholder(string $blockName, array $attributes = []): string
    {
        $this->placeholderId++;
        $placeholderId = "jankx-placeholder-{$this->placeholderId}";

        $placeholderData = [
            'id' => $placeholderId,
            'block' => $blockName,
            'attributes' => $attributes,
            'nonce' => wp_create_nonce('jankx_ajax_nonce'),
        ];

        $encodedData = base64_encode(json_encode($placeholderData));

        return sprintf(
            '<div class="jankx-placeholder" data-placeholder="%s" data-block="%s">
                <div class="placeholder-content">
                    <div class="placeholder-spinner"></div>
                    <div class="placeholder-text">Loading...</div>
                </div>
            </div>',
            esc_attr($encodedData),
            esc_attr($blockName)
        );
    }

    public function generateSkeletonPlaceholder(string $blockName, array $attributes = []): string
    {
        $this->placeholderId++;
        $placeholderId = "jankx-skeleton-{$this->placeholderId}";

        return sprintf(
            '<div class="jankx-skeleton-placeholder" data-placeholder="%s" data-block="%s">
                <div class="skeleton-content">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                </div>
            </div>',
            esc_attr($this->generatePlaceholderData($blockName, $attributes)),
            esc_attr($blockName)
        );
    }

    private function generatePlaceholderData(string $blockName, array $attributes): string
    {
        $data = [
            'block' => $blockName,
            'attributes' => $attributes,
            'nonce' => wp_create_nonce('jankx_ajax_nonce'),
        ];

        return base64_encode(json_encode($data));
    }
}
```

### Placeholder Rendering
```php
class PlaceholderRenderer
{
    private $generator;

    public function __construct(PlaceholderGenerator $generator)
    {
        $this->generator = $generator;
    }

    public function renderPlaceholder(string $blockName, array $attributes = []): string
    {
        // Check if content should be deferred
        if ($this->shouldDeferContent($blockName, $attributes)) {
            return $this->generator->generatePlaceholder($blockName, $attributes);
        }

        // Render content immediately
        return $this->renderContent($blockName, $attributes);
    }

    private function shouldDeferContent(string $blockName, array $attributes): bool
    {
        $deferredBlocks = [
            'jankx/testimonials-grid',
            'jankx/posts-grid',
            'jankx/comments-section',
            'jankx/search-results',
            'jankx/dynamic-form',
        ];

        // Check if block should be deferred
        if (in_array($blockName, $deferredBlocks)) {
            return true;
        }

        // Check for heavy content
        if ($this->isHeavyContent($attributes)) {
            return true;
        }

        // Check for user-specific content
        if ($this->isUserSpecificContent($attributes)) {
            return true;
        }

        return false;
    }

    private function isHeavyContent(array $attributes): bool
    {
        // Check for large datasets
        if (isset($attributes['postsPerPage']) && $attributes['postsPerPage'] > 6) {
            return true;
        }

        // Check for complex queries
        if (isset($attributes['complexQuery']) && $attributes['complexQuery']) {
            return true;
        }

        return false;
    }

    private function isUserSpecificContent(array $attributes): bool
    {
        // Check for user-specific data
        if (isset($attributes['showUserData']) && $attributes['showUserData']) {
            return true;
        }

        // Check for personalized content
        if (isset($attributes['personalized']) && $attributes['personalized']) {
            return true;
        }

        return false;
    }
}
```

## 🔄 AJAX Handler

### AJAX Request Handler
```php
<?php
namespace Jankx\Gutenberg\AJAX;

class AJAXHandler
{
    private $contentRenderer;
    private $securityManager;

    public function __construct(ContentRenderer $contentRenderer, SecurityManager $securityManager)
    {
        $this->contentRenderer = $contentRenderer;
        $this->securityManager = $securityManager;
    }

    public function init(): void
    {
        add_action('wp_ajax_jankx_load_content', [$this, 'handleLoadContent']);
        add_action('wp_ajax_nopriv_jankx_load_content', [$this, 'handleLoadContent']);
    }

    public function handleLoadContent(): void
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'jankx_ajax_nonce')) {
            wp_die('Security check failed');
        }

        // Validate request data
        $blockName = sanitize_text_field($_POST['block'] ?? '');
        $attributes = $this->sanitizeAttributes($_POST['attributes'] ?? []);
        $placeholderId = sanitize_text_field($_POST['placeholder_id'] ?? '');

        if (empty($blockName)) {
            wp_send_json_error('Invalid block name');
        }

        // Render content
        try {
            $content = $this->contentRenderer->renderContent($blockName, $attributes);

            wp_send_json_success([
                'content' => $content,
                'placeholder_id' => $placeholderId,
                'block' => $blockName,
            ]);
        } catch (\Exception $e) {
            wp_send_json_error('Failed to render content: ' . $e->getMessage());
        }
    }

    private function sanitizeAttributes(array $attributes): array
    {
        $sanitized = [];

        foreach ($attributes as $key => $value) {
            if (is_string($value)) {
                $sanitized[$key] = sanitize_text_field($value);
            } elseif (is_array($value)) {
                $sanitized[$key] = $this->sanitizeAttributes($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }
}
```

### Content Renderer
```php
class ContentRenderer
{
    private $blockRegistry;
    private $templateRenderer;

    public function __construct(BlockRegistry $blockRegistry, TemplateRenderer $templateRenderer)
    {
        $this->blockRegistry = $blockRegistry;
        $this->templateRenderer = $templateRenderer;
    }

    public function renderContent(string $blockName, array $attributes = []): string
    {
        // Get block instance
        $block = $this->blockRegistry->getBlock($blockName);

        if (!$block) {
            throw new \Exception("Block not found: {$blockName}");
        }

        // Render content
        $content = $block->render($attributes, '');

        // Apply filters
        $content = apply_filters('jankx_ajax_content', $content, $blockName, $attributes);

        return $content;
    }

    public function renderTestimonialsGrid(array $attributes): string
    {
        $postsPerPage = $attributes['postsPerPage'] ?? 6;
        $category = $attributes['category'] ?? '';

        $args = [
            'post_type' => 'testimonial',
            'posts_per_page' => $postsPerPage,
            'post_status' => 'publish',
        ];

        if (!empty($category)) {
            $args['tax_query'] = [
                [
                    'taxonomy' => 'testimonial_category',
                    'field' => 'slug',
                    'terms' => $category,
                ]
            ];
        }

        $testimonials = get_posts($args);

        return $this->templateRenderer->render('testimonials-grid', [
            'testimonials' => $testimonials,
            'attributes' => $attributes,
        ]);
    }

    public function renderPostsGrid(array $attributes): string
    {
        $postsPerPage = $attributes['postsPerPage'] ?? 6;
        $category = $attributes['category'] ?? '';
        $postType = $attributes['postType'] ?? 'post';

        $args = [
            'post_type' => $postType,
            'posts_per_page' => $postsPerPage,
            'post_status' => 'publish',
        ];

        if (!empty($category)) {
            $args['category_name'] = $category;
        }

        $posts = get_posts($args);

        return $this->templateRenderer->render('posts-grid', [
            'posts' => $posts,
            'attributes' => $attributes,
        ]);
    }
}
```

## 🎯 Client-Side Implementation

### JavaScript AJAX Handler
```javascript
// assets/js/ajax-handler.js
class JankxAJAXHandler {
    constructor() {
        this.init();
    }

    init() {
        this.observePlaceholders();
        this.bindEvents();
    }

    observePlaceholders() {
        // Use Intersection Observer for lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadPlaceholder(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });

        // Observe all placeholders
        document.querySelectorAll('.jankx-placeholder').forEach(placeholder => {
            observer.observe(placeholder);
        });
    }

    bindEvents() {
        // Handle manual refresh
        document.addEventListener('click', (e) => {
            if (e.target.matches('.jankx-refresh-content')) {
                e.preventDefault();
                this.refreshContent(e.target.closest('.jankx-placeholder'));
            }
        });
    }

    async loadPlaceholder(placeholder) {
        try {
            // Show loading state
            this.showLoading(placeholder);

            // Get placeholder data
            const placeholderData = this.getPlaceholderData(placeholder);

            // Make AJAX request
            const response = await this.makeRequest(placeholderData);

            // Replace content
            this.replaceContent(placeholder, response.content);

            // Trigger events
            this.triggerEvents(placeholder, response);

        } catch (error) {
            console.error('Failed to load placeholder:', error);
            this.showError(placeholder, error.message);
        }
    }

    getPlaceholderData(placeholder) {
        const encodedData = placeholder.dataset.placeholder;
        const blockName = placeholder.dataset.block;

        try {
            const data = JSON.parse(atob(encodedData));
            return {
                block: blockName,
                attributes: data.attributes || {},
                nonce: data.nonce,
                placeholder_id: placeholder.id
            };
        } catch (error) {
            throw new Error('Invalid placeholder data');
        }
    }

    async makeRequest(data) {
        const formData = new FormData();
        formData.append('action', 'jankx_load_content');
        formData.append('block', data.block);
        formData.append('attributes', JSON.stringify(data.attributes));
        formData.append('nonce', data.nonce);
        formData.append('placeholder_id', data.placeholder_id);

        const response = await fetch(jankx_ajax.ajax_url, {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        });

        if (!response.ok) {
            throw new Error('Network error');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.data || 'Request failed');
        }

        return result.data;
    }

    replaceContent(placeholder, content) {
        // Create wrapper for new content
        const wrapper = document.createElement('div');
        wrapper.className = 'jankx-loaded-content';
        wrapper.innerHTML = content;

        // Replace placeholder with content
        placeholder.parentNode.replaceChild(wrapper, placeholder);

        // Initialize any scripts in the new content
        this.initializeScripts(wrapper);
    }

    showLoading(placeholder) {
        placeholder.innerHTML = `
            <div class="jankx-loading">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading content...</div>
            </div>
        `;
    }

    showError(placeholder, message) {
        placeholder.innerHTML = `
            <div class="jankx-error">
                <div class="error-icon">⚠️</div>
                <div class="error-message">${message}</div>
                <button class="jankx-retry-btn" onclick="jankxAJAX.retryLoad(this)">
                    Retry
                </button>
            </div>
        `;
    }

    triggerEvents(placeholder, response) {
        // Trigger custom event
        const event = new CustomEvent('jankx:contentLoaded', {
            detail: {
                placeholder: placeholder,
                response: response,
                block: response.block
            }
        });

        document.dispatchEvent(event);
    }

    initializeScripts(wrapper) {
        // Find and execute any scripts in the new content
        const scripts = wrapper.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src) {
                // External script
                const newScript = document.createElement('script');
                newScript.src = script.src;
                document.head.appendChild(newScript);
            } else {
                // Inline script
                eval(script.textContent);
            }
        });
    }

    retryLoad(button) {
        const placeholder = button.closest('.jankx-error');
        if (placeholder) {
            this.loadPlaceholder(placeholder);
        }
    }
}

// Initialize AJAX handler
const jankxAJAX = new JankxAJAXHandler();
```

## 🎨 CSS for Placeholders

### Placeholder Styles
```scss
// assets/css/placeholders.scss
.jankx-placeholder {
    position: relative;
    min-height: 200px;
    background: #f8f9fa;
    border-radius: 8px;
    overflow: hidden;

    .placeholder-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 2rem;
    }

    .placeholder-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e9ecef;
        border-top: 3px solid #007cba;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    .placeholder-text {
        color: #6c757d;
        font-size: 14px;
        text-align: center;
    }
}

.jankx-skeleton-placeholder {
    .skeleton-content {
        padding: 1rem;
    }

    .skeleton-line {
        height: 16px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        margin-bottom: 12px;
        border-radius: 4px;

        &:last-child {
            width: 60%;
        }
    }
}

.jankx-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;

    .loading-spinner {
        width: 32px;
        height: 32px;
        border: 2px solid #e9ecef;
        border-top: 2px solid #007cba;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    .loading-text {
        color: #6c757d;
        font-size: 14px;
    }
}

.jankx-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;

    .error-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
    }

    .error-message {
        color: #dc3545;
        margin-bottom: 1rem;
    }

    .jankx-retry-btn {
        background: #007cba;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;

        &:hover {
            background: #005a87;
        }
    }
}

.jankx-loaded-content {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
```

## 🔒 Security Implementation

### Security Manager
```php
class SecurityManager
{
    public function validateAJAXRequest(): bool
    {
        // Check nonce
        if (!wp_verify_nonce($_POST['nonce'], 'jankx_ajax_nonce')) {
            return false;
        }

        // Check user permissions
        if (!$this->checkUserPermissions()) {
            return false;
        }

        // Rate limiting
        if ($this->isRateLimited()) {
            return false;
        }

        return true;
    }

    private function checkUserPermissions(): bool
    {
        // Check if user can access the content
        $blockName = $_POST['block'] ?? '';

        switch ($blockName) {
            case 'jankx/admin-dashboard':
                return current_user_can('manage_options');
            case 'jankx/user-profile':
                return is_user_logged_in();
            default:
                return true;
        }
    }

    private function isRateLimited(): bool
    {
        $ip = $this->getClientIP();
        $key = "jankx_ajax_rate_limit_{$ip}";
        $limit = 100; // requests per hour
        $window = 3600; // 1 hour

        $requests = get_transient($key) ?: 0;

        if ($requests >= $limit) {
            return true;
        }

        set_transient($key, $requests + 1, $window);
        return false;
    }

    private function getClientIP(): string
    {
        $ipKeys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR'];

        foreach ($ipKeys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                        return $ip;
                    }
                }
            }
        }

        return $_SERVER['REMOTE_ADDR'] ?? '';
    }
}
```

---

**Next**: [Layout System](./layout-system.md) | [Frontend Rendering](./frontend-rendering.md)