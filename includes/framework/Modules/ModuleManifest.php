<?php

/**
 * Module Manifest for Jankx Theme Framework
 *
 * @package Jankx\Framework\Modules
 */

namespace Jankx\Modules;

class ModuleManifest implements \Jankx\Contracts\ModuleManifest
{
    protected $name;
    protected $version;
    protected $description;
    protected $author;
    protected $author_url;
    protected $homepage;
    protected $license;
    protected $license_url;
    protected $requires;
    protected $tested;
    protected $requires_php;
    protected $dependencies;
    protected $tags;
    protected $screenshots;
    protected $changelog;
    protected $download_url;
    protected $last_updated;
    protected $readme_url;
    protected $support_url;
    protected $documentation_url;
    public function __construct($manifest_data = [])
    {
        $this->set_properties($manifest_data);
    }

    /**
     * Set manifest properties
     */
    protected function set_properties($data)
    {
        $properties = [
            'name', 'version', 'description', 'author', 'author_url',
            'homepage', 'license', 'license_url', 'requires', 'tested',
            'requires_php', 'dependencies', 'tags', 'screenshots',
            'changelog', 'download_url', 'last_updated', 'readme_url',
            'support_url', 'documentation_url'
        ];
        foreach ($properties as $property) {
            if (isset($data[$property])) {
                $this->$property = $data[$property];
            }
        }
    }

    /**
     * Load manifest from file
     */
    public static function from_file($file_path)
    {
        if (!file_exists($file_path)) {
            return null;
        }

        $content = file_get_contents($file_path);
        $data = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return null;
        }

        return new self($data);
    }

    /**
     * Save manifest to file
     */
    public function save_to_file($file_path)
    {
        $data = $this->to_array();
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        return file_put_contents($file_path, $json);
    }

    /**
     * Convert to array
     */
    public function to_array()
    {
        $data = [];
        $properties = [
            'name', 'version', 'description', 'author', 'author_url',
            'homepage', 'license', 'license_url', 'requires', 'tested',
            'requires_php', 'dependencies', 'tags', 'screenshots',
            'changelog', 'download_url', 'last_updated', 'readme_url',
            'support_url', 'documentation_url'
        ];
        foreach ($properties as $property) {
            if (isset($this->$property)) {
                $data[$property] = $this->$property;
            }
        }

        return $data;
    }

    /**
     * Check if module needs update
     */
    public function needs_update($current_version)
    {
        return version_compare($this->version, $current_version, '>');
    }

    /**
     * Check if module is compatible with current WordPress version
     */
    public function is_compatible_with_wp($wp_version)
    {
        if (empty($this->requires)) {
            return true;
        }

        return version_compare($wp_version, $this->requires, '>=');
    }

    /**
     * Check if module is compatible with current PHP version
     */
    public function is_compatible_with_php($php_version)
    {
        if (empty($this->requires_php)) {
            return true;
        }

        return version_compare($php_version, $this->requires_php, '>=');
    }

    /**
     * Get property value
     */
    public function get($property, $default = null)
    {
        return $this->$property ?? $default;
    }

    /**
     * Set property value
     */
    public function set($property, $value)
    {
        $this->$property = $value;
        return $this;
    }

    /**
     * Get changelog for specific version
     */
    public function get_changelog($version = null)
    {
        if (empty($this->changelog)) {
            return [];
        }

        if ($version === null) {
            return $this->changelog;
        }

        return $this->changelog[$version] ?? [];
    }

    /**
     * Get latest changelog
     */
    public function get_latest_changelog()
    {
        if (empty($this->changelog)) {
            return [];
        }

        $versions = array_keys($this->changelog);
        $latest_version = end($versions);
        return $this->changelog[$latest_version] ?? [];
    }

    /**
     * Validate manifest
     */
    public function is_valid()
    {
        $required_fields = ['name', 'version', 'description', 'author'];
        foreach ($required_fields as $field) {
            if (empty($this->$field)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get formatted version info
     */
    public function get_version_info()
    {
        return [
            'current' => $this->version,
            'requires' => $this->requires,
            'tested' => $this->tested,
            'requires_php' => $this->requires_php,
            'last_updated' => $this->last_updated,
        ];
    }

    /**
     * Get download info
     */
    public function get_download_info()
    {
        return [
            'download_url' => $this->download_url,
            'homepage' => $this->homepage,
            'license' => $this->license,
            'license_url' => $this->license_url,
        ];
    }

    /**
     * Get support info
     */
    public function get_support_info()
    {
        return [
            'support_url' => $this->support_url,
            'documentation_url' => $this->documentation_url,
            'readme_url' => $this->readme_url,
            'author_url' => $this->author_url,
        ];
    }

    // Interface implementation methods

    public function loadFromFile(string $filePath): bool
    {
        if (!file_exists($filePath)) {
            return false;
        }

        $data = json_decode(file_get_contents($filePath), true);
        if (!$data) {
            return false;
        }

        $this->setData($data);
        return true;
    }

    public function saveToFile(string $filePath): bool
    {
        $data = $this->getData();
        return file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT)) !== false;
    }

    public function getData(): array
    {
        return [
            'module_id' => $this->module_id,
            'name' => $this->name,
            'version' => $this->version,
            'description' => $this->description,
            'author' => $this->author,
            'homepage' => $this->homepage,
            'license' => $this->license,
            'dependencies' => $this->dependencies,
            'requirements' => $this->requirements,
            'caller' => $this->caller,
            'blocks' => $this->blocks,
            'assets' => $this->assets,
            'hooks' => $this->hooks,
        ];
    }

    public function setData(array $data): void
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }

    public function getModuleId(): string
    {
        return $this->module_id ?? '';
    }

    public function setModuleId(string $moduleId): void
    {
        $this->module_id = $moduleId;
    }

    public function getName(): string
    {
        return $this->name ?? '';
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getVersion(): string
    {
        return $this->version ?? '';
    }

    public function setVersion(string $version): void
    {
        $this->version = $version;
    }

    public function getDescription(): string
    {
        return $this->description ?? '';
    }

    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    public function getAuthor(): string
    {
        return $this->author ?? '';
    }

    public function setAuthor(string $author): void
    {
        $this->author = $author;
    }

    public function getHomepage(): string
    {
        return $this->homepage ?? '';
    }

    public function setHomepage(string $homepage): void
    {
        $this->homepage = $homepage;
    }

    public function getLicense(): string
    {
        return $this->license ?? '';
    }

    public function setLicense(string $license): void
    {
        $this->license = $license;
    }

    public function getDependencies(): array
    {
        return $this->dependencies ?? [];
    }

    public function setDependencies(array $dependencies): void
    {
        $this->dependencies = $dependencies;
    }

    public function getRequirements(): array
    {
        return $this->requirements ?? [];
    }

    public function setRequirements(array $requirements): void
    {
        $this->requirements = $requirements;
    }

    public function getCaller(): array
    {
        return $this->caller ?? [];
    }

    public function setCaller(array $caller): void
    {
        $this->caller = $caller;
    }

    public function getBlocks(): array
    {
        return $this->blocks ?? [];
    }

    public function setBlocks(array $blocks): void
    {
        $this->blocks = $blocks;
    }

    public function getAssets(): array
    {
        return $this->assets ?? [];
    }

    public function setAssets(array $assets): void
    {
        $this->assets = $assets;
    }

    public function getHooks(): array
    {
        return $this->hooks ?? [];
    }

    public function setHooks(array $hooks): void
    {
        $this->hooks = $hooks;
    }

    public function validate(): bool
    {
        return $this->is_valid();
    }

    public function getValidationErrors(): array
    {
        $errors = [];
        $required_fields = ['name', 'version', 'description', 'author'];
        foreach ($required_fields as $field) {
            if (empty($this->$field)) {
                $errors[] = "Missing required field: {$field}";
            }
        }

        return $errors;
    }

    public function isValid(): bool
    {
        return $this->validate();
    }

    public function compareVersion(\Jankx\Contracts\ModuleManifest $other): int
    {
        return version_compare($this->getVersion(), $other->getVersion());
    }

    public function isNewerThan(\Jankx\Contracts\ModuleManifest $other): bool
    {
        return $this->compareVersion($other) > 0;
    }

    public function isOlderThan(\Jankx\Contracts\ModuleManifest $other): bool
    {
        return $this->compareVersion($other) < 0;
    }

    public function isCompatibleWith(\Jankx\Contracts\ModuleManifest $other): bool
    {
        // TODO: Implement compatibility check logic
        return true;
    }
}
