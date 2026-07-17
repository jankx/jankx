<?php

namespace Jankx\Services\FontIcons\Storage;

class JsonStorage implements IconStorageInterface
{
    protected $cacheDir;

    public function __construct($cacheDir = null)
    {
        $this->cacheDir = $cacheDir ?: $this->getDefaultCacheDirectory();
        
        if (!is_dir($this->cacheDir)) {
            wp_mkdir_p($this->cacheDir);
        }
    }

    protected function getDefaultCacheDirectory()
    {
        $uploadDir = wp_upload_dir();
        return $uploadDir['basedir'] . '/jankx/icons';
    }

    public function store($key, array $data)
    {
        $filePath = $this->getFilePath($key);
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        if (file_put_contents($filePath, $json) === false) {
            throw new \Exception(sprintf('Failed to save JSON cache for key "%s"', $key));
        }

        return true;
    }

    public function retrieve($key)
    {
        $filePath = $this->getFilePath($key);
        
        if (file_exists($filePath)) {
            $json = file_get_contents($filePath);
            return json_decode($json, true);
        }

        return null;
    }

    public function remove($key)
    {
        $filePath = $this->getFilePath($key);
        if (file_exists($filePath)) {
            return unlink($filePath);
        }
        return false;
    }

    public function clear()
    {
        $files = glob($this->cacheDir . '/*.json');
        foreach ($files as $file) {
            unlink($file);
        }
        return true;
    }

    public function getStats()
    {
        $files = glob($this->cacheDir . '/*.json');
        return [
            'type' => 'json',
            'cache_files' => count($files),
            'directory' => $this->cacheDir
        ];
    }

    protected function getFilePath($key)
    {
        // Sử dụng key trực tiếp làm filename (MD5 hash nếu là JSON 'hiện tại')
        return $this->cacheDir . '/' . $key . '.json';
    }
}
