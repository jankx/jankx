<?php

/**
 * Module Manager Admin Page View
 *
 * @package Jankx\Framework\Modules
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <div class="jankx-module-manager">
        <!-- Statistics -->
        <div class="jankx-module-stats">
            <h2>Module Statistics</h2>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-number"><?php echo esc_html($stats['total']); ?></span>
                    <span class="stat-label">Total Modules</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number"><?php echo esc_html($stats['active']); ?></span>
                    <span class="stat-label">Active Modules</span>
                </div>
                                 <div class="stat-item">
                     <span class="stat-number"><?php echo esc_html($stats['inactive']); ?></span>
                     <span class="stat-label">Inactive Modules</span>
                 </div>
                 <div class="stat-item">
                     <span class="stat-number"><?php echo esc_html($stats['unique_ids']); ?></span>
                     <span class="stat-label">Unique Module IDs</span>
                 </div>
            </div>
        </div>

        <!-- Module List -->
        <div class="jankx-module-list">
            <h2>Module Management</h2>

            <?php if (empty($modules)) :
                ?>
                <p>No modules found.</p>
                <?php
            else :
                ?>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Module</th>
                            <th>Version</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($modules as $moduleName => $module) :
                            $moduleInfo = $module->get_info();
                            $status = $module->is_active() ? 'active' : 'inactive';
                            ?>
                            <tr>
                                                                 <td>
                                     <strong><?php echo esc_html($moduleInfo['name']); ?></strong>
                                     <?php if ($moduleInfo['is_child_theme_module']) :
                                            ?>
                                         <span class="child-theme-badge">Child Theme</span>
                                            <?php
                                     endif; ?>
                                     <br>
                                     <small class="module-id">ID: <?php echo esc_html($module->get_manifest_data()['module_id'] ?? $moduleName); ?></small>
                                 </td>
                                <td><?php echo esc_html($moduleInfo['version']); ?></td>
                                <td><?php echo esc_html($moduleInfo['description']); ?></td>
                                <td>
                                    <span class="module-status module-status-<?php echo esc_attr($status); ?>">
                                        <?php echo esc_html(ucfirst($status)); ?>
                                    </span>
                                </td>
                                <td>
                                    <button
                                        class="button toggle-module"
                                        data-module="<?php echo esc_attr($moduleName); ?>"
                                        data-status="<?php echo esc_attr($status); ?>"
                                    >
                                        <?php echo $status === 'active' ? 'Disable' : 'Enable'; ?>
                                    </button>

                                                                         <?php if (method_exists($module, 'get_manifest_data')) :
                                                                                $manifest = $module->get_manifest_data();
                                                                                if ($manifest) :
                                                                                    ?>
                                         <button class="button view-details" data-module="<?php echo esc_attr($moduleName); ?>">
                                             Manifest
                                         </button>
                                         <button class="button view-settings" data-module="<?php echo esc_attr($moduleName); ?>">
                                             Settings
                                         </button>
                                                                                    <?php
                                                                                endif;
                                                                         endif; ?>
                                </td>
                            </tr>
                            <?php
                        endforeach; ?>
                    </tbody>
                </table>
                <?php
            endif; ?>
        </div>

                 <!-- Module Manifest Modal -->
         <div id="module-manifest-modal" class="jankx-modal" style="display: none;">
             <div class="jankx-modal-content">
                 <span class="jankx-modal-close">&times;</span>
                                   <h3>Module Manifest (Developer Configuration)</h3>
                  <p><em>⚠️ This is developer configuration, do not modify manually</em></p>
                 <div id="module-manifest-content"></div>
             </div>
         </div>

         <!-- Module Settings Modal -->
         <div id="module-settings-modal" class="jankx-modal" style="display: none;">
             <div class="jankx-modal-content">
                 <span class="jankx-modal-close">&times;</span>
                 <h3>Module Settings (User Configuration)</h3>
                 <div id="module-settings-content"></div>
             </div>
         </div>
    </div>
</div>

<style>
.jankx-module-manager {
    margin-top: 20px;
}

.jankx-module-stats {
    background: #fff;
    padding: 20px;
    border: 1px solid #ccd0d4;
    border-radius: 4px;
    margin-bottom: 20px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-top: 15px;
}

.stat-item {
    text-align: center;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 4px;
}

.stat-number {
    display: block;
    font-size: 24px;
    font-weight: bold;
    color: #0073aa;
}

.stat-label {
    display: block;
    margin-top: 5px;
    color: #666;
}

.jankx-module-list {
    background: #fff;
    padding: 20px;
    border: 1px solid #ccd0d4;
    border-radius: 4px;
}

.child-theme-badge {
    background: #46b450;
    color: #fff;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 11px;
    margin-left: 5px;
}

.module-status {
    padding: 4px 8px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 500;
}

.module-status-active {
    background: #d4edda;
    color: #155724;
}

.module-status-inactive {
    background: #f8d7da;
    color: #721c24;
}

.jankx-modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.jankx-modal-content {
    background-color: #fff;
    margin: 5% auto;
    padding: 20px;
    border-radius: 4px;
    width: 80%;
    max-width: 600px;
    position: relative;
}

.jankx-modal-close {
    position: absolute;
    right: 15px;
    top: 10px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    color: #aaa;
}

.jankx-modal-close:hover {
    color: #000;
}

 .button + .button {
     margin-left: 5px;
 }

 .module-settings-form {
     margin-top: 15px;
 }

 .setting-row {
     margin-bottom: 15px;
     display: flex;
     align-items: center;
 }

 .setting-row label {
     width: 150px;
     font-weight: 500;
     margin-right: 10px;
 }

 .setting-row input {
     flex: 1;
     max-width: 300px;
 }

 .module-settings-form .button {
     margin-top: 15px;
 }

 .module-id {
     color: #666;
     font-style: italic;
 }
</style>

<script>
jQuery(document).ready(function($) {
    // Toggle module
    $('.toggle-module').on('click', function() {
        var button = $(this);
        var module = button.data('module');
        var currentStatus = button.data('status');

        button.prop('disabled', true).text('Processing...');

        $.ajax({
            url: jankxModuleManager.ajaxUrl,
            type: 'POST',
            data: {
                action: 'jankx_toggle_module',
                module: module,
                nonce: jankxModuleManager.nonce
            },
            success: function(response) {
                if (response.success) {
                    // Update button
                    var newStatus = response.data.status;
                    button.data('status', newStatus);
                    button.text(newStatus === 'enabled' ? 'Disable' : 'Enable');

                    // Update status cell
                    var statusCell = button.closest('tr').find('.module-status');
                    statusCell.removeClass('module-status-active module-status-inactive')
                             .addClass('module-status-' + newStatus)
                             .text(newStatus.charAt(0).toUpperCase() + newStatus.slice(1));

                    // Show success message
                    alert('Module toggled successfully!');
                } else {
                    alert('Error: ' + response.data);
                }
            },
            error: function() {
                alert('An error occurred while processing your request.');
            },
            complete: function() {
                button.prop('disabled', false);
            }
        });
    });

         // Module manifest modal
     $('.view-details').on('click', function() {
         var module = $(this).data('module');
         $('#module-manifest-content').html('<p>Loading module manifest...</p>');
         $('#module-manifest-modal').show();

         // Load module manifest via AJAX
         $.ajax({
             url: jankxModuleManager.ajaxUrl,
             type: 'POST',
             data: {
                 action: 'jankx_get_module_manifest',
                 module: module,
                 nonce: jankxModuleManager.nonce
             },
             success: function(response) {
                 if (response.success) {
                     $('#module-manifest-content').html('<pre>' + JSON.stringify(response.data, null, 2) + '</pre>');
                 } else {
                     $('#module-manifest-content').html('<p>Error loading manifest: ' + response.data + '</p>');
                 }
             },
             error: function() {
                 $('#module-manifest-content').html('<p>Error loading manifest</p>');
             }
         });
     });

     // Module settings modal
     $('.view-settings').on('click', function() {
         var module = $(this).data('module');
         $('#module-settings-content').html('<p>Loading module settings...</p>');
         $('#module-settings-modal').show();

         // Load module settings via AJAX
         $.ajax({
             url: jankxModuleManager.ajaxUrl,
             type: 'POST',
             data: {
                 action: 'jankx_get_module_settings',
                 module: module,
                 nonce: jankxModuleManager.nonce
             },
             success: function(response) {
                 if (response.success) {
                     var settingsHtml = '<div class="module-settings-form">';
                     if (Object.keys(response.data).length === 0) {
                         settingsHtml += '<p>No user settings configured for this module.</p>';
                     } else {
                         settingsHtml += '<form id="module-settings-form">';
                         settingsHtml += '<input type="hidden" name="module" value="' + module + '">';

                         $.each(response.data, function(key, value) {
                             settingsHtml += '<div class="setting-row">';
                             settingsHtml += '<label>' + key + ':</label>';
                             settingsHtml += '<input type="text" name="settings[' + key + ']" value="' + value + '">';
                             settingsHtml += '</div>';
                         });

                         settingsHtml += '<button type="submit" class="button button-primary">Save Settings</button>';
                         settingsHtml += '</form>';
                     }
                     settingsHtml += '</div>';

                     $('#module-settings-content').html(settingsHtml);
                 } else {
                     $('#module-settings-content').html('<p>Error loading settings: ' + response.data + '</p>');
                 }
             },
             error: function() {
                 $('#module-settings-content').html('<p>Error loading settings</p>');
             }
         });
     });

         // Close modals
     $('.jankx-modal-close').on('click', function() {
         $('.jankx-modal').hide();
     });

     // Close modal when clicking outside
     $(window).on('click', function(event) {
         if (event.target.classList.contains('jankx-modal')) {
             $('.jankx-modal').hide();
         }
     });

     // Handle settings form submission
     $(document).on('submit', '#module-settings-form', function(e) {
         e.preventDefault();

         var formData = $(this).serialize();
         formData += '&action=jankx_save_module_settings&nonce=' + jankxModuleManager.nonce;

         $.ajax({
             url: jankxModuleManager.ajaxUrl,
             type: 'POST',
             data: formData,
             success: function(response) {
                 if (response.success) {
                     alert('Settings saved successfully!');
                     $('#module-settings-modal').hide();
                 } else {
                     alert('Error saving settings: ' + response.data);
                 }
             },
             error: function() {
                 alert('Error saving settings');
             }
         });
     });
});
</script>
