<?php

namespace Jankx\Demo\Seeders;

use Jankx\Foundation\Cli\Seeders\AbstractSeeder;

/**
 * Gaming Portal Demo Data Seeder
 *
 * Seeds a complete gaming news / esports portal dataset including
 * categories, articles, featured posts, and placeholder metadata.
 *
 * Run with: wp jankx seed run gaming-portal
 *
 * @package Jankx\Foundation\Cli\Seeders\Demo
 * @since 2.1.0
 */
class GamingPortalSeeder extends AbstractSeeder
{
    public static function getName(): string
    {
        return 'gaming-portal';
    }

    public static function getDescription(): string
    {
        return 'Gaming / esports news portal demo data (categories + articles).';
    }

    public static function getGroup(): string
    {
        return 'gaming';
    }

    public function count(): int
    {
        return 5 + 16; // 5 categories + ~16 posts
    }

    // ─── Categories ──────────────────────────────────────────────────────────

    private function getCategories(): array
    {
        return [
            ['name' => 'Tin Game',   'slug' => 'tin-game'],
            ['name' => 'Esports',    'slug' => 'esports'],
            ['name' => 'Công nghệ', 'slug' => 'cong-nghe'],
            ['name' => 'Cộng đồng', 'slug' => 'cong-dong'],
            ['name' => 'Giải thưởng', 'slug' => 'giai-thuong'],
        ];
    }

    // ─── Posts ───────────────────────────────────────────────────────────────

    private function getPostMatrix(): array
    {
        return [
            'tin-game' => [
                [
                    'title'    => 'Final Fantasy VII Rebirth nhận được đánh giá cao từ giới phê bình',
                    'featured' => true,
                ],
                ['title' => 'Tổng hợp những tựa game đáng chú ý ra mắt tháng này'],
                ['title' => 'Elden Ring DLC: Shadow of Erdree tung trailer gameplay cực đỉnh'],
                ['title' => 'Sự hồi sinh mạnh mẽ của dòng game nhập vai cổ điển'],
            ],
            'esports' => [
                ['title' => 'Giải đấu LMHT Worlds 2024 công bố lịch trình và địa điểm'],
                ['title' => 'Giải đấu PUBG Mobile World Invitational 2024 khởi tranh'],
                ['title' => 'Valoran Champions Tour 2024: Những cuộc đối đầu nảy lửa'],
                ['title' => 'Thị trường Esports Việt Nam tăng trưởng kỷ lục trong năm qua'],
            ],
            'cong-nghe' => [
                ['title' => 'Top 5 card đồ họa gaming đáng mua nhất năm 2024'],
                ['title' => 'Review chi tiết bàn phím cơ không dây dành cho game thủ chuyên nghiệp'],
                ['title' => 'Công nghệ AI đang thay đổi cách chúng ta chơi game như thế nào?'],
                ['title' => 'Thế hệ console tiếp theo: Những kỳ vọng và dự đoán mới nhất'],
            ],
            'cong-dong' => [
                ['title' => 'Hội tụ game thủ Việt: Sự kiện offline lớn nhất năm 2024'],
                ['title' => 'Chương trình mentor dành cho game thủ nghiệp dư'],
            ],
            'giai-thuong' => [
                ['title' => 'Lễ trao giải Game of the Year 2024: Ai sẽ chiến thắng?'],
                ['title' => 'Vinh danh những nhà phát triển game xuất sắc nhất năm'],
            ],
        ];
    }

    // ─── run() ───────────────────────────────────────────────────────────────

    public function run(array $options = []): void
    {
        // 1. Create/ensure categories
        $catIds = [];
        foreach ($this->getCategories() as $cat) {
            $id = $this->ensureTerm($cat['name'], 'category', ['slug' => $cat['slug']]);
            if ($id) {
                $catIds[$cat['slug']] = $id;
            }
        }

        // 2. Create posts
        foreach ($this->getPostMatrix() as $catSlug => $posts) {
            $catId = $catIds[$catSlug] ?? null;
            if (!$catId) {
                continue;
            }

            foreach ($posts as $postDef) {
                $title = $postDef['title'];

                $postData = [
                    'post_title'    => $title,
                    'post_content'  => $this->buildContent($title),
                    'post_status'   => 'publish',
                    'post_author'   => 1,
                    'post_category' => [$catId],
                    'post_type'     => 'post',
                ];

                $postId = $this->ensurePost($postData);

                if ($postId && !empty($postDef['featured'])) {
                    update_post_meta($postId, '_jankx_featured_post', 'yes');
                    $this->log(sprintf('  Marked featured : ID %d', $postId));
                }
            }
        }
    }

    // ─── rollback() ──────────────────────────────────────────────────────────

    // Inherited from AbstractSeeder — deletes all created posts & terms.

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function buildContent(string $title): string
    {
        return sprintf(
            "Đây là bài viết về <strong>%s</strong>.\n\n%s\n\n%s",
            esc_html($title),
            $this->loremIpsum(2),
            'Jankx Framework giúp việc hiển thị dữ liệu này trở nên vô cùng linh hoạt và mạnh mẽ với các block layout động.'
        );
    }
}
