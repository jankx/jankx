<?php
/**
 * Menu Builder API
 * 
 * @package App\MenuBuilder\API
 * @since 1.0.0
 */

namespace App\MenuBuilder\API;

use App\MenuBuilder\Database\MenuRepository;
use App\MenuBuilder\Database\MenuItemRepository;
use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

class MenuAPI extends WP_REST_Controller
{
    /**
     * Menu repository
     */
    protected $menuRepository;

    /**
     * Menu item repository
     */
    protected $menuItemRepository;

    /**
     * Constructor
     */
    public function __construct(MenuRepository $menuRepository, MenuItemRepository $menuItemRepository)
    {
        $this->menuRepository = $menuRepository;
        $this->menuItemRepository = $menuItemRepository;
    }

    /**
     * Register API routes
     */
    public function registerRoutes()
    {
        $namespace = 'jankx-menu-builder/v1';

        // Menu routes
        register_rest_route($namespace, '/menus', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'getMenus'],
                'permission_callback' => [$this, 'checkPermission'],
                'args' => [
                    'status' => [
                        'type' => 'string',
                        'default' => 'active',
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'search' => [
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'page' => [
                        'type' => 'integer',
                        'default' => 1,
                        'sanitize_callback' => 'absint'
                    ],
                    'per_page' => [
                        'type' => 'integer',
                        'default' => 20,
                        'sanitize_callback' => 'absint'
                    ]
                ]
            ],
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'createMenu'],
                'permission_callback' => [$this, 'checkPermission'],
                'args' => [
                    'name' => [
                        'type' => 'string',
                        'required' => true,
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'description' => [
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_textarea_field'
                    ],
                    'settings' => [
                        'type' => 'object',
                        'sanitize_callback' => [$this, 'sanitizeSettings']
                    ]
                ]
            ]
        ]);

        register_rest_route($namespace, '/menus/(?P<id>\d+)', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'getMenu'],
                'permission_callback' => [$this, 'checkPermission'],
                'args' => [
                    'include_items' => [
                        'type' => 'boolean',
                        'default' => false
                    ]
                ]
            ],
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'updateMenu'],
                'permission_callback' => [$this, 'checkPermission'],
                'args' => [
                    'name' => [
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'description' => [
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_textarea_field'
                    ],
                    'settings' => [
                        'type' => 'object',
                        'sanitize_callback' => [$this, 'sanitizeSettings']
                    ]
                ]
            ],
            [
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => [$this, 'deleteMenu'],
                'permission_callback' => [$this, 'checkPermission']
            ]
        ]);

        register_rest_route($namespace, '/menus/(?P<id>\d+)/duplicate', [
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'duplicateMenu'],
                'permission_callback' => [$this, 'checkPermission'],
                'args' => [
                    'name' => [
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field'
                    ]
                ]
            ]
        ]);

        register_rest_route($namespace, '/menus/(?P<id>\d+)/statistics', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'getMenuStatistics'],
                'permission_callback' => [$this, 'checkPermission']
            ]
        ]);

        // Menu items routes
        register_rest_route($namespace, '/menus/(?P<menu_id>\d+)/items', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'getMenuItems'],
                'permission_callback' => [$this, 'checkPermission'],
                'args' => [
                    'status' => [
                        'type' => 'string',
                        'default' => 'active',
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'type' => [
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'submenu_type' => [
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field'
                    ]
                ]
            ],
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'createMenuItem'],
                'permission_callback' => [$this, 'checkPermission'],
                'args' => [
                    'label' => [
                        'type' => 'string',
                        'required' => true,
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'url' => [
                        'type' => 'string',
                        'sanitize_callback' => 'esc_url_raw'
                    ],
                    'type' => [
                        'type' => 'string',
                        'default' => 'link',
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'submenu_type' => [
                        'type' => 'string',
                        'default' => 'multilevel',
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'parent_id' => [
                        'type' => 'integer',
                        'default' => 0,
                        'sanitize_callback' => 'absint'
                    ],
                    'order_index' => [
                        'type' => 'integer',
                        'sanitize_callback' => 'absint'
                    ],
                    'settings' => [
                        'type' => 'object',
                        'sanitize_callback' => [$this, 'sanitizeSettings']
                    ]
                ]
            ]
        ]);

        register_rest_route($namespace, '/menu-items/(?P<id>\d+)', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'getMenuItem'],
                'permission_callback' => [$this, 'checkPermission']
            ],
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'updateMenuItem'],
                'permission_callback' => [$this, 'checkPermission'],
                'args' => [
                    'label' => [
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'url' => [
                        'type' => 'string',
                        'sanitize_callback' => 'esc_url_raw'
                    ],
                    'type' => [
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'submenu_type' => [
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field'
                    ],
                    'parent_id' => [
                        'type' => 'integer',
                        'sanitize_callback' => 'absint'
                    ],
                    'order_index' => [
                        'type' => 'integer',
                        'sanitize_callback' => 'absint'
                    ],
                    'settings' => [
                        'type' => 'object',
                        'sanitize_callback' => [$this, 'sanitizeSettings']
                    ]
                ]
            ],
            [
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => [$this, 'deleteMenuItem'],
                'permission_callback' => [$this, 'checkPermission']
            ]
        ]);

        register_rest_route($namespace, '/menu-items/(?P<id>\d+)/toggle-status', [
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'toggleMenuItemStatus'],
                'permission_callback' => [$this, 'checkPermission']
            ]
        ]);

        register_rest_route($namespace, '/menu-items/reorder', [
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'reorderMenuItems'],
                'permission_callback' => [$this, 'checkPermission'],
                'args' => [
                    'items' => [
                        'type' => 'array',
                        'required' => true,
                        'validate_callback' => function($value) {
                            return is_array($value);
                        }
                    ]
                ]
            ]
        ]);

        register_rest_route($namespace, '/menu-items/bulk-update', [
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'bulkUpdateMenuItems'],
                'permission_callback' => [$this, 'checkPermission'],
                'args' => [
                    'item_ids' => [
                        'type' => 'array',
                        'required' => true,
                        'validate_callback' => function($value) {
                            return is_array($value);
                        }
                    ],
                    'data' => [
                        'type' => 'object',
                        'required' => true,
                        'sanitize_callback' => function($data) {
                            $sanitized = [];
                            foreach ($data as $key => $value) {
                                if (in_array($key, ['status', 'type', 'submenu_type'])) {
                                    $sanitized[$key] = sanitize_text_field($value);
                                }
                            }
                            return $sanitized;
                        }
                    ]
                ]
            ]
        ]);

        register_rest_route($namespace, '/menu-items/bulk-delete', [
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'bulkDeleteMenuItems'],
                'permission_callback' => [$this, 'checkPermission'],
                'args' => [
                    'item_ids' => [
                        'type' => 'array',
                        'required' => true,
                        'validate_callback' => function($value) {
                            return is_array($value);
                        }
                    ]
                ]
            ]
        ]);
    }

    /**
     * Check API permission
     */
    public function checkPermission()
    {
        return current_user_can('edit_theme_options');
    }

    /**
     * Get menus
     */
    public function getMenus(WP_REST_Request $request)
    {
        $status = $request->get_param('status');
        $search = $request->get_param('search');
        $page = $request->get_param('page');
        $per_page = $request->get_param('per_page');

        if ($search) {
            $menus = $this->menuRepository->search($search, $status);
        } else {
            $menus = $this->menuRepository->getAll($status);
        }

        // Pagination
        $total = count($menus);
        $offset = ($page - 1) * $per_page;
        $menus = array_slice($menus, $offset, $per_page);

        $response = [
            'data' => $menus,
            'total' => $total,
            'page' => $page,
            'per_page' => $per_page,
            'total_pages' => ceil($total / $per_page)
        ];

        return new WP_REST_Response($response, 200);
    }

    /**
     * Create menu
     */
    public function createMenu(WP_REST_Request $request)
    {
        $name = $request->get_param('name');
        $description = $request->get_param('description');
        $settings = $request->get_param('settings');

        $menuId = $this->menuRepository->create([
            'name' => $name,
            'description' => $description ?: '',
            'settings' => $settings ?: []
        ]);

        if ($menuId) {
            $menu = $this->menuRepository->getById($menuId);
            return new WP_REST_Response($menu, 201);
        }

        return new WP_Error('creation_failed', 'Failed to create menu', ['status' => 500]);
    }

    /**
     * Get menu
     */
    public function getMenu(WP_REST_Request $request)
    {
        $id = $request->get_param('id');
        $includeItems = $request->get_param('include_items');

        if ($includeItems) {
            $menu = $this->menuRepository->getMenuWithItems($id);
        } else {
            $menu = $this->menuRepository->getById($id);
        }

        if (!$menu) {
            return new WP_Error('not_found', 'Menu not found', ['status' => 404]);
        }

        return new WP_REST_Response($menu, 200);
    }

    /**
     * Update menu
     */
    public function updateMenu(WP_REST_Request $request)
    {
        $id = $request->get_param('id');
        $data = [];

        if ($request->has_param('name')) {
            $data['name'] = $request->get_param('name');
        }
        if ($request->has_param('description')) {
            $data['description'] = $request->get_param('description');
        }
        if ($request->has_param('settings')) {
            $data['settings'] = $request->get_param('settings');
        }

        $result = $this->menuRepository->update($id, $data);

        if ($result) {
            $menu = $this->menuRepository->getById($id);
            return new WP_REST_Response($menu, 200);
        }

        return new WP_Error('update_failed', 'Failed to update menu', ['status' => 500]);
    }

    /**
     * Delete menu
     */
    public function deleteMenu(WP_REST_Request $request)
    {
        $id = $request->get_param('id');

        $result = $this->menuRepository->delete($id);

        if ($result) {
            return new WP_REST_Response(['deleted' => true], 200);
        }

        return new WP_Error('delete_failed', 'Failed to delete menu', ['status' => 500]);
    }

    /**
     * Duplicate menu
     */
    public function duplicateMenu(WP_REST_Request $request)
    {
        $id = $request->get_param('id');
        $name = $request->get_param('name');

        $newMenuId = $this->menuRepository->duplicate($id, $name);

        if ($newMenuId) {
            $newMenu = $this->menuRepository->getMenuWithItems($newMenuId);
            return new WP_REST_Response($newMenu, 201);
        }

        return new WP_Error('duplicate_failed', 'Failed to duplicate menu', ['status' => 500]);
    }

    /**
     * Get menu statistics
     */
    public function getMenuStatistics(WP_REST_Request $request)
    {
        $id = $request->get_param('id');
        $statistics = $this->menuRepository->getStatistics($id);

        return new WP_REST_Response($statistics, 200);
    }

    /**
     * Get menu items
     */
    public function getMenuItems(WP_REST_Request $request)
    {
        $menuId = $request->get_param('menu_id');
        $status = $request->get_param('status');
        $type = $request->get_param('type');
        $submenuType = $request->get_param('submenu_type');

        if ($type) {
            $items = $this->menuItemRepository->getByType($menuId, $type, $status);
        } elseif ($submenuType) {
            $items = $this->menuItemRepository->getBySubmenuType($menuId, $submenuType, $status);
        } else {
            $items = $this->menuItemRepository->getTreeByMenuId($menuId, $status);
        }

        return new WP_REST_Response($items, 200);
    }

    /**
     * Create menu item
     */
    public function createMenuItem(WP_REST_Request $request)
    {
        $menuId = $request->get_param('menu_id');
        $data = [
            'menu_id' => $menuId,
            'label' => $request->get_param('label'),
            'url' => $request->get_param('url') ?: '#',
            'type' => $request->get_param('type') ?: 'link',
            'submenu_type' => $request->get_param('submenu_type') ?: 'multilevel',
            'parent_id' => $request->get_param('parent_id') ?: 0,
            'settings' => $request->get_param('settings') ?: []
        ];

        if ($request->has_param('order_index')) {
            $data['order_index'] = $request->get_param('order_index');
        }

        $itemId = $this->menuItemRepository->create($data);

        if ($itemId) {
            $item = $this->menuItemRepository->getById($itemId);
            return new WP_REST_Response($item, 201);
        }

        return new WP_Error('creation_failed', 'Failed to create menu item', ['status' => 500]);
    }

    /**
     * Get menu item
     */
    public function getMenuItem(WP_REST_Request $request)
    {
        $id = $request->get_param('id');
        $item = $this->menuItemRepository->getById($id);

        if (!$item) {
            return new WP_Error('not_found', 'Menu item not found', ['status' => 404]);
        }

        return new WP_REST_Response($item, 200);
    }

    /**
     * Update menu item
     */
    public function updateMenuItem(WP_REST_Request $request)
    {
        $id = $request->get_param('id');
        $data = [];

        $updatableFields = ['label', 'url', 'type', 'submenu_type', 'parent_id', 'order_index', 'settings'];

        foreach ($updatableFields as $field) {
            if ($request->has_param($field)) {
                $data[$field] = $request->get_param($field);
            }
        }

        $result = $this->menuItemRepository->update($id, $data);

        if ($result) {
            $item = $this->menuItemRepository->getById($id);
            return new WP_REST_Response($item, 200);
        }

        return new WP_Error('update_failed', 'Failed to update menu item', ['status' => 500]);
    }

    /**
     * Delete menu item
     */
    public function deleteMenuItem(WP_REST_Request $request)
    {
        $id = $request->get_param('id');

        $result = $this->menuItemRepository->delete($id);

        if ($result) {
            return new WP_REST_Response(['deleted' => true], 200);
        }

        return new WP_Error('delete_failed', 'Failed to delete menu item', ['status' => 500]);
    }

    /**
     * Toggle menu item status
     */
    public function toggleMenuItemStatus(WP_REST_Request $request)
    {
        $id = $request->get_param('id');

        $result = $this->menuItemRepository->toggleStatus($id);

        if ($result) {
            $item = $this->menuItemRepository->getById($id);
            return new WP_REST_Response($item, 200);
        }

        return new WP_Error('toggle_failed', 'Failed to toggle menu item status', ['status' => 500]);
    }

    /**
     * Reorder menu items
     */
    public function reorderMenuItems(WP_REST_Request $request)
    {
        $items = $request->get_param('items');

        $result = $this->menuItemRepository->reorder($items);

        if ($result) {
            return new WP_REST_Response(['reordered' => true], 200);
        }

        return new WP_Error('reorder_failed', 'Failed to reorder menu items', ['status' => 500]);
    }

    /**
     * Bulk update menu items
     */
    public function bulkUpdateMenuItems(WP_REST_Request $request)
    {
        $itemIds = $request->get_param('item_ids');
        $data = $request->get_param('data');

        $result = $this->menuItemRepository->bulkUpdate($itemIds, $data);

        if ($result) {
            return new WP_REST_Response(['updated' => true], 200);
        }

        return new WP_Error('bulk_update_failed', 'Failed to bulk update menu items', ['status' => 500]);
    }

    /**
     * Bulk delete menu items
     */
    public function bulkDeleteMenuItems(WP_REST_Request $request)
    {
        $itemIds = $request->get_param('item_ids');

        $result = $this->menuItemRepository->bulkDelete($itemIds);

        if ($result) {
            return new WP_REST_Response(['deleted' => true], 200);
        }

        return new WP_Error('bulk_delete_failed', 'Failed to bulk delete menu items', ['status' => 500]);
    }

    /**
     * Sanitize settings
     */
    public function sanitizeSettings($settings)
    {
        if (!is_array($settings)) {
            return [];
        }

        $allowedSettings = [
            'mobileBreakpoint' => 'absint',
            'desktopBreakpoint' => 'absint',
            'enableMobileMenu' => 'rest_sanitize_boolean',
            'enableDesktopMenu' => 'rest_sanitize_boolean',
            'mobileMenuOptions' => null,
            'desktopMenuOptions' => null,
            'submenuTypes' => null,
            'megaMenuSettings' => null,
            'flyoutMenuSettings' => null,
            'multilevelMenuSettings' => null
        ];

        $sanitized = [];

        foreach ($settings as $key => $value) {
            if (isset($allowedSettings[$key])) {
                if ($allowedSettings[$key] && function_exists($allowedSettings[$key])) {
                    $sanitized[$key] = $allowedSettings[$key]($value);
                } else {
                    $sanitized[$key] = $value;
                }
            }
        }

        return $sanitized;
    }
}
