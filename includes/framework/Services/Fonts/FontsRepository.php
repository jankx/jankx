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
     * Lấy tất cả fonts
     */
    public function all()
    {
        $this->initialize();
        return $this->fonts;
    }

    /**
     * Khởi tạo repository với system fonts
     */
    protected function initialize()
    {
        if ($this->initialized) {
            return;
        }

        $this->loadSystemFonts();
        $this->initialized = true;
    }

    /**
     * Load system fonts
     */
    protected function loadSystemFonts()
    {
        $systemFonts = [
            [
                'name' => 'Arial',
                'family' => 'Arial, sans-serif',
                'category' => 'system',
                'variants' => ['400'],
                'subsets' => ['latin'],
                'status' => 'active',
            ],
            [
                'name' => 'Helvetica',
                'family' => 'Helvetica, Arial, sans-serif',
                'category' => 'system',
                'variants' => ['400'],
                'subsets' => ['latin'],
                'status' => 'active',
            ],
            [
                'name' => 'Times New Roman',
                'family' => 'Times New Roman, serif',
                'category' => 'system',
                'variants' => ['400'],
                'subsets' => ['latin'],
                'status' => 'active',
            ],
            [
                'name' => 'Georgia',
                'family' => 'Georgia, serif',
                'category' => 'system',
                'variants' => ['400'],
                'subsets' => ['latin'],
                'status' => 'active',
            ],
            [
                'name' => 'Verdana',
                'family' => 'Verdana, Geneva, sans-serif',
                'category' => 'system',
                'variants' => ['400'],
                'subsets' => ['latin'],
                'status' => 'active',
            ],
            [
                'name' => 'Tahoma',
                'family' => 'Tahoma, Geneva, sans-serif',
                'category' => 'system',
                'variants' => ['400'],
                'subsets' => ['latin'],
                'status' => 'active',
            ],
            [
                'name' => 'Trebuchet MS',
                'family' => 'Trebuchet MS, sans-serif',
                'category' => 'system',
                'variants' => ['400'],
                'subsets' => ['latin'],
                'status' => 'active',
            ],
            [
                'name' => 'Impact',
                'family' => 'Impact, Charcoal, sans-serif',
                'category' => 'system',
                'variants' => ['400'],
                'subsets' => ['latin'],
                'status' => 'active',
            ],
            [
                'name' => 'Comic Sans MS',
                'family' => 'Comic Sans MS, cursive',
                'category' => 'system',
                'variants' => ['400'],
                'subsets' => ['latin'],
                'status' => 'active',
            ],
            [
                'name' => 'Courier New',
                'family' => 'Courier New, monospace',
                'category' => 'system',
                'variants' => ['400'],
                'subsets' => ['latin'],
                'status' => 'active',
            ],
        ];

        foreach ($systemFonts as $fontData) {
            $font = new FontEntity($fontData);
            $this->fonts[$font->getId()] = $font;
        }
    }

    /**
     * Lấy fonts theo category
     */
    public function getByCategory($category)
    {
        $allFonts = $this->all();
        $categoryFonts = [];

        foreach ($allFonts as $font) {
            if ($font->getCategory() === $category) {
                $categoryFonts[$font->getId()] = $font;
            }
        }

        return $categoryFonts;
    }

    /**
     * Lấy font theo ID
     */
    public function find($id)
    {
        $allFonts = $this->all();
        return $allFonts[$id] ?? null;
    }

    /**
     * Lấy font theo name
     */
    public function findByName($name)
    {
        $allFonts = $this->all();

        foreach ($allFonts as $font) {
            if ($font->getName() === $name) {
                return $font;
            }
        }

        return null;
    }

    /**
     * Lấy font theo family
     */
    public function findByFamily($family)
    {
        $allFonts = $this->all();

        foreach ($allFonts as $font) {
            if ($font->getFamily() === $family) {
                return $font;
            }
        }

        return null;
    }

    /**
     * Tìm kiếm fonts
     */
    public function search($query, $category = null)
    {
        $allFonts = $this->all();
        $results = [];

        foreach ($allFonts as $font) {
            // Filter by category if specified
            if ($category && $font->getCategory() !== $category) {
                continue;
            }

            // Search in name and family
            if (stripos($font->getName(), $query) !== false ||
                stripos($font->getFamily(), $query) !== false) {
                $results[$font->getId()] = $font;
            }
        }

        return $results;
    }

    /**
     * Lưu font (chỉ trong memory)
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
    public function update($id, FontEntity $font)
    {
        $this->initialize();
        $existingFont = $this->find($id);
        if (!$existingFont) {
            throw new \InvalidArgumentException("Font with ID {$id} not found");
        }

        // Preserve original ID and created_at
        $fontData = $font->toArray();
        $fontData['id'] = $id;
        $fontData['created_at'] = $existingFont->getCreatedAt();

        $updatedFont = new FontEntity($fontData);
        $this->fonts[$id] = $updatedFont;

        return $updatedFont;
    }

    /**
     * Xóa font
     */
    public function delete($id)
    {
        $this->initialize();

        if (!isset($this->fonts[$id])) {
            return false;
        }

        unset($this->fonts[$id]);
        return true;
    }

    /**
     * Kiểm tra font có tồn tại không
     */
    public function exists($id)
    {
        return $this->find($id) !== null;
    }

    /**
     * Đếm số lượng fonts
     */
    public function count($category = null)
    {
        if ($category) {
            return count($this->getByCategory($category));
        }

        return count($this->all());
    }

    /**
     * Lấy fonts active
     */
    public function getActive($category = null)
    {
        $allFonts = $this->all();
        $activeFonts = [];

        foreach ($allFonts as $font) {
            if (!$font->isActive()) {
                continue;
            }

            if ($category && $font->getCategory() !== $category) {
                continue;
            }

            $activeFonts[$font->getId()] = $font;
        }

        return $activeFonts;
    }

    /**
     * Lấy fonts cho Gutenberg
     */
    public function getForGutenberg()
    {
        $activeFonts = $this->getActive();
        $gutenbergFonts = [];

        foreach ($activeFonts as $font) {
            $gutenbergFonts[] = [
                'name' => $font->getName(),
                'family' => $font->getFamily(),
                'category' => $font->getCategory(),
                'variants' => $font->getVariants(),
                'subsets' => $font->getSubsets(),
                'cssFamily' => $font->getCssFamilyString(),
            ];
        }

        return $gutenbergFonts;
    }

    /**
     * Lấy fonts cho Customizer
     */
    public function getForCustomizer()
    {
        $activeFonts = $this->getActive();
        $customizerFonts = [];

        foreach ($activeFonts as $font) {
            $customizerFonts[$font->getName()] = $font->getCssFamilyString();
        }

        return $customizerFonts;
    }

    /**
     * Lấy fonts cho theme.json
     */
    public function getForThemeJson()
    {
        $activeFonts = $this->getActive();
        $themeJsonFonts = [];

        foreach ($activeFonts as $font) {
            $themeJsonFonts[] = [
                'fontFamily' => $font->getCssFamilyString(),
                'name' => $font->getName(),
                'slug' => sanitize_title($font->getName()),
            ];
        }

        return $themeJsonFonts;
    }

    /**
     * Bulk operations
     */
    public function bulkSave(array $fonts)
    {
        $this->initialize();
        $savedCount = 0;

        foreach ($fonts as $font) {
            if ($font instanceof FontEntity) {
                $this->fonts[$font->getId()] = $font;
                $savedCount++;
            }
        }

        return $savedCount;
    }

    public function bulkDelete(array $ids)
    {
        $this->initialize();
        $deletedCount = 0;

        foreach ($ids as $id) {
            if (isset($this->fonts[$id])) {
                unset($this->fonts[$id]);
                $deletedCount++;
            }
        }

        return $deletedCount;
    }

    /**
     * Import fonts từ array
     */
    public function import(array $fontsData)
    {
        $importedCount = 0;

        foreach ($fontsData as $fontData) {
            try {
                $font = new FontEntity($fontData);
                $this->save($font);
                $importedCount++;
            } catch (\Exception $e) {
                // Log error but continue importing
                error_log("Failed to import font: " . $e->getMessage());
            }
        }

        return $importedCount;
    }

    /**
     * Export fonts to array
     */
    public function export($category = null)
    {
        $fonts = $category ? $this->getByCategory($category) : $this->all();
        $exportData = [];

        foreach ($fonts as $font) {
            $exportData[] = $font->toArray();
        }

        return $exportData;
    }

    /**
     * Clear all fonts (chỉ xóa fonts không phải system)
     */
    public function clear()
    {
        $this->initialize();
        $systemFonts = $this->getByCategory('system');
        $this->fonts = $systemFonts;
        return true;
    }

    /**
     * Get repository statistics
     */
    public function getStats()
    {
        $allFonts = $this->all();
        $stats = [
            'total' => count($allFonts),
            'by_category' => [],
            'active' => 0,
            'inactive' => 0,
        ];

        foreach ($allFonts as $font) {
            $category = $font->getCategory();
            $stats['by_category'][$category] = ($stats['by_category'][$category] ?? 0) + 1;

            if ($font->isActive()) {
                $stats['active']++;
            } else {
                $stats['inactive']++;
            }
        }

        return $stats;
    }

    /**
     * Reset repository về trạng thái ban đầu
     */
    public function reset()
    {
        $this->fonts = [];
        $this->initialized = false;
        $this->initialize();
    }

    /**
     * Get memory usage info
     */
    public function getMemoryInfo()
    {
        return [
            'fonts_count' => count($this->fonts),
            'memory_usage' => memory_get_usage(true),
            'memory_peak' => memory_get_peak_usage(true),
            'initialized' => $this->initialized,
        ];
    }
}
