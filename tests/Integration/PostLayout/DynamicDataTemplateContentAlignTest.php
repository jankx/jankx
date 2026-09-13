<?php

namespace Tests\Integration\PostLayout;

if (!class_exists('WP_Post')) {
    class DummyWPPost
    {
        public $ID;
        public $post_title;
        public $post_content;
        public $post_type = 'post';

        public function __construct($post = null)
        {
            if (is_object($post)) {
                foreach (get_object_vars($post) as $k => $v) {
                    $this->$k = $v;
                }
            }
        }
    }
    class_alias(DummyWPPost::class, 'WP_Post');
}

if (!class_exists('WP_Query')) {
    class DummyWPQuery
    {
        public function have_posts()
        {
            return false;
        }
        public function the_post()
        {
        }
    }
    class_alias(DummyWPQuery::class, 'WP_Query');
}

if (!function_exists('wp_reset_postdata')) {
    function wp_reset_postdata()
    {
    }
}

use Tests\Helpers\TestCase;
use Jankx\Layouts\DynamicDataLayout\Generators\PostTemplateBlockGenerator;
use Jankx\Gutenberg\Blocks\DynamicDataTemplateBlock;

class DynamicDataTemplateContentAlignTest extends TestCase
{
    public function testBuildTemplateItemBackgroundStyleAlignBottom()
    {
        $templateBlock = [
            'blockName' => 'jankx/dynamic-data-template',
            'attrs' => [
                'itemBgType' => 'image',
                'itemBgImageUrl' => 'https://example.com/image.jpg',
                'itemBgContentAlign' => 'bottom',
            ],
            'innerBlocks' => [],
        ];

        $generator = new PostTemplateBlockGenerator($templateBlock);
        $reflection = new \ReflectionClass($generator);
        $method = $reflection->getMethod('buildTemplateItemBackgroundStyle');
        $method->setAccessible(true);

        $style = $method->invoke($generator, $templateBlock['attrs'], null);

        $this->assertStringContainsString('background-image: url(https://example.com/image.jpg)', $style);
        $this->assertStringContainsString('display: flex', $style);
        $this->assertStringContainsString('flex-direction: column', $style);
        $this->assertStringContainsString('justify-content: flex-end', $style);
    }

    public function testBuildTemplateItemBackgroundStyleAlignCenterAndTop()
    {
        $templateBlockCenter = [
            'blockName' => 'jankx/dynamic-data-template',
            'attrs' => [
                'itemBgType' => 'color',
                'itemBgColor' => '#123456',
                'itemBgContentAlign' => 'center',
            ],
        ];

        $generatorCenter = new PostTemplateBlockGenerator($templateBlockCenter);
        $reflectionCenter = new \ReflectionClass($generatorCenter);
        $methodCenter = $reflectionCenter->getMethod('buildTemplateItemBackgroundStyle');
        $methodCenter->setAccessible(true);

        $styleCenter = $methodCenter->invoke($generatorCenter, $templateBlockCenter['attrs'], null);
        $this->assertStringContainsString('justify-content: center', $styleCenter);

        $templateBlockTop = [
            'blockName' => 'jankx/dynamic-data-template',
            'attrs' => [
                'itemBgType' => 'image',
                'itemBgContentAlign' => 'top',
            ],
        ];

        $generatorTop = new PostTemplateBlockGenerator($templateBlockTop);
        $reflectionTop = new \ReflectionClass($generatorTop);
        $methodTop = $reflectionTop->getMethod('buildTemplateItemBackgroundStyle');
        $methodTop->setAccessible(true);

        $styleTop = $methodTop->invoke($generatorTop, $templateBlockTop['attrs'], null);
        $this->assertStringContainsString('justify-content: flex-start', $styleTop);
    }

    public function testBuildPostItemRatioStylesIncludesJustifyContent()
    {
        $templateBlock = [
            'blockName' => 'jankx/dynamic-data-template',
            'attrs' => [
                'itemBgType' => 'image',
                'itemBgRatio' => [
                    'desktop' => '16:9',
                    'mobile' => '1:1',
                ],
                'itemBgContentAlign' => 'bottom',
            ],
        ];

        $generator = new PostTemplateBlockGenerator($templateBlock);
        $reflection = new \ReflectionClass($generator);
        $method = $reflection->getMethod('buildPostItemRatioStyles');
        $method->setAccessible(true);

        $css = $method->invoke($generator, $templateBlock['attrs'], '.my-selector');

        $this->assertStringContainsString('aspect-ratio: 16/9', $css);
        $this->assertStringContainsString('display: flex', $css);
        $this->assertStringContainsString('flex-direction: column', $css);
        $this->assertStringContainsString('justify-content: flex-end', $css);
    }

    public function testBuildTemplateItemClassesForItem()
    {
        $templateBlock = [
            'blockName' => 'jankx/dynamic-data-template',
            'attrs' => [
                'itemBgType' => 'image',
                'itemBgContentAlign' => 'bottom',
            ],
        ];

        $generator = new PostTemplateBlockGenerator($templateBlock);
        $reflection = new \ReflectionClass($generator);
        $method = $reflection->getMethod('buildTemplateItemClassesForItem');
        $method->setAccessible(true);

        $classes = $method->invoke($generator, $templateBlock['attrs']);

        $this->assertStringContainsString('has-item-bg', $classes);
        $this->assertStringContainsString('item-bg-type-image', $classes);
        $this->assertStringContainsString('item-bg-align-bottom', $classes);
    }

    public function testDynamicDataTemplateBlockRenderOutputsDataAttributes()
    {
        $blockPath = dirname(__DIR__, 3) . '/resources/blocks/dynamic-data-template';
        $block = new DynamicDataTemplateBlock($blockPath);

        $attributes = [
            'itemBgType' => 'image',
            'itemBgContentAlign' => 'bottom',
        ];

        $html = $block->render($attributes, '');

        $this->assertStringContainsString('data-item-bg-content-align="bottom"', $html);
        $this->assertStringContainsString('data-item-bg-type="image"', $html);
    }

    public function testRenderPostsOutputsAlignmentAndAttributes()
    {
        $templateBlock = [
            'blockName' => 'jankx/dynamic-data-template',
            'attrs' => [
                'itemBgType' => 'image',
                'itemBgContentAlign' => 'bottom',
            ],
            'innerBlocks' => [],
        ];

        $generator = $this->getMockBuilder(PostTemplateBlockGenerator::class)
            ->setConstructorArgs([$templateBlock])
            ->onlyMethods(['renderTemplateForPost', 'buildItemClasses'])
            ->getMock();

        $dummyPost = new \WP_Post(new \stdClass());
        $dummyPost->ID = 999;

        $generator->method('renderTemplateForPost')->willReturn('<span>Mock Content</span>');
        $generator->method('buildItemClasses')->willReturn('dynamic-data-template__item wp-block-post');

        $query = $this->createMock(\WP_Query::class);
        $query->expects($this->exactly(2))
            ->method('have_posts')
            ->willReturnOnConsecutiveCalls(true, false);
        $query->method('the_post')->willReturnCallback(function () use ($dummyPost) {
            $GLOBALS['post'] = $dummyPost;
        });

        $reflection = new \ReflectionClass(PostTemplateBlockGenerator::class);
        $method = $reflection->getMethod('renderPosts');
        $method->setAccessible(true);

        $html = $method->invoke($generator, $query, []);

        $this->assertStringContainsString('data-item-bg-content-align="bottom"', $html);
        $this->assertStringContainsString('data-item-bg-type="image"', $html);
        $this->assertStringContainsString('item-bg-align-bottom', $html);
        $this->assertStringContainsString('has-item-bg', $html);
        $this->assertStringContainsString('justify-content: flex-end', $html);
        $this->assertStringContainsString('<span>Mock Content</span>', $html);
    }
}
