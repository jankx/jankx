<?php

namespace App\Providers\WordPress;

use Jankx\Support\Providers\ServiceProvider;

/**
 * Visual Term Description Editor Service Provider
 *
 * Replaces the plain-text term (category, tag) description editor
 * with a WYSIWYG visual editor.
 *
 * @package App\Providers\WordPress
 * @since 2.0.0
 */
class VisualTermDescriptionEditorServiceProvider extends ServiceProvider
{
    /**
     * The taxonomies which should use the visual editor.
     *
     * @var array
     */
    protected $taxonomies;

    /**
     * Register services
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(\Jankx\Foundation\Application $app)
    {
        // No services to register
    }

    /**
     * Bootstrap services
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(\Jankx\Foundation\Application $app)
    {
        $this->setupTaxonomies();
        $this->setupHooks();
    }

    /**
     * Setup taxonomies to use visual editor
     *
     * @return void
     */
    protected function setupTaxonomies()
    {
        $this->taxonomies = [
            'category',
            'post_tag',
            'book_author', // Custom taxonomy
            'product_cat', // WooCommerce category
            'product_tag', // WooCommerce tag
        ];

        // Add custom taxonomies dynamically
        $custom_taxonomies = get_taxonomies(['_builtin' => false]);
        foreach ($custom_taxonomies as $taxonomy) {
            if (!in_array($taxonomy, $this->taxonomies)) {
                $this->taxonomies[] = $taxonomy;
            }
        }
    }

    /**
     * Setup WordPress hooks
     *
     * @return void
     */
    protected function setupHooks()
    {
        // Loop through the taxonomies, adding actions for admin editor
        foreach ($this->taxonomies as $taxonomy) {
            add_action($taxonomy . '_edit_form_fields', array($this, 'render_field_edit'), 1, 2);
            add_action($taxonomy . '_add_form_fields', array($this, 'render_field_add'), 1, 0);
        }

        // Enqueue admin scripts and styles
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminAssets']);
    }

    /**
     * Add the visual editor to the edit tag screen.
     *
     * @param object $tag      The tag currently being edited.
     * @param string $taxonomy The taxonomy that the tag belongs to.
     */
    public function render_field_edit($tag, $taxonomy)
    {
        $settings = array(
            'textarea_name' => 'description',
            'textarea_rows' => 10,
            'editor_class'  => 'i18n-multilingual',
            'media_buttons' => true,
            'tinymce' => [
                'toolbar1' => 'formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,unlink,wp_more,spellchecker,fullscreen,wp_adv',
                'toolbar2' => 'strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help',
                'toolbar3' => 'image,media,table,code',
                'extended_valid_elements' => 'img[*],a[*],div[*],span[*],p[*],br,hr,h1,h2,h3,h4,h5,h6,ul,ol,li,blockquote,pre,code,table,tr,td,th,tbody,thead,tfoot',
                'valid_children' => '+body[img],+body[div],+body[span],+body[p],+body[br],+body[hr],+body[h1],+body[h2],+body[h3],+body[h4],+body[h5],+body[h6],+body[ul],+body[ol],+body[li],+body[blockquote],+body[pre],+body[code],+body[table]',
            ],
            'quicktags' => true,
            'drag_drop_upload' => true,
            'wpautop' => false,
            'teeny' => false,
        );

        /**
         * Allow filtering of wp_editor screen settings
         *
         * @param array $settings Array of settings
         */
        $settings = apply_filters('visual_term_description_edit_screen_editor_settings', $settings);

        ?>
        <tr class="form-field term-description-wrap">
            <th scope="row">
                <label for="description"><?php _e('Description'); ?></label>
            </th>
            <td>
                <?php
                wp_editor(htmlspecialchars_decode($tag->description), 'html-tag-description', $settings);
                ?>
                <p class="description"><?php esc_html_e('The description is not prominent by default; however, some themes may show it.'); ?></p>
            </td>
            <script>
                // Remove the non-html field
                jQuery('textarea#description').closest('.form-field').remove()
            </script>
        </tr>
        <?php
    }

    /**
     * Add the visual editor to the add new tag screen.
     */
    public function render_field_add()
    {
        $settings = array(
            'textarea_name' => 'description',
            'textarea_rows' => 7,
            'editor_class'  => 'i18n-multilingual',
            'media_buttons' => true,
            'tinymce' => [
                'toolbar1' => 'formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,unlink,wp_more,spellchecker,fullscreen,wp_adv',
                'toolbar2' => 'strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help',
                'toolbar3' => 'image,media,table,code',
                'extended_valid_elements' => 'img[*],a[*],div[*],span[*],p[*],br,hr,h1,h2,h3,h4,h5,h6,ul,ol,li,blockquote,pre,code,table,tr,td,th,tbody,thead,tfoot',
                'valid_children' => '+body[img],+body[div],+body[span],+body[p],+body[br],+body[hr],+body[h1],+body[h2],+body[h3],+body[h4],+body[h5],+body[h6],+body[ul],+body[ol],+body[li],+body[blockquote],+body[pre],+body[code],+body[table]',
            ],
            'quicktags' => true,
            'drag_drop_upload' => true,
            'wpautop' => false,
            'teeny' => false,
        );

        /**
         * Allow filtering of wp_editor screen settings
         *
         * @param array $settings Array of settings
         */
        $settings = apply_filters('visual_term_description_editor_settings', $settings);

        ?>
        <div class="form-field term-description-wrap">
            <label for="tag-description"><?php esc_html_e('Description'); ?></label>
            <?php
            wp_editor('', 'html-tag-description', $settings);
            ?>
            <p><?php esc_html_e('The description is not prominent by default; however, some themes may show it.'); ?></p>

            <script>
                // Remove the non-html field
                jQuery('textarea#tag-description').closest('.form-field').remove()

                jQuery(function () {
                    jQuery('#addtag').on('mousedown', '#submit', function () {
                        tinyMCE.triggerSave()

                        jQuery(document).bind('ajaxSuccess.vtde_add_term', function () {
                            if (tinyMCE.activeEditor) {
                                tinyMCE.activeEditor.setContent('')
                            }
                            jQuery(document).unbind('ajaxSuccess.vtde_add_term', false)
                        })
                    })
                })
            </script>
        </div>
        <?php
    }

    /**
     * Enqueue admin assets
     *
     * @return void
     */
    public function enqueueAdminAssets()
    {
        $screen = get_current_screen();

        // Only load on taxonomy screens
        if (!$screen || !in_array($screen->base, ['edit-tags', 'term'])) {
            return;
        }

        // Enqueue WordPress editor scripts
        wp_enqueue_editor();

        // Add custom CSS for better styling
        wp_add_inline_style('wp-admin', '
            .term-description-wrap .wp-editor-container {
                margin-top: 5px;
            }
            .term-description-wrap .wp-editor-area {
                min-height: 200px;
            }
        ');
    }

    /**
     * Get the services provided by the provider
     *
     * @return array
     */
    public function provides()
    {
        return [];
    }
}
