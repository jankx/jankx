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
}
