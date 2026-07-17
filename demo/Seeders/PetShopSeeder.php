<?php

namespace Jankx\Demo\Seeders;

use Jankx\Foundation\Cli\Seeders\AbstractSeeder;

/**
 * Pet Shop Demo Data Seeder
 *
 * Seeds an ecommerce demo dataset specifically tailored for a pet shop,
 * including product categories (dogs, cats, birds) and sample WooCommerce products.
 *
 * Run with: wp jankx seed run pet-shop
 *
 * @package Jankx\Foundation\Cli\Seeders\Demo
 * @since 2.1.0
 */
class PetShopSeeder extends AbstractSeeder
{
    public static function getName(): string
    {
        return 'pet-shop';
    }

    public static function getDescription(): string
    {
        return 'Pet shop ecommerce demo data (requires WooCommerce).';
    }

    public static function getGroup(): string
    {
        return 'ecommerce';
    }

    public function count(): int
    {
        return 4 + 10; // 4 product categories + 10 simple products
    }

    private function getProductCategories(): array
    {
        return [
            ['name' => 'Dogs', 'slug' => 'dogs'],
            ['name' => 'Cats', 'slug' => 'cats'],
            ['name' => 'Birds', 'slug' => 'birds'],
            ['name' => 'Accessories', 'slug' => 'accessories'],
        ];
    }

    private function getProducts(): array
    {
        return [
            'dogs' => [
                ['title' => 'Premium Dog Food 10kg', 'price' => '45.00'],
                ['title' => 'Tough Rubber Chew Toy', 'price' => '12.50'],
                ['title' => 'Orthopedic Dog Bed', 'price' => '89.90'],
            ],
            'cats' => [
                ['title' => 'Grain-Free Cat Kibble', 'price' => '35.00'],
                ['title' => 'Interactive Laser Pointer', 'price' => '8.00'],
                ['title' => 'Multi-Level Cat Tree', 'price' => '120.00'],
            ],
            'birds' => [
                ['title' => 'Mixed Seed Blend 5kg', 'price' => '18.00'],
                ['title' => 'Bird Cage with Stand', 'price' => '150.00'],
            ],
            'accessories' => [
                ['title' => 'Adjustable Nylon Collar', 'price' => '15.00'],
                ['title' => 'Retractable Leash 5m', 'price' => '22.00'],
            ]
        ];
    }

    public function run(array $options = []): void
    {
        if (!class_exists('WooCommerce')) {
            $this->warn('WooCommerce is not active. The pet-shop seeder requires WooCommerce.');
            return;
        }

        // 1. Create Product Categories
        $catIds = [];
        foreach ($this->getProductCategories() as $cat) {
            $id = $this->ensureTerm($cat['name'], 'product_cat', ['slug' => $cat['slug']]);
            if ($id) {
                $catIds[$cat['slug']] = $id;
            }
        }

        // 2. Create Products
        foreach ($this->getProducts() as $catSlug => $products) {
            $catId = $catIds[$catSlug] ?? null;
            if (!$catId) {
                continue;
            }

            foreach ($products as $productDef) {
                $postId = $this->ensurePost([
                    'post_title'   => $productDef['title'],
                    'post_content' => $this->loremIpsum(1),
                    'post_status'  => 'publish',
                    'post_type'    => 'product',
                    'post_author'  => 1,
                ]);

                if ($postId) {
                    // Assign category
                    wp_set_object_terms($postId, [$catId], 'product_cat');

                    // Set standard product metadata (simple product)
                    update_post_meta($postId, '_visibility', 'visible');
                    update_post_meta($postId, '_stock_status', 'instock');
                    update_post_meta($postId, '_regular_price', $productDef['price']);
                    update_post_meta($postId, '_price', $productDef['price']);
                    update_post_meta($postId, '_sku', 'PET-' . wp_generate_password(6, false));

                    $this->log(sprintf('  Product set price : $%s', $productDef['price']));
                }
            }
        }
    }
}
