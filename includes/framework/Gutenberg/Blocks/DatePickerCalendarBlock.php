<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Date Picker Calendar Block
 *
 * This block provides a calendar interface with date picker functionality
 * supporting outline and fill modes for selected dates.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class DatePickerCalendarBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/date-picker-calendar';

    /**
     * Block attributes
     *
     * @var array
     */
    protected $attributes = [
        'selectedDates' => [
            'type' => 'array',
            'default' => []
        ],
        'currentMonth' => [
            'type' => 'number',
            'default' => 3
        ],
        'currentYear' => [
            'type' => 'number',
            'default' => 2026
        ],
        'dateMode' => [
            'type' => 'string',
            'default' => 'outline',
            'enum' => ['outline', 'fill']
        ],
        'showNavigation' => [
            'type' => 'boolean',
            'default' => true
        ],
        'showWeekdays' => [
            'type' => 'boolean',
            'default' => true
        ]
    ];

    /**
     * Register the block
     *
     * @return void
     */
    public function init()
    {
        // Enqueue block assets
        add_action('wp_enqueue_scripts', [$this, 'enqueueAssets']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueAssets']);
    }

    /**
     * Enqueue block assets
     *
     * @return void
     */
    public function enqueueAssets()
    {
        $block_dir = get_template_directory() . '/resources/blocks/date-picker-calendar';

        // Enqueue block styles
        wp_enqueue_style(
            'jankx-date-picker-calendar-style',
            get_template_directory_uri() . '/resources/blocks/date-picker-calendar/style.css',
            [],
            file_exists($block_dir . '/style.css') ? filemtime($block_dir . '/style.css') : '1.0.0'
        );
    }

    /**
     * Render the block
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered block HTML
     */
    public function render($attributes, $content)
    {
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

        <style>
        .wp-block-jankx-date-picker-calendar {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .date-picker-calendar {
            background: #fefefe;
            border: 1px solid #d4a574;
            border-radius: 8px;
            padding: 20px;
            max-width: 400px;
            margin: 0 auto;
            position: relative;
            overflow: hidden;
        }

        .date-picker-calendar::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: radial-gradient(circle at 20% 20%, rgba(212, 165, 116, 0.05) 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, rgba(212, 165, 116, 0.05) 0%, transparent 50%);
            pointer-events: none;
        }

        .calendar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }

        .calendar-title {
            color: #8b4513;
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            text-align: center;
            flex: 1;
        }

        .calendar-nav-btn {
            background: none;
            border: none;
            color: #8b4513;
            cursor: pointer;
            padding: 8px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }

        .calendar-nav-btn:hover {
            background-color: rgba(139, 69, 19, 0.1);
        }

        .calendar-weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }

        .weekday {
            text-align: center;
            color: #a0522d;
            font-size: 14px;
            font-weight: 500;
            padding: 8px 4px;
        }

        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
            position: relative;
            z-index: 1;
        }

        .calendar-day {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.2s;
            position: relative;
        }

        .calendar-day.current-month {
            color: #333;
            font-weight: 500;
        }

        .calendar-day.other-month {
            color: #d4a574;
        }

        .calendar-day:hover {
            background-color: rgba(212, 165, 116, 0.1);
        }

        .calendar-day.selected.mode-outline {
            border: 2px solid #d4a574;
            color: #d4a574;
            background: transparent;
        }

        .calendar-day.selected.mode-fill {
            background-color: #8b4513;
            color: white;
            border: none;
        }

        .day-number {
            font-size: 14px;
            font-weight: 500;
        }
        </style>
        <?php
        return ob_get_clean();
    }
}
