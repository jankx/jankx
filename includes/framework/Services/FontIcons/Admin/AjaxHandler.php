<?php

namespace Jankx\Services\FontIcons\Admin;

use Jankx\Foundation\Application;

class AjaxHandler
{
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    public function init()
    {
        add_action('wp_ajax_jankx_font_icons_import', [$this, 'handleImport']);
        add_action('wp_ajax_jankx_font_icons_update_css', [$this, 'handleUpdateCss']);
        add_action('wp_ajax_jankx_font_icons_remove', [$this, 'handleRemove']);
        add_action('wp_ajax_jankx_font_icons_refresh', [$this, 'handleRefresh']);
    }

    public function handleImport()
    {
        check_ajax_referer('jankx_font_icons_admin', 'nonce');

        $type = $_POST['icon_type'] ?? '';
        $displayName = $_POST['display_name'] ?? '';
        $cssUrl = $_POST['css_url'] ?? '';
        $autoLoad = isset($_POST['auto_load']) && $_POST['auto_load'] === '1';

        if (!$type || !$cssUrl) {
            wp_send_json_error(['message' => __('Missing required fields.', 'jankx')]);
        }

        try {
            $repository = $this->app->make('font-icons.repository');
            $result = $repository->importFromCssUrl($cssUrl, $type, $displayName, $autoLoad);

            if ($result['success']) {
                wp_send_json_success([
                    'message' => $result['message'],
                    'data' => $result['data']
                ]);
            } else {
                wp_send_json_error(['message' => $result['message']]);
            }
        } catch (\Exception $e) {
            wp_send_json_error(['message' => $e->getMessage()]);
        }
    }

    public function handleUpdateCss()
    {
        check_ajax_referer('jankx_font_icons_admin', 'nonce');

        $type = $_POST['type'] ?? '';
        if (!$type) {
            wp_send_json_error(['message' => __('Missing icon type.', 'jankx')]);
        }

        try {
            $repository = $this->app->make('font-icons.repository');
            $allConfigs = $repository->getAllTypes();
            
            if (!isset($allConfigs[$type])) {
                wp_send_json_error(['message' => __('Icon set not found.', 'jankx')]);
            }

            $config = $allConfigs[$type];
            $cssUrl = $config['css_url'] ?? '';

            if (!$cssUrl && isset($config['cdn_url'])) {
                $version = $config['version'] ?? 'latest';
                $cssUrl = str_replace('{version}', $version, $config['cdn_url']);
            }

            if (!$cssUrl) {
                wp_send_json_error(['message' => __('CSS URL not configured for this set.', 'jankx')]);
            }

            // Thực hiện import để update data, truyền version từ config
            $result = $repository->importFromCssUrl(
                $cssUrl, 
                $type, 
                $config['display_name'], 
                $config['auto_load'], 
                null, 
                $config['version'] ?? null
            );

            if ($result['success']) {
                wp_send_json_success(['message' => __('Icon set updated successfully.', 'jankx')]);
            } else {
                wp_send_json_error(['message' => $result['message']]);
            }
        } catch (\Exception $e) {
            wp_send_json_error(['message' => $e->getMessage()]);
        }
    }

    public function handleRemove()
    {
        check_ajax_referer('jankx_font_icons_admin', 'nonce');

        $type = $_POST['type'] ?? '';
        if (!$type) {
            wp_send_json_error(['message' => __('Missing icon type.', 'jankx')]);
        }

        try {
            $repository = $this->app->make('font-icons.repository');
            $result = $repository->removeIconType($type);

            if ($result) {
                wp_send_json_success(['message' => __('Icon set removed successfully.', 'jankx')]);
            } else {
                wp_send_json_error(['message' => __('Failed to remove icon set.', 'jankx')]);
            }
        } catch (\Exception $e) {
            wp_send_json_error(['message' => $e->getMessage()]);
        }
    }

    public function handleRefresh()
    {
        check_ajax_referer('jankx_font_icons_admin', 'nonce');

        try {
            $repository = $this->app->make('font-icons.repository');
            $repository->refreshCache();
            wp_send_json_success(['message' => __('Repository cache refreshed successfully.', 'jankx')]);
        } catch (\Exception $e) {
            wp_send_json_error(['message' => $e->getMessage()]);
        }
    }
}
