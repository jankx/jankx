<?php

namespace Jankx\Facades;

use Jankx\Foundation\Application;

/**
 * FontIcons Facade để dễ dàng sử dụng Font Icons System
 */
class FontIcons
{
    /**
     * Đăng ký font icon từ CSS URL
     */
    public static function register($cssUrl, $iconType, $displayName = null, $autoLoad = false, $transformer = null)
    {
        $app = Application::getInstance();
        $repository = $app->make('font-icons.repository');

        // Đầu tiên register font icon CSS như một font chữ bình thường
        $fontResult = \Jankx\Facades\Fonts::customFromCss($iconType, $cssUrl);

        if (!$fontResult) {
            return [
                'success' => false,
                'message' => 'Failed to register font CSS'
            ];
        }

        // Sau đó import icon data
        $result = $repository->importFromCssUrl($cssUrl, $iconType, $displayName, $autoLoad, $transformer);

        if ($result['success']) {
            // Trigger action hook để thông báo icon đã được register
            do_action('jankx_font_icons_registered', $iconType, $result['data']);
        }

        return $result;
    }

    /**
     * Đăng ký FontAwesome
     */
    public static function fontAwesome($version = '6.5.1', $autoLoad = false)
    {
        $cssUrl = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/{$version}/css/all.min.css";

        return self::register($cssUrl, 'fontawesome', 'Font Awesome', $autoLoad);
    }

    /**
     * Đăng ký Material Icons
     */
    public static function materialIcons($autoLoad = false)
    {
        $cssUrl = "https://fonts.googleapis.com/icon?family=Material+Icons";

        return self::register($cssUrl, 'material', 'Material Icons', $autoLoad);
    }

    /**
     * Đăng ký Bootstrap Icons
     */
    public static function bootstrapIcons($version = '1.11.3', $autoLoad = false)
    {
        $cssUrl = "https://cdn.jsdelivr.net/npm/bootstrap-icons@{$version}/font/bootstrap-icons.css";

        return self::register($cssUrl, 'bootstrap', 'Bootstrap Icons', $autoLoad);
    }

    /**
     * Đăng ký Feather Icons
     */
    public static function featherIcons($version = '4.29.0', $autoLoad = false)
    {
        $cssUrl = "https://cdn.jsdelivr.net/npm/feather-icons@{$version}/dist/feather.min.css";

        return self::register($cssUrl, 'feather', 'Feather Icons', $autoLoad);
    }

    /**
     * Đăng ký Heroicons
     */
    public static function heroIcons($version = '2.0.18', $autoLoad = false)
    {
        $cssUrl = "https://cdn.jsdelivr.net/npm/heroicons@{$version}/dist/heroicons.min.css";

        return self::register($cssUrl, 'heroicons', 'Heroicons', $autoLoad);
    }

    /**
     * Đăng ký Tabler Icons
     */
    public static function tablerIcons($version = '2.44.0', $autoLoad = false)
    {
        $cssUrl = "https://cdn.jsdelivr.net/npm/@tabler/icons@{$version}/dist/tabler-icons.min.css";

        return self::register($cssUrl, 'tabler', 'Tabler Icons', $autoLoad);
    }

    /**
     * Đăng ký Lucide Icons
     */
    public static function lucideIcons($version = '0.294.0', $autoLoad = false)
    {
        $cssUrl = "https://cdn.jsdelivr.net/npm/lucide@{$version}/dist/lucide.min.css";

        return self::register($cssUrl, 'lucide', 'Lucide Icons', $autoLoad);
    }

    /**
     * Đăng ký Phosphor Icons
     */
    public static function phosphorIcons($version = '1.4.2', $autoLoad = false)
    {
        $cssUrl = "https://cdn.jsdelivr.net/npm/phosphor-icons@{$version}/dist/phosphor-icons.min.css";

        return self::register($cssUrl, 'phosphor', 'Phosphor Icons', $autoLoad);
    }

    /**
     * Lấy tất cả icons đã đăng ký
     */
    public static function all()
    {
        $app = Application::getInstance();
        $repository = $app->make('font-icons.repository');

        return $repository->getIconTypes();
    }

    /**
     * Lấy icons theo type
     */
    public static function get($iconType, $filters = [])
    {
        $app = Application::getInstance();
        $repository = $app->make('font-icons.repository');

        return $repository->getIconsByType($iconType, $filters);
    }

    /**
     * Tìm kiếm icons
     */
    public static function search($query, $type = null)
    {
        $app = Application::getInstance();
        $repository = $app->make('font-icons.repository');

        return $repository->searchIcons($query, $type);
    }

    /**
     * Render icon
     */
    public static function render($iconName, $type = 'fontawesome', $attributes = [])
    {
        $app = Application::getInstance();
        $renderer = $app->make('font-icons.renderer');

        return $renderer->render($iconName, $type, $attributes);
    }

    /**
     * Kiểm tra icon type có tồn tại không
     */
    public static function has($iconType)
    {
        $app = Application::getInstance();
        $repository = $app->make('font-icons.repository');

        return $repository->hasIconType($iconType);
    }

    /**
     * Xóa icon type
     */
    public static function remove($iconType)
    {
        $app = Application::getInstance();
        $repository = $app->make('font-icons.repository');

        return $repository->removeIconType($iconType);
    }

    /**
     * Clear cache
     */
    public static function clearCache()
    {
        $app = Application::getInstance();
        $repository = $app->make('font-icons.repository');

        return $repository->clearCache();
    }

    /**
     * Lấy thống kê
     */
    public static function stats()
    {
        $app = Application::getInstance();
        $repository = $app->make('font-icons.repository');

        return $repository->getStats();
    }
}
