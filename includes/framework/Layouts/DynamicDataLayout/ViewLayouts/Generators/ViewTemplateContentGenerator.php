<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts\Generators;

use Jankx\Layouts\DynamicDataLayout\ViewLayouts\AbstractViewContentGenerator;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewLayoutInterface;
use WP_Query;

class ViewTemplateContentGenerator extends AbstractViewContentGenerator
{
    protected $templatePath;
    protected $options;

    public function __construct(string $templatePath, array $options = [])
    {
        $this->templatePath = $templatePath;
        $this->options = $options;
    }

    public function getName(): string
    {
        return 'view-template-content-generator';
    }

    public function getTitle(): string
    {
        return 'View Template Content Generator';
    }

    protected function renderContent(WP_Query $query, array $options = []): string
    {
        if (!$query->have_posts()) {
            return '';
        }

        $mergedOptions = array_merge($this->options, $options);
        $layout = $this->getLayout();

        ob_start();
        ?>
        <div class="wp-block-jankx-view-template-content">
            <?php
            while ($query->have_posts()) {
                $query->the_post();
                $this->renderTemplate($mergedOptions);
            }
            wp_reset_postdata();
            ?>
        </div>
        <?php
        return (string) ob_get_clean();
    }

    protected function renderTemplate(array $options): void
    {
        // Try to locate and render template file
        $templatePaths = [
            get_stylesheet_directory() . '/views/view-templates/' . $this->templatePath . '.php',
            get_template_directory() . '/includes/framework/Layouts/ViewLayouts/templates/' . $this->templatePath . '.php',
        ];

        foreach ($templatePaths as $templatePath) {
            if (file_exists($templatePath)) {
                load_template($templatePath, false, $options);
                return;
            }
        }

        // Fallback rendering
        $this->renderFallback($options);
    }

    protected function renderFallback(array $options): void
    {
        $showTitle = $options['showTitle'] ?? true;
        $showExcerpt = $options['showExcerpt'] ?? true;
        $showDate = $options['showDate'] ?? true;

        if ($showTitle) {
            printf('<h3 class="view-item-title">%s</h3>', esc_html(get_the_title()));
        }

        if ($showDate) {
            printf('<time class="view-item-date" datetime="%s">%s</time>', 
                esc_attr(get_the_date('c')), 
                esc_html(get_the_date())
            );
        }

        if ($showExcerpt) {
            printf('<div class="view-item-excerpt">%s</div>', esc_html(get_the_excerpt()));
        }
    }

    protected function renderPreview(array $options = []): array
    {
        $mergedOptions = array_merge($this->options, $options);

        return [
            'name' => $this->getName(),
            'title' => $this->getTitle(),
            'templatePath' => $this->templatePath,
            'options' => $mergedOptions,
            'preview' => $this->generatePreviewContent($mergedOptions),
        ];
    }

    protected function generatePreviewContent(array $options): string
    {
        ob_start();
        ?>
        <div class="wp-block-jankx-view-template-preview">
            <h3 class="view-item-title">Sample Title</h3>
            <time class="view-item-date" datetime="2024-01-01">January 1, 2024</time>
            <div class="view-item-excerpt">Sample excerpt content for preview...</div>
        </div>
        <?php
        return (string) ob_get_clean();
    }
}
