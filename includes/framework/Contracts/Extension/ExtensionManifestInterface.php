<?php

namespace Jankx\Contracts\Extension;

/**
 * Extension Manifest Interface
 *
 * Contract cho extension manifest trong Jankx framework
 */
interface ExtensionManifestInterface
{
    /**
     * Load manifest from file
     *
     * @param string $filePath
     * @return bool
     */
    public function loadFromFile(string $filePath): bool;

    /**
     * Save manifest to file
     *
     * @param string $filePath
     * @return bool
     */
    public function saveToFile(string $filePath): bool;

    /**
     * Get manifest data
     *
     * @return array
     */
    public function getData(): array;

    /**
     * Set manifest data
     *
     * @param array $data
     * @return void
     */
    public function setData(array $data): void;

    /**
     * Get extension ID
     *
     * @return string
     */
    public function getExtensionId(): string;

    /**
     * Set extension ID
     *
     * @param string $extensionId
     * @return void
     */
    public function setExtensionId(string $extensionId): void;

    /**
     * Get extension name
     *
     * @return string
     */
    public function getName(): string;

    /**
     * Set extension name
     *
     * @param string $name
     * @return void
     */
    public function setName(string $name): void;

    /**
     * Get extension version
     *
     * @return string
     */
    public function getVersion(): string;

    /**
     * Set extension version
     *
     * @param string $version
     * @return void
     */
    public function setVersion(string $version): void;

    /**
     * Get extension description
     *
     * @return string
     */
    public function getDescription(): string;

    /**
     * Set extension description
     *
     * @param string $description
     * @return void
     */
    public function setDescription(string $description): void;

    /**
     * Get extension author
     *
     * @return string
     */
    public function getAuthor(): string;

    /**
     * Set extension author
     *
     * @param string $author
     * @return void
     */
    public function setAuthor(string $author): void;

    /**
     * Get extension homepage
     *
     * @return string
     */
    public function getHomepage(): string;

    /**
     * Set extension homepage
     *
     * @param string $homepage
     * @return void
     */
    public function setHomepage(string $homepage): void;

    /**
     * Get extension license
     *
     * @return string
     */
    public function getLicense(): string;

    /**
     * Set extension license
     *
     * @param string $license
     * @return void
     */
    public function setLicense(string $license): void;

    /**
     * Get extension dependencies
     *
     * @return array
     */
    public function getDependencies(): array;

    /**
     * Set extension dependencies
     *
     * @param array $dependencies
     * @return void
     */
    public function setDependencies(array $dependencies): void;

    /**
     * Get extension requirements
     *
     * @return array
     */
    public function getRequirements(): array;

    /**
     * Set extension requirements
     *
     * @param array $requirements
     * @return void
     */
    public function setRequirements(array $requirements): void;

    /**
     * Get caller configuration
     *
     * @return array
     */
    public function getCaller(): array;

    /**
     * Set caller configuration
     *
     * @param array $caller
     * @return void
     */
    public function setCaller(array $caller): void;

    /**
     * Get blocks configuration
     *
     * @return array
     */
    public function getBlocks(): array;

    /**
     * Set blocks configuration
     *
     * @param array $blocks
     * @return void
     */
    public function setBlocks(array $blocks): void;

    /**
     * Get assets configuration
     *
     * @return array
     */
    public function getAssets(): array;

    /**
     * Set assets configuration
     *
     * @param array $assets
     * @return void
     */
    public function setAssets(array $assets): void;

    /**
     * Get hooks configuration
     *
     * @return array
     */
    public function getHooks(): array;

    /**
     * Set hooks configuration
     *
     * @param array $hooks
     * @return void
     */
    public function setHooks(array $hooks): void;

    /**
     * Validate manifest
     *
     * @return bool
     */
    public function validate(): bool;

    /**
     * Get validation errors
     *
     * @return array
     */
    public function getValidationErrors(): array;

    /**
     * Check if manifest is valid
     *
     * @return bool
     */
    public function isValid(): bool;

    /**
     * Compare version with another manifest
     *
     * @param ExtensionManifestInterface $other
     * @return int
     */
    public function compareVersion(ExtensionManifestInterface $other): int;

    /**
     * Check if this manifest is newer than another
     *
     * @param ExtensionManifestInterface $other
     * @return bool
     */
    public function isNewerThan(ExtensionManifestInterface $other): bool;

    /**
     * Check if this manifest is older than another
     *
     * @param ExtensionManifestInterface $other
     * @return bool
     */
    public function isOlderThan(ExtensionManifestInterface $other): bool;

    /**
     * Check if this manifest is compatible with another
     *
     * @param ExtensionManifestInterface $other
     * @return bool
     */
    public function isCompatibleWith(ExtensionManifestInterface $other): bool;
}
