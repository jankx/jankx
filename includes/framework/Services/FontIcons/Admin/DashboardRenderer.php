<?php

namespace Jankx\Services\FontIcons\Admin;

use Jankx\Foundation\Application;

class DashboardRenderer
{
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    public function render($activeTab = 'packs')
    {
        ?>
        <div class="jankx-tab-navigation">
            <nav class="nav-tab-wrapper">
                <a href="?page=jankx-icons&tab=packs"
                    class="nav-tab <?php echo $activeTab == 'packs' ? 'nav-tab-active' : ''; ?>"><?php _e('Icon Pack', 'jankx'); ?></a>
                <a href="?page=jankx-icons&tab=settings"
                    class="nav-tab <?php echo $activeTab == 'settings' ? 'nav-tab-active' : ''; ?>"><?php _e('Settings', 'jankx'); ?></a>
            </nav>
        </div>

        <div class="jankx-tab-content modern-tabs-content" style="margin-top: 30px;">
            <?php
            switch ($activeTab) {
                case 'packs':
                    $this->renderPacksContent();
                    break;
                case 'settings':
                    $this->renderSettingsContent();
                    break;
            }
            ?>
        </div>
        <?php
    }

    protected function renderPacksContent()
    {
        $repository = $this->app->make('font-icons.repository');
        $selectedPack = $_GET['pack'] ?? null;

        if ($selectedPack) {
            $this->renderPackExplorer($selectedPack);
            return;
        }

        $allConfigs = $repository->getAllTypes();
        $stats = $repository->getStats();
        $storage = $stats['storage'] ?? [];
        ?>
        <div class="jankx-repository-management">
            <div class="jankx-storage-info-banner">
                <div class="storage-type">
                    <span class="dashicons dashicons-database"></span>
                    <strong><?php _e('Storage System:', 'jankx'); ?></strong>
                    <span class="badge <?php echo $storage['type'] === 'sqlite' ? 'sqlite' : 'json'; ?>">
                        <?php echo strtoupper($storage['type'] ?? 'unknown'); ?>
                    </span>
                </div>
                <div class="storage-details">
                    <?php if (($storage['type'] ?? '') === 'sqlite'): ?>
                        <span><?php printf(__('Database Path: %s', 'jankx'), '<code>' . esc_html($storage['db_path']) . '</code>'); ?></span>
                        <span><?php printf(__('Total Stored Sets: %d', 'jankx'), $storage['icon_sets_count']); ?></span>
                    <?php else: ?>
                        <span><?php printf(__('Storage Directory: %s', 'jankx'), '<code>' . esc_html($storage['directory']) . '</code>'); ?></span>
                        <span><?php printf(__('Total JSON Files: %d', 'jankx'), $storage['cache_files']); ?></span>
                    <?php endif; ?>
                </div>
            </div>

            <div class="jankx-manage-header">
                <h2><?php _e('Icon Pack Management', 'jankx'); ?></h2>
                <div class="jankx-control-actions">
                    <button class="button button-primary" id="jankx-add-icon-type"><?php _e('Import New Icon Set', 'jankx'); ?></button>
                    <button class="button" id="jankx-refresh-repository"><?php _e('Refresh Cache', 'jankx'); ?></button>
                </div>
            </div>

            <div class="jankx-icon-sets-grid">
                <?php if (empty($allConfigs)): ?>
                    <p><?php _e('No icon sets registered in repository.', 'jankx'); ?></p>
                <?php else: ?>
                    <?php foreach ($allConfigs as $type => $config): ?>
                        <div class="jankx-icon-set-card">
                            <div class="card-header">
                                <h3><?php echo esc_html($config['display_name'] ?? $type); ?></h3>
                                <div class="card-status">
                                    <span class="status-badge <?php echo $config['enabled'] ? 'enabled' : 'disabled'; ?>">
                                        <?php echo $config['enabled'] ? __('Enabled', 'jankx') : __('Disabled', 'jankx'); ?>
                                    </span>
                                    <?php if ($config['auto_load'] ?? false): ?>
                                        <span class="status-badge enabled"><?php _e('Auto-load', 'jankx'); ?></span>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="info-grid">
                                    <div class="info-item">
                                        <strong><?php _e('Type', 'jankx'); ?></strong>
                                        <?php echo esc_html($type); ?>
                                    </div>
                                    <div class="info-item">
                                        <strong><?php _e('Font Family', 'jankx'); ?></strong>
                                        <?php echo esc_html($config['font_family'] ?? 'N/A'); ?>
                                    </div>
                                    <div class="info-item">
                                        <strong><?php _e('Total Icons', 'jankx'); ?></strong>
                                        <?php echo esc_html($config['total_icons'] ?? 0); ?>
                                    </div>
                                    <div class="info-item">
                                        <strong><?php _e('Version', 'jankx'); ?></strong>
                                        <?php echo esc_html($config['version'] ?? '1.0.0'); ?>
                                    </div>
                                </div>
                                <div class="card-actions">
                                    <div class="primary-actions">
                                        <a href="<?php echo add_query_arg('pack', $type); ?>" class="button button-small button-primary"><?php _e('View Icons', 'jankx'); ?></a>
                                        <button class="button button-small jankx-update-css" data-type="<?php echo esc_attr($type); ?>"><?php _e('Update CSS', 'jankx'); ?></button>
                                    </div>
                                    <div class="control-actions">
                                        <a href="#" class="button button-link-delete" data-type="<?php echo esc_attr($type); ?>"><?php _e('Remove From Repository', 'jankx'); ?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <!-- Import Section -->
            <div id="jankx-import-form-container" class="jankx-import-section" style="display:none; margin-top: 30px;">
                <h3><?php _e('Import New Icon Set from CSS URL', 'jankx'); ?></h3>
                <form id="jankx-import-icon-form">
                    <table class="form-table">
                        <tr>
                            <th><label for="icon_type"><?php _e('Icon Type Slug', 'jankx'); ?></label></th>
                            <td>
                                <input name="icon_type" type="text" id="icon_type" value="" class="regular-text" placeholder="e.g. awesome-icons" required>
                                <p class="description"><?php _e('Unique identifier for this icon set.', 'jankx'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="display_name"><?php _e('Display Name', 'jankx'); ?></label></th>
                            <td>
                                <input name="display_name" type="text" id="display_name" value="" class="regular-text" placeholder="e.g. Font Awesome Pro" required>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="css_url"><?php _e('CSS URL', 'jankx'); ?></label></th>
                            <td>
                                <input name="css_url" type="url" id="css_url" value="" class="large-text" placeholder="https://cdn.example.com/icons.css" required>
                                <p class="description"><?php _e('Absolute URL to the font icon CSS file.', 'jankx'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="auto_load"><?php _e('Auto-load', 'jankx'); ?></label></th>
                            <td>
                                <input name="auto_load" type="checkbox" id="auto_load" value="1">
                                <?php _e('Automatically enqueue this CSS on every page?', 'jankx'); ?>
                            </td>
                        </tr>
                    </table>
                    <p class="submit">
                        <button type="submit" class="button button-primary"><?php _e('Start Import', 'jankx'); ?></button>
                        <button type="button" class="button" id="cancel-import"><?php _e('Cancel', 'jankx'); ?></button>
                    </p>
                </form>
            </div>
        </div>

        <script>
            jQuery(document).ready(function($) {
                var nonce = '<?php echo wp_create_nonce('jankx_font_icons_admin'); ?>';

                $('#jankx-add-icon-type').on('click', function() {
                    $('#jankx-import-form-container').slideDown();
                    $(this).prop('disabled', true);
                });
                $('#cancel-import').on('click', function() {
                    $('#jankx-import-form-container').slideUp();
                    $('#jankx-add-icon-type').prop('disabled', false);
                });

                // Import Icon Set
                $('#jankx-import-icon-form').on('submit', function(e) {
                    e.preventDefault();
                    var $form = $(this);
                    var $btn = $form.find('button[type="submit"]');

                    $btn.addClass('updating-message').prop('disabled', true).text('<?php _e('Importing...', 'jankx'); ?>');

                    $.post(ajaxurl, {
                        action: 'jankx_font_icons_import',
                        nonce: nonce,
                        icon_type: $('#icon_type').val(),
                        display_name: $('#display_name').val(),
                        css_url: $('#css_url').val(),
                        auto_load: $('#auto_load').is(':checked') ? '1' : '0'
                    }, function(res) {
                        if (res.success) {
                            alert(res.data.message || '<?php _e('Import successful!', 'jankx'); ?>');
                            location.reload();
                        } else {
                            alert(res.data.message || '<?php _e('Import failed.', 'jankx'); ?>');
                            $btn.removeClass('updating-message').prop('disabled', false).text('<?php _e('Start Import', 'jankx'); ?>');
                        }
                    });
                });

                // Update CSS
                $('.jankx-update-css').on('click', function() {
                    var $btn = $(this);
                    var type = $btn.data('type');

                    if (!confirm('<?php _e('Update icon data from CSS URL? This will refresh the icon cache.', 'jankx'); ?>')) return;

                    $btn.prop('disabled', true).text('<?php _e('Updating...', 'jankx'); ?>');

                    $.post(ajaxurl, {
                        action: 'jankx_font_icons_update_css',
                        nonce: nonce,
                        type: type
                    }, function(res) {
                        if (res.success) {
                            alert(res.data.message);
                            location.reload();
                        } else {
                            alert(res.data.message);
                            $btn.prop('disabled', false).text('<?php _e('Update CSS', 'jankx'); ?>');
                        }
                    });
                });

                // Remove Set
                $('.button-link-delete').on('click', function(e) {
                    e.preventDefault();
                    var $btn = $(this);
                    var type = $btn.data('type');

                    if (!confirm('<?php _e('Remove this icon set from repository? Permanent data will be kept but set will be disabled.', 'jankx'); ?>')) return;

                    $.post(ajaxurl, {
                        action: 'jankx_font_icons_remove',
                        nonce: nonce,
                        type: type
                    }, function(res) {
                        if (res.success) {
                            location.reload();
                        } else {
                            alert(res.data.message);
                        }
                    });
                });

                // Refresh Repository
                $('#jankx-refresh-repository').on('click', function() {
                    var $btn = $(this);
                    $btn.prop('disabled', true).text('<?php _e('Refreshing...', 'jankx'); ?>');

                    $.post(ajaxurl, {
                        action: 'jankx_font_icons_refresh',
                        nonce: nonce
                    }, function(res) {
                        location.reload();
                    });
                });
            });
        </script>
        <?php
    }

    protected function renderPackExplorer($type)
    {
        $repository = $this->app->make('font-icons.repository');
        $allConfigs = $repository->getAllTypes();
        $iconTypes = $repository->getIconTypes();
        
        if (!isset($allConfigs[$type])) {
            echo '<div class="notice notice-error"><p>' . sprintf(__('Icon pack "%s" not found in repository.', 'jankx'), esc_html($type)) . '</p></div>';
            echo '<a href="' . remove_query_arg('pack') . '" class="button">' . __('Back to Management', 'jankx') . '</a>';
            return;
        }

        $config = $allConfigs[$type];
        $data = $iconTypes[$type] ?? null;
        $icons = $data['icons'] ?? [];
        ?>
        <div class="jankx-icon-explorer">
            <header class="explorer-header">
                <div class="header-breadcrumb">
                    <a href="<?php echo remove_query_arg('pack'); ?>"><?php _e('Icon Pack Management', 'jankx'); ?></a>
                    <span class="separator">/</span>
                    <strong><?php echo esc_html($config['display_name'] ?? $type); ?></strong>
                </div>
                <div class="explorer-actions">
                    <input type="text" id="jankx-icon-search" placeholder="<?php _e('Search icons in this pack...', 'jankx'); ?>" autofocus>
                    <a href="<?php echo remove_query_arg('pack'); ?>" class="button"><?php _e('Back', 'jankx'); ?></a>
                </div>
            </header>

            <div class="jankx-icons-stats-bar">
                <div class="stat-item">
                    <strong><?php _e('Total Icons:', 'jankx'); ?></strong>
                    <span><?php echo count($icons); ?></span>
                </div>
                <div class="stat-item">
                    <strong><?php _e('Prefixes:', 'jankx'); ?></strong>
                    <span><?php echo esc_html(implode(', ', $config['prefixes'] ?? [])); ?></span>
                </div>
                <div class="stat-item">
                    <strong><?php _e('Font Family:', 'jankx'); ?></strong>
                    <span><?php echo esc_html($config['font_family'] ?? 'N/A'); ?></span>
                </div>
                <div class="stat-item">
                    <strong><?php _e('Render Type:', 'jankx'); ?></strong>
                    <span class="badge"><?php echo esc_html(ucfirst($config['render_type'] ?? 'prefix')); ?></span>
                </div>
            </div>

            <div class="jankx-icon-grid" id="jankx-icons-display">
                <?php if (empty($icons)): ?>
                    <p class="empty-msg"><?php _e('No icons found in this pack. Try updating CSS.', 'jankx'); ?></p>
                <?php else: ?>
                    <?php foreach ($icons as $icon): ?>
                        <div class="jankx-icon-item" title="<?php echo esc_attr($icon['name']); ?>" data-name="<?php echo esc_attr($icon['name']); ?>" data-unicode="<?php echo esc_attr($icon['unicode']); ?>">
                            <div class="icon-preview">
                                <?php if (($config['render_type'] ?? 'prefix') === 'content') : ?>
                                    <i class="<?php echo esc_attr($config['prefixes'][0] ?? 'material-icons'); ?>"><?php echo esc_html($icon['name']); ?></i>
                                <?php else : ?>
                                    <i class="<?php echo esc_attr(($config['prefixes'][0] ?? '') . ' ' . $icon['name']); ?>"></i>
                                <?php endif; ?>
                            </div>
                            <div class="icon-name"><?php echo esc_html($icon['name']); ?></div>
                            <button class="copy-icon" data-icon="<?php echo esc_attr($icon['name']); ?>">
                                <span class="dashicons dashicons-admin-page"></span>
                            </button>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>

        <script>
        jQuery(document).ready(function($) {
            // Live Search
            $('#jankx-icon-search').on('keyup', function() {
                var value = $(this).val().toLowerCase();
                $('#jankx-icons-display .jankx-icon-item').filter(function() {
                    var name = $(this).data('name').toLowerCase();
                    return name.indexOf(value) > -1;
                }).show();
                
                $('#jankx-icons-display .jankx-icon-item').filter(function() {
                    var name = $(this).data('name').toLowerCase();
                    return name.indexOf(value) === -1;
                }).hide();
            });

            // Copy to clipboard
            $('.jankx-icon-item').on('click', function() {
                var name = $(this).data('name');
                var $temp = $("<input>");
                $("body").append($temp);
                $temp.val(name).select();
                document.execCommand("copy");
                $temp.remove();

                var $notif = $('<div class="copy-success"><?php _e('Copied!', 'jankx'); ?></div>');
                $(this).append($notif);
                setTimeout(function() { $notif.fadeOut(function() { $(this).remove(); }); }, 1000);
            });
        });
        </script>
        <?php
    }

    protected function renderSettingsContent()
    {
        ?>
        <div class="jankx-icons-settings">
            <div class="card">
                <h2><?php _e('Global Icon Settings', 'jankx'); ?></h2>
                <form method="post" action="options.php">
                    <?php settings_fields('jankx_icons_settings'); ?>
                    <table class="form-table">
                        <tr>
                            <th><?php _e('Default Icon Set', 'jankx'); ?></th>
                            <td>
                                <select name="jankx_default_icon_set">
                                    <?php 
                                    $repository = $this->app->make('font-icons.repository');
                                    $allConfigs = $repository->getAllTypes();
                                    foreach ($allConfigs as $type => $config) : ?>
                                        <option value="<?php echo esc_attr($type); ?>" <?php selected(get_option('jankx_default_icon_set', 'material'), $type); ?>>
                                            <?php echo esc_html($config['display_name'] ?? $type); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th><?php _e('Load via CDN', 'jankx'); ?></th>
                            <td>
                                <input type="checkbox" name="jankx_icons_cdn" value="1" checked>
                                <?php _e('Use CDN for built-in icon sets', 'jankx'); ?>
                            </td>
                        </tr>
                    </table>
                    <?php submit_button(); ?>
                </form>
            </div>
        </div>
        <?php
    }
}
