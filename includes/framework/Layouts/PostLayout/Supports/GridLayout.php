<?php

namespace Jankx\Layouts\PostLayout\Supports;

use Jankx\Layouts\PostLayout\PostLayout;

/**
 * Grid Layout
 *
 * Hiển thị posts dạng lưới với số cột tùy chỉnh
 *
 * @package Jankx\Layouts\PostLayout\Supports
 */
class GridLayout extends PostLayout
{
    protected $name = 'grid';
    protected $title = 'Grid Layout';

    /**
     * {@inheritDoc}
     */
    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        $columns = $this->getOption('columns', 3);
        $wrapper_class = sprintf('post-type-layout-grid columns-%d', $columns);

        ob_start();
        ?>
        <div class="<?php echo esc_attr($wrapper_class); ?>">
            <?php
            while ($this->query->have_posts()) {
                $this->query->the_post();
                echo $this->renderPostItem();
            }
            wp_reset_postdata();
            ?>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * {@inheritDoc}
     */
    public function renderDefaultPreview(): array
    {
        return [
            'name' => $this->name,
            'title' => $this->title,
            'type' => 'grid',
            'columns' => $this->getOption('columns', 3),
            'supportedOptions' => $this->getSupportedOptions(),
            'previewItems' => $this->generatePreviewItems(),
        ];
    }

    /**
     * Generate preview items for editor
     *
     * @return array
     */
    protected function generatePreviewItems(): array
    {
        $count = min($this->getOption('postsPerPage', 6), 6);
        $items = [];

        for ($i = 0; $i < $count; $i++) {
            $items[] = [
                'id' => $i + 1,
                'title' => sprintf(__('Post Title %d', 'jankx'), $i + 1),
                'excerpt' => __('Lorem ipsum dolor sit amet, consectetur adipiscing elit...', 'jankx'),
                'date' => date('Y-m-d'),
                'author' => 'Admin',
                'thumbnail' => true,
            ];
        }

        return $items;
    }

    /**
     * {@inheritDoc}
     */
    public function getSupportedOptions(): array
    {
        return [
            'columns',
            'postsPerPage',
            'showFeaturedImage',
            'showTitle',
            'showExcerpt',
            'showDate',
            'showAuthor',
            'excerptLength',
            'thumbnailPosition',
            'itemStyle',
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getReadOnlyOptions(): array
    {
        return [
            'showTitle', // Grid layout cần title để có ý nghĩa
        ];
    }

    /**
     * {@inheritDoc}
     */
    protected function getContainerStructure(array $options): array
    {
        $classes = [
            'post-type-layout-grid',
            'wp-block-jankx-post-layout-template',
            'is-flex-container',
        ];
        
        $columns = intval($options['columns'] ?? $this->getOption('columns', 3));
        $columnsTablet = intval($options['columnsTablet'] ?? $this->getOption('columnsTablet', 2));
        $columnsMobile = intval($options['columnsMobile'] ?? $this->getOption('columnsMobile', 1));

        $classes[] = 'columns-' . $columns;
        $classes[] = 'columns-tablet-' . $columnsTablet;
        $classes[] = 'columns-mobile-' . $columnsMobile;

        $styles = [
            '--columns-desktop' => (string) $columns,
            '--columns-tablet' => (string) $columnsTablet,
            '--columns-mobile' => (string) $columnsMobile,
        ];

        return [
            'tag' => 'ul', // Grid layout uses <ul> as container
            'classes' => $classes,
            'styles' => $styles,
            'attributes' => [
                'data-layout' => $this->name,
            ],
        ];
    }

    /**
     * {@inheritDoc}
     */
    protected function getItemWrapperStructure(array $options): array
    {
        // Grid layout uses <li> for items
        $structure = parent::getItemWrapperStructure($options);
        $structure['tag'] = 'li';
        return $structure;
    }

    public function wrapTemplateHtml(string $html, array $options = []): string
    {
        // Merge options với layout options để đảm bảo có đầy đủ columns
        $mergedOptions = array_merge($this->options, $options);
        
        $columns = (int)($mergedOptions['columns'] ?? $this->getOption('columns', 3));
        $columnsTablet = (int)($mergedOptions['columnsTablet'] ?? $this->getOption('columnsTablet', 2));
        $columnsMobile = (int)($mergedOptions['columnsMobile'] ?? $this->getOption('columnsMobile', 1));

        $columns = max(1, $columns);
        $columnsTablet = max(1, $columnsTablet);
        $columnsMobile = max(1, $columnsMobile);
        
        // Debug log để kiểm tra
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log(sprintf(
                'GridLayout::wrapTemplateHtml - columns: %d, tablet: %d, mobile: %d, options: %s',
                $columns,
                $columnsTablet,
                $columnsMobile,
                json_encode($mergedOptions)
            ));
        }

        $dom = new \DOMDocument('1.0', 'UTF-8');
        libxml_use_internal_errors(true);
        $dom->loadHTML('<?xml encoding="utf-8" ?><div>' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();

        $ul = $dom->getElementsByTagName('ul')->item(0);

        $classList = [
            'post-type-layout-grid',
            'wp-block-jankx-post-layout-template',
            'is-flex-container',
            'columns-' . $columns,
            'columns-tablet-' . $columnsTablet,
            'columns-mobile-' . $columnsMobile,
        ];

        if ($ul) {
            $existing = $ul->getAttribute('class');
            $classList = array_unique(array_filter(array_merge(
                preg_split('/\s+/', $existing) ?: [],
                $classList
            )));
            $ul->setAttribute('class', implode(' ', $classList));

            $existingStyle = $ul->getAttribute('style');
            $styleParts = array_filter(array_map('trim', explode(';', $existingStyle)));
            $styleParts[] = '--columns-desktop: ' . $columns;
            $styleParts[] = '--columns-tablet: ' . $columnsTablet;
            $styleParts[] = '--columns-mobile: ' . $columnsMobile;
            $ul->setAttribute('style', implode('; ', array_unique($styleParts)));
        }

        $innerHTML = '';
        foreach ($dom->documentElement->childNodes as $child) {
            $innerHTML .= $dom->saveHTML($child);
        }

        return $innerHTML;
    }
}