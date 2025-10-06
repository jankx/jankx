<?php
/**
 * Date Picker Calendar Block Initialization
 *
 * @package Jankx
 * @subpackage Blocks
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Register the block
function jankx_register_date_picker_calendar_block() {
    // Check if the block is already registered
    if (WP_Block_Type_Registry::get_instance()->is_registered('jankx/date-picker-calendar')) {
        return;
    }

    // Get the block directory
    $block_dir = dirname(__FILE__);

    // Register the block
    register_block_type($block_dir, [
        'render_callback' => 'jankx_render_date_picker_calendar_block',
    ]);
}
add_action('init', 'jankx_register_date_picker_calendar_block');

/**
 * Render callback for the Date Picker Calendar block
 *
 * @param array $attributes Block attributes
 * @param string $content Block content
 * @param WP_Block $block Block instance
 * @return string Rendered block HTML
 */
function jankx_render_date_picker_calendar_block($attributes, $content, $block) {
    // Get block attributes with defaults
    $selected_dates = $attributes['selectedDates'] ?? [];
    $current_month = $attributes['currentMonth'] ?? 3;
    $current_year = $attributes['currentYear'] ?? 2026;
    $date_mode = $attributes['dateMode'] ?? 'outline';
    $show_navigation = $attributes['showNavigation'] ?? true;
    $show_weekdays = $attributes['showWeekdays'] ?? true;

    // Get month name in Vietnamese
    $month_names = [
        1 => 'Tháng 1', 2 => 'Tháng 2', 3 => 'Tháng 3', 4 => 'Tháng 4',
        5 => 'Tháng 5', 6 => 'Tháng 6', 7 => 'Tháng 7', 8 => 'Tháng 8',
        9 => 'Tháng 9', 10 => 'Tháng 10', 11 => 'Tháng 11', 12 => 'Tháng 12'
    ];

    $weekday_names = [
        'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'
    ];

    // Calculate calendar data
    $first_day = mktime(0, 0, 0, $current_month, 1, $current_year);
    $days_in_month = date('t', $first_day);
    $first_weekday = date('N', $first_day) - 1; // Convert to 0-based (Monday = 0)

    // Get previous month's last days
    $prev_month = $current_month == 1 ? 12 : $current_month - 1;
    $prev_year = $current_month == 1 ? $current_year - 1 : $current_year;
    $prev_month_days = date('t', mktime(0, 0, 0, $prev_month, 1, $prev_year));

    // Get next month's first day
    $next_month = $current_month == 12 ? 1 : $current_month + 1;
    $next_year = $current_month == 12 ? $current_year + 1 : $current_year;

    // Generate calendar grid
    $calendar_days = [];

    // Previous month's days
    for ($i = $first_weekday - 1; $i >= 0; $i--) {
        $day = $prev_month_days - $i;
        $calendar_days[] = [
            'day' => $day,
            'month' => $prev_month,
            'year' => $prev_year,
            'is_current_month' => false,
            'is_selected' => false
        ];
    }

    // Current month's days
    for ($day = 1; $day <= $days_in_month; $day++) {
        $is_selected = in_array($day, $selected_dates);
        $calendar_days[] = [
            'day' => $day,
            'month' => $current_month,
            'year' => $current_year,
            'is_current_month' => true,
            'is_selected' => $is_selected
        ];
    }

    // Next month's days to fill the grid
    $remaining_days = 42 - count($calendar_days); // 6 weeks * 7 days
    for ($day = 1; $day <= $remaining_days; $day++) {
        $calendar_days[] = [
            'day' => $day,
            'month' => $next_month,
            'year' => $next_year,
            'is_current_month' => false,
            'is_selected' => false
        ];
    }

    $block_id = 'date-picker-calendar-' . uniqid();

    // Start output buffering
    ob_start();
    ?>
    <div class="wp-block-jankx-date-picker-calendar" id="<?php echo esc_attr($block_id); ?>">
        <div class="date-picker-calendar">
            <?php if ($show_navigation): ?>
            <div class="calendar-header">
                <button class="calendar-nav-btn prev-month" data-action="prev">
                    <span class="dashicons dashicons-arrow-left-alt2"></span>
                </button>
                <h3 class="calendar-title">
                    <?php echo esc_html($month_names[$current_month] . ' - ' . $current_year); ?>
                </h3>
                <button class="calendar-nav-btn next-month" data-action="next">
                    <span class="dashicons dashicons-arrow-right-alt2"></span>
                </button>
            </div>
            <?php endif; ?>

            <?php if ($show_weekdays): ?>
            <div class="calendar-weekdays">
                <?php foreach ($weekday_names as $weekday): ?>
                    <div class="weekday"><?php echo esc_html($weekday); ?></div>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>

            <div class="calendar-grid">
                <?php foreach ($calendar_days as $index => $day_data): ?>
                    <div class="calendar-day <?php
                        echo $day_data['is_current_month'] ? 'current-month' : 'other-month';
                        echo $day_data['is_selected'] ? ' selected' : '';
                        echo $day_data['is_selected'] ? ' mode-' . esc_attr($date_mode) : '';
                    ?>"
                    data-day="<?php echo esc_attr($day_data['day']); ?>"
                    data-month="<?php echo esc_attr($day_data['month']); ?>"
                    data-year="<?php echo esc_attr($day_data['year']); ?>">
                        <span class="day-number"><?php echo esc_html($day_data['day']); ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Enqueue block assets
 */
function jankx_date_picker_calendar_block_assets() {
    $block_dir = dirname(__FILE__);

    // Enqueue block styles
    wp_enqueue_style(
        'jankx-date-picker-calendar-style',
        get_template_directory_uri() . '/resources/blocks/date-picker-calendar/style.css',
        [],
        filemtime($block_dir . '/style.css')
    );
}
add_action('wp_enqueue_scripts', 'jankx_date_picker_calendar_block_assets');
add_action('enqueue_block_editor_assets', 'jankx_date_picker_calendar_block_assets');
