<?php

namespace Jankx\Services\FontIcons;

use Jankx\Facades\Config;

class IconTypeManager
{
    protected $activeTypes = [];

    public function __construct()
    {
        $this->loadActiveTypes();
    }

    protected function loadActiveTypes()
    {
        $this->activeTypes = get_option('jankx_font_icons_active_types', []);

        // Set defaults from config if no active types are set
        if (empty($this->activeTypes)) {
            $iconTypes = Config::get('font-icons.icon_types', []);
            foreach ($iconTypes as $type => $typeConfig) {
                if ($typeConfig['enabled'] && ($typeConfig['auto_load'] ?? false)) {
                    $this->activeTypes[] = $type;
                }
            }
            update_option('jankx_font_icons_active_types', $this->activeTypes);
        }
    }

    public function getActiveTypes()
    {
        return $this->activeTypes;
    }

    public function isTypeActive($type)
    {
        return in_array($type, $this->activeTypes);
    }

    public function activateType($type)
    {
        if (!in_array($type, $this->activeTypes)) {
            $this->activeTypes[] = $type;
            update_option('jankx_font_icons_active_types', $this->activeTypes);
        }

        return true;
    }

    public function deactivateType($type)
    {
        if (in_array($type, $this->activeTypes)) {
            $this->activeTypes = array_diff($this->activeTypes, [$type]);
            update_option('jankx_font_icons_active_types', $this->activeTypes);
        }

        return true;
    }

    public function getTypeConfig($type)
    {
        $iconTypes = Config::get('font-icons.icon_types', []);
        return $iconTypes[$type] ?? null;
    }

    public function getAllTypes()
    {
        return Config::get('font-icons.icon_types', []);
    }

    public function getEnabledTypes()
    {
        $iconTypes = Config::get('font-icons.icon_types', []);
        $enabled = [];

        foreach ($iconTypes as $type => $config) {
            if ($config['enabled']) {
                $enabled[$type] = $config;
            }
        }

        return $enabled;
    }

    public function getAutoLoadTypes()
    {
        $iconTypes = Config::get('font-icons.icon_types', []);
        $autoLoad = [];

        foreach ($iconTypes as $type => $config) {
            if ($config['enabled'] && ($config['auto_load'] ?? false)) {
                $autoLoad[$type] = $config;
            }
        }

        return $autoLoad;
    }
}
