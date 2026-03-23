<?php
/**
 * Preset & Layout Section — SVG Chooser Demo
 *
 * Demonstrates the `svg_chooser` field type for:
 *  1. Theme Preset  — full visual style presets
 *  2. Blog / Post Layout — grid layout picker
 *  3. Header Layout — header pattern picker
 *
 * SVGs below are self-contained and work without any external files.
 */
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

/* ── Helper: tiny inline SVG layouts ──────────────────────────── */

/**
 * Generates a simple layout SVG thumbnail.
 * $rects — array of [x, y, w, h] in 0-based coords on a 80×60 canvas
 */
if (!function_exists('_jankx_layout_svg')) {
    function _jankx_layout_svg(array $rects, string $accent = 'currentColor'): string
    {
        $shapes = '';
        foreach ($rects as $i => [$x, $y, $w, $h]) {
            $op = ($i === 0) ? '0.22' : '0.45';
            $shapes .= sprintf(
                '<rect x="%d" y="%d" width="%d" height="%d" rx="3" fill="%s" opacity="%s"/>',
                $x, $y, $w, $h, $accent, $op
            );
        }
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60">' . $shapes . '</svg>';
    }
}

/* ── Theme Preset SVGs ─────────────────────────────────────────── */
$preset_classic = _jankx_layout_svg([
    [4,  4,  72, 10], // header
    [4, 18,  72, 35], // content full width
    [4, 57,  72,  4], // footer
]);

$preset_magazine = _jankx_layout_svg([
    [4,  4,  72,  8], // header
    [4, 16,  45, 25], // hero
    [53, 16,  23, 12], // sidebar top
    [53, 32,  23, 10], // sidebar mid
    [4, 45,  22, 14], // card 1
    [29, 45,  22, 14], // card 2
    [54, 45,  22, 14], // card 3
]);

$preset_minimal = _jankx_layout_svg([
    [24,  4,  32, 6],  // centered header/logo
    [10, 14,  60, 38], // content
    [10, 54,  60,  4], // footer
]);

$preset_blog = _jankx_layout_svg([
    [4,  4,  72, 8],  // header
    [4, 16,  50, 38], // main content
    [58, 16,  18, 38], // sidebar
]);

$preset_ecommerce = _jankx_layout_svg([
    [4,  4,  72,  8], // header
    [4, 16,  16, 10], // filter col
    [24, 16,  14, 20], // product
    [42, 16,  14, 20], // product
    [60, 16,  14, 20], // product
    [24, 40,  14, 16], // product
    [42, 40,  14, 16], // product
    [60, 40,  14, 16], // product
]);

$preset_landing = _jankx_layout_svg([
    [16,  4,  48,  6], // logo center
    [4,  14,  72, 22], // hero banner
    [4,  40,  22, 14], // feature 1
    [30,  40,  22, 14], // feature 2
    [56,  40,  22, 14], // feature 3
]);

/* ── Post Layout SVGs ──────────────────────────────────────────── */
$layout_grid_3 = _jankx_layout_svg([
    [4,  4,  22, 20], [30,  4, 22, 20], [56,  4, 22, 20], // row 1
    [4, 28,  22, 20], [30, 28, 22, 20], [56, 28, 22, 20], // row 2
]);
$layout_grid_2 = _jankx_layout_svg([
    [4, 4,  34, 24], [44, 4, 34, 24],
    [4, 32, 34, 24], [44, 32, 34, 24],
]);
$layout_list = _jankx_layout_svg([
    [4,  4, 72, 12],
    [4, 20, 72, 12],
    [4, 36, 72, 12],
    [4, 52, 72, 12],
]);
$layout_masonry = _jankx_layout_svg([
    [4,  4, 22, 28], [30,  4, 22, 16], [56,  4, 22, 24],
    [30, 23, 22, 20], [4,  36, 22, 18],
]);
$layout_featured = _jankx_layout_svg([
    [4,  4, 46, 30], // featured big
    [54,  4, 22, 14], [54, 20, 22, 14], // 2 small
    [4, 38, 22, 18], [30, 38, 22, 18], [56, 38, 22, 18],
]);

/* ── Header Layout SVGs ────────────────────────────────────────── */
$header_classic = _jankx_layout_svg([
    [4, 4, 72, 14],   // logo+nav full row
    [4, 4, 20,  6],   // logo
    [26, 8, 50,  5],  // nav right
]);
$header_centered = _jankx_layout_svg([
    [4,  4, 72, 14],
    [28, 4, 24,  6],  // logo center
    [4, 10, 72,  4],  // nav below
]);
$header_split = _jankx_layout_svg([
    [4,  4, 72, 14],
    [4,  5, 20,  6],  // logo left
    [28, 5, 22,  5],  // nav center
    [56, 5, 20,  5],  // cta right
]);
$header_topbar = _jankx_layout_svg([
    [4,  4, 72,  5],  // topbar
    [4, 12, 72, 10],  // main header
    [4, 12, 20,  5],  // logo
    [30, 14, 46,  4], // nav
]);

/* ═══════════════════════════════════════════════════════════════ */
return [
    'id'          => 'presets_overview',
    'name'        => 'Preset & Bố cục',
    'description' => 'Chọn preset giao diện tổng thể, bố cục bài viết và layout header',
    'fields'      => [

        // ── Divider ─────────────────────────────────────────────
        [
            'id'   => '_div_theme_preset',
            'name' => 'Preset giao diện',
            'type' => 'divide',
        ],

        // ── 1. Theme Preset Chooser ──────────────────────────────
        [
            'id'          => 'theme_preset',
            'name'        => 'Theme Preset',
            'type'        => 'svg_chooser',
            'subtitle'    => 'Chọn phong cách tổng thể cho toàn site. Mỗi preset có màu sắc, font và layout riêng.',
            'columns'     => 3,
            'height'      => '100px',
            'show_labels' => true,
            'options'     => [
                'classic'    => ['label' => 'Classic',    'svg' => $preset_classic],
                'magazine'   => ['label' => 'Magazine',   'svg' => $preset_magazine],
                'minimal'    => ['label' => 'Minimal',    'svg' => $preset_minimal],
                'blog'       => ['label' => 'Blog',       'svg' => $preset_blog],
                'ecommerce'  => ['label' => 'E-Commerce', 'svg' => $preset_ecommerce],
                'landing'    => ['label' => 'Landing',    'svg' => $preset_landing],
            ],
            'default_value' => 'classic',
        ],

        // ── Divider ─────────────────────────────────────────────
        [
            'id'   => '_div_post_layout',
            'name' => 'Bố cục Posts',
            'type' => 'divide',
        ],

        // ── 2. Post/Blog Layout Chooser ──────────────────────────
        [
            'id'          => 'post_layout',
            'name'        => 'Bố cục bài viết',
            'type'        => 'svg_chooser',
            'subtitle'    => 'Chọn cách hiển thị danh sách bài viết trên trang Blog / Archive.',
            'columns'     => 5,
            'height'      => '80px',
            'show_labels' => true,
            'options'     => [
                'grid_3'    => ['label' => 'Grid 3 cột',   'svg' => $layout_grid_3],
                'grid_2'    => ['label' => 'Grid 2 cột',   'svg' => $layout_grid_2],
                'list'      => ['label' => 'Danh sách',    'svg' => $layout_list],
                'masonry'   => ['label' => 'Masonry',      'svg' => $layout_masonry],
                'featured'  => ['label' => 'Nổi bật',     'svg' => $layout_featured],
            ],
            'default_value' => 'grid_3',
        ],

        // ── Divider ─────────────────────────────────────────────
        [
            'id'   => '_div_header_layout',
            'name' => 'Bố cục Header',
            'type' => 'divide',
        ],

        // ── 3. Header Layout Chooser ─────────────────────────────
        [
            'id'          => 'header_layout',
            'name'        => 'Bố cục Header',
            'type'        => 'svg_chooser',
            'subtitle'    => 'Chọn kiểu sắp xếp logo, menu và các nút hành động trong phần đầu trang.',
            'columns'     => 4,
            'height'      => '60px',
            'show_labels' => true,
            'options'     => [
                'classic'  => ['label' => 'Classic',   'svg' => $header_classic],
                'centered' => ['label' => 'Centered',  'svg' => $header_centered],
                'split'    => ['label' => 'Split CTA', 'svg' => $header_split],
                'topbar'   => ['label' => 'Top Bar',   'svg' => $header_topbar],
            ],
            'default_value' => 'classic',
        ],
    ],
];
