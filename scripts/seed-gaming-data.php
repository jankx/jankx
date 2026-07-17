<?php
/**
 * Gaming Portal Data Seeder for Jankx Theme
 * 
 * Usage: wp eval-file scripts/seed-gaming-data.php
 */

if (!defined('ABSPATH')) {
    die('This script must be run within a WordPress environment (e.g., via wp eval-file).');
}

echo "Starting seeding gaming data...\n";

// 1. Create Categories
$categories = [
    'Tin Game' => 'tin-game',
    'Esports' => 'esports',
    'Công nghệ' => 'cong-nghe',
    'Cộng đồng' => 'cong-dong',
    'Giải thưởng' => 'giai-thuong'
];

$cat_ids = [];
foreach ($categories as $name => $slug) {
    $term = get_term_by('slug', $slug, 'category');
    if (!$term) {
        $result = wp_insert_term($name, 'category', ['slug' => $slug]);
        if (!is_wp_error($result)) {
            $cat_ids[$slug] = $result['term_id'];
            echo "Created category: {$name}\n";
        }
    } else {
        $cat_ids[$slug] = $term->term_id;
        echo "Category exists: {$name}\n";
    }
}

// 2. Sample Titles and Contents
$sample_titles = [
    'tin-game' => [
        'Final Fantasy VII Rebirth nhận được đánh giá cao từ giới phê bình',
        'Tổng hợp những tựa game đáng chú ý ra mắt tháng này',
        'Elden Ring DLC: Shadow of Erdree tung trailer gameplay cực đỉnh',
        'Sự hồi sinh mạnh mẽ của dòng game nhập vai cổ điển'
    ],
    'esports' => [
        'Giải đấu LMHT Worlds 2024 công bố lịch trình và địa điểm',
        'Giải đấu PUBG Mobile World Invitational 2024 khởi tranh',
        'Valoran Champions Tour 2024: Những cuộc đối đầu nảy lửa',
        'Thị trường Esports Việt Nam tăng trưởng kỷ lục trong năm qua'
    ],
    'cong-nghe' => [
        'Top 5 card đồ họa gaming đáng mua nhất năm 2024',
        'Review chi tiết bàn phím cơ không dây dành cho game thủ chuyên nghiệp',
        'Công nghệ AI đang thay đổi cách chúng ta chơi game như thế nào?',
        'Thế hệ console tiếp theo: Những kỳ vọng và dự đoán mới nhất'
    ]
];

// 3. Create Posts
foreach ($sample_titles as $slug => $titles) {
    $cat_id = $cat_ids[$slug] ?? null;
    if (!$cat_id) continue;

    foreach ($titles as $index => $title) {
        // Check if post already exists
        $exists = get_page_by_title($title, OBJECT, 'post');
        if ($exists) {
            echo "Post exists: {$title}\n";
            continue;
        }

        $post_id = wp_insert_post([
            'post_title'    => $title,
            'post_content'  => 'Đây là nội dung mẫu cho bài viết về ' . $title . '. Jankx Framework giúp việc hiển thị dữ liệu này trở nên vô cùng linh hoạt và mạnh mẽ với các block layout động.',
            'post_status'   => 'publish',
            'post_author'   => 1,
            'post_category' => [$cat_id]
        ]);

        if (!is_wp_error($post_id)) {
            // Add sample meta or categories for specific layouts
            if ($index === 0 && $slug === 'tin-game') {
                update_post_meta($post_id, '_jankx_featured_post', 'yes');
            }
            echo "Created post: {$title}\n";
        }
    }
}

echo "Seeding completed successfully!\n";
echo "You can now use these categories and posts to test your Jankx blocks.\n";
