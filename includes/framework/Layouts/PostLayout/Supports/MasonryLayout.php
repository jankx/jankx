<?php

namespace Jankx\Layouts\PostLayout\Supports;

use Jankx\Layouts\PostLayout\PostLayout;

/**
 * Masonry Layout
 *
 * Hiển thị posts dạng masonry (Pinterest style)
 *
 * @package Jankx\Layouts\PostLayout\Supports
 */
class MasonryLayout extends PostLayout
{
    protected $name = 'masonry';
    protected $title = 'Masonry Layout';

    /**
     * {@inheritDoc}
     */
    public function renderDefault(): string
    {
        if (!$this->query || !$this->query->have_posts()) {
            return '';
        }

        $columns = $this->getOption('columns', 3);
        $wrapper_class = sprintf('post-type-layout-masonry columns-%d', $columns);

        ob_start();
        ?>
        <div class="<?php echo esc_attr($wrapper_class); ?>" data-masonry='{"percentPosition": true}'>
            <?php
            while ($this->query->have_posts()) {
                $this->query->the_post();
                echo '<div class="masonry-item">';
                echo $this->renderPostItem();
                echo '</div>';
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
            'type' => 'masonry',
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
                'excerpt' => __('Lorem ipsum dolor sit amet...', 'jankx'),
                'date' => date('Y-m-d'),
                'author' => 'Admin',
                'thumbnail' => true,
                'height' => rand(200, 400), // Random height for masonry effect
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
            'showTitle', // Masonry layout cần title để có ý nghĩa
        ];
    }

    public function wrapTemplateHtml(string $html, array $options = []): string
    {
        $trimmedHtml = trim($html);
        if ($trimmedHtml === '') {
            return $html;
        }

        $columns = max(1, (int)($options['columns'] ?? $this->getOption('columns', 3)));
        $wrapperClasses = sprintf('post-type-layout-masonry columns-%d', $columns);
        $dataMasonry = '{"percentPosition": true}';

        $dom = new \DOMDocument('1.0', 'UTF-8');
        $previousLibxmlState = libxml_use_internal_errors(true);

        $dom->loadHTML(
            '<?xml encoding="utf-8" ?><div class="__masonry-wrapper__">' . $trimmedHtml . '</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );

        libxml_clear_errors();
        libxml_use_internal_errors($previousLibxmlState);

        $wrapper = $dom->getElementsByTagName('div')->item(0);
        if (!$wrapper instanceof \DOMElement) {
            return sprintf(
                '<div class="%s" data-masonry=\'%s\'>%s</div>',
                esc_attr($wrapperClasses),
                esc_attr($dataMasonry),
                $html
            );
        }

        $listContainer = null;
        foreach ($wrapper->childNodes as $childNode) {
            if ($childNode instanceof \DOMElement && $childNode->tagName === 'ul') {
                $listContainer = $childNode;
                break;
            }
        }

        if (!$listContainer instanceof \DOMElement) {
            return sprintf(
                '<div class="%s" data-masonry=\'%s\'>%s</div>',
                esc_attr($wrapperClasses),
                esc_attr($dataMasonry),
                $html
            );
        }

        $itemsHtml = '';

        foreach ($listContainer->childNodes as $childNode) {
            if (!$childNode instanceof \DOMElement || $childNode->tagName !== 'li') {
                continue;
            }

            $itemClasses = ['masonry-item'];
            $existingClasses = preg_split('/\s+/', $childNode->getAttribute('class'));
            if (!empty($existingClasses)) {
                foreach ($existingClasses as $existingClass) {
                    $existingClass = trim($existingClass);
                    if ($existingClass !== '') {
                        $itemClasses[] = sanitize_html_class($existingClass);
                    }
                }
            }

            $itemClasses = array_unique(array_filter($itemClasses));

            $innerContent = '';
            foreach ($childNode->childNodes as $innerChild) {
                $innerContent .= $dom->saveHTML($innerChild);
            }

            $itemsHtml .= sprintf(
                '<div class="%s">%s</div>',
                esc_attr(implode(' ', $itemClasses)),
                $innerContent
            );
        }

        if ($itemsHtml === '') {
            return sprintf(
                '<div class="%s" data-masonry=\'%s\'>%s</div>',
                esc_attr($wrapperClasses),
                esc_attr($dataMasonry),
                $html
            );
        }

        return sprintf(
            '<div class="%s" data-masonry=\'%s\'>%s</div>',
            esc_attr($wrapperClasses),
            esc_attr($dataMasonry),
            $itemsHtml
        );
    }
}
