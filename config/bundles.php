<?php

return [
    'business' => [
        'name' => 'Business Site',
        'description' => 'Complete corporate website with services showcase, portfolio, team section, and contact form. Perfect for small to medium businesses.',
        'preview' => 'https://jankx.com/previews/business.jpg',
        'thumbnail' => 'demo/previews/business.jpg',
        'tags' => ['business', 'corporate', 'services'],
        'required_extensions' => [
            'jankx-ux',
            'jankx-dashboard',
        ],
        'required_plugins' => [
            'contact-form-7',
        ],
        'demo_package' => 'business',
        'theme_options_preset' => 'business',
        'page_setup' => [
            'homepage' => 'home',
            'blog' => 'blog',
            'menu_location' => [
                'primary' => 'Main Menu',
            ],
        ],
    ],
    'shop' => [
        'name' => 'Online Store',
        'description' => 'Full WooCommerce store with product catalog, cart, checkout, and shop pages. Ready to sell online.',
        'preview' => 'https://jankx.com/previews/shop.jpg',
        'thumbnail' => 'demo/previews/shop.jpg',
        'tags' => ['woocommerce', 'shop', 'ecommerce'],
        'required_extensions' => [
            'jankx-ux',
            'jankx-dashboard',
            'jankx-woocommerce',
        ],
        'required_plugins' => [
            'woocommerce',
        ],
        'demo_package' => 'shop',
        'theme_options_preset' => 'shop',
        'page_setup' => [
            'homepage' => 'shop',
            'blog' => 'blog',
            'menu_location' => [
                'primary' => 'Main Menu',
            ],
        ],
    ],
    'blog-magazine' => [
        'name' => 'Blog & Magazine',
        'description' => 'Modern blog and magazine layout with featured posts, categories, and newsletter integration.',
        'preview' => 'https://jankx.com/previews/blog-magazine.jpg',
        'thumbnail' => 'demo/previews/blog-magazine.jpg',
        'tags' => ['blog', 'magazine', 'news'],
        'required_extensions' => [
            'jankx-ux',
            'jankx-dashboard',
        ],
        'required_plugins' => [],
        'demo_package' => 'blog-magazine',
        'theme_options_preset' => 'blog-magazine',
        'page_setup' => [
            'homepage' => 'home',
            'blog' => 'blog',
            'menu_location' => [
                'primary' => 'Main Menu',
            ],
        ],
    ],
    'portfolio' => [
        'name' => 'Portfolio',
        'description' => 'Creative portfolio for designers, photographers, and agencies. Showcase your work with style.',
        'preview' => 'https://jankx.com/previews/portfolio.jpg',
        'thumbnail' => 'demo/previews/portfolio.jpg',
        'tags' => ['portfolio', 'creative', 'agency'],
        'required_extensions' => [
            'jankx-ux',
            'jankx-dashboard',
        ],
        'required_plugins' => [],
        'demo_package' => 'portfolio',
        'theme_options_preset' => 'portfolio',
        'page_setup' => [
            'homepage' => 'home',
            'blog' => 'blog',
            'menu_location' => [
                'primary' => 'Main Menu',
            ],
        ],
    ],
];
