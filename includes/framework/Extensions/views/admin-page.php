<?php

/**
 * Extension Manager Admin Page View
 *
 * @package Jankx\Extensions
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <div class="jankx-extension-manager">
        <!-- Statistics -->
        <div class="jankx-extension-stats">
            <h2>Extension Statistics</h2>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-number"><?php echo esc_html($stats['total']); ?></span>
                    <span class="stat-label">Total Extensions</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number"><?php echo esc_html($stats['active']); ?></span>
                    <span class="stat-label">Active Extensions</span>
                </div>
                                 <div class="stat-item">
                     <span class="stat-number"><?php echo esc_html($stats['inactive']); ?></span>
                     <span class="stat-label">Inactive Extensions</span>
                 </div>
                 <div class="stat-item">
                     <span class="stat-number"><?php echo esc_html($stats['unique_ids']); ?></span>
                     <span class="stat-label">Unique Extension IDs</span>
                 </div>
            </div>
        </div>

        <!-- Extension List -->
        <div class="jankx-extension-list">
            <h2>Extension Management</h2>

            <?php if (empty($extensions)) :
                ?>
                <p>No extensions found.</p>
                <?php
            else :
                ?>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Extension</th>
                            <th>Version</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($extensions as $extensionName => $extension) :
                            $extensionInfo = $extension->get_info();
                            $status = $extension->is_active() ? 'active' : 'inactive';
                            ?>
                            <tr>
                                                                 <td>
                                     <strong><?php echo esc_html($extensionInfo['name']); ?></strong>
                                     <?php if ($extensionInfo['is_child_theme_extension']) :
                                            ?>
                                         <span class="child-theme-badge">Child Theme</span>
                                            <?php
                                     endif; ?>
                                     <br>
                                     <small class="extension-id">ID: <?php echo esc_html($extension->get_manifest_data()['extension_id'] ?? $extensionName); ?></small>
                                 </td>
                                <td><?php echo esc_html($extensionInfo['version']); ?></td>
                                <td><?php echo esc_html($extensionInfo['description']); ?></td>
                                <td>
                                    <span class="extension-status extension-status-<?php echo esc_attr($status); ?>">
                                        <?php echo esc_html(ucfirst($status)); ?>
                                    </span>
                                </td>
                                <td>
                                    <button
                                        class="button toggle-extension"
                                        data-extension="<?php echo esc_attr($extensionName); ?>"
                                        data-status="<?php echo esc_attr($status); ?>"
                                    >
                                        <?php echo $status === 'active' ? 'Disable' : 'Enable'; ?>
                                    </button>

                                                                         <?php if (method_exists($extension, 'get_manifest_data')) :
                                                                                $manifest = $extension->get_manifest_data();
                                                                                if ($manifest) :
                                                                                    ?>
                                         <button class="button view-details" data-extension="<?php echo esc_attr($extensionName); ?>">
                                             Manifest
                                         </button>
                                         <button class="button view-settings" data-extension="<?php echo esc_attr($extensionName); ?>">
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

                 <!-- Extension Manifest Modal -->
         <div id="extension-manifest-modal" class="jankx-modal" style="display: none;">
             <div class="jankx-modal-content">
                 <span class="jankx-modal-close">&times;</span>
                                   <h3>Extension Manifest (Developer Configuration)</h3>
                  <p><em>⚠️ This is developer configuration, do not modify manually</em></p>
                 <div id="extension-manifest-content"></div>
             </div>
         </div>

         <!-- Extension Settings Modal -->
         <div id="extension-settings-modal" class="jankx-modal" style="display: none;">
             <div class="jankx-modal-content">
                 <span class="jankx-modal-close">&times;</span>
                 <h3>Extension Settings (User Configuration)</h3>
                 <div id="extension-settings-content"></div>
             </div>
         </div>
    </div>
</div>

<style>
.jankx-extension-manager {
    margin-top: 20px;
}

.jankx-extension-stats {
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

.jankx-extension-list {
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

.extension-status {
    padding: 4px 8px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 500;
}

.extension-status-active {
    background: #d4edda;
    color: #155724;
}

.extension-status-inactive {
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

 .extension-settings-form {
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

 .extension-settings-form .button {
     margin-top: 15px;
 }

 .extension-id {
     color: #666;
     font-style: italic;
 }
</style>

<script>
jQuery(document).ready(function($) {
    // Toggle extension
    $('.toggle-extension').on('click', function() {
        var button = $(this);
        var extension = button.data('extension');
        var currentStatus = button.data('status');

        button.prop('disabled', true).text('Processing...');

        $.ajax({
            url: jankxExtensionManager.ajaxUrl,
            type: 'POST',
            data: {
                action: 'jankx_toggle_extension',
                extension: extension,
                nonce: jankxExtensionManager.nonce
            },
            success: function(response) {
                if (response.success) {
                    // Update button
                    var newStatus = response.data.status;
                    button.data('status', newStatus);
                    button.text(newStatus === 'enabled' ? 'Disable' : 'Enable');

                    // Update status cell
                    var statusCell = button.closest('tr').find('.extension-status');
                    statusCell.removeClass('extension-status-active extension-status-inactive')
                             .addClass('extension-status-' + newStatus)
                             .text(newStatus.charAt(0).toUpperCase() + newStatus.slice(1));

                    // Show success message
                    alert('Extension toggled successfully!');
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

         // Extension manifest modal
     $('.view-details').on('click', function() {
         var extension = $(this).data('extension');
         $('#extension-manifest-content').html('<p>Loading extension manifest...</p>');
         $('#extension-manifest-modal').show();

         // Load extension manifest via AJAX
         $.ajax({
             url: jankxExtensionManager.ajaxUrl,
             type: 'POST',
             data: {
                 action: 'jankx_get_extension_manifest',
                 extension: extension,
                 nonce: jankxExtensionManager.nonce
             },
             success: function(response) {
                 if (response.success) {
                     $('#extension-manifest-content').html('<pre>' + JSON.stringify(response.data, null, 2) + '</pre>');
                 } else {
                     $('#extension-manifest-content').html('<p>Error loading manifest: ' + response.data + '</p>');
                 }
             },
             error: function() {
                 $('#extension-manifest-content').html('<p>Error loading manifest</p>');
             }
         });
     });

     // Extension settings modal
     $('.view-settings').on('click', function() {
         var extension = $(this).data('extension');
         $('#extension-settings-content').html('<p>Loading extension settings...</p>');
         $('#extension-settings-modal').show();

         // Load extension settings via AJAX
         $.ajax({
             url: jankxExtensionManager.ajaxUrl,
             type: 'POST',
             data: {
                 action: 'jankx_get_extension_settings',
                 extension: extension,
                 nonce: jankxExtensionManager.nonce
             },
             success: function(response) {
                 if (response.success) {
                     var settingsHtml = '<div class="extension-settings-form">';
                     if (Object.keys(response.data).length === 0) {
                         settingsHtml += '<p>No user settings configured for this extension.</p>';
                     } else {
                         settingsHtml += '<form id="extension-settings-form">';
                         settingsHtml += '<input type="hidden" name="extension" value="' + extension + '">';

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

                     $('#extension-settings-content').html(settingsHtml);
                 } else {
                     $('#extension-settings-content').html('<p>Error loading settings: ' + response.data + '</p>');
                 }
             },
             error: function() {
                 $('#extension-settings-content').html('<p>Error loading settings</p>');
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
     $(document).on('submit', '#extension-settings-form', function(e) {
         e.preventDefault();

         var formData = $(this).serialize();
         formData += '&action=jankx_save_extension_settings&nonce=' + jankxExtensionManager.nonce;

         $.ajax({
             url: jankxExtensionManager.ajaxUrl,
             type: 'POST',
             data: formData,
             success: function(response) {
                 if (response.success) {
                     alert('Settings saved successfully!');
                     $('#extension-settings-modal').hide();
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
