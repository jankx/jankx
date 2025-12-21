<?php
/**
 * Menu Repository
 * 
 * @package App\MenuBuilder\Database
 * @since 1.0.0
 */

namespace App\MenuBuilder\Database;

use wpdb;

class MenuRepository
{
    /**
     * Database instance
     */
    protected $db;

    /**
     * Table name
     */
    protected $table;

    /**
     * Constructor
     */
    public function __construct()
    {
        global $wpdb;
        $this->db = $wpdb;
        $this->table = $wpdb->prefix . 'jankx_menus';
    }

    /**
     * Get menu by ID
     */
    public function getById($id)
    {
        $sql = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = %d", $id);
        return $this->db->get_row($sql);
    }

    /**
     * Get menu by slug
     */
    public function getBySlug($slug)
    {
        $sql = $this->db->prepare("SELECT * FROM {$this->table} WHERE slug = %s", $slug);
        return $this->db->get_row($sql);
    }

    /**
     * Get all menus
     */
    public function getAll($status = 'active')
    {
        $sql = "SELECT * FROM {$this->table}";
        $where = [];
        
        if ($status) {
            $where[] = $this->db->prepare("status = %s", $status);
        }
        
        if (!empty($where)) {
            $sql .= " WHERE " . implode(' AND ', $where);
        }
        
        $sql .= " ORDER BY name ASC";
        
        return $this->db->get_results($sql);
    }

    /**
     * Create new menu
     */
    public function create($data)
    {
        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = $this->generateSlug($data['name']);
        }

        // Set default values
        $data = array_merge([
            'description' => '',
            'settings' => '{}',
            'status' => 'active',
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ], $data);

        // Encode settings
        if (is_array($data['settings'])) {
            $data['settings'] = json_encode($data['settings']);
        }

        $result = $this->db->insert($this->table, $data, ['%s', '%s', '%s', '%s', '%s', '%s']);

        if ($result !== false) {
            $menuId = $this->db->insert_id;
            do_action('jankx_menu_builder_menu_created', $menuId, $data);
            return $menuId;
        }

        return false;
    }

    /**
     * Update menu
     */
    public function update($id, $data)
    {
        // Update slug if name changed and slug not provided
        if (isset($data['name']) && !isset($data['slug'])) {
            $data['slug'] = $this->generateSlug($data['name'], $id);
        }

        // Encode settings
        if (isset($data['settings']) && is_array($data['settings'])) {
            $data['settings'] = json_encode($data['settings']);
        }

        // Set updated timestamp
        $data['updated_at'] = current_time('mysql');

        $result = $this->db->update($this->table, $data, ['id' => $id], ['%s', '%s', '%s', '%s'], ['%d']);

        if ($result !== false) {
            do_action('jankx_menu_builder_menu_updated', $id, $data);
            return true;
        }

        return false;
    }

    /**
     * Delete menu
     */
    public function delete($id)
    {
        // Delete all menu items first
        $this->db->delete(
            $this->db->prefix . 'jankx_menu_items',
            ['menu_id' => $id],
            ['%d']
        );

        $result = $this->db->delete($this->table, ['id' => $id], ['%d']);

        if ($result !== false) {
            do_action('jankx_menu_builder_menu_deleted', $id);
            return true;
        }

        return false;
    }

    /**
     * Duplicate menu
     */
    public function duplicate($id, $newName = null)
    {
        $menu = $this->getById($id);
        
        if (!$menu) {
            return false;
        }

        $newName = $newName ? $newName : $menu->name . ' (Copy)';
        
        // Create new menu
        $newMenuId = $this->create([
            'name' => $newName,
            'description' => $menu->description,
            'settings' => json_decode($menu->settings, true)
        ]);

        if ($newMenuId) {
            // Copy menu items
            $menuItemRepo = new MenuItemRepository();
            $menuItems = $menuItemRepo->getByMenuId($id);
            
            foreach ($menuItems as $item) {
                $menuItemRepo->create([
                    'menu_id' => $newMenuId,
                    'parent_id' => $item->parent_id,
                    'label' => $item->label,
                    'url' => $item->url,
                    'type' => $item->type,
                    'submenu_type' => $item->submenu_type,
                    'order_index' => $item->order_index,
                    'settings' => json_decode($item->settings, true),
                    'status' => $item->status
]);
            }
        }

        return $newMenuId;
    }

    /**
     * Get menu with items
     */
    public function getMenuWithItems($id)
    {
        $menu = $this->getById($id);
        
        if (!$menu) {
            return null;
        }

        $menuItemRepo = new MenuItemRepository();
        $menu->items = $menuItemRepo->getTreeByMenuId($id);
        $menu->settings = json_decode($menu->settings, true);

        return $menu;
    }

    /**
     * Search menus
     */
    public function search($term, $status = 'active')
    {
        $sql = "SELECT * FROM {$this->table} WHERE (name LIKE %s OR description LIKE %s OR slug LIKE %s)";
        $params = ['%' . $this->db->esc_like($term) . '%', '%' . $this->db->esc_like($term) . '%', '%' . $this->db->esc_like($term) . '%'];
        
        if ($status) {
            $sql .= " AND status = %s";
            $params[] = $status;
        }
        
        $sql .= " ORDER BY name ASC";
        
        $prepared_sql = $this->db->prepare($sql, $params);
        return $this->db->get_results($prepared_sql);
    }

    /**
     * Get menu count by status
     */
    public function getCountByStatus($status = 'active')
    {
        $sql = $this->db->prepare("SELECT COUNT(*) FROM {$this->table} WHERE status = %s", $status);
        return (int)$this->db->get_var($sql);
    }

    /**
     * Generate unique slug
     */
    protected function generateSlug($name, $excludeId = null)
    {
        $slug = sanitize_title($name);
        $originalSlug = $slug;
        $counter = 1;

        while ($this->slugExists($slug, $excludeId)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Check if slug exists
     */
    protected function slugExists($slug, $excludeId = null)
    {
        $sql = "SELECT COUNT(*) FROM {$this->table} WHERE slug = %s";
        $params = [$slug];
        
        if ($excludeId) {
            $sql .= " AND id != %d";
            $params[] = $excludeId;
        }
        
        $prepared_sql = $this->db->prepare($sql, $params);
        return (int)$this->db->get_var($prepared_sql) > 0;
    }

    /**
     * Get menu settings
     */
    public function getSettings($id)
    {
        $menu = $this->getById($id);
        
        if (!$menu) {
            return [];
        }

        return json_decode($menu->settings, true) ?: [];
    }

    /**
     * Update menu settings
     */
    public function updateSettings($id, $settings)
    {
        return $this->update($id, [
            'settings' => $settings
        ]);
    }

    /**
     * Get menu statistics
     */
    public function getStatistics($id)
    {
        $menuItemRepo = new MenuItemRepository();
        
        return [
            'total_items' => $menuItemRepo->getCountByMenuId($id),
            'active_items' => $menuItemRepo->getCountByMenuId($id, 'active'),
            'inactive_items' => $menuItemRepo->getCountByMenuId($id, 'inactive'),
            'max_depth' => $menuItemRepo->getMaxDepth($id),
            'submenu_types' => $menuItemRepo->getSubmenuTypeDistribution($id)
        ];
    }
}
