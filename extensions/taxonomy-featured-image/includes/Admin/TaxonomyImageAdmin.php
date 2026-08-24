<?php

namespace Jankx\Extensions\TaxonomyFeaturedImage\Admin;

use Jankx\Extensions\TaxonomyFeaturedImage\Services\TaxonomyImageService;

/**
 * Taxonomy Image Admin
 *
 * Renders the featured image field on taxonomy add/edit forms,
 * saves term meta, and shows a thumbnail column in list tables.
 */
class TaxonomyImageAdmin
{
    /**
     * @var TaxonomyImageService
     */
    protected $service;

    public function __construct(TaxonomyImageService $service)
    {
        $this->service = $service;
    }

    public function register(): void
    {
        add_action('admin_init', [$this, 'registerTermMeta']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueAssets']);
        add_action('load-edit-tags.php', [$this, 'registerTaxonomyHooks']);
        add_action('load-term.php', [$this, 'registerTaxonomyHooks']);
    }

    /**
     * Register term meta for allowed taxonomies
     *
     * @return void
     */
    public function registerTermMeta(): void
    {
        $this->service->registerMeta();
    }

    /**
     * Hook into current taxonomy screens (resolved at runtime)
     *
     * @return void
     */
    public function registerTaxonomyHooks(): void
    {
        $taxonomy = isset($_GET['taxonomy']) ? sanitize_key(wp_unslash($_GET['taxonomy'])) : '';

        if (!$taxonomy || !$this->service->isTaxonomySupported($taxonomy)) {
            return;
        }

        add_action("{$taxonomy}_add_form_fields", [$this, 'renderAddField']);
        add_action("{$taxonomy}_edit_form_fields", [$this, 'renderEditField']);
        add_action("created_{$taxonomy}", [$this, 'saveTerm']);
        add_action("edited_{$taxonomy}", [$this, 'saveTerm']);
        add_filter("manage_edit-{$taxonomy}_columns", [$this, 'addColumn']);
        add_filter("manage_{$taxonomy}_custom_column", [$this, 'renderColumn'], 10, 3);
    }

    /**
     * Enqueue media uploader assets on taxonomy screens
     *
     * @param string $hookSuffix Current admin page
     * @return void
     */
    public function enqueueAssets(string $hookSuffix): void
    {
        if (!in_array($hookSuffix, ['edit-tags.php', 'term.php'], true)) {
            return;
        }

        $taxonomy = isset($_GET['taxonomy']) ? sanitize_key(wp_unslash($_GET['taxonomy'])) : '';
        if (!$taxonomy || !$this->service->isTaxonomySupported($taxonomy)) {
            return;
        }

        wp_enqueue_media();

        $script = <<<'JS'
(function () {
    function openMedia(e) {
        e.preventDefault();
        var wrap = e.target.closest('.jankx-term-image-field');
        if (!wrap) {
            return;
        }
        var frame = wp.media({
            title: jankxTermImageL10n.title,
            button: { text: jankxTermImageL10n.use },
            multiple: false,
        });

        frame.on('select', function () {
            var attachment = frame.state().get('selection').first().toJSON();
            var url = (attachment.sizes && attachment.sizes.thumbnail)
                ? attachment.sizes.thumbnail.url
                : attachment.url;
            wrap.querySelector('[data-term-image-id]').value = attachment.id;
            var preview = wrap.querySelector('.jankx-term-image-preview');
            if (preview) {
                preview.innerHTML = '<img src="' + url + '" style="max-width:150px;height:auto;display:block;margin-bottom:8px;" />';
            }
            wrap.querySelector('.jankx-term-image-add').style.display = 'none';
            wrap.querySelector('.jankx-term-image-remove').style.display = 'inline-block';
        });

        frame.open();
    }

    function removeImage(e) {
        e.preventDefault();
        var wrap = e.target.closest('.jankx-term-image-field');
        if (!wrap) {
            return;
        }
        wrap.querySelector('[data-term-image-id]').value = '';
        var preview = wrap.querySelector('.jankx-term-image-preview');
        if (preview) {
            preview.innerHTML = '';
        }
        wrap.querySelector('.jankx-term-image-add').style.display = 'inline-block';
        wrap.querySelector('.jankx-term-image-remove').style.display = 'none';
    }

    document.addEventListener('click', function (e) {
        if (e.target.matches('.jankx-term-image-add') || e.target.closest('.jankx-term-image-add')) {
            openMedia(e);
        }
        if (e.target.matches('.jankx-term-image-remove') || e.target.closest('.jankx-term-image-remove')) {
            removeImage(e);
        }
    });
})();
JS;

        wp_register_script('jankx-term-image-admin', '', [], '1.0.0', true);
        wp_enqueue_script('jankx-term-image-admin');
        wp_add_inline_script('jankx-term-image-admin', $script);
        wp_localize_script('jankx-term-image-admin', 'jankxTermImageL10n', [
            'title' => __('Select Featured Image', 'jankx'),
            'use' => __('Use This Image', 'jankx'),
        ]);

        wp_add_inline_style('common', sprintf(
            '.jankx-term-image-preview img { max-width: 150px; height: auto; }' .
            '.column-jankx_term_image img { width: 48px; height: 48px; object-fit: cover; border-radius: 4px; }' .
            '.column-jankx_term_image .no-image { color: #a7aaad; }'
        ));
    }

    /**
     * Get field markup shared between add/edit forms
     *
     * @param int $attachmentId Current attachment ID
     * @return string
     */
    protected function getFieldMarkup(int $attachmentId): string
    {
        $preview = '';
        if ($attachmentId) {
            $preview = wp_get_attachment_image($attachmentId, 'thumbnail', false, [
                'style' => 'max-width:150px;height:auto;display:block;margin-bottom:8px;',
            ]);
        }

        $addStyle = $attachmentId ? 'display:none;' : '';
        $removeStyle = $attachmentId ? '' : 'display:none;';

        return sprintf(
            '<div class="jankx-term-image-field">
                <input type="hidden" name="jankx_term_image_id" data-term-image-id value="%1$d" />
                <div class="jankx-term-image-preview">%2$s</div>
                <a href="#" class="button jankx-term-image-add" style="%3$s">%4$s</a>
                <a href="#" class="button-link-delete jankx-term-image-remove" style="%5$s">%6$s</a>
            </div>',
            $attachmentId,
            $preview,
            $addStyle,
            esc_html__('Upload / Select Image', 'jankx'),
            $removeStyle,
            esc_html__('Remove Image', 'jankx')
        );
    }

    /**
     * Render field on the add term form
     *
     * @return void
     */
    public function renderAddField(): void
    {
        ?>
        <div class="form-field jankx-term-image-wrap">
            <label><?php esc_html_e('Featured Image', 'jankx'); ?></label>
            <?php echo $this->getFieldMarkup(0); // phpcs:ignore ?>
        </div>
        <?php
    }

    /**
     * Render field on the edit term form
     *
     * @param \WP_Term $term Current term
     * @return void
     */
    public function renderEditField($term): void
    {
        $attachmentId = $this->service->getTermImageId($term);
        ?>
        <tr class="form-field jankx-term-image-wrap">
            <th scope="row"><label><?php esc_html_e('Featured Image', 'jankx'); ?></label></th>
            <td>
                <?php echo $this->getFieldMarkup($attachmentId); // phpcs:ignore ?>
            </td>
        </tr>
        <?php
    }

    /**
     * Save term featured image
     *
     * @param int $termId Term ID
     * @return void
     */
    public function saveTerm(int $termId): void
    {
        if (!current_user_can('manage_categories') && !current_user_can('manage_terms')) {
            return;
        }

        if (!isset($_POST['jankx_term_image_id'])) {
            return;
        }

        $attachmentId = isset($_POST['jankx_term_image_id'])
            ? absint(wp_unslash($_POST['jankx_term_image_id']))
            : 0;

        $this->service->setTermImage($termId, $attachmentId);
    }

    /**
     * Add thumbnail column header
     *
     * @param array $columns Existing columns
     * @return array
     */
    public function addColumn(array $columns): array
    {
        $new = [];
        foreach ($columns as $key => $label) {
            $new[$key] = $label;
            if ($key === 'cb') {
                $new['jankx_term_image'] = __('Image', 'jankx');
            }
        }
        if (!isset($new['jankx_term_image'])) {
            $new['jankx_term_image'] = __('Image', 'jankx');
        }
        return $new;
    }

    /**
     * Render thumbnail column content
     *
     * @param string $content Column content
     * @param string $columnName Column name
     * @param int $termId Term ID
     * @return string
     */
    public function renderColumn(string $content, string $columnName, int $termId): string
    {
        if ($columnName !== 'jankx_term_image') {
            return $content;
        }

        $image = $this->service->getTermImage($termId, 'thumbnail', [
            'style' => 'width:48px;height:48px;object-fit:cover;border-radius:4px;',
        ]);

        if ($image) {
            return $image;
        }

        return '<span class="no-image">—</span>';
    }
}
