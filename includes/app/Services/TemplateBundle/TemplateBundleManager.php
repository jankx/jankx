<?php

namespace App\Services\TemplateBundle;

class TemplateBundleManager
{
    protected static ?TemplateBundleManager $instance = null;

    protected array $bundles = [];

    protected bool $loaded = false;

    protected function __construct()
    {
    }

    public static function getInstance(): self
    {
        if (is_null(static::$instance)) {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function loadBundles(): void
    {
        if ($this->loaded) {
            return;
        }

        $bundles = $this->loadFromConfig();

        $bundles = apply_filters('jankx/template_bundles', $bundles);

        foreach ($bundles as $id => $config) {
            $bundle = new TemplateBundle($id, $config);

            $bundle = apply_filters("jankx/template_bundle/{$id}", $bundle);

            $this->bundles[$id] = $bundle;
        }

        uasort($this->bundles, function (TemplateBundle $a, TemplateBundle $b) {
            return $a->getPriority() <=> $b->getPriority();
        });

        do_action('jankx/template_bundles_loaded', $this);

        $this->loaded = true;
    }

    protected function loadFromConfig(): array
    {
        $bundles = [];

        $parentConfig = get_template_directory() . '/config/template-bundles.php';
        if (file_exists($parentConfig)) {
            $data = include $parentConfig;
            if (is_array($data)) {
                $bundles = $data;
            }
        }

        $childConfig = get_stylesheet_directory() . '/config/template-bundles.php';
        if (
            file_exists($childConfig) &&
            realpath($childConfig) !== realpath($parentConfig)
        ) {
            $childData = include $childConfig;
            if (is_array($childData)) {
                $bundles = $this->mergeBundleConfigs($bundles, $childData);
            }
        }

        return $bundles;
    }

    protected function mergeBundleConfigs(array $parent, array $child): array
    {
        $merged = $parent;

        foreach ($child as $id => $config) {
            if (isset($config['__replace']) && $config['__replace'] === true) {
                $merged[$id] = $config;
                unset($merged[$id]['__replace']);
            } elseif (isset($config['__remove']) && $config['__remove'] === true) {
                unset($merged[$id]);
            } else {
                if (isset($merged[$id]) && is_array($merged[$id])) {
                    $merged[$id] = array_replace_recursive($merged[$id], $config);
                } else {
                    $merged[$id] = $config;
                }
            }
        }

        return $merged;
    }

    public function getBundle(string $id): ?TemplateBundle
    {
        $this->loadBundles();

        return $this->bundles[$id] ?? null;
    }

    public function getBundles(): array
    {
        $this->loadBundles();

        return $this->bundles;
    }

    public function getActiveBundleId(): string
    {
        return get_option('jankx_active_template_bundle', '');
    }

    public function getActiveBundle(): ?TemplateBundle
    {
        $id = $this->getActiveBundleId();

        return $id ? $this->getBundle($id) : null;
    }

    public function setActiveBundle(string $bundleId): bool
    {
        if (!$this->getBundle($bundleId)) {
            return false;
        }

        update_option('jankx_active_template_bundle', $bundleId);
        update_option('jankx_template_bundle_activated_at', current_time('mysql'));

        do_action('jankx/template_bundle/activated', $bundleId, $this->getBundle($bundleId));

        return true;
    }

    public function resetActiveBundle(): void
    {
        $activeId = $this->getActiveBundleId();

        delete_option('jankx_active_template_bundle');
        delete_option('jankx_template_bundle_activated_at');

        if ($activeId) {
            do_action('jankx/template_bundle/reset', $activeId);
        }
    }

    public function hasBundle(string $id): bool
    {
        $this->loadBundles();

        return isset($this->bundles[$id]);
    }

    public function count(): int
    {
        $this->loadBundles();

        return count($this->bundles);
    }

    public function getBundlesByTag(string $tag): array
    {
        $this->loadBundles();

        return array_filter($this->bundles, function (TemplateBundle $bundle) use ($tag) {
            return in_array($tag, $bundle->getTags(), true);
        });
    }

    public function getRequiredPlugins(string $bundleId): array
    {
        $bundle = $this->getBundle($bundleId);

        return $bundle ? $bundle->getRequiredPlugins() : [];
    }

    public function getRequiredExtensions(string $bundleId): array
    {
        $bundle = $this->getBundle($bundleId);

        return $bundle ? $bundle->getRequiredExtensions() : [];
    }

    public static function resetInstance(): void
    {
        static::$instance = null;
    }
}
