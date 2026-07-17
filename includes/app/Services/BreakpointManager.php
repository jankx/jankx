<?php

namespace App\Services;

class BreakpointManager
{
    protected static $instance = null;

    protected $breakpoints = [];

    protected function __construct()
    {
        $this->loadBreakpoints();
    }

    public static function getInstance(): self
    {
        if (static::$instance === null) {
            static::$instance = new static();
        }
        return static::$instance;
    }

    protected function loadBreakpoints(): void
    {
        $ultrawide = (int) jankx_get_theme_option('breakpoint_ultrawide', 1600);
        $desktopMin = (int) jankx_get_theme_option('breakpoint_desktop_min', 1025);
        $tabletMin = (int) jankx_get_theme_option('breakpoint_tablet_min', 768);
        $mobileMax = (int) jankx_get_theme_option('breakpoint_mobile_max', 767);

        $this->breakpoints = [
            'ultrawide' => [
                'min' => $ultrawide,
                'max' => null,
            ],
            'desktop' => [
                'min' => $desktopMin,
                'max' => $ultrawide - 1,
            ],
            'tablet' => [
                'min' => $tabletMin,
                'max' => $desktopMin - 1,
            ],
            'mobile' => [
                'min' => null,
                'max' => $mobileMax,
            ],
        ];
    }

    public function getBreakpoints(): array
    {
        return $this->breakpoints;
    }

    public function getBreakpoint(string $device): ?array
    {
        return $this->breakpoints[$device] ?? null;
    }

    public function getDevices(): array
    {
        return array_keys($this->breakpoints);
    }

    public function getMediaQuery(string $device): string
    {
        $bp = $this->breakpoints[$device] ?? null;
        if (!$bp) {
            return '';
        }

        if ($bp['min'] !== null && $bp['max'] !== null) {
            return sprintf('@media (min-width: %dpx) and (max-width: %dpx)', $bp['min'], $bp['max']);
        }
        if ($bp['min'] !== null) {
            return sprintf('@media (min-width: %dpx)', $bp['min']);
        }
        if ($bp['max'] !== null) {
            return sprintf('@media (max-width: %dpx)', $bp['max']);
        }

        return '';
    }

    public function toArray(): array
    {
        $data = [];
        foreach ($this->breakpoints as $device => $bp) {
            $data[$device] = [
                'min' => $bp['min'],
                'max' => $bp['max'],
            ];
            $data[$device]['mediaQuery'] = $this->getMediaQuery($device);
        }
        return $data;
    }
}
