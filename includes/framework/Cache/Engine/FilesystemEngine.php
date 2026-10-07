<?php

namespace Jankx\Cache\Engine;

/**
 * File based engine: one serialized file per entry, written atomically
 * (tmp file + rename) so a reader never observes a partial page.
 *
 * Used whenever the site has no persistent object cache, and as the storage
 * of the page cache on servers without an edge cache.
 *
 * @package Jankx\Cache\Engine
 * @since 2.0.0
 */
class FilesystemEngine extends AbstractEngine
{
    /**
     * Sanitized keys are capped, the hash keeps them collision free.
     */
    const KEY_LIMIT = 80;

    /**
     * @var string
     */
    private $directory;

    /**
     * @var int
     */
    private $mode;

    /**
     * @param string $prefix      Key prefix.
     * @param string $defaultGroup Group used when none is given.
     * @param string $directory   Base directory.
     * @param int    $mode        Directory permissions.
     */
    public function __construct(
        string $prefix = 'jankx',
        string $defaultGroup = 'cache',
        string $directory = '',
        int $mode = 0755
    ) {
        parent::__construct($prefix, $defaultGroup);

        $this->directory = $directory !== '' ? rtrim($directory, '/') : self::defaultDirectory();
        $this->mode = $mode > 0 ? $mode : 0755;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return 'file';
    }

    /**
     * @inheritdoc
     */
    public function isPersistent(): bool
    {
        return true;
    }

    /**
     * @return string Base directory used when none was configured.
     */
    public static function defaultDirectory(): string
    {
        $contentDir = defined('WP_CONTENT_DIR') ? WP_CONTENT_DIR : (function_exists('get_temp_dir') ? get_temp_dir() : sys_get_temp_dir());

        return rtrim($contentDir, '/') . '/cache/jankx';
    }

    /**
     * @return string
     */
    public function getDirectory(): string
    {
        return $this->directory;
    }

    /**
     * @inheritdoc
     */
    protected function read(string $key, string $group): array
    {
        $file = $this->pathFor($key, $group);
        if ($file === null || !is_file($file)) {
            return ['value' => null, 'found' => false];
        }

        $raw = @file_get_contents($file);
        if ($raw === false || $raw === '') {
            return ['value' => null, 'found' => false];
        }

        $payload = @unserialize($raw);
        if (!is_array($payload) || !array_key_exists('value', $payload)) {
            // Corrupt entry: drop it instead of poisoning the cache forever.
            @unlink($file);

            return ['value' => null, 'found' => false];
        }

        if (isset($payload['expires']) && (int) $payload['expires'] > 0 && (int) $payload['expires'] <= time()) {
            @unlink($file);

            return ['value' => null, 'found' => false];
        }

        return ['value' => $payload['value'], 'found' => true];
    }

    /**
     * @inheritdoc
     */
    protected function write(string $key, $value, int $ttl, string $group): bool
    {
        $file = $this->pathFor($key, $group, true);
        if ($file === null) {
            return false;
        }

        $payload = serialize([
            'expires' => $ttl > 0 ? time() + $ttl : 0,
            'value' => $value,
        ]);

        $tmp = $file . '.' . uniqid('tmp', true);
        if (@file_put_contents($tmp, $payload, LOCK_EX) === false) {
            return false;
        }

        if (!@rename($tmp, $file)) {
            @unlink($tmp);

            return false;
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    protected function erase(string $key, string $group): bool
    {
        $file = $this->pathFor($key, $group);
        if ($file === null || !is_file($file)) {
            return false;
        }

        return (bool) @unlink($file);
    }

    /**
     * @inheritdoc
     */
    protected function eraseGroup(string $group): bool
    {
        if ($group === '') {
            return $this->eraseEverything();
        }

        $dir = $this->directoryFor($group);
        if (!is_dir($dir)) {
            return true;
        }

        $ok = true;
        foreach ((array) glob($dir . '/*.cache') as $file) {
            if (is_string($file)) {
                $ok = @unlink($file) && $ok;
            }
        }

        return $ok;
    }

    /**
     * Drop every group directory (and any loose file) of this engine.
     *
     * @return bool
     */
    private function eraseEverything(): bool
    {
        if (!is_dir($this->directory)) {
            return true;
        }

        $ok = true;

        foreach ((array) glob($this->directory . '/*.cache') as $file) {
            if (is_string($file)) {
                $ok = @unlink($file) && $ok;
            }
        }

        foreach ((array) glob($this->directory . '/*', GLOB_ONLYDIR) as $dir) {
            if (!is_string($dir)) {
                continue;
            }
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::CHILD_FIRST
            );
            foreach ($iterator as $item) {
                $item->isDir() ? @rmdir($item->getPathname()) : @unlink($item->getPathname());
            }
            $ok = @rmdir($dir) && $ok;
        }

        return $ok;
    }

    /**
     * Keys become safe file names; a hash keeps them unique after sanitizing.
     *
     * @inheritdoc
     */
    protected function normalizeKey(string $key): string
    {
        $safe = preg_replace('/[^A-Za-z0-9_\-]/', '_', $key);
        $safe = is_string($safe) ? $safe : 'key';

        if (strlen($safe) > self::KEY_LIMIT) {
            $safe = substr($safe, 0, self::KEY_LIMIT - 41) . '_' . sha1($key);
        } else {
            $safe .= '_' . substr(sha1($key), 0, 8);
        }

        return $safe;
    }

    /**
     * @param string $key   Normalized key.
     * @param string $group Normalized group.
     * @param bool   $create Create the directory when missing.
     * @return string|null
     */
    private function pathFor(string $key, string $group, bool $create = false): ?string
    {
        $dir = $this->directoryFor($group);
        if (!is_dir($dir)) {
            if (!$create) {
                return null;
            }
            if (!@mkdir($dir, $this->mode, true) && !is_dir($dir)) {
                if (function_exists('wp_mkdir_p') && wp_mkdir_p($dir)) {
                    return $dir . '/' . $key . '.cache';
                }

                return null;
            }
        }

        return $dir . '/' . $key . '.cache';
    }

    /**
     * @param string $group Normalized group.
     * @return string
     */
    private function directoryFor(string $group): string
    {
        $safe = preg_replace('/[^A-Za-z0-9_\-]/', '_', $group);
        $safe = is_string($safe) && $safe !== '' ? $safe : 'cache';

        return $this->directory . '/' . $this->prefix . '_' . $safe;
    }
}
