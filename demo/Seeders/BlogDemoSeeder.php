<?php

namespace Jankx\Demo\Seeders;

use Jankx\Foundation\Cli\Seeders\AbstractSeeder;

/**
 * Blog Demo Data Seeder
 *
 * Seeds a general-purpose blog/magazine demo dataset including
 * categories, tags, sample articles across multiple topics.
 *
 * Run with: wp jankx seed run blog-demo
 *
 * @package Jankx\Foundation\Cli\Seeders\Demo
 * @since 2.1.0
 */
class BlogDemoSeeder extends AbstractSeeder
{
    public static function getName(): string
    {
        return 'blog-demo';
    }

    public static function getDescription(): string
    {
        return 'General blog / magazine demo data (categories, tags, articles).';
    }

    public static function getGroup(): string
    {
        return 'blog';
    }

    public function count(): int
    {
        return 4 + 6 + 12; // categories + tags + posts
    }

    private function getCategories(): array
    {
        return [
            ['name' => 'Lifestyle',   'slug' => 'lifestyle'],
            ['name' => 'Travel',      'slug' => 'travel'],
            ['name' => 'Food',        'slug' => 'food'],
            ['name' => 'Technology',  'slug' => 'technology'],
        ];
    }

    private function getTags(): array
    {
        return ['tips', 'review', 'how-to', 'guide', 'inspiration', 'trending'];
    }

    private function getPostMatrix(): array
    {
        return [
            'lifestyle' => [
                ['title' => '10 Morning Habits That Will Transform Your Day'],
                ['title' => 'Minimalism: Living More With Less'],
                ['title' => 'The Art of Digital Detox in 2024'],
            ],
            'travel' => [
                ['title' => 'Hidden Gems of Southeast Asia You Must Visit'],
                ['title' => 'Budget Travel Tips for Solo Adventurers'],
                ['title' => 'A Complete Guide to Street Food in Vietnam'],
            ],
            'food' => [
                ['title' => 'Mastering the Art of Vietnamese Pho at Home'],
                ['title' => 'Plant-Based Cooking: Delicious and Sustainable'],
                ['title' => 'The World\'s Best Coffee Regions — A Deep Dive'],
            ],
            'technology' => [
                ['title' => 'AI Tools That Are Changing Creative Work'],
                ['title' => 'Why Open Source Matters More Than Ever'],
                ['title' => 'Privacy in the Digital Age: A Practical Guide'],
            ],
        ];
    }

    public function run(array $options = []): void
    {
        // Tags
        $tagIds = [];
        foreach ($this->getTags() as $tag) {
            $id = $this->ensureTerm($tag, 'post_tag');
            if ($id) {
                $tagIds[] = $id;
            }
        }

        // Categories
        $catIds = [];
        foreach ($this->getCategories() as $cat) {
            $id = $this->ensureTerm($cat['name'], 'category', ['slug' => $cat['slug']]);
            if ($id) {
                $catIds[$cat['slug']] = $id;
            }
        }

        // Posts
        foreach ($this->getPostMatrix() as $catSlug => $posts) {
            $catId = $catIds[$catSlug] ?? null;
            if (!$catId) {
                continue;
            }

            foreach ($posts as $postDef) {
                $title = $postDef['title'];
                $postId = $this->ensurePost([
                    'post_title'    => $title,
                    'post_content'  => $this->loremIpsum(3),
                    'post_status'   => 'publish',
                    'post_author'   => 1,
                    'post_category' => [$catId],
                    'tags_input'    => array_rand(array_flip($this->getTags()), 2),
                    'post_type'     => 'post',
                ]);

                if ($postId) {
                    // Attach a couple of random sample metadata
                    update_post_meta($postId, '_jankx_read_time', rand(3, 12) . ' min');
                }
            }
        }
    }
}
