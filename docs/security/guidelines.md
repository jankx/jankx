# Security Guidelines

> **Security by Design for WordPress Themes**

Jankx 2.0 được xây dựng với security-first approach, tích hợp sâu các biện pháp bảo mật vào kiến trúc core.

## 🛡️ Security Principles

### Defense in Depth
- **Input Validation**: Validate all user inputs
- **Output Escaping**: Escape all outputs
- **Access Control**: Implement proper permissions
- **Data Sanitization**: Sanitize all data
- **Nonce Verification**: Verify request authenticity
- **CSRF Protection**: Prevent cross-site request forgery

### Security Layers
```
┌─────────────────────────────────────┐
│           Application Layer         │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Input     │  │   Output    │  │
│  │ Validation  │  │  Escaping   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           Framework Layer           │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Nonce     │  │   Capability│  │
│  │ Verification│  │    Checks   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           WordPress Layer           │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Hooks     │  │   Filters   │  │
│  │   Security  │  │   Security  │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

## 🔒 Input Security

### Input Validation
```php
class InputValidator
{
    public function validateEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public function validateUrl(string $url): bool
    {
        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }

    public function validateInteger(int $value, int $min = null, int $max = null): bool
    {
        if ($min !== null && $value < $min) {
            return false;
        }

        if ($max !== null && $value > $max) {
            return false;
        }

        return is_int($value);
    }

    public function validateString(string $value, int $minLength = 0, int $maxLength = null): bool
    {
        $length = strlen($value);

        if ($length < $minLength) {
            return false;
        }

        if ($maxLength !== null && $length > $maxLength) {
            return false;
        }

        return true;
    }

    public function validateArray(array $data, array $required = [], array $optional = []): bool
    {
        // Check required fields
        foreach ($required as $field) {
            if (!isset($data[$field])) {
                return false;
            }
        }

        // Check for unexpected fields
        $allowedFields = array_merge($required, $optional);
        foreach ($data as $field => $value) {
            if (!in_array($field, $allowedFields)) {
                return false;
            }
        }

        return true;
    }
}
```

### Input Sanitization
```php
class InputSanitizer
{
    public function sanitizeText(string $text): string
    {
        return sanitize_text_field($text);
    }

    public function sanitizeEmail(string $email): string
    {
        return sanitize_email($email);
    }

    public function sanitizeUrl(string $url): string
    {
        return esc_url_raw($url);
    }

    public function sanitizeHtml(string $html): string
    {
        return wp_kses_post($html);
    }

    public function sanitizeArray(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $sanitized[$key] = $this->sanitizeText($value);
            } elseif (is_array($value)) {
                $sanitized[$key] = $this->sanitizeArray($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }

    public function sanitizeFile(array $file): array
    {
        return [
            'name' => sanitize_file_name($file['name']),
            'type' => sanitize_mime_type($file['type']),
            'tmp_name' => $file['tmp_name'],
            'error' => (int) $file['error'],
            'size' => (int) $file['size']
        ];
    }
}
```

## 🛡️ Output Security

### Output Escaping
```php
class OutputEscaper
{
    public function escapeHtml(string $text): string
    {
        return esc_html($text);
    }

    public function escapeAttr(string $text): string
    {
        return esc_attr($text);
    }

    public function escapeUrl(string $url): string
    {
        return esc_url($url);
    }

    public function escapeJs(string $text): string
    {
        return esc_js($text);
    }

    public function escapeCss(string $text): string
    {
        return esc_css($text);
    }

    public function escapeHtmlComment(string $text): string
    {
        return esc_html__($text, 'jankx');
    }

    public function escapeTemplate(array $data): array
    {
        $escaped = [];

        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $escaped[$key] = $this->escapeHtml($value);
            } elseif (is_array($value)) {
                $escaped[$key] = $this->escapeTemplate($value);
            } else {
                $escaped[$key] = $value;
            }
        }

        return $escaped;
    }
}
```

### Template Security
```php
class SecureTemplateRenderer
{
    private $escaper;

    public function __construct(OutputEscaper $escaper)
    {
        $this->escaper = $escaper;
    }

    public function render(string $template, array $data): string
    {
        // Escape all data before rendering
        $escapedData = $this->escaper->escapeTemplate($data);

        return $this->renderTemplate($template, $escapedData);
    }

    private function renderTemplate(string $template, array $data): string
    {
        // Use secure template engine
        $engine = new SecureTemplateEngine();
        return $engine->render($template, $data);
    }
}
```

## 🔐 Authentication & Authorization

### Nonce Verification
```php
class NonceManager
{
    public function createNonce(string $action): string
    {
        return wp_create_nonce($action);
    }

    public function verifyNonce(string $nonce, string $action): bool
    {
        return wp_verify_nonce($nonce, $action);
    }

    public function createNonceField(string $action, string $name = '_wpnonce'): string
    {
        return wp_nonce_field($action, $name, true, false);
    }

    public function createNonceUrl(string $url, string $action): string
    {
        return wp_nonce_url($url, $action);
    }
}
```

### Capability Checks
```php
class CapabilityChecker
{
    public function canEditPosts(): bool
    {
        return current_user_can('edit_posts');
    }

    public function canEditPages(): bool
    {
        return current_user_can('edit_pages');
    }

    public function canManageOptions(): bool
    {
        return current_user_can('manage_options');
    }

    public function canUploadFiles(): bool
    {
        return current_user_can('upload_files');
    }

    public function canEditPost(int $postId): bool
    {
        return current_user_can('edit_post', $postId);
    }

    public function canDeletePost(int $postId): bool
    {
        return current_user_can('delete_post', $postId);
    }

    public function requireCapability(string $capability): void
    {
        if (!current_user_can($capability)) {
            wp_die(__('You do not have sufficient permissions to access this page.', 'jankx'));
        }
    }
}
```

## 🚫 CSRF Protection

### CSRF Token Management
```php
class CSRFProtector
{
    private $nonceManager;

    public function __construct(NonceManager $nonceManager)
    {
        $this->nonceManager = $nonceManager;
    }

    public function generateToken(string $action): string
    {
        return $this->nonceManager->createNonce($action);
    }

    public function verifyToken(string $token, string $action): bool
    {
        return $this->nonceManager->verifyNonce($token, $action);
    }

    public function validateRequest(string $action): bool
    {
        $nonce = $_POST['_wpnonce'] ?? $_GET['_wpnonce'] ?? '';
        return $this->verifyToken($nonce, $action);
    }

    public function requireValidToken(string $action): void
    {
        if (!$this->validateRequest($action)) {
            wp_die(__('Security check failed.', 'jankx'));
        }
    }
}
```

### Form Security
```php
class SecureFormHandler
{
    private $csrfProtector;
    private $validator;
    private $sanitizer;

    public function __construct(CSRFProtector $csrfProtector, InputValidator $validator, InputSanitizer $sanitizer)
    {
        $this->csrfProtector = $csrfProtector;
        $this->validator = $validator;
        $this->sanitizer = $sanitizer;
    }

    public function handleFormSubmission(string $action, array $rules): array
    {
        // Verify CSRF token
        $this->csrfProtector->requireValidToken($action);

        // Validate input
        if (!$this->validator->validateArray($_POST, $rules['required'], $rules['optional'])) {
            throw new ValidationException('Invalid form data');
        }

        // Sanitize input
        $sanitizedData = $this->sanitizer->sanitizeArray($_POST);

        return $sanitizedData;
    }

    public function renderForm(string $action, array $fields): string
    {
        $nonceField = $this->csrfProtector->generateToken($action);

        $html = '<form method="post" action="">';
        $html .= wp_nonce_field($action, '_wpnonce', true, false);

        foreach ($fields as $field) {
            $html .= $this->renderField($field);
        }

        $html .= '<input type="submit" value="Submit">';
        $html .= '</form>';

        return $html;
    }
}
```

## 🛡️ XSS Prevention

### XSS Protection
```php
class XSSProtector
{
    public function preventXSS(string $input): string
    {
        // Remove script tags
        $input = preg_replace('/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/mi', '', $input);

        // Remove event handlers
        $input = preg_replace('/on\w+\s*=/i', '', $input);

        // Remove javascript: URLs
        $input = preg_replace('/javascript:/i', '', $input);

        // Remove data: URLs
        $input = preg_replace('/data:/i', '', $input);

        return $input;
    }

    public function sanitizeUserContent(string $content): string
    {
        // Use WordPress kses for HTML content
        $allowedTags = [
            'p' => [],
            'br' => [],
            'strong' => [],
            'em' => [],
            'a' => ['href' => [], 'title' => []],
            'img' => ['src' => [], 'alt' => [], 'title' => []]
        ];

        return wp_kses($content, $allowedTags);
    }

    public function validateImageUrl(string $url): bool
    {
        // Check if URL is safe
        $parsed = parse_url($url);

        if (!$parsed || !isset($parsed['scheme'])) {
            return false;
        }

        // Only allow http and https
        if (!in_array($parsed['scheme'], ['http', 'https'])) {
            return false;
        }

        // Check for suspicious patterns
        $suspiciousPatterns = [
            'javascript:',
            'data:',
            'vbscript:',
            'onload=',
            'onerror='
        ];

        foreach ($suspiciousPatterns as $pattern) {
            if (stripos($url, $pattern) !== false) {
                return false;
            }
        }

        return true;
    }
}
```

## 🔒 File Upload Security

### File Upload Validation
```php
class SecureFileUploader
{
    private $allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    private $maxFileSize = 5242880; // 5MB

    public function validateUpload(array $file): bool
    {
        // Check file size
        if ($file['size'] > $this->maxFileSize) {
            return false;
        }

        // Check file type
        if (!in_array($file['type'], $this->allowedTypes)) {
            return false;
        }

        // Check file extension
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        if (!in_array($extension, $allowedExtensions)) {
            return false;
        }

        // Check for malicious content
        if ($this->containsMaliciousContent($file['tmp_name'])) {
            return false;
        }

        return true;
    }

    private function containsMaliciousContent(string $filePath): bool
    {
        $content = file_get_contents($filePath);

        // Check for PHP tags
        if (strpos($content, '<?php') !== false) {
            return true;
        }

        // Check for script tags
        if (preg_match('/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/mi', $content)) {
            return true;
        }

        return false;
    }

    public function secureUpload(array $file): string
    {
        if (!$this->validateUpload($file)) {
            throw new SecurityException('Invalid file upload');
        }

        // Generate secure filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '.' . $extension;

        // Move to secure location
        $uploadDir = wp_upload_dir();
        $destination = $uploadDir['basedir'] . '/secure/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new SecurityException('Failed to upload file');
        }

        return $uploadDir['baseurl'] . '/secure/' . $filename;
    }
}
```

## 🔍 Security Monitoring

### Security Logger
```php
class SecurityLogger
{
    public function logSecurityEvent(string $event, array $data = []): void
    {
        $logEntry = [
            'timestamp' => current_time('mysql'),
            'event' => $event,
            'ip' => $this->getClientIP(),
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'user_id' => get_current_user_id(),
            'data' => $data
        ];

        error_log('SECURITY: ' . json_encode($logEntry));
    }

    public function logFailedLogin(string $username): void
    {
        $this->logSecurityEvent('failed_login', ['username' => $username]);
    }

    public function logXSSAttempt(string $input): void
    {
        $this->logSecurityEvent('xss_attempt', ['input' => $input]);
    }

    public function logCSRFAttempt(string $action): void
    {
        $this->logSecurityEvent('csrf_attempt', ['action' => $action]);
    }

    public function logFileUploadAttempt(array $file): void
    {
        $this->logSecurityEvent('file_upload_attempt', [
            'filename' => $file['name'],
            'type' => $file['type'],
            'size' => $file['size']
        ]);
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

## 🛠 Security Configuration

### Security Headers
```php
class SecurityHeaders
{
    public function setSecurityHeaders(): void
    {
        // Content Security Policy
        header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;");

        // X-Frame-Options
        header("X-Frame-Options: SAMEORIGIN");

        // X-Content-Type-Options
        header("X-Content-Type-Options: nosniff");

        // X-XSS-Protection
        header("X-XSS-Protection: 1; mode=block");

        // Referrer Policy
        header("Referrer-Policy: strict-origin-when-cross-origin");

        // Permissions Policy
        header("Permissions-Policy: geolocation=(), microphone=(), camera=()");
    }
}
```

### Security Constants
```php
// Define security constants
define('JANKX_SECURITY_NONCE_ACTION', 'jankx_security_nonce');
define('JANKX_SECURITY_MAX_LOGIN_ATTEMPTS', 5);
define('JANKX_SECURITY_LOCKOUT_DURATION', 900); // 15 minutes
define('JANKX_SECURITY_SESSION_TIMEOUT', 3600); // 1 hour
define('JANKX_SECURITY_PASSWORD_MIN_LENGTH', 8);
define('JANKX_SECURITY_FILE_MAX_SIZE', 5242880); // 5MB
```

---

**Next**: [XSS Prevention](./xss-prevention.md) | [SVG Sanitization](./svg-sanitization.md) | [Nonce Verification](./nonce-verification.md)