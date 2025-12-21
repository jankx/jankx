<?php
/**
 * Menu Item Repository
 * 
 * @package App\MenuBuilder\Database
 * @since 1.0.0
 */

namespace App\MenuBuilder\Database;

use wpdb;

class MenuItemRepository
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
        $this->table = $wpdb->prefix . 'jankx_menu_items';
    }

    /**
     * Get menu item by ID
     */
    public function getById($id)
    {
        $sql = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = %d", $id);
        return $this->db->get_row($sql);
    }

    /**
     * Get items by menu ID
     */
    public function getByMenuId($menuId, $status = 'active')
    {
        $sql = "SELECT * FROM {$this->table} WHERE menu_id = %d AND parent_id = 0";
        $params = [$menuId];
        
        if ($status) {
            $sql .= " AND status = %s";
            $params[] = $status;
        }
        
        $sql .= " ORDER BY order_index ASC";
        
        $prepared_sql = $this->db->prepare($sql, $params);
        return $this->db->get_results($prepared_sql);
    }

    /**
     * Get tree structure by menu ID
     */
    public function getTreeByMenuId($menuId, $status = 'active')
    {
        $items = $this->getByMenuId($menuId, $status);
        $tree = [];

        foreach ($items as $item) {
            $tree[] = $this->buildItemTree($item, $status);
        }

        return $tree;
    }

    /**
     * Build item tree with children
     */
    protected function buildItemTree($item, $status = 'active')
    {
        $item->settings = json_decode($item->settings, true) ?: [];
        $item->children = $this->getChildren($item->id, $status);

        foreach ($item->children as $child) {
            $child = $this->buildItemTree($child, $status);
        }

        return $item;
    }

    /**
     * Get children items
     */
    public function getChildren($parentId, $status = 'active')
    {
        $sql = "SELECT * FROM {$this->table} WHERE parent_id = %d";
        $params = [$parentId];
        
        if ($status) {
            $sql .= " AND status = %s";
            $params[] = $status;
        }
        
        $sql .= " ORDER BY order_index ASC";
        
        $prepared_sql = $this->db->prepare($sql, $params);
        return $this->db->get_results($prepared_sql);
    }

    /**
     * Create new menu item
     */
    public function create($data)
    {
        // Set default values
        $data = array_merge([
            'parent_id' => 0,
            'url' => '#',
            'type' => 'link',
            'submenu_type' => 'multilevel',
            'order_index' => $this->getNextOrderIndex($data['menu_id'], $data['parent_id']),
            'settings' => '{}',
            'status' => 'active',
            'created_at' => current_time('mysql'),
            'updated_at' => current_time('mysql')
        ], $data);

        // Encode settings
        if (is_array($data['settings'])) {
            $data['settings'] = json_encode($data['settings']);
        }

        $result = $this->db->insert($this->table, $data, ['%d', '%d', '%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s']);

        if ($result !== false) {
            $itemId = $this->db->insert_id;
            do_action('jankx_menu_builder_menu_item_created', $itemId, $data['menu_id']);
            return $itemId;
        }

        return false;
    }

    /**
     * Update menu item
     */
    public function update($id, $data)
    {
        // Encode settings
        if (isset($data['settings']) && is_array($data['settings'])) {
            $data['settings'] = json_encode($data['settings']);
        }

        // Set updated timestamp
        $data['updated_at'] = current_time('mysql');

        $result = $this->db->update($this->table, $data, ['id' => $id], ['%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s', '%s'], ['%d']);

        if ($result !== false) {
            $item = $this->getById($id);
            do_action('jankx_menu_builder_menu_item_updated', $id, $item->menu_id);
            return true;
        }

        return false;
    }

    /**
     * Delete menu item
     */
    public function delete($id)
    {
        $item = $this->getById($id);
        
        if (!$item) {
            return false;
        }

        // Delete children first
        $this->deleteChildren($id);

        $result = $this->db->delete($this->table, ['id' => $id], ['%d']);

        if ($result !== false) {
            do_action('jankx_menu_builder_menu_item_deleted', $id, $item->menu_id);
            return true;
        }

        return false;
    }

    /**
     * Delete children items
     */
    protected function deleteChildren($parentId)
    {
        $children = $this->getChildren($parentId, null); // Get all children regardless of status

        foreach ($children as $child) {
            $this->delete($child->id);
        }
    }

    /**
     * Move item to new parent
     */
    public function moveToParent($itemId, $newParentId, $newOrderIndex = null)
    {
        $item = $this->getById($itemId);
        
        if (!$item) {
            return false;
        }

        $data = [
            'parent_id' => $newParentId
        ];

        if ($newOrderIndex !== null) {
            $data['order_index'] = $newOrderIndex;
        } else {
            $data['order_index'] = $this->getNextOrderIndex($item->menu_id, $newParentId);
        }

        return $this->update($itemId, $data);
    }

    /**
     * Reorder items
     */
    public function reorder($itemIds)
    {
        $success = true;

        foreach ($itemIds as $orderIndex => $itemId) {
            $result = $this->update($itemId, [
                'order_index' => $orderIndex
            ]);

            if (!$result) {
                $success = false;
            }
        }

        return $success;
    }

    /**
     * Get next order index
     */
    protected function getNextOrderIndex($menuId, $parentId = 0)
    {
        $sql = $this->db->prepare("SELECT MAX(order_index) FROM {$this->table} WHERE menu_id = %d AND parent_id = %d", $menuId, $parentId);
        $maxOrder = $this->db->get_var($sql);

        return $maxOrder ? (int)$maxOrder + 1 : 0;
    }

    /**
     * Get count by menu ID
     */
    public function getCountByMenuId($menuId, $status = 'active')
    {
        $sql = "SELECT COUNT(*) FROM {$this->table} WHERE menu_id = %d";
        $params = [$menuId];
        
        if ($status) {
            $sql .= " AND status = %s";
            $params[] = $status;
        }
        
        $prepared_sql = $this->db->prepare($sql, $params);
        return (int)$this->db->get_var($prepared_sql);
    }

    /**
     * Get max depth for menu
     */
    public function getMaxDepth($menuId)
    {
        $maxDepth = 0;
        $items = $this->getByMenuId($menuId, null);

        foreach ($items as $item) {
            $depth = $this->getItemDepth($item);
            if ($depth > $maxDepth) {
                $maxDepth = $depth;
            }
        }

        return $maxDepth;
    }

    /**
     * Get item depth
     */
    protected function getItemDepth($item, $currentDepth = 0)
    {
        $children = $this->getChildren($item->id, null);
        $maxChildDepth = $currentDepth;

        foreach ($children as $child) {
            $childDepth = $this->getItemDepth($child, $currentDepth + 1);
            if ($childDepth > $maxChildDepth) {
                $maxChildDepth = $childDepth;
            }
        }

        return $maxChildDepth;
    }

    /**
     * Get submenu type distribution
     */
    public function getSubmenuTypeDistribution($menuId)
    {
        $distribution = [
            'multilevel' => 0,
            'mega' => 0,
            'flyout' => 0,
            'none' => 0
        ];

        $items = $this->getByMenuId($menuId, null);

        foreach ($items as $item) {
            $children = $this->getChildren($item->id, null);
            if (count($children) > 0) {
                $submenuType = $item->submenu_type ?: 'multilevel';
                if (isset($distribution[$submenuType])) {
                    $distribution[$submenuType]++;
                }
            }
        }

        return $distribution;
    }

    /**
     * Search menu items
     */
    public function search($menuId, $term, $status = 'active')
    {
        $sql = "SELECT * FROM {$this->table} WHERE menu_id = %d AND (label LIKE %s OR url LIKE %s)";
        $params = [$menuId, '%' . $this->db->esc_like($term) . '%', '%' . $this->db->esc_like($term) . '%'];
        
        if ($status) {
            $sql .= " AND status = %s";
            $params[] = $status;
        }
        
        $sql .= " ORDER BY order_index ASC";
        
        $prepared_sql = $this->db->prepare($sql, $params);
        return $this->db->get_results($prepared_sql);
    }

    /**
     * Get items by type
     */
    public function getByType($menuId, $type, $status = 'active')
    {
        $sql = "SELECT * FROM {$this->table} WHERE menu_id = %d AND type = %s";
        $params = [$menuId, $type];
        
        if ($status) {
            $sql .= " AND status = %s";
            $params[] = $status;
        }
        
        $sql .= " ORDER BY order_index ASC";
        
        $prepared_sql = $this->db->prepare($sql, $params);
        return $this->db->get_results($prepared_sql);
    }

    /**
     * Get items by submenu type
     */
    public function getBySubmenuType($menuId, $submenuType, $status = 'active')
    {
        $sql = "SELECT * FROM {$this->table} WHERE menu_id = %d AND submenu_type = %s";
        $params = [$menuId, $submenuType];
        
        if ($status) {
            $sql .= " AND status = %s";
            $params[] = $status;
        }
        
        $sql .= " ORDER BY order_index ASC";
        
        $prepared_sql = $this->db->prepare($sql, $params);
        return $this->db->get_results($prepared_sql);
    }

    /**
     * Toggle item status
     */
    public function toggleStatus($id)
    {
        $item = $this->getById($id);
        
        if (!$item) {
            return false;
        }

        $newStatus = $item->status === 'active' ? 'inactive' : 'active';
        
        return $this->update($id, [
            'status' => $newStatus
        ]);
    }

    /**
     * Bulk update items
     */
    public function bulkUpdate($itemIds, $data)
    {
        if (empty($itemIds)) {
            return false;
        }

        // Encode settings if needed
        if (isset($data['settings']) && is_array($data['settings'])) {
            $data['settings'] = json_encode($data['settings']);
        }

        // Set updated timestamp
        $data['updated_at'] = current_time('mysql');

        // Create IN clause for IDs
        $placeholders = implode(',', array_fill(0, count($itemIds), '%d'));
        $sql = "UPDATE {$this->table} SET updated_at = %s";
        $params = [$data['updated_at']];

        foreach ($data as $key => $value) {
            if ($key !== 'updated_at') {
                $sql .= ", {$key} = %s";
                $params[] = $value;
            }
        }

        $sql .= " WHERE id IN ({$placeholders})";
        $params = array_merge($params, $itemIds);

        $prepared_sql = $this->db->prepare($sql, $params);
        $result = $this->db->query($prepared_sql);

        if ($result !== false) {
            // Get menu IDs for hooks
            $placeholders = implode(',', array_fill(0, count($itemIds), '%d'));
            $sql = "SELECT DISTINCT menu_id FROM {$this->table} WHERE id IN ({$placeholders})";
            $prepared_sql = $this->db->prepare($sql, $itemIds);
            $menuIds = $this->db->get_col($prepared_sql);
            
            foreach ($menuIds as $menuId) {
                do_action('jankx_menu_builder_menu_items_bulk_updated', $itemIds, $menuId);
            }
            
            return true;
        }

        return false;
    }

    /**
     * Bulk delete items
     */
    public function bulkDelete($itemIds)
    {
        if (empty($itemIds)) {
            return false;
        }

        // Get menu IDs for hooks
        $placeholders = implode(',', array_fill(0, count($itemIds), '%d'));
        $sql = "SELECT DISTINCT menu_id FROM {$this->table} WHERE id IN ({$placeholders})";
        $prepared_sql = $this->db->prepare($sql, $itemIds);
        $menuIds = $this->db->get_col($prepared_sql);

        // Delete children first
        foreach ($itemIds as $itemId) {
            $this->deleteChildren($itemId);
        }

        // Delete items
        $placeholders = implode(',', array_fill(0, count($itemIds), '%d'));
        $sql = "DELETE FROM {$this->table} WHERE id IN ({$placeholders})";
        $prepared_sql = $this->db->prepare($sql, $itemIds);
        $result = $this->db->query($prepared_sql);

        if ($result !== false) {
            foreach ($menuIds as $menuId) {
                do_action('jankx_menu_builder_menu_items_bulk_deleted', $itemIds, $menuId);
            }
            
            return true;
        }

        return false;
    }
}
