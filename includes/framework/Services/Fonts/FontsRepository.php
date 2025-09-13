<?php

namespace Jankx\Services\Fonts;

/**
 * FontsRepository để thống nhất quản lý fonts trong memory
 * Không lưu trữ vào database, chỉ quản lý trong session/memory
 */
class FontsRepository
{
    protected $fonts = [];
    protected $initialized = false;

    /**
     * Khởi tạo repository và load system fonts
     */
    public function initialize()
    {
        if ($this->initialized) {
            return;
        }

        $this->loadSystemFonts();
        $this->initialized = true;
    }

    /**
     * Load system fonts vào memory
     */
    protected function loadSystemFonts()
    {
        $systemFonts = [
            'Arial' => new FontEntity([
                'name' => 'Arial',
                'family' => 'Arial, sans-serif',
                'category' => 'system',
                'status' => 'active',
            ]),
            'Helvetica' => new FontEntity([
                'name' => 'Helvetica',
                'family' => 'Helvetica, sans-serif',
                'category' => 'system',
                'status' => 'active',
            ]),
            'Times New Roman' => new FontEntity([
                'name' => 'Times New Roman',
                'family' => 'Times New Roman, serif',
                'category' => 'system',
                'status' => 'active',
            ]),
            'Georgia' => new FontEntity([
                'name' => 'Georgia',
                'family' => 'Georgia, serif',
                'category' => 'system',
                'status' => 'active',
            ]),
            'Verdana' => new FontEntity([
                'name' => 'Verdana',
                'family' => 'Verdana, sans-serif',
                'category' => 'system',
                'status' => 'active',
            ]),
            'Courier New' => new FontEntity([
                'name' => 'Courier New',
                'family' => 'Courier New, monospace',
                'category' => 'system',
                'status' => 'active',
            ]),
        ];

        foreach ($systemFonts as $font) {
            $this->fonts[$font->getId()] = $font;
        }
    }

    /**
     * Lưu font vào repository
     */
    public function save(FontEntity $font)
    {
        // Validate font data
        $validation = $font->validate();
        if ($validation !== true) {
            throw new \InvalidArgumentException('Invalid font data: ' . implode(', ', $validation));
        }

        $this->initialize();
        $fontId = $font->getId();

        // Kiểm tra font đã tồn tại chưa
        if (isset($this->fonts[$fontId])) {
            $this->fonts[$fontId] = $font;
        } else {
            $this->fonts[$fontId] = $font;
        }

        return $font;
    }

    /**
     * Cập nhật font
     */
    public function update(FontEntity $font)
    {
        return $this->save($font);
    }

    /**
     * Xóa font
     */
    public function delete($fontId)
    {
        $this->initialize();

        if (isset($this->fonts[$fontId])) {
            unset($this->fonts[$fontId]);
            return true;
        }

        return false;
    }

    /**
     * Tìm font theo ID
     */
    public function find($fontId)
    {
        $this->initialize();

        return isset($this->fonts[$fontId]) ? $this->fonts[$fontId] : null;
    }

    /**
     * Lấy tất cả fonts
     */
    public function all()
    {
        $this->initialize();

        return $this->fonts;
    }

    /**
     * Lấy fonts theo category
     */
    public function getByCategory($category)
    {
        $this->initialize();

        $categoryFonts = [];
        foreach ($this->fonts as $font) {
            if ($font->getCategory() === $category) {
                $categoryFonts[$font->getId()] = $font;
            }
        }

        return $categoryFonts;
    }

    /**
     * Tìm kiếm fonts
     */
    public function search($query)
    {
        $this->initialize();

        $results = [];
        $query = strtolower($query);

        foreach ($this->fonts as $font) {
            if (strpos(strtolower($font->getName()), $query) !== false ||
                strpos(strtolower($font->getFamily()), $query) !== false) {
                $results[$font->getId()] = $font;
            }
        }

        return $results;
    }

    /**
     * Lấy active fonts
     */
    public function getActive()
    {
        $this->initialize();

        $activeFonts = [];
        foreach ($this->fonts as $font) {
            if ($font->getStatus() === 'active') {
                $activeFonts[] = $font;
            }
        }

        return $activeFonts;
    }



}