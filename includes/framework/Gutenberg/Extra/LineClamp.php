<?php

namespace Jankx\Gutenberg\Extra;

/**
 * Class LineClamp
 *
 * Handles the server-side registration of the line-clamp attribute for specific blocks.
 */
class LineClamp extends AbstractBlockExtra
{
    /**
     * @var string[]
     */
    protected $supportedBlocks = [
        'core/post-title',
        'woocommerce/product-title',
        'core/heading',
    ];

    /**
     * @inheritDoc
     */
    public function getTargetBlockName(): string
    {
        return 'global'; // This is not a single block, so we use a custom handling
    }

    /**
     * @inheritDoc
     */
    public function register(): void
    {
        add_filter('register_block_type_args', [$this, 'registerLineClampAttribute'], 10, 2);
    }

    /**
     * Register the line-clamp attribute for supported blocks on the server side.
     *
     * @param array  $args
     * @param string $block_name
     * @return array
     */
    public function registerLineClampAttribute(array $args, string $block_name): array
    {
        if (in_array($block_name, $this->supportedBlocks)) {
            if (!isset($args['attributes'])) {
                $args['attributes'] = [];
            }
            $args['attributes']['jankxLineClamp'] = [
                'type' => 'number',
            ];
            $args['attributes']['jankxLineClampTablet'] = [
                'type' => 'number',
            ];
            $args['attributes']['jankxLineClampMobile'] = [
                'type' => 'number',
            ];
        }
        return $args;
    }

    /**
     * This method is part of AbstractBlockExtra but we don't need it 
     * for global registration. We implement it to satisfy the interface.
     */
    public function handle(string $block_content, array $block): string
    {
        return $block_content;
    }
}
