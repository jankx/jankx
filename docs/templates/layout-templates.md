# Layout Templates Documentation

## Overview

Layout templates trong Jankx 2.0 được sử dụng để tạo các layout phức tạp với multiple components và dynamic content. Templates này cung cấp structure và styling cho các section lớn của website.

## Hero Section Layout

### File Location
`templates/layouts/hero-section.html`

### Template Structure

```php
<?php
/**
 * Hero Section Template
 *
 * Template for rendering hero section layouts.
 * Variables available: $title, $description, $buttonText, $buttonUrl, $backgroundImage, $overlay
 */
?>

<div class="jankx-hero-section">
    <!-- Background Image -->
    <?php if (!empty($backgroundImage)): ?>
        <div class="jankx-hero-background">
            <img src="<?php echo esc_url($backgroundImage); ?>" alt="" class="jankx-hero-bg-image">
            <?php if ($overlay): ?>
                <div class="jankx-hero-overlay"></div>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <!-- Hero Content -->
    <div class="jankx-hero-content">
        <div class="jankx-hero-container">
            <?php if (!empty($title)): ?>
                <h1 class="jankx-hero-title"><?php echo esc_html($title); ?></h1>
            <?php endif; ?>

            <?php if (!empty($description)): ?>
                <p class="jankx-hero-description"><?php echo esc_html($description); ?></p>
            <?php endif; ?>

            <?php if (!empty($buttonText)): ?>
                <div class="jankx-hero-actions">
                    <a href="<?php echo esc_url($buttonUrl ?? '#'); ?>" class="jankx-hero-button">
                        <?php echo esc_html($buttonText); ?>
                    </a>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>
```

### Variables Documentation

| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `$title` | string | Hero title text | Empty |
| `$description` | string | Hero description text | Empty |
| `$buttonText` | string | Call-to-action button text | Empty |
| `$buttonUrl` | string | Button link URL | `#` |
| `$backgroundImage` | string | Background image URL | Empty |
| `$overlay` | boolean | Show overlay on background | `false` |

### Features

#### 1. Background Image Support
```php
<?php if (!empty($backgroundImage)): ?>
    <div class="jankx-hero-background">
        <img src="<?php echo esc_url($backgroundImage); ?>" alt="" class="jankx-hero-bg-image">
        <?php if ($overlay): ?>
            <div class="jankx-hero-overlay"></div>
        <?php endif; ?>
    </div>
<?php endif; ?>
```

**CSS Classes:**
- `.jankx-hero-background`: Background container
- `.jankx-hero-bg-image`: Background image styling
- `.jankx-hero-overlay`: Overlay styling

#### 2. Content Structure
```php
<div class="jankx-hero-content">
    <div class="jankx-hero-container">
        <!-- Title, description, and button -->
    </div>
</div>
```

#### 3. Call-to-Action Button
```php
<?php if (!empty($buttonText)): ?>
    <div class="jankx-hero-actions">
        <a href="<?php echo esc_url($buttonUrl ?? '#'); ?>" class="jankx-hero-button">
            <?php echo esc_html($buttonText); ?>
        </a>
    </div>
<?php endif; ?>
```

### Styling Options

#### 1. Responsive Design
```css
.jankx-hero-section {
    position: relative;
    min-height: 60vh;
    display: flex;
    align-items: center;
}

@media (max-width: 768px) {
    .jankx-hero-section {
        min-height: 40vh;
    }
}
```

#### 2. Background Image
```css
.jankx-hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.jankx-hero-bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

#### 3. Overlay
```css
.jankx-hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2;
}
```

## Contact Form Layout

### File Location
`templates/layouts/contact-form.html`

### Template Structure

```php
<?php
/**
 * Contact Form Template
 *
 * Template for rendering contact form layouts.
 * Variables available: $title, $description, $email, $phone, $address, $successMessage
 */
?>

<div class="jankx-contact-form">
    <!-- Form Header -->
    <?php if (!empty($title)): ?>
        <div class="jankx-contact-form-header">
            <h2 class="jankx-contact-form-title"><?php echo esc_html($title); ?></h2>

            <?php if (!empty($description)): ?>
                <p class="jankx-contact-form-description"><?php echo esc_html($description); ?></p>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <!-- Form Content -->
    <div class="jankx-contact-form-content">
        <form class="jankx-contact-form-form" method="post" action="">
            <?php wp_nonce_field('jankx_contact_form', 'jankx_contact_nonce'); ?>

            <div class="jankx-contact-form-fields">
                <!-- Name and Email Row -->
                <div class="jankx-form-row">
                    <div class="jankx-form-field">
                        <label for="jankx_contact_name" class="jankx-form-label"><?php _e('Name', 'jankx'); ?> *</label>
                        <input type="text" id="jankx_contact_name" name="jankx_contact_name" class="jankx-form-input" required>
                    </div>

                    <div class="jankx-form-field">
                        <label for="jankx_contact_email" class="jankx-form-label"><?php _e('Email', 'jankx'); ?> *</label>
                        <input type="email" id="jankx_contact_email" name="jankx_contact_email" class="jankx-form-input" required>
                    </div>
                </div>

                <!-- Subject and Phone Row -->
                <div class="jankx-form-row">
                    <div class="jankx-form-field">
                        <label for="jankx_contact_subject" class="jankx-form-label"><?php _e('Subject', 'jankx'); ?> *</label>
                        <input type="text" id="jankx_contact_subject" name="jankx_contact_subject" class="jankx-form-input" required>
                    </div>

                    <div class="jankx-form-field">
                        <label for="jankx_contact_phone" class="jankx-form-label"><?php _e('Phone', 'jankx'); ?></label>
                        <input type="tel" id="jankx_contact_phone" name="jankx_contact_phone" class="jankx-form-input">
                    </div>
                </div>

                <!-- Message Field -->
                <div class="jankx-form-field">
                    <label for="jankx_contact_message" class="jankx-form-label"><?php _e('Message', 'jankx'); ?> *</label>
                    <textarea id="jankx_contact_message" name="jankx_contact_message" class="jankx-form-textarea" rows="5" required></textarea>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="jankx-contact-form-submit">
                <button type="submit" class="jankx-form-submit">
                    <?php _e('Send Message', 'jankx'); ?>
                </button>
            </div>
        </form>

        <!-- Contact Information -->
        <?php if (!empty($email) || !empty($phone) || !empty($address)): ?>
            <div class="jankx-contact-info">
                <h3 class="jankx-contact-info-title"><?php _e('Contact Information', 'jankx'); ?></h3>

                <div class="jankx-contact-info-items">
                    <?php if (!empty($email)): ?>
                        <div class="jankx-contact-info-item">
                            <i class="jankx-contact-icon jankx-icon-email"></i>
                            <span class="jankx-contact-info-text">
                                <a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a>
                            </span>
                        </div>
                    <?php endif; ?>

                    <?php if (!empty($phone)): ?>
                        <div class="jankx-contact-info-item">
                            <i class="jankx-contact-icon jankx-icon-phone"></i>
                            <span class="jankx-contact-info-text">
                                <a href="tel:<?php echo esc_attr($phone); ?>"><?php echo esc_html($phone); ?></a>
                            </span>
                        </div>
                    <?php endif; ?>

                    <?php if (!empty($address)): ?>
                        <div class="jankx-contact-info-item">
                            <i class="jankx-contact-icon jankx-icon-location"></i>
                            <span class="jankx-contact-info-text"><?php echo esc_html($address); ?></span>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>
```

### Variables Documentation

| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `$title` | string | Form title | Empty |
| `$description` | string | Form description | Empty |
| `$email` | string | Contact email | Empty |
| `$phone` | string | Contact phone | Empty |
| `$address` | string | Contact address | Empty |
| `$successMessage` | string | Success message | Empty |

### Features

#### 1. Form Validation
```php
<input type="email" id="jankx_contact_email" name="jankx_contact_email" class="jankx-form-input" required>
```

#### 2. Security with Nonce
```php
<?php wp_nonce_field('jankx_contact_form', 'jankx_contact_nonce'); ?>
```

#### 3. Contact Information Display
```php
<?php if (!empty($email)): ?>
    <div class="jankx-contact-info-item">
        <i class="jankx-contact-icon jankx-icon-email"></i>
        <span class="jankx-contact-info-text">
            <a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a>
        </span>
    </div>
<?php endif; ?>
```

## Feature Grid Layout

### File Location
`templates/layouts/feature-grid.html`

### Template Structure

```php
<?php
/**
 * Feature Grid Template
 *
 * Template for rendering feature grid layouts.
 * Variables available: $title, $description, $columns, $features
 */
?>

<div class="jankx-feature-grid">
    <!-- Grid Header -->
    <?php if (!empty($title)): ?>
        <div class="jankx-feature-grid-header">
            <h2 class="jankx-feature-grid-title"><?php echo esc_html($title); ?></h2>

            <?php if (!empty($description)): ?>
                <p class="jankx-feature-grid-description"><?php echo esc_html($description); ?></p>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <!-- Grid Content -->
    <?php if (!empty($features) && is_array($features)): ?>
        <div class="jankx-feature-grid-content">
            <div class="jankx-feature-grid-items" style="grid-template-columns: repeat(<?php echo esc_attr($columns ?? 3); ?>, 1fr);">
                <?php foreach ($features as $feature): ?>
                    <div class="jankx-feature-item">
                        <?php if (!empty($feature['icon'])): ?>
                            <div class="jankx-feature-icon">
                                <i class="<?php echo esc_attr($feature['icon']); ?>"></i>
                            </div>
                        <?php endif; ?>

                        <?php if (!empty($feature['title'])): ?>
                            <h3 class="jankx-feature-title"><?php echo esc_html($feature['title']); ?></h3>
                        <?php endif; ?>

                        <?php if (!empty($feature['description'])): ?>
                            <p class="jankx-feature-description"><?php echo esc_html($feature['description']); ?></p>
                        <?php endif; ?>

                        <?php if (!empty($feature['link'])): ?>
                            <a href="<?php echo esc_url($feature['link']); ?>" class="jankx-feature-link">
                                <?php echo esc_html($feature['linkText'] ?? 'Learn More'); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    <?php else: ?>
        <div class="jankx-feature-grid-placeholder">
            <p><?php _e('No features added yet. Add features using the block editor.', 'jankx'); ?></p>
        </div>
    <?php endif; ?>
</div>
```

### Variables Documentation

| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `$title` | string | Grid title | Empty |
| `$description` | string | Grid description | Empty |
| `$columns` | integer | Number of columns | 3 |
| `$features` | array | Array of feature objects | Empty |

### Feature Object Structure

```php
$feature = [
    'icon' => 'fas fa-star',           // Icon class
    'title' => 'Feature Title',         // Feature title
    'description' => 'Description',     // Feature description
    'link' => 'https://example.com',   // Feature link
    'linkText' => 'Learn More'         // Link text
];
```

## Testimonial Layout

### File Location
`templates/layouts/testimonial.html`

### Template Structure

```php
<?php
/**
 * Testimonial Template
 *
 * Template for rendering testimonial layouts.
 * Variables available: $quote, $author, $position, $company, $avatar, $rating
 */
?>

<div class="jankx-testimonial">
    <div class="jankx-testimonial-content">
        <!-- Quote -->
        <?php if (!empty($quote)): ?>
            <blockquote class="jankx-testimonial-quote">
                <p><?php echo esc_html($quote); ?></p>
            </blockquote>
        <?php endif; ?>

        <!-- Author Information -->
        <div class="jankx-testimonial-author">
            <?php if (!empty($avatar)): ?>
                <div class="jankx-testimonial-avatar">
                    <img src="<?php echo esc_url($avatar); ?>" alt="<?php echo esc_attr($author); ?>" class="jankx-testimonial-avatar-img">
                </div>
            <?php endif; ?>

            <div class="jankx-testimonial-author-info">
                <?php if (!empty($author)): ?>
                    <strong class="jankx-testimonial-author-name"><?php echo esc_html($author); ?></strong>
                <?php endif; ?>

                <?php if (!empty($position) || !empty($company)): ?>
                    <span class="jankx-testimonial-author-meta">
                        <?php if (!empty($position)): ?>
                            <span class="jankx-testimonial-position"><?php echo esc_html($position); ?></span>
                        <?php endif; ?>

                        <?php if (!empty($position) && !empty($company)): ?>
                            <span class="jankx-testimonial-separator"> at </span>
                        <?php endif; ?>

                        <?php if (!empty($company)): ?>
                            <span class="jankx-testimonial-company"><?php echo esc_html($company); ?></span>
                        <?php endif; ?>
                    </span>
                <?php endif; ?>
            </div>
        </div>

        <!-- Rating -->
        <?php if (!empty($rating) && $rating > 0): ?>
            <div class="jankx-testimonial-rating">
                <?php for ($i = 1; $i <= 5; $i++): ?>
                    <span class="jankx-testimonial-star <?php echo $i <= $rating ? 'filled' : 'empty'; ?>">
                        ★
                    </span>
                <?php endfor; ?>
            </div>
        <?php endif; ?>
    </div>
</div>
```

### Variables Documentation

| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `$quote` | string | Testimonial quote | Empty |
| `$author` | string | Author name | Empty |
| `$position` | string | Author position | Empty |
| `$company` | string | Author company | Empty |
| `$avatar` | string | Author avatar URL | Empty |
| `$rating` | integer | Star rating (1-5) | 0 |

## Layout Block Templates

### Hero Title Block

**File:** `templates/layouts/blocks/hero-title.html`

```php
<?php
/**
 * Hero Title Block Template
 *
 * Template for rendering hero title blocks.
 * Variables available: $title, $fontSize, $textColor, $alignment
 */
?>

<?php if (!empty($title)): ?>
    <h1 class="jankx-hero-title jankx-font-size-<?php echo esc_attr($fontSize ?? 'large'); ?> jankx-text-<?php echo esc_attr($alignment ?? 'left'); ?>" <?php if (!empty($textColor)): ?>style="color: <?php echo esc_attr($textColor); ?>;"<?php endif; ?>>
        <?php echo esc_html($title); ?>
    </h1>
<?php endif; ?>
```

### Hero Description Block

**File:** `templates/layouts/blocks/hero-description.html`

```php
<?php
/**
 * Hero Description Block Template
 *
 * Template for rendering hero description blocks.
 * Variables available: $description, $fontSize, $textColor, $alignment
 */
?>

<?php if (!empty($description)): ?>
    <p class="jankx-hero-description jankx-font-size-<?php echo esc_attr($fontSize ?? 'medium'); ?> jankx-text-<?php echo esc_attr($alignment ?? 'left'); ?>" <?php if (!empty($textColor)): ?>style="color: <?php echo esc_attr($textColor); ?>;"<?php endif; ?>>
        <?php echo esc_html($description); ?>
    </p>
<?php endif; ?>
```

### Hero Button Block

**File:** `templates/layouts/blocks/hero-button.html`

```php
<?php
/**
 * Hero Button Block Template
 *
 * Template for rendering hero button blocks.
 * Variables available: $buttonText, $buttonUrl, $alignment
 */
?>

<?php if (!empty($buttonText)): ?>
    <div class="jankx-hero-actions jankx-text-<?php echo esc_attr($alignment ?? 'left'); ?>">
        <a href="<?php echo esc_url($buttonUrl ?? '#'); ?>" class="jankx-hero-button jankx-btn jankx-btn-primary">
            <?php echo esc_html($buttonText); ?>
        </a>
    </div>
<?php endif; ?>
```

## Customization Examples

### 1. Custom Hero Section

```php
// Custom hero section with additional features
$variables = [
    'title' => 'Welcome to Our Site',
    'description' => 'Discover amazing features and services.',
    'buttonText' => 'Get Started',
    'buttonUrl' => '/get-started',
    'backgroundImage' => '/images/hero-bg.jpg',
    'overlay' => true,
    'customClass' => 'custom-hero-section'
];
```

### 2. Custom Contact Form

```php
// Contact form with custom fields
$variables = [
    'title' => 'Contact Us',
    'description' => 'Get in touch with our team.',
    'email' => 'contact@example.com',
    'phone' => '+1 (555) 123-4567',
    'address' => '123 Main St, City, State 12345',
    'customFields' => [
        'department' => 'Select Department',
        'priority' => 'Priority Level'
    ]
];
```

### 3. Custom Feature Grid

```php
// Feature grid with custom styling
$variables = [
    'title' => 'Our Features',
    'description' => 'Discover what makes us special.',
    'columns' => 4,
    'features' => [
        [
            'icon' => 'fas fa-rocket',
            'title' => 'Fast Performance',
            'description' => 'Lightning-fast loading times.',
            'link' => '/performance',
            'linkText' => 'Learn More'
        ],
        // More features...
    ]
];
```

## Next Steps

1. **Create additional layout templates** for specific use cases
2. **Add more customization options** to existing templates
3. **Implement responsive design** improvements
4. **Add accessibility features** to all templates
5. **Create template testing** framework